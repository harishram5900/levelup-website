import { NextResponse } from "next/server";
import { admin, siteUrl, stripe, userFrom } from "@/lib/server/billing";

/** Starts a Stripe Checkout for LevelUp Pro (monthly subscription). */
export async function POST(req: Request) {
  const s = stripe(), db = admin(), price = process.env.STRIPE_PRICE_ID_PRO;
  if (!s || !db || !price) return NextResponse.json({ error: "Payments aren't set up yet." }, { status: 501 });
  const user = await userFrom(req);
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  const { data: profile } = await db.from("profiles").select("plan, stripe_customer_id").eq("id", user.id).maybeSingle();
  if (profile?.plan === "pro") return NextResponse.json({ error: "You're already Pro." }, { status: 409 });

  // Reuse one Stripe customer per user.
  let customer = profile?.stripe_customer_id as string | undefined;
  if (!customer) {
    const c = await s.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
    customer = c.id;
    await db.from("profiles").update({ stripe_customer_id: customer }).eq("id", user.id);
  }

  const base = siteUrl(req);
  const session = await s.checkout.sessions.create({
    mode: "subscription",
    customer,
    client_reference_id: user.id,
    line_items: [{ price, quantity: 1 }],
    subscription_data: { metadata: { user_id: user.id } },
    allow_promotion_codes: true,
    success_url: `${base}/app/upgrade?success=1`,
    cancel_url: `${base}/app/upgrade?canceled=1`,
  });
  return NextResponse.json({ url: session.url });
}
