"use client";
import { useEffect, useSyncExternalStore } from "react";
import type { AgentId } from "../agents";
import { supabase, useAuth } from "../supabase";

/**
 * Free vs Pro.
 * The plan lives in Supabase (profiles.plan). Users can't change it themselves: the schema only lets
 * them update their display name. Until payments are added, set a user to Pro by editing their row
 * in Supabase → Table Editor → profiles → plan = "pro".
 */
export type Plan = "free" | "pro";

export const PRO_AGENTS: AgentId[] = ["offer", "sales", "investor"];
export const isProAgent = (id: string) => (PRO_AGENTS as string[]).includes(id);

export const PRO_FEATURES = [
  { title: "Pitch deck designer", line: "4 layouts, custom colors and fonts, your logo and photos, present mode and PDF download" },
  { title: "Offer agent", line: "Alex Hormozi's Value Equation turned into an offer people feel silly saying no to" },
  { title: "Sales agent", line: "Outreach scripts, objection handling and a weekly sales plan" },
  { title: "Investor agent", line: "Fundraising readiness, investor email and SAFE basics" },
  { title: "Investor & VC list", line: "Youth-friendly funds and investors in Opportunities" },
];

type State = { plan: Plan; ready: boolean; uid: string | null };
let state: State = { plan: "free", ready: false, uid: null };
const subs = new Set<() => void>();
const set = (s: State) => { state = s; subs.forEach((f) => f()); };
const SERVER: State = { plan: "free", ready: false, uid: null };

/** The signed-in user's plan. Guests are always on the free plan. */
export function usePlan() {
  const { user, ready } = useAuth();
  const s = useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => state, () => SERVER);
  useEffect(() => {
    if (!ready) return;
    const uid = user?.id ?? null;
    // Local development only: localStorage "lu-dev-pro" = "1" previews Pro. Removed from production builds.
    if (process.env.NODE_ENV !== "production") { try { if (localStorage.getItem("lu-dev-pro") === "1") { set({ plan: "pro", ready: true, uid }); return; } } catch { /* ignore */ } }
    if (!uid) { set({ plan: "free", ready: true, uid: null }); return; }
    if (state.uid === uid && state.ready) return;
    const sb = supabase();
    if (!sb) { set({ plan: "free", ready: true, uid }); return; }
    sb.from("profiles").select("plan").eq("id", uid).maybeSingle().then(({ data }) => {
      set({ plan: data?.plan === "pro" ? "pro" : "free", ready: true, uid });
    });
  }, [ready, user?.id]);
  return { pro: s.plan === "pro", ready: s.ready && ready, signedIn: !!user };
}

/** Re-read the plan from the database (e.g. right after paying). Returns true if the user is now Pro. */
export async function refreshPlan(): Promise<boolean> {
  const sb = supabase();
  if (!sb) return false;
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return false;
  const { data } = await sb.from("profiles").select("plan").eq("id", u.user.id).maybeSingle();
  const plan: Plan = data?.plan === "pro" ? "pro" : "free";
  set({ plan, ready: true, uid: u.user.id });
  return plan === "pro";
}

/** True when Stripe is set up (Vercel env NEXT_PUBLIC_PAYMENTS=on). */
export const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS === "on";
