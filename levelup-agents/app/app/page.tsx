"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, Gift, Medal, BookOpen, Check, Crown, ExternalLink, Flame, Layers, Lock, Pencil, Plus, Sparkles, Star, Trash2, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PlaybookCard } from "@/components/cofounder/PlaybookCard";
import { FounderCall } from "@/components/cofounder/FounderCall";
import { ProBanner } from "@/components/cofounder/ProBanner";
import { Buddy, BuddySays, CHARACTERS, characterById, type Mood } from "@/components/cofounder/Pip";
import { authEnabled, useAuth } from "@/lib/supabase";
import { haptic } from "@/lib/native";
import { xpToast } from "@/components/cofounder/XpToast";
import { CharacterPicker, PalettePicker } from "@/components/cofounder/Pickers";
import { CountUp } from "@/components/ui/CountUp";
import { AGENTS, WORLDS } from "@/lib/agents";
import { BADGES, gameStats, XP } from "@/lib/cofounder/game";
import { today, useWorkspace, type Profile, type Stage } from "@/lib/cofounder/profile";
import { playbookOfTheDay, recommend } from "@/lib/cofounder/recommend";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { isProAgent, usePlan } from "@/lib/cofounder/plan";
import { XP_CHECKIN, latest, weekOf, weeklyGrowth } from "@/lib/cofounder/traction";
import { ProBadge } from "@/components/cofounder/ProGate";

const STAGES: { id: Stage; label: string; emoji: string }[] = [
  { id: "idea", label: "Just an idea", emoji: "💡" },
  { id: "building", label: "Building it", emoji: "🛠️" },
  { id: "launched", label: "Launched", emoji: "🚀" },
];
const EXAMPLE: Profile = { founder: "Maya", startup: "StudyBuddy", idea: "matches students with a study partner for the same class", customer: "high school students who study alone", stage: "idea" };

/* ---------- Setup: one question at a time, with your co-founder ---------- */
function Setup({ initial, onSave, onCancel }: { initial?: Profile | null; onSave: (p: Profile) => void; onCancel?: () => void }) {
  const { ws, update } = useWorkspace();
  const [p, setP] = useState<Profile>(initial ?? { founder: "", startup: "", idea: "", customer: "", stage: "idea" });
  const [step, setStep] = useState(0);
  const [welcome, setWelcome] = useState(!initial);
  const { user } = useAuth();
  const ch = ws.prefs.character;
  const buddy = characterById(ch);
  const input = "w-full rounded-2xl hairline bg-bg-2/60 px-5 py-4 text-lg outline-none transition-colors focus:border-violet/60";
  const steps = [
    { say: <>Hey! Pick your <b>AI co-founder</b>. Each one has a different personality. You can switch anytime.</>, ok: true, body: (
      <CharacterPicker value={ch} onChange={(c) => update((w) => ({ ...w, prefs: { ...w.prefs, character: c } }))} />) },
    { say: <>I'm <b>{buddy.name}</b>, {buddy.role.toLowerCase()}. {buddy.catchphrase} What should I call you, and what's your startup called?</>, ok: !!p.startup.trim(), body: (
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label htmlFor="hq-founder" className="mb-2 block text-sm font-semibold">Your first name</label><input id="hq-founder" className={input} value={p.founder} onChange={(e) => setP({ ...p, founder: e.target.value })} placeholder="e.g. Harish" maxLength={40} /></div>
        <div><label htmlFor="hq-startup" className="mb-2 block text-sm font-semibold">Startup name</label><input id="hq-startup" className={input} value={p.startup} onChange={(e) => setP({ ...p, startup: e.target.value })} placeholder="e.g. Voca (or a working name)" maxLength={60} /></div>
      </div>) },
    { say: <>Nice{p.founder ? `, ${p.founder}` : ""}! In a few words, what does <b>{p.startup || "it"}</b> do?</>, ok: !!p.idea.trim(), body: (
      <div><label htmlFor="hq-idea" className="mb-2 block text-sm font-semibold">{p.startup || "It"}…</label><input id="hq-idea" autoFocus className={input} value={p.idea} onChange={(e) => setP({ ...p, idea: e.target.value })} placeholder="e.g. lets you practice public speaking with an AI that talks back" maxLength={200} /></div>) },
    { say: <>Who is it for, and where are you right now?</>, ok: !!p.customer.trim(), body: (
      <div className="space-y-4">
        <div><label htmlFor="hq-customer" className="mb-2 block text-sm font-semibold">It's for…</label><input id="hq-customer" autoFocus className={input} value={p.customer} onChange={(e) => setP({ ...p, customer: e.target.value })} placeholder="e.g. students who get nervous presenting" maxLength={120} /></div>
        <fieldset><legend className="mb-2 text-sm font-semibold">Where are you now?</legend>
          <div className="grid grid-cols-3 gap-2">{STAGES.map((s) => (
            <button key={s.id} type="button" aria-pressed={p.stage === s.id} onClick={() => setP({ ...p, stage: s.id })} className={cn("rounded-2xl py-3 text-sm font-semibold transition", p.stage === s.id ? "bg-accent text-white shadow-lg shadow-violet/30" : "hairline text-muted hover:text-fg")}><span className="block text-xl" aria-hidden>{s.emoji}</span>{s.label}</button>
          ))}</div>
        </fieldset>
      </div>) },
    { say: <>Last thing: pick the colors for your HQ. Make it yours!</>, ok: true, body: (
      <PalettePicker value={ws.prefs.palette} onChange={(pal) => update((w) => ({ ...w, prefs: { ...w.prefs, palette: pal } }))} />) },
  ];
  const skipChar = !!initial;
  const first = skipChar ? 1 : 0;
  const cur = steps[step + first] ?? steps[first];
  const total = steps.length - first;
  const last = step === total - 1;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cur.ok) return;
    if (!last) { setStep(step + 1); return; }
    update((w) => ({ ...w, prefs: { ...w.prefs, picked: true } }));
    onSave({ founder: p.founder.trim(), startup: p.startup.trim(), idea: p.idea.trim(), customer: p.customer.trim(), stage: p.stage });
  };
  if (welcome) return <Welcome signedIn={!!user} onStart={() => setWelcome(false)} />;
  return (
    <form onSubmit={submit} className={cn("glass mx-auto space-y-6 overflow-x-clip rounded-[28px] p-6 sm:p-8", step + first === 0 ? "max-w-4xl" : "max-w-2xl")}>
      <div className="flex items-center justify-between gap-3">
        <p className="kicker">{initial ? "Edit your startup" : "Startup HQ setup"} · Step {step + 1} of {total}</p>
        {!initial && step + first === 1 && <button type="button" onClick={() => { setP(EXAMPLE); setStep(3 - first); }} className="text-xs font-semibold text-violet hover:underline">Just exploring? Use an example</button>}
      </div>
      <div className="flex gap-1.5" aria-hidden>{Array.from({ length: total }).map((_, k) => <span key={k} className={cn("h-1.5 flex-1 rounded-full transition-colors", k <= step ? "bg-accent" : "bg-fg/10")} />)}</div>
      <BuddySays character={ch} mood={last ? "cheer" : step === 0 ? "wave" : "happy"} size={84}>{cur.say}</BuddySays>
      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>{cur.body}</motion.div>
      {/* On phones the buttons stay pinned to the bottom of the screen so they're always reachable. */}
      <div className="sticky bottom-0 z-10 -mx-6 -mb-6 flex gap-3 rounded-b-[28px] border-t border-fg/[0.06] bg-bg/90 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:static sm:m-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        {step > 0 && <button type="button" onClick={() => setStep(step - 1)} aria-label="Back" className="btn-glass w-14 rounded-2xl"><ArrowLeft size={18} aria-hidden /></button>}
        <button type="submit" disabled={!cur.ok} className="btn-play flex-1 text-lg">
          {last ? (initial ? "Save" : "Enter my HQ!") : "Next"} <ArrowRight size={18} aria-hidden />
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="btn-glass rounded-2xl px-5">Cancel</button>}
      </div>
    </form>
  );
}

/* ---------- First launch: what LevelUp is, then start or sign in ---------- */
function Welcome({ signedIn, onStart }: { signedIn: boolean; onStart: () => void }) {
  const points = [
    { icon: Sparkles, t: "12 AI agents", d: "Idea, customers, competitors, pitch, money, launch and more" },
    { icon: Trophy, t: "300+ opportunities", d: "Competitions, grants, hackathons and programs, matched to you" },
    { icon: Flame, t: "Level up daily", d: "Quests, XP, streaks and badges keep you moving" },
  ];
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-md flex-col justify-between gap-5 pb-[env(safe-area-inset-bottom)] md:min-h-0 md:py-10">
      <div className="text-center">
        <div className="relative mx-auto flex h-28 items-end justify-center">
          {CHARACTERS.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 260, damping: 18 }} className={cn("-mx-2", i === 2 ? "z-10" : "")}>
              <Buddy character={c.id} mood={i === 2 ? "wave" : "happy"} size={i === 2 ? 96 : 66} />
            </motion.div>
          ))}
        </div>
        <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-4 font-display text-[44px] uppercase leading-[0.95]">Build a real startup with <span className="text-amber">AI co-founders</span></motion.h2>
        <p className="mt-3 text-muted">From your first idea to your first customers. Free for student founders.</p>
      </div>
      <ul className="space-y-2.5">
        {points.map((x, i) => (
          <motion.li key={x.t} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.1 }} className="glass flex items-center gap-3.5 rounded-2xl p-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber/15 text-amber"><x.icon size={20} aria-hidden /></span>
            <span><span className="block font-semibold">{x.t}</span><span className="text-sm text-muted">{x.d}</span></span>
          </motion.li>
        ))}
      </ul>
      <div className="space-y-3">
        <button type="button" onClick={onStart} className="btn-play w-full text-lg">Get started <ArrowRight size={18} aria-hidden /></button>
        {authEnabled && !signedIn && <Link href="/signin" className="btn-glass w-full">I already have an account</Link>}
        <p className="text-center text-xs text-muted">By continuing you agree to the <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
      </div>
    </div>
  );
}

/* ---------- Level ring ---------- */
function LevelRing({ level, pct }: { level: number; pct: number }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,.15)" strokeWidth="10" fill="none" />
        <motion.circle cx="60" cy="60" r={r} stroke="rgb(var(--amber))" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
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
  const { pro, bonusXp } = usePlan();
  if (!ready) return null;

  const save = (p: Profile) => { update((w) => ({ ...w, profile: p })); setEditing(false); };
  if (!ws.profile || editing) return <Setup initial={editing ? ws.profile : null} onSave={save} onCancel={ws.profile ? () => setEditing(false) : undefined} />;

  const p = ws.profile;
  const ch = ws.prefs.character;
  const buddy = characterById(ch);
  const g = gameStats(ws, today(), bonusXp);
  const quests = [...AGENTS.map((a) => ({ id: a.id, href: `/app/agents/${a.id}`, name: `${a.name} agent`, stage: a.stage, icon: a.icon, done: !!ws.results[a.id], xp: XP.agent, boss: false, world: a.world, locked: !pro && isProAgent(a.id) })),
    { id: "deck", href: "/app/deck", name: "Pitch deck", stage: "Boss level: design your deck", icon: Layers, done: !!ws.deck, xp: XP.deck, boss: true, world: 4, locked: !pro }];
  const current = quests.find((q) => !q.done && !q.locked);
  const recs = recommend(ws, pro);
  const pb = playbookOfTheDay();

  const tip: { mood: Mood; text: React.ReactNode } =
    g.agentsDone === 0 ? { mood: "wave", text: <>Welcome to HQ! Start with the <b>Idea agent</b>. It takes 2 minutes and earns your first badge.</> }
    : !current ? { mood: "cheer", text: <>You beat every level! Now go win something. Check <b>Opportunities</b>.</> }
    : current.boss ? { mood: "cheer", text: <>All agents done! Time for the boss level: <b>your pitch deck</b>.</> }
    : g.streak >= 2 ? { mood: "cheer", text: <>{g.streak}-day streak! 🔥 Next up: the <b>{current.name}</b>.</> }
    : { mood: "happy", text: <>{buddy.catchphrase} Next up: the <b>{current.name}</b>. {g.toNext > 0 && <>{g.toNext} XP to level {g.level + 1}!</>}</> };

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const text = goal.trim(); if (!text) return;
    update((w) => ({ ...w, goals: [...w.goals, { id: String(Date.now()), text, done: false }].slice(-10) }));
    setGoal("");
  };

  const checkedIn = (ws.traction ?? []).some((c) => c.week === weekOf());
  const showCheckin = !checkedIn && g.agentsDone > 0;
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const lastT = latest(ws.traction);
  const growth = weeklyGrowth(ws.traction);

  let qi = 0;
  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="mx-auto max-w-[1100px] space-y-5">
      {/* HEADER: a notebook page for your startup */}
      <motion.header variants={fadeUp} data-tour="hero">
        <div className="flex items-center justify-between text-[13px] text-muted">
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
          <span><b className="font-semibold text-fg">Level {g.level}</b> · {g.streak > 0 ? `${g.streak}-day streak` : "start a streak today"}</span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted">{hello}{p.founder ? `, ${p.founder}` : ""}</p>
            <h2 className="serif mt-1 truncate text-[56px] leading-[0.95]">{p.startup}</h2>
          </div>
          <Buddy character={ch} mood={tip.mood} size={60} className="mb-1 shrink-0" />
        </div>
        <button type="button" onClick={() => setEditing(true)} className="mt-2 inline-flex max-w-full items-start gap-1.5 text-left text-[15px] leading-snug text-muted hover:text-fg"><span className="line-clamp-2">{p.startup} {p.idea.replace(/\.$/, "")}.</span><Pencil size={12} className="mt-1 shrink-0" aria-hidden /></button>
        <div data-tour="level" className="mt-4 flex items-center gap-3 text-[13px] text-muted">
          <span className="font-medium text-fg">{g.title}</span>
          <div className="h-[2px] flex-1 bg-fg/15"><div className="h-full bg-fg transition-all duration-700" style={{ width: `${g.pctToNext}%` }} /></div>
          <span className="tabular-nums">{g.next ? `${g.toNext} XP to ${g.next.title}` : "Max level"}</span>
        </div>
      </motion.header>

      {/* NEXT STEP: one clear, ink-black card with your co-founder */}
      <motion.div variants={fadeUp} data-tour="today">
        {(() => {
          const card = showCheckin
            ? { href: "/app/growth", meta: `Next step · 30 seconds · +${XP_CHECKIN} XP`, title: "Log this week's numbers", body: `Customer talks, users and revenue. ${buddy.name} turns them into your growth rate.`, cta: "Check in" }
            : current
              ? { href: current.href, meta: `Next step · about ${current.boss ? 10 : 3} min · +${current.xp} XP`, title: current.name, body: current.boss ? "Turn everything you've done into a 10-slide deck in your own design." : AGENTS.find((a) => a.id === current.id)?.line ?? "", cta: "Start" }
              : null;
          if (!card) return (
            <div className="rounded-[18px] border border-fg/15 p-5"><p className="serif text-3xl">{pro ? "Every quest complete" : "Free quests complete"}</p><p className="mt-1 text-sm text-muted">{pro ? "Keep logging your numbers weekly and go win an opportunity." : "Pricing, sales, launch and fundraising are next."}</p>{!pro && <Link href="/app/upgrade" className="btn-play mt-4 text-sm">See LevelUp Pro</Link>}</div>
          );
          return (
            <Link href={card.href} className="group relative block overflow-hidden rounded-[20px] bg-cta p-5 pr-28 transition active:scale-[0.99]">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.06em] opacity-60">{card.meta}</p>
              <p className="serif mt-2 text-[32px] leading-[1.02]">{card.title}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed opacity-75">{card.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-bg px-4 py-2 text-sm font-semibold text-fg">{card.cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
              <Buddy character={ch} mood="happy" size={104} className="absolute -bottom-3 -right-2 transition-transform group-hover:-translate-y-1" />
            </Link>
          );
        })()}
      </motion.div>

      {/* ASK YOUR CO-FOUNDER */}
      <motion.div variants={fadeUp}>
        <Link href="/app/cofounder" className="flex items-center gap-3 rounded-full border border-fg/15 px-4 py-3 transition hover:border-fg/35">
          <Buddy character={ch} mood="happy" size={28} />
          <span className="flex-1 text-[15px] text-muted">Ask {buddy.name} anything about {p.startup}…</span>
          {!pro && <span className="rounded-full bg-fg/[0.07] px-2 py-0.5 text-[11px] font-semibold">Pro</span>}
          <ArrowRight size={16} className="text-muted" aria-hidden />
        </Link>
      </motion.div>

      <div className="grid gap-x-8 lg:grid-cols-2">
        {/* YOUR NUMBERS: big serif figures, ruled like a notebook */}
        <motion.section variants={fadeUp} className="border-t border-fg/15 pt-4">
          <div className="flex items-center justify-between text-[13px]"><b className="font-semibold">Your numbers</b><Link href="/app/growth" className="flex items-center gap-1 text-muted hover:text-fg">{checkedIn && lastT ? `Week of ${new Date(`${lastT.week}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Check in"} <ArrowRight size={13} aria-hidden /></Link></div>
          <Link href="/app/growth" className="mt-3 grid grid-cols-3">
            {([["users", lastT ? lastT.users.toLocaleString("en-US") : "0", false], ["this week", lastT ? `$${lastT.revenue.toLocaleString("en-US")}` : "$0", false], ["growth / week", growth === null ? "—" : `${growth > 0 ? "+" : ""}${Math.round(growth * 100)}%`, growth !== null && growth > 0]] as [string, string, boolean][]).map(([k, v, up]) => (
              <div key={k}><p className={cn("serif text-[44px] leading-none tabular-nums", up && "text-good")}>{v}</p><p className="mt-1 text-xs text-muted">{k}</p></div>
            ))}
          </Link>
          {!lastT && <p className="mt-3 text-sm text-muted">Log your first week to see your growth rate.</p>}
        </motion.section>

        {/* THIS WEEK: goals as a ruled checklist */}
        <motion.section variants={fadeUp} id="goals" data-tour="goals" className="mt-6 border-t border-fg/15 pt-4 lg:mt-0">
          <div className="flex items-center justify-between text-[13px]"><b className="font-semibold">This week</b><span className="text-muted">+{XP.goal} XP each</span></div>
          <ul className="mt-1">
            {ws.goals.length === 0 && <li className="border-b border-fg/10 py-3 text-[15px] text-muted">What will you ship by Sunday? Try &ldquo;Interview 5 customers.&rdquo;</li>}
            {ws.goals.map((gl) => (
              <motion.li layout key={gl.id} className="group flex items-center gap-3 border-b border-fg/10 py-3">
                <button type="button" role="checkbox" aria-checked={gl.done} aria-label={`Mark "${gl.text}" ${gl.done ? "not done" : "done"}`}
                  onClick={() => { if (!gl.done) { haptic("success"); xpToast(XP.goal); } update((w) => ({ ...w, goals: w.goals.map((x) => (x.id === gl.id ? { ...x, done: !x.done } : x)) })); }}
                  className={cn("grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] transition", gl.done ? "pop border-fg bg-fg text-bg" : "border-fg/60 hover:border-fg")}>{gl.done && <Check size={11} strokeWidth={3} aria-hidden />}</button>
                <span className={cn("flex-1 text-[15px] transition-colors", gl.done && "text-muted line-through")}>{gl.text}</span>
                <button type="button" aria-label={`Remove "${gl.text}"`} onClick={() => update((w) => ({ ...w, goals: w.goals.filter((x) => x.id !== gl.id) }))} className="text-muted opacity-40 transition hover:text-red-600 hover:opacity-100 focus:opacity-100"><Trash2 size={14} aria-hidden /></button>
              </motion.li>
            ))}
          </ul>
          <form onSubmit={addGoal} className="flex items-center gap-3 border-b border-fg/10 py-2.5">
            <Plus size={16} className="shrink-0 text-muted" aria-hidden />
            <label htmlFor="goal" className="sr-only">New goal</label>
            <input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Add a goal" maxLength={100} className="min-w-0 flex-1 !bg-transparent py-1 text-[15px] outline-none placeholder:text-muted" />
            {goal.trim() && <button type="submit" className="text-sm font-semibold">Add</button>}
          </form>
        </motion.section>
      </div>

      {!pro && <ProBanner />}

      {/* RECOMMENDED: a clean list, not a wall of cards */}
      <motion.section variants={fadeUp} data-tour="recs" className="border-t border-fg/15 pt-4">
        <div className="pb-1"><h3 className="text-lg">{buddy.name} recommends</h3><p className="text-sm text-muted">What I&apos;d do next if I were your co-founder</p></div>
        <ul className="divide-y divide-fg/10">
          {recs.map((r) => {
            const inner = <>
              <span className="min-w-0 flex-1"><span className="text-xs font-semibold text-muted">{r.tag}</span><span className="mt-0.5 block font-semibold leading-snug">{r.title}</span><span className="mt-0.5 block text-sm text-muted">{r.why}</span></span>
              {r.external ? <ExternalLink size={16} className="shrink-0 text-muted" aria-hidden /> : <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden />}
            </>;
            const cls = "flex items-center gap-4 py-3.5 transition hover:opacity-70";
            return <li key={r.id}>{r.external ? <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a> : <Link href={r.href} className={cls}>{inner}</Link>}</li>;
          })}
        </ul>
      </motion.section>

      {/* JOURNEY */}
      <motion.section variants={fadeUp} data-tour="quests" className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div><h3 className="text-lg">Your journey</h3><p className="text-sm text-muted">4 worlds, 12 agents, 1 boss</p></div>
          <span className="rounded-full bg-fg/[0.06] px-3 py-1 text-sm font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{quests.filter((q) => q.done).length}/{quests.length}</span>
        </div>
        {[0, 1, 2, 3, 4].map((wi) => {
          const items = quests.filter((q) => q.world === wi);
          const wDone = items.every((q) => q.done || q.locked);
          return (
            <div key={wi} className="mt-5 first:mt-0">
              <div className="mb-3 flex items-baseline justify-between border-b border-fg/10 pb-2">
                <span className="text-sm font-semibold">{wi === 4 ? "Final boss" : `World ${wi + 1} · ${WORLDS[wi].name}`}</span>
                <span className="text-xs text-muted">{wi === 4 ? (pro ? "Design your deck" : "Pro") : wDone ? "Cleared" : WORLDS[wi].line}</span>
              </div>
              <ol className="space-y-2">
                {items.map((q, k) => {
                  const isCur = current?.id === q.id;
                  const Icon = q.icon;
                  const off = [0, 1, 2][k % 3];
                  qi++;
                  return (
                    <li key={q.id} className={isCur ? "pt-5" : undefined} style={{ paddingLeft: `calc(${off} * min(4rem, 8vw))` }}>
                      <Link href={q.locked ? "/app/upgrade" : q.href} className="group flex items-center gap-4 py-1">
                        <span className="relative">
                          {isCur && <span className="absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-fg px-2.5 py-0.5 text-[11px] font-semibold text-bg">START<span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-amber" /></span>}
                          <motion.span whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                            className={cn("grid place-items-center rounded-full transition-colors",
                              q.boss ? "h-[64px] w-[64px]" : "h-[52px] w-[52px]",
                              q.done ? "bg-fg text-bg" : isCur ? "pulse-ring border-2 border-fg bg-bg-2 text-fg" : "border border-fg/20 text-muted")}>
                            {q.done ? <Check size={22} strokeWidth={2.5} aria-hidden /> : q.locked ? <Lock size={18} aria-hidden /> : q.boss ? <Crown size={24} aria-hidden /> : <Icon size={20} aria-hidden />}
                          </motion.span>
                          
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 font-semibold group-hover:text-violet"><span className="text-xs text-muted">{qi}.</span>{q.name}{q.locked && <ProBadge />}</span>
                          <span className="block text-sm leading-snug text-muted">{q.stage}</span>
                          <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold", q.done ? "bg-good/15 text-good" : "bg-violet/10 text-violet")}>{q.done ? `+${q.xp} XP earned` : q.locked ? "Unlock with Pro" : `+${q.xp} XP`}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </motion.section>

      <div className="grid gap-5 lg:grid-cols-2">
        <motion.div variants={fadeUp} data-tour="playbook">
          <div className="mb-2 flex items-center justify-between px-1"><p className="kicker">Playbook of the day</p><Link href="/app/playbooks" className="flex items-center gap-1 text-xs font-semibold text-violet hover:underline">All playbooks <ArrowRight size={12} aria-hidden /></Link></div>
          <PlaybookCard p={pb} className="glass" />
        </motion.div>
        <motion.div variants={fadeUp} className="space-y-3">
          {pro && <FounderCall compact />}
          <div className="glass overflow-hidden rounded-[20px]">
            <Link href="/app/friends" className="flex items-center gap-3 px-5 py-4 transition hover:bg-fg/[0.03]"><Gift size={18} className="text-amber" aria-hidden /><span className="flex-1"><b className="block text-[15px]">Invite friends</b><span className="text-sm text-muted">+50 XP for each friend who joins</span></span><ArrowRight size={16} className="text-muted" aria-hidden /></Link>
            <Link href="/app/leaderboard" className="flex items-center gap-3 border-t border-fg/[0.06] px-5 py-4 transition hover:bg-fg/[0.03]"><Medal size={18} className="text-amber" aria-hidden /><span className="flex-1"><b className="block text-[15px]">Leaderboard</b><span className="text-sm text-muted">See where you rank</span></span><ArrowRight size={16} className="text-muted" aria-hidden /></Link>
            <Link href="/app/opportunities" className="flex items-center gap-3 border-t border-fg/[0.06] px-5 py-4 transition hover:bg-fg/[0.03]"><Trophy size={18} className="text-amber" aria-hidden /><span className="flex-1"><b className="block text-[15px]">Opportunities</b><span className="text-sm text-muted">300+ competitions, grants and programs</span></span><ArrowRight size={16} className="text-muted" aria-hidden /></Link>
          </div>
        </motion.div>
      </div>

      {/* BADGES */}
      <motion.section variants={fadeUp} data-tour="badges" className="glass rounded-[28px] p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between"><h3 className="text-lg">Trophy case</h3><span className="text-sm text-muted">{g.badges.length} of {BADGES.length} unlocked</span></div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {BADGES.map((b) => {
            const got = g.badges.includes(b.id);
            const Icon = b.icon;
            return (
              <li key={b.id} className={cn("flex flex-col items-center rounded-2xl p-3 text-center transition", got ? "border border-fg/15" : "border border-dashed border-fg/15")}>
                <motion.span whileHover={got ? { rotate: [0, -10, 10, 0] } : undefined} className={cn("relative grid h-14 w-14 place-items-center rounded-full", got ? "bg-fg text-bg" : "bg-fg/[0.07] text-muted")}>
                  <Icon size={24} aria-hidden />
                  {!got && <Lock size={14} className="absolute -bottom-0.5 -right-0.5 rounded-full bg-bg-2 p-0.5" aria-hidden />}
                </motion.span>
                <p className={cn("mt-2 text-sm font-semibold leading-tight", !got && "text-muted")}>{b.name}</p>
                <p className="text-[11px] leading-snug text-muted">{got ? "Unlocked" : b.how}</p>
              </li>
            );
          })}
        </ul>
      </motion.section>
    </motion.div>
  );
}
