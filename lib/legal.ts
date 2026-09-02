/**
 * Company details used across the legal pages.
 *
 * Tap Payments (and every other gateway) checks that the entity named in your
 * Terms matches the entity on the merchant application. Fill these in once from
 * your commercial licence — every legal page reads from here, so there is no
 * second place to forget.
 *
 * Anything left as a TODO_ value is rendered as a visible placeholder rather
 * than silently printing an empty string, so an unfinished field cannot ship
 * unnoticed.
 */

export const COMPANY = {
  /** Exact trading name on the commercial licence. */
  legalName: "TODO_LEGAL_ENTITY_NAME",
  /** Brand name shown to customers. */
  tradingName: "Koala",
  /** Trade licence number from the free zone authority. */
  licenceNumber: "TODO_TRADE_LICENCE_NUMBER",
  /** Registered address, one line. */
  address: "TODO_REGISTERED_ADDRESS",
  country: "the United Arab Emirates",
  /** Governing law for disputes. */
  jurisdiction: "the United Arab Emirates",

  supportEmail: "TODO_SUPPORT_EMAIL",
  privacyEmail: "TODO_PRIVACY_EMAIL",
  phone: "TODO_PHONE",

  /** Shown on invoices and the checkout descriptor. Keep under 22 characters. */
  statementDescriptor: "KOALA",
} as const;

export const LEGAL_UPDATED = "1 September 2026";

/** True when a field still holds its placeholder. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("TODO_");
}

/** Renders a value, or a conspicuous marker when it has not been filled in. */
export function show(value: string): string {
  return isPlaceholder(value) ? `[${value.replace(/^TODO_/, "").replace(/_/g, " ")}]` : value;
}

/** Every placeholder still outstanding, for the pre-launch check. */
export function outstandingCompanyFields(): string[] {
  return Object.entries(COMPANY)
    .filter(([, v]) => typeof v === "string" && isPlaceholder(v))
    .map(([k]) => k);
}
