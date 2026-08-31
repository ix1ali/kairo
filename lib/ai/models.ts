/**
 * Which model does which job.
 *
 * Every slug here was taken from `gateway.getAvailableModels()` rather than
 * from memory — gateway slugs change and a wrong one is a 400 at runtime. Each
 * job lists fallbacks in order, so a provider outage or a model being retired
 * degrades to the next one instead of failing the request.
 */

export interface ModelChoice {
  /** Gateway slug, `provider/model`. */
  id: string;
  label: string;
  why: string;
}

/**
 * Stills for posts. FLUX.2 pro leads because it holds text and layout better
 * than the alternatives at 4MP and accepts multiple reference images, which is
 * what the recreate-from-reference feature needs.
 */
export const IMAGE_MODELS: ModelChoice[] = [
  { id: "bfl/flux-2-pro", label: "FLUX.2 pro", why: "Highest fidelity, multi-reference, holds typography" },
  { id: "openai/gpt-image-2", label: "GPT Image 2", why: "Strongest prompt adherence for literal briefs" },
  { id: "bytedance/seedream-5.0-pro", label: "Seedream 5.0 pro", why: "Excellent product and beauty rendering" },
  { id: "recraft/recraft-v4.1-pro", label: "Recraft V4.1 pro", why: "Design-native — best when the layout carries text" },
];

/**
 * Short-form video. Seedance 2.5 first: thirty-second joint audio-video with
 * reference control, which fits a storyboard rather than a single prompt.
 */
export const VIDEO_MODELS: ModelChoice[] = [
  { id: "bytedance/seedance-2.5", label: "Seedance 2.5", why: "30s storytelling, reference control, joint audio" },
  { id: "google/veo-3.1-generate-001", label: "Veo 3.1", why: "Best motion realism and physical plausibility" },
  { id: "klingai/kling-v3.0-t2v", label: "Kling 3.0", why: "Strong character consistency across shots" },
  { id: "alibaba/wan-v3.0-video", label: "Wan 3.0", why: "Fast and inexpensive for volume" },
];

/** Copy refinement and dialect work. */
export const TEXT_MODELS: ModelChoice[] = [
  { id: "anthropic/claude-sonnet-5", label: "Claude Sonnet 5", why: "Best long-form voice control and Arabic dialect" },
  { id: "openai/gpt-5.4", label: "GPT-5.4", why: "Fast, strong instruction following" },
  { id: "google/gemini-3-flash", label: "Gemini 3 Flash", why: "Cheapest for bulk caption passes" },
];

/** Env overrides, so a model can be swapped without a deploy. */
export function imageModel(): string {
  return process.env.KOALA_IMAGE_MODEL || IMAGE_MODELS[0].id;
}
export function videoModel(): string {
  return process.env.KOALA_VIDEO_MODEL || VIDEO_MODELS[0].id;
}
export function textModel(): string {
  return process.env.KOALA_TEXT_MODEL || TEXT_MODELS[0].id;
}

/** The rest of the list, used as gateway fallbacks. */
export const imageFallbacks = () => IMAGE_MODELS.map((m) => m.id).filter((id) => id !== imageModel());
export const videoFallbacks = () => VIDEO_MODELS.map((m) => m.id).filter((id) => id !== videoModel());
export const textFallbacks = () => TEXT_MODELS.map((m) => m.id).filter((id) => id !== textModel());
