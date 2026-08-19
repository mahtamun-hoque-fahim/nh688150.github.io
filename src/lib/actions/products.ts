"use server";

import { randomUUID } from "crypto";
import { eq, asc, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { product, productModule, productScreenshot, mediaAsset } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not signed in.");
  return session;
}

export async function listProducts() {
  const db = getDb();
  if (!db) return [];
  return db.select().from(product).orderBy(asc(product.order), asc(product.createdAt));
}

export async function getProduct(id: string) {
  const db = getDb();
  if (!db) return null;

  const [row] = await db.select().from(product).where(eq(product.id, id)).limit(1);
  if (!row) return null;

  const modules = await db
    .select()
    .from(productModule)
    .where(eq(productModule.productId, id))
    .orderBy(asc(productModule.order));

  const screenshotRows = await db
    .select()
    .from(productScreenshot)
    .where(eq(productScreenshot.productId, id))
    .orderBy(asc(productScreenshot.order));

  // Batch-fetch every media asset this product references (logo, three
  // background slots, every screenshot) in one query rather than N+1.
  const mediaIds = [
    row.logoMediaId,
    row.listingImageMediaId,
    row.heroBackgroundMediaId,
    row.contentBackgroundMediaId,
    ...screenshotRows.map((s) => s.mediaId),
  ].filter((id): id is string => Boolean(id));

  const mediaRows = mediaIds.length
    ? await db.select().from(mediaAsset).where(inArray(mediaAsset.id, mediaIds))
    : [];
  const mediaUrlById = new Map(mediaRows.map((m) => [m.id, m.url]));

  const screenshots = screenshotRows.map((s) => ({
    ...s,
    url: mediaUrlById.get(s.mediaId) ?? "",
  }));

  return {
    ...row,
    logoUrl: row.logoMediaId ? (mediaUrlById.get(row.logoMediaId) ?? null) : null,
    listingImageUrl: row.listingImageMediaId
      ? (mediaUrlById.get(row.listingImageMediaId) ?? null)
      : null,
    heroBackgroundUrl: row.heroBackgroundMediaId
      ? (mediaUrlById.get(row.heroBackgroundMediaId) ?? null)
      : null,
    contentBackgroundUrl: row.contentBackgroundMediaId
      ? (mediaUrlById.get(row.contentBackgroundMediaId) ?? null)
      : null,
    modules,
    screenshots,
  };
}

export async function createProduct(slug: string, name: string) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  try {
    await requireSession();
  } catch {
    return { error: "Not signed in." };
  }

  const normalizedSlug = slug.trim().toLowerCase();
  if (!SLUG_PATTERN.test(normalizedSlug)) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }

  const [existing] = await db
    .select()
    .from(product)
    .where(eq(product.slug, normalizedSlug))
    .limit(1);
  if (existing) {
    return { error: "That slug is already in use." };
  }

  const allProducts = await db.select().from(product);
  const id = randomUUID();

  await db.insert(product).values({
    id,
    slug: normalizedSlug,
    name: name.trim(),
    tagline: "By Falcotrix",
    published: true,
    order: allProducts.length,
    aboutParagraphs: [],
  });

  revalidatePath("/studio/products");
  return { success: true, id };
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    tagline: string;
    published: boolean;
    aboutParagraphs: string[];
    aboutTagline: string | null;
    aboutClosing: string | null;
    logoMediaId: string | null;
    listingImageMediaId: string | null;
    heroBackgroundMediaId: string | null;
    contentBackgroundMediaId: string | null;
  },
) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not signed in." };

  await db
    .update(product)
    .set({ ...data, updatedByUserId: session.user.id, updatedAt: new Date() })
    .where(eq(product.id, id));

  revalidatePath("/studio/products");
  revalidatePath(`/studio/products/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  try {
    await requireSession();
  } catch {
    return { error: "Not signed in." };
  }

  await db.delete(product).where(eq(product.id, id));
  revalidatePath("/studio/products");
  return { success: true };
}

/* --- Modules --- */

export async function addModule(productId: string, title: string, description: string) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const existing = await db
    .select()
    .from(productModule)
    .where(eq(productModule.productId, productId));

  await db.insert(productModule).values({
    id: randomUUID(),
    productId,
    title,
    description,
    order: existing.length,
  });

  revalidatePath(`/studio/products/${productId}`);
  return { success: true };
}

export async function updateModule(
  id: string,
  productId: string,
  title: string,
  description: string,
) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  await db.update(productModule).set({ title, description }).where(eq(productModule.id, id));

  revalidatePath(`/studio/products/${productId}`);
  return { success: true };
}

export async function deleteModule(id: string, productId: string) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  await db.delete(productModule).where(eq(productModule.id, id));
  revalidatePath(`/studio/products/${productId}`);
  return { success: true };
}

/* --- Screenshots --- */

export async function addScreenshot(productId: string, mediaId: string, caption: string | null) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const existing = await db
    .select()
    .from(productScreenshot)
    .where(eq(productScreenshot.productId, productId));

  await db.insert(productScreenshot).values({
    id: randomUUID(),
    productId,
    mediaId,
    caption,
    order: existing.length,
  });

  revalidatePath(`/studio/products/${productId}`);
  return { success: true };
}

export async function deleteScreenshot(id: string, productId: string) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  await db.delete(productScreenshot).where(eq(productScreenshot.id, id));
  revalidatePath(`/studio/products/${productId}`);
  return { success: true };
}
