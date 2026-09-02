import { fail, json, requireUser } from "@/lib/api";
import { mutateForUser, readForUser, uid } from "@/lib/db";
import { buildStoryboard } from "@/lib/ai/storyboard";

/**
 * Never cached. Every response here is specific to the signed-in account.
 */
export const dynamic = "force-dynamic";

/**
 * Writes the shot list for a video, before any video is generated.
 *
 * This exists as its own step because a video costs twenty credits and a
 * storyboard costs one. Deciding the beats first — and letting the customer
 * read them, change the angle and try again — is what stops people spending
 * twenty credits to discover the model misunderstood them.
 */
const COST = 1;

interface Body {
  productName?: string;
  angle?: string;
  projectId?: string;
  seconds?: number;
}

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = (await req.json().catch(() => ({}))) as Body;
  const angle = String(body.angle || "").trim();
  if (angle.length < 6) return fail("Say a little more about what the video should do.");
  if (angle.length > 600) return fail("That description is too long.");

  const db = await readForUser(auth.user.id);
  const user = db.users.find((u) => u.id === auth.user.id)!;
  if (user.credits < COST) {
    return fail(`Not enough credits. A storyboard costs ${COST}, you have ${user.credits}.`, 402);
  }

  const project = body.projectId
    ? db.projects.find((p) => p.id === body.projectId && p.userId === auth.user.id)
    : undefined;

  const seconds = [4, 6, 8].includes(Number(body.seconds)) ? (Number(body.seconds) as 4 | 6 | 8) : 8;

  const board = await buildStoryboard({
    productName: String(body.productName || "").trim() || project?.products?.[0]?.name || "the product",
    brandName: project?.name || "the brand",
    angle,
    voice: project?.voice,
    audience: project?.audience,
    seconds,
  });

  await mutateForUser(auth.user.id, (d) => {
    const u = d.users.find((x) => x.id === auth.user.id)!;
    u.credits -= COST;
    d.transactions.push({
      id: uid("txn"),
      userId: auth.user.id,
      kind: "credits",
      label: "Storyboard written",
      amount: 0,
      credits: -COST,
      createdAt: new Date().toISOString(),
    });
  });

  const fresh = await readForUser(auth.user.id);
  return json({
    storyboard: board,
    credits: fresh.users.find((u) => u.id === auth.user.id)!.credits,
  });
}
