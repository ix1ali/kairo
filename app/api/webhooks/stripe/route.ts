import { paymentProvider } from "@/lib/payments";
import { fulfil } from "@/lib/payments/fulfil";

/**
 * Stripe's side of the conversation.
 *
 * Three things this route has to get right:
 *
 * 1. Read the body as raw text. Signature verification hashes the exact bytes
 *    Stripe sent, so parsing the JSON first and re-serialising it breaks every
 *    signature.
 *
 * 2. Answer 2xx for anything genuinely from Stripe, including events we do not
 *    act on. A non-2xx makes Stripe retry, and retrying an event we simply do
 *    not care about achieves nothing but noise.
 *
 * 3. Answer 400 only for a bad signature, which means the request did not come
 *    from Stripe at all.
 */

// Verification needs the unparsed body, so this must not be statically
// optimised or have its body transformed.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const raw = await req.text();
  const provider = paymentProvider();

  const event = await provider.verifyWebhook(req.headers, raw);
  if (!event) {
    return new Response(JSON.stringify({ error: "Invalid signature." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await fulfil(event);
    // Deliberately 200 either way: "already processed" and "not actionable"
    // are both correct outcomes, not failures to retry.
    return Response.json({ received: true, ...result });
  } catch (err) {
    // A genuine failure on our side. 500 asks Stripe to try again, which is
    // what we want — the payment happened and the account still needs it.
    console.error("[koala:stripe] fulfilment failed", err);
    return new Response(JSON.stringify({ error: "Fulfilment failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
