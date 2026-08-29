import { publicUser, setSession, verifyPassword } from "@/lib/auth";
import { read } from "@/lib/db";
import { fail, json } from "@/lib/api";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const db = read();
  const user = db.users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
    return fail("Email or password is incorrect.", 401);
  }

  await setSession(user.id);
  return json({ user: publicUser(user) });
}
