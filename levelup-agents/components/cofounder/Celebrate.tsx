"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BADGES, gameStats } from "@/lib/cofounder/game";
import { today, useWorkspace } from "@/lib/cofounder/profile";
import { usePlan } from "@/lib/cofounder/plan";
import { Buddy } from "./Pip";
import { haptic } from "@/lib/native";

const COLORS = ["#105BFF", "#FE8500", "#4D8DFF", "#FFD08A", "#34D399"];

export function Confetti({ n = 70 }: { n?: number }) {
  const bits = useMemo(() => Array.from({ length: n }, (_, i) => ({
    x: (Math.random() - 0.5) * 900, y: 300 + Math.random() * 400, r: Math.random() * 720 - 360,
    d: 1.4 + Math.random() * 1.2, delay: Math.random() * 0.25, c: COLORS[i % COLORS.length], w: 6 + Math.random() * 6, round: i % 3 === 0,
  })), [n]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden>
      {bits.map((b, i) => (
        <motion.span key={i} className="absolute left-1/2 top-1/3" style={{ width: b.w, height: b.round ? b.w : b.w * 0.45, background: b.c, borderRadius: b.round ? 999 : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: b.x, y: [0, -260 - Math.random() * 120, b.y], opacity: [1, 1, 0], rotate: b.r }}
          transition={{ duration: b.d, delay: b.delay, ease: "easeOut" }} />
      ))}
    </div>
  );
}

type Moment = { kind: "level" | "badge"; title: string; sub: string };

/** Watches progress and throws a party for new levels and badges. */
export function Celebrator() {
  const { ws, ready, update } = useWorkspace();
  const reduce = useReducedMotion();
  const [moment, setMoment] = useState<Moment | null>(null);
  const { bonusXp, ready: planReady } = usePlan();

  useEffect(() => {
    if (!ready || !planReady || !ws.profile || moment) return;
    const g = gameStats(ws, today(), bonusXp);
    const newBadge = g.badges.find((b) => !ws.seen.badges.includes(b));
    if (g.level > ws.seen.level) {
      setMoment({ kind: "level", title: `Level ${g.level}: ${g.title}`, sub: g.next ? `${g.toNext} XP to ${g.next.title}. Keep going!` : "You've maxed out. Legend status." });
      update((w) => ({ ...w, seen: { ...w.seen, level: g.level } }));
    } else if (newBadge) {
      const b = BADGES.find((x) => x.id === newBadge)!;
      setMoment({ kind: "badge", title: `Badge unlocked: ${b.name}`, sub: b.how });
      update((w) => ({ ...w, seen: { ...w.seen, badges: [...w.seen.badges, newBadge] } }));
    } else if (g.level < ws.seen.level) {
      update((w) => ({ ...w, seen: { ...w.seen, level: g.level } })); // after a reset
    }
  }, [ws, ready, planReady, bonusXp, moment, update]);

  useEffect(() => {
    if (!moment) return;
    haptic("success");
    const t = setTimeout(() => setMoment(null), 4200);
    return () => clearTimeout(t);
  }, [moment]);

  return (
    <AnimatePresence>
      {moment && (
        <>
          {!reduce && <Confetti key={moment.title} />}
          <motion.div role="status" initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-[90] flex md:bottom-5 w-[min(92vw,440px)] -translate-x-1/2 items-center gap-3 rounded-3xl bg-bg-2 p-4 pr-10 shadow-2xl ring-2 ring-amber/60">
            <Buddy character={ws.prefs.character} mood="cheer" size={64} />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-amber">{moment.kind === "level" ? "Level up!" : "New badge"}</p>
              <p className="font-display text-2xl uppercase leading-tight">{moment.title}</p>
              <p className="text-sm text-muted">{moment.sub}</p>
            </div>
            <button type="button" onClick={() => setMoment(null)} aria-label="Close" className="absolute right-3 top-3 text-muted hover:text-fg"><X size={16} aria-hidden /></button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
