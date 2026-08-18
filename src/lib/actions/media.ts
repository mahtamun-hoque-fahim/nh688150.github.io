"use server";

import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { mediaAsset } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

export async function uploadMedia(formData: FormData) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not signed in." };

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File is too large (10MB max)." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Unsupported file type. Use PNG, JPEG, WebP, GIF, or SVG." };
  }

  const altText = (formData.get("altText") as string) || null;

  let uploaded;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    uploaded = await uploadImage(buffer);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }

  await db.insert(mediaAsset).values({
    id: randomUUID(),
    url: uploaded.url,
    cloudinaryPublicId: uploaded.publicId,
    altText,
    width: uploaded.width,
    height: uploaded.height,
    createdByUserId: session.user.id,
  });

  revalidatePath("/studio/media");
  return { success: true };
}

export async function listMedia() {
  const db = getDb();
  if (!db) return [];

  return db.select().from(mediaAsset).orderBy(desc(mediaAsset.createdAt));
}

export async function deleteMedia(id: string) {
  const db = getDb();
  if (!db) return { error: "Database not configured yet." };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not signed in." };

  const [asset] = await db.select().from(mediaAsset).where(eq(mediaAsset.id, id)).limit(1);
  if (!asset) return { error: "Asset not found." };

  try {
    await deleteImage(asset.cloudinaryPublicId);
  } catch (err) {
    // If Cloudinary deletion fails, still remove the DB row rather than
    // leaving a permanently-broken reference the dashboard can't clear.
    console.error("Cloudinary delete failed:", err);
  }

  await db.delete(mediaAsset).where(eq(mediaAsset.id, id));

  revalidatePath("/studio/media");
  return { success: true };
}
