"use server";

import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { invite, user } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { sendAdminInviteEmail } from "@/lib/email";

const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createInvite(email: string) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not signed in." };

  const token = randomUUID();
  const id = randomUUID();

  await db.insert(invite).values({
    id,
    email,
    token,
    invitedByUserId: session.user.id,
    status: "pending",
    expiresAt: new Date(Date.now() + INVITE_EXPIRY_MS),
  });

  const url = `${process.env.BETTER_AUTH_URL}/studio/accept-invite/${token}`;
  await sendAdminInviteEmail(email, session.user.name, url);

  return { success: true };
}

export async function getInviteByToken(token: string) {
  const db = getDb();
  if (!db) return null;

  const [row] = await db.select().from(invite).where(eq(invite.token, token)).limit(1);
  if (!row) return null;
  if (row.status !== "pending") return null;
  if (row.expiresAt.getTime() < Date.now()) return null;

  return row;
}

export async function listInvites() {
  const db = getDb();
  if (!db) return [];

  return db.select().from(invite).orderBy(desc(invite.createdAt));
}

export async function listAdmins() {
  const db = getDb();
  if (!db) return [];

  return db.select().from(user).orderBy(desc(user.createdAt));
}

export async function acceptInvite(token: string, name: string, password: string) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const inviteRow = await getInviteByToken(token);
  if (!inviteRow) {
    return { error: "This invite link is invalid or has expired." };
  }

  try {
    await auth.api.createUser({
      body: {
        email: inviteRow.email,
        password,
        name,
        role: "admin",
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't create the account." };
  }

  await db.update(invite).set({ status: "accepted" }).where(eq(invite.id, inviteRow.id));

  return { success: true };
}
