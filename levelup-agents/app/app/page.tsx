"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, Check, Crown, Flame, Layers, Lock, Pencil, Plus, Sparkles, Star, Trash2, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Pip, PipSays, type Mood } from "@/components/cofounder/Pip";
import { CountUp } from "@/components/ui/CountUp";
import { AGENTS } from "@/lib/agents";
import { BADGES, gameStats, XP } from "@/lib/cofounder/game";
import { today, useWorkspace, type Profile, type Stage } from "@/lib/cofounder/profile";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STAGES: { id: Stage; label: string; emoji: string }[] = [
  { id: "idea", label: "Just an idea", emoji: "💡" },
  { id: "building", label: "Building it", emoji: "🛠️" },
  { id: "launched", label: "Launched", emoji: "🚀" },
];
const EXAMPLE: Profile = { founder: "Maya", startup: "StudyBuddy", idea: "matches students with a study partner for the same class", customer: "high school students who study alone", stage: "idea" };

/* ---------- Setup: one question at a time, with Pip ---------- */
function Setup({ initial, onSave, onCancel }: { initial?: Profile | null; onSave: (p: Profile) => void; onCancel?: () => void }) {
  const [p, setP] = useState<Profile>(initial ?? { founder: "", startup: "", idea: "", customer: "", stage: "idea" });
  const [step, setStep] = useState(0);
  const input = "w-full rounded-2xl hairline bg-bg-2/60 px-5 py-4 text-lg outline-none transition-colors focus:border-violet/60";
  const steps = [
    { say: <>Hey! I'm <b>Pip</b>, your AI co-founder. What should I call you, and what's your startup called?</>, ok: !!p.startup.trim(), body: (
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label htmlFor="hq-founder" className="mb-2 block text-sm font-semibold">Your first name</label><input id="hq-founder" autoFocus className={input} value={p.founder} onChange={(e) => setP({ ...p, founder: e.target.value })} placeholder="e.g. Harish" maxLength={40} /></div>
        <div><label htmlFor="hq-startup" className="mb-2 block text-sm font-semibold">Startup name</label><input id="hq-startup" className={input} value={p.startup} onChange={(e) => setP({ ...p, startup: e.target.value })} placeholder="e.g. Voca (or a working name)" maxLength={60} /></div>
      </div>) },
    { say: <>Nice{p.founder ? `, ${p.founder}` : ""}! In a few words, what does <b>{p.startup || "it"}</b> do?</>, ok: !!p.idea.trim(), body: (
      <div><label htmlFor="hq-idea" className="mb-2 block text-sm font-semibold">{p.startup || "It"}…</label><input id="hq-idea" autoFocus className={input} value={p.idea} onChange={(e) => setP({ ...p, idea: e.target.value })} placeholder="e.g. lets you practice public speaking with an AI that talks back" maxLength={200} /></div>) },
    { say: <>Last one. Who is it for, and where are you right now?</>, ok: !!p.customer.trim(), body: (
      <div className="space-y-4">
        <div><label htmlFor="hq-customer" className="mb-2 block text-sm font-semibold">It's for…</label><input id="hq-customer" autoFocus className={input} value={p.customer} onChange={(e) => setP({ ...p, customer: e.target.value })} placeholder="e.g. students who get nervous presenting" maxLength={120} /></div>
        <fieldset><legend className="mb-2 text-sm font-semibold">Where are you now?</legend>
          <div className="grid grid-cols-3 gap-2">{STAGES.map((s) => (
            <button key={s.id} type="button" aria-pressed={p.stage === s.id} onClick={() => setP({ ...p, stage: s.id })} className={cn("rounded-2xl py-3 text-sm font-semibold transition", p.stage === s.id ? "bg-accent text-white shadow-lg shadow-violet/30" : "hairline text-muted hover:text-fg")}><span className="block text-xl" aria-hidden>{s.emoji}</span>{s.label}</button>
          ))}</div>
        </fieldset>
      </div>) },
  ];
  const cur = steps[step];
  const last = step === steps.length - 1;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cur.ok) return;
    if (!last) { setStep(step + 1); return; }
    onSave({ founder: p.founder.trim(), startup: p.startup.trim(), idea: p.idea.trim(), customer: p.customer.trim(), stage: p.stage });
  };
  return (
    <form onSubmit={submit} className="glass mx-auto max-w-2xl space-y-6 overflow-hidden rounded-[28px] p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="kicker">{initial ? "Edit your startup" : "Startup HQ setup"} · Step {step + 1} of 3</p>
        {!initial && step === 0 && <button type="button" onClick={() => { setP(EXAMPLE); setStep(2); }} className="text-xs font-semibold text-violet hover:underline">Just exploring? Use an example</button>}
      </div>
      <div className="flex gap-1.5" aria-hidden>{steps.map((_, k) => <span key={k} className={cn("h-1.5 flex-1 rounded-full transition-colors", k <= step ? "bg-accent" : "bg-fg/10")} />)}</div>
      <PipSays mood={last ? "cheer" : step === 0 ? "wave" : "happy"} size={84}>{cur.say}</PipSays>
      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>{cur.body}</motion.div>
      <div className="flex gap-3">
        {step > 0 && <button type="button" onClick={() => setStep(step - 1)} aria-label="Back" className="grid w-14 place-items-center rounded-2xl hairline hover:bg-fg/5"><ArrowLeft size={18} aria-hidden /></button>}
        <button type="submit" disabled={!cur.ok} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cta py-4 text-lg font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50">
          {last ? (initial ? "Save" : "Let's go!") : "Next"} <ArrowRight size={18} aria-hidden />
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-2xl hairline px-5 font-semibold hover:bg-fg/5">Cancel</button>}
      </div>
    </form>
  );
}

/* ---------- Level ring ---------- */
function LevelRing({ level, pct }: { level: number; pct: number }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,.15)" strokeWidth="10" fill="none" />
        <motion.circle cx="60" cy="60" r={r} stroke="#FE8500" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Level</p><p className="font-display text-5xl leading-none text-white">{level}</p></div>
      </div>
    </div>
  );
}

/* ---------- Dashboard ---------- */
export default function HQ() {
  const { ws, ready, update } = useWorkspace();
  const [editing, setEditing] = useState(false);
  const [goal, setGoal] = useState("");
  if (!ready) return null;

  const save = (p: Profile) => { update((w) => ({ ...w, profile: p })); setEditing(false); };
  if (!ws.profile || editing) return <Setup initial={ws.profile} onSave={save} onCancel={ws.profile ? () => setEditing(false) : undefined} />;

  const p = ws.profile;
  const g = gameStats(ws, today());
  const next = AGENTS.find((a) => !ws.results[a.id]);
  const quests = [...AGENTS.map((a) => ({ id: a.id, href: `/app/agents/${a.id}`, name: `${a.name} agent`, stage: a.stage, icon: a.icon, done: !!ws.results[a.id], xp: XP.agent, boss: false })),
    { id: "deck", href: "/app/deck", name: "Pitch deck", stage: "Boss level: build your deck", icon: Layers, done: !!ws.deck, xp: XP.deck, boss: true }];
  const current = quests.find((q) => !q.done);
  const offsets = [0, 1, 2, 1, 0, 1, 2];

  const tip: { mood: Mood; text: React.ReactNode } =
    g.agentsDone === 0 ? { mood: "wave", text: <>Welcome to HQ! Start with the <b>Idea agent</b>. It takes 2 minutes and earns you your first badge.</> }
    : !current ? { mood: "cheer", text: <>You beat every level! Now go win a competition. Check <b>Opportunities</b>.</> }
    : current.boss ? { mood: "cheer", text: <>All six agents done! Time for the boss level: <b>build your pitch deck</b>.</> }
    : g.streak >= 2 ? { mood: "cheer", text: <>{g.streak}-day streak! 🔥 Next up: the <b>{current.name}</b>.</> }
    : { mood: "happy", text: <>Nice progress. Next up: the <b>{current.name}</b>. {g.toNext > 0 && <>{g.toNext} XP to level {g.level + 1}!</>}</> };

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const text = goal.trim(); if (!text) return;
    update((w) => ({ ...w, goals: [...w.goals, { id: String(Date.now()), text, done: false }].slice(-10) }));
    setGoal("");
  };

  return (
    <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="mx-auto max-w-[1200px] space-y-6">
      {/* HERO */}
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-[32px] p-6 text-white sm:p-8" style={{ background: "radial-gradient(120% 140% at 100% 0%, #105BFF 0%, #0A2A7A 45%, #0B1030 100%)" }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" aria-hidden />
        {[...Array(14)].map((_, k) => <span key={k} aria-hidden className="absolute h-1 w-1 rounded-full bg-white/50" style={{ left: `${(k * 37) % 100}%`, top: `${(k * 53) % 100}%`, opacity: 0.25 + (k % 4) * 0.15 }} />)}
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
            <Pip mood={tip.mood} size={110} className="hidden text-white sm:block" />
            <div className="min-w-0">
              <p className="text-sm text-white/70">{p.founder ? `Hey ${p.founder} 👋` : "Welcome back 👋"}</p>
              <h2 className="truncate font-display text-6xl uppercase leading-[0.9] sm:text-7xl">{p.startup} <span className="text-amber">HQ</span></h2>
              <p className="mt-2 line-clamp-2 max-w-xl text-white/75">{p.startup} {p.idea.replace(/\.$/, "")} for {p.customer}.</p>
              <div className="mt-4 rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-[15px] ring-1 ring-white/15 backdrop-blur"><span className="mr-1.5 font-semibold text-amber">Pip:</span>{tip.text}</div>
            </div>
          </div>
          <div className="flex items-center gap-5 rounded-3xl bg-white/[0.07] p-4 ring-1 ring-white/10 lg:w-[340px]">
            <LevelRing level={g.level} pct={g.pctToNext} />
            <div className="min-w-0">
              <p className="font-display text-3xl uppercase leading-none">{g.title}</p>
              <p className="mt-1 text-sm text-white/70">{g.next ? <>{g.toNext} XP to <b className="text-white">{g.next.title}</b></> : "Max level"}</p>
              <p className="mt-3 flex items-center gap-1 text-2xl font-bold text-amber"><Zap size={20} aria-hidden /><CountUp to={g.xp} /> <span className="text-sm font-semibold text-white/60">XP</span></p>
              <button type="button" onClick={() => setEditing(true)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white"><Pencil size={12} aria-hidden /> Edit startup</button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* STAT TILES */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total XP", value: g.xp, icon: Zap, tone: "text-violet bg-violet/10" },
          { label: "Day streak", value: g.streak, icon: Flame, tone: "text-amber bg-amber/10" },
          { label: `Badges of ${BADGES.length}`, value: g.badges.length, icon: Award, tone: "text-good bg-good/10" },
          { label: `Quests of ${quests.length}`, value: quests.filter((q) => q.done).length, icon: Trophy, tone: "text-violet bg-violet/10" },
        ].map((s) => (
          <motion.div key={s.label} whileHover={{ y: -3 }} className="glass flex items-center gap-3 rounded-[20px] p-4">
            <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", s.tone)}><s.icon size={22} aria-hidden /></span>
            <div><p className="font-display text-4xl leading-none"><CountUp to={s.value} /></p><p className="text-xs text-muted">{s.label}</p></div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* QUEST MAP */}
        <motion.section variants={fadeUp} className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div><h3 className="font-display text-4xl uppercase leading-none">Quest map</h3><p className="text-sm text-muted">Idea to launch, one level at a time</p></div>
            <span className="rounded-full bg-fg/[0.06] px-3 py-1 text-sm font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{quests.filter((q) => q.done).length}/{quests.length}</span>
          </div>
          <ol className="relative space-y-3">
            {quests.map((q, k) => {
              const isCur = current?.id === q.id;
              const Icon = q.icon;
              return (
                <li key={q.id} style={{ paddingLeft: `calc(${offsets[k]} * min(4.5rem, 9vw))` }}>
                  {k > 0 && <div aria-hidden className="mb-3 ml-9 flex gap-1.5">{[0, 1, 2].map((d) => <span key={d} className={cn("h-1.5 w-1.5 rounded-full", q.done || isCur ? "bg-violet/60" : "bg-fg/15")} />)}</div>}
                  <Link href={q.href} className="group flex items-center gap-4">
                    <span className="relative">
                      {isCur && <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-amber px-2 py-0.5 text-xs font-bold text-[#1a1100] shadow">START<span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-amber" /></span>}
                      <motion.span whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                        className={cn("grid place-items-center rounded-full border-b-[6px] transition-colors",
                          q.boss ? "h-[84px] w-[84px]" : "h-[72px] w-[72px]",
                          q.done ? "border-green-700 bg-good text-white" : isCur ? "pulse-ring border-[#c96800] bg-amber text-[#1a1100]" : "border-fg/15 bg-fg/[0.08] text-muted")}>
                        {q.done ? <Check size={30} strokeWidth={3} aria-hidden /> : q.boss ? <Crown size={32} aria-hidden /> : <Icon size={28} aria-hidden />}
                      </motion.span>
                      {q.done && <Star size={18} className="absolute -right-1 -top-1 fill-amber text-amber" aria-hidden />}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold group-hover:text-violet">{q.name}</span>
                      <span className="block text-sm leading-snug text-muted">{q.stage}</span>
                      <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold", q.done ? "bg-good/15 text-good" : "bg-violet/10 text-violet")}>{q.done ? `+${q.xp} XP earned` : `+${q.xp} XP`}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </motion.section>

        <div className="space-y-6">
          {/* TODAY'S QUEST */}
          <motion.div variants={fadeUp}>
            {current ? (
              <Link href={current.href} className="group relative block overflow-hidden rounded-[24px] bg-cta p-6 transition-transform hover:-translate-y-1">
                <Sparkles className="absolute right-5 top-5 opacity-40" size={28} aria-hidden />
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Today's quest</p>
                <p className="mt-2 font-display text-4xl uppercase leading-none">{current.name}</p>
                <p className="mt-2 text-sm opacity-80">{current.boss ? "Turn everything you've done into a 10-slide deck." : AGENTS.find((a) => a.id === current.id)?.line}</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1a1100] px-4 py-2 text-sm font-semibold text-white">Play <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden /> <span className="text-amber">+{current.xp} XP</span></span>
              </Link>
            ) : (
              <div className="glass rounded-[24px] p-6"><p className="font-display text-3xl uppercase">All quests complete 👑</p><p className="mt-2 text-sm text-muted">Re-run agents as your startup changes, and keep your streak alive with weekly goals.</p></div>
            )}
          </motion.div>

          {/* GOALS */}
          <motion.div variants={fadeUp} className="glass rounded-[24px] p-6">
            <div className="flex items-center justify-between"><h3 className="font-display text-3xl uppercase">This week</h3><span className="text-xs font-bold text-violet">+{XP.goal} XP each</span></div>
            <p className="mt-1 text-sm text-muted">What will you ship by Sunday?</p>
            <ul className="mt-4 space-y-2">
              {ws.goals.length === 0 && <li className="text-sm text-muted">No goals yet. Try "Interview 5 customers."</li>}
              {ws.goals.map((gl) => (
                <motion.li layout key={gl.id} className="flex items-center gap-3 rounded-xl bg-fg/[0.04] px-3 py-2.5">
                  <button type="button" role="checkbox" aria-checked={gl.done} aria-label={`Mark "${gl.text}" ${gl.done ? "not done" : "done"}`} onClick={() => update((w) => ({ ...w, goals: w.goals.map((x) => (x.id === gl.id ? { ...x, done: !x.done } : x)) }))}
                    className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition", gl.done ? "border-good bg-good text-white" : "border-fg/30 hover:border-violet")}>{gl.done && <Check size={14} strokeWidth={3} aria-hidden />}</button>
                  <span className={cn("flex-1 text-sm", gl.done && "text-muted line-through")}>{gl.text}</span>
                  <button type="button" aria-label={`Remove "${gl.text}"`} onClick={() => update((w) => ({ ...w, goals: w.goals.filter((x) => x.id !== gl.id) }))} className="text-muted hover:text-fg"><Trash2 size={14} aria-hidden /></button>
                </motion.li>
              ))}
            </ul>
            <form onSubmit={addGoal} className="mt-3 flex gap-2">
              <label htmlFor="goal" className="sr-only">New goal</label>
              <input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Add a goal" maxLength={100} className="min-w-0 flex-1 rounded-xl hairline bg-bg-2/60 px-3 py-2 text-sm outline-none focus:border-violet/60" />
              <button type="submit" aria-label="Add goal" className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white"><Plus size={16} aria-hidden /></button>
            </form>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/app/opportunities" className="glass flex items-center gap-3 rounded-[20px] p-5 transition-colors hover:bg-fg/[0.03]">
              <Trophy size={22} className="text-amber" aria-hidden /><span className="flex-1 text-sm"><b className="font-semibold">Opportunities</b><span className="block text-muted">Competitions and programs for young founders</span></span><ArrowRight size={16} aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* BADGES */}
      <motion.section variants={fadeUp} className="glass rounded-[28px] p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between"><h3 className="font-display text-4xl uppercase leading-none">Trophy case</h3><span className="text-sm text-muted">{g.badges.length} of {BADGES.length} unlocked</span></div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {BADGES.map((b) => {
            const got = g.badges.includes(b.id);
            const Icon = b.icon;
            return (
              <li key={b.id} className={cn("flex flex-col items-center rounded-2xl p-4 text-center transition", got ? "bg-amber/10 ring-1 ring-amber/40" : "bg-fg/[0.03]")}>
                <motion.span whileHover={got ? { rotate: [0, -10, 10, 0] } : undefined} className={cn("relative grid h-16 w-16 place-items-center rounded-full", got ? "bg-gradient-to-br from-[#FFD08A] to-[#FE8500] text-[#1a1100] shadow-lg shadow-amber/30" : "bg-fg/[0.07] text-muted")}>
                  <Icon size={26} aria-hidden />
                  {!got && <Lock size={14} className="absolute -bottom-0.5 -right-0.5 rounded-full bg-bg-2 p-0.5" aria-hidden />}
                </motion.span>
                <p className={cn("mt-2 text-sm font-semibold", !got && "text-muted")}>{b.name}</p>
                <p className="text-xs text-muted">{got ? "Unlocked" : b.how}</p>
              </li>
            );
          })}
        </ul>
      </motion.section>
    </motion.div>
  );
}
