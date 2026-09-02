/**
 * Prompt craft — the layer that decides whether output looks like a brand or
 * like AI slop.
 *
 * Four things make generated marketing images look cheap, and each has a fix
 * that lives here rather than in the model choice:
 *
 * 1. The model invents the product. A text prompt saying "vanilla lip glaze"
 *    produces *a* lip glaze, not *theirs*. Fixed by sending the customer's real
 *    photograph as a reference — see `references` in ImageRequest.
 *
 * 2. The model renders the text. Letterforms come out bent, doubled or
 *    misspelled, which is the single most recognisable slop signal. Fixed by
 *    never asking for text at all and compositing real typography over the
 *    result in the SVG poster.
 *
 * 3. Adjective prompting. "Professional, high quality, stunning, 4k" steers
 *    toward the model's average, which is exactly the over-lit plastic look
 *    everyone recognises. Fixed by describing optics and lighting instead.
 *
 * 4. Thirty posts that look identical. Fixed by varying the shot recipe
 *    deterministically per day, so a month reads as one campaign shot over
 *    several sessions rather than one prompt run thirty times.
 */

/**
 * Vocabulary that pulls output toward the generic model average. Kept as a
 * list so the ban is greppable and testable, not folklore in a prompt string.
 */
export const SLOP_WORDS = [
  "professional",
  "high quality",
  "highly detailed",
  "4k",
  "8k",
  "ultra realistic",
  "hyperrealistic",
  "masterpiece",
  "award winning",
  "stunning",
  "beautiful",
  "trending",
  "artstation",
  "cinematic lighting",
  "perfect",
  "flawless",
];

/** True when a brief leans on adjectives instead of describing a photograph. */
export function containsSlopVocabulary(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  return SLOP_WORDS.filter((w) => lower.includes(w));
}

/* ------------------------------------------------------------------ */
/* shot recipes                                                        */
/* ------------------------------------------------------------------ */

/**
 * Real photographers vary optics and light between frames. Models do not
 * unless told, so we tell them — and we do it from the day seed so the same
 * campaign regenerates identically while neighbouring days differ.
 */
const LENSES = [
  "50mm lens at f/2.8, natural perspective",
  "85mm lens at f/2.0, compressed background",
  "35mm lens at f/4, a little environment in frame",
  "100mm macro at f/5.6, close on texture",
  "24mm lens at f/8, product small in a wider scene",
];

const LIGHTING = [
  "one large softbox camera-left, shadow falling right",
  "window light with a white bounce card opposite",
  "hard low sun, long shadow across the surface",
  "overcast diffuse light, almost no shadow",
  "warm practical light behind, cool fill in front",
  "top light through a diffusion panel, soft edge shadow",
];

const ANGLES = [
  "straight-on at product height",
  "fifteen degrees above, slight downward tilt",
  "flat lay directly overhead",
  "low angle looking slightly up, product dominant",
  "three-quarter turn, label readable",
];

const SURFACES = [
  "matte seamless paper backdrop",
  "raw plaster surface with visible texture",
  "brushed stainless steel",
  "pale oak wood grain",
  "linen cloth with soft folds",
  "wet dark stone",
];

const GRADE = [
  "neutral colour, true whites",
  "slightly warm grade, gentle highlight rolloff",
  "cool shadows, clean midtones",
  "muted contrast, film-like grain",
];

export interface ShotRecipe {
  lens: string;
  lighting: string;
  angle: string;
  surface: string;
  grade: string;
}

/** Deterministic per seed, so a given day always regenerates the same way. */
export function shotRecipe(seed: number): ShotRecipe {
  const s = Math.abs(Math.floor(seed));
  return {
    lens: LENSES[s % LENSES.length],
    lighting: LIGHTING[(s >> 2) % LIGHTING.length],
    angle: ANGLES[(s >> 4) % ANGLES.length],
    surface: SURFACES[(s >> 6) % SURFACES.length],
    grade: GRADE[(s >> 8) % GRADE.length],
  };
}

/* ------------------------------------------------------------------ */
/* constraints                                                         */
/* ------------------------------------------------------------------ */

/**
 * The headline, logo and price are drawn as real vector type by the poster
 * renderer afterwards. Asking the model for them as well produces garbled
 * lettering under our own clean type, so we forbid them explicitly.
 */
export const NO_TEXT_CLAUSE =
  "Absolutely no text, no lettering, no numbers, no words, no logos, no watermarks, no signatures, and no user-interface elements anywhere in the image. Leave clean negative space in the upper third where typography will be placed later.";

/** Faces are the other reliable slop signal, so they are opt-in. */
export const NO_FACE_CLAUSE =
  "No people and no faces in frame. Hands may appear only if anatomically correct and holding the product naturally.";

export interface ArtBriefInput {
  /** What is actually being photographed. */
  subject: string;
  brandName: string;
  /** Hex values, used as set-dressing rather than as a filter over everything. */
  palette?: string[];
  /** Free-text direction from the strategy engine. */
  direction?: string;
  /** Day or post seed, so neighbouring posts differ. */
  seed?: number;
  /** True when the customer supplied a real photograph of the product. */
  hasReference?: boolean;
  allowFaces?: boolean;
}

/**
 * Builds the image brief.
 *
 * Note the ordering: what it is, how it is shot, then how it is graded. Models
 * weight early tokens more heavily, and the subject is what must survive.
 */
export function buildArtPrompt(input: ArtBriefInput): string {
  const shot = shotRecipe(input.seed ?? 0);
  const palette = (input.palette || []).filter(Boolean).slice(0, 3);

  const lines = [
    input.hasReference
      ? `Photograph the product shown in the reference image. Keep its exact shape, proportions, colour, material and label artwork unchanged — this is a real product and it must remain recognisable.`
      : `Editorial product photograph. Subject: ${input.subject}.`,

    input.hasReference ? `It is ${input.subject}, for the brand ${input.brandName}.` : "",

    input.direction ? `Art direction: ${input.direction}` : "",

    `Camera: ${shot.angle}, ${shot.lens}.`,
    `Light: ${shot.lighting}.`,
    `Set: ${shot.surface}.`,
    `Grade: ${shot.grade}.`,

    palette.length
      ? `Bring the brand palette in through props, backdrop and light rather than by tinting the whole frame: ${palette.join(", ")}.`
      : "",

    input.allowFaces ? "" : NO_FACE_CLAUSE,
    NO_TEXT_CLAUSE,
  ];

  return lines.filter(Boolean).join(" ");
}

/**
 * A last pass before a brief reaches a model. Strips the adjectives that pull
 * toward the average; used on prompts a customer typed as well as our own.
 */
export function stripSlopVocabulary(prompt: string): string {
  let out = prompt;
  for (const w of SLOP_WORDS) {
    out = out.replace(new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b,?\\s*`, "gi"), "");
  }
  return out.replace(/\s{2,}/g, " ").trim();
}
