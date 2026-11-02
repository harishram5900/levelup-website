"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AGENTS } from "@/lib/agents";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

/** Floating product mockup that tilts toward the cursor. Everything shown is sample content. */
export function HeroMockup() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => { mx.set(e.clientX / innerWidth - 0.5); my.set(e.clientY / innerHeight - 0.5); };
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % AGENTS.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[560px] [perspective:1200px]" aria-label="Preview of the LevelUp dashboard with sample content" role="img">
      <motion.div style={{ rotateX: rx, rotateY: ry }} animate={reduce ? {} : { y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="glass rounded-[24px] p-4 [transform-style:preserve-3d] sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-fg/15" /><i className="h-2.5 w-2.5 rounded-full bg-fg/15" /><i className="h-2.5 w-2.5 rounded-full bg-fg/15" /></div>
          <span className="rounded-full hairline px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Sample</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {[["Views", "48.2k"], ["Posts", "21"], ["Followers", "+640"]].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-fg/[0.04] p-3"><p className="text-[11px] text-muted">{k}</p><p className="font-display text-xl font-bold">{v}</p></div>
          ))}
        </div>
        <svg viewBox="0 0 300 80" className="mt-3 h-20 w-full" aria-hidden>
          <defs><linearGradient id="hm" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--violet))" /><stop offset="1" stopColor="rgb(var(--cyan))" /></linearGradient></defs>
          <motion.path d="M0 62 C 40 58, 60 40, 95 44 S 150 22, 190 30 S 250 8, 300 12" fill="none" stroke="url(#hm)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: "easeOut", delay: 0.6 }} />
        </svg>
        <div className="mt-2 space-y-2">
          {AGENTS.slice(0, 4).map((a, i) => {
            const on = step % 4 === i;
            const Icon = a.icon;
            return (
              <motion.div key={a.id} animate={{ opacity: on ? 1 : 0.55, x: on ? 4 : 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3 rounded-xl bg-fg/[0.035] px-3 py-2.5">
                <span className={`grid h-7 w-7 place-items-center rounded-lg ${on ? "bg-accent text-white" : "bg-fg/10 text-muted"}`}><Icon size={14} aria-hidden /></span>
                <span className="flex-1 text-[13px]"><b className="font-semibold">{a.name}</b> <span className="text-muted">{["found 12 trend ideas", "wrote 3 hooks", "cut a 22s reel", "approved 4 posts"][i]}</span></span>
                {on ? <Sparkles size={14} className="text-violet" aria-hidden /> : <Check size={14} className="text-good" aria-hidden />}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      <motion.div animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="glass absolute -bottom-6 -left-4 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs sm:flex">
        <PlatformIcon name="tiktok" size={16} /> Scheduled for 6:30pm
      </motion.div>
      <motion.div animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} className="glass absolute -right-4 top-[44%] hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs sm:flex">
        <span className="h-2 w-2 rounded-full bg-good" /> Review passed
      </motion.div>
    </div>
  );
}
