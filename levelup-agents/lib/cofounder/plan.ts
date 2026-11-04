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

// Free: Idea, Customer, Scout, Build, Brand, Pitch. Pro: everything that makes money, sells, launches and raises.
export const PRO_AGENTS: AgentId[] = ["money", "offer", "sales", "launch", "content", "investor"];
export const isProAgent = (id: string) => (PRO_AGENTS as string[]).includes(id);

export const PRO_FEATURES = [
  { title: "AI co-founder chat with memory", line: "Ask anything, anytime. It remembers your startup, every plan, your goals and past chats" },
  { title: "1:1 call with the founder", line: "Request a call with Harish, LevelUp's founder, to talk through your startup" },
  { title: "Full plans + Pro deep dives", line: "Every point in every plan, plus advanced sections on all agents: kill criteria, scripts, scorecards, roadmaps" },
  { title: "Launch Galaxy", line: "Launch, Content and Investor agents: go-to-market, audience building and fundraising" },
  { title: "Money, Offer & Sales agents", line: "Pricing and break-even math, Hormozi's Value Equation offer builder, outreach scripts and objection handling" },
  { title: "Exclusive Pro looks", line: "Gold and Aurora dashboard themes and a Pro crown" },
  { title: "Pitch deck designer", line: "4 layouts, custom colors and fonts, your logo and photos, present mode and PDF" },
  { title: "Investor & VC list", line: "Youth-friendly funds and investors in Opportunities" },
];

/** Free plans show this many points per section; Pro shows everything. */
export const FREE_ITEMS = 3;

type State = { plan: Plan; ready: boolean; uid: string | null; bonus?: number };
let state: State = { plan: "free", ready: false, uid: null };

/** Reads plan + invite bonus XP. Falls back to plan only if the social upgrade (002) hasn't been run yet. */
async function readProfile(uid: string): Promise<{ plan: Plan; bonus: number }> {
  const sb = supabase();
  if (!sb) return { plan: "free", bonus: 0 };
  let { data, error } = await sb.from("profiles").select("plan, bonus_xp").eq("id", uid).maybeSingle();
  if (error) ({ data } = await sb.from("profiles").select("plan").eq("id", uid).maybeSingle());
  const row = (data ?? {}) as { plan?: string; bonus_xp?: number };
  return { plan: row.plan === "pro" ? "pro" : "free", bonus: Number(row.bonus_xp ?? 0) || 0 };
}
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
    readProfile(uid).then((r) => set({ plan: r.plan, bonus: r.bonus, ready: true, uid }));
  }, [ready, user?.id]);
  return { pro: s.plan === "pro", ready: s.ready && ready, signedIn: !!user, bonusXp: s.bonus ?? 0 };
}

/** Re-read the plan from the database (e.g. right after paying). Returns true if the user is now Pro. */
export async function refreshPlan(): Promise<boolean> {
  const sb = supabase();
  if (!sb) return false;
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return false;
  const r = await readProfile(u.user.id);
  set({ plan: r.plan, bonus: r.bonus, ready: true, uid: u.user.id });
  return r.plan === "pro";
}

/** True when Stripe is set up (Vercel env NEXT_PUBLIC_PAYMENTS=on). */
export const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS === "on";
