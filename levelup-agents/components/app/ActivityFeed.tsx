"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { AGENTS } from "@/lib/agents";
import { ACTIVITY } from "@/lib/mock/activity";
import { ease } from "@/lib/motion";

type Item = { key: number; agent: (typeof ACTIVITY)[number]["agent"]; text: string; at: string };
const agentOf = (id: string) => AGENTS.find((a) => a.id === id)!;

/** Cycles sample activity so the feed feels live. */
export function ActivityFeed() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<Item[]>(() => ACTIVITY.slice(0, 5).map((a, i) => ({ ...a, key: i, at: `${(i + 1) * 6} min ago` })));
  useEffect(() => {
    if (reduce) return;
    let n = 5;
    const t = setInterval(() => {
      const next = ACTIVITY[n % ACTIVITY.length];
      setItems((cur) => [{ ...next, key: n, at: "just now" }, ...cur.map((c, i) => ({ ...c, at: i === 0 && c.at === "just now" ? "1 min ago" : c.at }))].slice(0, 6));
      n++;
    }, 3500);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <ul className="space-y-2" aria-live="polite" aria-label="Agent activity">
      <AnimatePresence initial={false}>
        {items.map((it) => {
          const a = agentOf(it.agent);
          const Icon = a.icon;
          return (
            <motion.li key={it.key} layout initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }}
              className="flex items-start gap-3 rounded-xl bg-fg/[0.035] p-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-white"><Icon size={15} aria-hidden /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm"><b className="font-semibold">{a.name}</b> <span className="text-muted">{it.text}</span></p>
                <p className="mt-0.5 text-xs text-muted">{it.at}</p>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
