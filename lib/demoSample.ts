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
    language: "English",
    socials: [{ platform: "Instagram", url: "https://instagram.com/emberandoak" }],
    platforms: ["instagram", "tiktok"],
    products: [
      { id: "p1", name: "Midnight Oak Espresso", tier: "hero", price: "£16", description: "Chocolate forward, low acidity, built to survive milk.", benefits: "flat whites at home that taste like the good cafe", objection: "Will it work in my machine?", images: [] },
      { id: "p2", name: "Sunrise Filter", tier: "core", price: "£15", description: "Bright, citrus led single origin for pour over.", benefits: "a cleaner, brighter morning cup", objection: "Is light roast too sour?", images: [] },
      { id: "p3", name: "Decaf Ember", tier: "slow", price: "£15", description: "Sugarcane process decaf that does not taste like a compromise.", benefits: "an evening coffee that still tastes like coffee", objection: "Decaf always tastes flat.", images: [] },
    ],
    goals: ["More sales from social", "Clear slow-moving stock"],
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
