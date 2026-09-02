import { gatewayText } from "./gateway";
import { gatewayConfigured } from "./gateway";
import { stripSlopVocabulary } from "./craft";

/**
 * A storyboard, written before any video is generated.
 *
 * Handing a video model one sentence produces one drifting shot: the camera
 * wanders, the product changes between frames, and nothing happens. Deciding
 * the beats first — what is on screen, for how long, and what the camera does
 * — is most of the difference between a clip that looks like an advert and a
 * clip that looks like a screensaver.
 *
 * It is also the point where a customer can intervene. The board is cheap to
 * regenerate and costs no video credits, so it is reviewed and edited before
 * the expensive call happens.
 */

export interface StoryboardShot {
  n: number;
  /** Seconds on screen. Veo generates 4, 6 or 8 seconds in total. */
  seconds: number;
  /** What the viewer sees. */
  visual: string;
  /** How the camera behaves. Static shots read as stock footage. */
  camera: string;
  /** What is said over this beat, if anything. */
  voiceover?: string;
}

export interface Storyboard {
  hook: string;
  shots: StoryboardShot[];
  cta: string;
  totalSeconds: number;
  /** True when a language model wrote it rather than the built-in template. */
  authored: boolean;
}

export interface StoryboardBrief {
  productName: string;
  brandName: string;
  /** What the post is trying to achieve, in the customer's own words. */
  angle: string;
  voice?: string;
  audience?: string;
  seconds?: 4 | 6 | 8;
}

/* ------------------------------------------------------------------ */
/* deterministic fallback                                              */
/* ------------------------------------------------------------------ */

/**
 * The board used when no text provider is configured.
 *
 * It is a real three-beat advert structure — arrive, show, ask — rather than
 * a placeholder, so the product still produces something usable with nothing
 * plugged in. That is the same promise the strategy engine makes.
 */
function templateBoard(brief: StoryboardBrief): Storyboard {
  const total = brief.seconds ?? 8;
  const beat = total / 3;
  return {
    hook: `${brief.productName}, in about ${total} seconds.`,
    shots: [
      {
        n: 1,
        seconds: Math.round(beat),
        visual: `${brief.productName} enters frame against a clean, uncluttered surface, lit softly from one side.`,
        camera: "slow push in, starting wide and settling on the product",
        voiceover: brief.angle,
      },
      {
        n: 2,
        seconds: Math.round(beat),
        visual: `A close detail of ${brief.productName} — texture, finish and the part people actually care about.`,
        camera: "slow orbit around the product, shallow depth of field",
        voiceover: `Made for ${brief.audience || "people who care about the details"}.`,
      },
      {
        n: 3,
        seconds: total - 2 * Math.round(beat),
        visual: `${brief.productName} at rest in its finished setting, held a beat so the frame can breathe.`,
        camera: "static, locked off",
        voiceover: `${brief.brandName}.`,
      },
    ],
    cta: `${brief.brandName}`,
    totalSeconds: total,
    authored: false,
  };
}

/* ------------------------------------------------------------------ */
/* authored board                                                      */
/* ------------------------------------------------------------------ */

const SYSTEM = `You are a commercial director writing a shot list for a short vertical advert.

Return ONLY valid JSON, no prose and no code fences, matching exactly:
{"hook":string,"cta":string,"shots":[{"n":number,"seconds":number,"visual":string,"camera":string,"voiceover":string}]}

Rules:
- Three or four shots, no more. The seconds must add up to the total requested.
- "visual" describes what is in frame in plain concrete nouns. No adjectives like
  stunning, beautiful, professional or cinematic.
- "camera" is a real move: push in, pull back, slow orbit, tilt up, locked off.
- Never put text, captions, logos or watermarks in the frame. Words are spoken,
  not written.
- No people's faces unless the angle genuinely needs a person.
- The product must stay the same object in every shot.`;

function parseBoard(raw: string, brief: StoryboardBrief): Storyboard | null {
  // Models still occasionally wrap JSON in fences despite being told not to.
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;

  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as {
      hook?: string;
      cta?: string;
      shots?: { n?: number; seconds?: number; visual?: string; camera?: string; voiceover?: string }[];
    };
    const shots = (parsed.shots || [])
      .filter((s) => s && typeof s.visual === "string" && s.visual.trim().length > 3)
      .slice(0, 4)
      .map((s, i) => ({
        n: i + 1,
        seconds: Math.max(1, Math.round(Number(s.seconds) || 0)) || 2,
        visual: stripSlopVocabulary(String(s.visual)),
        camera: stripSlopVocabulary(String(s.camera || "locked off")),
        voiceover: s.voiceover ? String(s.voiceover) : undefined,
      }));
    if (!shots.length) return null;

    // The model's seconds rarely add up. Scale them to the requested length so
    // the board never promises more footage than the clip will contain.
    const target = brief.seconds ?? 8;
    const sum = shots.reduce((a, s) => a + s.seconds, 0) || target;
    let running = 0;
    shots.forEach((s, i) => {
      if (i === shots.length - 1) s.seconds = Math.max(1, target - running);
      else {
        s.seconds = Math.max(1, Math.round((s.seconds / sum) * target));
        running += s.seconds;
      }
    });

    return {
      hook: parsed.hook?.trim() || `${brief.productName}`,
      cta: parsed.cta?.trim() || brief.brandName,
      shots,
      totalSeconds: target,
      authored: true,
    };
  } catch {
    return null;
  }
}

/** Writes a board, falling back to the template when no model is available. */
export async function buildStoryboard(brief: StoryboardBrief): Promise<Storyboard> {
  if (!gatewayConfigured()) return templateBoard(brief);

  const user = [
    `Brand: ${brief.brandName}.`,
    `Product: ${brief.productName}.`,
    `Angle: ${brief.angle}.`,
    brief.voice ? `Tone of voice: ${brief.voice}.` : "",
    brief.audience ? `Audience: ${brief.audience}.` : "",
    `Total length: ${brief.seconds ?? 8} seconds, vertical 9:16.`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const raw = await gatewayText(SYSTEM, user);
    return parseBoard(raw || "", brief) || templateBoard(brief);
  } catch {
    // A board is not worth failing the request over; the template is decent.
    return templateBoard(brief);
  }
}

/* ------------------------------------------------------------------ */
/* board -> video prompt                                               */
/* ------------------------------------------------------------------ */

/**
 * Flattens the board into the single prompt a video model accepts.
 *
 * Veo takes one prompt, so the beats are written as an explicit timed
 * sequence. Stating the seconds inline is what stops the model spending the
 * whole clip on the first idea.
 */
export function storyboardToVideoPrompt(board: Storyboard, extra?: string): string {
  let t = 0;
  const beats = board.shots.map((s) => {
    const from = t;
    t += s.seconds;
    return `${from}-${t}s: ${s.visual} Camera: ${s.camera}.`;
  });

  return [
    `A ${board.totalSeconds}-second vertical 9:16 advert, shot as one continuous piece in ${board.shots.length} beats.`,
    ...beats,
    board.shots.some((s) => s.voiceover)
      ? `Spoken voiceover, calm and unhurried: "${board.shots.map((s) => s.voiceover).filter(Boolean).join(" ")}"`
      : "",
    extra || "",
    "No on-screen text, no captions, no subtitles, no logos and no watermarks anywhere in the frame.",
    "The product must remain the same object, unchanged, in every beat.",
  ]
    .filter(Boolean)
    .join(" ");
}
