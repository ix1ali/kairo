import { cookies } from "next/headers";
import { fail, json } from "@/lib/api";
import { isLang, LANG_COOKIE } from "@/lib/i18n";

/** Stores the interface language. Public — it carries no account data. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!isLang(body.lang)) return fail("Unsupported language.");

  const store = await cookies();
  store.set(LANG_COOKIE, body.lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return json({ ok: true, lang: body.lang });
}
