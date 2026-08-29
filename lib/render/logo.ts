import fs from "fs";
import path from "path";

/** Inlines an uploaded logo as a data URI so exported SVGs are self-contained. */
export function logoDataUri(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  if (logoUrl.startsWith("data:")) return logoUrl;
  if (!logoUrl.startsWith("/uploads/")) return null;
  try {
    const file = path.join(process.cwd(), "public", logoUrl.replace(/^\//, ""));
    if (!fs.existsSync(file)) return null;
    const ext = path.extname(file).toLowerCase();
    const mime =
      ext === ".svg"
        ? "image/svg+xml"
        : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
        ? "image/webp"
        : "image/png";
    return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
  } catch {
    return null;
  }
}
