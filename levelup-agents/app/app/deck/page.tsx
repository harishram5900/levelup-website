"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Download, Maximize2, Plus, RefreshCw, Trash2, Wand2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PipSays } from "@/components/cofounder/Pip";
import { H, Scaled, SlideView, THEMES, W } from "@/components/cofounder/SlideView";
import { AGENTS } from "@/lib/agents";
import { buildDeck, hasGap } from "@/lib/cofounder/deck";
import { XP } from "@/lib/cofounder/game";
import { useWorkspace, type DeckTheme, type Slide } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";

function Present({ slides, theme, startup, start, onClose }: { slides: Slide[]; theme: DeckTheme; startup: string; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit(); window.addEventListener("resize", fit);
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => { window.removeEventListener("resize", fit); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); };
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) setI((x) => Math.min(slides.length - 1, x + 1));
      if (["ArrowLeft", "PageUp"].includes(e.key)) setI((x) => Math.max(0, x - 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [slides.length, onClose]);
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black" role="dialog" aria-label="Presenting" onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))}>
      <div style={{ width: W * scale, height: H * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <SlideView slide={slides[i]} theme={theme} index={i} total={slides.length} startup={startup} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Exit presentation" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X size={18} aria-hidden /></button>
      <div className="absolute bottom-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Previous slide" onClick={() => setI((x) => Math.max(0, x - 1))} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"><ArrowLeft size={18} aria-hidden /></button>
        <button type="button" aria-label="Next slide" onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"><ArrowRight size={18} aria-hidden /></button>
      </div>
    </div>
  );
}

export default function DeckPage() {
  const { ws, ready, update } = useWorkspace();
  const [cur, setCur] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const closePresent = useCallback(() => setPresenting(false), []);

  if (!ready) return null;
  if (!ws.profile) {
    return (
      <div className="glass mx-auto max-w-xl rounded-[24px] p-8 text-center">
        <p className="font-display text-4xl uppercase">Set up your Startup HQ first</p>
        <p className="mt-3 text-muted">Pip builds your deck from what you tell it about your startup.</p>
        <Link href="/app" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 font-semibold">Set up HQ <ArrowRight size={16} aria-hidden /></Link>
      </div>
    );
  }
  const p = ws.profile;
  const deck = ws.deck;
  const build = () => { update((w) => ({ ...w, deck: { theme: w.deck?.theme ?? "blue", slides: buildDeck(w), at: Date.now() } })); setCur(0); };
  const agentsDone = AGENTS.filter((a) => ws.results[a.id]).length;

  if (!deck) {
    const missing = AGENTS.filter((a) => ["idea", "pitch", "money"].includes(a.id) && !ws.results[a.id]);
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="glass rounded-[28px] p-6 sm:p-10">
          <p className="kicker">Pitch deck builder</p>
          <h2 className="mt-2 font-display text-5xl uppercase leading-none sm:text-6xl">Your deck in one click</h2>
          <p className="mt-3 max-w-xl text-muted">10 slides, built from everything you've told your agents: problem, solution, customer, traction, money, growth, team and the ask. Edit any slide, then present it or download a PDF.</p>
          <PipSays mood={missing.length ? "think" : "cheer"} className="mt-6">
            {missing.length
              ? <>Tip: finish the <b>{missing.map((m) => m.name).join(", ")}</b> {missing.length > 1 ? "agents" : "agent"} first and I can fill in way more of your deck. Or build it now and fill the gaps yourself!</>
              : <>You've done the work. Let's turn it into a deck that wins!</>}
          </PipSays>
          <button type="button" onClick={build} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3.5 font-semibold transition-transform hover:-translate-y-0.5"><Wand2 size={18} aria-hidden /> Build my deck <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">+{XP.deck} XP</span></button>
          <p className="mt-3 text-xs text-muted">{agentsDone} of 6 agents done. Anything Pip doesn't know shows up as a highlighted [blank] for you to fill.</p>
        </div>
      </div>
    );
  }

  const slides = deck.slides;
  const i = Math.min(cur, slides.length - 1);
  const s = slides[i];
  const gaps = slides.reduce((n, x) => n + [x.title, x.kicker, ...x.bullets].filter(hasGap).length, 0);
  const setSlide = (patch: Partial<Slide>) => update((w) => ({ ...w, deck: { ...w.deck!, slides: w.deck!.slides.map((x, k) => (k === i ? { ...x, ...patch } : x)) } }));
  const move = (d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= slides.length) return;
    update((w) => { const arr = [...w.deck!.slides]; [arr[i], arr[j]] = [arr[j], arr[i]]; return { ...w, deck: { ...w.deck!, slides: arr } }; });
    setCur(j);
  };
  const remove = () => { if (slides.length <= 1) return; update((w) => ({ ...w, deck: { ...w.deck!, slides: w.deck!.slides.filter((_, k) => k !== i) } })); setCur(Math.max(0, i - 1)); };
  const add = () => { update((w) => { const arr = [...w.deck!.slides]; arr.splice(i + 1, 0, { id: `s${Date.now().toString(36)}`, kind: "content", kicker: "New slide", title: "[Slide title]", bullets: ["[Point one]", "[Point two]"] }); return { ...w, deck: { ...w.deck!, slides: arr } }; }); setCur(i + 1); };
  const input = "w-full rounded-xl hairline bg-bg-2/60 px-3 py-2.5 text-[15px] outline-none focus:border-violet/60";

  return (
    <div className="mx-auto max-w-[1300px] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none">{p.startup} deck</h2>
          <p className={cn("mt-1 text-sm", gaps ? "text-amber" : "text-good")}>{gaps ? `${gaps} highlighted blanks to fill before you present` : "No blanks left. Ready to pitch!"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-full hairline p-1" role="radiogroup" aria-label="Deck theme">
            {(Object.keys(THEMES) as DeckTheme[]).map((t) => (
              <button key={t} type="button" role="radio" aria-checked={deck.theme === t} aria-label={THEMES[t].name} title={THEMES[t].name} onClick={() => update((w) => ({ ...w, deck: { ...w.deck!, theme: t } }))}
                className={cn("h-7 w-7 rounded-full ring-2 transition", deck.theme === t ? "ring-violet" : "ring-transparent")} style={{ background: THEMES[t].swatch }} />
            ))}
          </div>
          <button type="button" onClick={() => setPresenting(true)} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"><Maximize2 size={15} aria-hidden /> Present</button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-cta px-4 py-2 text-sm font-semibold"><Download size={15} aria-hidden /> Download PDF</button>
          <button type="button" onClick={() => { if (confirm("Rebuild the deck from your latest answers? Your edits will be replaced.")) build(); }} className="inline-flex items-center gap-2 rounded-full hairline px-4 py-2 text-sm hover:bg-fg/5"><RefreshCw size={15} aria-hidden /> Rebuild</button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
        {/* thumbnails */}
        <ol className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[78vh] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pb-0 lg:pr-1" aria-label="Slides">
          {slides.map((x, k) => (
            <li key={x.id} className="w-36 shrink-0 lg:w-full">
              <button type="button" onClick={() => setCur(k)} aria-label={`Slide ${k + 1}: ${x.kicker}`} aria-current={k === i ? "true" : undefined}
                className={cn("block w-full overflow-hidden rounded-xl ring-2 transition", k === i ? "ring-violet" : "ring-transparent opacity-80 hover:opacity-100")}>
                <Scaled><SlideView slide={x} theme={deck.theme} index={k} total={slides.length} startup={p.startup} /></Scaled>
              </button>
              <p className="mt-1 truncate px-1 text-xs text-muted">{k + 1}. {x.kicker}</p>
            </li>
          ))}
        </ol>

        <div className="min-w-0 space-y-5">
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-fg/10">
            <Scaled><SlideView slide={s} theme={deck.theme} index={i} total={slides.length} startup={p.startup} /></Scaled>
          </div>

          <div className="glass grid gap-4 rounded-[20px] p-5 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl uppercase">Edit slide {i + 1}</p>
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(-1)} disabled={i === 0} aria-label="Move slide up" className="grid h-8 w-8 place-items-center rounded-lg hairline disabled:opacity-40"><ArrowUp size={14} aria-hidden /></button>
                  <button type="button" onClick={() => move(1)} disabled={i === slides.length - 1} aria-label="Move slide down" className="grid h-8 w-8 place-items-center rounded-lg hairline disabled:opacity-40"><ArrowDown size={14} aria-hidden /></button>
                  <button type="button" onClick={add} aria-label="Add slide after this one" className="grid h-8 w-8 place-items-center rounded-lg hairline"><Plus size={14} aria-hidden /></button>
                  <button type="button" onClick={remove} disabled={slides.length <= 1} aria-label="Delete slide" className="grid h-8 w-8 place-items-center rounded-lg hairline text-red-500 disabled:opacity-40"><Trash2 size={14} aria-hidden /></button>
                </div>
              </div>
              <div><label htmlFor="d-kicker" className="mb-1 block text-xs font-semibold text-muted">Label</label><input id="d-kicker" className={input} value={s.kicker} onChange={(e) => setSlide({ kicker: e.target.value })} maxLength={60} /></div>
              <div><label htmlFor="d-title" className="mb-1 block text-xs font-semibold text-muted">Headline</label><input id="d-title" className={input} value={s.title} onChange={(e) => setSlide({ title: e.target.value })} maxLength={90} /></div>
            </div>
            <div>
              <label htmlFor="d-bullets" className="mb-1 block text-xs font-semibold text-muted">{s.kind === "cover" ? "Tagline" : "Points (one per line, up to 4)"}</label>
              <textarea id="d-bullets" rows={6} className={cn(input, "resize-y")} value={s.bullets.join("\n")} onChange={(e) => setSlide({ bullets: e.target.value.split("\n").slice(0, s.kind === "cover" ? 1 : 4) })} />
              <p className="mt-2 text-xs text-muted">Anything in [brackets] shows as a highlighted blank. Replace it with real info. Never put made-up numbers in a deck.</p>
            </div>
          </div>
        </div>
      </div>

      {presenting && <Present slides={slides} theme={deck.theme} startup={p.startup} start={i} onClose={closePresent} />}
      {mounted && createPortal(
        <div className="print-deck" aria-hidden>
          {slides.map((x, k) => <div key={x.id} className="print-page"><SlideView slide={x} theme={deck.theme} index={k} total={slides.length} startup={p.startup} /></div>)}
        </div>, document.body)}
    </div>
  );
}
