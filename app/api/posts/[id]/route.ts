import { fail, json, requireUser } from "@/lib/api";
import { mutate, read } from "@/lib/db";
import type { PostStatus } from "@/lib/types";

const STATUSES: PostStatus[] = ["draft", "approved", "scheduled", "posted", "skipped"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const db = read();
  const post = db.posts.find((p) => p.id === id);
  if (!post) return fail("Post not found.", 404);
  const project = db.projects.find((p) => p.id === post.projectId && p.userId === auth.user.id);
  if (!project) return fail("Post not found.", 404);

  mutate((d) => {
    const target = d.posts.find((p) => p.id === id)!;
    if (typeof body.caption === "string") target.caption = body.caption;
    if (typeof body.hook === "string") target.hook = body.hook;
    if (typeof body.cta === "string") target.cta = body.cta;
    if (Array.isArray(body.hashtags)) target.hashtags = body.hashtags;
    if (typeof body.layout === "string") target.layout = body.layout;
    if (typeof body.timeOfDay === "string") target.timeOfDay = body.timeOfDay;
    if (typeof body.platform === "string") target.platform = body.platform;

    if (typeof body.status === "string" && STATUSES.includes(body.status as PostStatus)) {
      target.status = body.status as PostStatus;
      target.postedAt = body.status === "posted" ? new Date().toISOString() : null;
    }
    if (body.feedback) {
      target.feedback = {
        rating: Math.max(1, Math.min(5, Number(body.feedback.rating) || 0)),
        note: String(body.feedback.note || ""),
      };
    }
    if (body.metrics) {
      target.metrics = {
        reach: Number(body.metrics.reach) || 0,
        likes: Number(body.metrics.likes) || 0,
        comments: Number(body.metrics.comments) || 0,
        saves: Number(body.metrics.saves) || 0,
      };
    }
  });

  return json({ post: read().posts.find((p) => p.id === id) });
}
