/**
 * The showcase reels, ordered by hand.
 *
 * These were sequenced by looking at every asset rather than by filename:
 * neighbours share a subject and a palette, so the wall reads as a set
 * instead of a shuffle. Two clips were near-identical and two stills were
 * weak or duplicated, so they are simply not listed — better a shorter wall
 * than a repeated one.
 */

const clip = (n: number) => {
  const s = String(n).padStart(2, "0");
  return { src: `/assets/video/v${s}.mp4`, poster: `/assets/video/v${s}.jpg` };
};

const still = (n: number) => `/assets/creatives/c${String(n).padStart(2, "0")}.webp`;

/**
 * Row one is people-led: creators to camera, hands holding product, beauty
 * portraits. Row two is everything shot without a person in frame.
 */
export const VIDEO_ROWS = [
  // UGC and beauty — a face or a pair of hands in almost every frame
  [3, 13, 12, 14, 22, 6, 2, 5].map(clip),
  // product and food — cinematic still life, nobody in shot
  [8, 7, 15, 9, 20, 21, 18, 17, 4, 10, 16, 1].map(clip),
];

/**
 * Stills grouped into families, then ordered so the palette flows: pale
 * fragrance into dark oud, cream eyewear into navy tech, bright drinks into
 * dark food. Consecutive images are seen stacked as a pair and neighbouring
 * columns sit side by side, so the grouping has to hold in both directions.
 *
 * Twelve of the forty are not here. Eight were weak — flat promo banners and
 * text-heavy infographics that undercut everything around them — one was a
 * near-duplicate, and the four lip-glaze creatives were pulled out to carry
 * the before-and-after section on their own.
 */
export const STILL_ORDER = [
  // skincare and beauty
  23, 8, 22, 7, 40,
  // fragrance, oud and Arabic luxury — pale into dark
  9, 29, 21, 19, 20,
  // eyewear, audio and footwear — the clean, minimal end
  10, 15, 11, 6, 13, 18,
  // food and drink
  12, 28, 5, 35, 36, 37, 38, 24,
  // home, outdoor and auto
  17, 16, 14, 25,
].map(still);

/** Columns of two, so the wall has a denser rhythm than the video rows. */
export const STILL_COLUMNS: string[][] = Array.from(
  { length: Math.ceil(STILL_ORDER.length / 2) },
  (_, i) => STILL_ORDER.slice(i * 2, i * 2 + 2)
);
