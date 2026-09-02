import { manualProvider, manualBillingAllowed } from "./manual";
import { stripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

export * from "./types";
export { manualBillingAllowed };

/**
 * Picks the gateway from whichever credentials are present.
 *
 * Real drivers are loaded lazily so a missing SDK for the gateway you are not
 * using cannot break the build. Add a driver by dropping it in this folder and
 * adding one branch here — nothing outside `lib/payments` should name a
 * gateway.
 */
export function paymentProvider(): PaymentProvider {
  if (process.env.STRIPE_SECRET_KEY) return stripeProvider;
  return manualProvider;
}

/** The currency customers are charged in. Stripe UAE settles USD fine. */
export function billingCurrency(): string {
  return process.env.KOALA_BILLING_CURRENCY || "USD";
}

/** True when the app can actually take money right now. */
export function billingLive(): boolean {
  const p = paymentProvider();
  return p.id !== "manual" && p.configured();
}

/**
 * Whether a purchase may proceed at all, and why not when it may not.
 *
 * Kept separate from `billingLive` so the route can give the customer a real
 * sentence instead of a generic failure.
 */
export function billingAvailability(): { ok: true } | { ok: false; reason: string } {
  const p = paymentProvider();
  if (p.id !== "manual") {
    return p.configured()
      ? { ok: true }
      : { ok: false, reason: "The payment gateway is not finished being set up." };
  }
  if (manualBillingAllowed()) return { ok: true };
  return {
    ok: false,
    reason: "Payments are not available yet. No card was charged.",
  };
}
