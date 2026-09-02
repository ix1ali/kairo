/**
 * Candidate looks for the site, kept in one place so a preview page can render
 * them side by side. Nothing here is wired into the live site yet — this is a
 * showroom. Once a direction is picked, its tokens move into globals.css.
 *
 * Every theme carries the same token names, so the preview markup never
 * branches on which theme it is drawing.
 */

export interface MockTheme {
  id: string;
  name: string;
  mood: "dark" | "light";
  /** One line on who this suits, so the choice is not purely aesthetic. */
  note: string;

  bg: string;
  /** Slightly raised band, used for alternating sections. */
  band: string;
  /** Card surface. */
  surface: string;
  border: string;
  text: string;
  muted: string;
  faint: string;

  /** Headline and button gradient. Two or three stops. */
  grad: string[];
  /** Solid pull-colour for icons and chips. */
  accent: string;
  /** Positive / confirm colour (posted ticks, savings). */
  good: string;
  /** Attention colour (offers, warnings). */
  warm: string;
  /** Glow behind the hero. */
  glow: string;
  /** Text colour that sits on top of the gradient button. */
  onGrad: string;
}

export const MOCK_THEMES: MockTheme[] = [
  /* ----------------------------- dark ----------------------------- */
  {
    id: "nebula",
    name: "Nebula",
    mood: "dark",
    note: "What the site runs today. Violet into cyan on near-black.",
    bg: "#FFFFFF",
    band: "#09090F",
    surface: "#FFFFFF",
    border: "#E7E7EF",
    text: "#0B0B12",
    muted: "#55556B",
    faint: "#6E6E85",
    grad: ["#7C5CFF", "#22D3EE"],
    accent: "#6D4DF6",
    good: "#4D7C0F",
    warm: "#B45309",
    glow: "rgba(124,92,255,0.20)",
    onGrad: "#FFFFFF",
  },
  {
    id: "aurora",
    name: "Aurora",
    mood: "dark",
    note: "The same idea pushed harder — violet through magenta into cyan.",
    bg: "#08080E",
    band: "#0B0912",
    surface: "#12101C",
    border: "#241F33",
    text: "#F2ECFB",
    muted: "#A79BC0",
    faint: "#665C7E",
    grad: ["#A855F7", "#EC4899", "#22D3EE"],
    accent: "#E879F9",
    good: "#4ADE80",
    warm: "#B45309",
    glow: "rgba(168,85,247,0.24)",
    onGrad: "#FFFFFF",
  },
  {
    id: "midnight",
    name: "Midnight",
    mood: "dark",
    note: "Cooler and more corporate. Reads as software, not as a studio.",
    bg: "#060B14",
    band: "#08101C",
    surface: "#0D1523",
    border: "#1A2537",
    text: "#E8F0FA",
    muted: "#8CA0B8",
    faint: "#556579",
    grad: ["#3B82F6", "#06B6D4"],
    accent: "#38BDF8",
    good: "#34D399",
    warm: "#B45309",
    glow: "rgba(59,130,246,0.22)",
    onGrad: "#04121F",
  },
  {
    id: "ember",
    name: "Ember",
    mood: "dark",
    note: "Warm and appetising. Strong for food, restaurants and hospitality.",
    bg: "#0C0907",
    band: "#0F0B09",
    surface: "#17110D",
    border: "#2C211A",
    text: "#FBF1E8",
    muted: "#B6A296",
    faint: "#75655B",
    grad: ["#F97316", "#B45309"],
    accent: "#FB923C",
    good: "#A3E635",
    warm: "#FB7185",
    glow: "rgba(249,115,22,0.20)",
    onGrad: "#1A0E05",
  },

  /* ----------------------------- light ---------------------------- */
  {
    id: "paper",
    name: "Paper",
    mood: "light",
    note: "Your gradient, inverted onto warm off-white. The safest light option.",
    bg: "#FAF9F7",
    band: "#F3F1EE",
    surface: "#FFFFFF",
    border: "#E6E2DC",
    text: "#141220",
    muted: "#615D70",
    faint: "#89849A",
    grad: ["#7C5CFF", "#22D3EE"],
    accent: "#6D4DF6",
    good: "#3F9142",
    warm: "#D97706",
    glow: "rgba(124,92,255,0.14)",
    onGrad: "#FFFFFF",
  },
  {
    id: "swiss",
    name: "Swiss",
    mood: "light",
    note: "Pure white, tight grid, indigo into sky. Feels expensive and neutral.",
    bg: "#FFFFFF",
    band: "#F6F7F9",
    surface: "#FFFFFF",
    border: "#E4E7EC",
    text: "#0B0D12",
    muted: "#59616F",
    faint: "#828B9A",
    grad: ["#4F46E5", "#0EA5E9"],
    accent: "#4F46E5",
    good: "#0E9F6E",
    warm: "#D97706",
    glow: "rgba(79,70,229,0.12)",
    onGrad: "#FFFFFF",
  },
  {
    id: "cream",
    name: "Cream",
    mood: "light",
    note: "Editorial and warm. Plum into coral — good for beauty and fashion.",
    bg: "#FDF8F3",
    band: "#F7EEE4",
    surface: "#FFFFFF",
    border: "#EBDFD1",
    text: "#2A1B2E",
    muted: "#77646E",
    faint: "#8D7A84",
    grad: ["#7E22CE", "#F97316"],
    accent: "#9333EA",
    good: "#3F9142",
    warm: "#EA580C",
    glow: "rgba(126,34,206,0.13)",
    onGrad: "#FFFFFF",
  },
  {
    id: "mono",
    name: "Mono",
    mood: "light",
    note: "No gradient at all. Black type, one acid accent. The boldest choice.",
    bg: "#FFFFFF",
    band: "#F4F4F2",
    surface: "#FFFFFF",
    border: "#DEDEDA",
    text: "#0A0A0A",
    muted: "#55554F",
    faint: "#8E8E86",
    grad: ["#111111", "#111111"],
    accent: "#111111",
    good: "#1F7A3D",
    warm: "#B45309",
    glow: "rgba(17,17,17,0.06)",
    onGrad: "#DDF163",
  },
];

export function gradientCss(t: MockTheme, angle = "100deg") {
  return `linear-gradient(${angle}, ${t.grad.join(", ")})`;
}

export function getMockTheme(id: string): MockTheme | undefined {
  return MOCK_THEMES.find((t) => t.id === id);
}
