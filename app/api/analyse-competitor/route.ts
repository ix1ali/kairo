import { fail, json, requireUser } from "@/lib/api";
import {
  fetchWithTimeout,
  guardUrl,
  ImportError,
  metaTag,
  stripHtml,
  tryJson,
} from "@/lib/importer";

/**
 * Reads a competitor's public pages and reports what can actually be observed —
 * how they position themselves, how big the catalogue is, where they post.
 *
 * Deliberately honest about its limits: Instagram and TikTok serve a login wall
 * to servers, so handles are recorded for reference rather than scraped.
 */

const SOCIAL_HOSTS: Record<string, string> = {
  "instagram.com": "Instagram",
  "tiktok.com": "TikTok",
  "facebook.com": "Facebook",
  "linkedin.com": "LinkedIn",
  "x.com": "X",
  "twitter.com": "X",
  "youtube.com": "YouTube",
  "pinterest.com": "Pinterest",
};

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => ({}));
  const raw = String(body.url || "").trim();

  let url;
  try {
    url = guardUrl(raw);
  } catch (err) {
    return fail(err instanceof ImportError ? err.message : "That link cannot be read.");
  }

  const host = url.hostname.replace(/^www\./, "");
  if (SOCIAL_HOSTS[host]) {
    return json({
      name: url.pathname.replace(/\//g, "").replace(/^@/, "") || host,
      note: `${SOCIAL_HOSTS[host]} profile saved. Social platforms block server-side reading, so this is kept for your reference rather than analysed.`,
      readable: false,
      signals: {},
    });
  }

  let html = "";
  try {
    const res = await fetchWithTimeout(url.toString(), 12000);
    if (!res.ok) return fail(`Their site responded with ${res.status}.`);
    html = (await res.text()).slice(0, 700_000);
  } catch {
    return fail("Could not reach that site.");
  }

  const title = metaTag(html, "og:site_name") ||
    (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").split(/\s*[|–—]\s*/)[0].trim();
  const description = metaTag(html, "og:description", "description");

  // Catalogue size is a decent proxy for how they compete: breadth or focus.
  const catalogue = await tryJson<{ products?: unknown[] }>(`${url.origin}/products.json?limit=250`);
  const productCount = catalogue?.products?.length;

  const socials = new Set<string>();
  const re = /https?:\/\/(?:www\.)?([a-z0-9.-]+)\//gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const platform = SOCIAL_HOSTS[m[1].toLowerCase().replace(/^www\./, "")];
    if (platform) socials.add(platform);
  }

  const observations: string[] = [];
  if (description) observations.push(`they lead with "${stripHtml(description, 110)}"`);
  if (typeof productCount === "number") {
    observations.push(
      productCount >= 100
        ? `a broad catalogue of ${productCount}+ products, so they compete on choice rather than focus`
        : productCount > 0
        ? `a focused range of about ${productCount} products`
        : "no public catalogue"
    );
  }
  if (socials.size) observations.push(`active on ${[...socials].join(", ")}`);

  return json({
    name: title || host,
    readable: true,
    note: observations.length
      ? `${observations.join("; ")}.`
      : "Their site gave little away publicly, which is itself a gap you can exploit.",
    signals: {
      title,
      description: stripHtml(description, 200),
      productCount: productCount ?? null,
      socials: [...socials],
    },
  });
}
