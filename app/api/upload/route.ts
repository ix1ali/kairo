import { fail, json, requireUser } from "@/lib/api";
import { uid } from "@/lib/db";
import { putPublicFile, StorageUnavailableError } from "@/lib/storage";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const form = await req.formData().catch(() => null);
  if (!form) return fail("Expected multipart form data.");
  const file = form.get("file");
  if (!(file instanceof File)) return fail("No file received.");
  if (!ALLOWED.includes(file.type)) return fail("Use a PNG, JPG, WEBP, GIF or SVG.");
  if (file.size > MAX_BYTES) return fail("Files must be under 8MB.");

  const ext =
    file.type === "image/svg+xml" ? "svg" : file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const name = `up_${uid()}.${ext}`;
  try {
    const url = await putPublicFile(name, Buffer.from(await file.arrayBuffer()));
    return json({ url }, 201);
  } catch (err: unknown) {
    if (err instanceof StorageUnavailableError) return fail(err.message, 503);
    throw err;
  }
}
