import Stripe from "stripe";
import { PACKAGES, CREDIT_PACKS } from "../plans";
import type { CheckoutRequest, CheckoutSession, PaymentEvent, PaymentProvider } from "./types";
import { toMinorUnits } from "./types";

/**
 * Stripe driver.
 *
 * Two Checkout modes are in play. A plan is `mode: "subscription"`, so Stripe
 * owns the renewal schedule and tells us about each successful month through
 * `invoice.paid`. A credit pack is `mode: "payment"`, a single charge.
 *
 * Prices come from the dashboard when `STRIPE_PRICE_*` is set, which is what
 * you want long term because the customer portal, proration and reporting all
 * key off real Price objects. Without them we fall back to inline `price_data`
 * so the integration works the moment an API key exists.
 */

let _stripe: Stripe | null = null;

/** Lazily constructed — a top-level client would throw during `next build`. */
function client(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

const PRICE_ENV: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  growth: process.env.STRIPE_PRICE_GROWTH,
  studio: process.env.STRIPE_PRICE_STUDIO,
};

export const stripeProvider: PaymentProvider = {
  id: "stripe",
  label: "Stripe",

  configured() {
    return !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
  },

  async createCheckout(req: CheckoutRequest): Promise<CheckoutSession> {
    const stripe = client();
    const currency = req.currency.toLowerCase();

    // The reference travels to Stripe and comes back on the webhook. It is how
    // a payment is matched to an account without trusting the browser.
    const reference = `koala_${req.kind}_${req.userId}_${Date.now()}`;

    const metadata: Record<string, string> = {
      reference,
      userId: req.userId,
      kind: req.kind,
      ...(req.packageId ? { packageId: req.packageId } : {}),
      ...(req.packId ? { packId: req.packId } : {}),
    };

    const common = {
      client_reference_id: req.userId,
      customer_email: req.email,
      success_url: req.successUrl,
      cancel_url: req.cancelUrl,
      metadata,
    } satisfies Partial<Stripe.Checkout.SessionCreateParams>;

    if (req.kind === "subscription") {
      const pkg = PACKAGES.find((p) => p.id === req.packageId);
      if (!pkg) throw new Error("Unknown package.");
      const priceId = PRICE_ENV[pkg.id];

      const session = await stripe.checkout.sessions.create({
        ...common,
        mode: "subscription",
        line_items: [
          priceId
            ? { price: priceId, quantity: 1 }
            : {
                quantity: 1,
                price_data: {
                  currency,
                  unit_amount: toMinorUnits(pkg.price, currency),
                  recurring: { interval: "month" },
                  product_data: { name: `Koala ${pkg.name}`, description: pkg.tagline },
                },
              },
        ],
        // Repeated on the subscription so renewal invoices carry it too —
        // without this, month two arrives with no idea whose account it is.
        subscription_data: { metadata },
      });

      if (!session.url) throw new Error("Stripe returned no checkout URL.");
      return { url: session.url, reference };
    }

    const pack = CREDIT_PACKS.find((p) => p.id === req.packId);
    if (!pack) throw new Error("Unknown credit pack.");

    const session = await stripe.checkout.sessions.create({
      ...common,
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: toMinorUnits(pack.price, currency),
            product_data: { name: `${pack.credits.toLocaleString()} Koala credits` },
          },
        },
      ],
      payment_intent_data: { metadata },
    });

    if (!session.url) throw new Error("Stripe returned no checkout URL.");
    return { url: session.url, reference };
  },

  async verifyWebhook(headers: Headers, rawBody: string): Promise<PaymentEvent | null> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = headers.get("stripe-signature");
    if (!secret || !signature) return null;

    let event: Stripe.Event;
    try {
      // The async variant uses WebCrypto, which is what runs on Vercel's
      // runtime. The sync one relies on Node's crypto being available.
      event = await client().webhooks.constructEventAsync(rawBody, signature, secret);
    } catch {
      // A bad signature is not an exception worth throwing — it is simply not
      // a message from Stripe, and the route should answer 400.
      return null;
    }

    const ignored = (): PaymentEvent => ({
      reference: "",
      status: "ignored",
      amount: 0,
      currency: "",
      gatewayId: event.id,
    });

    /** Pulls the fields we set at checkout back out of Stripe's metadata bag. */
    const from = (m: Stripe.Metadata | null | undefined) => ({
      reference: m?.reference || "",
      userId: m?.userId || undefined,
      kind: (m?.kind as "subscription" | "credits") || undefined,
      packageId: m?.packageId || undefined,
      packId: m?.packId || undefined,
    });

    switch (event.type) {
      // First payment of a subscription, and every one-off credit purchase.
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.payment_status !== "paid") return ignored();
        return {
          ...from(s.metadata),
          status: "paid",
          amount: (s.amount_total ?? 0) / 100,
          currency: (s.currency || "").toUpperCase(),
          gatewayId: event.id,
        };
      }

      // Monthly renewals. billing_reason separates them from the first invoice,
      // which checkout.session.completed has already fulfilled — without this
      // check, month one would be granted twice.
      case "invoice.paid": {
        const inv = event.data.object as Stripe.Invoice;
        if (inv.billing_reason !== "subscription_cycle") return ignored();
        return {
          ...from(inv.parent?.subscription_details?.metadata),
          status: "paid",
          amount: (inv.amount_paid ?? 0) / 100,
          currency: (inv.currency || "").toUpperCase(),
          gatewayId: event.id,
        };
      }

      case "invoice.payment_failed":
      case "customer.subscription.deleted": {
        const o = event.data.object as Stripe.Subscription | Stripe.Invoice;
        return {
          ...from(o.metadata),
          status: "failed",
          amount: 0,
          currency: "",
          gatewayId: event.id,
        };
      }

      default:
        return ignored();
    }
  },
};
