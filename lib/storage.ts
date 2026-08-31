import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

/**
 * Where uploaded and generated files go.
 *
 * Locally that is public/uploads, which is simple and needs nothing running.
 * On Vercel it cannot be: the filesystem is read-only apart from /tmp, and
 * /tmp is not shared between invocations, so a logo written during signup
 * would be gone by the next request.
 *
 * Everything that writes a file goes through putPublicFile, so which of the
 * two drivers runs is decided in exactly one place. The blob driver switches
 * on BLOB_READ_WRITE_TOKEN being present, which the Vercel integration sets
 * automatically — so production picks it up without any code change.
 */

export type StorageDriver = "local" | "blob";

export function storageDriver(): StorageDriver {
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
}

/** True when the process cannot write to its own project directory. */
export function isReadOnlyFilesystem(): boolean {
  return process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
}

export class StorageUnavailableError extends Error {
  constructor(
    message = "File storage is not configured for this deployment. Provision a blob store and set BLOB_READ_WRITE_TOKEN."
  ) {
    super(message);
    this.name = "StorageUnavailableError";
  }
}

/**
 * Writes bytes and returns the URL they can be served from.
 * `name` is an already-safe filename, not a user-supplied path.
 */
export async function putPublicFile(name: string, bytes: Buffer): Promise<string> {
  if (storageDriver() === "blob") {
    try {
      // addRandomSuffix is off because callers already generate a unique id;
      // a second suffix would make the stored name unpredictable for cleanup.
      const blob = await put(`uploads/${name}`, bytes, {
        access: "public",
        addRandomSuffix: false,
        contentType: contentTypeFor(name),
      });
      return blob.url;
    } catch (err) {
      throw new StorageUnavailableError(
        `Blob upload failed: ${err instanceof Error ? err.message : "unknown error"}`
      );
    }
  }

  if (isReadOnlyFilesystem()) throw new StorageUnavailableError();

  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

function contentTypeFor(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return TYPES[ext] || "application/octet-stream";
}
