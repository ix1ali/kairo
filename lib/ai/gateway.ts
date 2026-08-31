import {
  experimental_generateImage as generateImageSDK,
  experimental_generateVideo as generateVideoSDK,
  generateText,
} from "ai";
import {
  imageFallbacks,
  imageModel,
  textFallbacks,
  textModel,
  videoFallbacks,
  videoModel,
} from "./models";

/**
 * Generation through the Vercel AI Gateway.
 *
 * One credential reaches every provider — Seedance, Veo, Kling, FLUX, GPT
 * Image, Claude — so there is no per-provider key for a customer or for us to
 * rotate. Auth is OIDC on Vercel and after `vercel env pull`, with
 * AI_GATEWAY_API_KEY as the static alternative for CI.
 *
 * Each call passes the rest of its model list as gateway fallbacks, so one
 * provider being down or a model being retired degrades to the next rather
 * than failing the request. Tags are attached for per-feature cost attribution.
 */

export function gatewayConfigured(): boolean {
  return !!(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
}

/** Shapes a 402/403/429 into something a route handler can act on. */
export class GatewayError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly actionable?: string
  ) {
    super(message);
    this.name = "GatewayError";
  }
}

function classify(err: unknown): GatewayError {
  const anyErr = err as { statusCode?: number; message?: string };
  const status = anyErr?.statusCode;
  const message = anyErr?.message || "Generation failed.";

  if (status === 402) {
    return new GatewayError(message, 402, "AI Gateway budget reached. Top up credits to continue.");
  }
  if (status === 403 && /credit card/i.test(message)) {
    return new GatewayError(
      message,
      403,
      "AI Gateway needs a card on file before it will release the free credits."
    );
  }
  if (status === 429) {
    return new GatewayError(message, 429, "Rate limited. Try again shortly.");
  }
  return new GatewayError(message, status);
}

const ASPECT = { "1:1": "1:1", "4:5": "4:5", "9:16": "9:16" } as const;

export interface GatewayImageRequest {
  prompt: string;
  aspect: keyof typeof ASPECT;
  /** Reference images as data URIs or URLs, for style matching. */
  references?: string[];
  /** Attributed in gateway reporting. */
  userId?: string;
}

/** Returns a data URI, or throws a GatewayError the caller can surface. */
export async function gatewayImage(req: GatewayImageRequest): Promise<string> {
  try {
    const { images } = await generateImageSDK({
      model: imageModel(),
      prompt: req.prompt,
      aspectRatio: ASPECT[req.aspect],
      providerOptions: {
        gateway: {
          models: imageFallbacks(),
          tags: ["feature:post-artwork"],
          ...(req.userId ? { user: req.userId } : {}),
        },
      },
    });

    const image = images[0];
    if (!image) throw new GatewayError("The model returned no image.");
    const base64 = image.base64 ?? Buffer.from(image.uint8Array).toString("base64");
    return `data:${image.mediaType || "image/png"};base64,${base64}`;
  } catch (err) {
    if (err instanceof GatewayError) throw err;
    throw classify(err);
  }
}

export interface GatewayVideoRequest {
  prompt: string;
  /** Seconds. Providers clamp to what they support. */
  duration?: number;
  userId?: string;
}

/** Returns a URL or data URI for the finished clip. */
export async function gatewayVideo(req: GatewayVideoRequest): Promise<string> {
  try {
    const { videos } = await generateVideoSDK({
      model: videoModel(),
      prompt: req.prompt,
      aspectRatio: "9:16",
      ...(req.duration ? { duration: req.duration } : {}),
      providerOptions: {
        gateway: {
          models: videoFallbacks(),
          tags: ["feature:post-video"],
          ...(req.userId ? { user: req.userId } : {}),
        },
      },
    });

    const video = videos[0];
    if (!video) throw new GatewayError("The model returned no video.");
    // Video comes back as bytes; hand it on as a data URI and let the caller
    // decide where to persist it.
    const base64 = video.base64 ?? Buffer.from(video.uint8Array).toString("base64");
    return `data:${video.mediaType || "video/mp4"};base64,${base64}`;
  } catch (err) {
    if (err instanceof GatewayError) throw err;
    throw classify(err);
  }
}

export async function gatewayText(
  system: string,
  user: string,
  opts: { userId?: string; tag?: string } = {}
): Promise<string> {
  try {
    const { text } = await generateText({
      model: textModel(),
      system,
      prompt: user,
      providerOptions: {
        gateway: {
          models: textFallbacks(),
          tags: [opts.tag || "feature:copy"],
          ...(opts.userId ? { user: opts.userId } : {}),
        },
      },
    });
    return text;
  } catch (err) {
    if (err instanceof GatewayError) throw err;
    throw classify(err);
  }
}
