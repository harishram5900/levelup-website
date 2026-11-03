import { NextResponse } from "next/server";
import { admin, siteUrl, stripe, userFrom } from "@/lib/server/billing";

/** Opens Stripe's billing portal so Pro users can update their card or cancel. */
export async function POST(req: Request) {
  const s = stripe(), db = admin();
  if (!s || !db) return NextResponse.json({ error: "Payments aren't set up yet." }, { status: 501 });
  const user = await userFrom(req);
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  const { data } = await db.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
  if (!data?.stripe_customer_id) return NextResponse.json({ error: "No billing account yet." }, { status: 404 });
  const session = await s.billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: `${siteUrl(req)}/app/settings` });
  return NextResponse.json({ url: session.url });
}
