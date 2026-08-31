import { fail, json, requireUser } from "@/lib/api";
import { mutateForUser, readForUser, uid } from "@/lib/db";
import { CREDIT_PACKS, PACKAGES } from "@/lib/plans";
import type { PackageId } from "@/lib/types";

/**
 * Demo billing. Swap this route for a Stripe Checkout session and fulfil on the
 * webhook — the rest of the app already reads packageId / credits from the user.
 */
export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));

  if (body.kind === "subscription") {
    const pkg = PACKAGES.find((p) => p.id === body.packageId);
    if (!pkg) return fail("Unknown package.");
    const renews = new Date();
    renews.setMonth(renews.getMonth() + 1);

    await mutateForUser(auth.user.id, (d) => {
      const u = d.users.find((x) => x.id === auth.user.id)!;
      const isNew = u.packageId !== pkg.id;
      u.packageId = pkg.id as PackageId;
      u.subscriptionStatus = "active";
      u.renewsAt = renews.toISOString();
      if (isNew) u.credits += pkg.credits;
      u.onboarded = true;
      d.transactions.push({
        id: uid("txn"),
        userId: u.id,
        kind: "subscription",
        label: `${pkg.name} plan`,
        amount: pkg.price,
        credits: isNew ? pkg.credits : 0,
        createdAt: new Date().toISOString(),
      });
    });

    const user = (await readForUser(auth.user.id)).users.find((u) => u.id === auth.user.id)!;
    return json({ ok: true, packageId: user.packageId, credits: user.credits });
  }

  if (body.kind === "credits") {
    const pack = CREDIT_PACKS.find((p) => p.id === body.packId);
    if (!pack) return fail("Unknown credit pack.");
    await mutateForUser(auth.user.id, (d) => {
      const u = d.users.find((x) => x.id === auth.user.id)!;
      u.credits += pack.credits;
      d.transactions.push({
        id: uid("txn"),
        userId: u.id,
        kind: "credits",
        label: `${pack.credits} credits`,
        amount: pack.price,
        credits: pack.credits,
        createdAt: new Date().toISOString(),
      });
    });
    const user = (await readForUser(auth.user.id)).users.find((u) => u.id === auth.user.id)!;
    return json({ ok: true, credits: user.credits });
  }

  if (body.kind === "cancel") {
    await mutateForUser(auth.user.id, (d) => {
      const u = d.users.find((x) => x.id === auth.user.id)!;
      u.subscriptionStatus = "cancelled";
    });
    return json({ ok: true });
  }

  return fail("Unknown billing action.");
}
