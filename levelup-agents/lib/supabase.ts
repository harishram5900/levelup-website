"use client";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";

/**
 * Browser Supabase client. Uses the public anon key only: every table is protected by
 * row-level security (see supabase/schema.sql), so a user can only ever read or write their own rows.
 * If the env vars aren't set, accounts are switched off and the app runs in guest mode.
 */
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const authEnabled = !!(URL_ && KEY);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (!authEnabled || typeof window === "undefined") return null;
  client ??= createClient(URL_!, KEY!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" } });
  return client;
}

/* ---------- tiny auth store ---------- */
type AuthState = { user: User | null; ready: boolean };
let auth: AuthState = { user: null, ready: !authEnabled };
const subs = new Set<() => void>();
let started = false;
function start() {
  if (started) return;
  started = true;
  const sb = supabase();
  if (!sb) { auth = { user: null, ready: true }; return; }
  sb.auth.getSession().then(({ data }) => { auth = { user: data.session?.user ?? null, ready: true }; subs.forEach((s) => s()); });
  sb.auth.onAuthStateChange((_e, session) => { auth = { user: session?.user ?? null, ready: true }; subs.forEach((s) => s()); });
}
const SERVER: AuthState = { user: null, ready: false };
export function useAuth() {
  return useSyncExternalStore((cb) => { start(); subs.add(cb); return () => { subs.delete(cb); }; }, () => { start(); return auth; }, () => SERVER);
}

/** Turns Supabase errors into plain words. */
export function friendlyAuthError(msg: string) {
  if (/invalid login/i.test(msg)) return "That email and password don't match. Try again or reset your password.";
  if (/already registered|already been registered/i.test(msg)) return "There's already an account with that email. Try signing in.";
  if (/email not confirmed/i.test(msg)) return "Please confirm your email first. Check your inbox (and spam).";
  if (/rate limit|too many/i.test(msg)) return "Too many attempts. Please wait a few minutes and try again.";
  if (/password/i.test(msg) && /(short|least|weak)/i.test(msg)) return "Please use a stronger password: at least 8 characters with letters and numbers.";
  return "Something went wrong. Please try again.";
}
