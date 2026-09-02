import { publicUser, setSession, verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";
import { fail, json } from "@/lib/api";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const user = await getUserByEmail(String(body.email || ""));
  if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
    return fail("Email or password is incorrect.", 401);
  }

  await setSession(user.id);
  return json({ user: publicUser(user) });
}
