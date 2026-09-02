import { json, requireUser } from "@/lib/api";
import { publicUser } from "@/lib/auth";
import { readForUser } from "@/lib/db";
import { providerStatus } from "@/lib/ai";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

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
