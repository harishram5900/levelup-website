"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/sound";

/** One action, one reaction: a small "+25 XP" chip that floats up after a meaningful action. */
export function xpToast(amount: number, label = "XP") {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("lu-xp", { detail: { amount, label } }));
}

export function XpToast() {
  const [items, setItems] = useState<{ id: number; amount: number; label: string }[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const { amount, label } = (e as CustomEvent<{ amount: number; label: string }>).detail;
      const id = Date.now() + Math.random();
      setItems((x) => [...x, { id, amount, label }].slice(-3));
      sfx("coin");
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 1400);
    };
    window.addEventListener("lu-xp", on);
    return () => window.removeEventListener("lu-xp", on);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[85] flex flex-col overflow-x-clip px-4 items-center gap-2 md:bottom-8" aria-live="polite">
      <AnimatePresence>
        {items.map((i) => (
          <motion.span key={i.id} initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="rounded-full bg-fg px-4 py-1.5 text-bg shadow-lg">
            <span className="serif text-xl">+{i.amount}</span> <span className="text-xs font-semibold opacity-75">{i.label}</span>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
