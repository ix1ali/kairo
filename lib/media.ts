/**
 * The showcase reels, chosen and labelled by hand.
 *
 * Every item carries the kind of content it is, not just the file. A row of
 * nice pictures only says "we can make pictures"; naming them says what you
 * actually get across a month, which is the harder and more useful claim.
 *
 * The stills are all one brand on purpose. Ten different jobs for a single
 * lip glaze makes the range argument far better than ten unrelated products
 * would, because the variety is obviously the work rather than the catalogue.
 */

const clip = (n: number, kind: string) => {
  const s = String(n).padStart(2, "0");
  return { src: `/assets/video/v${s}.mp4`, poster: `/assets/video/v${s}.jpg`, kind };
};

const still = (slug: string, kind: string) => ({
  src: `/assets/creatives/${slug}.webp`,
  kind,
});

/**
 * Twelve clips, alternating a person to camera with a product-only shot so the
 * row never reads as all talking heads or all still life. Six seconds each at
 * 360x640, roughly 190KB apiece, and nothing loads until it is near the
 * viewport.
 */
export const VIDEO_ROW = [
  clip(1, "UGC review"),
  clip(2, "Product ad"),
  clip(3, "Creator demo"),
  clip(4, "Close-up detail"),
  clip(5, "Testimonial"),
  clip(6, "Brand story"),
  clip(7, "Get ready with me"),
  clip(8, "Ingredient story"),
  clip(9, "App demo"),
  clip(10, "Lifestyle"),
  clip(11, "How-to"),
  clip(12, "Product demo"),
];

/** Ten jobs, one product. */
export const IMAGE_ROW = [
  still("hero-shot", "Hero shot"),
  still("ugc-post", "UGC post"),
  still("offer-post", "Offer post"),
  still("before-after", "Before and after"),
  still("how-to", "How-to guide"),
  still("close-up", "Close-up"),
  still("model-shot", "Model shot"),
  still("flavour-story", "Flavour story"),
  still("lifestyle", "Lifestyle"),
  still("beauty-ad", "Beauty ad"),
];
