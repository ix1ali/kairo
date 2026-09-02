import { fail, json, requireUser } from "@/lib/api";
import { read } from "@/lib/db";
import { createProjectWithPlan, projectLimitFor } from "@/lib/projects";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

/** Seeds a fully specified example project so the dashboard can be explored immediately. */
export async function POST() {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const user = auth.user;

  if (user.subscriptionStatus !== "active" || !user.packageId) {
    return fail("Choose a package first.", 402);
  }
  const db = await read();
  if (db.projects.filter((p) => p.userId === user.id).length >= projectLimitFor(user)) {
    return fail("You have used all the projects on your plan.", 402);
  }

  const project = await createProjectWithPlan(user, {
    name: "Ember & Oak",
    tagline: "Specialty coffee without the gatekeeping.",
    category: "coffee",
    description:
      "A small-batch coffee roastery. We print the roast date on every bag, name the farm, and include a dial-in guide so the first cup is never wasted.",
    website: "https://emberandoak.example",
    brandTheme: "premium-dark",
    colors: { primary: "#E4732B", secondary: "#F2C14E", background: "#FFFFFF", text: "#FFF8F0" },
    voice: "Confident and direct",
    audience: "Home baristas aged 25 to 45 who just bought a grinder and want to stop wasting beans",
    market: "United Kingdom",
    language: "English",
    platforms: ["instagram", "tiktok"],
    socials: [
      { platform: "Instagram", url: "https://instagram.com/emberandoak" },
      { platform: "TikTok", url: "https://tiktok.com/@emberandoak" },
    ],
    goals: ["More sales from social", "Clear slow-moving stock", "Build brand authority"],
    competitorsInput: "Origin Coffee, Pact Coffee, local high street roasters",
    products: [
      {
        name: "Midnight Oak Espresso",
        tier: "hero",
        price: "£16",
        description: "Chocolate forward, low acidity, built to survive milk.",
        benefits: "flat whites at home that taste like the good cafe",
        objection: "Will it work in my machine?",
      },
      {
        name: "Sunrise Filter",
        tier: "core",
        price: "£15",
        description: "Bright, citrus led single origin for pour over.",
        benefits: "a cleaner, brighter morning cup",
        objection: "Is light roast too sour?",
      },
      {
        name: "Decaf Ember",
        tier: "slow",
        price: "£15",
        description: "Sugarcane process decaf that does not taste like a compromise.",
        benefits: "an evening coffee that still tastes like coffee",
        objection: "Decaf always tastes flat.",
      },
      {
        name: "Roaster's Sampler",
        tier: "core",
        price: "£38",
        description: "Three bags, three roast profiles, one price.",
        benefits: "find your roast without guessing",
        objection: "What if I do not like one of them?",
      },
    ],
  });

  return json({ project }, 201);
}
