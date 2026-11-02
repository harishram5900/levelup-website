"use client";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AGENTS } from "@/lib/agents";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CAPTIONS = [
  "Finds what's trending in your niche today",
  "Writes hooks and scripts in your voice",
  "Edits clips with captions for each platform",
  "Checks tone, facts and brand rules",
  "Posts when your audience is online",
  "Learns from results, updates the plan",
];

/** One agent node. Lights up when it's the active step. */
export function AgentNode({ index, active }: { index: number; active: boolean }) {
  const a = AGENTS[index];
  const Icon = a.icon;
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        animate={{ scale: active ? 1.08 : 1 }}
        transition={{ duration: 0.4, ease }}
        className={cn("relative grid h-16 w-16 place-items-center rounded-2xl transition-colors duration-500", active ? "bg-accent text-white" : "glass text-muted")}
      >
        {active && <motion.span layoutId="node-glow" className="absolute -inset-3 -z-10 rounded-3xl bg-violet/30 blur-xl" transition={{ duration: 0.5, ease }} />}
        <Icon size={24} aria-hidden />
      </motion.div>
      <p className={cn("mt-4 font-display text-lg font-bold transition-colors", active ? "text-fg" : "text-muted")}>{a.name}</p>
      <p className="mt-1 max-w-[150px] text-sm text-muted">{CAPTIONS[index]}</p>
    </div>
  );
}

export function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % AGENTS.length), 1500);
    return () => clearInterval(t);
  }, [inView, reduce]);

  const xs = AGENTS.map((_, i) => 100 + i * 200);

  return (
    <div ref={ref} className="relative">
      {/* Desktop: horizontal flow with a glowing dot traveling between nodes */}
      <div className="relative hidden lg:block">
        <svg viewBox="0 0 1200 64" className="absolute inset-x-0 top-0 h-16 w-full" preserveAspectRatio="none" aria-hidden>
          <defs><linearGradient id="pl" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--violet))" /><stop offset="1" stopColor="rgb(var(--cyan))" /></linearGradient></defs>
          <path d="M100 32 H1100" stroke="rgb(var(--line) / 0.1)" strokeWidth="2" strokeDasharray="4 8" />
          <motion.path d="M100 32 H1100" stroke="url(#pl)" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.6, ease }} />
          {!reduce && <motion.circle r="6" cy="32" fill="rgb(var(--cyan))" animate={{ cx: xs[active] }} transition={{ duration: 0.9, ease }} style={{ filter: "drop-shadow(0 0 8px rgb(var(--cyan)))" }} />}
        </svg>
        <div className="relative grid grid-cols-6">
          {AGENTS.map((_, i) => <AgentNode key={i} index={i} active={i === active} />)}
        </div>
      </div>
      {/* Mobile / tablet: vertical flow */}
      <ol className="relative mx-auto max-w-sm space-y-8 lg:hidden">
        <span aria-hidden className="absolute left-8 top-8 h-[calc(100%-4rem)] w-px bg-gradient-to-b from-violet via-cyan to-transparent" />
        {AGENTS.map((a, i) => {
          const Icon = a.icon;
          const on = i === active;
          return (
            <li key={a.id} className="relative flex items-center gap-5">
              <span className={cn("relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-2xl transition-colors duration-500", on ? "bg-accent text-white" : "glass text-muted")}><Icon size={22} aria-hidden /></span>
              <div><p className="font-display text-lg font-bold">{a.name}</p><p className="text-sm text-muted">{CAPTIONS[i]}</p></div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
