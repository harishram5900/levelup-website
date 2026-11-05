import { NextResponse } from "next/server";
import { log } from "@/lib/server/log";

/** Receives client crash reports (see lib/report.ts) and writes them to the server logs. */
export async function POST(req: Request) {
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const s = (v: unknown, n: number) => String(v ?? "").slice(0, n);
  log("error", "client_error", { message: s(b.message, 500), where: s(b.where, 40), path: s(b.path, 200), native: !!b.native, stack: s(b.stack, 2000), ua: s(req.headers.get("user-agent"), 200) });
  return NextResponse.json({ ok: true });
}
