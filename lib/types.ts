export type PackageId = "starter" | "growth" | "studio";

export type PostStatus = "draft" | "approved" | "scheduled" | "posted" | "skipped";
export type PostFormat = "reel" | "carousel" | "static" | "story" | "video";
export type ProductTier = "hero" | "core" | "slow";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  packageId: PackageId | null;
  subscriptionStatus: "none" | "active" | "cancelled";
  renewsAt: string | null;
  credits: number;
  onboarded: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  handle?: string;
}

export interface Product {
  id: string;
  name: string;
  tier: ProductTier;
  price?: string;
  description?: string;
  benefits?: string;
  objection?: string;
  images: string[];
}

export interface BrandColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface CompetitorProfile {
  name: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  /** What Kairo could actually read from their public pages. */
  note?: string;
}

export interface Competitor {
  name: string;
  archetype: string;
  strength: string;
  gap: string;
  counterMove: string;
}

export interface AudienceSegment {
  name: string;
  description: string;
  trigger: string;
  objection: string;
}

export interface Pillar {
  key: string;
  name: string;
  description: string;
  share: number;
  funnel: "awareness" | "consideration" | "conversion" | "retention";
}

export interface WeekTheme {
  week: number;
  name: string;
  objective: string;
  focus: string;
  kpi: string;
}

export interface Strategy {
  generatedAt: string;
  engine: string;
  positioning: string;
  oneLiner: string;
  goal: string;
  goalKpi: string;
  differentiators: string[];
  audienceSegments: AudienceSegment[];
  competitors: Competitor[];
  pillars: Pillar[];
  weeks: WeekTheme[];
  hashtagSets: Record<string, string[]>;
  postingTimes: string[];
  kpis: { name: string; target: string }[];
  slowMoverPlan: string[];
  heroPlan: string[];
}

export interface PostRevision {
  at: string;
  prompt: string;
  creditsSpent: number;
}

export interface Post {
  id: string;
  projectId: string;
  day: number;
  date: string;
  slot: number;
  timeOfDay: string;
  platform: string;
  format: PostFormat;
  pillar: string;
  funnel: string;
  theme: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  visualDirection: string;
  visualPrompt: string;
  contentType: string;
  contentTypeName: string;
  contentWhy: string;
  productId: string | null;
  productName: string | null;
  layout: string;
  status: PostStatus;
  postedAt: string | null;
  feedback: { rating: number; note: string } | null;
  metrics: { reach: number; likes: number; comments: number; saves: number } | null;
  revisions: PostRevision[];
  assetUrl: string | null;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  website: string;
  logoUrl: string | null;
  images: string[];
  brandTheme: string;
  colors: BrandColors;
  voice: string;
  audience: string;
  market: string;
  language: string;
  socials: SocialLink[];
  platforms: string[];
  locale: string;
  products: Product[];
  goals: string[];
  goal: string;
  contentMix: { static: boolean; carousel: boolean; video: boolean; story: boolean };
  competitorsInput: string;
  competitorProfiles: CompetitorProfile[];
  strategy: Strategy | null;
  planStartDate: string | null;
  packageId: PackageId;
  createdAt: string;
  updatedAt: string;
}

export interface DBShape {
  users: User[];
  projects: Project[];
  posts: Post[];
  transactions: {
    id: string;
    userId: string;
    kind: "subscription" | "credits";
    label: string;
    amount: number;
    credits: number;
    createdAt: string;
  }[];
}
