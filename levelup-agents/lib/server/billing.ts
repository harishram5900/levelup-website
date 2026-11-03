import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

/**
 * Server-only helpers for payments. Uses secret keys that never reach the browser:
 * STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID_PRO, SUPABASE_SERVICE_ROLE_KEY.
 */
export function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

export function admin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

/** Who is calling? Checks the user's Supabase access token. */
export async function userFrom(req: Request) {
  const db = admin();
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!db || !token || token.length > 4000) return null;
  const { data } = await db.auth.getUser(token);
  return data.user ?? null;
}

export function siteUrl(req: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
}
