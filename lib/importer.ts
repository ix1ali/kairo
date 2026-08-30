/**
 * Shared link-import plumbing.
 *
 * Handles three shapes of input:
 *   - a whole store  (Shopify /products.json, WooCommerce Store API, JSON-LD ItemList)
 *   - a product page (Shopify /product.json, JSON-LD Product)
 *   - any other site (Open Graph + heading heuristics)
 */

const PRIVATE_HOST =
  /^(localhost$|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.|169\.254\.|\[?::1\]?$)/i;

const UA = "Mozilla/5.0 (compatible; KoalaImport/1.0; +https://koala.app)";

export class ImportError extends Error {}

export function guardUrl(input: string): URL {
  let raw = (input || "").trim();
  if (!raw) throw new ImportError("Enter a link first.");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ImportError("That does not look like a valid link.");
  }
  if (!/^https?:$/.test(url.protocol)) throw new ImportError("Only http and https links are supported.");
  if (PRIVATE_HOST.test(url.hostname)) throw new ImportError("That address cannot be reached.");
  return url;
}

export async function fetchWithTimeout(url: string, ms = 12000, accept = "text/html,application/xhtml+xml") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: accept },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function tryJson<T = unknown>(url: string, ms = 10000): Promise<T | null> {
  try {
    const res = await fetchWithTimeout(url, ms, "application/json");
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (!type.includes("json")) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function decodeEntities(s: string) {
  return (s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

export function stripHtml(s: string, max = 220) {
  const text = decodeEntities((s || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function metaTag(html: string, ...names: string[]): string {
  for (const name of names) {
    const a = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']`, "i");
    const b = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${name}["']`, "i");
    const m = html.match(a) || html.match(b);
    if (m?.[1]) return decodeEntities(m[1].trim());
  }
  return "";
}

export function absolute(url: string, base: string) {
  try {
    return new URL(url, base).toString();
  } catch {
    return "";
  }
}

export interface ImportedProduct {
  name: string;
  price: string;
  description: string;
  image: string | null;
  url?: string;
}

function money(amount: unknown, currency?: string, minorUnits?: number): string {
  if (amount === undefined || amount === null || amount === "") return "";
  let n = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (!isFinite(n)) return "";
  if (typeof minorUnits === "number" && minorUnits > 0) n = n / Math.pow(10, minorUnits);
  const symbols: Record<string, string> = { USD: "$", GBP: "£", EUR: "€", AUD: "A$", CAD: "C$", AED: "AED ", SAR: "SAR " };
  const sym = currency ? symbols[currency.toUpperCase()] ?? `${currency.toUpperCase()} ` : "";
  return `${sym}${n.toFixed(2).replace(/\.00$/, "")}`;
}

/* ------------------------------------------------------------------ */
/* Shopify                                                             */
/* ------------------------------------------------------------------ */

interface ShopifyProduct {
  title?: string;
  body_html?: string;
  handle?: string;
  variants?: { price?: string }[];
  images?: { src?: string }[];
  image?: { src?: string };
}

function fromShopify(p: ShopifyProduct, origin: string, currency?: string): ImportedProduct | null {
  if (!p?.title) return null;
  // The cheapest variant is almost always the single unit; variants[0] is often
  // a bundle or a multi-pack, which produces wildly wrong prices.
  const prices = (p.variants || [])
    .map((v) => parseFloat(String(v?.price ?? "")))
    .filter((n) => isFinite(n) && n > 0);
  const lowest = prices.length ? Math.min(...prices) : undefined;
  return {
    name: String(p.title).trim().slice(0, 80),
    price: money(lowest, currency),
    description: stripHtml(p.body_html || ""),
    image: p.images?.[0]?.src || p.image?.src || null,
    url: p.handle ? `${origin}/products/${p.handle}` : undefined,
  };
}

/** Shopify's products.json omits currency, so read it off the storefront once. */
async function shopifyCurrency(origin: string): Promise<string | undefined> {
  try {
    const res = await fetchWithTimeout(origin, 8000);
    if (!res.ok) return undefined;
    const html = (await res.text()).slice(0, 200_000);
    const inline = html.match(/Shopify\.currency\s*=\s*\{[^}]*"active"\s*:\s*"([A-Z]{3})"/);
    if (inline?.[1]) return inline[1];
    const meta = metaTag(html, "og:price:currency", "product:price:currency");
    if (/^[A-Za-z]{3}$/.test(meta)) return meta.toUpperCase();
    const itemProp = html.match(/itemprop=["']priceCurrency["'][^>]*content=["']([A-Z]{3})["']/i);
    return itemProp?.[1];
  } catch {
    return undefined;
  }
}

async function shopifyStore(origin: string, currency?: string): Promise<ImportedProduct[]> {
  const data = await tryJson<{ products?: ShopifyProduct[] }>(`${origin}/products.json?limit=50`);
  if (!data?.products?.length) return [];
  return data.products.map((p) => fromShopify(p, origin, currency)).filter((x): x is ImportedProduct => !!x);
}

async function shopifyProduct(url: URL, currency?: string): Promise<ImportedProduct[]> {
  const clean = `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  const data = await tryJson<{ product?: ShopifyProduct }>(`${clean}.json`);
  const p = data?.product ? fromShopify(data.product, url.origin, currency) : null;
  return p ? [p] : [];
}

/* ------------------------------------------------------------------ */
/* WooCommerce                                                         */
/* ------------------------------------------------------------------ */

interface WooProduct {
  name?: string;
  short_description?: string;
  description?: string;
  prices?: { price?: string; currency_code?: string; currency_minor_unit?: number };
  images?: { src?: string }[];
  permalink?: string;
}

async function wooStore(origin: string): Promise<ImportedProduct[]> {
  const data =
    (await tryJson<WooProduct[]>(`${origin}/wp-json/wc/store/v1/products?per_page=50`)) ||
    (await tryJson<WooProduct[]>(`${origin}/wp-json/wc/store/products?per_page=50`));
  if (!Array.isArray(data) || !data.length) return [];
  return data
    .filter((p) => p?.name)
    .map((p) => ({
      name: String(p.name).trim().slice(0, 80),
      price: money(p.prices?.price, p.prices?.currency_code, p.prices?.currency_minor_unit),
      description: stripHtml(p.short_description || p.description || ""),
      image: p.images?.[0]?.src || null,
      url: p.permalink,
    }));
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                             */
/* ------------------------------------------------------------------ */

type Json = Record<string, unknown>;

function ldNodes(html: string): Json[] {
  const out: Json[] = [];
  const blocks = html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi);
  for (const b of blocks) {
    try {
      const parsed = JSON.parse(b[1].trim());
      const push = (v: unknown) => {
        if (!v || typeof v !== "object") return;
        const node = v as Json;
        out.push(node);
        const graph = node["@graph"];
        if (Array.isArray(graph)) graph.forEach(push);
        const items = node.itemListElement;
        if (Array.isArray(items)) items.forEach((it) => push((it as Json)?.item ?? it));
      };
      if (Array.isArray(parsed)) parsed.forEach(push);
      else push(parsed);
    } catch {
      /* malformed block */
    }
  }
  return out;
}

function typeOf(node: Json): string {
  const t = node["@type"];
  return Array.isArray(t) ? String(t[0] ?? "") : String(t ?? "");
}

function ldProducts(html: string, base: string): ImportedProduct[] {
  const out: ImportedProduct[] = [];
  for (const node of ldNodes(html)) {
    if (!/product/i.test(typeOf(node))) continue;
    const name = node.name ? String(node.name).trim() : "";
    if (!name) continue;
    const offers = (Array.isArray(node.offers) ? node.offers[0] : node.offers) as Json | undefined;
    const image = Array.isArray(node.image) ? node.image[0] : node.image;
    out.push({
      name: name.slice(0, 80),
      price: money(offers?.price, offers?.priceCurrency as string | undefined),
      description: stripHtml(String(node.description || "")),
      image: image ? absolute(String(image), base) : null,
      url: node.url ? absolute(String(node.url), base) : undefined,
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* orchestration                                                       */
/* ------------------------------------------------------------------ */

export interface ProductImportResult {
  products: ImportedProduct[];
  source: string;
  storeName: string;
  currency?: string;
}

function dedupe(list: ImportedProduct[]): ImportedProduct[] {
  const seen = new Set<string>();
  const out: ImportedProduct[] = [];
  for (const p of list) {
    const key = p.name.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

/** True only for paths that clearly address one product, not a whole shop. */
function isProductPath(pathname: string) {
  return /\/(products?|item|dp|p|pd)\/[^/]+/i.test(pathname);
}

/**
 * Page titles are usually "Product Name | Store Name". The h1 is normally the
 * cleaner source, so prefer it and trim the site-name tail either way.
 */
function productTitle(html: string): string {
  const h1 = html.match(/<h1[^>]*>([\s\S]{2,120}?)<\/h1>/i)?.[1];
  const fromH1 = h1 ? decodeEntities(h1.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim() : "";
  if (fromH1.length > 2) return fromH1;

  const og = metaTag(html, "og:title", "twitter:title");
  if (!og) return "";
  const head = og.split(/\s+[|–—·]\s+/)[0].trim();
  return head.length > 2 ? head : og;
}

export async function importProducts(input: string, limit = 24): Promise<ProductImportResult> {
  const url = guardUrl(input);
  const origin = url.origin;
  const single = isProductPath(url.pathname);

  let html = "";
  const loadHtml = async () => {
    if (html) return html;
    try {
      const res = await fetchWithTimeout(url.toString());
      if (res.ok) html = (await res.text()).slice(0, 900_000);
    } catch {
      /* fall through to other strategies */
    }
    return html;
  };

  // ---- a single product page: never widen to the whole catalogue ----
  if (single) {
    const currency = await shopifyCurrency(origin);
    const one = await shopifyProduct(url, currency);
    if (one.length) return { products: one, source: "Shopify product", storeName: url.hostname, currency };

    await loadHtml();
    if (html) {
      const ld = dedupe(ldProducts(html, url.toString()));
      if (ld.length) {
        return { products: ld.slice(0, 1), source: "Product page", storeName: metaTag(html, "og:site_name") || url.hostname };
      }
      const ogTitle = productTitle(html);
      if (ogTitle) {
        return {
          products: [
            {
              name: ogTitle.slice(0, 80),
              price: money(
                metaTag(html, "product:price:amount") || undefined,
                metaTag(html, "product:price:currency") || undefined
              ),
              description: stripHtml(metaTag(html, "og:description", "description")),
              image: metaTag(html, "og:image") ? absolute(metaTag(html, "og:image"), url.toString()) : null,
              url: url.toString(),
            },
          ],
          source: "Product page",
          storeName: metaTag(html, "og:site_name") || url.hostname,
        };
      }
    }
    throw new ImportError("Could not read that product page. Add it manually instead.");
  }

  // ---- a whole store ----
  const currency = await shopifyCurrency(origin);
  const [shopify, woo] = await Promise.all([shopifyStore(origin, currency), wooStore(origin)]);
  if (shopify.length) {
    return { products: dedupe(shopify).slice(0, limit), source: "Shopify store", storeName: url.hostname, currency };
  }
  if (woo.length) {
    return { products: dedupe(woo).slice(0, limit), source: "WooCommerce store", storeName: url.hostname };
  }

  await loadHtml();
  if (!html) throw new ImportError("Could not reach that link.");

  const ld = dedupe(ldProducts(html, url.toString()));
  if (ld.length) {
    return {
      products: ld.slice(0, limit),
      source: ld.length === 1 ? "Product page" : "Product listing",
      storeName: metaTag(html, "og:site_name") || url.hostname,
    };
  }

  // Last resort: treat the page as a single product using its title and Open Graph
  const ogTitle = productTitle(html);
  if (ogTitle) {
    return {
      products: [
        {
          name: ogTitle.slice(0, 80),
          price: metaTag(html, "product:price:amount")
            ? money(metaTag(html, "product:price:amount"), metaTag(html, "product:price:currency") || undefined)
            : "",
          description: stripHtml(metaTag(html, "og:description", "description")),
          image: metaTag(html, "og:image") ? absolute(metaTag(html, "og:image"), url.toString()) : null,
          url: url.toString(),
        },
      ],
      source: "Page preview",
      storeName: metaTag(html, "og:site_name") || url.hostname,
    };
  }

  throw new ImportError("No products found at that link. Try a product page or add them manually.");
}
