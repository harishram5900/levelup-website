"use client";
import { useEffect, useRef, useState } from "react";
import type { DeckFont, DeckStyle, DeckTemplate, Slide } from "@/lib/cofounder/profile";

export const W = 1280, H = 720;

export const TEMPLATES: { id: DeckTemplate; name: string; line: string }[] = [
  { id: "bold", name: "Bold", line: "Big headlines, card bullets" },
  { id: "minimal", name: "Minimal", line: "Clean and airy, Apple-style" },
  { id: "split", name: "Split", line: "Half photo, half story" },
  { id: "editorial", name: "Editorial", line: "Magazine look, big numbers" },
];

export const FONTS: { id: DeckFont; name: string; css: string; upper: boolean }[] = [
  { id: "bebas", name: "Bold Condensed", css: "'Bebas Neue', Impact, sans-serif", upper: true },
  { id: "sans", name: "Modern Sans", css: "var(--font-geist-sans), system-ui, sans-serif", upper: false },
  { id: "serif", name: "Classic Serif", css: "Georgia, 'Times New Roman', serif", upper: false },
  { id: "mono", name: "Tech Mono", css: "var(--font-geist-mono), ui-monospace, monospace", upper: false },
];

export const COLOR_PRESETS: { name: string; bg: string; fg: string; accent: string; gradient: boolean }[] = [
  { name: "Royal", bg: "#0B1030", fg: "#FFFFFF", accent: "#FE8500", gradient: true },
  { name: "Tangerine", bg: "#FE8500", fg: "#1A1100", accent: "#14151D", gradient: true },
  { name: "Paper", bg: "#F7F5F0", fg: "#14151D", accent: "#105BFF", gradient: false },
  { name: "Midnight", bg: "#05050A", fg: "#F5F5F7", accent: "#A78BFA", gradient: true },
  { name: "Forest", bg: "#0F2A1D", fg: "#F1F7EE", accent: "#A3E635", gradient: true },
  { name: "Blush", bg: "#FFF1F2", fg: "#3B0A1A", accent: "#E11D48", gradient: false },
  { name: "Ocean", bg: "#062A3E", fg: "#E6F6FF", accent: "#22D3EE", gradient: true },
  { name: "Mono", bg: "#FFFFFF", fg: "#0A0A0A", accent: "#0A0A0A", gradient: false },
];

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (hex: string, a: number) => { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; };
const shade = (hex: string, amt: number) => { const [r, g, b] = hexToRgb(hex).map((c) => Math.max(0, Math.min(255, Math.round(c + amt * 255)))); return `rgb(${r},${g},${b})`; };
const isDark = (hex: string) => { const [r, g, b] = hexToRgb(hex); return 0.299 * r + 0.587 * g + 0.114 * b < 140; };

/** Renders [gap] markers as highlighted blanks the founder still needs to fill. */
export function Txt({ s, accent }: { s: string; accent: string }) {
  return <>{s.split(/(\[[^\]]+\])/).map((part, i) => /^\[.*\]$/.test(part)
    ? <span key={i} style={{ background: rgba(accent, 0.18), outline: `2px dashed ${accent}`, outlineOffset: 2, borderRadius: 6, padding: "0 6px", fontStyle: "italic" }}>{part.slice(1, -1)}</span>
    : <span key={i}>{part}</span>)}</>;
}

type Props = { slide: Slide; style: DeckStyle; logo?: string; index: number; total: number; startup: string };

/** One slide at a fixed 1280×720, so preview, present mode and PDF look identical. */
export function SlideView({ slide, style, logo, index, total, startup }: Props) {
  const { template, bg, fg, accent, gradient } = style;
  const font = FONTS.find((f) => f.id === style.font) ?? FONTS[0];
  const head: React.CSSProperties = { fontFamily: font.css, textTransform: font.upper ? "uppercase" : "none", letterSpacing: font.upper ? 1 : -0.5, fontWeight: font.upper ? 400 : 700, lineHeight: font.upper ? 0.95 : 1.05 };
  const muted = rgba(fg, 0.68);
  const card = rgba(fg, isDark(bg) ? 0.08 : 0.06);
  const background = gradient ? `radial-gradient(90% 90% at 100% 0%, ${rgba(accent, 0.28)} 0%, transparent 60%), linear-gradient(135deg, ${bg} 0%, ${shade(bg, isDark(bg) ? -0.06 : -0.08)} 100%)` : bg;
  const base: React.CSSProperties = { width: W, height: H, background, color: fg, position: "relative", overflow: "hidden", fontFamily: "var(--font-geist-sans), system-ui, sans-serif", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" };
  const img = slide.image;
  const logoEl = logo && slide.kind !== "cover" ? <img src={logo} alt="" style={{ position: "absolute", right: 64, top: 52, height: 40, maxWidth: 180, objectFit: "contain" }} /> : null;
  const footer = <div style={{ position: "absolute", left: 80, right: 80, bottom: 38, display: "flex", justifyContent: "space-between", fontSize: 18, color: muted }}><span style={{ fontWeight: 600 }}>{startup}</span><span>{index + 1} / {total}</span></div>;
  const kicker = (color = accent) => <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, color }}><span style={{ width: 36, height: 6, background: color, borderRadius: 3 }} />{slide.kicker}</div>;
  const photo = (st: React.CSSProperties) => img ? <img src={img} alt="" style={{ position: "absolute", objectFit: "cover", ...st }} /> : null;

  /* ---------- Cover ---------- */
  if (slide.kind === "cover") {
    const split = template === "split" || (img && template !== "bold");
    return (
      <div style={base}>
        {img && template === "bold" && <>{photo({ inset: 0, width: "100%", height: "100%", opacity: 0.55 })}<div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${bg} 25%, ${rgba(bg, 0.2)} 100%)` }} /></>}
        {split && (img ? photo({ right: 0, top: 0, width: 560, height: H }) : <div style={{ position: "absolute", right: 0, top: 0, width: 560, height: H, background: accent }} />)}
        {!img && template === "bold" && <><div style={{ position: "absolute", right: -140, bottom: -180, width: 520, height: 520, borderRadius: 999, border: `2px solid ${accent}`, opacity: 0.4 }} /><div style={{ position: "absolute", right: 60, bottom: -60, width: 260, height: 260, borderRadius: 999, background: accent, opacity: 0.14 }} /></>}
        <div style={{ position: "absolute", left: 80, top: 72, display: "flex", alignItems: "center", gap: 16 }}>
          {logo ? <img src={logo} alt="" style={{ height: 64, maxWidth: 240, objectFit: "contain" }} /> : <div style={{ width: 72, height: 8, background: accent, borderRadius: 4 }} />}
        </div>
        <div style={{ position: "absolute", left: 80, right: split ? 620 : 200, top: template === "minimal" ? 250 : 200 }}>
          <div style={{ ...head, fontSize: template === "minimal" ? 120 : font.upper ? 200 : 128 }}><Txt s={slide.title} accent={accent} /></div>
          <div style={{ marginTop: 28, fontSize: split ? 32 : 38, lineHeight: 1.3, maxWidth: 900 }}><Txt s={slide.bullets[0] ?? ""} accent={accent} /></div>
          <div style={{ marginTop: 32, fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: muted, fontWeight: 600 }}>{slide.kicker}</div>
        </div>
      </div>
    );
  }

  const closing = slide.kind === "closing";
  const bullets = slide.bullets;

  /* ---------- Split ---------- */
  if (template === "split") {
    return (
      <div style={base}>
        {img ? photo({ left: 0, top: 0, width: 500, height: H }) : (
          <div style={{ position: "absolute", left: 0, top: 0, width: 500, height: H, background: accent, display: "grid", placeItems: "center" }}>
            <span style={{ ...head, fontSize: 280, color: isDark(accent) ? "#fff" : "#111", opacity: 0.9 }}>{String(index + 1).padStart(2, "0")}</span>
          </div>
        )}
        {logoEl}
        <div style={{ position: "absolute", left: 570, right: 70, top: 80 }}>
          {kicker()}
          <div style={{ ...head, fontSize: font.upper ? 76 : 56, marginTop: 18 }}><Txt s={slide.title} accent={accent} /></div>
          <div style={{ marginTop: 36, display: "grid", gap: 20 }}>
            {bullets.map((b, i) => <div key={i} style={{ display: "flex", gap: 16, fontSize: 26, lineHeight: 1.35 }}><span style={{ width: 12, height: 12, borderRadius: 99, background: accent, marginTop: 12, flexShrink: 0 }} /><span><Txt s={b} accent={accent} /></span></div>)}
          </div>
        </div>
        <div style={{ position: "absolute", left: 570, right: 70, bottom: 38, display: "flex", justifyContent: "space-between", fontSize: 18, color: muted }}><span style={{ fontWeight: 600 }}>{startup}</span><span>{index + 1} / {total}</span></div>
      </div>
    );
  }

  const textRight = img ? 520 : 80;

  /* ---------- Minimal ---------- */
  if (template === "minimal") {
    return (
      <div style={base}>
        <div style={{ position: "absolute", left: 80, top: 64, width: 80, height: 4, background: accent }} />
        {logoEl}
        {photo({ right: 80, top: 150, width: 400, height: 420, borderRadius: 24 })}
        <div style={{ position: "absolute", left: 80, right: textRight, top: 100 }}>
          <div style={{ fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: muted, fontWeight: 600 }}>{slide.kicker}</div>
          <div style={{ ...head, fontSize: closing ? (font.upper ? 100 : 72) : font.upper ? 76 : 54, marginTop: 16 }}><Txt s={slide.title} accent={accent} /></div>
          <ul style={{ marginTop: 44, padding: 0, listStyle: "none", display: "grid", gap: 22 }}>
            {bullets.map((b, i) => <li key={i} style={{ display: "flex", gap: 18, fontSize: 27, lineHeight: 1.35, color: fg }}><span style={{ color: accent, fontWeight: 700 }}>—</span><span><Txt s={b} accent={accent} /></span></li>)}
          </ul>
        </div>
        {footer}
      </div>
    );
  }

  /* ---------- Editorial ---------- */
  if (template === "editorial") {
    return (
      <div style={base}>
        {logoEl}
        <div style={{ position: "absolute", left: 60, top: 40, fontFamily: font.css, fontSize: 220, fontWeight: 800, lineHeight: 1, color: "transparent", WebkitTextStroke: `2px ${rgba(accent, 0.6)}` }}>{String(index + 1).padStart(2, "0")}</div>
        {photo({ right: 80, top: 80, width: 380, height: 500, borderRadius: 4, filter: "grayscale(15%)" })}
        <div style={{ position: "absolute", left: 80, right: textRight, top: 250 }}>
          <div style={{ fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: accent, fontWeight: 700 }}>{slide.kicker}</div>
          <div style={{ ...head, fontSize: font.upper ? 72 : 52, marginTop: 10, borderBottom: `2px solid ${fg}`, paddingBottom: 18 }}><Txt s={slide.title} accent={accent} /></div>
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: !img && bullets.length > 2 ? "1fr 1fr" : "1fr", columnGap: 40, rowGap: 14 }}>
            {bullets.map((b, i) => <div key={i} style={{ fontSize: 23, lineHeight: 1.35, borderTop: `1px solid ${rgba(fg, 0.18)}`, paddingTop: 12 }}><b style={{ color: accent, marginRight: 10 }}>{String.fromCharCode(65 + i)}.</b><Txt s={b} accent={accent} /></div>)}
          </div>
        </div>
        {footer}
      </div>
    );
  }

  /* ---------- Bold (default) ---------- */
  return (
    <div style={base}>
      {closing && !img && <><div style={{ position: "absolute", right: -140, bottom: -180, width: 520, height: 520, borderRadius: 999, border: `2px solid ${accent}`, opacity: 0.4 }} /><div style={{ position: "absolute", right: 60, bottom: -60, width: 260, height: 260, borderRadius: 999, background: accent, opacity: 0.14 }} /></>}
      {logoEl}
      {photo({ right: 70, top: 150, width: 400, height: 440, borderRadius: 28, boxShadow: "0 30px 60px -20px rgba(0,0,0,.5)" })}
      <div style={{ position: "absolute", left: 80, top: 70, right: textRight }}>
        {kicker()}
        <div style={{ ...head, fontSize: closing ? (font.upper ? 110 : 72) : font.upper ? 84 : 58, marginTop: 18, maxWidth: 1080 }}><Txt s={slide.title} accent={accent} /></div>
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: !img && bullets.length > 3 ? "1fr 1fr" : "1fr", gap: 16, maxWidth: closing ? 820 : 1120 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: card, borderRadius: 20, padding: "18px 24px", fontSize: img ? 24 : 27, lineHeight: 1.3 }}>
              <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 38, lineHeight: 1, color: accent, minWidth: 34 }}>{String(i + 1).padStart(2, "0")}</span>
              <span><Txt s={b} accent={accent} /></span>
            </div>
          ))}
        </div>
      </div>
      {footer}
    </div>
  );
}

/** Scales a slide to fit its container width. */
export function Scaled({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.5);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ position: "relative", width: "100%", aspectRatio: `${W} / ${H}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${s})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
}

/** Shrinks an uploaded image so decks stay small enough to save and sync. */
export async function compressImage(file: File, kind: "logo" | "photo" = "photo"): Promise<string> {
  const max = kind === "logo" ? 600 : 1400, quality = 0.78;
  if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) throw new Error("Please choose a PNG, JPG, WebP or GIF image.");
  if (file.size > 15 * 1024 * 1024) throw new Error("That image is over 15 MB. Please pick a smaller one.");
  const url = URL.createObjectURL(file);
  try {
    const im = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Couldn't read that image.")); i.src = url; });
    const scale = Math.min(1, max / Math.max(im.width, im.height));
    const c = document.createElement("canvas");
    c.width = Math.round(im.width * scale); c.height = Math.round(im.height * scale);
    c.getContext("2d")!.drawImage(im, 0, 0, c.width, c.height);
    // Keep transparency for logos; photos become JPEG to stay small.
    return kind === "logo" ? c.toDataURL("image/png") : c.toDataURL("image/jpeg", quality);
  } finally { URL.revokeObjectURL(url); }
}
