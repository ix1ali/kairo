import { fail, json, requireUser } from "@/lib/api";
import { mutateForUser, readForUser, uid } from "@/lib/db";
import { CREDIT_PACKS, PACKAGES } from "@/lib/plans";
import { billingAvailability, billingCurrency, paymentProvider } from "@/lib/payments";
import type { PackageId } from "@/lib/types";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

/**
 * Billing actions.
 *
 * With a gateway configured, buying does not change the account here at all —
 * it returns a checkout URL and the grant happens in the webhook once the
 * signature verifies. Fulfilling on this side would mean trusting the browser,
 * which is the whole class of bug where customers get plans without paying.
 *
 * Without a gateway, the manual driver applies the change directly. That path
 * refuses to run in production, so the worst it can do is help development.
 *
 * Cancelling stays open either way: letting someone stop a subscription is
 * never the unsafe direction.
 */

/** Where Stripe should send the customer back to. */
function origin(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));

  const buying = body.kind === "subscription" || body.kind === "credits";
  if (buying) {
    const availability = billingAvailability();
    if (!availability.ok) return fail(availability.reason, 503);
  }

  const provider = paymentProvider();

  // ---------------------------------------------------------------- gateway
  if (buying && provider.id !== "manual") {
    const pkg = PACKAGES.find((p) => p.id === body.packageId);
    const pack = CREDIT_PACKS.find((p) => p.id === body.packId);

    if (body.kind === "subscription" && !pkg) return fail("Unknown package.");
    if (body.kind === "credits" && !pack) return fail("Unknown credit pack.");

    const base = origin(req);
    try {
      const session = await provider.createCheckout({
        userId: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        kind: body.kind,
        packageId: pkg?.id as PackageId | undefined,
        packId: pack?.id,
        amount: pkg?.price ?? pack?.price ?? 0,
        currency: billingCurrency(),
        successUrl: `${base}/dashboard/billing?paid=1`,
        cancelUrl: `${base}/dashboard/billing?cancelled=1`,
        webhookUrl: `${base}/api/webhooks/stripe`,
      });
      return json({ ok: true, checkoutUrl: session.url });
    } catch (err) {
      console.error("[koala:billing] checkout failed", err);
      return fail("Could not start checkout. No card was charged.", 502);
    }
  }

  // ------------------------------------------------------- manual (dev only)
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
