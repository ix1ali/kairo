/**
 * The showcase reels, ordered and labelled by hand.
 *
 * Each item carries the kind of content it is, not just the file. A row of
 * nice pictures only says "we can make pictures"; naming them says what you
 * actually get across a month, which is the harder and more useful claim.
 * Every label is an honest description of the clip it sits under.
 */

const clip = (n: number, kind: string) => {
  const s = String(n).padStart(2, "0");
  return { src: `/assets/video/v${s}.mp4`, poster: `/assets/video/v${s}.jpg`, kind };
};

const still = (n: number, kind: string) => ({
  src: `/assets/creatives/c${String(n).padStart(2, "0")}.webp`,
  kind,
});

/**
 * Eight clips, alternating a creator to camera with a cinematic product shot,
 * so the row never reads as all talking heads or all still life. Cut to six
 * seconds at 360x640, roughly 195KB each, and nothing loads until it is near
 * the viewport.
 */
export const VIDEO_ROW = [
  clip(1, "UGC review"),
  clip(2, "Product ad"),
  clip(3, "Creator demo"),
  clip(4, "Close-up detail"),
  clip(5, "Testimonial"),
  clip(6, "Brand story"),
  clip(7, "Unboxing"),
  clip(8, "Lifestyle shot"),
];

/**
 * The one campaign we can show as our own work: a single product photo and the
 * four posts built from it. Everything else that used to live here was
 * placeholder imagery of other brands, which argued nothing.
 */
export const CAMPAIGN = {
  source: "/assets/creatives/source-lipglaze.webp",
  posts: [
    still(1, "Product hero"),
    still(2, "Flavour story"),
    still(3, "Bilingual ad"),
    still(4, "Model shot"),
  ],
};
