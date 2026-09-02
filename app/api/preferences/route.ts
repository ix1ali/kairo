import { json, requireUser } from "@/lib/api";
import { mutateForUser } from "@/lib/db";
import { sanitisePreferences } from "@/lib/preferences";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

/** Stores account defaults. Everything is narrowed before it is written. */
export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => ({}));
  const prefs = sanitisePreferences(body);

  await mutateForUser(auth.user.id, (d) => {
    const u = d.users.find((x) => x.id === auth.user.id);
    if (u) u.preferences = prefs;
  });

  return json({ ok: true, preferences: prefs });
}
