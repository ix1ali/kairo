// Koala strategy knowledge base.
// This is the marketing brain: pillars, funnel logic, per-category playbooks,
// competitor archetypes, hook libraries and caption frameworks.

export type PillarKey =
  | "authority"
  | "product"
  | "proof"
  | "story"
  | "offer"
  | "community"
  | "objection";

export const PILLARS: {
  key: PillarKey;
  name: string;
  description: string;
  funnel: "awareness" | "consideration" | "conversion" | "retention";
  defaultShare: number;
}[] = [
  {
    key: "authority",
    name: "Authority & Education",
    description: "Teach the thing only you can teach. Earns the follow before it earns the sale.",
    funnel: "awareness",
    defaultShare: 0.2,
  },
  {
    key: "product",
    name: "Product Spotlight",
    description: "Show the product doing its job. Detail, texture, use case, result.",
    funnel: "consideration",
    defaultShare: 0.2,
  },
  {
    key: "proof",
    name: "Social Proof",
    description: "Customers, results, reviews, before and after. Borrowed credibility.",
    funnel: "consideration",
    defaultShare: 0.15,
  },
  {
    key: "story",
    name: "Story & Behind the Scenes",
    description: "The human layer. Founder, process, craft, failures, standards.",
    funnel: "awareness",
    defaultShare: 0.15,
  },
  {
    key: "offer",
    name: "Offer & Conversion",
    description: "Direct ask. Clear offer, clear reason to act now, clear next step.",
    funnel: "conversion",
    defaultShare: 0.15,
  },
  {
    key: "community",
    name: "Community & Engagement",
    description: "Two-way posts. Polls, questions, culture, in-jokes, replies.",
    funnel: "retention",
    defaultShare: 0.1,
  },
  {
    key: "objection",
    name: "Objection Handling",
    description: "Name the doubt before they do. Price, trust, comparison, myths.",
    funnel: "consideration",
    defaultShare: 0.05,
  },
];

export const PILLAR_MAP = Object.fromEntries(PILLARS.map((p) => [p.key, p])) as Record<
  PillarKey,
  (typeof PILLARS)[number]
>;

export const WEEK_ARCS: {
  week: number;
  name: string;
  objective: string;
  focus: string;
  kpi: string;
  weights: Record<PillarKey, number>;
}[] = [
  {
    week: 1,
    name: "Plant the flag",
    objective:
      "Make it unmistakably clear who you are, who you are for, and what you stand against.",
    focus: "Positioning, authority and reach. Wide top of funnel.",
    kpi: "Reach and new followers",
    weights: { authority: 0.3, story: 0.22, product: 0.16, community: 0.14, proof: 0.1, objection: 0.05, offer: 0.03 },
  },
  {
    week: 2,
    name: "Earn the trust",
    objective: "Convert attention into belief with proof, education and early objection killing.",
    focus: "Credibility and consideration. Mid funnel.",
    kpi: "Saves and profile visits",
    weights: { proof: 0.28, authority: 0.22, product: 0.2, objection: 0.14, story: 0.08, community: 0.05, offer: 0.03 },
  },
  {
    week: 3,
    name: "Make the offer",
    objective: "Monetise the trust you built. Hero products pushed hard, slow movers rescued.",
    focus: "Conversion. Bottom funnel with proof stacked underneath.",
    kpi: "Link clicks, DMs and sales",
    weights: { offer: 0.32, product: 0.26, proof: 0.18, objection: 0.12, authority: 0.06, community: 0.04, story: 0.02 },
  },
  {
    week: 4,
    name: "Deepen the loop",
    objective: "Turn buyers into repeat buyers and repeat buyers into advocates.",
    focus: "Retention, community and UGC harvesting.",
    kpi: "Comments, shares and repeat purchase",
    weights: { community: 0.26, proof: 0.22, story: 0.2, product: 0.14, authority: 0.1, offer: 0.06, objection: 0.02 },
  },
  {
    week: 5,
    name: "Momentum bridge",
    objective: "Re-run your best angle and pre-sell next month so you never restart from zero.",
    focus: "Compounding. Relaunch winners, tease what is next.",
    kpi: "Repeat performance of best posts",
    weights: { offer: 0.28, proof: 0.24, authority: 0.2, product: 0.14, story: 0.08, community: 0.06, objection: 0 },
  },
];

// Day-of-week rhythm. Index 0 = Sunday.
export const DAY_RHYTHM: { label: string; lean: PillarKey[]; note: string }[] = [
  { label: "Sunday", lean: ["story", "community"], note: "Reflective, human, low pressure. Slow scroll day." },
  { label: "Monday", lean: ["authority", "product"], note: "Intent is highest. Lead with usefulness." },
  { label: "Tuesday", lean: ["authority", "objection"], note: "Best save rate of the week. Teach hard." },
  { label: "Wednesday", lean: ["product", "proof"], note: "Mid-week consideration peak. Show the goods." },
  { label: "Thursday", lean: ["proof", "offer"], note: "Trust is warm. Stack proof before Friday's ask." },
  { label: "Friday", lean: ["offer", "product"], note: "Wallets open. Make the clearest offer of the week." },
  { label: "Saturday", lean: ["community", "story"], note: "Lifestyle and culture. Sell without selling." },
];

export const UNIVERSAL_HOOKS: Record<PillarKey, string[]> = {
  authority: [
    "Nobody tells you this about {category}, so we will.",
    "{n} things we would fix first if we were starting over in {category}.",
    "The {category} advice everyone repeats, and why it is wrong.",
    "Read this before you spend another dollar on {category}.",
    "How to tell a good {product} from an expensive one.",
    "The 30 second test that tells you if your {product} is any good.",
    "What {audience} get wrong about {benefit}.",
    "Years in {category} taught us one thing that actually matters.",
    "Save this before you buy your next {product}.",
    "The part of {category} nobody puts on the label.",
    "If {benefit} matters to you, start here.",
    "The checklist we use before anything leaves {brand}.",
  ],
  product: [
    "This is {product}. Here is exactly what it does.",
    "Every detail in {product}, and why it is there.",
    "{product}, up close.",
    "Why {product} looks like that.",
    "The one thing {product} does that nothing else does.",
    "{product} versus the thing you are using right now.",
    "Three ways {audience} use {product} every week.",
    "If you only take one thing from us, take {product}.",
    "What is actually inside {product}.",
    "The {product} everyone asks about in our DMs.",
    "{product} in real light, no retouching.",
    "Made for {audience} who are tired of settling.",
  ],
  proof: [
    "We did not say this. They did.",
    "Real result, no filter.",
    "This is what {benefit} looks like after 30 days.",
    "{n} people told us the same thing this month.",
    "Before. After. Same person, {n} weeks apart.",
    "The review we did not expect.",
    "Screenshot dump: what {audience} actually say about us.",
    "One customer. One sentence. That is the whole post.",
    "Proof beats promises. Here is ours.",
    "We asked for honest feedback. We got it.",
    "The number that made us keep going.",
    "Sent to us this week, unprompted.",
  ],
  story: [
    "How {brand} actually started.",
    "The version of {product} we threw away.",
    "A normal day at {brand}.",
    "The standard we refuse to lower.",
    "What we got wrong in year one.",
    "Meet the person who makes this.",
    "Why we said no to the cheaper option.",
    "The decision that shaped {brand}.",
    "This takes longer. We do it anyway.",
    "Behind {product}: the part you never see.",
    "We almost quit here.",
    "The rule we wrote on the wall.",
  ],
  offer: [
    "This is the one to start with, and it is live now.",
    "Ends when it ends: {product}.",
    "If you have been waiting, this is the moment.",
    "Two ways to get {product} this week.",
    "The bundle that makes the most sense.",
    "You have seen it all month. Here is the link.",
    "Low stock, no restock date.",
    "Everything you need in one order.",
    "The offer we only run once a month.",
    "Stop scrolling. Start with {product}.",
    "New in, and it will not sit long.",
    "Your first {product} should be this one.",
  ],
  community: [
    "Settle this for us.",
    "Which one, and why?",
    "Tell us the truth in the comments.",
    "Tag the person who needs this.",
    "Two options. Pick one.",
    "What should we make next?",
    "Unpopular opinion about {category}:",
    "Describe {brand} in one word.",
    "We read every DM. Here is the most common one.",
    "If you know, you know.",
    "Rate this out of ten, be brutal.",
    "The debate that will not die in our comments.",
  ],
  objection: [
    "It is too expensive. Let us talk about that.",
    "Why {product} costs what it costs.",
    "The honest reason we are not the cheapest.",
    "Who {product} is not for.",
    "{product} versus {alt}: an honest comparison.",
    "The myth about {category} that costs {audience} money.",
    "Three reasons people hesitate, and the straight answer to each.",
    "You do not need this if...",
    "What happens if it does not work for you.",
    "Cheap now, expensive later. Here is the math.",
    "The question we get before every single order.",
    "No, it is not the same as the one you saw for half the price.",
  ],
};

export const UNIVERSAL_CTAS = [
  "Save this for when you need it.",
  "Comment {word} and we will send the link.",
  "Link in bio, it takes 30 seconds.",
  "Share this with someone who has been looking.",
  "Follow for the rest of this series.",
  "DM us {word} and we will sort you out.",
  "Tap the link before it is gone.",
  "Tell us what you would pick in the comments.",
  "Screenshot this. You will want it later.",
  "Shop it now, link in bio.",
  "Send this to the person you would bring.",
  "Book in through the link while slots are open.",
];

export const VISUAL_SYSTEMS: { key: string; name: string; note: string }[] = [
  { key: "hero-statement", name: "Hero statement", note: "One line of huge type on a brand colour field. Product small and confident." },
  { key: "product-cutout", name: "Product cutout", note: "Product isolated on gradient with a soft floor shadow and one benefit tag." },
  { key: "split-compare", name: "Split compare", note: "Frame split in two. Left problem, right solution. High contrast." },
  { key: "quote-card", name: "Quote card", note: "Customer quote as the entire design. Name small, stars smaller." },
  { key: "editorial-photo", name: "Editorial photo", note: "Full bleed photograph, type in the safe corner, heavy negative space." },
  { key: "carousel-teach", name: "Teaching carousel", note: "Cover carries the number, one idea per slide, final slide is the CTA." },
  { key: "data-tile", name: "Data tile", note: "One big number, one line of context, nothing else." },
  { key: "grid-flatlay", name: "Grid flat lay", note: "Top down arrangement on a brand coloured surface, symmetrical." },
  { key: "before-after", name: "Before and after", note: "Split composition, identical framing, labelled corners." },
  { key: "sticker-collage", name: "Sticker collage", note: "Cut paper energy, tape, handwriting, deliberately imperfect." },
  { key: "bold-type", name: "Bold type poster", note: "Type only. Tight tracking, three weights, one accent colour." },
  { key: "lifestyle-context", name: "Lifestyle in context", note: "Product mid use by a real person, candid framing, natural light." },
];

export const PLATFORM_PROFILES: Record<
  string,
  { name: string; formats: string[]; captionLength: "short" | "medium" | "long"; hashtagCount: number; note: string }
> = {
  instagram: { name: "Instagram", formats: ["reel", "carousel", "static", "story"], captionLength: "medium", hashtagCount: 12, note: "Reels for reach, carousels for saves, statics for brand." },
  tiktok: { name: "TikTok", formats: ["video", "reel"], captionLength: "short", hashtagCount: 5, note: "Hook inside 1.2 seconds. Native, unpolished, sound led." },
  facebook: { name: "Facebook", formats: ["static", "carousel", "video"], captionLength: "medium", hashtagCount: 3, note: "Older buyer, longer copy, strong local intent." },
  linkedin: { name: "LinkedIn", formats: ["static", "carousel", "video"], captionLength: "long", hashtagCount: 4, note: "Insight and process. The first two lines decide everything." },
  x: { name: "X", formats: ["static", "video"], captionLength: "short", hashtagCount: 2, note: "Punchy, opinionated, no fluff." },
  pinterest: { name: "Pinterest", formats: ["static", "carousel"], captionLength: "medium", hashtagCount: 6, note: "A search engine, not a feed. Keyword the description." },
  youtube: { name: "YouTube Shorts", formats: ["video", "reel"], captionLength: "short", hashtagCount: 3, note: "Retention curve is everything. Loop the ending." },
  threads: { name: "Threads", formats: ["static", "carousel"], captionLength: "short", hashtagCount: 1, note: "Conversational. Ask, do not broadcast." },
};

export interface CategoryPlaybook {
  label: string;
  emoji: string;
  aka: string[];
  positioning: string[];
  differentiators: string[];
  segments: { name: string; description: string; trigger: string; objection: string }[];
  competitors: { name: string; archetype: string; strength: string; gap: string; counterMove: string }[];
  objections: string[];
  proofPoints: string[];
  benefits: string[];
  hooks: Partial<Record<PillarKey, string[]>>;
  bodies: Partial<Record<PillarKey, string[]>>;
  visuals: string[];
  videoIdeas: string[];
  hashtags: { broad: string[]; niche: string[]; community: string[] };
  ctas: string[];
  kpis: { name: string; target: string }[];
  slowMoverTactics: string[];
  heroTactics: string[];
  pillarWeights?: Partial<Record<PillarKey, number>>;
}
