import { PACKAGES } from "./plans";
import { buildCalendar, buildStrategy } from "./strategy/engine";
import type { Post, Project } from "./types";

/**
 * A fixed sample brand used for the marketing site. It runs through the exact
 * same engine the product uses, so what visitors see is genuinely what they get.
 */
export function demoProject(): Project {
  return {
    id: "demo-ember-oak",
    userId: "demo",
    name: "Ember & Oak",
    tagline: "Specialty coffee without the gatekeeping.",
    category: "coffee",
    description:
      "A small-batch roastery. Roast date on every bag, farm named, dial-in guide included so the first cup is never wasted.",
    website: "https://emberandoak.example",
    logoUrl: null,
    images: [],
    brandTheme: "premium-dark",
    colors: { primary: "#E4732B", secondary: "#F2C14E", background: "#12100E", text: "#FFF8F0" },
    voice: "Confident and direct",
    audience: "Home baristas aged 25 to 45 who just bought a grinder",
    market: "United Kingdom",
    locale: "en-GB",
    language: "English — British",
    socials: [{ platform: "Instagram", url: "https://instagram.com/emberandoak" }],
    platforms: ["instagram", "tiktok"],
    products: [
      { id: "p1", name: "Midnight Oak Espresso", tier: "hero", price: "£16", description: "Chocolate forward, low acidity, built to survive milk.", benefits: "flat whites at home that taste like the good cafe", objection: "Will it work in my machine?", images: [] },
      { id: "p2", name: "Sunrise Filter", tier: "core", price: "£15", description: "Bright, citrus led single origin for pour over.", benefits: "a cleaner, brighter morning cup", objection: "Is light roast too sour?", images: [] },
      { id: "p3", name: "Decaf Ember", tier: "slow", price: "£15", description: "Sugarcane process decaf that does not taste like a compromise.", benefits: "an evening coffee that still tastes like coffee", objection: "Decaf always tastes flat.", images: [] },
    ],
    goals: ["More sales from social", "Clear slow-moving stock"],
    goal: "sales",
    contentMix: { static: true, carousel: true, video: true, story: false },
    videoStyle: { captions: "burned", voice: "ai", talent: "product", sound: "trending" },
    competitorProfiles: [],
    competitorsInput: "",
    strategy: null,
    planStartDate: null,
    packageId: "starter",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  };
}

export function demoPlan(): { project: Project; posts: Post[] } {
  const project = demoProject();
  const pkg = PACKAGES[0];
  const start = new Date("2025-06-02T00:00:00.000Z");
  const strategy = buildStrategy(project, pkg);
  project.strategy = strategy;
  project.planStartDate = start.toISOString();
  const posts = buildCalendar(project, strategy, pkg, start).map((p, i) => ({
    ...p,
    id: `demo-${i}`,
    projectId: project.id,
  })) as Post[];
  return { project, posts };
}

/* ------------------------------------------------------------------ */
/* showcase                                                            */
/* ------------------------------------------------------------------ */

interface ShowcaseSeed {
  id: string;
  name: string;
  tagline: string;
  category: string;
  theme: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  audience: string;
  products: { name: string; tier: "hero" | "core" | "slow"; price: string; benefits: string }[];
}

const SHOWCASE_SEEDS: ShowcaseSeed[] = [
  {
    id: "sc-rhode",
    name: "Lumen Skin",
    tagline: "Fewer products, better formulated.",
    category: "beauty",
    theme: "minimal-editorial",
    colors: { primary: "#E8D5C4", secondary: "#B79C86", background: "#1A1613", text: "#FFF6EE" },
    audience: "People with sensitive skin who have reacted badly before",
    products: [{ name: "Barrier Repair Cream", tier: "hero", price: "$38", benefits: "skin that finally behaves" }],
  },
  {
    id: "sc-forge",
    name: "Forge Athletic",
    tagline: "Coaching that fits a real schedule.",
    category: "fitness",
    theme: "bold-loud",
    colors: { primary: "#E23E3E", secondary: "#FFB443", background: "#0D0D10", text: "#FFFFFF" },
    audience: "People aged 30 to 50 restarting training after years away",
    products: [{ name: "Foundations 12-Week", tier: "hero", price: "£249", benefits: "strength that shows up outside the gym" }],
  },
  {
    id: "sc-table",
    name: "Salt & Table",
    tagline: "Food worth leaving the house for.",
    category: "restaurant",
    theme: "warm-organic",
    colors: { primary: "#C7622B", secondary: "#E8B45C", background: "#16110D", text: "#FFF3E4" },
    audience: "Locals booking somewhere for a birthday or a date",
    products: [{ name: "The Sunday Roast", tier: "hero", price: "£28", benefits: "a night you talk about tomorrow" }],
  },
  {
    id: "sc-north",
    name: "Northline Supply",
    tagline: "Gear built better than it needs to be.",
    category: "ecommerce",
    theme: "premium-dark",
    colors: { primary: "#5B8DEF", secondary: "#8FE4F2", background: "#0A0D14", text: "#F2F6FF" },
    audience: "Commuters tired of replacing bags every two years",
    products: [{ name: "Ridgeline 24L", tier: "hero", price: "$189", benefits: "a bag you never have to replace" }],
  },
  {
    id: "sc-atelier",
    name: "Atelier Nord",
    tagline: "Fewer pieces, made properly.",
    category: "fashion",
    theme: "luxury-refined",
    colors: { primary: "#C9A96A", secondary: "#EADFC8", background: "#12100C", text: "#FBF7EF" },
    audience: "People done with fast fashion falling apart",
    products: [{ name: "The Merino Overshirt", tier: "hero", price: "£165", benefits: "clothes that survive the wash" }],
  },
  {
    id: "sc-ember",
    name: "Ember & Oak",
    tagline: "Specialty coffee without the gatekeeping.",
    category: "coffee",
    theme: "warm-organic",
    colors: { primary: "#E4732B", secondary: "#F2C14E", background: "#12100E", text: "#FFF8F0" },
    audience: "Home baristas who just bought a grinder",
    products: [{ name: "Midnight Oak Espresso", tier: "hero", price: "£16", benefits: "flat whites that taste like the good cafe" }],
  },
];

/** Two finished posts from each of six very different brands. */
export function showcaseSamples(): { project: Project; posts: Post[] }[] {
  const pkg = PACKAGES[0];
  const start = new Date("2025-06-02T00:00:00.000Z");

  return SHOWCASE_SEEDS.map((seed) => {
    const project: Project = {
      ...demoProject(),
      id: seed.id,
      name: seed.name,
      tagline: seed.tagline,
      category: seed.category,
      description: seed.tagline,
      brandTheme: seed.theme,
      colors: seed.colors,
      audience: seed.audience,
      platforms: ["instagram"],
      products: seed.products.map((p, i) => ({
        id: `${seed.id}-p${i}`,
        name: p.name,
        tier: p.tier,
        price: p.price,
        description: "",
        benefits: p.benefits,
        objection: "",
        images: [],
      })),
      strategy: null,
      planStartDate: start.toISOString(),
    };

    const strategy = buildStrategy(project, pkg);
    project.strategy = strategy;
    const all = buildCalendar(project, strategy, pkg, start).map((p, i) => ({
      ...p,
      id: `${seed.id}-${i}`,
      projectId: project.id,
    })) as Post[];

    // Keep the strip to one aspect ratio.
    const flat = all.filter((p) => p.format !== "reel" && p.format !== "video" && p.format !== "story");
    return { project, posts: flat.slice(0, 2) };
  });
}
