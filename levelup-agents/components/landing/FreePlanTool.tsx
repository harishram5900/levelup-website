"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Loader2, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import type { PlanItem, Tone } from "@/lib/generate";
import { fetchPlan } from "@/lib/planClient";
import { ease } from "@/lib/motion";
import { PLATFORMS, PlatformIcon, type Platform } from "@/components/ui/PlatformIcon";
import { cn } from "@/lib/utils";

const TONES: Tone[] = ["friendly", "bold", "expert", "funny"];

/** The free, works-today tool: a week of post ideas from a few inputs. */
export function FreePlanTool() {
  const [brand, setBrand] = useState("Sunrise Café");
  const [niche, setNiche] = useState("coffee shop");
  const [tone, setTone] = useState<Tone>("friendly");
  const [plats, setPlats] = useState<Platform[]>(["tiktok", "instagram"]);
  const [seed, setSeed] = useState(0);
  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"ai" | "template">("template");

  const run = async (s = seed) => {
    setLoading(true);
    const r = await fetchPlan({ brand, niche, tone, platforms: plats, seed: s });
    setPlan(r.plan); setSource(r.source); setLoading(false);
  };
  const toggle = (p: Platform) => setPlats((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  const copy = async () => {
    if (!plan) return;
    const txt = plan.map((p) => `${p.day} · ${p.format}\nHook: ${p.hook}\n${p.beats.map((b, i) => `${i + 1}. ${b}`).join("\n")}\nCaption: ${p.caption} ${p.tags.join(" ")}`).join("\n\n");
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked: user can select text */ }
  };

  const input = "w-full rounded-xl hairline bg-bg-2/60 px-4 py-3 text-[15px] outline-none transition-colors focus:border-violet/60";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={(e) => { e.preventDefault(); run(); }} className="glass space-y-5 rounded-[24px] p-6">
        <div><label htmlFor="fp-brand" className="mb-2 block text-sm font-semibold">Business name</label><input id="fp-brand" className={input} value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={60} /></div>
        <div><label htmlFor="fp-niche" className="mb-2 block text-sm font-semibold">What you do</label><input id="fp-niche" className={input} value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. hair salon, bakery, fitness coach" maxLength={60} /></div>
        <fieldset><legend className="mb-2 text-sm font-semibold">Tone</legend>
          <div className="grid grid-cols-4 gap-2">{TONES.map((t) => (
            <button type="button" key={t} aria-pressed={tone === t} onClick={() => setTone(t)} className={cn("rounded-xl py-2 text-sm capitalize transition-colors", tone === t ? "bg-accent text-white" : "hairline text-muted hover:text-fg")}>{t}</button>
          ))}</div>
        </fieldset>
        <fieldset><legend className="mb-2 text-sm font-semibold">Platforms</legend>
          <div className="grid grid-cols-2 gap-2">{PLATFORMS.map((p) => (
            <button type="button" key={p.id} aria-pressed={plats.includes(p.id)} onClick={() => toggle(p.id)} className={cn("flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors", plats.includes(p.id) ? "border border-violet/50 bg-violet/10" : "hairline text-muted hover:text-fg")}><PlatformIcon name={p.id} size={16} />{p.name.split(" ")[0]}</button>
          ))}</div>
        </fieldset>
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-70">{loading ? <><Loader2 size={18} className="animate-spin" aria-hidden /> Writing your plan…</> : <><Wand2 size={18} aria-hidden /> Make my week of posts</>}</button>
        <p className="text-xs text-muted">Free, no sign-up. Our Script agent writes a plan for your business in a few seconds.</p>
      </form>

      <div className="glass min-h-[420px] rounded-[24px] p-5 sm:p-6" aria-live="polite">
        {loading && !plan ? (
          <div className="grid h-full min-h-[380px] place-items-center text-center">
            <div><Loader2 className="mx-auto mb-4 animate-spin text-violet" size={32} aria-hidden /><p className="font-display text-2xl font-bold">Writing your week…</p><p className="mt-2 text-muted">This usually takes a few seconds.</p></div>
          </div>
        ) : !plan ? (
          <div className="grid h-full min-h-[380px] place-items-center text-center">
            <div><Wand2 className="mx-auto mb-4 text-violet" size={32} aria-hidden /><p className="font-display text-2xl font-bold">Your week of posts appears here</p><p className="mt-2 text-muted">Fill in your business and press the button.</p></div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-display text-xl font-bold">7 posts for {brand || "your business"}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-muted">{source === "ai" ? <><Sparkles size={12} className="text-violet" aria-hidden /> Written by our AI Script agent</> : "Built from proven short-video formats"}</p></div>
              <div className="flex gap-2">
                <button type="button" disabled={loading} onClick={() => { const s = seed + 1; setSeed(s); run(s); }} className="inline-flex disabled:opacity-60 items-center gap-1.5 rounded-full hairline px-3.5 py-2 text-sm hover:bg-fg/5"><RefreshCw size={14} className={loading ? "animate-spin" : ""} aria-hidden /> New ideas</button>
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full hairline px-3.5 py-2 text-sm hover:bg-fg/5"><Copy size={14} aria-hidden /> {copied ? "Copied" : "Copy all"}</button>
              </div>
            </div>
            <ul className="grid gap-3 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {plan.map((p, i) => (
                  <motion.li key={`${seed}-${p.day}`} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease, delay: i * 0.05 }} className="rounded-2xl bg-fg/[0.035] p-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted"><span className="font-semibold uppercase tracking-wider">{p.day} · {p.format}</span><PlatformIcon name={p.platform} size={15} /></div>
                    <p className="font-semibold leading-snug">“{p.hook}”</p>
                    <ol className="mt-2 list-decimal space-y-0.5 pl-4 text-sm text-muted">{p.beats.map((b) => <li key={b}>{b}</li>)}</ol>
                    <p className="mt-2 text-xs text-violet">{p.tags.join(" ")}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
