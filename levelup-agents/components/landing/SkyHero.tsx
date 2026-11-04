"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Buddy, type CharacterId } from "@/components/cofounder/Pip";
import { CountUp } from "@/components/ui/CountUp";
import { LogoMark } from "@/components/ui/Logo";
import { ease } from "@/lib/motion";
import { TRACTION } from "@/lib/traction";
import { cn } from "@/lib/utils";

/** Sky Blue / Cloudy White / Amber Red landing hero (option B). */
const LINKS = [
  { href: "#how", label: "Agents" },
  { href: "#characters", label: "Characters" },
  { href: "#try", label: "Try it" },
  { href: "#pricing", label: "Pro" },
  { href: "#faq", label: "FAQ" },
];

const TILES: ({ kind: "char"; id: CharacterId; tag: string; shape: "rect" | "pill"; bg: string } | { kind: "app"; tag: string; shape: "rect" })[] = [
  { kind: "char", id: "blaze", tag: "Blaze · Hype coach", shape: "rect", bg: "linear-gradient(160deg,#FFB15C,#FF5A1F)" },
  { kind: "char", id: "sage", tag: "Sage · Strategist", shape: "pill", bg: "linear-gradient(160deg,#C4B5FD,#7C5CFF)" },
  { kind: "app", tag: "Your Startup HQ", shape: "rect" },
  { kind: "char", id: "nova", tag: "Nova · Explorer", shape: "pill", bg: "linear-gradient(160deg,#99F6E4,#0EA5A4)" },
];

export function SkyHero() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const stats = TRACTION.filter((t) => t.value !== null);
  const up = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: d } });

  return (
    <header className="relative">
      <div className="relative overflow-hidden px-5 pb-0 pt-5 text-white sm:px-10" style={{ background: "linear-gradient(180deg,#0089F0 0%,#1AA3FF 42%,#8ED2FF 74%,#DDF1FF 92%,rgb(var(--bg)) 100%)" }}>
        {/* Nav */}
        <nav aria-label="Main" className="relative z-20 mx-auto flex max-w-[1320px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="LevelUp home">
            <LogoMark size={30} className="[&_rect]:fill-white [&_path]:fill-[#0099FF]" />
            <span className="font-display text-[34px] leading-none tracking-wide">LEVELUP</span>
          </Link>
          <ul className="hidden items-center gap-6 text-[12px] font-bold tracking-[0.1em] md:flex">
            {LINKS.map((l) => <li key={l.href}><a href={l.href} className="opacity-90 transition hover:opacity-100">({l.label.toUpperCase()})</a></li>)}
          </ul>
          <div className="flex items-center gap-2">
            <Link href="/signin" className="hidden px-3 py-2 text-[12px] font-bold tracking-[0.08em] opacity-90 hover:opacity-100 sm:block">SIGN IN</Link>
            <Link href="/signup" className="rounded-md bg-white px-4 py-3 text-[12px] font-extrabold tracking-[0.08em] text-[#111] transition hover:-translate-y-0.5">START BUILDING</Link>
            <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-md bg-white/15 md:hidden">{open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}</button>
          </div>
        </nav>
        {open && (
          <div className="relative z-20 mx-auto mt-3 max-w-[1320px] rounded-2xl bg-white p-2 text-[#111] shadow-xl md:hidden">
            {[...LINKS, { href: "/signin", label: "Sign in" }, { href: "/app", label: "Try as guest" }].map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-black/5">{l.label}</a>)}
          </div>
        )}

        {/* Headline */}
        <div className="relative z-10 mx-auto max-w-[1320px] text-center">
          <motion.h1 {...up(0.05)} className="mt-14 font-display text-[clamp(60px,10.5vw,160px)] leading-[0.86] tracking-wide text-white [text-shadow:0_6px_30px_rgba(0,60,140,.25)] sm:mt-16">
            WE BUILD FOUNDERS,<br />NOT JUST IDEAS
          </motion.h1>
          <motion.p {...up(0.15)} className="mx-auto mt-6 max-w-[580px] text-[15px] font-semibold leading-relaxed text-white/95 sm:text-lg">
            From your first idea to your first customers: 12 AI agents and a co-founder that remembers everything help you build a real startup.
          </motion.p>
          <motion.div {...up(0.25)} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="rounded-lg bg-[#FF3B1F] px-8 py-4 text-sm font-extrabold tracking-[0.08em] text-white shadow-[0_14px_30px_-12px_rgba(255,59,31,.8)] transition hover:-translate-y-0.5 hover:brightness-110">START BUILDING FREE</Link>
            <a href="#try" className="rounded-lg border border-white/70 bg-white/15 px-7 py-[15px] text-sm font-extrabold tracking-[0.08em] backdrop-blur transition hover:bg-white/25">CHECK MY IDEA</a>
          </motion.div>
          <motion.p {...up(0.32)} className="mt-4 text-xs font-semibold text-white/80">Free for student founders · No card needed · <Link href="/app" className="underline underline-offset-2">Try as guest</Link></motion.p>
        </div>

        {/* Tiles */}
        <div className="relative z-10 mx-auto mt-12 grid max-w-[1320px] translate-y-16 grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {TILES.map((t, i) => (
            <motion.div key={t.tag} initial={reduce ? undefined : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.35 + i * 0.08 }}
              className={cn("relative h-[200px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,40,100,.55)] sm:h-[300px] lg:h-[330px]", t.shape === "pill" ? "rounded-full" : "rounded-[18px]", t.kind === "app" ? "bg-[#14151D]" : "")}
              style={t.kind === "char" ? { background: t.bg } : undefined}>
              <span className={cn("absolute top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-[#111] sm:top-4 sm:text-xs", t.shape === "pill" ? "left-1/2 -translate-x-1/2 whitespace-nowrap" : "left-3 sm:left-4")}>{t.tag}</span>
              {t.kind === "char" ? (
                <div className="absolute inset-x-0 bottom-3 flex justify-center sm:bottom-5"><Buddy character={t.id} mood={i === 0 ? "cheer" : "wave"} size={150} className="h-auto w-[62%] max-w-[190px] text-black drop-shadow-[0_18px_20px_rgba(0,0,0,.25)]" /></div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/landing/app-hq.jpg" alt="The LevelUp Startup HQ dashboard" width={1200} height={750} loading="eager" className="h-full w-full object-cover object-left-top" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-center gap-6 px-5 pb-6 pt-28 sm:flex-row sm:gap-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <CountUp to={s.value!} suffix={s.suffix} className="font-display text-[56px] leading-none text-[#0099FF]" />
              <p className="mt-1 text-[12px] font-extrabold uppercase tracking-[0.06em] text-muted">{s.label}</p>
            </div>
          ))}
          <div className="text-center"><span className="font-display text-[56px] leading-none text-[#0099FF]">12</span><p className="mt-1 text-[12px] font-extrabold uppercase tracking-[0.06em] text-muted">AI co-founder agents</p></div>
        </div>
      )}
    </header>
  );
}
