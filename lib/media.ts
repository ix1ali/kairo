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
  [3, 13, 12, 14, 22, 6, 2, 5, 11].map(clip),
  // product and food — cinematic still life, nobody in shot
  [8, 7, 15, 9, 20, 21, 18, 19, 17, 4, 10, 16, 1].map(clip),
];

/**
 * Stills grouped into families — the lip-glaze campaign, then skincare, then
 * fragrance, fashion, food and finally home and auto. Consecutive images are
 * meant to be seen stacked as a pair, so the grouping matters twice over.
 */
export const STILL_ORDER = [
  // one lip-glaze campaign, four ways — the clearest proof of a consistent look
  1, 3, 4, 2,
  // skincare and beauty
  23, 8, 22, 40, 7,
  // fragrance, oud and Arabic luxury
  9, 29, 21, 19, 20,
  // fashion, eyewear and tech
  10, 15, 11, 6, 13, 18,
  // food and drink
  12, 28, 5, 35, 36, 34, 24, 37, 38, 32,
  // home, auto and lifestyle
  17, 16, 14, 31, 30, 25, 26, 27,
].map(still);

/** Columns of two, so the wall has a denser rhythm than the video rows. */
export const STILL_COLUMNS: string[][] = Array.from(
  { length: Math.ceil(STILL_ORDER.length / 2) },
  (_, i) => STILL_ORDER.slice(i * 2, i * 2 + 2)
);
