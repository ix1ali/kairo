import { fail, json, requireUser } from "@/lib/api";
import { readForUser } from "@/lib/db";
import { createProjectWithPlan, localiseProject, projectLimitFor } from "@/lib/projects";
import { read as readDb } from "@/lib/db";

/**
 * Never cached. Every response here is specific to the signed-in account, and
 * a cached one would show a customer another customer's data or their own
 * stale state — a project created a second ago appearing to be missing.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const db = await readForUser(auth.user.id);
  const projects = db.projects.filter((p) => p.userId === auth.user.id);
  return json({ projects });
}

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const user = auth.user;

  if (user.subscriptionStatus !== "active" || !user.packageId) {
    return fail("Choose a package before creating a project.", 402);
  }

  const db = await readForUser(auth.user.id);
  const owned = db.projects.filter((p) => p.userId === user.id).length;
  const limit = projectLimitFor(user);
  if (owned >= limit) {
    return fail(`Your plan includes ${limit} project${limit > 1 ? "s" : ""}. Upgrade to add more.`, 402);
  }

  const body = await req.json().catch(() => ({}));
  if (!String(body.name || "").trim()) return fail("Project name is required.");

  const project = await createProjectWithPlan(user, body);
  const localised = await localiseProject(project.id, auth.user.id);
  const fresh = (await readDb()).projects.find((p) => p.id === project.id) || project;
  return json({ project: fresh, localised }, 201);
}
