import { fail, json, requireUser } from "@/lib/api";
import { ImportError, importProducts } from "@/lib/importer";

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => ({}));
  try {
    const result = await importProducts(String(body.url || ""), Number(body.limit) || 24);
    return json(result);
  } catch (err) {
    if (err instanceof ImportError) return fail(err.message);
    console.error("[koala:import-products]", err);
    return fail("Could not read that link. Add your products manually instead.");
  }
}
