"use client";
import { Check, Crown, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Buddy, characterById } from "@/components/cofounder/Pip";
import { ProBadge } from "@/components/cofounder/ProGate";
import { PRO_FEATURES, usePlan } from "@/lib/cofounder/plan";
import { useWorkspace } from "@/lib/cofounder/profile";
import { useAuth } from "@/lib/supabase";

const FREE = ["Startup HQ, XP, streaks and badges", "9 co-founder agents", "Playbooks from top founders", "Competitions, programs, grants and credits", "Weekly goals and recommendations"];
const ROWS: [string, boolean, boolean][] = [
  ["9 agents (Idea, Customer, Scout, Build, Brand, Pitch, Money, Launch, Content)", true, true],
  ["Startup HQ, quest map, XP, badges, tutorial", true, true],
  ["Playbooks and recommendations", true, true],
  ["Competitions, grants, programs and free credits", true, true],
  ["Pitch deck designer + PDF + present mode", false, true],
  ["Offer, Sales and Investor agents", false, true],
  ["Investor & VC list", false, true],
];

export default function Upgrade() {
  const { ws } = useWorkspace();
  const { pro } = usePlan();
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
            {!pro && <p className="mt-3"><span className="font-display text-5xl">$9</span><span className="text-white/70"> /month</span> <span className="ml-2 text-sm text-white/60">(launch price, subject to change)</span></p>}
          </div>
        </div>
      </div>

      {!pro && (
        <form onSubmit={join} className="glass flex flex-col gap-3 rounded-[24px] p-5 sm:flex-row sm:items-center">
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
