"use client";
import { useEffect, useRef, useState } from "react";
import type { DeckTheme, Slide } from "@/lib/cofounder/profile";

export const W = 1280, H = 720;

export const THEMES: Record<DeckTheme, { name: string; bg: string; fg: string; muted: string; accent: string; card: string; swatch: string }> = {
  blue: { name: "Royal", bg: "radial-gradient(120% 120% at 100% 0%, #105BFF 0%, #0A2A7A 45%, #0B1030 100%)", fg: "#FFFFFF", muted: "rgba(255,255,255,.7)", accent: "#FE8500", card: "rgba(255,255,255,.08)", swatch: "linear-gradient(135deg,#105BFF,#0B1030)" },
  tangerine: { name: "Tangerine", bg: "radial-gradient(120% 120% at 0% 0%, #FFB15C 0%, #FE8500 50%, #E06A00 100%)", fg: "#1A1100", muted: "rgba(26,17,0,.7)", accent: "#14151D", card: "rgba(255,255,255,.22)", swatch: "linear-gradient(135deg,#FFB15C,#E06A00)" },
  paper: { name: "Paper", bg: "#F7F5F0", fg: "#14151D", muted: "rgba(20,21,29,.62)", accent: "#105BFF", card: "rgba(16,91,255,.07)", swatch: "linear-gradient(135deg,#F7F5F0,#dfe6f7)" },
};

/** Renders [gap] markers as highlighted blanks the founder still needs to fill. */
export function Txt({ s, accent }: { s: string; accent: string }) {
  return <>{s.split(/(\[[^\]]+\])/).map((part, i) => /^\[.*\]$/.test(part)
    ? <span key={i} style={{ background: "rgba(254,133,0,.22)", outline: `2px dashed ${accent}`, outlineOffset: 2, borderRadius: 6, padding: "0 6px", fontStyle: "italic" }}>{part.slice(1, -1)}</span>
    : <span key={i}>{part}</span>)}</>;
}

/** One slide at a fixed 1280×720, so preview, present mode and PDF look identical. */
export function SlideView({ slide, theme, index, total, startup }: { slide: Slide; theme: DeckTheme; index: number; total: number; startup: string }) {
  const t = THEMES[theme];
  const display = "'Bebas Neue', Impact, sans-serif";
  const base: React.CSSProperties = { width: W, height: H, background: t.bg, color: t.fg, position: "relative", overflow: "hidden", fontFamily: "var(--font-geist-sans), system-ui, sans-serif", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" };
  const deco = <>
    <div style={{ position: "absolute", right: -140, bottom: -180, width: 520, height: 520, borderRadius: 999, border: `2px solid ${t.accent}`, opacity: 0.35 }} />
    <div style={{ position: "absolute", right: 60, bottom: -60, width: 260, height: 260, borderRadius: 999, background: t.accent, opacity: 0.12 }} />
  </>;
  const footer = <div style={{ position: "absolute", left: 80, right: 80, bottom: 40, display: "flex", justifyContent: "space-between", fontSize: 18, color: t.muted }}><span style={{ fontWeight: 600 }}>{startup}</span><span>{index + 1} / {total}</span></div>;

  if (slide.kind === "cover") {
    return (
      <div style={base}>{deco}
        <div style={{ position: "absolute", left: 80, top: 80, width: 72, height: 8, background: t.accent, borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 80, right: 200, top: 190 }}>
          <div style={{ fontFamily: display, fontSize: 210, lineHeight: 0.9, letterSpacing: 2 }}><Txt s={slide.title} accent={t.accent} /></div>
          <div style={{ marginTop: 28, fontSize: 38, lineHeight: 1.3, maxWidth: 900, color: t.fg }}><Txt s={slide.bullets[0] ?? ""} accent={t.accent} /></div>
          <div style={{ marginTop: 36, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: t.muted, fontWeight: 600 }}>{slide.kicker}</div>
        </div>
      </div>
    );
  }

  const closing = slide.kind === "closing";
  return (
    <div style={base}>{closing && deco}
      <div style={{ position: "absolute", left: 80, top: 70, right: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, color: t.accent }}>
          <span style={{ width: 36, height: 6, background: t.accent, borderRadius: 3 }} />{slide.kicker}
        </div>
        <div style={{ fontFamily: display, fontSize: closing ? 110 : 84, lineHeight: 0.95, marginTop: 18, maxWidth: 1080, letterSpacing: 1 }}><Txt s={slide.title} accent={t.accent} /></div>
        <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: slide.bullets.length > 3 ? "1fr 1fr" : "1fr", gap: 18, maxWidth: closing ? 820 : 1120 }}>
          {slide.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: t.card, borderRadius: 20, padding: "20px 26px", fontSize: 28, lineHeight: 1.3 }}>
              <span style={{ fontFamily: display, fontSize: 40, lineHeight: 1, color: t.accent, minWidth: 36 }}>{String(i + 1).padStart(2, "0")}</span>
              <span><Txt s={b} accent={t.accent} /></span>
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
