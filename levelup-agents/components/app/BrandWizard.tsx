"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import { PLATFORMS, PlatformIcon, type Platform } from "@/components/ui/PlatformIcon";
import { generatePlan, type PlanItem, type Tone } from "@/lib/generate";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEPS = ["Brand", "Niche", "Tone", "Platforms", "Your plan"] as const;
const TONES: { id: Tone; label: string; ex: string }[] = [
  { id: "friendly", label: "Friendly", ex: "Warm and welcoming, like talking to a regular." },
  { id: "bold", label: "Bold", ex: "Confident and punchy. Says what others won't." },
  { id: "expert", label: "Expert", ex: "Clear, useful and trustworthy." },
  { id: "funny", label: "Funny", ex: "Light, self-aware and a little silly." },
];

export function BrandWizard() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [brand, setBrand] = useState("");
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState<Tone>("friendly");
  const [plats, setPlats] = useState<Platform[]>(["tiktok", "instagram"]);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [copied, setCopied] = useState(false);

  const canNext = [brand.trim().length > 0, niche.trim().length > 0, true, plats.length > 0, true][step];
  const go = (d: number) => {
    const next = step + d;
    if (next === 4) setPlan(generatePlan({ brand, niche, tone, platforms: plats }));
    setDir(d); setStep(next);
  };
  const copy = async () => {
    const txt = plan.map((p) => `${p.day} (${p.platform}) · ${p.format}\nHook: ${p.hook}\n${p.beats.map((b, i) => `${i + 1}. ${b}`).join("\n")}\nCaption: ${p.caption} ${p.tags.join(" ")}`).join("\n\n");
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  const input = "w-full rounded-2xl hairline bg-bg-2/60 px-5 py-4 text-lg outline-none transition-colors focus:border-violet/60";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="mb-3 flex justify-between text-xs text-muted">
          {STEPS.map((s, i) => <span key={s} className={cn("transition-colors", i <= step && "font-semibold text-fg")}>{s}</span>)}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-fg/10" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Setup progress">
          <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.5, ease }} />
        </div>
      </div>

      <div className="glass relative min-h-[360px] overflow-hidden rounded-[24px] p-6 sm:p-8">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }} transition={{ duration: 0.35, ease }}>
            {step === 0 && (<div><label htmlFor="wz-brand" className="font-display text-2xl font-bold">What's your business called?</label><p className="mb-6 mt-1 text-muted">This is how your agents will refer to you.</p><input id="wz-brand" autoFocus className={input} placeholder="e.g. Sunrise Café" value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={60} /></div>)}
            {step === 1 && (<div><label htmlFor="wz-niche" className="font-display text-2xl font-bold">What do you do?</label><p className="mb-6 mt-1 text-muted">A few words is enough. The Research agent uses this to find trends.</p><input id="wz-niche" autoFocus className={input} placeholder="e.g. coffee shop, hair salon, fitness coach" value={niche} onChange={(e) => setNiche(e.target.value)} maxLength={60} /></div>)}
            {step === 2 && (<fieldset><legend className="font-display text-2xl font-bold">How should you sound?</legend><p className="mb-6 mt-1 text-muted">You can change this any time.</p>
              <div className="grid gap-3 sm:grid-cols-2">{TONES.map((t) => (
                <button key={t.id} type="button" aria-pressed={tone === t.id} onClick={() => setTone(t.id)} className={cn("rounded-2xl p-4 text-left transition-colors", tone === t.id ? "border border-violet/60 bg-violet/10" : "hairline hover:bg-fg/5")}>
                  <p className="flex items-center justify-between font-semibold">{t.label}{tone === t.id && <Check size={16} className="text-violet" aria-hidden />}</p><p className="mt-1 text-sm text-muted">{t.ex}</p>
                </button>))}</div></fieldset>)}
            {step === 3 && (<fieldset><legend className="font-display text-2xl font-bold">Where should we post?</legend><p className="mb-6 mt-1 text-muted">Pick one or more. Connections are mocked in this demo.</p>
              <div className="grid gap-3 sm:grid-cols-2">{PLATFORMS.map((p) => { const on = plats.includes(p.id); return (
                <button key={p.id} type="button" aria-pressed={on} onClick={() => setPlats(on ? plats.filter((x) => x !== p.id) : [...plats, p.id])} className={cn("flex items-center gap-3 rounded-2xl p-4 text-left transition-colors", on ? "border border-violet/60 bg-violet/10" : "hairline hover:bg-fg/5")}>
                  <PlatformIcon name={p.id} size={22} /><span className="flex-1 font-semibold">{p.name}</span>{on && <Check size={16} className="text-violet" aria-hidden />}
                </button>); })}</div></fieldset>)}
            {step === 4 && (<div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="font-display text-2xl font-bold">Your first week for {brand}</p><p className="text-sm text-muted">A starter plan from proven formats. Agents will tune it to live trends.</p></div>
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full hairline px-4 py-2 text-sm hover:bg-fg/5"><Copy size={14} aria-hidden /> {copied ? "Copied" : "Copy plan"}</button></div>
              <ol className="space-y-2">{plan.map((p, i) => (
                <motion.li key={p.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, ease }} className="flex gap-4 rounded-2xl bg-fg/[0.04] p-4">
                  <span className="w-10 shrink-0 text-sm font-semibold text-muted">{p.day}</span>
                  <div className="min-w-0 flex-1"><p className="font-semibold">“{p.hook}”</p><p className="mt-1 text-sm text-muted">{p.format} · {p.beats[0]}</p></div>
                  <span className="text-muted"><PlatformIcon name={p.platform} size={16} /></span>
                </motion.li>))}</ol>
            </div>)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={() => go(-1)} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-fg disabled:invisible"><ArrowLeft size={16} aria-hidden /> Back</button>
        {step < 4 ? (
          <button type="button" onClick={() => go(1)} disabled={!canNext} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-[transform,opacity] hover:-translate-y-0.5 disabled:opacity-40">{step === 3 ? "Make my plan" : "Continue"} <ArrowRight size={16} aria-hidden /></button>
        ) : (
          <button type="button" onClick={() => { setDir(-1); setStep(0); }} className="rounded-full hairline px-5 py-2.5 text-sm font-semibold hover:bg-fg/5">Start over</button>
        )}
      </div>
    </div>
  );
}
