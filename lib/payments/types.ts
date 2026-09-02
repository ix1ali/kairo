import type { PackageId } from "../types";

/**
 * The payment seam.
 *
 * Which gateway Koala uses is not settled — Stripe cannot be activated on a
 * Kuwaiti entity, Tap can but is regional, and a merchant of record removes the
 * entity question entirely at a higher fee. That decision should not be spread
 * across route handlers, so everything money-related goes through this
 * interface and the gateway becomes one file under `lib/payments/`.
 *
 * Two rules the drivers must hold to:
 *
 * 1. A checkout is never trusted. Only a verified webhook grants a plan or
 *    credits. A customer returning to the success URL proves nothing — they can
 *    simply visit it.
 *
 * 2. Fulfilment is idempotent. Gateways retry webhooks, and a retry must not
 *    hand out a second month of credits.
 */

export interface CheckoutRequest {
  userId: string;
  email: string;
  name: string;
  kind: "subscription" | "credits";
  /** Set when kind is "subscription". */
  packageId?: PackageId;
  /** Set when kind is "credits". */
  packId?: string;
  /** Major units, e.g. 49 for $49.00. Drivers convert to minor units. */
  amount: number;
  /** ISO 4217. Note KWD has three decimal places, not two. */
  currency: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}

export interface CheckoutSession {
  /** Where to send the customer to pay. */
  url: string;
  /** Our reference, echoed back by the gateway so we can match the webhook. */
  reference: string;
}

export interface PaymentEvent {
  /** The reference we generated at checkout. */
  reference: string;
  status: "paid" | "failed" | "ignored";
  amount: number;
  currency: string;
  /** The gateway's own event id, stored so a retry can be recognised. */
  gatewayId: string;
  /**
   * Who and what this payment was for, echoed back from the metadata we set at
   * checkout. Carried explicitly rather than parsed out of `reference`, so the
   * reference format stays free to change.
   */
  userId?: string;
  kind?: "subscription" | "credits";
  packageId?: string;
  packId?: string;
}

export interface PaymentProvider {
  id: "stripe" | "tap" | "manual";
  label: string;
  /** False when the driver is present but missing its credentials. */
  configured(): boolean;
  createCheckout(req: CheckoutRequest): Promise<CheckoutSession>;
  /**
   * Verifies the signature and returns what happened, or null when the request
   * did not come from the gateway. Never throw on a bad signature — return
   * null and let the route answer 400.
   */
  verifyWebhook(headers: Headers, rawBody: string): Promise<PaymentEvent | null>;
}

/**
 * Currencies whose minor unit is not 1/100. Getting this wrong is the classic
 * gateway bug: it breaks signature checks and charges customers 1000x.
 */
export const CURRENCY_DECIMALS: Record<string, number> = {
  KWD: 3,
  BHD: 3,
  OMR: 3,
  JOD: 3,
  TND: 3,
  JPY: 0,
  KRW: 0,
};

export function decimalsFor(currency: string): number {
  return CURRENCY_DECIMALS[currency.toUpperCase()] ?? 2;
}

/** Major units to the integer minor units most gateways expect. */
export function toMinorUnits(amount: number, currency: string): number {
  return Math.round(amount * Math.pow(10, decimalsFor(currency)));
}

/** Formats an amount the way a gateway's signature string expects to see it. */
export function formatAmount(amount: number, currency: string): string {
  return amount.toFixed(decimalsFor(currency));
}
