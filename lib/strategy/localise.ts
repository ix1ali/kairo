import { activeTextProvider, refineCopy } from "../ai";
import { getLocale } from "../languages";
import type { Post } from "../types";

/**
 * Writes the month in the project's language and dialect.
 *
 * The template engine writes English. Turning that into Kuwaiti Arabic or
 * Rioplatense Spanish is a translation job, so it needs a text provider. When
 * none is configured the posts stay in English and the caller is told, rather
 * than the app pretending it localised anything.
 */

export function canLocalise(locale: string) {
  return getLocale(locale).language !== "English" && activeTextProvider() !== "local";
}

export function needsProviderFor(locale: string) {
  return getLocale(locale).language !== "English" && activeTextProvider() === "local";
}

const BATCH = 10;

interface Piece {
  i: number;
  hook: string;
  caption: string;
  cta: string;
}

function systemPrompt(locale: string) {
  const l = getLocale(locale);
  return [
    `You localise social media marketing copy into ${l.language} as spoken in ${l.country}.`,
    `Write in the ${l.dialect} dialect — the way real people there actually speak and how local brands actually post, not textbook ${l.language}.`,
    l.rtl ? "The output is right-to-left. Do not add direction marks." : "",
    "Rules:",
    "- Keep brand names, product names and hashtags exactly as given.",
    "- Keep the same persuasive intent, hook structure and length. This is a rewrite, not a literal translation.",
    "- Keep line breaks and bullet characters where they appear.",
    "- Return ONLY a JSON array, no prose, no code fences.",
    'Each element: {"i": number, "hook": string, "caption": string, "cta": string}',
  ]
    .filter(Boolean)
    .join("\n");
}

async function localiseBatch(pieces: Piece[], locale: string): Promise<Piece[] | null> {
  const raw = await refineCopy(systemPrompt(locale), JSON.stringify(pieces));
  if (!raw) return null;
  try {
    const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (p) => p && typeof p.i === "number" && typeof p.hook === "string" && typeof p.caption === "string"
    );
  } catch {
    return null;
  }
}

/**
 * Returns the posts rewritten in the target locale. Any batch that fails is
 * left in English rather than dropped.
 */
export async function localisePosts<T extends Pick<Post, "hook" | "caption" | "cta">>(
  posts: T[],
  locale: string
): Promise<{ posts: T[]; localised: boolean }> {
  if (!canLocalise(locale)) return { posts, localised: false };

  const out = [...posts];
  let any = false;

  for (let start = 0; start < posts.length; start += BATCH) {
    const slice = posts.slice(start, start + BATCH);
    const pieces: Piece[] = slice.map((p, n) => ({
      i: n,
      hook: p.hook,
      caption: p.caption,
      cta: p.cta,
    }));

    const result = await localiseBatch(pieces, locale);
    if (!result) continue;

    for (const r of result) {
      const target = out[start + r.i];
      if (!target) continue;
      target.hook = r.hook || target.hook;
      target.caption = r.caption || target.caption;
      target.cta = r.cta || target.cta;
      any = true;
    }
  }

  return { posts: out, localised: any };
}
