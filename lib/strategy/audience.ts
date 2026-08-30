import type { IconName } from "@/components/icons/Ui";

/**
 * Who the month is written for.
 *
 * This used to be one free-text box, which produced either an empty string or
 * a vague sentence — and a vague answer here weakens every hook downstream.
 * Asking in concrete parts gets a usable answer from someone who has never
 * written a brief, and the parts compose into the sentence the engine reads,
 * so nothing here is decoration.
 */

export interface AudienceProfile {
  ageMin: number;
  ageMax: number;
  gender: "all" | "women" | "men";
  spend: "budget" | "mid" | "premium" | "luxury";
  /** Up to three things this buyer weighs most heavily. */
  priorities: string[];
  /** Who they are buying for. Changes the angle more than people expect. */
  buyingFor: "self" | "gift" | "business";
  /** Anything the structured fields cannot capture. Optional. */
  note: string;
}

export const DEFAULT_AUDIENCE: AudienceProfile = {
  ageMin: 25,
  ageMax: 45,
  gender: "all",
  spend: "mid",
  priorities: [],
  buyingFor: "self",
  note: "",
};

export const AGE_STOPS = [16, 18, 21, 25, 30, 35, 40, 45, 50, 55, 60, 65];

export const GENDERS: { value: AudienceProfile["gender"]; label: string }[] = [
  { value: "all", label: "Everyone" },
  { value: "women", label: "Mostly women" },
  { value: "men", label: "Mostly men" },
];

export const SPEND_LEVELS: { value: AudienceProfile["spend"]; label: string; note: string }[] = [
  { value: "budget", label: "Price first", note: "Compares on cost and waits for offers" },
  { value: "mid", label: "Value", note: "Will pay more when the reason is clear" },
  { value: "premium", label: "Premium", note: "Buys quality without much hesitation" },
  { value: "luxury", label: "Luxury", note: "Price is not the deciding factor" },
];

export const BUYING_FOR: { value: AudienceProfile["buyingFor"]; label: string; note: string }[] = [
  { value: "self", label: "Themselves", note: "They are the user" },
  { value: "gift", label: "Someone else", note: "Gifting — fear of getting it wrong drives everything" },
  { value: "business", label: "Their business", note: "Spending company money, needs to justify it" },
];

export const PRIORITIES: { key: string; label: string; icon: IconName }[] = [
  { key: "price", label: "Getting a fair price", icon: "tag" },
  { key: "quality", label: "Quality that lasts", icon: "shield" },
  { key: "speed", label: "Speed and delivery", icon: "bolt" },
  { key: "convenience", label: "Convenience", icon: "clock" },
  { key: "status", label: "How it looks to others", icon: "star" },
  { key: "health", label: "Health and safety", icon: "heart" },
  { key: "ethics", label: "Ethics and sustainability", icon: "globe" },
  { key: "design", label: "Design and aesthetics", icon: "palette" },
  { key: "support", label: "Support after buying", icon: "users" },
  { key: "trust", label: "Trusting the seller", icon: "lock" },
];

const GENDER_WORD: Record<AudienceProfile["gender"], string> = {
  all: "people",
  women: "women",
  men: "men",
};

const SPEND_PHRASE: Record<AudienceProfile["spend"], string> = {
  budget: "who compare on price and wait for a reason to buy",
  mid: "who will pay more when the reason is made clear",
  premium: "who buy quality without much hesitation",
  luxury: "for whom price is not the deciding factor",
};

const BUYING_PHRASE: Record<AudienceProfile["buyingFor"], string> = {
  self: "",
  gift: "buying as a gift and afraid of getting it wrong",
  business: "spending company money and needing to justify the decision",
};

/**
 * Composes the parts into the sentence the strategy engine reads. Kept as
 * prose rather than a struct because every downstream template interpolates
 * {audience} into a line of copy.
 */
export function describeAudience(p: AudienceProfile, market?: string): string {
  const parts: string[] = [];

  const who = `${GENDER_WORD[p.gender]} aged ${p.ageMin} to ${p.ageMax}`;
  parts.push(market?.trim() ? `${who} in ${market.trim()}` : who);

  const buying = BUYING_PHRASE[p.buyingFor];
  if (buying) parts.push(buying);

  parts.push(SPEND_PHRASE[p.spend]);

  const chosen = PRIORITIES.filter((x) => p.priorities.includes(x.key)).map((x) =>
    x.label.toLowerCase()
  );
  if (chosen.length) {
    parts.push(
      chosen.length === 1
        ? `and care most about ${chosen[0]}`
        : `and care most about ${chosen.slice(0, -1).join(", ")} and ${chosen[chosen.length - 1]}`
    );
  }

  let sentence = parts.join(", ").replace(/, and care/, " and care");
  if (p.note.trim()) sentence += `. ${p.note.trim().replace(/\.$/, "")}`;
  return sentence + ".";
}
