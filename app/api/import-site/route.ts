import { fail, json, requireUser } from "@/lib/api";
import { uid } from "@/lib/db";
import { putPublicFile } from "@/lib/storage";
import { resolveCategory } from "@/lib/strategy/categories";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

/**
 * Brand import: give Koala a website URL and it reads the public page to
 * pre-fill the project — name, description, palette, logo, socials and a
 * best-guess category. Everything stays editable in the wizard.
 */

const PRIVATE_HOST = /^(localhost$|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.|169\.254\.|\[?::1\]?$)/i;

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

function meta(html: string, ...names: string[]): string {
  for (const name of names) {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']`,
      "i"
    );
    const alt = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${name}["']`,
      "i"
    );
    const m = html.match(re) || html.match(alt);
    if (m?.[1]) return decodeEntities(m[1].trim());
  }
  return "";
}

function absolute(url: string, base: string) {
  try {
    return new URL(url, base).toString();
  } catch {
    return "";
  }
}

const NEUTRAL = /^#?(0{3,6}|f{3,6}|fff|000|ffffff|000000)$/i;

function paletteFrom(html: string): string[] {
  const counts = new Map<string, number>();
  const re = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    let hex = m[1].toLowerCase();
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    if (NEUTRAL.test(hex)) continue;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    // Ignore near-greys and near-blacks/whites; we want actual brand colour.
    if (sat < 0.22 || max < 45 || (min > 225 && sat < 0.35)) continue;
    counts.set(`#${hex}`, (counts.get(`#${hex}`) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([hex]) => hex);
}

const SOCIAL_HOSTS: Record<string, string> = {
  "instagram.com": "Instagram",
  "tiktok.com": "TikTok",
  "facebook.com": "Facebook",
  "linkedin.com": "LinkedIn",
  "twitter.com": "X",
  "x.com": "X",
  "youtube.com": "YouTube",
  "pinterest.com": "Pinterest",
  "threads.net": "Threads",
  "threads.com": "Threads",
};

function socialsFrom(html: string): { platform: string; url: string }[] {
  const found = new Map<string, string>();
  const re = /https?:\/\/(?:www\.)?([a-z0-9.-]+)\/[^"'\s<>]{2,80}/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const host = m[1].toLowerCase().replace(/^www\./, "");
    const platform = SOCIAL_HOSTS[host];
    if (!platform || found.has(platform)) continue;
    const url = m[0].replace(/[),.'"]+$/, "");
    if (/\/(share|intent|sharer|plugins)/i.test(url)) continue;
    found.set(platform, url);
  }
  return [...found.entries()].map(([platform, url]) => ({ platform, url }));
}

/**
 * Section headings that are navigation, not merchandise.
 *
 * The heading sweep is a fallback for sites with no structured data, and on a
 * brochure site it happily returned "About Us" as a product. Matching a bare
 * word list was not enough — real pages say "About Us", "Get in touch",
 * "Why choose us" — so this matches on the leading phrase.
 */
const PAGE_FURNITURE =
  /^(about|contact|get in touch|reach us|faq|frequently asked|home|blog|news|menu|search|cart|checkout|login|log in|sign in|sign up|register|subscribe|newsletter|follow us|testimonials?|reviews?|our story|our mission|our vision|our values|our team|meet the team|why (choose|us)|how it works|gallery|portfolio|careers?|jobs|privacy|terms|cookies?|sitemap|legal|support|help|share this|related|categories|shop( all| now)?|contact us)\b/i;

function isPageFurniture(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (PAGE_FURNITURE.test(t)) return true;
  // A heading that reads as a sentence is copy, not a product name.
  if (/[.!?]$/.test(t) && t.split(" ").length > 4) return true;
  return false;
}

function productsFrom(html: string): { name: string }[] {
  const names = new Set<string>();

  // Structured data first — the most reliable source.
  const ld = html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi);
  for (const block of ld) {
    try {
      const parsed = JSON.parse(block[1].trim());
      const nodes = Array.isArray(parsed) ? parsed : [parsed, ...(parsed["@graph"] || [])];
      for (const n of nodes) {
        if (n && typeof n === "object" && /product/i.test(String(n["@type"] || "")) && n.name) {
          names.add(String(n.name).trim().slice(0, 60));
        }
      }
    } catch {
      /* ignore malformed blocks */
    }
  }

  if (names.size < 3) {
    const headings = html.matchAll(/<h[23][^>]*>([\s\S]{2,70}?)<\/h[23]>/gi);
    for (const h of headings) {
      const text = decodeEntities(h[1].replace(/<[^>]+>/g, "").trim());
      if (text.length > 2 && text.length < 60 && !isPageFurniture(text)) names.add(text);
      if (names.size >= 8) break;
    }
  }

  return [...names].slice(0, 8).map((name) => ({ name }));
}

const IMG_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/gif": "gif",
};

/** Pulls the site's icon into local storage so exported artwork stays self-contained. */
async function saveRemoteLogo(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    clearTimeout(timer);
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const ext = IMG_EXT[type];
    if (!ext) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length || buf.length > 3 * 1024 * 1024) return null;
    return await putPublicFile(`logo_${uid()}.${ext}`, buf);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => ({}));
  let raw = String(body.url || "").trim();
  if (!raw) return fail("Enter a website address.");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return fail("That does not look like a valid URL.");
  }
  if (!/^https?:$/.test(target.protocol)) return fail("Only http and https addresses are supported.");
  if (PRIVATE_HOST.test(target.hostname)) return fail("That address cannot be reached.");

  let html = "";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KoalaBrandImport/1.0; +https://koala.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timer);
    if (!res.ok) return fail(`The site responded with ${res.status}. Enter your details manually instead.`);
    html = (await res.text()).slice(0, 900_000);
  } catch {
    return fail("Could not reach that site. Enter your details manually instead.");
  }

  const base = target.toString();
  const titleTag = decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim());
  const siteName = meta(html, "og:site_name") || titleTag.split(/[|\-–—·]/)[0].trim();
  const description =
    meta(html, "og:description", "description", "twitter:description") ||
    decodeEntities((html.match(/<p[^>]*>([\s\S]{60,300}?)<\/p>/i)?.[1] || "").replace(/<[^>]+>/g, "").trim());

  const iconHref =
    html.match(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]*href=["']([^"']+)["']/i)?.[1] ||
    html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/i)?.[1] ||
    meta(html, "og:image");

  const palette = paletteFrom(html);
  const themeColor = meta(html, "theme-color");
  const primary = themeColor && !NEUTRAL.test(themeColor) ? themeColor : palette[0] || "#7C5CFF";
  const secondary = palette.find((c) => c.toLowerCase() !== primary.toLowerCase()) || "#22D3EE";

  const haystack = `${siteName} ${titleTag} ${description} ${meta(html, "keywords")}`;
  const { key: category } = resolveCategory(haystack);

  const absoluteIcon = iconHref ? absolute(iconHref, base) : "";
  const logoUrl = absoluteIcon ? await saveRemoteLogo(absoluteIcon) : null;

  return json({
    imported: {
      name: (siteName || target.hostname.replace(/^www\./, "")).slice(0, 60),
      tagline: meta(html, "og:title", "twitter:title").slice(0, 120) || titleTag.slice(0, 120),
      description: description.slice(0, 500),
      website: base,
      logoUrl,
      category,
      colors: { primary, secondary },
      palette,
      socials: socialsFrom(html),
      products: productsFrom(html),
    },
  });
}
