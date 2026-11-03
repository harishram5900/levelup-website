import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * Permanently deletes the signed-in user's account (and, via ON DELETE CASCADE, their profile and workspace).
 * Needs SUPABASE_SERVICE_ROLE_KEY on the server. That key is never sent to the browser.
 * The caller must prove who they are with their own access token.
 */
export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return NextResponse.json({ error: "Account deletion isn't set up yet. Email us and we'll delete it for you." }, { status: 501 });
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token || token.length > 4000) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const del = await admin.auth.admin.deleteUser(data.user.id);
  if (del.error) { console.error("Account delete failed", del.error.message); return NextResponse.json({ error: "Couldn't delete the account. Please try again." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
