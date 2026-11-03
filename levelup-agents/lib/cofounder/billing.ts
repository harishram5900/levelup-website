"use client";
import { supabase } from "../supabase";

async function call(path: string): Promise<string> {
  const sb = supabase();
  const { data } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  const res = await fetch(path, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${data.session?.access_token ?? ""}` }, body: "{}" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.url) throw new Error(body.error ?? "Something went wrong. Please try again.");
  return body.url as string;
}

/** Sends the user to Stripe Checkout for LevelUp Pro. */
export async function startCheckout() { location.href = await call("/api/stripe/checkout"); }
/** Opens Stripe's billing portal (change card, cancel). */
export async function openBillingPortal() { location.href = await call("/api/stripe/portal"); }
