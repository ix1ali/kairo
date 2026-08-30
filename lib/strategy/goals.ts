import type { IconName } from "@/components/icons/Ui";
import type { PillarKey } from "./knowledge";

/**
 * What the month is actually for.
 *
 * The same brand chasing sales and chasing reach should not get the same
 * calendar. The goal multiplies the pillar weights, so picking "more sales"
 * genuinely produces a different thirty days from picking "reach and views".
 */

export interface Goal {
  key: string;
  label: string;
  short: string;
  description: string;
  icon: IconName;
  accent: string;
  kpi: string;
  weights: Partial<Record<PillarKey, number>>;
}

export const GOALS: Goal[] = [
  {
    key: "sales",
    label: "More sales",
    short: "Sales",
    description: "Turn the audience you already have into orders this month.",
    icon: "tag",
    accent: "#C8F751",
    kpi: "Orders and link clicks",
    weights: { offer: 2.1, product: 1.5, objection: 1.4, proof: 1.2, community: 0.6, story: 0.7 },
  },
  {
    key: "views",
    label: "Reach and views",
    short: "Reach",
    description: "Get in front of people who have never heard of you.",
    icon: "eye",
    accent: "#22D3EE",
    kpi: "Reach, shares and new followers",
    weights: { community: 1.9, authority: 1.5, story: 1.3, proof: 0.9, offer: 0.35, objection: 0.6 },
  },
  {
    key: "leads",
    label: "Bookings and enquiries",
    short: "Leads",
    description: "Fill the diary. Best for services, clinics, gyms and agencies.",
    icon: "calendar",
    accent: "#7C5CFF",
    kpi: "DMs, calls and bookings",
    weights: { proof: 1.7, objection: 1.6, authority: 1.3, offer: 1.2, community: 0.7, story: 0.9 },
  },
  {
    key: "launch",
    label: "Launch something new",
    short: "Launch",
    description: "Build anticipation, then land the release with everything pointed at it.",
    icon: "bolt",
    accent: "#FFB443",
    kpi: "Launch-day sales and waitlist",
    weights: { product: 1.9, offer: 1.5, story: 1.3, proof: 1.1, authority: 0.8, community: 0.9 },
  },
  {
    key: "clear-stock",
    label: "Clear slow stock",
    short: "Clear stock",
    description: "Shift what has been sitting there, without discounting everything.",
    icon: "store",
    accent: "#FF8A5B",
    kpi: "Units moved on slow lines",
    weights: { offer: 1.8, objection: 1.7, product: 1.4, proof: 1.1, authority: 0.7, story: 0.6 },
  },
  {
    key: "authority",
    label: "Build authority",
    short: "Authority",
    description: "Become the account people screenshot and send to a friend.",
    icon: "brain",
    accent: "#A78BFA",
    kpi: "Saves and profile visits",
    weights: { authority: 2.1, proof: 1.4, story: 1.2, objection: 1.1, offer: 0.5, product: 0.8 },
  },
];

export const DEFAULT_GOAL = "sales";

export function getGoal(key: string): Goal {
  return GOALS.find((g) => g.key === key) || GOALS[0];
}

/* ------------------------------------------------------------------ */
/* content mix                                                         */
/* ------------------------------------------------------------------ */

/**
 * What the brand can actually make. Asked as content, not as platforms —
 * "can you film?" matters far more than "are you on TikTok?".
 */
export interface ContentKind {
  key: "static" | "carousel" | "video" | "story";
  label: string;
  short: string;
  description: string;
  icon: IconName;
  accent: string;
}

export const CONTENT_KINDS: ContentKind[] = [
  {
    key: "static",
    label: "Single posts",
    short: "Posts",
    description: "One image, one message. The quickest to publish.",
    icon: "image",
    accent: "#7C5CFF",
  },
  {
    key: "carousel",
    label: "Carousels",
    short: "Carousels",
    description: "Multi-slide teaching posts. The best format for saves.",
    icon: "layers",
    accent: "#22D3EE",
  },
  {
    key: "video",
    label: "Videos and reels",
    short: "Video",
    description: "Short-form video with a script and shot list. Best for reach.",
    icon: "video",
    accent: "#FF6B8A",
  },
  {
    key: "story",
    label: "Stories",
    short: "Stories",
    description: "Polls, countdowns and quick updates that vanish in a day.",
    icon: "clock",
    accent: "#FFB443",
  },
];

export type ContentMix = Record<ContentKind["key"], boolean>;

export const DEFAULT_MIX: ContentMix = { static: true, carousel: true, video: true, story: false };

export function mixToFormats(mix: ContentMix | undefined): string[] {
  const m = mix || DEFAULT_MIX;
  const out: string[] = [];
  if (m.static) out.push("static");
  if (m.carousel) out.push("carousel");
  if (m.video) out.push("reel", "video");
  if (m.story) out.push("story");
  return out.length ? out : ["static", "carousel"];
}
