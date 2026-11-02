"use client";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useEffect } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { ease } from "@/lib/motion";
import { HeroMockup } from "./HeroMockup";

const HEADLINE = ["Your", "AI", "marketing", "team.", "Working", "while", "you", "build."];

function Orbs() {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 });
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => { x.set((e.clientX / innerWidth - 0.5) * 30); y.set((e.clientY / innerHeight - 0.5) * 30); };
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, [x, y, reduce]);
  const orb = "absolute rounded-full blur-[90px] will-change-transform";
  return (
    <motion.div aria-hidden style={{ x, y }} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div className={`${orb} left-[8%] top-[6%] h-[420px] w-[420px] bg-violet/30`} animate={reduce ? {} : { x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className={`${orb} right-[4%] top-[22%] h-[380px] w-[380px] bg-cyan/25`} animate={reduce ? {} : { x: [0, -50, 0], y: [0, 60, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className={`${orb} bottom-[0%] left-[38%] h-[300px] w-[300px] bg-amber/15`} animate={reduce ? {} : { x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--line)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--line)/0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:pt-44">
      <Orbs />
      <div className="relative mx-auto grid max-w-site items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.a href="#nurture" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mb-7 inline-flex items-center gap-2 rounded-full hairline bg-bg-2/40 px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg">
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white">New</span>
            Nurture Flow is coming soon <ArrowRight size={12} aria-hidden />
          </motion.a>
          <h1 className="text-[44px] font-extrabold leading-[1.02] sm:text-6xl lg:text-[68px]">
            {HEADLINE.map((w, i) => (
              <motion.span key={i} className={`mr-[0.22em] inline-block ${i >= 4 ? "text-gradient" : ""}`} initial={{ opacity: 0.01, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.06 }}>
                {w}
              </motion.span>
            ))}
          </h1>
          {/* Visible from first paint (it is the LCP element); only slides in. */}
          <motion.p initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease, delay: 0.2 }} className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
            Six AI agents research trends, write your scripts, edit your videos and post to TikTok, Reels, Shorts and Facebook. Then they learn what works and do more of it. No agency bill.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.8 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#waitlist" className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-white shadow-[0_10px_40px_-10px_rgb(var(--violet)/0.8)] transition-shadow hover:shadow-[0_16px_50px_-10px_rgb(var(--cyan)/0.7)]">
                Join the waitlist <ArrowRight size={18} aria-hidden />
              </a>
            </Magnetic>
            <a href="#free-plan" className="inline-flex items-center gap-2 rounded-full hairline px-6 py-3.5 font-semibold transition-colors hover:bg-fg/5">
              <Play size={16} aria-hidden /> Try the free plan tool
            </a>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-6 text-sm text-muted">Free during beta · No card needed</motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease, delay: 0.4 }}>
          <HeroMockup />
        </motion.div>
      </div>
    </section>
  );
}
