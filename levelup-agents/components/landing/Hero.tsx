"use client";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useEffect } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { ease } from "@/lib/motion";
import { HeroMockup } from "./HeroMockup";

/** Deep blue glow plus the glowing curve that sweeps behind the hero. */
function Backdrop() {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 });
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => { x.set((e.clientX / innerWidth - 0.5) * 24); y.set((e.clientY / innerHeight - 0.5) * 16); };
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, [x, y, reduce]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgb(var(--violet)/0.28),transparent_70%)]" />
      <motion.svg style={{ x, y }} viewBox="0 0 1440 700" preserveAspectRatio="none" className="absolute inset-x-0 top-[12%] h-[78%] w-full">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="curve" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--violet))" stopOpacity="0" /><stop offset=".2" stopColor="rgb(var(--violet))" /><stop offset=".8" stopColor="rgb(var(--violet))" /><stop offset="1" stopColor="rgb(var(--violet))" stopOpacity="0" /></linearGradient>
        </defs>
        <motion.path d="M-40 120 C 140 140, 160 640, 380 640 S 560 360, 720 300 S 980 40, 1120 120 S 1300 560, 1480 520" fill="none" stroke="url(#curve)" strokeWidth="3" filter="url(#glow)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, ease, delay: 0.2 }} />
      </motion.svg>
      <div className="absolute inset-x-[6%] bottom-10 flex items-center">
        <span className="h-2 w-2 rounded-full bg-violet" /><span className="h-px flex-1 bg-violet/60" /><span className="h-2 w-2 rounded-full bg-violet" />
      </div>
    </div>
  );
}

const reveal = (delay: number) => ({ initial: { opacity: 0.01, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease, delay } });

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-32 sm:pt-36">
      <Backdrop />
      <div className="relative mx-auto grid max-w-site items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <div className="text-center lg:text-left">
          <motion.a href="#try" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full hairline bg-bg-2/60 px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg">
            <span className="rounded-full bg-cta px-2 py-0.5 text-[10px] font-bold uppercase">50K+</span>
            users across LevelUp products <ArrowRight size={12} aria-hidden />
          </motion.a>
          <h1 className="text-[clamp(64px,9vw,118px)] leading-[0.88]">
            <motion.span className="block" {...reveal(0.1)}>Build</motion.span>
            <motion.span className="block" {...reveal(0.18)}>your</motion.span>
            <motion.span className="block" {...reveal(0.26)}>startup</motion.span>
          </h1>
          <motion.p initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease, delay: 0.2 }} className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-muted lg:mx-0">
            Got an idea but no co-founder, mentor or money? Pick an AI co-founder, then 12 agents help you validate, build, brand, pitch, sell and raise, with playbooks from founders like Alex Hormozi and Paul Graham.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.5 }} className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Magnetic>
              <a href="/signup" className="btn-play">
                Sign up free <ArrowRight size={18} aria-hidden />
              </a>
            </Magnetic>
            <a href="#try" className="btn-glass rounded-2xl px-5 py-3.5">
              <Play size={16} aria-hidden /> Check my idea
            </a>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-5 text-sm text-muted">Built by student founders · No card needed · <a href="/app" className="underline underline-offset-2 hover:text-fg">Try as guest</a></motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease, delay: 0.3 }}>
          <HeroMockup />
        </motion.div>

        <div className="text-center lg:text-right" aria-hidden>
          <p className="font-display text-[clamp(64px,9vw,118px)] uppercase leading-[0.88]">
            <motion.span className="block" {...reveal(0.34)}>With</motion.span>
            <motion.span className="block" {...reveal(0.42)}><span className="select-box text-fg">LevelUp</span></motion.span>
            <motion.span className="block text-gradient" {...reveal(0.5)}>Co-founder</motion.span>
          </p>
        </div>
      </div>
      <span className="sr-only">Build your startup with LevelUp, your AI co-founder.</span>
    </section>
  );
}
