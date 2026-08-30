import type { PostFormat } from "../types";
import type { PillarKey } from "./knowledge";

/**
 * The tactic layer.
 *
 * Pillars say *why* a post exists (authority, proof, offer…). Content types say
 * *what it actually is* — a UGC clip, an unboxing, a myth-buster, a comparison.
 * Without this layer every "proof" post is the same testimonial card; with it a
 * month covers the full range of formats that actually perform.
 */

export interface ContentType {
  key: string;
  name: string;
  pillars: PillarKey[];
  formats: PostFormat[];
  why: string;
  production: string;
  effort: "low" | "medium" | "high";
  ugc?: boolean;
}

export const CONTENT_TYPES: ContentType[] = [
  /* ---------------- creator & customer made ---------------- */
  {
    key: "ugc-review",
    name: "UGC review video",
    pillars: ["proof", "product"],
    formats: ["reel", "video"],
    why: "Reads as a recommendation, not an ad. The single highest-converting format on paid and organic.",
    production:
      "Creator films handheld, front camera, natural light, one take. Talking head opens with the problem, product enters at 3s, honest verdict at the end. No brand logo in the first 3 seconds.",
    effort: "medium",
    ugc: true,
  },
  {
    key: "ugc-unboxing",
    name: "Unboxing",
    pillars: ["product", "proof"],
    formats: ["reel", "video"],
    why: "Satisfies curiosity about what actually arrives, and kills the 'is it worth it' doubt.",
    production:
      "Top-down or over-the-shoulder. Real packaging, real hands, no cuts during the reveal. Sound on — tape, tissue, click. Hold the final product still for 2 seconds.",
    effort: "low",
    ugc: true,
  },
  {
    key: "ugc-getready",
    name: "Get ready with me",
    pillars: ["story", "product"],
    formats: ["reel", "video"],
    why: "Native to the feed. Sells the product inside a routine instead of in isolation.",
    production:
      "Mirror or tripod, one continuous take, casual voiceover. Product appears naturally mid-routine. Keep the outfit or setting consistent with the brand palette.",
    effort: "medium",
    ugc: true,
  },
  {
    key: "customer-feature",
    name: "Customer feature",
    pillars: ["proof", "community"],
    formats: ["carousel", "static", "reel"],
    why: "Rewards the customer publicly, which produces more of the same content for free.",
    production:
      "Repost their photo with permission, credit the handle clearly, add one line about what they used and why. Never crop out their framing.",
    effort: "low",
    ugc: true,
  },
  {
    key: "review-dump",
    name: "Review screenshot dump",
    pillars: ["proof"],
    formats: ["carousel", "static"],
    why: "Volume of proof beats one polished testimonial. Repetition of the same praise is the persuasion.",
    production:
      "Six to nine real screenshots on a plain brand-colour field. Highlight the repeated phrase across them. Do not retouch the text.",
    effort: "low",
    ugc: true,
  },

  /* ---------------- teaching ---------------- */
  {
    key: "tutorial",
    name: "Tutorial / how-to",
    pillars: ["authority", "product"],
    formats: ["reel", "carousel", "video"],
    why: "Highest save rate of any format. Saves tell the algorithm the post was worth keeping.",
    production:
      "Numbered steps, one per cut. Show hands doing the thing. Text on screen mirrors the voiceover. End on the finished result, not on a logo.",
    effort: "medium",
  },
  {
    key: "mistakes",
    name: "Common mistakes",
    pillars: ["authority", "objection"],
    formats: ["carousel", "reel"],
    why: "People engage with what they might be getting wrong far more than with what to do right.",
    production:
      "Cover states the number. One mistake per slide with the fix underneath. Final slide is the offer to help.",
    effort: "low",
  },
  {
    key: "myth-buster",
    name: "Myth buster",
    pillars: ["authority", "objection"],
    formats: ["reel", "carousel", "static"],
    why: "Contradiction stops the scroll, and correcting a myth positions you as the expert for free.",
    production:
      "State the myth in full on screen, pause, then strike it through. Give the real answer with one piece of evidence. Keep it under 20 seconds.",
    effort: "low",
  },
  {
    key: "explainer",
    name: "Voiceover explainer",
    pillars: ["authority"],
    formats: ["reel", "video"],
    why: "Carries a complex idea in under 30 seconds without needing anyone on camera.",
    production:
      "B-roll of the product or process, clean voiceover, burned-in captions. Cut every 2 to 3 seconds. Loop the final frame to the first.",
    effort: "medium",
  },
  {
    key: "data-post",
    name: "Data or stat post",
    pillars: ["authority", "proof"],
    formats: ["static", "carousel"],
    why: "A single number is the most screenshot-able thing you can publish.",
    production:
      "One enormous figure, one line of context, nothing else. Cite the source in small type at the bottom.",
    effort: "low",
  },
  {
    key: "faq",
    name: "FAQ answer",
    pillars: ["objection", "authority"],
    formats: ["static", "carousel", "reel"],
    why: "Answers the thing blocking the sale, and the same question keeps arriving in DMs.",
    production:
      "Question as the headline in quotes, answer below in plain language. One question per post — never batch them.",
    effort: "low",
  },

  /* ---------------- product ---------------- */
  {
    key: "close-up",
    name: "Product close-up",
    pillars: ["product"],
    formats: ["reel", "static"],
    why: "Detail is what justifies the price. Texture reads as quality faster than any claim.",
    production:
      "Macro or near-macro, slow push in, single light source with a hard edge. Show the stitch, the grain, the finish.",
    effort: "medium",
  },
  {
    key: "how-its-made",
    name: "How it's made",
    pillars: ["story", "product"],
    formats: ["reel", "video", "carousel"],
    why: "Process content builds price tolerance. Seeing the work makes the cost feel earned.",
    production:
      "Follow one item from raw material to finished. Real workspace, real noise, no music over the sound of the process.",
    effort: "high",
  },
  {
    key: "flat-lay",
    name: "Flat lay / range shot",
    pillars: ["product", "offer"],
    formats: ["static", "carousel"],
    why: "Shows the range at a glance and anchors the bundle idea.",
    production:
      "Top-down on a brand-coloured surface, even light, symmetrical spacing. Odd number of objects.",
    effort: "low",
  },
  {
    key: "comparison",
    name: "Us versus the alternative",
    pillars: ["objection", "product"],
    formats: ["carousel", "static", "reel"],
    why: "Buyers are already comparing. Framing the comparison yourself decides which criteria matter.",
    production:
      "Split frame, identical conditions on both sides, label them plainly. Be honest about where the alternative wins — it makes the rest credible.",
    effort: "medium",
  },
  {
    key: "before-after",
    name: "Before and after",
    pillars: ["proof", "product"],
    formats: ["static", "reel", "carousel"],
    why: "The fastest way to communicate a result with no words at all.",
    production:
      "Identical framing, lighting and distance. Label the time elapsed. Never retouch — the credibility is the whole point.",
    effort: "medium",
  },
  {
    key: "use-cases",
    name: "Three ways to use it",
    pillars: ["product", "authority"],
    formats: ["reel", "carousel"],
    why: "Multiplies perceived value without changing the price.",
    production:
      "Three quick scenarios, hard cut between each, same product throughout. Number them on screen.",
    effort: "medium",
  },

  /* ---------------- story ---------------- */
  {
    key: "founder-story",
    name: "Founder story",
    pillars: ["story"],
    formats: ["reel", "video", "carousel"],
    why: "People buy from people. A face attached to a brand raises trust more than any badge.",
    production:
      "Talking to camera, seated, real environment. Start mid-story, not with 'hi guys'. Two minutes filmed, thirty seconds used.",
    effort: "medium",
  },
  {
    key: "bts",
    name: "Behind the scenes",
    pillars: ["story", "community"],
    formats: ["reel", "story", "video"],
    why: "Unpolished content outperforms polished content on reach because it feels like a person, not a brand.",
    production:
      "Phone footage, no colour grade, ambient sound. Show the messy part — the prep, the reject pile, the early start.",
    effort: "low",
  },
  {
    key: "day-in-life",
    name: "Day in the life",
    pillars: ["story", "community"],
    formats: ["reel", "video"],
    why: "Long watch time and strong parasocial pull, which is what turns followers into repeat buyers.",
    production:
      "Timestamp each clip. Six to ten short segments across one real day. Keep the ending anticlimactic and honest.",
    effort: "medium",
  },
  {
    key: "team-spotlight",
    name: "Team spotlight",
    pillars: ["story", "community"],
    formats: ["static", "carousel", "reel"],
    why: "Humanises the operation and gives staff something to share, which extends reach for free.",
    production:
      "Portrait plus one question answered in their own words. Keep their phrasing, including the imperfect bits.",
    effort: "low",
  },
  {
    key: "standards",
    name: "The standard we hold",
    pillars: ["story", "authority"],
    formats: ["static", "reel"],
    why: "Stating what you refuse to do defines the brand more sharply than stating what you do.",
    production:
      "One sentence, big type, brand colour field. Or one shot of the thing being rejected.",
    effort: "low",
  },

  /* ---------------- conversion ---------------- */
  {
    key: "offer-launch",
    name: "Offer announcement",
    pillars: ["offer"],
    formats: ["static", "reel", "carousel"],
    why: "Clarity converts. One offer, one price, one action.",
    production:
      "Offer as the headline, deadline visible, single call to action. Nothing else in the frame.",
    effort: "low",
  },
  {
    key: "bundle",
    name: "Bundle logic",
    pillars: ["offer", "product"],
    formats: ["carousel", "static"],
    why: "Raises average order value by removing the decision instead of dropping the price.",
    production:
      "Show the items together, then the combined price against the separate total. Explain why these three belong together.",
    effort: "low",
  },
  {
    key: "restock",
    name: "Restock / back in stock",
    pillars: ["offer", "product"],
    formats: ["story", "static", "reel"],
    why: "Scarcity that is actually true. Converts the people who already wanted it.",
    production:
      "Say what came back and how fast it went last time. Keep it to one line and a link.",
    effort: "low",
  },
  {
    key: "countdown",
    name: "Countdown",
    pillars: ["offer"],
    formats: ["story", "static"],
    why: "Deadlines move people who have already decided but keep postponing.",
    production:
      "Same layout each day with only the number changing. Consistency is what makes it register.",
    effort: "low",
  },
  {
    key: "objection-answer",
    name: "Price justification",
    pillars: ["objection", "offer"],
    formats: ["carousel", "reel", "static"],
    why: "The price objection is rarely about money. It is about not seeing where the money went.",
    production:
      "Break the cost down into its parts, or reframe it as cost per use. Show the component that costs the most.",
    effort: "medium",
  },

  /* ---------------- community ---------------- */
  {
    key: "this-or-that",
    name: "This or that poll",
    pillars: ["community"],
    formats: ["story", "static"],
    why: "Lowest-friction interaction there is, and the replies tell you what to make next.",
    production: "Two options, equal visual weight, one question. Nothing to read beyond the choice.",
    effort: "low",
  },
  {
    key: "hot-take",
    name: "Hot take",
    pillars: ["community", "authority"],
    formats: ["static", "reel"],
    why: "A defensible opinion generates comments, and comments generate reach.",
    production:
      "State the opinion flatly with no hedging. Be ready to reply to every disagreement in the comments.",
    effort: "low",
  },
  {
    key: "qa",
    name: "Q&A reply",
    pillars: ["community", "authority"],
    formats: ["reel", "story", "static"],
    why: "Answering publicly turns one person's question into content for everyone with the same doubt.",
    production:
      "Screenshot the question at the top, answer to camera or in text below. Keep the asker anonymous unless they agreed.",
    effort: "low",
  },
  {
    key: "trend",
    name: "Trend or sound jack",
    pillars: ["community", "story"],
    formats: ["reel", "video"],
    why: "Borrowed distribution. The audio does the reach work so your idea only has to be relevant.",
    production:
      "Use the trending sound within its first week. Tie it to something genuinely about your product or your customers, never force it.",
    effort: "low",
  },
  {
    key: "giveaway",
    name: "Giveaway / collab",
    pillars: ["community", "offer"],
    formats: ["static", "reel", "carousel"],
    why: "Buys follower growth with product instead of ad spend, and a collab borrows another audience.",
    production:
      "Prize, entry rule, deadline, all in the image. One entry mechanic only. Announce the winner publicly.",
    effort: "medium",
  },
  {
    key: "meme",
    name: "Industry meme",
    pillars: ["community"],
    formats: ["static", "reel"],
    why: "Shares travel further than likes, and an in-joke signals you actually work in this field.",
    production:
      "Specific to your niche, never generic. If it needs explaining it does not work.",
    effort: "low",
  },
];

export const CONTENT_TYPE_MAP = Object.fromEntries(
  CONTENT_TYPES.map((c) => [c.key, c])
) as Record<string, ContentType>;

/** Content types that suit a pillar and a chosen post format. */
export function typesFor(pillar: PillarKey, format: PostFormat): ContentType[] {
  const exact = CONTENT_TYPES.filter((c) => c.pillars.includes(pillar) && c.formats.includes(format));
  if (exact.length) return exact;
  const byPillar = CONTENT_TYPES.filter((c) => c.pillars.includes(pillar));
  if (byPillar.length) return byPillar;
  return CONTENT_TYPES.filter((c) => c.formats.includes(format));
}

export const UGC_TYPES = CONTENT_TYPES.filter((c) => c.ugc);
