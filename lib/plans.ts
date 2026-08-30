import type { PackageId } from "./types";

export interface PackageDef {
  id: PackageId;
  name: string;
  price: number;
  cadence: string;
  tagline: string;
  postsPerDay: number;
  slots: { time: string; label: string; intent: string }[];
  videosPerMonth: number;
  videoEveryNDays: number;
  totalPosts: number;
  projects: number;
  credits: number;
  bestFor: string;
  features: string[];
  highlight?: boolean;
}

export const PACKAGES: PackageDef[] = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    cadence: "/month",
    tagline: "One brand, one post a day, zero guesswork.",
    postsPerDay: 1,
    slots: [{ time: "18:30", label: "Prime", intent: "The single highest-leverage post of the day." }],
    videosPerMonth: 0,
    videoEveryNDays: 0,
    totalPosts: 30,
    projects: 1,
    credits: 120,
    bestFor: "Solo founders and single-product brands",
    features: [
      "1 brand project",
      "30 posts — 1 per day for 30 days",
      "Full 30-day strategy document, not random posts",
      "Competitor teardown + positioning angle",
      "Ready-to-post visual + caption + hashtags per day",
      "120 redesign credits included",
      "Calendar dashboard with posted / not-posted tracking",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 129,
    cadence: "/month",
    tagline: "Three posts a day. Full-funnel, every single day.",
    postsPerDay: 3,
    slots: [
      { time: "09:00", label: "Morning", intent: "Value + education. Wins attention early." },
      { time: "13:30", label: "Midday", intent: "Product spotlight. Drives consideration." },
      { time: "19:30", label: "Evening", intent: "Community + conversion. Peak engagement." },
    ],
    videosPerMonth: 0,
    videoEveryNDays: 0,
    totalPosts: 90,
    projects: 3,
    credits: 400,
    bestFor: "Growing brands that need real posting volume",
    features: [
      "Everything in Starter, plus:",
      "3 brand projects",
      "90 posts — 3 per day for 30 days",
      "Full-funnel daily structure (educate → sell → engage)",
      "Slow-mover rescue campaigns",
      "Hero-product push sequences",
      "400 redesign credits included",
      "Multi-platform variants (IG, TikTok, LinkedIn, X)",
    ],
    highlight: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: 279,
    cadence: "/month",
    tagline: "Posts plus video. The full content department.",
    postsPerDay: 2,
    slots: [
      { time: "10:00", label: "Morning", intent: "Story + authority building." },
      { time: "19:00", label: "Evening", intent: "Offer + conversion." },
    ],
    videosPerMonth: 15,
    videoEveryNDays: 2,
    totalPosts: 60,
    projects: 8,
    credits: 1000,
    bestFor: "Brands that live on Reels, Shorts and TikTok",
    features: [
      "Everything in Growth, plus:",
      "8 brand projects",
      "60 posts — 2 per day for 30 days",
      "15 videos — 1 every other day, scripted + storyboarded",
      "Hook-tested short-form scripts with shot lists",
      "Trend + sound direction per video",
      "1,000 redesign credits included",
      "Priority generation queue",
    ],
  },
];

export function getPackage(id: PackageId | null | undefined): PackageDef {
  return PACKAGES.find((p) => p.id === id) || PACKAGES[0];
}

export interface CreditPack {
  id: string;
  credits: number;
  price: number;
  save?: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "cp_100", credits: 100, price: 19 },
  { id: "cp_300", credits: 300, price: 49, save: "Save 14%", popular: true },
  { id: "cp_1000", credits: 1000, price: 139, save: "Save 27%" },
  { id: "cp_3000", credits: 3000, price: 349, save: "Save 39%" },
];

export const CREDIT_COSTS = {
  rewriteCaption: 1,
  newAngle: 3,
  redesignVisual: 4,
  regenerateDay: 6,
  regenerateVideo: 20,
  regenerateWeek: 25,
  recreateReference: 8,
} as const;

export const CREDIT_ACTIONS: { key: keyof typeof CREDIT_COSTS; label: string; description: string }[] = [
  { key: "rewriteCaption", label: "Rewrite caption", description: "New copy, same visual and angle." },
  { key: "newAngle", label: "New creative angle", description: "Different hook and concept for the same day." },
  { key: "redesignVisual", label: "Redesign visual", description: "Regenerate the artwork from your prompt." },
  { key: "regenerateDay", label: "Regenerate whole day", description: "Fresh visual and copy end to end." },
  { key: "regenerateVideo", label: "Regenerate video", description: "New script, storyboard and render." },
  { key: "regenerateWeek", label: "Regenerate a week", description: "Rebuild seven days around a new theme." },
  { key: "recreateReference", label: "Recreate a reference", description: "Match the look of an image you like, in your brand." },
];
