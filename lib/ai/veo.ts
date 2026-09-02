/**
 * Video generation with Google's Veo, through the Gemini API.
 *
 * Veo is a long-running operation, not a request/response: you submit to
 * `:predictLongRunning`, get an operation name back, and poll it until `done`.
 * The finished video is behind a URI that itself needs the API key, so this
 * module fetches the bytes and hands back a data URI — the caller then stores
 * it wherever the rest of the app stores media.
 *
 * Docs: https://ai.google.dev/gemini-api/docs/veo
 */

const BASE = "https://generativelanguage.googleapis.com/v1beta";

export class VeoError extends Error {
  constructor(message: string, readonly status?: number, readonly actionable?: string) {
    super(message);
    this.name = "VeoError";
  }
}

export function veoConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export function veoModel(): string {
  return process.env.KOALA_VEO_MODEL || "veo-3.1-generate-preview";
}

function key(): string {
  const k = process.env.GEMINI_API_KEY;
  if (!k) throw new VeoError("Gemini is not configured.", 401, "Set GEMINI_API_KEY.");
  return k;
}

async function call(url: string, init: RequestInit = {}, timeoutMs = 60_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { "x-goog-api-key": key(), "Content-Type": "application/json", ...(init.headers || {}) },
    });
  } finally {
    clearTimeout(timer);
  }
}

export interface VeoRequest {
  prompt: string;
  /** Veo accepts 4, 6 or 8 seconds. Anything else is clamped. */
  seconds?: number;
  aspect?: "9:16" | "16:9";
  /** A first frame, as a data URI — normally the customer's product photo. */
  startImage?: string;
  resolution?: "720p" | "1080p";
  timeoutMs?: number;
}

interface Operation {
  name?: string;
  done?: boolean;
  error?: { message?: string };
  response?: {
    generateVideoResponse?: {
      generatedSamples?: { video?: { uri?: string } }[];
    };
  };
}

/** Splits a data URI into the parts Gemini's inlineData expects. */
function inlineImage(dataUri: string): { mimeType: string; data: string } | null {
  const m = dataUri.match(/^data:([^;]+);base64,(.*)$/);
  return m ? { mimeType: m[1], data: m[2] } : null;
}

/** Returns a `data:video/mp4;base64,...` URI for the finished clip. */
export async function veoVideo(req: VeoRequest): Promise<string> {
  const seconds = [4, 6, 8].includes(req.seconds ?? 8) ? req.seconds ?? 8 : 8;

  const instance: Record<string, unknown> = { prompt: req.prompt };
  if (req.startImage) {
    const img = inlineImage(req.startImage);
    // A missing or malformed reference is dropped rather than failing the
    // whole render: losing the first frame is worse than losing the video.
    if (img) instance.image = { inlineData: img };
  }

  const submit = await call(`${BASE}/models/${veoModel()}:predictLongRunning`, {
    method: "POST",
    body: JSON.stringify({
      instances: [instance],
      parameters: {
        aspectRatio: req.aspect || "9:16",
        durationSeconds: String(seconds),
        resolution: req.resolution || "720p",
      },
    }),
  });

  if (!submit.ok) {
    const body = await submit.text().catch(() => "");
    throw new VeoError(
      `Veo rejected the request (${submit.status}). ${body.slice(0, 200)}`,
      submit.status,
      submit.status === 401 || submit.status === 403
        ? "Check GEMINI_API_KEY."
        : submit.status === 429
        ? "Gemini is rate limiting. Try again shortly."
        : undefined
    );
  }

  const op = (await submit.json()) as Operation;
  if (!op.name) throw new VeoError("Veo returned no operation to poll.");

  // Videos take minutes. Back off from one second toward ten, as the docs
  // recommend, rather than polling flat out.
  const deadline = Date.now() + (req.timeoutMs ?? 360_000);
  let waitMs = 3_000;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, waitMs));
    waitMs = Math.min(Math.round(waitMs * 1.35), 10_000);

    const res = await call(`${BASE}/${op.name}`, { method: "GET" }, 30_000);
    if (!res.ok) continue;

    const status = (await res.json()) as Operation;
    if (!status.done) continue;

    if (status.error?.message) throw new VeoError(`Veo failed: ${status.error.message}`);

    const uri = status.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
    if (!uri) throw new VeoError("Veo finished but returned no video.");

    // The download URI is itself authenticated, so it cannot simply be handed
    // to the browser.
    const file = await call(uri, { method: "GET" }, 120_000);
    if (!file.ok) throw new VeoError(`Could not download the finished video (${file.status}).`);
    const bytes = Buffer.from(await file.arrayBuffer());
    return `data:video/mp4;base64,${bytes.toString("base64")}`;
  }

  throw new VeoError("Veo did not finish in time.");
}
