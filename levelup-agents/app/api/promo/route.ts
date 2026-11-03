import { NextResponse } from "next/server";
import { admin, userFrom } from "@/lib/server/billing";

/**
 * Redeem a promo code for free Pro. Codes and their usage limits live in the locked
 * promo_codes table; redeem_promo() checks and counts them atomically. Rate-limited by the middleware.
 */
const MESSAGES: Record<string, [number, string]> = {
  invalid: [400, "That code isn't valid."],
  used_up: [410, "Sorry, that code has been used up."],
};

export async function POST(req: Request) {
  const db = admin();
  if (!db) return NextResponse.json({ error: "Promo codes aren't available right now." }, { status: 501 });
  const user = await userFrom(req);
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  let code = "";
  try { ({ code } = await req.json()); } catch { /* handled below */ }
  code = String(code ?? "").trim().toUpperCase().slice(0, 64);
  if (code.length < 4) return NextResponse.json({ error: MESSAGES.invalid[1] }, { status: 400 });

  const { data, error } = await db.rpc("redeem_promo", { p_code: code, p_user: user.id });
  if (error) { console.error("Promo redeem failed", error.message); return NextResponse.json({ error: "Promo codes are being updated. Please try again soon." }, { status: 503 }); }
  if (data === "ok" || data === "already") return NextResponse.json({ ok: true, already: data === "already" });
  const [status, msg] = MESSAGES[data as string] ?? MESSAGES.invalid;
  return NextResponse.json({ error: msg }, { status });
}
