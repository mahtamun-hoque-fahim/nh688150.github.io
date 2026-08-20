"use server";

import { eq, and, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { pageSection, mediaAsset } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { SECTION_SCHEMAS, type SectionRegistryKey } from "@/lib/content-schemas";
import { type PageGroup } from "@/lib/studio-pages";

export async function getSectionsForPage(page: PageGroup) {
  const db = getDb();
  if (!db) return [];

  const keys = (Object.keys(SECTION_SCHEMAS) as SectionRegistryKey[]).filter(
    (key) => key.split(":")[0] === page,
  );

  const rows = await db.select().from(pageSection).where(eq(pageSection.page, page));
  const rowByKey = new Map(rows.map((r) => [r.sectionKey, r]));

  const backgroundIds = rows
    .map((r) => r.backgroundMediaId)
    .filter((id): id is string => Boolean(id));

  const mediaRows = backgroundIds.length
    ? await db.select().from(mediaAsset).where(inArray(mediaAsset.id, backgroundIds))
    : [];
  const mediaById = new Map(mediaRows.map((m) => [m.id, m.url]));

  return keys.map((key) => {
    const sectionKey = key.split(":")[1];
    const row = rowByKey.get(sectionKey);
    return {
      key,
      sectionKey,
      content: (row?.content ?? {}) as Record<string, unknown>,
      backgroundMediaId: row?.backgroundMediaId ?? null,
      backgroundUrl: row?.backgroundMediaId ? (mediaById.get(row.backgroundMediaId) ?? null) : null,
    };
  });
}

export async function updatePageSection(
  key: SectionRegistryKey,
  content: Record<string, unknown>,
  backgroundMediaId: string | null,
) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not signed in." };

  const schema = SECTION_SCHEMAS[key];
  const parsed = schema.safeParse(content);
  if (!parsed.success) {
    return { error: "Some fields are invalid. Check required fields aren't empty." };
  }

  const [page, sectionKey] = key.split(":");

  const [existing] = await db
    .select()
    .from(pageSection)
    .where(and(eq(pageSection.page, page), eq(pageSection.sectionKey, sectionKey)))
    .limit(1);

  if (existing) {
    await db
      .update(pageSection)
      .set({
        content: parsed.data,
        backgroundMediaId,
        updatedByUserId: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(pageSection.id, existing.id));
  } else {
    await db.insert(pageSection).values({
      id: randomUUID(),
      page,
      sectionKey,
      content: parsed.data,
      backgroundMediaId,
      updatedByUserId: session.user.id,
    });
  }

  revalidatePath(`/studio/pages/${page}`);
  return { success: true };
}
