import fs from "fs";
import path from "path";
import { fail, json, requireUser } from "@/lib/api";
import { uid } from "@/lib/db";

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
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return json({ url: `/uploads/${name}` }, 201);
}
