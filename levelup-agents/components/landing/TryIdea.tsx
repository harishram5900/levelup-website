"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ease } from "@/lib/motion";
import type { AgentResult } from "@/lib/cofounder/profile";
import { runAgent } from "@/lib/cofounder/runAgent";

/** Free, no-sign-up taste of the Idea agent on the landing page. */
export function TryIdea() {
  const [f, setF] = useState({ startup: "", idea: "", customer: "", problem: "", today: "", whyYou: "" });
  const [res, setRes] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const input = "w-full rounded-xl hairline bg-bg-2/60 px-4 py-3 text-[15px] outline-none transition-colors focus:border-violet/60";
  const ok = f.startup.trim() && f.idea.trim() && f.customer.trim();

  const go = async (e: React.FormEvent) => {
    e.preventDefault(); if (!ok) return;
    setLoading(true);
    setRes(await runAgent("idea", { founder: "", startup: f.startup, idea: f.idea, customer: f.customer, stage: "idea" }, { problem: f.problem, today: f.today, whyYou: f.whyYou }));
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
      <form onSubmit={go} className="glass space-y-4 rounded-[24px] p-6">
        <div><label htmlFor="t-s" className="mb-2 block text-sm font-semibold">Startup name *</label><input id="t-s" className={input} value={f.startup} onChange={(e) => setF({ ...f, startup: e.target.value })} placeholder="e.g. StudyBuddy" maxLength={60} /></div>
        <div><label htmlFor="t-i" className="mb-2 block text-sm font-semibold">What does it do? *</label><input id="t-i" className={input} value={f.idea} onChange={(e) => setF({ ...f, idea: e.target.value })} placeholder="e.g. matches students with study partners" maxLength={200} /></div>
        <div><label htmlFor="t-c" className="mb-2 block text-sm font-semibold">Who is it for? *</label><input id="t-c" className={input} value={f.customer} onChange={(e) => setF({ ...f, customer: e.target.value })} placeholder="e.g. high schoolers studying for finals" maxLength={120} /></div>
        <div><label htmlFor="t-p" className="mb-2 block text-sm font-semibold">What problem does it solve?</label><input id="t-p" className={input} value={f.problem} onChange={(e) => setF({ ...f, problem: e.target.value })} placeholder="e.g. studying alone is boring, so people quit" maxLength={300} /></div>
        <div><label htmlFor="t-w" className="mb-2 block text-sm font-semibold">Why are you the right person?</label><input id="t-w" className={input} value={f.whyYou} onChange={(e) => setF({ ...f, whyYou: e.target.value })} placeholder="e.g. I run my school's study club" maxLength={200} /></div>
        <button type="submit" disabled={!ok || loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3.5 font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50">
          {loading ? <><Loader2 size={18} className="animate-spin" aria-hidden /> Checking…</> : <><Wand2 size={18} aria-hidden /> Check my idea</>}
        </button>
        <p className="text-xs text-muted">Free, no sign-up.</p>
      </form>
      <div className="glass min-h-[420px] rounded-[24px] p-5 sm:p-7" aria-live="polite">
        <AnimatePresence mode="wait">
          {!res ? (
            <motion.div key="e" exit={{ opacity: 0 }} className="grid h-full min-h-[360px] place-items-center text-center">
              <div><Wand2 className="mx-auto mb-4 text-violet" size={32} aria-hidden /><p className="font-display text-4xl uppercase">Your idea check appears here</p><p className="mt-2 text-muted">One-liner · strengths · risks · 3 tests to run this week</p></div>
            </motion.div>
          ) : (
            <motion.div key={res.at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
              <p className="mb-4 flex items-center gap-1.5 text-xs text-muted">{res.source === "ai" ? <><Sparkles size={12} className="text-violet" aria-hidden /> Written by AI for your idea</> : "Guided check built from your answers"}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {res.sections.map((s) => (
                  <section key={s.title} className="rounded-2xl bg-fg/[0.035] p-5">
                    <h3 className="mb-3 font-display text-2xl uppercase text-violet">{s.title}</h3>
                    <ul className="space-y-2 text-[15px]">{s.items.map((it, k) => <li key={k} className="flex gap-2.5"><Check size={16} className="mt-1 shrink-0 text-good" aria-hidden />{it}</li>)}</ul>
                  </section>
                ))}
              </div>
              <Link href="/app" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 font-semibold">Get all 6 agents free <ArrowRight size={16} aria-hidden /></Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
