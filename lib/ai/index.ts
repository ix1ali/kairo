import { GatewayError, gatewayConfigured, gatewayImage, gatewayText, gatewayVideo } from "./gateway";
import { imageModel, textModel, videoModel } from "./models";
import { HiggsfieldError, higgsfieldConfigured, higgsfieldImage as hfImage } from "./higgsfield";
import { VeoError, veoConfigured, veoVideo } from "./veo";

/**
 * Pluggable generation layer.
 *
 * Koala always works with nothing configured: the deterministic strategy
 * engine writes the plan and the SVG poster engine renders the artwork.
 *
 * Above that sits the Vercel AI Gateway, which is the intended production
 * path — one credential reaches Seedance, Veo, Kling, FLUX, GPT Image and
 * Claude, so neither we nor a customer manages per-provider keys. The direct
 * provider calls below it are kept as an escape hatch for running outside
 * Vercel with your own keys.
 *
 * Order of preference: gateway, then a directly configured provider, then the
 * built-in engines.
 */

export type ImageProviderName = "gateway" | "gemini" | "openai" | "higgsfield" | "local";
export type TextProviderName = "gateway" | "anthropic" | "openai" | "gemini" | "local";

export interface ProviderStatus {
  name: string;
  key: string;
  configured: boolean;
  kind: "image" | "video" | "text";
  note: string;
}

export function providerStatus(): ProviderStatus[] {
  return [
    {
      name: "Vercel AI Gateway",
      key: "VERCEL_OIDC_TOKEN / AI_GATEWAY_API_KEY",
      configured: gatewayConfigured(),
      kind: "image",
      note: `Routes to every model. Images ${imageModel()}, video ${videoModel()}, copy ${textModel()}.`,
    },
    {
      name: "Google Gemini",
      key: "GEMINI_API_KEY",
      configured: !!process.env.GEMINI_API_KEY,
      kind: "image",
      note: "Image generation and brand-aware copy.",
    },
    {
      name: "OpenAI",
      key: "OPENAI_API_KEY",
      configured: !!process.env.OPENAI_API_KEY,
      kind: "image",
      note: "gpt-image-1 for artwork, GPT for copy.",
    },
    {
      name: "Higgsfield",
      key: "HIGGSFIELD_API_KEY_ID + HIGGSFIELD_API_KEY_SECRET",
      configured: higgsfieldConfigured(),
      kind: "image",
      note: "Post artwork. Leads over the gateway when configured.",
    },
    {
      name: "Google Veo",
      key: "GEMINI_API_KEY",
      configured: veoConfigured(),
      kind: "video",
      note: `Video from the storyboard, using ${process.env.KOALA_VEO_MODEL || "veo-3.1-generate-preview"}.`,
    },
    {
      name: "Anthropic",
      key: "ANTHROPIC_API_KEY",
      configured: !!process.env.ANTHROPIC_API_KEY,
      kind: "text",
      note: "Caption and strategy refinement.",
    },
  ];
}

/**
 * Higgsfield leads for stills. It is the house look for this product — the
 * marketing renders were made with it — so when it is configured it wins over
 * the general-purpose gateway rather than being a last resort.
 */
export function activeImageProvider(): ImageProviderName {
  if (higgsfieldConfigured()) return "higgsfield";
  if (gatewayConfigured()) return "gateway";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "local";
}

export function activeTextProvider(): TextProviderName {
  if (gatewayConfigured()) return "gateway";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return "local";
}

async function safeFetch(url: string, init: RequestInit, timeoutMs = 60000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* image                                                               */
/* ------------------------------------------------------------------ */

/**
 * Why the last generation failed, in words a customer can act on.
 *
 * Generation returns null rather than throwing, because a failed image should
 * leave the drawn poster in place instead of failing the whole request. That
 * swallowed the reason though, so every failure reached the customer as
 * "Generation is not available yet" — including the one that actually means
 * "the account needs a card on file", which is trivially fixable and was
 * completely invisible.
 *
 * Module-level state is acceptable here only because it is read immediately
 * after the call that set it, on the same request.
 */
let lastFailure: string | null = null;

function describeFailure(err: unknown): string {
  if (err instanceof GatewayError || err instanceof HiggsfieldError || err instanceof VeoError) {
    return err.actionable || err.message;
  }
  return err instanceof Error ? err.message : String(err);
}

/** Consumes the reason, so a later unrelated failure cannot report a stale one. */
export function takeLastGenerationFailure(): string | null {
  const value = lastFailure;
  lastFailure = null;
  return value;
}

export interface ImageRequest {
  prompt: string;
  aspect: "1:1" | "4:5" | "9:16";
  /**
   * The customer's own photographs — product shots, logo, past posts.
   *
   * This is the difference between advertising their product and advertising
   * a plausible imitation of it. Without a reference the model invents the
   * bottle, the label and the colour, and the result is recognisably not the
   * thing the customer sells.
   */
  references?: string[];
  /** Attributed in gateway cost reporting. */
  userId?: string;
}

/** Returns a data URI, or null when no provider is configured or the call fails. */
export async function generateImage(req: ImageRequest): Promise<string | null> {
  const provider = activeImageProvider();
  try {
    if (provider === "gateway") {
      return await gatewayImage({
        prompt: req.prompt,
        aspect: req.aspect,
        references: req.references,
        userId: req.userId,
      });
    }
    if (provider === "higgsfield") {
      return await hfImage({ prompt: req.prompt, params: { aspect_ratio: req.aspect } });
    }
    if (provider === "gemini") return await geminiImage(req);
    if (provider === "openai") return await openaiImage(req);
  } catch (err) {
    console.error("[koala:ai] image generation failed", err);
    lastFailure = describeFailure(err);
  }
  return null;
}

async function geminiImage(req: ImageRequest): Promise<string | null> {
  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
  const res = await safeFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${req.prompt}\nAspect ratio: ${req.aspect}.` }] }],
      }),
    }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const data = p?.inlineData?.data || p?.inline_data?.data;
    const mime = p?.inlineData?.mimeType || p?.inline_data?.mime_type || "image/png";
    if (data) return `data:${mime};base64,${data}`;
  }
  return null;
}

async function openaiImage(req: ImageRequest): Promise<string | null> {
  const size = req.aspect === "9:16" ? "1024x1536" : req.aspect === "4:5" ? "1024x1536" : "1024x1024";
  const res = await safeFetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt: req.prompt,
      size,
      n: 1,
    }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (b64) return `data:image/png;base64,${b64}`;
  const url = json?.data?.[0]?.url;
  return url || null;
}

/* ------------------------------------------------------------------ */
/* video                                                               */
/* ------------------------------------------------------------------ */

export async function generateVideo(
  prompt: string,
  userId?: string,
  /** A still to animate — normally the customer's own product photograph. */
  reference?: string,
  /** Veo accepts 4, 6 or 8 seconds. */
  seconds?: number
): Promise<string | null> {
  // Veo first when a Gemini key exists: it is the model this product's video
  // pipeline is written for, and it takes the storyboard's first frame.
  if (veoConfigured()) {
    try {
      return await veoVideo({ prompt, startImage: reference, seconds, aspect: "9:16" });
    } catch (err) {
      console.error("[koala:ai] veo video failed", err);
      lastFailure = describeFailure(err);
      // Fall through to the gateway rather than giving up, when one exists.
    }
  }

  if (gatewayConfigured()) {
    try {
      return await gatewayVideo({ prompt, userId, reference });
    } catch (err) {
      console.error("[koala:ai] gateway video failed", err);
      lastFailure = describeFailure(err);
      return null;
    }
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* text                                                                */
/* ------------------------------------------------------------------ */

export async function refineCopy(system: string, user: string): Promise<string | null> {
  const provider = activeTextProvider();
  try {
    if (provider === "gateway") return await gatewayText(system, user);
    if (provider === "anthropic") {
      const res = await safeFetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
          max_tokens: 1200,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.content?.[0]?.text || null;
    }
    if (provider === "openai") {
      const res = await safeFetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.choices?.[0]?.message?.content || null;
    }
    if (provider === "gemini") {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const res = await safeFetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ parts: [{ text: user }] }],
          }),
        }
      );
      if (!res.ok) return null;
      const json = await res.json();
      return json?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  } catch (err) {
    console.error("[koala:ai] copy refinement failed", err);
  }
  return null;
}
