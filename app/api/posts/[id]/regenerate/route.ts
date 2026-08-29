import fs from "fs";
import path from "path";
import { fail, json, requireUser } from "@/lib/api";
import { mutate, read, uid } from "@/lib/db";
import { CREDIT_COSTS, getPackage } from "@/lib/plans";
import { regenerateSinglePost } from "@/lib/strategy/engine";
import { generateImage } from "@/lib/ai";

type Action = keyof typeof CREDIT_COSTS;

const MODE_FOR: Record<Action, "caption" | "angle" | "visual" | "full"> = {
  rewriteCaption: "caption",
  newAngle: "angle",
  redesignVisual: "visual",
  regenerateDay: "full",
  regenerateVideo: "full",
  regenerateWeek: "full",
};

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const action = String(body.action || "redesignVisual") as Action;
  if (!(action in CREDIT_COSTS)) return fail("Unknown action.");
  const cost = CREDIT_COSTS[action];

  const db = read();
  const post = db.posts.find((p) => p.id === id);
  if (!post) return fail("Post not found.", 404);
  const project = db.projects.find((p) => p.id === post.projectId && p.userId === auth.user.id);
  if (!project) return fail("Post not found.", 404);
  if (!project.strategy) return fail("This project has no strategy yet.", 400);

  const user = db.users.find((u) => u.id === auth.user.id)!;
  if (user.credits < cost) {
    return fail(`Not enough credits. This costs ${cost}, you have ${user.credits}.`, 402);
  }

  const prompt = String(body.prompt || "");
  const patch = regenerateSinglePost(
    project,
    project.strategy,
    getPackage(user.packageId),
    post,
    prompt,
    MODE_FOR[action]
  );

  // If an image provider is configured, render real artwork; otherwise the
  // built-in SVG engine keeps serving the visual.
  let assetUrl: string | null = post.assetUrl;
  if (action === "redesignVisual" || action === "regenerateDay") {
    const vertical = post.format === "reel" || post.format === "video" || post.format === "story";
    const image = await generateImage({
      prompt: String(patch.visualPrompt || post.visualPrompt),
      aspect: vertical ? "9:16" : "4:5",
    });
    if (image && image.startsWith("data:")) {
      const [, meta, b64] = image.match(/^data:([^;]+);base64,(.*)$/) || [];
      if (b64) {
        const ext = meta?.includes("jpeg") ? "jpg" : "png";
        const file = `gen_${uid()}.${ext}`;
        const dir = path.join(process.cwd(), "public", "uploads");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, file), Buffer.from(b64, "base64"));
        assetUrl = `/uploads/${file}`;
      }
    } else if (image) {
      assetUrl = image;
    }
  }

  mutate((d) => {
    const target = d.posts.find((p) => p.id === id)!;
    Object.assign(target, patch);
    target.assetUrl = assetUrl;
    target.revisions = [
      ...target.revisions,
      { at: new Date().toISOString(), prompt: prompt || `(${action})`, creditsSpent: cost },
    ];
    const u = d.users.find((x) => x.id === auth.user.id)!;
    u.credits -= cost;
  });

  const fresh = read();
  return json({
    post: fresh.posts.find((p) => p.id === id),
    credits: fresh.users.find((u) => u.id === auth.user.id)!.credits,
  });
}
