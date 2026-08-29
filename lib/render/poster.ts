import type { Post, Project } from "../types";

/* ------------------------------------------------------------------ */
/* colour utilities                                                    */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const h = (hex || "#000000").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0");
  return [
    parseInt(full.slice(0, 2), 16) || 0,
    parseInt(full.slice(2, 4), 16) || 0,
    parseInt(full.slice(4, 6), 16) || 0,
  ];
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function readableOn(bg: string) {
  return luminance(bg) > 0.45 ? "#0B0B10" : "#FFFFFF";
}

function mix(a: string, b: string, amount: number) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const r = Math.round(r1 + (r2 - r1) * amount);
  const g = Math.round(g1 + (g2 - g1) * amount);
  const bl = Math.round(b1 + (b2 - b1) * amount);
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function esc(s: string) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ------------------------------------------------------------------ */
/* text layout                                                         */
/* ------------------------------------------------------------------ */

function wrap(text: string, maxChars: number, maxLines = 6): string[] {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else {
      line = next;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[.,;:]?$/, "…");
  }
  return lines;
}

function textBlock(
  lines: string[],
  x: number,
  y: number,
  size: number,
  lineHeight: number,
  fill: string,
  opts: { weight?: number; anchor?: string; tracking?: number; opacity?: number } = {}
) {
  const { weight = 800, anchor = "start", tracking = -1.5, opacity = 1 } = opts;
  return lines
    .map(
      (l, i) =>
        `<text x="${x}" y="${y + i * size * lineHeight}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="${tracking}" fill="${fill}" opacity="${opacity}" text-anchor="${anchor}">${esc(l)}</text>`
    )
    .join("");
}

/* ------------------------------------------------------------------ */
/* shared chrome                                                       */
/* ------------------------------------------------------------------ */

interface Ctx {
  w: number;
  h: number;
  bg: string;
  primary: string;
  secondary: string;
  ink: string;
  muted: string;
  brand: string;
  logo: string | null;
  post: Post;
}

function defs(c: Ctx) {
  return `
  <defs>
    <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.primary}"/>
      <stop offset="100%" stop-color="${c.secondary}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.primary}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${c.primary}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.secondary}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${c.secondary}" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.055"/></feComponentTransfer>
      <feBlend mode="overlay" in2="SourceGraphic"/>
    </filter>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="60"/>
    </filter>
    <clipPath id="round"><rect x="0" y="0" width="${c.w}" height="${c.h}" rx="0"/></clipPath>
  </defs>`;
}

function footer(c: Ctx) {
  const y = c.h - 64;
  const logo = c.logo
    ? `<image href="${c.logo}" x="72" y="${y - 40}" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>`
    : `<circle cx="100" cy="${y - 12}" r="26" fill="url(#brandGrad)"/><text x="100" y="${y - 4}" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="800" fill="${readableOn(c.primary)}" text-anchor="middle">${esc(c.brand.charAt(0).toUpperCase())}</text>`;
  return `
  ${logo}
  <text x="${c.logo ? 146 : 140}" y="${y - 4}" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="0.5" fill="${c.ink}" opacity="0.92">${esc(c.brand)}</text>
  <text x="${c.w - 72}" y="${y - 4}" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="1.6" fill="${c.muted}" text-anchor="end">${esc(String(c.post.platform).toUpperCase())} · DAY ${c.post.day}</text>`;
}

function ambience(c: Ctx) {
  return `
  <rect width="${c.w}" height="${c.h}" fill="${c.bg}"/>
  <ellipse cx="${c.w * 0.15}" cy="${c.h * 0.12}" rx="${c.w * 0.6}" ry="${c.h * 0.35}" fill="url(#glow)"/>
  <ellipse cx="${c.w * 0.9}" cy="${c.h * 0.85}" rx="${c.w * 0.55}" ry="${c.h * 0.3}" fill="url(#glow2)"/>`;
}

/* ------------------------------------------------------------------ */
/* layouts                                                             */
/* ------------------------------------------------------------------ */

type Layout = (c: Ctx) => string;

const layouts: Record<string, Layout> = {
  "bold-type": (c) => {
    const lines = wrap(c.post.hook, 16, 5);
    const size = lines.length > 4 ? 96 : lines.length > 3 ? 112 : 130;
    return `
    ${ambience(c)}
    <rect x="72" y="${c.h * 0.16}" width="10" height="${lines.length * size * 1.06}" fill="url(#brandGrad)"/>
    ${textBlock(lines, 118, c.h * 0.16 + size * 0.82, size, 1.06, c.ink, { weight: 850, tracking: -3.5 })}
    ${textBlock(wrap(c.post.cta, 42, 2), 118, c.h * 0.16 + lines.length * size * 1.06 + 76, 30, 1.35, c.primary, { weight: 700, tracking: -0.2 })}
    ${footer(c)}`;
  },

  "hero-statement": (c) => {
    const lines = wrap(c.post.hook, 18, 4);
    return `
    ${ambience(c)}
    <rect x="0" y="0" width="${c.w}" height="${c.h}" fill="url(#brandGrad)" opacity="0.14"/>
    <text x="72" y="150" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4" fill="${c.primary}">${esc(String(c.post.pillar).toUpperCase())}</text>
    ${textBlock(lines, 72, c.h * 0.42, 108, 1.08, c.ink, { weight: 850, tracking: -3 })}
    <rect x="72" y="${c.h * 0.42 + lines.length * 108 * 1.08 + 28}" width="220" height="6" fill="url(#brandGrad)"/>
    ${textBlock(wrap(c.post.productName || c.post.cta, 40, 2), 72, c.h * 0.42 + lines.length * 108 * 1.08 + 96, 32, 1.3, c.muted, { weight: 600, tracking: 0 })}
    ${footer(c)}`;
  },

  "product-cutout": (c) => {
    const cx = c.w / 2;
    const cy = c.h * 0.42;
    return `
    ${ambience(c)}
    <ellipse cx="${cx}" cy="${cy}" rx="300" ry="300" fill="url(#brandGrad)" opacity="0.28" filter="url(#soft)"/>
    <rect x="${cx - 190}" y="${cy - 250}" width="380" height="470" rx="42" fill="${mix(c.bg, c.ink, 0.08)}" stroke="${mix(c.bg, c.ink, 0.18)}" stroke-width="2"/>
    <rect x="${cx - 150}" y="${cy - 200}" width="300" height="300" rx="28" fill="url(#brandGrad)" opacity="0.9"/>
    <text x="${cx}" y="${cy - 30}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="850" fill="${readableOn(c.primary)}" text-anchor="middle">${esc((c.post.productName || c.brand).slice(0, 2).toUpperCase())}</text>
    <ellipse cx="${cx}" cy="${cy + 250}" rx="200" ry="24" fill="#000" opacity="0.35" filter="url(#soft)"/>
    ${textBlock(wrap(c.post.productName || c.brand, 24, 1), cx, cy + 300, 44, 1.2, c.ink, { weight: 800, anchor: "middle", tracking: -1 })}
    ${textBlock(wrap(c.post.hook, 30, 3), cx, c.h * 0.78, 42, 1.2, c.muted, { weight: 600, anchor: "middle", tracking: -0.6 })}
    ${footer(c)}`;
  },

  "quote-card": (c) => {
    const lines = wrap(c.post.hook, 22, 5);
    return `
    ${ambience(c)}
    <text x="72" y="${c.h * 0.24}" font-family="Georgia, serif" font-size="220" font-weight="700" fill="url(#brandGrad)" opacity="0.5">&#8220;</text>
    ${textBlock(lines, 72, c.h * 0.34, 74, 1.16, c.ink, { weight: 700, tracking: -2 })}
    <rect x="72" y="${c.h * 0.34 + lines.length * 74 * 1.16 + 40}" width="90" height="4" fill="${c.primary}"/>
    <text x="72" y="${c.h * 0.34 + lines.length * 74 * 1.16 + 96}" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600" letter-spacing="1" fill="${c.muted}">Verified customer · ${esc(c.brand)}</text>
    <text x="72" y="${c.h * 0.34 + lines.length * 74 * 1.16 + 140}" font-family="Inter, Arial, sans-serif" font-size="30" fill="${c.primary}">★★★★★</text>
    ${footer(c)}`;
  },

  "split-compare": (c) => {
    const half = c.h * 0.36;
    return `
    ${ambience(c)}
    <rect x="0" y="${c.h * 0.14}" width="${c.w}" height="${half}" fill="${mix(c.bg, "#FFFFFF", 0.05)}"/>
    <rect x="0" y="${c.h * 0.14 + half}" width="${c.w}" height="${half}" fill="url(#brandGrad)" opacity="0.22"/>
    <text x="72" y="${c.h * 0.14 + 60}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="4" fill="${c.muted}">WITHOUT</text>
    ${textBlock(wrap("The usual way. Slow, inconsistent, forgettable.", 26, 3), 72, c.h * 0.14 + 130, 52, 1.18, c.muted, { weight: 700, tracking: -1.2 })}
    <text x="72" y="${c.h * 0.14 + half + 60}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="4" fill="${c.primary}">WITH ${esc(c.brand.toUpperCase())}</text>
    ${textBlock(wrap(c.post.hook, 26, 3), 72, c.h * 0.14 + half + 130, 52, 1.18, c.ink, { weight: 800, tracking: -1.2 })}
    ${footer(c)}`;
  },

  "data-tile": (c) => {
    const num = (c.post.hook.match(/\d+/) || [String(30 + (c.post.day % 60))])[0];
    return `
    ${ambience(c)}
    ${textBlock([num], 72, c.h * 0.46, 340, 1, c.ink, { weight: 850, tracking: -18 })}
    <rect x="72" y="${c.h * 0.5}" width="${c.w - 144}" height="4" fill="url(#brandGrad)"/>
    ${textBlock(wrap(c.post.hook, 26, 4), 72, c.h * 0.58, 54, 1.2, c.muted, { weight: 600, tracking: -1 })}
    ${footer(c)}`;
  },

  "carousel-teach": (c) => {
    const lines = wrap(c.post.hook, 17, 4);
    return `
    ${ambience(c)}
    <rect x="72" y="130" width="120" height="120" rx="28" fill="url(#brandGrad)"/>
    <text x="132" y="212" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="850" fill="${readableOn(c.primary)}" text-anchor="middle">${c.post.day}</text>
    ${textBlock(lines, 72, c.h * 0.42, 96, 1.1, c.ink, { weight: 850, tracking: -3 })}
    ${[0, 1, 2]
      .map(
        (i) =>
          `<rect x="72" y="${c.h * 0.66 + i * 74}" width="${c.w - 144}" height="56" rx="16" fill="${mix(c.bg, "#FFFFFF", 0.06)}"/><circle cx="106" cy="${c.h * 0.66 + i * 74 + 28}" r="9" fill="${c.primary}"/><text x="136" y="${c.h * 0.66 + i * 74 + 37}" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="600" fill="${c.muted}">Slide ${i + 2} · ${["The problem", "The method", "The proof"][i]}</text>`
      )
      .join("")}
    <text x="72" y="${c.h - 130}" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700" fill="${c.primary}">SWIPE →</text>
    ${footer(c)}`;
  },

  "grid-flatlay": (c) => {
    const cells = [0, 1, 2, 3].map((i) => {
      const x = 72 + (i % 2) * ((c.w - 144) / 2 + 16);
      const y = c.h * 0.14 + Math.floor(i / 2) * 300;
      return `<rect x="${x}" y="${y}" width="${(c.w - 160) / 2}" height="284" rx="24" fill="${mix(c.bg, "#FFFFFF", 0.06)}" stroke="${mix(c.bg, "#FFFFFF", 0.12)}"/><rect x="${x + 40}" y="${y + 40}" width="${(c.w - 160) / 2 - 80}" height="204" rx="16" fill="url(#brandGrad)" opacity="${0.85 - i * 0.15}"/>`;
    });
    return `
    ${ambience(c)}
    ${cells.join("")}
    ${textBlock(wrap(c.post.hook, 24, 3), 72, c.h * 0.79, 56, 1.16, c.ink, { weight: 800, tracking: -1.6 })}
    ${footer(c)}`;
  },

  "before-after": (c) => {
    const midY = c.h * 0.16;
    const boxH = c.h * 0.4;
    return `
    ${ambience(c)}
    <rect x="72" y="${midY}" width="${(c.w - 160) / 2}" height="${boxH}" rx="24" fill="${mix(c.bg, "#FFFFFF", 0.06)}"/>
    <rect x="${72 + (c.w - 160) / 2 + 16}" y="${midY}" width="${(c.w - 160) / 2}" height="${boxH}" rx="24" fill="url(#brandGrad)" opacity="0.35"/>
    <text x="${72 + 28}" y="${midY + 52}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="3" fill="${c.muted}">BEFORE</text>
    <text x="${72 + (c.w - 160) / 2 + 44}" y="${midY + 52}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="3" fill="${c.ink}">AFTER</text>
    ${textBlock(wrap(c.post.hook, 24, 3), 72, midY + boxH + 90, 58, 1.16, c.ink, { weight: 800, tracking: -1.8 })}
    ${textBlock(wrap(c.post.cta, 40, 2), 72, midY + boxH + 90 + 3 * 58 * 1.16 + 20, 28, 1.3, c.primary, { weight: 600, tracking: 0 })}
    ${footer(c)}`;
  },

  "editorial-photo": (c) => {
    return `
    ${ambience(c)}
    <rect x="0" y="0" width="${c.w}" height="${c.h * 0.62}" fill="url(#brandGrad)" opacity="0.5"/>
    <rect x="0" y="0" width="${c.w}" height="${c.h * 0.62}" fill="${c.bg}" opacity="0.35"/>
    <circle cx="${c.w * 0.68}" cy="${c.h * 0.3}" r="180" fill="${c.bg}" opacity="0.25"/>
    <rect x="0" y="${c.h * 0.52}" width="${c.w}" height="${c.h * 0.1}" fill="${c.bg}" opacity="0.6"/>
    ${textBlock(wrap(c.post.hook, 20, 4), 72, c.h * 0.72, 78, 1.12, c.ink, { weight: 800, tracking: -2.4 })}
    ${footer(c)}`;
  },

  "sticker-collage": (c) => {
    const lines = wrap(c.post.hook, 18, 4);
    return `
    ${ambience(c)}
    <g transform="rotate(-4 ${c.w / 2} ${c.h * 0.4})">
      <rect x="86" y="${c.h * 0.22}" width="${c.w - 172}" height="${lines.length * 92 + 90}" rx="10" fill="${mix(c.bg, "#FFFFFF", 0.08)}" stroke="${c.primary}" stroke-width="3"/>
      ${textBlock(lines, 130, c.h * 0.22 + 96, 82, 1.1, c.ink, { weight: 850, tracking: -2.6 })}
    </g>
    <g transform="rotate(6 ${c.w * 0.75} ${c.h * 0.72})">
      <rect x="${c.w * 0.5}" y="${c.h * 0.68}" width="380" height="110" rx="8" fill="url(#brandGrad)"/>
      <text x="${c.w * 0.5 + 190}" y="${c.h * 0.68 + 70}" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800" fill="${readableOn(c.primary)}" text-anchor="middle">${esc(c.post.cta.slice(0, 22))}</text>
    </g>
    ${footer(c)}`;
  },

  "lifestyle-context": (c) => {
    return `
    ${ambience(c)}
    <rect x="72" y="${c.h * 0.12}" width="${c.w - 144}" height="${c.h * 0.46}" rx="32" fill="url(#brandGrad)" opacity="0.45"/>
    <circle cx="${c.w * 0.5}" cy="${c.h * 0.35}" r="120" fill="${c.bg}" opacity="0.4"/>
    <circle cx="${c.w * 0.5}" cy="${c.h * 0.35}" r="120" fill="none" stroke="${c.ink}" stroke-opacity="0.25" stroke-width="2"/>
    ${textBlock(wrap(c.post.hook, 22, 4), 72, c.h * 0.68, 66, 1.14, c.ink, { weight: 800, tracking: -2 })}
    ${textBlock(wrap(c.post.cta, 44, 1), 72, c.h * 0.68 + 4 * 66 * 1.14 + 10, 28, 1.2, c.primary, { weight: 600, tracking: 0 })}
    ${footer(c)}`;
  },
};

/* ------------------------------------------------------------------ */
/* entry point                                                         */
/* ------------------------------------------------------------------ */

export function renderPosterSVG(post: Post, project: Project, logoDataUri: string | null = null): string {
  const vertical = post.format === "reel" || post.format === "video" || post.format === "story";
  const w = 1080;
  const h = vertical ? 1920 : 1350;

  const bg = project.colors.background || "#0B0B12";
  const primary = project.colors.primary || "#7C5CFF";
  const secondary = project.colors.secondary || "#22D3EE";
  const ink = project.colors.text || readableOn(bg);
  const muted = mix(bg, ink, 0.62);

  const ctx: Ctx = {
    w,
    h,
    bg,
    primary,
    secondary,
    ink,
    muted,
    brand: project.name,
    logo: logoDataUri,
    post,
  };

  const layout = layouts[post.layout] || layouts["bold-type"];

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${defs(ctx)}
<g clip-path="url(#round)">
${layout(ctx)}
<rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.5" pointer-events="none" fill="transparent"/>
</g>
</svg>`;
}

export const LAYOUT_KEYS = Object.keys(layouts);
