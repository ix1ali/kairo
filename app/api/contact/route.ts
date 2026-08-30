import { fail, json, requireUser } from "@/lib/api";
import { mutate, uid } from "@/lib/db";

const TOPICS = ["content", "billing", "bug", "feature", "other"];

/**
 * Stores a support message against the account.
 *
 * There is no outbound mail yet, so this deliberately persists rather than
 * pretending to send: the message is queued on the record and the sender is
 * told it will be answered by email. Wiring a transactional provider later
 * only changes what happens after the write.
 */
export async function POST(req: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => ({}));
  const topic = TOPICS.includes(body.topic) ? body.topic : "other";
  const message = String(body.message || "").trim();

  if (message.length < 10) return fail("Tell us a little more so we can actually help.");
  if (message.length > 4000) return fail("That is too long — keep it under 4000 characters.");

  const entry = {
    id: uid(),
    userId: auth.user.id,
    topic,
    message,
    at: new Date().toISOString(),
    status: "open" as const,
  };

  mutate((d) => {
    d.supportMessages = [...(d.supportMessages || []), entry];
  });

  return json({ ok: true, id: entry.id }, 201);
}
