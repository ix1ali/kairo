import { mutate, read, uid } from "./db";
import { getPackage } from "./plans";
import { buildCalendar, buildStrategy } from "./strategy/engine";
import { localisePosts } from "./strategy/localise";
import type { Post, Product, Project, User } from "./types";
import { DEFAULT_LOCALE, localeLabel } from "./languages";
import { DEFAULT_GOAL, DEFAULT_MIX, DEFAULT_VIDEO_STYLE } from "./strategy/goals";
import type { CompetitorProfile } from "./types";

/**
 * Each theme is a constrained family of layouts. Restricting the pool is what
 * makes a month look like one campaign instead of thirty unrelated posts.
 */
export const THEME_LAYOUTS: Record<string, string[]> = {
  "minimal-editorial": ["editorial-photo", "bold-type", "hero-statement", "quote-card", "data-tile"],
  "bold-loud": ["bold-type", "hero-statement", "split-compare", "sticker-collage", "data-tile"],
  "warm-organic": ["editorial-photo", "lifestyle-context", "grid-flatlay", "quote-card", "carousel-teach"],
  "premium-dark": ["hero-statement", "product-cutout", "editorial-photo", "bold-type", "quote-card"],
  "playful-bright": ["sticker-collage", "grid-flatlay", "split-compare", "carousel-teach", "data-tile"],
  "clinical-clean": ["carousel-teach", "data-tile", "split-compare", "before-after", "quote-card"],
  "retro-nostalgic": ["sticker-collage", "grid-flatlay", "bold-type", "editorial-photo", "quote-card"],
  "luxury-refined": ["editorial-photo", "hero-statement", "product-cutout", "quote-card", "bold-type"],
};

export const BRAND_THEMES = [
  { key: "minimal-editorial", label: "Minimal & Editorial", note: "Space, restraint, one strong idea per frame." },
  { key: "bold-loud", label: "Bold & Loud", note: "Huge type, high contrast, unmissable in a feed." },
  { key: "warm-organic", label: "Warm & Organic", note: "Natural texture, soft light, human and handmade." },
  { key: "premium-dark", label: "Premium & Dark", note: "Deep backgrounds, metallic accents, quiet luxury." },
  { key: "playful-bright", label: "Playful & Bright", note: "Saturated colour, movement, friendly and fast." },
  { key: "clinical-clean", label: "Clinical & Clean", note: "Precise grid, clear hierarchy, evidence forward." },
  { key: "retro-nostalgic", label: "Retro & Nostalgic", note: "Grain, vintage palettes, print-inspired layouts." },
  { key: "luxury-refined", label: "Luxury & Refined", note: "Serif type, generous margins, understated." },
];

export const VOICE_OPTIONS = [
  "Confident and direct",
  "Warm and friendly",
  "Expert and precise",
  "Playful and irreverent",
  "Calm and reassuring",
  "Bold and provocative",
  "Understated and premium",
];

export const PLATFORM_OPTIONS = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
  { key: "pinterest", label: "Pinterest" },
  { key: "youtube", label: "YouTube Shorts" },
  { key: "threads", label: "Threads" },
];

export const GOAL_OPTIONS = [
  "More sales from social",
  "Grow the follower base",
  "Launch a new product",
  "Clear slow-moving stock",
  "Build brand authority",
  "Drive bookings or enquiries",
  "Get more user-generated content",
  "Enter a new market",
];

export const DEFAULT_COLORS = {
  primary: "#7C5CFF",
  secondary: "#22D3EE",
  background: "#0B0B12",
  text: "#FFFFFF",
};

export interface ProjectInput {
  name: string;
  tagline?: string;
  category: string;
  description?: string;
  website?: string;
  logoUrl?: string | null;
  images?: string[];
  brandTheme?: string;
  colors?: Partial<typeof DEFAULT_COLORS>;
  voice?: string;
  audience?: string;
  market?: string;
  language?: string;
  locale?: string;
  socials?: { platform: string; url: string }[];
  platforms?: string[];
  products?: Partial<Product>[];
  goals?: string[];
  goal?: string;
  contentMix?: { static: boolean; carousel: boolean; video: boolean; story: boolean };
  videoStyle?: { captions: string; voice: string; talent: string; sound: string };
  competitorsInput?: string;
  competitorProfiles?: CompetitorProfile[];
  startDate?: string;
}

function normaliseProducts(input: Partial<Product>[] | undefined): Product[] {
  return (input || [])
    .filter((p) => (p.name || "").trim())
    .map((p) => ({
      id: p.id || uid("prd"),
      name: String(p.name).trim(),
      tier: (p.tier as Product["tier"]) || "core",
      price: p.price || "",
      description: p.description || "",
      benefits: p.benefits || "",
      objection: p.objection || "",
      images: p.images || [],
    }));
}

export function projectLimitFor(user: User) {
  return getPackage(user.packageId).projects;
}

export function createProjectWithPlan(user: User, input: ProjectInput): Project {
  const pkg = getPackage(user.packageId);
  const now = new Date().toISOString();
  const start = input.startDate ? new Date(input.startDate) : new Date();
  start.setHours(0, 0, 0, 0);

  const project: Project = {
    id: uid("prj"),
    userId: user.id,
    name: input.name.trim(),
    tagline: (input.tagline || "").trim(),
    category: input.category || "general",
    description: (input.description || "").trim(),
    website: (input.website || "").trim(),
    logoUrl: input.logoUrl || null,
    images: input.images || [],
    brandTheme: input.brandTheme || "premium-dark",
    colors: { ...DEFAULT_COLORS, ...(input.colors || {}) },
    voice: input.voice || VOICE_OPTIONS[0],
    audience: (input.audience || "").trim(),
    market: (input.market || "").trim(),
    locale: input.locale || DEFAULT_LOCALE,
    language: localeLabel(input.locale || DEFAULT_LOCALE),
    socials: (input.socials || []).filter((s) => (s.url || "").trim()),
    platforms: input.platforms?.length ? input.platforms : ["instagram"],
    products: normaliseProducts(input.products),
    goals: input.goals || [],
    goal: input.goal || DEFAULT_GOAL,
    contentMix: input.contentMix || { ...DEFAULT_MIX },
    videoStyle: input.videoStyle || { ...DEFAULT_VIDEO_STYLE },
    competitorsInput: (input.competitorsInput || "").trim(),
    competitorProfiles: (input.competitorProfiles || []).filter((c) => (c.name || "").trim()),
    strategy: null,
    planStartDate: start.toISOString(),
    packageId: pkg.id,
    createdAt: now,
    updatedAt: now,
  };

  const strategy = buildStrategy(project, pkg);
  project.strategy = strategy;

  const posts = buildCalendar(project, strategy, pkg, start).map((p) => ({
    ...p,
    id: uid("pst"),
    projectId: project.id,
  })) as Post[];

  mutate((db) => {
    db.projects.push(project);
    db.posts.push(...posts);
  });

  return project;
}

export function regeneratePlan(project: Project, user: User): Project {
  const pkg = getPackage(user.packageId);
  const start = project.planStartDate ? new Date(project.planStartDate) : new Date();
  const strategy = buildStrategy(project, pkg);

  const posts = buildCalendar(project, strategy, pkg, start).map((p) => ({
    ...p,
    id: uid("pst"),
    projectId: project.id,
  })) as Post[];

  mutate((db) => {
    const idx = db.projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      db.projects[idx] = { ...project, strategy, packageId: pkg.id, updatedAt: new Date().toISOString() };
    }
    db.posts = db.posts.filter((p) => p.projectId !== project.id);
    db.posts.push(...posts);
  });

  return read().projects.find((p) => p.id === project.id)!;
}

export function getProjectFor(userId: string, projectId: string) {
  const db = read();
  const project = db.projects.find((p) => p.id === projectId && p.userId === userId) || null;
  if (!project) return null;
  const posts = db.posts
    .filter((p) => p.projectId === project.id)
    .sort((a, b) => a.day - b.day || a.slot - b.slot);
  return { project, posts };
}

export function projectStats(posts: Post[]) {
  const total = posts.length;
  const posted = posts.filter((p) => p.status === "posted").length;
  const approved = posts.filter((p) => p.status === "approved" || p.status === "scheduled").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const videos = posts.filter((p) => p.format === "video").length;
  const rated = posts.filter((p) => p.feedback);
  const avgRating = rated.length
    ? Math.round((rated.reduce((a, p) => a + (p.feedback?.rating || 0), 0) / rated.length) * 10) / 10
    : null;
  const withMetrics = posts.filter((p) => p.metrics);
  const reach = withMetrics.reduce((a, p) => a + (p.metrics?.reach || 0), 0);
  const engagement = withMetrics.reduce(
    (a, p) => a + (p.metrics?.likes || 0) + (p.metrics?.comments || 0) + (p.metrics?.saves || 0),
    0
  );
  return { total, posted, approved, drafts, videos, avgRating, reach, engagement };
}


/**
 * Rewrites a freshly generated project into its target language and dialect.
 * A no-op when the locale is English or no text provider is configured.
 */
export async function localiseProject(projectId: string): Promise<boolean> {
  const db = read();
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) return false;

  const posts = db.posts.filter((p) => p.projectId === projectId);
  if (!posts.length) return false;

  const { posts: rewritten, localised } = await localisePosts(
    posts.map((p) => ({ hook: p.hook, caption: p.caption, cta: p.cta })),
    project.locale
  );
  if (!localised) return false;

  mutate((d) => {
    posts.forEach((p, i) => {
      const target = d.posts.find((x) => x.id === p.id);
      if (!target) return;
      target.hook = rewritten[i].hook;
      target.caption = rewritten[i].caption;
      target.cta = rewritten[i].cta;
    });
  });
  return true;
}
