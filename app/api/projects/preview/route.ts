import { fail, json, requireUser } from "@/lib/api";
import { uid } from "@/lib/db";
import { getPackage } from "@/lib/plans";
import { DEFAULT_COLORS, VOICE_OPTIONS } from "@/lib/projects";
import { buildCalendar, buildStrategy } from "@/lib/strategy/engine";
import { localisePosts } from "@/lib/strategy/localise";
import { DEFAULT_GOAL, DEFAULT_MIX, DEFAULT_VIDEO_STYLE } from "@/lib/strategy/goals";
import { DEFAULT_LOCALE, localeLabel } from "@/lib/languages";
import { renderPosterSVG } from "@/lib/render/poster";
import type { Post, Product, Project } from "@/lib/types";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

/**
 * Builds a throwaway plan and returns three representative days, so the brand
 * can be judged before committing to a whole month. Nothing is saved.
 */
export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => ({}));
  if (!String(body.name || "").trim()) return fail("Add a project name first.");

  const pkg = getPackage(auth.user.packageId);
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const products: Product[] = (body.products || [])
    .filter((p: Partial<Product>) => (p.name || "").trim())
    .map((p: Partial<Product>) => ({
      id: p.id || uid("prd"),
      name: String(p.name).trim(),
      tier: (p.tier as Product["tier"]) || "core",
      price: p.price || "",
      description: p.description || "",
      benefits: p.benefits || "",
      objection: p.objection || "",
      images: p.images || [],
    }));

  const project: Project = {
    id: `preview_${body.seed || "a"}`,
    userId: auth.user.id,
    name: String(body.name).trim(),
    tagline: body.tagline || "",
    category: body.category || "general",
    description: body.description || "",
    website: body.website || "",
    logoUrl: body.logoUrl || null,
    images: body.images || [],
    brandTheme: body.brandTheme || "premium-dark",
    colors: { ...DEFAULT_COLORS, ...(body.colors || {}) },
    voice: body.voice || VOICE_OPTIONS[0],
    audience: body.audience || "",
    market: body.market || "",
    locale: body.locale || DEFAULT_LOCALE,
    language: localeLabel(body.locale || DEFAULT_LOCALE),
    socials: [],
    platforms: body.platforms?.length ? body.platforms : ["instagram"],
    products,
    goals: body.goals || [],
    goal: body.goal || DEFAULT_GOAL,
    contentMix: body.contentMix || { ...DEFAULT_MIX },
    videoStyle: body.videoStyle || { ...DEFAULT_VIDEO_STYLE },
    competitorsInput: body.competitorsInput || "",
    competitorProfiles: body.competitorProfiles || [],
    strategy: null,
    planStartDate: start.toISOString(),
    packageId: pkg.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const strategy = buildStrategy(project, pkg);
  project.strategy = strategy;

  const all = buildCalendar(project, strategy, pkg, start).map((p, i) => ({
    ...p,
    id: `pv_${i}`,
    projectId: project.id,
  })) as Post[];

  // One from early, middle and late in the month so the arc is visible.
  // Keep them all 4:5 so the three cards line up.
  const flat = all.filter((p) => p.format !== "story" && p.format !== "reel" && p.format !== "video");
  const pool = flat.length >= 3 ? flat : all;
  const picks = [pool[1] || pool[0], pool[Math.floor(pool.length / 2)], pool[pool.length - 2]].filter(Boolean);

  const { posts: localised } = await localisePosts(
    picks.map((p) => ({ hook: p.hook, caption: p.caption, cta: p.cta })),
    project.locale
  );

  const samples = picks.map((p, i) => ({
    id: p.id,
    day: p.day,
    pillar: p.pillar,
    format: p.format,
    platform: p.platform,
    contentTypeName: p.contentTypeName,
    contentWhy: p.contentWhy,
    hook: localised[i]?.hook || p.hook,
    caption: localised[i]?.caption || p.caption,
    hashtags: p.hashtags,
    svg: renderPosterSVG({ ...p, hook: localised[i]?.hook || p.hook }, project, null),
  }));

  return json({
    samples,
    positioning: strategy.positioning,
    goal: strategy.goal,
    totalPosts: pkg.totalPosts,
  });
}
