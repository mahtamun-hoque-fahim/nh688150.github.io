import { v2 as cloudinary } from "cloudinary";

let configured = false;

function getCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return null;
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export async function uploadImage(buffer: Buffer): Promise<UploadedImage> {
  const client = getCloudinary();
  if (!client) {
    throw new Error("Cloudinary is not configured — set CLOUDINARY_* env vars.");
  }

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      { folder: "falcotrix", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed with no error detail."));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      },
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string) {
  const client = getCloudinary();
  if (!client) {
    throw new Error("Cloudinary is not configured — set CLOUDINARY_* env vars.");
  }
  await client.uploader.destroy(publicId);
}
