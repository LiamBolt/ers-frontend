import { v2 as cloudinary } from "cloudinary";
import { httpError } from "../utils/http";

// Reads CLOUDINARY_URL (cloudinary://key:secret@cloud) from the environment.
cloudinary.config({ secure: true });

export function uploadBuffer(buffer: Buffer, folder = "ers/cvs", filename?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto", use_filename: !!filename, public_id: filename },
      (error, result) => {
        if (error || !result) {
          // Cloudinary rejects with a plain object, not an Error.
          return reject(httpError(502, `File upload failed: ${error?.message ?? "unknown error"}`));
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
