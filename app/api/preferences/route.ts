import { json, requireUser } from "@/lib/api";
import { mutate } from "@/lib/db";
import { sanitisePreferences } from "@/lib/preferences";

/** Stores account defaults. Everything is narrowed before it is written. */
export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => ({}));
  const prefs = sanitisePreferences(body);

  await mutate((d) => {
    const u = d.users.find((x) => x.id === auth.user.id);
    if (u) u.preferences = prefs;
  });

  return json({ ok: true, preferences: prefs });
}
