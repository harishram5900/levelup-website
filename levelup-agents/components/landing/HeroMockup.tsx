"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AGENTS } from "@/lib/agents";

/** Phone mockup of the LevelUp app that tilts toward the cursor. Everything shown is sample content. */
export function HeroMockup() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 18 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => { mx.set(e.clientX / innerWidth - 0.5); my.set(e.clientY / innerHeight - 0.5); };
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 1400);
    return () => clearInterval(t);
  }, []);

  const tracks = [
    { w: "100%", l: "0%", c: "bg-good/80", label: "Idea ✓" },
    { w: "100%", l: "0%", c: "bg-good/80", label: "Customers ✓" },
    { w: "55%", l: "0%", c: "bg-amber/80", label: "Build" },
  ];

  return (
    <div className="relative mx-auto w-[270px] [perspective:1200px] sm:w-[290px]" role="img" aria-label="Preview of the LevelUp app on a phone, with sample content">
      <motion.div style={{ rotateX: rx, rotateY: ry }} animate={reduce ? {} : { y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-[42px] border border-white/10 bg-[#101119] p-2.5 shadow-[0_40px_100px_-30px_rgb(var(--violet)/0.55)] [transform-style:preserve-3d]">
        <div className="overflow-hidden rounded-[34px] bg-[#16171f] text-white">
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[11px] font-semibold">
            <span>9:41</span><span className="h-5 w-20 rounded-full bg-black" /><span className="opacity-70">5G</span>
          </div>
          {/* Today's post card */}
          <div className="mx-3 mt-2 rounded-2xl bg-cta p-3.5">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-black/70">
              <span>Your one-liner</span><span className="rounded-full bg-black/15 px-2 py-0.5">Sample</span>
            </div>
            <p className="mt-2 font-display text-[22px] leading-[1.02] text-black">“StudyBuddy matches students with study partners.”</p>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-black/70"><Sparkles size={11} aria-hidden /> Written by Pitch agent</div>
          </div>
          {/* Editing timeline */}
          <div className="mx-3 mt-3 rounded-2xl bg-white/[0.05] p-3">
            <div className="mb-2 flex items-center justify-between text-[10px] text-white/60"><span>Your journey</span><span>2 of 6 done</span></div>
            <div className="relative space-y-1.5">
              {tracks.map((t, i) => (
                <div key={t.label} className="relative h-4 rounded bg-white/[0.04]">
                  <motion.div className={`absolute top-0 h-4 rounded ${t.c} px-1.5 text-[8px] font-semibold leading-4 text-white`} style={{ left: t.l }}
                    initial={{ width: 0 }} animate={{ width: t.w }} transition={{ duration: 1, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}>{t.label}</motion.div>
                </div>
              ))}
            </div>
          </div>
          {/* Agent status */}
          <div className="mx-3 mb-4 mt-3 space-y-1.5">
            {AGENTS.slice(2, 6).map((a, i) => {
              const on = step === i;
              const Icon = a.icon;
              return (
                <motion.div key={a.id} animate={{ opacity: on ? 1 : 0.55 }} className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-2.5 py-2 text-[11px]">
                  <span className={`grid h-6 w-6 place-items-center rounded-lg ${on ? "bg-violet" : "bg-white/10"}`}><Icon size={12} aria-hidden /></span>
                  <span className="flex-1"><b className="font-semibold">{a.name}</b> <span className="text-white/55">{["planning your MVP", "pitch is next", "pricing math ready", "launch plan ready"][i]}</span></span>
                  {on ? <Sparkles size={12} className="text-amber" aria-hidden /> : <Check size={12} className="text-good" aria-hidden />}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
      <motion.div animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute -left-20 top-[3%] hidden items-center gap-2 rounded-2xl border border-white/10 bg-[#21232E]/90 px-3.5 py-2.5 text-xs text-white backdrop-blur lg:flex">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-cta text-black"><Check size={13} aria-hidden /></span> This week: talk to 5 customers
      </motion.div>
      <motion.div animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute -right-20 bottom-24 hidden items-center gap-1.5 rounded-2xl border border-white/10 bg-[#21232E]/90 px-3 py-2.5 backdrop-blur lg:flex" aria-hidden>
        {["bg-violet", "bg-cta", "bg-good", "bg-white", "bg-violet/50", "bg-amber/60"].map((c) => <span key={c} className={`h-3 w-3 rounded-full ${c}`} />)}
      </motion.div>
    </div>
  );
}
