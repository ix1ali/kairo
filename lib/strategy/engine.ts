import type { Post, PostFormat, Product, Project, Strategy } from "../types";
import type { PackageDef } from "../plans";
import { CATEGORIES, categoryNoun, resolveCategory } from "./categories";
import { THEME_LAYOUTS } from "../projects";
import { typesFor } from "./contentTypes";
import { DEFAULT_GOAL, DEFAULT_MIX, getGoal, mixToFormats, videoStyleNotes, type VideoStyle } from "./goals";
import {
  DAY_RHYTHM,
  PILLARS,
  PILLAR_MAP,
  PLATFORM_PROFILES,
  UNIVERSAL_CTAS,
  UNIVERSAL_HOOKS,
  VISUAL_SYSTEMS,
  WEEK_ARCS,
  type PillarKey,
} from "./knowledge";

/* ------------------------------------------------------------------ */
/* deterministic randomness                                            */
/* ------------------------------------------------------------------ */

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;

function pick<T>(rng: Rng, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function shuffle<T>(rng: Rng, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/* text helpers                                                        */
/* ------------------------------------------------------------------ */

const NUMBERS = ["3", "4", "5", "7", "two", "three", "five"];

function keyword(s: string) {
  const w = (s || "").replace(/[^a-zA-Z ]/g, "").trim().split(/\s+/)[0] || "INFO";
  return w.toUpperCase().slice(0, 10);
}

interface TokenBag {
  brand: string;
  product: string;
  category: string;
  audience: string;
  benefit: string;
  alt: string;
  word: string;
  n: string;
  city: string;
}

/** "The Ridgeline 24L" after "your" would read "your The Ridgeline 24L". */
function dropArticle(name: string) {
  return name.replace(/^(the|a|an)\s+/i, "");
}

function fill(template: string, t: TokenBag): string {
  return template
    .replace(/\{brand\}/g, t.brand)
    // A determiner already in the template supplies the article, so the
    // product name must not bring its own.
    .replace(
      /\b(your|our|my|this|that|a|an|the)((?:\s+\w+){0,2})\s+\{product\}/gi,
      (_m, det: string, mid: string) => `${det}${mid} ${dropArticle(t.product)}`
    )
    .replace(/\{product\}/g, t.product)
    .replace(/\{category\}/g, t.category)
    .replace(/\{audience\}/g, t.audience)
    .replace(/\{benefit\}/g, t.benefit)
    .replace(/\{alt\}/g, t.alt)
    .replace(/\{word\}/g, t.word)
    .replace(/\{n\}/g, t.n)
    .replace(/\{city\}/g, t.city);
}

function sentence(s: string) {
  const trimmed = s.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/* ------------------------------------------------------------------ */
/* allocation                                                          */
/* ------------------------------------------------------------------ */

function allocate(weights: Record<string, number>, total: number): Record<string, number> {
  const keys = Object.keys(weights).filter((k) => weights[k] > 0);
  const sum = keys.reduce((a, k) => a + weights[k], 0) || 1;
  const raw = keys.map((k) => ({ k, v: (weights[k] / sum) * total }));
  const out: Record<string, number> = {};
  let assigned = 0;
  for (const r of raw) {
    out[r.k] = Math.floor(r.v);
    assigned += out[r.k];
  }
  const remainders = raw
    .map((r) => ({ k: r.k, rem: r.v - Math.floor(r.v) }))
    .sort((a, b) => b.rem - a.rem);
  let i = 0;
  while (assigned < total && remainders.length) {
    out[remainders[i % remainders.length].k] += 1;
    assigned++;
    i++;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* competitor archetype matching                                       */
/* ------------------------------------------------------------------ */

const ARCHETYPE_SIGNALS: { test: RegExp; wants: RegExp }[] = [
  { test: /premium|luxury|luxur|craft|artisan|handmade|heritage|bespoke/i, wants: /prestige|premium|luxur|heritage|house|specialist/i },
  { test: /cheap|affordable|budget|value|discount|save money|lowest price/i, wants: /price|budget|cheap|volume|floor/i },
  { test: /broad catalogue|100+ products|compete on choice/i, wants: /volume|incumbent|leader|default|big/i },
  { test: /focused range|about d{1,2} products/i, wants: /specialist|niche|expert|boutique|narrow/i },
  { test: /subscription|convenience|next day|fast delivery|app/i, wants: /convenience|scalable|speed|startup/i },
  { test: /no public catalogue|little away/i, wants: /status quo|nothing|invisible|doing without/i },
];

/**
 * Pairs each supplied competitor with the archetype their own signals suggest,
 * rather than assigning archetypes in list order.
 */
function assignArchetypes<T extends { archetype: string; name: string }>(
  archetypes: T[],
  profiles: { name: string; note?: string }[]
): (T & { supplied?: string })[] {
  const remaining = [...archetypes];
  const paired: (T & { supplied?: string })[] = [];

  for (const profile of profiles) {
    const blob = `${profile.name} ${profile.note || ""}`;
    let idx = -1;
    for (const sig of ARCHETYPE_SIGNALS) {
      if (!sig.test.test(blob)) continue;
      idx = remaining.findIndex((a) => sig.wants.test(a.archetype) || sig.wants.test(a.name));
      if (idx !== -1) break;
    }
    if (idx === -1) idx = 0;
    const [match] = remaining.splice(idx, 1);
    if (match) paired.push({ ...match, supplied: profile.name });
  }

  return [...paired, ...remaining];
}

/* ------------------------------------------------------------------ */
/* strategy                                                            */
/* ------------------------------------------------------------------ */

export function buildStrategy(project: Project, pkg: PackageDef): Strategy {
  const { key: categoryKey, playbook } = resolveCategory(project.category || project.description);
  const rng = mulberry32(hashString(project.id + "strategy"));

  const heroes = project.products.filter((p) => p.tier === "hero");
  const slow = project.products.filter((p) => p.tier === "slow");
  const audience = project.audience?.trim() || "your customers";

  const t: TokenBag = {
    brand: project.name,
    product: heroes[0]?.name || project.products[0]?.name || project.name,
    category: categoryNoun(categoryKey),
    audience,
    benefit: pick(rng, playbook.benefits),
    alt: "the cheaper option",
    word: keyword(heroes[0]?.name || project.name),
    n: pick(rng, NUMBERS),
    city: project.market || "your area",
  };

  const positioning = fill(pick(rng, playbook.positioning), t);
  const oneLiner = project.tagline?.trim()
    ? project.tagline.trim()
    : fill(`${project.name} helps ${audience} get ${t.benefit}.`, t);

  // Competitors: map any names the user supplied onto real archetypes.
  const named = (project.competitorsInput || "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  const profiles = (project.competitorProfiles || []).filter((p) => (p.name || "").trim());
  const asProfiles = profiles.length ? profiles : named.map((n) => ({ name: n, note: undefined }));
  const competitors = assignArchetypes(playbook.competitors, asProfiles).map(({ supplied, ...c }) => {
    if (!supplied) return c;
    const profile = asProfiles.find((p) => p.name === supplied);
    return {
      ...c,
      name: `${supplied} — ${c.archetype}`,
      gap: profile?.note ? `${c.gap} Observed: ${profile.note}` : c.gap,
    };
  });

  // Pillar shares blend the category tilt with the global defaults.
  const goal = getGoal(project.goal || DEFAULT_GOAL);
  const weights: Record<string, number> = {};
  for (const p of PILLARS) {
    const base = playbook.pillarWeights?.[p.key] ?? p.defaultShare;
    weights[p.key] = base * (goal.weights[p.key] ?? 1);
  }
  const wSum = Object.values(weights).reduce((a, b) => a + b, 0);
  const pillars = PILLARS.map((p) => ({
    key: p.key,
    name: p.name,
    description: p.description,
    share: Math.round((weights[p.key] / wSum) * 100) / 100,
    funnel: p.funnel,
  }));

  const segments = [...playbook.segments];
  if (project.audience?.trim()) {
    segments.unshift({
      name: "Your stated core audience",
      description: project.audience.trim(),
      trigger: "Actively looking right now, in market this month.",
      objection: playbook.objections[0],
    });
  }

  const brandTag = project.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const hashtagSets: Record<string, string[]> = {
    reach: playbook.hashtags.broad,
    niche: playbook.hashtags.niche,
    community: playbook.hashtags.community,
    branded: [brandTag, `${brandTag}${new Date().getFullYear()}`].filter(Boolean),
  };

  const slowNames = slow.map((p) => p.name);
  const heroNames = heroes.map((p) => p.name);

  return {
    generatedAt: new Date().toISOString(),
    engine: "koala-strategy-v1",
    positioning,
    oneLiner,
    goal: goal.label,
    goalKpi: goal.kpi,
    differentiators: [
      ...(project.description
        ? [`Stated advantage: ${sentence(project.description.split(/[.!?]/)[0] || project.description).slice(0, 140)}`]
        : []),
      ...playbook.differentiators,
    ].slice(0, 6),
    audienceSegments: segments.slice(0, 5),
    competitors,
    pillars,
    weeks: WEEK_ARCS.map((w) => ({
      week: w.week,
      name: w.name,
      objective: w.objective,
      focus: w.focus,
      kpi: w.kpi,
    })),
    hashtagSets,
    postingTimes: pkg.slots.map((s) => `${s.time} — ${s.label}: ${s.intent}`),
    kpis: playbook.kpis,
    slowMoverPlan: playbook.slowMoverTactics.map((tac) =>
      slowNames.length ? `${tac} (applies to: ${slowNames.join(", ")})` : tac
    ),
    heroPlan: playbook.heroTactics.map((tac) =>
      heroNames.length ? `${tac} (hero: ${heroNames.join(", ")})` : tac
    ),
  };
}

/* ------------------------------------------------------------------ */
/* calendar                                                            */
/* ------------------------------------------------------------------ */

function formatFor(
  pillar: PillarKey,
  platform: string,
  rng: Rng,
  isVideo: boolean,
  avoid: PostFormat[] = [],
  allowed: string[] = []
): PostFormat {
  if (isVideo) return "video";
  const profile = PLATFORM_PROFILES[platform] || PLATFORM_PROFILES.instagram;
  const prefs: Record<PillarKey, PostFormat[]> = {
    authority: ["carousel", "carousel", "reel", "static"],
    product: ["static", "carousel", "reel"],
    proof: ["static", "carousel", "reel"],
    story: ["reel", "static", "carousel"],
    offer: ["static", "reel", "carousel"],
    community: ["static", "story", "static"],
    objection: ["carousel", "static", "reel"],
  };
  // "video" is reserved for scheduled video days so it always carries a script.
  // Everything else falls back to the platform's best non-video format.
  const byMix = allowed.length ? profile.formats.filter((f) => allowed.includes(f)) : profile.formats;
  const usable = (byMix.length ? byMix : profile.formats).filter((f) => f !== "video") as PostFormat[];
  const candidates = prefs[pillar].filter((f) => usable.includes(f));
  // Keep a single day visually varied: prefer a format not already used today.
  const fresh = candidates.filter((f) => !avoid.includes(f));
  if (fresh.length) return pick(rng, fresh) as PostFormat;
  if (candidates.length) return pick(rng, candidates) as PostFormat;
  const freshAllowed = usable.filter((f) => !avoid.includes(f));
  return ((freshAllowed[0] || usable[0] || "static") as PostFormat);
}

function productForPillar(
  pillar: PillarKey,
  week: number,
  rng: Rng,
  heroes: Product[],
  slow: Product[],
  core: Product[]
): Product | null {
  const needsProduct: PillarKey[] = ["product", "offer", "objection", "proof"];
  if (!needsProduct.includes(pillar)) {
    return rng() < 0.25 ? pick(rng, [...heroes, ...core, ...slow].filter(Boolean)) || null : null;
  }
  // Week 3 is the conversion push: hero heavy, with deliberate slow-mover rescues.
  if (week === 3 && slow.length && rng() < 0.4) return pick(rng, slow);
  if (week === 4 && slow.length && rng() < 0.25) return pick(rng, slow);
  if (heroes.length && rng() < 0.55) return pick(rng, heroes);
  const all = [...heroes, ...core, ...slow];
  return all.length ? pick(rng, all) : null;
}

function buildCaption(
  rng: Rng,
  pillar: PillarKey,
  t: TokenBag,
  playbook: (typeof CATEGORIES)[string],
  project: Project,
  product: Product | null,
  hook: string
): string {
  const objection = pick(rng, playbook.objections);
  const proof = pick(rng, playbook.proofPoints);
  const diff = shuffle(rng, playbook.differentiators).slice(0, 3);
  const body =
    (playbook.bodies[pillar] && playbook.bodies[pillar]!.length
      ? fill(pick(rng, playbook.bodies[pillar]!), t)
      : "") ||
    fill(
      `Here is the short version: ${t.brand} exists so ${t.audience} get ${t.benefit} without the usual compromises.`,
      t
    );

  const bullets = diff.map((d) => `• ${fill(d, t)}`).join("\n");
  const productLine = product
    ? `${product.name}${product.price ? ` — ${product.price}` : ""}${
        product.description ? `. ${sentence(product.description)}` : ""
      }`
    : "";

  const cta = fill(pick(rng, [...playbook.ctas, ...UNIVERSAL_CTAS]), t);

  const frameworks: Record<PillarKey, () => string> = {
    authority: () => [hook, "", body, "", bullets, "", cta].join("\n"),
    product: () =>
      [hook, "", productLine || body, "", bullets, "", cta].filter((x) => x !== undefined).join("\n"),
    proof: () =>
      [hook, "", body, "", `What we can actually back up: ${proof.toLowerCase()}.`, "", cta].join("\n"),
    story: () => [hook, "", body, "", `That is the standard. It is why ${t.brand} looks the way it does.`, "", cta].join("\n"),
    offer: () =>
      [hook, "", productLine || body, "", bullets, "", `${cta}`].join("\n"),
    community: () => [hook, "", body, "", "Comment below — we read all of them and reply to most.", "", cta].join("\n"),
    objection: () =>
      [
        hook,
        "",
        `The honest concern: ${objection.toLowerCase()}.`,
        "",
        body,
        "",
        cta,
      ].join("\n"),
  };

  return frameworks[pillar]().replace(/\n{3,}/g, "\n\n").trim();
}

function buildVideoScript(
  rng: Rng,
  pillar: PillarKey,
  t: TokenBag,
  playbook: (typeof CATEGORIES)[string],
  hook: string,
  style?: VideoStyle,
  // The day number, so a mixed selection alternates across the month rather
  // than landing on the same treatment every time.
  seed = 0
) {
  const idea = pick(rng, playbook.videoIdeas);
  return [
    `CONCEPT: ${idea}`,
    "",
    `0.0–1.2s  HOOK (on screen + spoken): "${hook}"`,
    `1.2–4.0s  CONTEXT: establish the subject in one wide shot. No talking over it.`,
    `4.0–12s   BODY: three quick cuts showing the detail that proves the claim.`,
    `12–20s    TURN: the moment that changes their mind. Hold this shot longest.`,
    `20–26s    PAYOFF: the result, clean and well lit.`,
    `26–30s    CTA: "${fill(pick(rng, playbook.ctas), t)}" — text on screen, hold 2s.`,
    "",
    ...videoStyleNotes(style, seed),
    `LOOP: final frame should visually match the first frame so it loops seamlessly.`,
  ].join("\n");
}

export function buildCalendar(
  project: Project,
  strategy: Strategy,
  pkg: PackageDef,
  startDate: Date
): Omit<Post, "id" | "projectId">[] {
  const { key: categoryKey, playbook } = resolveCategory(project.category || project.description);
  const rng = mulberry32(hashString(project.id + "calendar"));

  const heroes = project.products.filter((p) => p.tier === "hero");
  const slow = project.products.filter((p) => p.tier === "slow");
  const core = project.products.filter((p) => p.tier === "core");
  const platforms = project.platforms.length ? project.platforms : ["instagram"];

  const usedHooks = new Set<string>();
  const usedVisuals: string[] = [];
  const usedTypes: string[] = [];
  const goal = getGoal(project.goal || DEFAULT_GOAL);
  const allowedFormats = mixToFormats(project.contentMix || DEFAULT_MIX);

  // Keep every post inside the brand theme family so the month reads as one look.
  const themeLayouts = THEME_LAYOUTS[project.brandTheme] || [];
  const inTheme = playbook.visuals.filter((v) => themeLayouts.includes(v));
  const layoutFamily = inTheme.length >= 3 ? inTheme : themeLayouts.length ? themeLayouts : playbook.visuals;
  const posts: Omit<Post, "id" | "projectId">[] = [];

  const videoDays = new Set<number>();
  if (pkg.videosPerMonth > 0) {
    const step = pkg.videoEveryNDays || 2;
    for (let d = 1; d <= 30 && videoDays.size < pkg.videosPerMonth; d += step) videoDays.add(d);
  }

  for (let week = 1; week <= 5; week++) {
    const days: number[] = [];
    for (let d = (week - 1) * 7 + 1; d <= Math.min(week * 7, 30); d++) days.push(d);
    if (!days.length) continue;

    const arc = WEEK_ARCS[week - 1];
    const slotsInWeek = days.length * pkg.postsPerDay;
    const weekWeights: Record<string, number> = {};
    for (const [k, v] of Object.entries(arc.weights)) {
      weekWeights[k] = v * (goal.weights[k as PillarKey] ?? 1);
    }
    const counts = allocate(weekWeights, slotsInWeek);

    // Build the pool of pillars for this week, then place them on the days
    // whose natural rhythm suits them best.
    const pool: PillarKey[] = [];
    for (const [k, n] of Object.entries(counts)) for (let i = 0; i < n; i++) pool.push(k as PillarKey);
    let remaining = shuffle(rng, pool);

    for (const day of days) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (day - 1));
      const rhythm = DAY_RHYTHM[date.getDay()];
      const formatsToday: PostFormat[] = [];

      for (let slotIndex = 0; slotIndex < pkg.postsPerDay; slotIndex++) {
        if (!remaining.length) remaining = shuffle(rng, pool);

        // Prefer a pillar that matches today's rhythm, otherwise take the next.
        let idx = remaining.findIndex((p) => rhythm.lean.includes(p));
        if (idx === -1 || slotIndex > 0) {
          const alt = remaining.findIndex((p) => rhythm.lean.includes(p));
          idx = slotIndex === 0 && alt !== -1 ? alt : 0;
        }
        const pillar = remaining.splice(idx, 1)[0];

        const isVideo = videoDays.has(day) && slotIndex === 0;
        const platform = isVideo
          ? platforms.includes("tiktok")
            ? "tiktok"
            : platforms[0]
          : platforms[(day + slotIndex) % platforms.length];

        const product = productForPillar(pillar, week, rng, heroes, slow, core);

        const t: TokenBag = {
          brand: project.name,
          product: product?.name || heroes[0]?.name || project.name,
          category: categoryNoun(categoryKey),
          audience: project.audience?.trim() || "your customers",
          benefit: product?.benefits?.trim() || pick(rng, playbook.benefits),
          alt: "the cheaper option",
          word: keyword(product?.name || project.name),
          n: pick(rng, NUMBERS),
          city: project.market || "your area",
        };

        // Hook selection with month-wide de-duplication.
        const hookPool = [
          ...(playbook.hooks[pillar] || []),
          ...UNIVERSAL_HOOKS[pillar],
        ].map((h) => fill(h, t));
        let hook = "";
        const shuffled = shuffle(rng, hookPool);
        for (const h of shuffled) {
          if (!usedHooks.has(h)) {
            hook = h;
            break;
          }
        }
        if (!hook) hook = pick(rng, hookPool);
        usedHooks.add(hook);

        // Visual system, avoiding back-to-back repeats.
        const visualPool = layoutFamily.filter((v) => !usedVisuals.slice(-2).includes(v));
        const visualKey = pick(rng, visualPool.length ? visualPool : layoutFamily);
        usedVisuals.push(visualKey);
        const visual = VISUAL_SYSTEMS.find((v) => v.key === visualKey) || VISUAL_SYSTEMS[0];

        const profile = PLATFORM_PROFILES[platform] || PLATFORM_PROFILES.instagram;
        const format = formatFor(pillar, platform, rng, isVideo, formatsToday, allowedFormats);
        formatsToday.push(format);

        // The tactic: what this post actually is (UGC clip, unboxing, myth-buster…).
        const typePool = typesFor(pillar, format);
        const freshTypes = typePool.filter((c) => !usedTypes.slice(-8).includes(c.key));
        const contentType = pick(rng, freshTypes.length ? freshTypes : typePool);
        usedTypes.push(contentType.key);

        const tags = [
          ...shuffle(rng, strategy.hashtagSets.reach).slice(0, Math.ceil(profile.hashtagCount * 0.35)),
          ...shuffle(rng, strategy.hashtagSets.niche).slice(0, Math.ceil(profile.hashtagCount * 0.45)),
          ...shuffle(rng, strategy.hashtagSets.community).slice(0, Math.ceil(profile.hashtagCount * 0.2)),
          ...strategy.hashtagSets.branded,
        ]
          .filter(Boolean)
          .slice(0, profile.hashtagCount);

        const caption = buildCaption(rng, pillar, t, playbook, project, product, hook);
        const cta = fill(pick(rng, [...playbook.ctas, ...UNIVERSAL_CTAS]), t);

        const visualPrompt = [
          `${visual.name} composition for ${project.name}.`,
          `Subject: ${product ? product.name : `${project.name} brand statement`}.`,
          `Direction: ${visual.note}`,
          `Brand colours: primary ${project.colors.primary}, secondary ${project.colors.secondary}, background ${project.colors.background}.`,
          `Theme: ${project.brandTheme}. Tone: ${project.voice}.`,
          `Headline to render: "${hook}"`,
          `Aspect: ${format === "reel" || format === "video" || format === "story" ? "9:16 vertical" : "4:5 portrait"}.`,
          `Must feel like it belongs in a ${playbook.label} feed, not stock photography.`,
        ].join(" ");

        const visualDirection = isVideo
          ? [
              buildVideoScript(rng, pillar, t, playbook, hook, project.videoStyle as VideoStyle, day),
              "",
              `FORMAT: ${contentType.name}`,
              contentType.production,
            ].join("\n")
          : [
              `${visual.name} — ${visual.note}`,
              ``,
              `Focal point: ${product ? product.name : "the headline"}.`,
              `Copy on artwork: "${hook}"`,
              `Colour: ${project.colors.primary} as the accent, ${project.colors.background} as the field.`,
              `Do not: crowd the frame, use more than two type weights, or centre everything.`,
              ``,
              `FORMAT: ${contentType.name}`,
              contentType.production,
            ].join("\n");

        posts.push({
          day,
          date: date.toISOString(),
          slot: slotIndex,
          timeOfDay: pkg.slots[slotIndex]?.time || "18:00",
          platform,
          format,
          pillar,
          funnel: PILLAR_MAP[pillar].funnel,
          theme: `${arc.name} — ${rhythm.label}`,
          hook,
          caption,
          hashtags: tags,
          cta,
          visualDirection,
          visualPrompt,
          contentType: contentType.key,
          contentTypeName: contentType.name,
          contentWhy: contentType.why,
          productId: product?.id || null,
          productName: product?.name || null,
          layout: visualKey,
          status: "draft",
          postedAt: null,
          feedback: null,
          metrics: null,
          revisions: [],
          assetUrl: null,
          styleRef: null,
        });
      }
    }
  }

  return posts.sort((a, b) => a.day - b.day || a.slot - b.slot);
}

export function regenerateSinglePost(
  project: Project,
  strategy: Strategy,
  pkg: PackageDef,
  base: Post,
  prompt: string,
  mode: "caption" | "angle" | "visual" | "full"
): Partial<Post> {
  const { key: categoryKey, playbook } = resolveCategory(project.category || project.description);
  const rng = mulberry32(hashString(base.id + prompt + Date.now().toString()));
  const pillar = base.pillar as PillarKey;
  const product = project.products.find((p) => p.id === base.productId) || null;

  const t: TokenBag = {
    brand: project.name,
    product: product?.name || project.name,
    category: categoryNoun(categoryKey),
    audience: project.audience?.trim() || "your customers",
    benefit: product?.benefits?.trim() || pick(rng, playbook.benefits),
    alt: "the cheaper option",
    word: keyword(product?.name || project.name),
    n: pick(rng, NUMBERS),
    city: project.market || "your area",
  };

  const steer = prompt.trim();
  const hookPool = [...(playbook.hooks[pillar] || []), ...UNIVERSAL_HOOKS[pillar]].map((h) => fill(h, t));
  const newHook = steer && mode !== "visual" ? sentence(steer.split(/[.!?\n]/)[0]).slice(0, 120) : pick(rng, hookPool);

  if (mode === "caption") {
    return { caption: buildCaption(rng, pillar, t, playbook, project, product, base.hook) };
  }
  if (mode === "visual") {
    const family = THEME_LAYOUTS[project.brandTheme] || playbook.visuals;
    const visualPool = family.filter((v) => v !== base.layout);
    const visualKey = pick(rng, visualPool.length ? visualPool : family);
    const visual = VISUAL_SYSTEMS.find((v) => v.key === visualKey) || VISUAL_SYSTEMS[0];
    return {
      layout: visualKey,
      visualDirection: `${visual.name} — ${visual.note}\n\nSteer: ${steer || "fresh take, same message"}\nCopy on artwork: "${base.hook}"`,
      visualPrompt: `${visual.name} composition for ${project.name}. ${steer || visual.note} Brand colours ${project.colors.primary} on ${project.colors.background}. Headline: "${base.hook}".`,
    };
  }

  const hook = newHook;
  // A new angle means a new tactic too, otherwise it is the same post reworded.
  const pool = typesFor(pillar, base.format).filter((c) => c.key !== base.contentType);
  const ct = pick(rng, pool.length ? pool : typesFor(pillar, base.format));
  return {
    hook,
    contentType: ct.key,
    contentTypeName: ct.name,
    contentWhy: ct.why,
    caption: buildCaption(rng, pillar, t, playbook, project, product, hook),
    cta: fill(pick(rng, [...playbook.ctas, ...UNIVERSAL_CTAS]), t),
    visualPrompt: `${base.layout} composition for ${project.name}. ${steer || ""} Headline: "${hook}". Brand colours ${project.colors.primary} on ${project.colors.background}.`.trim(),
  };
}
