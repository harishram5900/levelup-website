import { NextResponse } from "next/server";

/**
 * Health check for uptime monitors (UptimeRobot, Better Stack, etc.): GET /health.
 * 200 when the app is up and the database answers; 503 otherwise. Reveals no secrets.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "down" | "not_configured"> = { app: "ok" };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 4000);
      const r = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key }, signal: ctrl.signal, cache: "no-store" });
      clearTimeout(t);
      checks.database = r.ok ? "ok" : "down";
    } catch { checks.database = "down"; }
  } else checks.database = "not_configured";
  checks.ai = process.env.ANTHROPIC_API_KEY ? "ok" : "not_configured";
  const up = checks.database !== "down";
  return NextResponse.json({ status: up ? "ok" : "degraded", checks, at: new Date().toISOString() }, { status: up ? 200 : 503, headers: { "cache-control": "no-store" } });
}
