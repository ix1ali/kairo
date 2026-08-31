import { fail, json, requireUser } from "@/lib/api";
import { mutateForUser, readForUser, uid } from "@/lib/db";
import { generateImage, generateVideo } from "@/lib/ai";
import { putPublicFile, StorageUnavailableError } from "@/lib/storage";

/**
 * One-off generation, outside the monthly calendar.
 *
 * Credits are charged only after something has actually been produced. The
 * earlier regenerate route debits first, which is fine there because a failed
 * provider still leaves a rendered post behind; here a failure leaves nothing,
 * so charging up front would be taking money for air.
 */

const COST = { image: 4, video: 20 } as const;

/** A reference is described, not uploaded: the palette is sampled in the browser. */
interface Body {
  kind?: "image" | "video";
  prompt?: string;
  projectId?: string;
  aspect?: "1:1" | "4:5" | "9:16";
  referenceNote?: string;
  palette?: unknown;
}

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = (await req.json().catch(() => ({}))) as Body;
  const kind = body.kind === "video" ? "video" : "image";
  const prompt = String(body.prompt || "").trim();

  if (prompt.length < 8) return fail("Describe what you want in a little more detail.");
  if (prompt.length > 1200) return fail("That description is too long.");

  const db = await readForUser(auth.user.id);
  const user = db.users.find((u) => u.id === auth.user.id)!;
  const cost = COST[kind];
  if (user.credits < cost) {
    return fail(`Not enough credits. This costs ${cost}, you have ${user.credits}.`, 402);
  }

  // A project is optional, but when given its palette and voice steer the brief.
  const project = body.projectId
    ? db.projects.find((p) => p.id === body.projectId && p.userId === auth.user.id)
    : undefined;

  const palette = Array.isArray(body.palette)
    ? (body.palette as unknown[])
        .filter((c): c is string => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c))
        .slice(0, 5)
    : [];

  const brief = [
    prompt,
    project ? `Brand: ${project.name}. Voice: ${project.voice}.` : "",
    palette.length ? `Match this colour palette exactly: ${palette.join(", ")}.` : "",
    body.referenceNote ? `Match the style of the reference: ${body.referenceNote}.` : "",
    kind === "image"
      ? "Editorial product photography. No watermark, no stock-photo look."
      : "Short-form vertical video, six to ten seconds, no watermark.",
  ]
    .filter(Boolean)
    .join(" ");

  let url: string | null = null;
  try {
    if (kind === "image") {
      const aspect = body.aspect === "1:1" || body.aspect === "9:16" ? body.aspect : "4:5";
      const data = await generateImage({ prompt: brief, aspect, userId: auth.user.id });
      if (data?.startsWith("data:")) {
        const [, meta, b64] = data.match(/^data:([^;]+);base64,(.*)$/) || [];
        if (b64) {
          const ext = meta?.includes("jpeg") ? "jpg" : meta?.includes("webp") ? "webp" : "png";
          url = await putPublicFile(`gen_${uid()}.${ext}`, Buffer.from(b64, "base64"));
        }
      } else if (data) {
        url = data;
      }
    } else {
      const data = await generateVideo(brief, auth.user.id);
      if (data?.startsWith("data:")) {
        const [, , b64] = data.match(/^data:([^;]+);base64,(.*)$/) || [];
        if (b64) url = await putPublicFile(`gen_${uid()}.mp4`, Buffer.from(b64, "base64"));
      } else if (data) {
        url = data;
      }
    }
  } catch (err) {
    if (err instanceof StorageUnavailableError) return fail(err.message, 503);
    throw err;
  }

  if (!url) {
    return fail(
      "Generation is not available yet. No credits were charged.",
      503
    );
  }

  await mutateForUser(auth.user.id, (d) => {
    const u = d.users.find((x) => x.id === auth.user.id)!;
    u.credits -= cost;
    d.transactions.push({
      id: uid("txn"),
      userId: auth.user.id,
      kind: "credits",
      label: `${kind === "image" ? "Image" : "Video"} generated`,
      amount: 0,
      credits: -cost,
      createdAt: new Date().toISOString(),
    });
  });

  const fresh = await readForUser(auth.user.id);
  return json({
    url,
    kind,
    credits: fresh.users.find((u) => u.id === auth.user.id)!.credits,
  });
}
