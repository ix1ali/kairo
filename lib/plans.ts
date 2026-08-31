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
    tagline: "One post a day, a video a week, zero guesswork.",
    postsPerDay: 1,
    slots: [{ time: "18:30", label: "Prime", intent: "The single highest-leverage post of the day." }],
    videosPerMonth: 4,
    videoEveryNDays: 7,
    totalPosts: 30,
    projects: 1,
    credits: 120,
    bestFor: "Solo founders and single-product brands",
    features: [
      "1 brand project",
      "30 posts, one per day for 30 days",
      "4 videos, one a week, scripted and storyboarded",
      "A written plan for the month, not random posts",
      "We check your competitors and find your angle",
      "A picture, a caption and hashtags for every day",
      "120 credits to change any post you do not like",
      "A calendar that tracks what you have posted",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 129,
    cadence: "/month",
    tagline: "Three posts a day and a video every other day.",
    postsPerDay: 3,
    slots: [
      { time: "09:00", label: "Morning", intent: "Value + education. Wins attention early." },
      { time: "13:30", label: "Midday", intent: "Product spotlight. Drives consideration." },
      { time: "19:30", label: "Evening", intent: "Community + conversion. Peak engagement." },
    ],
    videosPerMonth: 12,
    videoEveryNDays: 2,
    totalPosts: 90,
    projects: 3,
    credits: 400,
    bestFor: "Growing brands that need real posting volume",
    features: [
      "Everything in Starter, plus:",
      "3 brand projects",
      "90 posts, three per day for 30 days",
      "12 videos, every other day, with shot lists and sound",
      "Each day has a job: teach, sell or get replies",
      "Extra posts for products that are not selling",
      "A run of posts for your best seller",
      "400 credits to change any post you do not like",
      "Sized for Instagram, TikTok, LinkedIn and X",
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
      "60 posts, two per day for 30 days",
      "15 videos, every other day, scripted and storyboarded",
      "Clips with someone talking, or the product alone",
      "A script and a shot list for every video",
      "Which sound to use on each video",
      "1,000 credits to change any post you do not like",
      "Your work is made first",
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
