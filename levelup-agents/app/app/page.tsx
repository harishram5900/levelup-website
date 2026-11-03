"use client";
import { motion } from "framer-motion";
import { ArrowRight, Check, Pencil, Plus, Trash2, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AGENTS } from "@/lib/agents";
import { fadeUp, stagger } from "@/lib/motion";
import { useWorkspace, type Profile, type Stage } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";

const STAGES: { id: Stage; label: string }[] = [
  { id: "idea", label: "Just an idea" },
  { id: "building", label: "Building it" },
  { id: "launched", label: "Launched" },
];

function Setup({ initial, onSave, onCancel }: { initial?: Profile | null; onSave: (p: Profile) => void; onCancel?: () => void }) {
  const [p, setP] = useState<Profile>(initial ?? { founder: "", startup: "", idea: "", customer: "", stage: "idea" });
  const input = "w-full rounded-xl hairline bg-bg-2/60 px-4 py-3 text-[15px] outline-none transition-colors focus:border-violet/60";
  const ok = p.startup.trim() && p.idea.trim() && p.customer.trim();
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (ok) onSave({ ...p, founder: p.founder.trim(), startup: p.startup.trim(), idea: p.idea.trim(), customer: p.customer.trim() }); }} className="glass mx-auto max-w-2xl space-y-5 rounded-[24px] p-6 sm:p-8">
      <div>
        <p className="kicker">Startup HQ</p>
        <h2 className="mt-2 font-display text-5xl uppercase leading-none">{initial ? "Edit your startup" : "Meet your co-founder"}</h2>
        <p className="mt-2 text-muted">Tell us about your startup once. All six agents use it, so you never repeat yourself.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="hq-founder" className="mb-2 block text-sm font-semibold">Your first name</label><input id="hq-founder" className={input} value={p.founder} onChange={(e) => setP({ ...p, founder: e.target.value })} placeholder="e.g. Harish" maxLength={40} /></div>
        <div><label htmlFor="hq-startup" className="mb-2 block text-sm font-semibold">Startup name *</label><input id="hq-startup" required className={input} value={p.startup} onChange={(e) => setP({ ...p, startup: e.target.value })} placeholder="e.g. Voca" maxLength={60} /></div>
      </div>
      <div><label htmlFor="hq-idea" className="mb-2 block text-sm font-semibold">What does it do? *</label><input id="hq-idea" required className={input} value={p.idea} onChange={(e) => setP({ ...p, idea: e.target.value })} placeholder="e.g. lets you practice public speaking with an AI that talks back" maxLength={200} /></div>
      <div><label htmlFor="hq-customer" className="mb-2 block text-sm font-semibold">Who is it for? *</label><input id="hq-customer" required className={input} value={p.customer} onChange={(e) => setP({ ...p, customer: e.target.value })} placeholder="e.g. high school students who get nervous presenting" maxLength={120} /></div>
      <fieldset><legend className="mb-2 text-sm font-semibold">Where are you now?</legend>
        <div className="grid grid-cols-3 gap-2">{STAGES.map((s) => (
          <button key={s.id} type="button" aria-pressed={p.stage === s.id} onClick={() => setP({ ...p, stage: s.id })} className={cn("rounded-xl py-2.5 text-sm transition-colors", p.stage === s.id ? "bg-accent text-white" : "hairline text-muted hover:text-fg")}>{s.label}</button>
        ))}</div>
      </fieldset>
      <div className="flex gap-3">
        <button type="submit" disabled={!ok} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cta py-3.5 font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50">{initial ? "Save" : "Start building"} <ArrowRight size={18} aria-hidden /></button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl hairline px-5 font-semibold hover:bg-fg/5">Cancel</button>}
      </div>
    </form>
  );
}

export default function HQ() {
  const { ws, ready, update } = useWorkspace();
  const [editing, setEditing] = useState(false);
  const [goal, setGoal] = useState("");
  if (!ready) return null;

  const save = (p: Profile) => { update((w) => ({ ...w, profile: p })); setEditing(false); };
  if (!ws.profile || editing) return <Setup initial={ws.profile} onSave={save} onCancel={ws.profile ? () => setEditing(false) : undefined} />;

  const p = ws.profile;
  const done = AGENTS.filter((a) => ws.results[a.id]).length;
  const next = AGENTS.find((a) => !ws.results[a.id]);
  const pct = Math.round((done / AGENTS.length) * 100);
  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const text = goal.trim(); if (!text) return;
    update((w) => ({ ...w, goals: [...w.goals, { id: String(Date.now()), text, done: false }].slice(-10) }));
    setGoal("");
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{p.founder ? `Hey ${p.founder}` : "Welcome back"}</p>
          <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">{p.startup} HQ</h2>
          <p className="mt-2 max-w-2xl text-muted">{p.startup} {p.idea.replace(/\.$/, "")} for {p.customer}.</p>
        </div>
        <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-full hairline px-4 py-2 text-sm hover:bg-fg/5"><Pencil size={14} aria-hidden /> Edit startup</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <GlassCard glow={false} className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="font-display text-3xl uppercase">Your journey</h3>
            <span className="text-sm text-muted" style={{ fontVariantNumeric: "tabular-nums" }}>{done} of {AGENTS.length} done</span>
          </div>
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-fg/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Journey progress">
            <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
          <motion.ol variants={stagger(0.05)} initial="hidden" animate="show" className="space-y-2">
            {AGENTS.map((a, i) => {
              const isDone = !!ws.results[a.id];
              const isNext = next?.id === a.id;
              const Icon = a.icon;
              return (
                <motion.li key={a.id} variants={fadeUp}>
                  <Link href={`/app/agents/${a.id}`} className={cn("flex items-center gap-4 rounded-2xl p-3.5 transition-colors hover:bg-fg/[0.05]", isNext && "bg-violet/10 ring-1 ring-violet/40")}>
                    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", isDone ? "bg-good/15 text-good" : isNext ? "bg-accent text-white" : "bg-fg/[0.06] text-muted")}>{isDone ? <Check size={20} aria-hidden /> : <Icon size={20} aria-hidden />}</span>
                    <span className="min-w-0 flex-1"><span className="block font-semibold">{i + 1}. {a.name} agent</span><span className="block truncate text-sm text-muted">{a.stage}</span></span>
                    <span className={cn("shrink-0 text-xs font-semibold", isDone ? "text-good" : isNext ? "text-violet" : "text-muted")}>{isDone ? "Done" : isNext ? "Next" : ""}</span>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ol>
        </GlassCard>

        <div className="space-y-6">
          {next ? (
            <Link href={`/app/agents/${next.id}`} className="block rounded-[20px] bg-cta p-6 transition-transform hover:-translate-y-0.5">
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Up next</p>
              <p className="mt-2 font-display text-4xl uppercase leading-none">{next.name} agent</p>
              <p className="mt-2 text-sm opacity-80">{next.line}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-semibold">Start <ArrowRight size={16} aria-hidden /></span>
            </Link>
          ) : (
            <GlassCard glow={false} className="p-6"><p className="font-display text-3xl uppercase">All six done</p><p className="mt-2 text-sm text-muted">Re-run any agent as your startup changes, then apply to a competition.</p></GlassCard>
          )}

          <GlassCard glow={false} className="p-6">
            <h3 className="font-display text-3xl uppercase">This week</h3>
            <p className="mt-1 text-sm text-muted">Your co-founder check-in: what will you ship by Sunday?</p>
            <ul className="mt-4 space-y-2">
              {ws.goals.length === 0 && <li className="text-sm text-muted">No goals yet. Add one below, like "Interview 5 customers."</li>}
              {ws.goals.map((g) => (
                <li key={g.id} className="flex items-center gap-3 rounded-xl bg-fg/[0.04] px-3 py-2.5">
                  <button type="button" role="checkbox" aria-checked={g.done} aria-label={`Mark "${g.text}" ${g.done ? "not done" : "done"}`} onClick={() => update((w) => ({ ...w, goals: w.goals.map((x) => (x.id === g.id ? { ...x, done: !x.done } : x)) }))}
                    className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-md border", g.done ? "border-good bg-good text-white" : "border-fg/30")}>{g.done && <Check size={13} aria-hidden />}</button>
                  <span className={cn("flex-1 text-sm", g.done && "text-muted line-through")}>{g.text}</span>
                  <button type="button" aria-label={`Remove "${g.text}"`} onClick={() => update((w) => ({ ...w, goals: w.goals.filter((x) => x.id !== g.id) }))} className="text-muted hover:text-fg"><Trash2 size={14} aria-hidden /></button>
                </li>
              ))}
            </ul>
            <form onSubmit={addGoal} className="mt-3 flex gap-2">
              <label htmlFor="goal" className="sr-only">New goal</label>
              <input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Add a goal" maxLength={100} className="min-w-0 flex-1 rounded-xl hairline bg-bg-2/60 px-3 py-2 text-sm outline-none focus:border-violet/60" />
              <button type="submit" aria-label="Add goal" className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white"><Plus size={16} aria-hidden /></button>
            </form>
          </GlassCard>

          <Link href="/app/opportunities" className="flex items-center gap-3 rounded-[20px] glass p-5 transition-colors hover:bg-fg/[0.03]">
            <Trophy size={20} className="text-amber" aria-hidden /><span className="flex-1 text-sm"><b className="font-semibold">Opportunities</b><span className="block text-muted">Competitions and programs for young founders</span></span><ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
