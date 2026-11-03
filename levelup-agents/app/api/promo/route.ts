import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { admin, userFrom } from "@/lib/server/billing";

/**
 * Redeem a promo code for free Pro. Valid codes live only in the PRO_PROMO_CODES env var
 * (comma separated), never in the code or the browser. Rate-limited by the middleware.
 */
const norm = (s: string) => s.trim().toUpperCase();
function matches(input: string, code: string) {
  const a = Buffer.from(norm(input)), b = Buffer.from(norm(code));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const db = admin();
  const codes = (process.env.PRO_PROMO_CODES ?? "").split(",").map((c) => c.trim()).filter(Boolean);
  if (!db || !codes.length) return NextResponse.json({ error: "Promo codes aren't available right now." }, { status: 501 });
  const user = await userFrom(req);
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  let code = "";
  try { ({ code } = await req.json()); } catch { /* handled below */ }
  code = String(code ?? "").slice(0, 64);
  const hit = codes.find((c) => matches(code, c));
  if (!hit) return NextResponse.json({ error: "That code isn't valid." }, { status: 400 });

  const { data: profile } = await db.from("profiles").select("plan").eq("id", user.id).maybeSingle();
  if (profile?.plan === "pro") return NextResponse.json({ ok: true, already: true });
  const { error } = await db.from("profiles").update({ plan: "pro", pro_source: "promo", promo_code: norm(hit) }).eq("id", user.id);
  if (error) { console.error("Promo redeem failed", error.message); return NextResponse.json({ error: "Couldn't apply the code. Please try again." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
