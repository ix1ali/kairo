import { mutateForUser, uid } from "../db";
import { CREDIT_PACKS, PACKAGES } from "../plans";
import type { PackageId } from "../types";
import type { PaymentEvent } from "./types";

/**
 * Applies a verified payment to an account.
 *
 * This is the only place a plan or credits are granted. It runs from the
 * webhook and nowhere else: a customer landing on the success URL has not
 * proved they paid, they have proved they can visit a URL.
 *
 * Idempotency is the other half. Stripe retries until it receives a 2xx, so
 * the same event can arrive several times — including after a deploy that
 * happened mid-delivery. Every grant is recorded with the gateway event id and
 * a repeat is a no-op.
 */

export type FulfilResult =
  | { applied: true; credits: number }
  | { applied: false; reason: string };

export async function fulfil(event: PaymentEvent): Promise<FulfilResult> {
  if (event.status === "ignored") return { applied: false, reason: "Event not actionable." };
  if (!event.userId) return { applied: false, reason: "Event carried no account." };

  if (event.status === "failed") {
    await mutateForUser(event.userId, (d) => {
      const u = d.users.find((x) => x.id === event.userId);
      if (u) u.subscriptionStatus = "cancelled";
    });
    return { applied: false, reason: "Subscription ended or payment failed." };
  }

  return mutateForUser(event.userId, (d): FulfilResult => {
    const u = d.users.find((x) => x.id === event.userId);
    if (!u) return { applied: false, reason: "Account not found." };

    // The retry guard. Cheap, and it is the difference between one month of
    // credits and three.
    if (d.transactions.some((t) => t.gatewayId && t.gatewayId === event.gatewayId)) {
      return { applied: false, reason: "Already processed." };
    }

    if (event.kind === "subscription") {
      const pkg = PACKAGES.find((p) => p.id === event.packageId);
      if (!pkg) return { applied: false, reason: "Unknown package." };

      const renews = new Date();
      renews.setMonth(renews.getMonth() + 1);

      u.packageId = pkg.id as PackageId;
      u.subscriptionStatus = "active";
      u.renewsAt = renews.toISOString();
      u.credits += pkg.credits;
      u.onboarded = true;

      d.transactions.push({
        id: uid("txn"),
        userId: u.id,
        kind: "subscription",
        label: `${pkg.name} plan`,
        amount: event.amount || pkg.price,
        credits: pkg.credits,
        createdAt: new Date().toISOString(),
        gatewayId: event.gatewayId,
      });

      return { applied: true, credits: u.credits };
    }

    const pack = CREDIT_PACKS.find((p) => p.id === event.packId);
    if (!pack) return { applied: false, reason: "Unknown credit pack." };

    u.credits += pack.credits;
    d.transactions.push({
      id: uid("txn"),
      userId: u.id,
      kind: "credits",
      label: `${pack.credits.toLocaleString()} credits`,
      amount: event.amount || pack.price,
      credits: pack.credits,
      createdAt: new Date().toISOString(),
      gatewayId: event.gatewayId,
    });

    return { applied: true, credits: u.credits };
  });
}
