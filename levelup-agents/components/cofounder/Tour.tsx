"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useWorkspace } from "@/lib/cofounder/profile";
import { Buddy, characterById } from "./Pip";

type Step = { target?: string; fallback?: string; title: string; body: string };

const STEPS: Step[] = [
  { title: "Welcome to your HQ!", body: "I'll show you around in about a minute. Use Next, or press the arrow keys. You can skip anytime and replay it from Settings." },
  { target: "hero", title: "Your Startup HQ", body: "This is home base: your startup, your level and your XP. Every agent you finish, goal you hit and day you show up earns XP." },
  { target: "stats", title: "Your scoreboard", body: "Total XP, your daily streak (come back every day to keep it 🔥), badges unlocked and quests cleared." },
  { target: "recs", title: "My recommendations", body: "This is me being your co-founder: the next moves I'd make, based on where your startup is right now. They update as you go." },
  { target: "quests", title: "The quest map", body: "12 agents across 4 worlds, from Idea Island to Launch Galaxy. Each one asks a few questions and hands you a ready-to-use plan. The pitch deck is the final boss." },
  { target: "today", title: "Today's quest", body: "Not sure what to do? Just hit Play. This always points to your next unfinished step." },
  { target: "goals", title: "Weekly goals", body: "Set what you'll ship by Sunday and tick it off. Each goal done is +25 XP. Founders who set weekly goals move faster." },
  { target: "playbook", title: "Playbook of the day", body: "A framework from founders like Alex Hormozi, Bill Gates and Paul Graham, with one thing to do today. The source is on every card." },
  { target: "badges", title: "Trophy case", body: "16 badges to unlock. Locked ones tell you exactly how to earn them." },
  { target: "nav-agents", fallback: "open-menu", title: "Your agents", body: "Every agent lives in the sidebar, grouped by world. Open any one anytime: you don't have to go in order." },
  { target: "nav-deck", fallback: "open-menu", title: "Pitch deck designer (Pro)", body: "Pick a layout, colors, font and logo, add your own photos, and I'll build a 10-slide deck from your answers. Present it full screen or download a PDF." },
  { target: "nav-playbooks", fallback: "open-menu", title: "Playbooks", body: "All the frameworks from top entrepreneurs and investors in one place." },
  { target: "nav-opps", fallback: "open-menu", title: "Opportunities", body: "60 competitions, programs, grants, free credits, accelerators and investors. Filter by age and type, and save your favorites." },
  { target: "nav-pro", fallback: "open-menu", title: "Go Pro", body: "Items with a PRO tag (the deck designer, Offer, Sales and Investor agents, and the investor list) unlock with LevelUp Pro. Everything else is free." },
  { target: "nav-settings", fallback: "open-menu", title: "Settings", body: "Switch your co-founder character, change your dashboard colors, manage your account, or replay this tour." },
  { target: "top-stats", title: "Always on top", body: "Your level, XP and streak follow you on every page. That's it. Let's build something!" },
];

function visibleRect(sel?: string) {
  if (!sel) return null;
  const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${sel}"]`));
  for (const el of els) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) return { el, r }; }
  return null;
}

/** First-run guided tour of the dashboard, narrated by the founder's chosen character. */
export function Tour() {
  const { ws, ready, update } = useWorkspace();
  const path = usePathname();
  const router = useRouter();
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const active = ready && !!ws.profile && !ws.prefs.tourDone && path === "/app";
  const step = STEPS[i];
  const buddy = characterById(ws.prefs.character);

  const finish = useCallback(() => { update((w) => ({ ...w, prefs: { ...w.prefs, tourDone: true } })); setI(0); }, [update]);

  const measure = useCallback(() => {
    const hit = visibleRect(step?.target) ?? visibleRect(step?.fallback);
    setRect(hit ? hit.el.getBoundingClientRect() : null);
  }, [step]);

  useLayoutEffect(() => {
    if (!active) return;
    const hit = visibleRect(step?.target) ?? visibleRect(step?.fallback);
    if (hit) {
      const r = hit.r;
      if (r.top < 70 || r.bottom > innerHeight - 20) hit.el.scrollIntoView({ block: r.height > innerHeight * 0.6 ? "start" : "center", behavior: "smooth" });
    }
    measure();
    const t = setTimeout(measure, 450);
    addEventListener("resize", measure); addEventListener("scroll", measure, true);
    return () => { clearTimeout(t); removeEventListener("resize", measure); removeEventListener("scroll", measure, true); };
  }, [active, i, measure, step]);

  useEffect(() => {
    if (!active) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight") setI((x) => Math.min(STEPS.length - 1, x + 1));
      if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1));
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [active, finish]);

  if (!active || !step) return null;
  const pad = 8;
  const last = i === STEPS.length - 1;
  const mobile = typeof window !== "undefined" && innerWidth < 640;
  // Place the card below the target, or above it if there's no room, clamped to the screen.
  let cardStyle: React.CSSProperties = { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
  if (rect && !mobile) {
    const below = rect.bottom + 16 + 260 < innerHeight;
    const left = Math.min(Math.max(16, rect.left), innerWidth - 400);
    cardStyle = below ? { left, top: Math.min(rect.bottom + 16, innerHeight - 280) } : { left, top: Math.max(16, rect.top - 16 - 250) };
    if (rect.height > innerHeight * 0.6) cardStyle = { left: Math.min(Math.max(16, rect.right - 400), innerWidth - 400), top: innerHeight - 290 };
  } else if (mobile) cardStyle = { left: 12, right: 12, bottom: 12 };

  return (
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label={`Tutorial step ${i + 1} of ${STEPS.length}: ${step.title}`}>
      {/* dim everything except the spotlight */}
      {rect ? (
        <motion.div className="pointer-events-none absolute rounded-2xl ring-2 ring-amber" initial={false}
          animate={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}
          style={{ boxShadow: "0 0 0 9999px rgba(5,6,12,.72)" }} />
      ) : <div className="absolute inset-0 bg-[rgba(5,6,12,.72)]" />}
      <div className="absolute inset-0" onClick={() => setI((x) => Math.min(STEPS.length - 1, x + 1))} aria-hidden />
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="absolute w-auto rounded-3xl bg-bg-2 p-5 shadow-2xl ring-1 ring-fg/10 sm:w-[384px]" style={cardStyle}>
          <div className="flex items-start gap-3">
            <Buddy character={ws.prefs.character} mood={last ? "cheer" : i === 0 ? "wave" : "happy"} size={64} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber">{buddy.name} · {i + 1} of {STEPS.length}</p>
              <p className="mt-1 font-display text-2xl uppercase leading-none">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
            <button type="button" onClick={finish} aria-label="Skip tutorial" className="text-muted hover:text-fg"><X size={16} aria-hidden /></button>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-fg/10"><div className="h-full rounded-full bg-amber transition-all" style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} /></div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button type="button" onClick={finish} className="text-sm text-muted hover:text-fg">Skip tour</button>
            <div className="flex gap-2">
              {i > 0 && <button type="button" onClick={() => setI(i - 1)} className="btn-icon" aria-label="Previous step"><ArrowLeft size={15} aria-hidden /></button>}
              {last
                ? <button type="button" onClick={() => { finish(); router.push("/app/agents/idea"); }} className="btn-play px-4 py-2 text-sm">Start my first quest <ArrowRight size={15} aria-hidden /></button>
                : <button type="button" onClick={() => setI(i + 1)} className="btn-play px-4 py-2 text-sm">Next <ArrowRight size={15} aria-hidden /></button>}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
