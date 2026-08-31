import { fail, json, requireUser } from "@/lib/api";
import { mutateForUser, readForUser } from "@/lib/db";
import { getProjectFor, projectStats, regeneratePlan } from "@/lib/projects";
import { localeLabel } from "@/lib/languages";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const found = await getProjectFor(auth.user.id, id);
  if (!found) return fail("Project not found.", 404);
  return json({ ...found, stats: projectStats(found.posts) });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const db = await readForUser(auth.user.id);
  const project = db.projects.find((p) => p.id === id && p.userId === auth.user.id);
  if (!project) return fail("Project not found.", 404);

  const editable = [
    "name", "tagline", "category", "description", "website", "logoUrl", "images",
    "brandTheme", "colors", "voice", "audience", "market", "language", "locale", "socials",
    "platforms", "products", "goals", "goal", "contentMix", "videoStyle", "competitorsInput", "competitorProfiles",
  ];

  await mutateForUser(auth.user.id, (d) => {
    const target = d.projects.find((p) => p.id === id)!;
    for (const key of editable) {
      if (key in body) (target as unknown as Record<string, unknown>)[key] = body[key];
    }
    if (typeof body.locale === "string") target.language = localeLabel(body.locale);
    target.updatedAt = new Date().toISOString();
  });

  if (body.regenerate) {
    const fresh = (await readForUser(auth.user.id)).projects.find((p) => p.id === id)!;
    await regeneratePlan(fresh, auth.user);
  }

  const found = (await getProjectFor(auth.user.id, id))!;
  return json({ ...found, stats: projectStats(found.posts) });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const db = await readForUser(auth.user.id);
  const project = db.projects.find((p) => p.id === id && p.userId === auth.user.id);
  if (!project) return fail("Project not found.", 404);

  await mutateForUser(auth.user.id, (d) => {
    d.projects = d.projects.filter((p) => p.id !== id);
    d.posts = d.posts.filter((p) => p.projectId !== id);
  });

  return json({ ok: true });
}
