import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(buffer: Buffer, filename: string) {
  return new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "clothing-store",
            public_id: filename.replace(/\.[^.]+$/, ""),
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload failed"));
              return;
            }
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        )
        .end(buffer);
    }
  );
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

/** Extract Cloudinary public_id from a secure_url, if possible. */
export function publicIdFromUrl(url: string): string | null {
  const match = url.match(/\/clothing-store\/([^./]+)/);
  return match ? `clothing-store/${match[1]}` : null;
}
