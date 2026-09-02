import { createUser, publicUser, setSession } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";
import { fail, isEmail, json } from "@/lib/api";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();
  const password = String(body.password || "");

  if (!name) return fail("Please enter your name.");
  if (!isEmail(email)) return fail("That email address does not look right.");
  if (password.length < 8) return fail("Password must be at least 8 characters.");

  if (await getUserByEmail(email)) {
    return fail("An account with that email already exists. Try signing in.");
  }

  const user = await createUser(email, name, password);
  await setSession(user.id);
  return json({ user: publicUser(user) }, 201);
}
