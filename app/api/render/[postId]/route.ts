import { requireUser } from "@/lib/api";
import { readForUser } from "@/lib/db";
import { renderPosterSVG } from "@/lib/render/poster";
import { logoDataUri } from "@/lib/render/logo";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { postId } = await params;

  const db = await readForUser(auth.user.id);
  const post = db.posts.find((p) => p.id === postId);
  if (!post) return new Response("Not found", { status: 404 });
  const project = db.projects.find((p) => p.id === post.projectId && p.userId === auth.user.id);
  if (!project) return new Response("Not found", { status: 404 });

  const svg = renderPosterSVG(post, project, logoDataUri(project.logoUrl), post.assetUrl);
  const url = new URL(req.url);
  const download = url.searchParams.get("download") === "1";
  const slug = project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
      ...(download
        ? { "Content-Disposition": `attachment; filename="${slug}-day-${post.day}-${post.slot + 1}.svg"` }
        : {}),
    },
  });
}
