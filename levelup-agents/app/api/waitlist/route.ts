import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * Waitlist signups. Saved to the Supabase `waitlist` table (insert-only for the public key),
 * or kept in memory when Supabase isn't configured yet.
 */
const memory = new Set<string>();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let email = "";
  try { ({ email } = await req.json()); } catch { return NextResponse.json({ error: "Send JSON with an email field." }, { status: 400 }); }
  email = String(email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 200) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await sb.from("waitlist").insert({ email });
    // 23505 = already on the list. Treat as success so emails can't be probed.
    if (error && error.code !== "23505") { console.error("Waitlist insert failed", error.message); return NextResponse.json({ error: "Couldn't save that. Please try again." }, { status: 500 }); }
  } else {
    memory.add(email);
  }
  return NextResponse.json({ ok: true });
}
