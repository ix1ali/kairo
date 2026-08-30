import fs from "fs";
import path from "path";

/**
 * Where uploaded and generated files go.
 *
 * Locally that is public/uploads, which is simple and needs nothing running.
 * On Vercel it cannot be: the filesystem is read-only apart from /tmp, and
 * /tmp is not shared between invocations, so a logo written during signup
 * would be gone by the next request.
 *
 * Everything that writes a file goes through putPublicFile, so moving to a
 * blob store is one driver here rather than a change in four route handlers.
 * To switch: install @vercel/blob, provision a store, and fill in the branch
 * below — the call sites do not change.
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
  constructor() {
    super(
      "File storage is not configured for this deployment. Provision a blob store and set BLOB_READ_WRITE_TOKEN."
    );
    this.name = "StorageUnavailableError";
  }
}

/**
 * Writes bytes and returns the URL they can be served from.
 * `name` is a already-safe filename, not a user-supplied path.
 */
export async function putPublicFile(name: string, bytes: Buffer): Promise<string> {
  if (storageDriver() === "blob") {
    // Deliberately not implemented against a store that has not been
    // provisioned yet — guessing at an API and shipping it untested would be
    // worse than failing loudly here.
    throw new StorageUnavailableError();
  }

  if (isReadOnlyFilesystem()) throw new StorageUnavailableError();

  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
