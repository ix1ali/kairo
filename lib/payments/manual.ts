import type { CheckoutRequest, CheckoutSession, PaymentEvent, PaymentProvider } from "./types";

/**
 * The no-gateway driver.
 *
 * This is what the app ran on during development: a plan change was applied
 * straight to the user record with no money involved. That is fine on a laptop
 * and a serious hole in production — any signed-in customer could POST to the
 * billing route and grant themselves an unlimited plan.
 *
 * So it is now explicitly opt-in and refuses to load in production. If no real
 * gateway is configured on a deployed build, buying is turned off, which is the
 * safe failure: nobody gets a free plan and the error says why.
 */

export function manualBillingAllowed(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.KOALA_ALLOW_MANUAL_BILLING === "1";
}

export const manualProvider: PaymentProvider = {
  id: "manual",
  label: "Manual (development only)",

  configured: manualBillingAllowed,

  async createCheckout(req: CheckoutRequest): Promise<CheckoutSession> {
    if (!manualBillingAllowed()) {
      throw new Error("Manual billing is disabled. Configure a payment gateway.");
    }
    // No redirect: the caller fulfils immediately in development.
    const reference = `manual_${req.userId}_${Date.now()}`;
    return { url: req.successUrl, reference };
  },

  async verifyWebhook(): Promise<PaymentEvent | null> {
    // Nothing signs a manual payment, so nothing can be verified.
    return null;
  },
};
