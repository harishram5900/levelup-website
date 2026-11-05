import { NextResponse } from "next/server";
import { admin } from "@/lib/server/billing";

/**
 * RevenueCat webhook: turns App Store / Google Play subscriptions into profiles.plan.
 * In RevenueCat → Integrations → Webhooks, set the URL to https://www.levelupinnovations.tech/api/revenuecat
 * and the Authorization header to the same value as REVENUECAT_WEBHOOK_SECRET in Vercel.
 * The app identifies users by their Supabase user id, so app_user_id is the profile id.
 */
const ACTIVE = new Set(["INITIAL_PURCHASE", "RENEWAL", "UNCANCELLATION", "PRODUCT_CHANGE", "NON_RENEWING_PURCHASE", "SUBSCRIPTION_EXTENDED", "TEMPORARY_ENTITLEMENT_GRANT"]);
const ENDED = new Set(["EXPIRATION"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 501 });
  const auth = (req.headers.get("authorization") ?? "").trim();
  if (auth !== secret && auth !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { event?: { type?: string; app_user_id?: string; original_app_user_id?: string; aliases?: string[]; entitlement_ids?: string[] | null } };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const e = body.event;
  if (!e?.type) return NextResponse.json({ ok: true });
  if (e.entitlement_ids && !e.entitlement_ids.includes("pro")) return NextResponse.json({ ok: true, ignored: "other entitlement" });

  const id = [e.app_user_id, e.original_app_user_id, ...(e.aliases ?? [])].find((x) => x && UUID.test(x));
  const db = admin();
  if (!id || !db) return NextResponse.json({ ok: true, ignored: id ? "no db" : "anonymous user" });

  if (ACTIVE.has(e.type)) {
    const { error } = await db.from("profiles").update({ plan: "pro", pro_source: "store" }).eq("id", id);
    if (error) { console.error("RevenueCat → pro failed", error.message); return NextResponse.json({ error: "db" }, { status: 500 }); }
  } else if (ENDED.has(e.type)) {
    // Only downgrade if Pro came from the store (never undo a Stripe, promo or manual Pro).
    const { error } = await db.from("profiles").update({ plan: "free" }).eq("id", id).eq("pro_source", "store");
    if (error) { console.error("RevenueCat → free failed", error.message); return NextResponse.json({ error: "db" }, { status: 500 }); }
  }
  return NextResponse.json({ ok: true });
}
