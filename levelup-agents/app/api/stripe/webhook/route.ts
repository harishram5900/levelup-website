import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { admin, stripe } from "@/lib/server/billing";

/**
 * Stripe tells us when someone pays, renews or cancels. This is the ONLY place a user becomes Pro.
 * Every request is verified with STRIPE_WEBHOOK_SECRET, so it can't be faked.
 */
const ACTIVE: Stripe.Subscription.Status[] = ["active", "trialing", "past_due"];
// While a payment is still being confirmed (e.g. card verification) we change nothing.
const PENDING: Stripe.Subscription.Status[] = ["incomplete"];

export async function POST(req: Request) {
  const s = stripe(), db = admin(), secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !db || !secret) return NextResponse.json({ error: "Not configured" }, { status: 501 });

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  try { event = s.webhooks.constructEvent(body, sig ?? "", secret); }
  catch { return NextResponse.json({ error: "Bad signature" }, { status: 400 }); }

  const setPlan = async (where: { id?: string; customer?: string }, plan: "pro" | "free", subId?: string | null) => {
    const patch: Record<string, unknown> = { plan };
    if (plan === "pro") patch.pro_source = "stripe";
    if (subId !== undefined) patch.stripe_subscription_id = subId;
    let q = db.from("profiles").update(patch);
    // Cancelling a subscription never removes Pro that came from a promo code.
    if (plan === "free") q = q.or("pro_source.is.null,pro_source.eq.stripe");
    const { error } = where.id ? await q.eq("id", where.id) : await q.eq("stripe_customer_id", where.customer!);
    if (error) throw new Error(error.message);
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const cs = event.data.object;
        if (cs.mode === "subscription" && cs.client_reference_id) {
          await db.from("profiles").update({ stripe_customer_id: cs.customer as string }).eq("id", cs.client_reference_id);
          await setPlan({ id: cs.client_reference_id }, "pro", cs.subscription as string);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        if (event.type !== "customer.subscription.deleted" && PENDING.includes(sub.status)) break;
        const on = event.type !== "customer.subscription.deleted" && ACTIVE.includes(sub.status);
        const uid = sub.metadata?.user_id;
        await setPlan(uid ? { id: uid } : { customer: sub.customer as string }, on ? "pro" : "free", on ? sub.id : null);
        break;
      }
    }
  } catch (e) {
    console.error("Stripe webhook failed", (e as Error).message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 }); // Stripe will retry
  }
  return NextResponse.json({ received: true });
}
