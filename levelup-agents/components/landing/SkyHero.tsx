"use client";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Buddy, type CharacterId } from "@/components/cofounder/Pip";
import { CountUp } from "@/components/ui/CountUp";
import { LogoMark } from "@/components/ui/Logo";
import { ease } from "@/lib/motion";
import { TRACTION } from "@/lib/traction";
import { cn } from "@/lib/utils";

/** Sky Blue / Cloudy White / Amber Red landing hero. */
const LINKS = [
  { href: "#how", label: "Agents" },
  { href: "#characters", label: "Characters" },
  { href: "#try", label: "Try it" },
  { href: "#pricing", label: "Pro" },
  { href: "#faq", label: "FAQ" },
];

type Tile = { kind: "char"; id: CharacterId; tag: string; shape: "rect" | "pill"; bg: string } | { kind: "app"; tag: string; shape: "rect" };
const TILES: Tile[] = [
  { kind: "char", id: "blaze", tag: "Blaze · Hype coach", shape: "rect", bg: "linear-gradient(160deg,#FFB15C,#FF5A1F)" },
  { kind: "char", id: "sage", tag: "Sage · Strategist", shape: "pill", bg: "linear-gradient(160deg,#C4B5FD,#7C5CFF)" },
  { kind: "app", tag: "Your Startup HQ", shape: "rect" },
  { kind: "char", id: "nova", tag: "Nova · Explorer", shape: "pill", bg: "linear-gradient(160deg,#99F6E4,#0EA5A4)" },
];
const STEPS = ["Idea", "Customers", "Build", "Brand", "Pitch", "Money", "Sales", "Launch", "Raise"];

/** One headline line: words rise out of a mask, one after another. */
function Line({ words, delay, reduce }: { words: string[]; delay: number; reduce: boolean | null }) {
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      {words.map((w, i) => (
        <motion.span key={i} className="mr-[0.22em] inline-block last:mr-0"
          initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, ease, delay: delay + i * 0.07 }}>{w}</motion.span>
      ))}
    </span>
  );
}

function TileCard({ t, i, progress, reduce }: { t: Tile; i: number; progress: MotionValue<number>; reduce: boolean | null }) {
  // Each tile drifts at its own speed while you scroll.
  const y = useTransform(progress, [0, 1], [0, reduce ? 0 : [-40, -90, -55, -110][i]]);
  const [hover, setHover] = useState(false);
  return (
    <motion.div style={{ y }} initial={reduce ? undefined : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease, delay: 0.55 + i * 0.09 }}>
      <motion.div onHoverStart={() => setHover(true)} onHoverEnd={() => setHover(false)} whileHover={reduce ? undefined : { y: -10, rotate: i % 2 ? 1.5 : -1.5 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={cn("relative h-[210px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,40,100,.55)] sm:h-[300px] lg:h-[340px]", t.shape === "pill" ? "rounded-full" : "rounded-[20px]", t.kind === "app" && "bg-[#14151D]")}
        style={t.kind === "char" ? { background: t.bg } : undefined}>
        <span className={cn("absolute top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-[#111] sm:top-4 sm:text-xs", t.shape === "pill" ? "left-1/2 -translate-x-1/2 whitespace-nowrap" : "left-3 sm:left-4")}>{t.tag}</span>
        {t.kind === "char" ? (
          <div className="absolute inset-x-0 bottom-3 flex justify-center sm:bottom-5">
            <Buddy character={t.id} mood={hover ? "cheer" : "happy"} size={150} className="h-auto w-[62%] max-w-[190px] text-black drop-shadow-[0_18px_20px_rgba(0,0,0,.25)]" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img src="/landing/app-hq.jpg" alt="The LevelUp Startup HQ dashboard" width={1200} height={750} loading="eager" animate={{ scale: hover ? 1.06 : 1 }} transition={{ duration: 0.6, ease }} className="h-full w-full origin-top-left object-cover object-left-top" />
        )}
      </motion.div>
    </motion.div>
  );
}

export function SkyHero() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));
  const skyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const stats = TRACTION.filter((t) => t.value !== null);
  const fade = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: d } });

  return (
    <header className="relative overflow-x-clip">
      {/* Nav: transparent over the sky, a clean white bar once you scroll */}
      <div className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "bg-white/90 text-[#111] shadow-[0_8px_30px_-20px_rgba(0,40,100,.45)] backdrop-blur-xl" : "text-white")}>
        <nav aria-label="Main" className={cn("mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-10", scrolled ? "py-3" : "py-5")}>
          <Link href="/" className="flex items-center gap-2.5" aria-label="LevelUp home">
            <LogoMark size={30} className={cn("transition-colors", scrolled ? "" : "[&_path]:fill-[#0099FF] [&_rect]:fill-white")} />
            <span className="font-['Anton'] text-[28px] leading-none tracking-wide">LEVELUP</span>
          </Link>
          <ul className="hidden items-center gap-6 text-[12px] font-bold tracking-[0.1em] md:flex">
            {LINKS.map((l) => (
              <li key={l.href}><a href={l.href} className="group relative py-1 opacity-90 transition hover:opacity-100">({l.label.toUpperCase()})<span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" /></a></li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Link href="/signin" className="hidden px-3 py-2 text-[12px] font-bold tracking-[0.08em] opacity-90 hover:opacity-100 sm:block">SIGN IN</Link>
            <Link href="/signup" className={cn("rounded-md px-4 py-3 text-[12px] font-extrabold tracking-[0.08em] transition hover:-translate-y-0.5", scrolled ? "bg-[#FF3B1F] text-white" : "bg-white text-[#111]")}>START BUILDING</Link>
            <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className={cn("grid h-10 w-10 place-items-center rounded-md md:hidden", scrolled ? "bg-black/5" : "bg-white/15")}>{open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}</button>
          </div>
        </nav>
        {open && (
          <div className="mx-5 mb-3 rounded-2xl bg-white p-2 text-[#111] shadow-xl md:hidden">
            {[...LINKS, { href: "/signin", label: "Sign in" }, { href: "/app", label: "Try as guest" }].map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-black/5">{l.label}</a>)}
          </div>
        )}
      </div>

      <div ref={ref} className="relative overflow-hidden px-5 pt-28 text-white sm:px-10 sm:pt-32" style={{ background: "linear-gradient(180deg,#0089F0 0%,#1AA3FF 42%,#8ED2FF 74%,#DDF1FF 92%,rgb(var(--bg)) 100%)" }}>
        {/* Drifting clouds */}
        <motion.div aria-hidden style={{ y: skyY }} className="pointer-events-none absolute inset-0">
          {[{ top: "14%", w: 340, d: 70, delay: -10, o: 0.35 }, { top: "38%", w: 260, d: 90, delay: -50, o: 0.25 }, { top: "58%", w: 420, d: 110, delay: -30, o: 0.3 }, { top: "8%", w: 200, d: 60, delay: -35, o: 0.22 }].map((c, i) => (
            <span key={i} className="cloud absolute left-0 block rounded-full bg-white blur-2xl" style={{ top: c.top, width: c.w, height: c.w * 0.32, opacity: c.o, animation: `drift ${c.d}s linear ${c.delay}s infinite` }} />
          ))}
        </motion.div>

        {/* Headline */}
        <div className="relative z-10 mx-auto max-w-[1320px] text-center">
          <motion.p {...fade(0)} className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] ring-1 ring-white/30 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B1F]" /> 50K+ USERS ACROSS LEVELUP PRODUCTS
          </motion.p>
          <h1 className="mt-6 font-['Anton'] text-[clamp(56px,10vw,156px)] uppercase leading-[0.9] tracking-[0.005em] text-white [text-shadow:0_6px_30px_rgba(0,60,140,.22)]">
            <Line words={["We", "build", "founders,"]} delay={0.1} reduce={reduce} />
            <Line words={["not", "just", "ideas"]} delay={0.32} reduce={reduce} />
          </h1>
          <motion.p {...fade(0.6)} className="mx-auto mt-6 max-w-[580px] text-[15px] font-semibold leading-relaxed text-white/95 sm:text-lg">
            From your first idea to your first customers: 12 AI agents and a co-founder that remembers everything help you build a real startup.
          </motion.p>
          <motion.div {...fade(0.72)} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="group inline-flex items-center gap-2 rounded-lg bg-[#D92D10] px-8 py-4 text-sm font-extrabold tracking-[0.08em] text-white shadow-[0_14px_30px_-12px_rgba(255,59,31,.8)] transition hover:-translate-y-0.5 hover:brightness-110">
              START BUILDING FREE <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <a href="#try" className="rounded-lg border border-white/70 bg-white/15 px-7 py-[15px] text-sm font-extrabold tracking-[0.08em] backdrop-blur transition hover:bg-white hover:text-[#0089F0]">CHECK MY IDEA</a>
          </motion.div>
          <motion.p {...fade(0.8)} className="mt-4 text-xs font-semibold text-white/80">Free for student founders · No card needed · <Link href="/app" className="underline underline-offset-2">Try as guest</Link></motion.p>
        </div>

        {/* Tiles */}
        <div className="relative z-10 mx-auto mt-14 grid max-w-[1320px] translate-y-16 grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {TILES.map((t, i) => <TileCard key={t.tag} t={t} i={i} progress={scrollYProgress} reduce={reduce} />)}
        </div>
      </div>

      {/* Ticker band */}
      <div role="marquee" className="relative z-20 mt-20 -rotate-[1.5deg] overflow-hidden bg-[#D92D10] py-3 text-white shadow-[0_20px_40px_-25px_rgba(255,59,31,.9)] sm:mt-24" aria-label="LevelUp steps: idea, customers, build, brand, pitch, money, sales, launch, raise">
        <div className="ticker-track flex w-max" style={{ animation: "ticker 32s linear infinite" }} aria-hidden>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {STEPS.map((s) => <span key={s} className="flex items-center font-['Anton'] text-[28px] uppercase tracking-[0.02em] sm:text-[40px]"><span className="px-6">{s}</span><ArrowRight size={26} strokeWidth={2.5} className="opacity-70" /></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-center gap-6 px-5 pb-6 pt-16 sm:flex-row sm:gap-20">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <CountUp to={s.value!} suffix={s.suffix} className="font-['Anton'] text-[60px] leading-none text-[#0072CC]" />
              <p className="mt-2 text-[12px] font-extrabold uppercase tracking-[0.06em] text-muted">{s.label}</p>
            </div>
          ))}
          <div className="text-center"><span className="font-['Anton'] text-[60px] leading-none text-[#0072CC]">12</span><p className="mt-2 text-[12px] font-extrabold uppercase tracking-[0.06em] text-muted">AI co-founder agents</p></div>
        </div>
      )}
    </header>
  );
}
