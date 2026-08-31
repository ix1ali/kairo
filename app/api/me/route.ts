import { json, requireUser } from "@/lib/api";
import { publicUser } from "@/lib/auth";
import { readForUser } from "@/lib/db";
import { providerStatus } from "@/lib/ai";

export async function GET() {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const db = await readForUser(auth.user.id);
  return json({
    user: publicUser(auth.user),
    projectCount: db.projects.filter((p) => p.userId === auth.user.id).length,
    transactions: db.transactions.filter((t) => t.userId === auth.user.id).slice(-20).reverse(),
    providers: providerStatus(),
  });
}
