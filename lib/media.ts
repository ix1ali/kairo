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
 * One row, fourteen clips, alternating a creator to camera with a cinematic
 * product shot so the line never reads as all-talking-heads or all-still-life.
 *
 * Chosen by eye from the full library rather than taken in file order, and cut
 * to six seconds at 360x640 — roughly 195KB each, so the whole row is lighter
 * than a single unoptimised clip was. Nothing loads until it is near the
 * viewport.
 */
export const VIDEO_ROW = Array.from({ length: 14 }, (_, i) => clip(i + 1));

/**
 * The one campaign we can show as our own work: a single product photo and the
 * four posts built from it. Everything else that used to live here was
 * placeholder imagery of other brands, which argued nothing, so it is gone
 * rather than sitting around looking like a portfolio.
 */
export const CAMPAIGN = {
  source: "/assets/creatives/source-lipglaze.webp",
  posts: [1, 2, 3, 4].map(still),
};
