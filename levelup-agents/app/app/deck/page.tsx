"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Download, ImagePlus, Maximize2, Paintbrush, Pencil, Plus, RefreshCw, Trash2, Upload, Wand2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Buddy, BuddySays } from "@/components/cofounder/Pip";
import { COLOR_PRESETS, compressImage, FONTS, H, Scaled, SlideView, TEMPLATES, W } from "@/components/cofounder/SlideView";
import { AGENTS } from "@/lib/agents";
import { buildDeck, hasGap } from "@/lib/cofounder/deck";
import { XP } from "@/lib/cofounder/game";
import { DEFAULT_STYLE, useWorkspace, type DeckStyle, type Slide } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";

function Present({ slides, style, logo, startup, start, onClose }: { slides: Slide[]; style: DeckStyle; logo?: string; startup: string; start: number; onClose: () => void }) {
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
              <SlideView slide={slides[i]} style={style} logo={logo} index={i} total={slides.length} startup={startup} />
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

const SAMPLE: Slide = { id: "sample", kind: "content", kicker: "The problem", title: "Students freeze in class", bullets: ["Who feels it: shy students", "Today they avoid speaking"] };

/** Design controls: template, colors, font and logo. Used before building and while editing. */
function DesignPanel({ style, logo, startup, onStyle, onLogo, sampleImage }: { style: DeckStyle; logo?: string; startup: string; onStyle: (s: DeckStyle) => void; onLogo: (l?: string) => void; sampleImage?: string }) {
  const [err, setErr] = useState("");
  const pickLogo = async (f?: File) => { if (!f) return; setErr(""); try { onLogo(await compressImage(f, "logo")); } catch (e) { setErr((e as Error).message); } };
  return (
    <div className="space-y-6">
      <section>
        <p className="mb-3 text-sm font-semibold">1. Layout</p>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Deck layout">
          {TEMPLATES.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={style.template === t.id} onClick={() => onStyle({ ...style, template: t.id })}
              className={cn("overflow-hidden rounded-2xl text-left ring-2 transition", style.template === t.id ? "ring-violet" : "ring-fg/10 hover:ring-fg/30")}>
              <Scaled><SlideView slide={{ ...SAMPLE, image: t.id === "split" ? sampleImage : undefined }} style={{ ...style, template: t.id }} index={1} total={10} startup={startup} /></Scaled>
              <span className="block px-3 py-2"><span className="block text-sm font-semibold">{t.name}</span><span className="block text-xs text-muted">{t.line}</span></span>
            </button>
          ))}
        </div>
      </section>
      <section>
        <p className="mb-3 text-sm font-semibold">2. Colors</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color theme">
          {COLOR_PRESETS.map((c) => {
            const on = style.bg === c.bg && style.accent === c.accent;
            return (
              <button key={c.name} type="button" role="radio" aria-checked={on} title={c.name} onClick={() => onStyle({ ...style, bg: c.bg, fg: c.fg, accent: c.accent, gradient: c.gradient })}
                className={cn("flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-semibold ring-2 transition", on ? "ring-violet" : "ring-fg/10 hover:ring-fg/30")}>
                <span className="relative h-6 w-6 overflow-hidden rounded-full" style={{ background: c.bg }}><span className="absolute bottom-0 right-0 h-3 w-3 rounded-tl-full" style={{ background: c.accent }} /></span>{c.name}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {([["bg", "Background"], ["fg", "Text"], ["accent", "Accent"]] as const).map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 rounded-xl hairline px-2.5 py-2 text-xs font-semibold">
              <input type="color" value={style[k]} onChange={(e) => onStyle({ ...style, [k]: e.target.value })} className="h-7 w-7 cursor-pointer rounded-md border-0 bg-transparent p-0" aria-label={`${label} color`} />{label}
            </label>
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={style.gradient} onChange={(e) => onStyle({ ...style, gradient: e.target.checked })} className="h-4 w-4 accent-[rgb(var(--violet))]" /> Soft gradient glow</label>
      </section>
      <section>
        <p className="mb-3 text-sm font-semibold">3. Font</p>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Font">
          {FONTS.map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={style.font === f.id} onClick={() => onStyle({ ...style, font: f.id })}
              className={cn("rounded-xl px-3 py-2.5 text-left ring-2 transition", style.font === f.id ? "bg-violet/10 ring-violet" : "ring-fg/10 hover:ring-fg/30")}>
              <span className="block text-xl leading-none" style={{ fontFamily: f.css, textTransform: f.upper ? "uppercase" : "none" }}>Aa {startup}</span>
              <span className="mt-1 block text-xs text-muted">{f.name}</span>
            </button>
          ))}
        </div>
      </section>
      <section>
        <p className="mb-3 text-sm font-semibold">4. Your logo <span className="font-normal text-muted">(optional)</span></p>
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-28 place-items-center overflow-hidden rounded-xl hairline" style={{ background: style.bg }}>
            {logo ? <img src={logo} alt="Your logo" className="max-h-12 max-w-24 object-contain" /> : <span className="text-xs" style={{ color: style.fg }}>No logo</span>}
          </div>
          <label className="btn-soft cursor-pointer text-sm"><Upload size={15} aria-hidden /> {logo ? "Replace" : "Upload"}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => pickLogo(e.target.files?.[0])} /></label>
          {logo && <button type="button" onClick={() => onLogo(undefined)} className="btn-icon text-red-500" aria-label="Remove logo"><Trash2 size={14} aria-hidden /></button>}
        </div>
        {err && <p className="mt-2 text-sm text-red-500" role="alert">{err}</p>}
        <p className="mt-2 text-xs text-muted">Tip: a PNG with a transparent background looks best.</p>
      </section>
    </div>
  );
}

export default function DeckPage() {
  const { ws, ready, update } = useWorkspace();
  const [cur, setCur] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [tab, setTab] = useState<"edit" | "design">("edit");
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<{ style: DeckStyle; logo?: string }>({ style: DEFAULT_STYLE });
  const [imgErr, setImgErr] = useState("");
  useEffect(() => setMounted(true), []);
  const closePresent = useCallback(() => setPresenting(false), []);

  if (!ready) return null;
  const ch = ws.prefs.character;
  if (!ws.profile) {
    return (
      <div className="glass mx-auto max-w-xl rounded-[24px] p-8 text-center">
        <Buddy character={ch} mood="wave" size={100} className="mx-auto" />
        <p className="mt-4 font-display text-4xl uppercase">Set up your Startup HQ first</p>
        <p className="mt-3 text-muted">Your co-founder builds your deck from what you tell it about your startup.</p>
        <Link href="/app" className="btn-play mt-6">Set up HQ <ArrowRight size={16} aria-hidden /></Link>
      </div>
    );
  }
  const p = ws.profile;
  const deck = ws.deck;
  const build = (style: DeckStyle, logo?: string) => { update((w) => ({ ...w, deck: { style, logo, slides: buildDeck(w), at: Date.now() } })); setCur(0); setTab("edit"); };
  const agentsDone = AGENTS.filter((a) => ws.results[a.id]).length;

  /* ---------- Step 1: choose a design ---------- */
  if (!deck) {
    const missing = AGENTS.filter((a) => ["idea", "pitch", "money"].includes(a.id) && !ws.results[a.id]);
    return (
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div>
          <p className="kicker">Pitch deck designer</p>
          <h2 className="mt-2 font-display text-5xl uppercase leading-none sm:text-6xl">Design your deck</h2>
          <p className="mt-2 max-w-2xl text-muted">Pick a layout, colors, font and logo. We'll write 10 slides from everything you've told your agents, in your design. You can add your own photos to any slide after.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="glass rounded-[24px] p-5 sm:p-6">
            <DesignPanel style={draft.style} logo={draft.logo} startup={p.startup} onStyle={(s) => setDraft({ ...draft, style: s })} onLogo={(l) => setDraft({ ...draft, logo: l })} />
          </div>
          <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <p className="text-sm font-semibold">Live preview</p>
            <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-fg/10"><Scaled><SlideView slide={{ id: "c", kind: "cover", kicker: p.founder ? `Presented by ${p.founder}` : "Pitch deck", title: p.startup, bullets: [`${p.idea.charAt(0).toUpperCase()}${p.idea.slice(1).replace(/\.$/, "")}.`] }} style={draft.style} logo={draft.logo} index={0} total={10} startup={p.startup} /></Scaled></div>
            <div className="overflow-hidden rounded-2xl ring-1 ring-fg/10"><Scaled><SlideView slide={SAMPLE} style={draft.style} logo={draft.logo} index={1} total={10} startup={p.startup} /></Scaled></div>
            <BuddySays character={ch} mood={missing.length ? "think" : "cheer"} size={64}>
              {missing.length ? <>Tip: finish the <b>{missing.map((m) => m.name).join(", ")}</b> {missing.length > 1 ? "agents" : "agent"} first and I can fill in more. Or build now and fill blanks yourself!</> : <>You've done the work. Let's make a deck that wins!</>}
            </BuddySays>
            <button type="button" onClick={() => build(draft.style, draft.logo)} className="btn-play w-full text-lg"><Wand2 size={20} aria-hidden /> Build my deck <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">+{XP.deck} XP</span></button>
            <p className="text-center text-xs text-muted">{agentsDone} of {AGENTS.length} agents done · missing info shows as a highlighted [blank]</p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Step 2: edit, present, download ---------- */
  const slides = deck.slides;
  const i = Math.min(cur, slides.length - 1);
  const s = slides[i];
  const gaps = slides.reduce((n, x) => n + [x.title, x.kicker, ...x.bullets].filter(hasGap).length, 0);
  const setDeck = (patch: Partial<typeof deck>) => update((w) => ({ ...w, deck: { ...w.deck!, ...patch } }));
  const setSlide = (patch: Partial<Slide>) => update((w) => ({ ...w, deck: { ...w.deck!, slides: w.deck!.slides.map((x, k) => (k === i ? { ...x, ...patch } : x)) } }));
  const move = (d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= slides.length) return;
    update((w) => { const arr = [...w.deck!.slides]; [arr[i], arr[j]] = [arr[j], arr[i]]; return { ...w, deck: { ...w.deck!, slides: arr } }; });
    setCur(j);
  };
  const remove = () => { if (slides.length <= 1) return; update((w) => ({ ...w, deck: { ...w.deck!, slides: w.deck!.slides.filter((_, k) => k !== i) } })); setCur(Math.max(0, i - 1)); };
  const add = () => { update((w) => { const arr = [...w.deck!.slides]; arr.splice(i + 1, 0, { id: `s${Date.now().toString(36)}`, kind: "content", kicker: "New slide", title: "[Slide title]", bullets: ["[Point one]", "[Point two]"] }); return { ...w, deck: { ...w.deck!, slides: arr } }; }); setCur(i + 1); };
  const pickImage = async (f?: File) => {
    if (!f) return; setImgErr("");
    if (slides.filter((x) => x.image).length >= 12 && !s.image) { setImgErr("You can add up to 12 photos per deck."); return; }
    try { setSlide({ image: await compressImage(f, "photo") }); } catch (e) { setImgErr((e as Error).message); }
  };
  const input = "w-full rounded-xl hairline bg-bg-2/60 px-3 py-2.5 text-[15px] outline-none focus:border-violet/60";

  return (
    <div className="mx-auto max-w-[1300px] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none">{p.startup} deck</h2>
          <p className={cn("mt-1 text-sm", gaps ? "text-amber" : "text-good")}>{gaps ? `${gaps} highlighted blanks to fill before you present` : "No blanks left. Ready to pitch!"}</p>
        </div>
        <div className="flex flex-wrap gap-2" data-tour="deck-actions">
          <button type="button" onClick={() => setPresenting(true)} className="btn-glow"><Maximize2 size={15} aria-hidden /> Present</button>
          <button type="button" onClick={() => window.print()} className="btn-outline-cta"><Download size={15} aria-hidden /> Download PDF</button>
          <button type="button" onClick={() => { if (confirm("Rewrite the slides from your latest answers? Your text edits and photos will be replaced (design stays).")) build(deck.style, deck.logo); }} className="btn-glass"><RefreshCw size={15} aria-hidden /> Rewrite slides</button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)_360px]">
        <ol className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[80vh] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pb-0 lg:pr-1" aria-label="Slides">
          {slides.map((x, k) => (
            <li key={x.id} className="w-36 shrink-0 lg:w-full">
              <button type="button" onClick={() => setCur(k)} aria-label={`Slide ${k + 1}: ${x.kicker}`} aria-current={k === i ? "true" : undefined}
                className={cn("block w-full overflow-hidden rounded-xl ring-2 transition", k === i ? "ring-violet" : "ring-transparent opacity-80 hover:opacity-100")}>
                <Scaled><SlideView slide={x} style={deck.style} logo={deck.logo} index={k} total={slides.length} startup={p.startup} /></Scaled>
              </button>
              <p className="mt-1 truncate px-1 text-xs text-muted">{k + 1}. {x.kicker}</p>
            </li>
          ))}
        </ol>

        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-fg/10">
            <Scaled><SlideView slide={s} style={deck.style} logo={deck.logo} index={i} total={slides.length} startup={p.startup} /></Scaled>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <button type="button" onClick={() => setCur(Math.max(0, i - 1))} disabled={i === 0} className="btn-icon" aria-label="Previous slide"><ArrowLeft size={15} aria-hidden /></button>
            <span className="text-sm text-muted" style={{ fontVariantNumeric: "tabular-nums" }}>{i + 1} / {slides.length}</span>
            <button type="button" onClick={() => setCur(Math.min(slides.length - 1, i + 1))} disabled={i === slides.length - 1} className="btn-icon" aria-label="Next slide"><ArrowRight size={15} aria-hidden /></button>
          </div>
        </div>

        <aside className="glass h-fit rounded-[22px] p-5 lg:max-h-[82vh] lg:overflow-y-auto" data-tour="deck-panel">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-fg/[0.05] p-1" role="tablist">
            {([["edit", "Edit slide", Pencil], ["design", "Design", Paintbrush]] as const).map(([id, label, Icon]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn("flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition", tab === id ? "bg-bg-2 shadow" : "text-muted hover:text-fg")}><Icon size={14} aria-hidden />{label}</button>
            ))}
          </div>
          {tab === "design" ? (
            <DesignPanel style={deck.style} logo={deck.logo} startup={p.startup} onStyle={(st) => setDeck({ style: st })} onLogo={(l) => setDeck({ logo: l })} sampleImage={slides.find((x) => x.image)?.image} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl uppercase">Slide {i + 1}</p>
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(-1)} disabled={i === 0} aria-label="Move slide up" className="btn-icon h-8 w-8"><ArrowUp size={14} aria-hidden /></button>
                  <button type="button" onClick={() => move(1)} disabled={i === slides.length - 1} aria-label="Move slide down" className="btn-icon h-8 w-8"><ArrowDown size={14} aria-hidden /></button>
                  <button type="button" onClick={add} aria-label="Add slide after this one" className="btn-icon h-8 w-8"><Plus size={14} aria-hidden /></button>
                  <button type="button" onClick={remove} disabled={slides.length <= 1} aria-label="Delete slide" className="btn-icon h-8 w-8 text-red-500"><Trash2 size={14} aria-hidden /></button>
                </div>
              </div>
              <div><label htmlFor="d-kicker" className="mb-1 block text-xs font-semibold text-muted">Label</label><input id="d-kicker" className={input} value={s.kicker} onChange={(e) => setSlide({ kicker: e.target.value })} maxLength={60} /></div>
              <div><label htmlFor="d-title" className="mb-1 block text-xs font-semibold text-muted">Headline</label><input id="d-title" className={input} value={s.title} onChange={(e) => setSlide({ title: e.target.value })} maxLength={90} /></div>
              <div>
                <label htmlFor="d-bullets" className="mb-1 block text-xs font-semibold text-muted">{s.kind === "cover" ? "Tagline" : "Points (one per line, up to 4)"}</label>
                <textarea id="d-bullets" rows={5} className={cn(input, "resize-y")} value={s.bullets.join("\n")} onChange={(e) => setSlide({ bullets: e.target.value.split("\n").slice(0, s.kind === "cover" ? 1 : 4) })} />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-muted">Photo or screenshot</p>
                {s.image ? (
                  <div className="flex items-center gap-3">
                    <img src={s.image} alt="Slide photo" className="h-16 w-24 rounded-lg object-cover" />
                    <label className="btn-soft cursor-pointer py-2 text-sm"><ImagePlus size={14} aria-hidden /> Replace<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(e) => pickImage(e.target.files?.[0])} /></label>
                    <button type="button" onClick={() => setSlide({ image: undefined })} className="btn-icon text-red-500" aria-label="Remove photo"><Trash2 size={14} aria-hidden /></button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-fg/15 px-4 py-5 text-center text-sm text-muted transition hover:border-violet/50 hover:text-fg">
                    <ImagePlus size={22} aria-hidden /> Add a photo, product screenshot or team picture
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(e) => pickImage(e.target.files?.[0])} />
                  </label>
                )}
                {imgErr && <p className="mt-2 text-sm text-red-500" role="alert">{imgErr}</p>}
              </div>
              <p className="text-xs text-muted">Anything in [brackets] shows as a highlighted blank. Replace it with real info. Never put made-up numbers in a deck.</p>
            </div>
          )}
        </aside>
      </div>

      {presenting && <Present slides={slides} style={deck.style} logo={deck.logo} startup={p.startup} start={i} onClose={closePresent} />}
      {mounted && createPortal(
        <div className="print-deck" aria-hidden>
          {slides.map((x, k) => <div key={x.id} className="print-page"><SlideView slide={x} style={deck.style} logo={deck.logo} index={k} total={slides.length} startup={p.startup} /></div>)}
        </div>, document.body)}
    </div>
  );
}
