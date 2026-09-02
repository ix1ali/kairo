/**
 * Higgsfield image generation.
 *
 * The previous attempt in this file's place was written from memory and got
 * every detail wrong: it posted to platform.higgsfield.ai, sent a single
 * bearer key, and read the image straight out of the response. The real API
 * lives at api.higgsfield.ai, authenticates with a key *pair*, and is
 * asynchronous — you submit, then poll a status URL until it reaches a
 * terminal state.
 *
 * Docs: https://docs.higgsfield.ai/docs/quickstart
 */

const BASE = process.env.HIGGSFIELD_BASE_URL || "https://api.higgsfield.ai";
const MODEL_PATH = process.env.HIGGSFIELD_MODEL_PATH || "/higgsfield-ai/soul/v2/standard";

export class HiggsfieldError extends Error {
  constructor(message: string, readonly status?: number, readonly actionable?: string) {
    super(message);
    this.name = "HiggsfieldError";
  }
}

export function higgsfieldConfigured(): boolean {
  return !!(process.env.HIGGSFIELD_API_KEY_ID && process.env.HIGGSFIELD_API_KEY_SECRET);
}

function authHeader(): string {
  const id = process.env.HIGGSFIELD_API_KEY_ID;
  const secret = process.env.HIGGSFIELD_API_KEY_SECRET;
  if (!id || !secret) {
    throw new HiggsfieldError(
      "Higgsfield is not configured.",
      401,
      "Set HIGGSFIELD_API_KEY_ID and HIGGSFIELD_API_KEY_SECRET."
    );
  }
  // Their scheme is `Key <id>:<secret>`, not a bearer token.
  return `Key ${id}:${secret}`;
}

async function call(url: string, init: RequestInit = {}, timeoutMs = 60_000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

interface SubmitResponse {
  request_id?: string;
  id?: string;
  status_url?: string;
}

interface StatusResponse {
  status?: string;
  images?: { url?: string }[];
  results?: { url?: string }[];
  error?: string;
  detail?: string;
}

/** Terminal states other than success, per the quickstart. */
const FAILED = new Set(["failed", "nsfw", "canceled", "cancelled"]);

export interface HiggsfieldImageRequest {
  prompt: string;
  /** Extra fields the chosen model accepts, passed through untouched. */
  params?: Record<string, unknown>;
  /** Total time to wait for the render before giving up. */
  timeoutMs?: number;
}

/**
 * Submits a prompt and waits for the finished image.
 *
 * Returns the CDN URL Higgsfield hosts rather than the bytes: the caller
 * decides whether to re-host it, and for the calendar we do, so a customer's
 * post does not break when a third-party CDN expires the object.
 */
export async function higgsfieldImage(req: HiggsfieldImageRequest): Promise<string> {
  const submit = await call(`${BASE}${MODEL_PATH}`, {
    method: "POST",
    body: JSON.stringify({ prompt: req.prompt, ...(req.params || {}) }),
  });

  if (!submit.ok) {
    const body = await submit.text().catch(() => "");
    throw new HiggsfieldError(
      `Higgsfield rejected the request (${submit.status}). ${body.slice(0, 200)}`,
      submit.status,
      submit.status === 401 || submit.status === 403
        ? "Check HIGGSFIELD_API_KEY_ID and HIGGSFIELD_API_KEY_SECRET."
        : submit.status === 402
        ? "The Higgsfield account is out of credits."
        : undefined
    );
  }

  const queued = (await submit.json()) as SubmitResponse;
  const id = queued.request_id || queued.id;
  const statusUrl = queued.status_url || (id ? `${BASE}/requests/${id}/status` : null);
  if (!statusUrl) throw new HiggsfieldError("Higgsfield returned no request to poll.");

  // Poll with a gentle backoff. Renders take tens of seconds, so hammering the
  // status endpoint every 500ms buys nothing and risks a rate limit.
  const deadline = Date.now() + (req.timeoutMs ?? 240_000);
  let waitMs = 2_000;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, waitMs));
    waitMs = Math.min(Math.round(waitMs * 1.4), 10_000);

    const res = await call(statusUrl, { method: "GET" }, 30_000);
    if (!res.ok) continue; // a transient status blip should not kill the job

    const body = (await res.json()) as StatusResponse;
    const status = (body.status || "").toLowerCase();

    if (status === "completed" || status === "succeeded" || status === "success") {
      const url = body.images?.[0]?.url || body.results?.[0]?.url;
      if (!url) throw new HiggsfieldError("Higgsfield finished but returned no image.");
      return url;
    }

    if (FAILED.has(status)) {
      throw new HiggsfieldError(
        `Higgsfield could not produce this image (${status}).`,
        undefined,
        status === "nsfw" ? "The prompt was rejected by the safety filter." : undefined
      );
    }
  }

  throw new HiggsfieldError("Higgsfield did not finish in time.");
}
