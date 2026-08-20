"use server";

import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { contactMessage } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { sendContactNotificationEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(1).max(300),
  time: z.string().trim().max(200).optional(),
  details: z.string().trim().min(1).max(5000),
});

// Very small in-memory rate limit — best-effort only, resets on redeploy/
// cold start. Good enough to blunt casual spam without adding Upstash Redis
// for a single low-traffic form; revisit if abuse becomes a real problem.
const submissionTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionTimestamps.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  submissionTimestamps.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function submitContactMessage(formData: {
  name: string;
  email: string;
  subject: string;
  time: string;
  details: string;
}) {
  const db = getDb();
  if (!db) return { error: "Something went wrong. Try again shortly." };

  const parsed = contactSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: "Check that every required field is filled in correctly." };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return { error: "Too many messages sent recently. Try again in a few minutes." };
  }

  const { name, email, subject, time, details } = parsed.data;

  await db.insert(contactMessage).values({
    id: randomUUID(),
    name,
    email,
    subject,
    time: time || null,
    details,
    status: "new",
  });

  // Best-effort — a failed notification email shouldn't fail the
  // submission itself, the message is already safely in the DB either way.
  try {
    await sendContactNotificationEmail(name, email, subject, details);
  } catch {
    // swallow — message is saved, notification is a nice-to-have
  }

  revalidatePath("/studio/contact");
  return { success: true };
}

/* --- Studio inbox --- */

export async function listContactMessages() {
  const db = getDb();
  if (!db) return [];
  return db.select().from(contactMessage).orderBy(desc(contactMessage.createdAt));
}

export async function updateContactMessageStatus(
  id: string,
  status: "new" | "read" | "archived",
) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not signed in." };

  await db.update(contactMessage).set({ status }).where(eq(contactMessage.id, id));
  revalidatePath("/studio/contact");
  return { success: true };
}
