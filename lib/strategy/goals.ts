import type { IconName } from "@/components/icons/Ui";
import type { PillarKey } from "./knowledge";

/**
 * What the month is actually for.
 *
 * The same brand chasing sales and chasing reach should not get the same
 * calendar. The goal multiplies the pillar weights, so picking "more sales"
 * genuinely produces a different thirty days from picking "reach and views".
 */

export interface Goal {
  key: string;
  label: string;
  short: string;
  description: string;
  icon: IconName;
  accent: string;
  kpi: string;
  weights: Partial<Record<PillarKey, number>>;
}

export const GOALS: Goal[] = [
  {
    key: "sales",
    label: "More sales",
    short: "Sales",
    description: "Turn the audience you already have into orders this month.",
    icon: "tag",
    accent: "#C8F751",
    kpi: "Orders and link clicks",
    weights: { offer: 2.1, product: 1.5, objection: 1.4, proof: 1.2, community: 0.6, story: 0.7 },
  },
  {
    key: "views",
    label: "Reach and views",
    short: "Reach",
    description: "Get in front of people who have never heard of you.",
    icon: "eye",
    accent: "#22D3EE",
    kpi: "Reach, shares and new followers",
    weights: { community: 1.9, authority: 1.5, story: 1.3, proof: 0.9, offer: 0.35, objection: 0.6 },
  },
  {
    key: "leads",
    label: "Bookings and enquiries",
    short: "Leads",
    description: "Fill the diary. Best for services, clinics, gyms and agencies.",
    icon: "calendar",
    accent: "#7C5CFF",
    kpi: "DMs, calls and bookings",
    weights: { proof: 1.7, objection: 1.6, authority: 1.3, offer: 1.2, community: 0.7, story: 0.9 },
  },
  {
    key: "launch",
    label: "Launch something new",
    short: "Launch",
    description: "Build anticipation, then land the release with everything pointed at it.",
    icon: "bolt",
    accent: "#FFB443",
    kpi: "Launch-day sales and waitlist",
    weights: { product: 1.9, offer: 1.5, story: 1.3, proof: 1.1, authority: 0.8, community: 0.9 },
  },
  {
    key: "clear-stock",
    label: "Clear slow stock",
    short: "Clear stock",
    description: "Shift what has been sitting there, without discounting everything.",
    icon: "store",
    accent: "#FF8A5B",
    kpi: "Units moved on slow lines",
    weights: { offer: 1.8, objection: 1.7, product: 1.4, proof: 1.1, authority: 0.7, story: 0.6 },
  },
  {
    key: "authority",
    label: "Build authority",
    short: "Authority",
    description: "Become the account people screenshot and send to a friend.",
    icon: "brain",
    accent: "#A78BFA",
    kpi: "Saves and profile visits",
    weights: { authority: 2.1, proof: 1.4, story: 1.2, objection: 1.1, offer: 0.5, product: 0.8 },
  },
{
    key: "retention",
    label: "Keep customers coming back",
    short: "Repeat",
    description: "You already have buyers. Make the second and third order happen.",
    icon: "heart",
    accent: "#EC4899",
    kpi: "Repeat purchase rate",
    weights: { community: 1.8, proof: 1.5, product: 1.3, story: 1.2, offer: 0.8, objection: 0.6 },
  },
  {
    key: "footfall",
    label: "Get people through the door",
    short: "Footfall",
    description: "For a place people physically visit — a shop, a restaurant, a salon, a showroom.",
    icon: "store",
    accent: "#0EA5E9",
    kpi: "Walk-ins, saves and directions taps",
    weights: { community: 1.7, offer: 1.5, proof: 1.4, product: 1.1, authority: 0.7, story: 1.0 },
  },
  {
    key: "educate",
    label: "Explain what you do",
    short: "Educate",
    description: "Best when people do not yet understand the category, let alone your product.",
    icon: "brain",
    accent: "#14B8A6",
    kpi: "Saves, watch time and replies",
    weights: { authority: 1.9, objection: 1.7, proof: 1.2, story: 1.0, offer: 0.4, product: 0.9 },
  },
];

export const DEFAULT_GOAL = "sales";

export function getGoal(key: string): Goal {
  return GOALS.find((g) => g.key === key) || GOALS[0];
}

/* ------------------------------------------------------------------ */
/* content mix                                                         */
/* ------------------------------------------------------------------ */

/**
 * What the brand can actually make. Asked as content, not as platforms —
 * "can you film?" matters far more than "are you on TikTok?".
 */
export interface ContentKind {
  key: "static" | "carousel" | "video" | "story";
  label: string;
  short: string;
  description: string;
  icon: IconName;
  accent: string;
}

export const CONTENT_KINDS: ContentKind[] = [
  {
    key: "static",
    label: "Single posts",
    short: "Posts",
    description: "One image, one message. The quickest to publish.",
    icon: "image",
    accent: "#7C5CFF",
  },
  {
    key: "carousel",
    label: "Carousels",
    short: "Carousels",
    description: "Multi-slide teaching posts. The best format for saves.",
    icon: "layers",
    accent: "#22D3EE",
  },
  {
    key: "video",
    label: "Videos and reels",
    short: "Video",
    description: "Short-form video with a script and shot list. Best for reach.",
    icon: "video",
    accent: "#FF6B8A",
  },
  {
    key: "story",
    label: "Stories",
    short: "Stories",
    description: "Polls, countdowns and quick updates that vanish in a day.",
    icon: "clock",
    accent: "#FFB443",
  },
];

export type ContentMix = Record<ContentKind["key"], boolean>;

export const DEFAULT_MIX: ContentMix = { static: true, carousel: true, video: true, story: false };

export function mixToFormats(mix: ContentMix | undefined): string[] {
  const m = mix || DEFAULT_MIX;
  const out: string[] = [];
  if (m.static) out.push("static");
  if (m.carousel) out.push("carousel");
  if (m.video) out.push("reel", "video");
  if (m.story) out.push("story");
  return out.length ? out : ["static", "carousel"];
}

/* ------------------------------------------------------------------ */
/* video preferences                                                   */
/* ------------------------------------------------------------------ */

/**
 * Asked before a single frame is planned. These change the script that gets
 * written, not just a label on it.
 */
/**
 * How the videos should be made.
 *
 * Each field is a list, not a single choice. One entry means every video is
 * made that way; several means the month mixes between them; empty means the
 * brand has no preference and we pick per video. Locking a whole month to one
 * treatment was the wrong default — thirty identical videos is exactly the
 * sameness the product is supposed to solve.
 */
export interface VideoStyle {
  captions: string[];
  voice: string[];
  talent: string[];
  sound: string[];
}

/** Empty everywhere: by default we choose, and we vary it. */
export const DEFAULT_VIDEO_STYLE: VideoStyle = {
  captions: [],
  voice: [],
  talent: [],
  sound: [],
};

export const VIDEO_PREFS: {
  key: keyof VideoStyle;
  label: string;
  icon: IconName;
  accent: string;
  choices: { value: string; label: string; note: string }[];
}[] = [
  {
    key: "captions",
    label: "Captions",
    icon: "text",
    accent: "#22D3EE",
    choices: [
      { value: "burned", label: "Burned in", note: "Always visible, styled to your brand" },
      { value: "soft", label: "Soft subs", note: "Uploaded as a subtitle track" },
      { value: "none", label: "None", note: "Clean frame, no text" },
    ],
  },
  {
    key: "voice",
    label: "Voice",
    icon: "megaphone",
    accent: "#A78BFA",
    choices: [
      { value: "ai", label: "Generated voice", note: "Script written to be read aloud" },
      { value: "own", label: "Your own voice", note: "You record over the shot list" },
      { value: "music", label: "No voice", note: "Told visually, music only" },
    ],
  },
  {
    key: "talent",
    label: "On camera",
    icon: "users",
    accent: "#C8F751",
    choices: [
      { value: "presenter", label: "A presenter", note: "Someone talking to camera" },
      { value: "hands", label: "Hands only", note: "Hands using the product, no face" },
      { value: "product", label: "Product only", note: "Cinematic, nobody in frame" },
    ],
  },
  {
    key: "sound",
    label: "Sound",
    icon: "bolt",
    accent: "#FFB443",
    choices: [
      { value: "trending", label: "Trending audio", note: "Cut to a sound that is moving now" },
      { value: "licensed", label: "Licensed track", note: "Safe for ads and reposting" },
      { value: "silent", label: "Ambient only", note: "Real sound from the scene" },
    ],
  },
];

const CAPTION_NOTE: Record<string, string> = {
  burned: "CAPTIONS: burned in, high contrast, max 4 words per line, brand colour on the key word.",
  soft: "CAPTIONS: upload as a subtitle track. Keep the frame clean.",
  none: "CAPTIONS: none. The visual has to carry it alone.",
};

const VOICE_NOTE: Record<string, string> = {
  ai: "VOICE: generated voiceover. Write to be read aloud — short sentences, no clauses.",
  own: "VOICE: record it yourself over this shot list. Speak, do not read.",
  music: "VOICE: none. Tell it in pictures; the first frame must land without words.",
};

const TALENT_NOTE: Record<string, string> = {
  presenter: "TALENT: a presenter to camera. Product enters frame by 3s, face stays in shot.",
  hands: "TALENT: hands only. No faces. Shoot over the shoulder or top down.",
  product: "TALENT: no people. Product, surface and light do the work.",
};

const SOUND_NOTE: Record<string, string> = {
  trending: "SOUND: trending audio, low under the voice. Cut on the beat.",
  licensed: "SOUND: licensed track so it is safe to boost as an ad.",
  silent: "SOUND: ambient only. Let the product make the noise.",
};

/**
 * Picks one treatment from a list for this particular video.
 *
 * An empty list means the brand had no preference, so every option is on the
 * table. `seed` is the video's own number, so a month with two captions styles
 * alternates between them rather than choosing at random each time.
 */
function pick(chosen: string[], all: string[], seed: number): string {
  const pool = chosen.length ? chosen : all;
  return pool[seed % pool.length];
}

/** Turns the choices into the lines that go on the storyboard. */
export function videoStyleNotes(style: VideoStyle | undefined, seed = 0): string[] {
  const s = style || DEFAULT_VIDEO_STYLE;
  return [
    CAPTION_NOTE[pick(s.captions, ["burned", "soft", "none"], seed)],
    VOICE_NOTE[pick(s.voice, ["ai", "own", "music"], seed + 1)],
    TALENT_NOTE[pick(s.talent, ["presenter", "hands", "product"], seed + 2)],
    SOUND_NOTE[pick(s.sound, ["trending", "licensed", "silent"], seed)],
  ];
}
