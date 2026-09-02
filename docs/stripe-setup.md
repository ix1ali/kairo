# Stripe Billing setup

The code is written. These are the steps only you can do, in order.

## 1. Environment variables

```bash
STRIPE_SECRET_KEY=sk_test_...        # switch to sk_live_ when going live
STRIPE_WEBHOOK_SECRET=whsec_...      # from step 3
NEXT_PUBLIC_SITE_URL=https://trykoala.dev
KOALA_BILLING_CURRENCY=USD           # optional, defaults to USD
```

**Both** `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` must be set. The driver
reports itself unconfigured with only one, and buying stays switched off — that
is deliberate. A secret key without a webhook secret means customers could be
charged with no way to verify the payment and grant the plan.

Never set `KOALA_ALLOW_MANUAL_BILLING` in production. It cannot take effect
there anyway — `manualBillingAllowed()` returns false whenever
`NODE_ENV === "production"` — but do not add confusion.

## 2. Prices (optional but recommended)

Without these, checkout creates prices inline from `lib/plans.ts` and works
immediately. With them, you get the Stripe customer portal, proration and
proper reporting, because those all key off real Price objects.

Create three monthly recurring prices in the Stripe dashboard, then set:

```bash
STRIPE_PRICE_STARTER=price_...       # $49/month
STRIPE_PRICE_GROWTH=price_...        # $129/month
STRIPE_PRICE_STUDIO=price_...        # $279/month
```

The amounts must match `PACKAGES` in `lib/plans.ts` or customers will see one
price on your pricing page and be charged another.

## 3. Webhook endpoint

Add an endpoint in the Stripe dashboard pointing at:

```
https://trykoala.dev/api/webhooks/stripe
```

Subscribe it to exactly these four events:

| Event | What it does |
|---|---|
| `checkout.session.completed` | Grants the first month, and every credit pack |
| `invoice.paid` | Grants each monthly renewal |
| `invoice.payment_failed` | Marks the subscription cancelled |
| `customer.subscription.deleted` | Marks the subscription cancelled |

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## 4. Test locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

That prints a `whsec_...` for local use. Then:

```bash
stripe trigger checkout.session.completed
```

Card `4242 4242 4242 4242`, any future expiry, any CVC.

## What to check before going live

- A completed test checkout grants the plan **only after** the webhook arrives,
  not when the browser returns to the success URL.
- Replaying the same webhook twice grants credits **once**. Stripe retries until
  it gets a 2xx, so this is the difference between one month of credits and
  three. `stripe events resend <event_id>` will prove it.
- `lib/legal.ts` has no `TODO_` values left. Stripe checks the entity in your
  Terms against your account during review.

## Known gaps

- **Cancelling only updates our record.** `POST /api/billing {kind:"cancel"}`
  marks the account cancelled here but does not cancel the Stripe subscription,
  so the customer would keep being charged. Wire it to
  `stripe.subscriptions.update(id, { cancel_at_period_end: true })` using the
  `stripeSubscriptionId` field on the user before taking real money.
- **No customer portal.** Card updates and invoice history should go through
  `stripe.billingPortal.sessions.create`.
- **No receipt emails from us.** Stripe sends its own; anything branded needs the
  email provider that is not set up yet.
