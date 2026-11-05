"use client";
import { Check, CreditCard, Crown, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { openBillingPortal, startCheckout } from "@/lib/cofounder/billing";
import { Buddy, characterById } from "@/components/cofounder/Pip";
import { ProBadge } from "@/components/cofounder/ProGate";
import { FounderCall } from "@/components/cofounder/FounderCall";
import { paymentsEnabled, PRO_FEATURES, refreshPlan, usePlan } from "@/lib/cofounder/plan";
import { useWorkspace } from "@/lib/cofounder/profile";
import { useAuth } from "@/lib/supabase";

const FREE = ["Startup HQ, XP, streaks, badges and leaderboards", "6 agents: Idea, Customer, Scout, Build, Brand, Pitch (starter plans)", "Playbooks from top founders", "Competitions, programs, grants and credits", "Friends, teams and weekly goals"];
const ROWS: [string, boolean, boolean][] = [
  ["6 agents: Idea, Customer, Scout, Build, Brand, Pitch", true, true],
  ["Money agent: pricing, break-even math, funding plan", false, true],
  ["Full plans (every point) + Pro deep dive on every agent", false, true],
  ["AI co-founder chat that remembers you", false, true],
  ["1:1 call with the founder", false, true],
  ["Launch Galaxy: Traction, Content and Investor agents", false, true],
  ["Startup HQ, quest map, XP, badges, tutorial", true, true],
  ["Playbooks and recommendations", true, true],
  ["Competitions, grants, programs and free credits", true, true],
  ["Pitch deck designer + PDF + present mode", false, true],
  ["Offer and Sales agents", false, true],
  ["Exclusive Gold and Aurora themes", false, true],
  ["Investor & VC list", false, true],
];

export default function UpgradePage() {
  return <Suspense fallback={null}><Upgrade /></Suspense>;
}

/** Pay with Stripe (when NEXT_PUBLIC_PAYMENTS=on), or join the Pro waitlist. */
function Checkout({ pro, signedIn }: { pro: boolean; signedIn: boolean }) {
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [waiting, setWaiting] = useState(params.get("success") === "1" && !pro);

  // Right after paying, Stripe's webhook flips the plan within a few seconds. Poll until it lands.
  useEffect(() => {
    if (!waiting) return;
    let n = 0;
    const t = setInterval(async () => { n++; if ((await refreshPlan()) || n > 15) { clearInterval(t); setWaiting(false); } }, 2000);
    return () => clearInterval(t);
  }, [waiting]);

  const go = async (fn: () => Promise<void>) => { setBusy(true); setErr(""); try { await fn(); } catch (e) { setErr((e as Error).message); setBusy(false); } };

  if (pro) return (
    <div className="glass flex flex-col gap-3 rounded-[24px] p-5 sm:flex-row sm:items-center">
      <p className="flex-1 font-semibold">{params.get("success") === "1" ? "Payment complete. Welcome to Pro! 🎉" : "You're on LevelUp Pro."}</p>
      <button type="button" onClick={() => go(openBillingPortal)} disabled={busy} className="btn-glass"><CreditCard size={16} aria-hidden /> Manage billing</button>
    </div>
  );
  if (waiting) return <div className="glass flex items-center gap-3 rounded-[24px] p-5"><Loader2 size={18} className="animate-spin" aria-hidden /> Confirming your payment… this takes a few seconds.</div>;
  return (
    <div className="glass flex flex-col gap-3 rounded-[24px] p-5 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="font-semibold">{params.get("canceled") ? "No worries, you weren't charged." : "Upgrade in under a minute"}</p>
        <p className="text-sm text-muted">Secure checkout by Stripe. Cancel anytime in Settings. Under 18? A parent or guardian should pay.</p>
        {err && <p className="mt-1 text-sm text-red-500" role="alert">{err}</p>}
      </div>
      {signedIn
        ? <button type="button" onClick={() => go(startCheckout)} disabled={busy} className="btn-play px-6">{busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Crown size={16} aria-hidden />} Upgrade to Pro · $9/mo</button>
        : <Link href="/signup" className="btn-play px-6">Sign up to upgrade</Link>}
    </div>
  );
}

/** Promo codes are checked on the server; the list of valid codes never reaches the browser. */
function PromoBox({ signedIn }: { signedIn: boolean }) {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const redeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy"); setMsg("");
    const sb = (await import("@/lib/supabase")).supabase();
    const { data } = (await sb?.auth.getSession()) ?? { data: { session: null } };
    const res = await fetch("/api/promo", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${data.session?.access_token ?? ""}` }, body: JSON.stringify({ code }) }).catch(() => null);
    const body = await res?.json().catch(() => ({}));
    if (res?.ok) { setState("ok"); setMsg("Code applied. Welcome to LevelUp Pro! 🎉"); await refreshPlan(); }
    else { setState("err"); setMsg(body?.error ?? (res?.status === 429 ? "Too many tries. Wait a minute and try again." : "That code didn't work.")); }
  };
  return (
    <form id="promo" onSubmit={redeem} className="glass flex flex-col gap-3 rounded-[24px] p-5 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="font-semibold">Have a promo code?</p>
        <p className="text-sm text-muted">{signedIn ? "Enter it to unlock Pro." : "Sign in first, then enter your code."}</p>
        {msg && <p className={`mt-1 text-sm ${state === "ok" ? "text-good" : "text-red-500"}`} role={state === "ok" ? "status" : "alert"}>{msg}</p>}
      </div>
      {signedIn ? (
        <div className="flex gap-2">
          <label htmlFor="promo-code" className="sr-only">Promo code</label>
          <input id="promo-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={64} autoComplete="off" spellCheck={false} placeholder="PROMO CODE" className="min-w-0 rounded-xl hairline bg-bg-2/60 px-3 py-2.5 font-mono text-sm uppercase outline-none focus:border-violet/60" />
          <button type="submit" disabled={state === "busy" || code.trim().length < 4} className="btn-soft">{state === "busy" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : "Apply"}</button>
        </div>
      ) : <Link href="/signin" className="btn-glass">Sign in</Link>}
    </form>
  );
}

function Upgrade() {
  const { ws } = useWorkspace();
  const { pro, signedIn } = usePlan();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [state, setState] = useState<"idle" | "busy" | "done" | "err">("idle");
  const buddy = characterById(ws.prefs.character);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/waitlist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: (email || user?.email || "").trim() }) }).catch(() => null);
    setState(res?.ok ? "done" : "err");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="relative overflow-hidden rounded-[32px] p-6 text-white sm:p-10" style={{ background: "radial-gradient(120% 140% at 100% 0%, rgb(var(--amber) / .9) 0%, rgb(var(--violet) / .7) 40%, #0B1030 100%)" }}>
        <div className="relative flex flex-col items-center gap-6 sm:flex-row">
          <Buddy character={ws.prefs.character} mood="cheer" size={120} className="text-white" />
          <div className="text-center sm:text-left">
            <ProBadge />
            <h2 className="mt-2 font-display text-6xl uppercase leading-none">LevelUp Pro</h2>
            <p className="mt-2 max-w-lg text-white/85">{pro ? "You're Pro. Everything is unlocked. Go build something big!" : `Everything you need to pitch, sell and raise. ${buddy.name} will be right there with you.`}</p>
            {!pro && <p className="web-only mt-3"><span className="font-display text-5xl">$9</span><span className="text-white/70"> /month</span> <span className="ml-2 text-sm text-white/60">less than $0.30 a day · cancel anytime</span></p>}
          </div>
        </div>
      </div>

      {/* Inside the iOS/Android app, store rules require in-app purchase, so web checkout and promo codes are web-only. */}
      {!pro && <p className="native-only glass rounded-[24px] p-5 text-sm"><b>Pro in the app is coming soon.</b> <span className="text-muted">Already Pro? Sign in with the same account and everything unlocks here too.</span></p>}
      <div className="web-only space-y-6">
      {paymentsEnabled && <Checkout pro={pro} signedIn={signedIn} />}
      {!pro && <PromoBox signedIn={signedIn} />}
      </div>
      {pro && <FounderCall />}

      {!paymentsEnabled && !pro && (
        <form onSubmit={join} className="web-only glass flex flex-col gap-3 rounded-[24px] p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="font-semibold">Payments open soon</p>
            <p className="text-sm text-muted">Join the Pro waitlist and we'll email you when you can upgrade. Under 18? A parent or guardian will need to pay.</p>
          </div>
          {state === "done" ? <p className="text-sm font-semibold text-good" role="status">You're on the list! 🎉</p> : (
            <div className="flex gap-2">
              {!user && <><label htmlFor="pro-email" className="sr-only">Email</label><input id="pro-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="min-w-0 rounded-xl hairline bg-bg-2/60 px-3 py-2.5 text-sm outline-none focus:border-violet/60" /></>}
              <button type="submit" disabled={state === "busy"} className="btn-play px-5 py-2.5">{state === "busy" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Crown size={16} aria-hidden />} Join Pro waitlist</button>
            </div>
          )}
          {state === "err" && <p className="text-sm text-red-500" role="alert">Couldn't save that. Try again.</p>}
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="glass rounded-[24px] p-6">
          <p className="font-display text-3xl uppercase">Free</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">{FREE.map((f) => <li key={f} className="flex gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-good" aria-hidden />{f}</li>)}</ul>
        </section>
        <section className="glass rounded-[24px] p-6 ring-2 ring-amber/50">
          <p className="flex items-center gap-2 font-display text-3xl uppercase">Pro <ProBadge /></p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li className="flex gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-good" aria-hidden />Everything in Free, plus:</li>
            {PRO_FEATURES.map((f) => <li key={f.title} className="flex gap-2.5"><Crown size={17} className="mt-0.5 shrink-0 text-amber" aria-hidden /><span><b>{f.title}</b>: <span className="text-muted">{f.line}</span></span></li>)}
          </ul>
        </section>
      </div>

      <section className="glass overflow-x-auto rounded-[24px] p-2 sm:p-4">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-muted"><th className="p-3 font-semibold">Feature</th><th className="p-3 text-center font-semibold">Free</th><th className="p-3 text-center font-semibold">Pro</th></tr></thead>
          <tbody>{ROWS.map(([f, a, b]) => (
            <tr key={f} className="border-t border-fg/[0.06]"><td className="p-3">{f}</td>
              <td className="p-3 text-center">{a ? <Check size={17} className="mx-auto text-good" aria-label="Included" /> : <X size={17} className="mx-auto text-muted" aria-label="Not included" />}</td>
              <td className="p-3 text-center"><Check size={17} className="mx-auto text-good" aria-label="Included" /></td></tr>
          ))}</tbody>
        </table>
      </section>
    </div>
  );
}
