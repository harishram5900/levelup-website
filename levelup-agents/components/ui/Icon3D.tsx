import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mix a hex color toward white (amt > 0) or black (amt < 0). */
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt)));
  return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
const alpha = (hex: string, a: number) => `${hex}${Math.round(a * 255).toString(16).padStart(2, "0")}`;

type Props = { icon: LucideIcon; color: string; size?: number; state?: "idle" | "locked"; className?: string; round?: boolean };

/**
 * A glossy, game-style 3D icon tile: lit from the top-left, a bevelled bottom edge, a soft colored
 * drop shadow and a white glyph with its own depth. Pure CSS, so it stays sharp at any size and
 * costs nothing to load.
 */
export function Icon3D({ icon: Icon, color, size = 48, state = "idle", className, round }: Props) {
  const c = state === "locked" ? "#9AA3B5" : color;
  const deep = shade(c, -0.38);
  const s = size;
  return (
    <span
      aria-hidden
      className={cn("icon3d relative inline-grid shrink-0 place-items-center overflow-hidden", className)}
      style={{
        width: s, height: s, borderRadius: round ? 999 : s * 0.32,
        background: `radial-gradient(120% 95% at 28% 12%, ${shade(c, 0.42)} 0%, ${c} 46%, ${shade(c, -0.22)} 100%)`,
        boxShadow: `inset 0 ${Math.max(1, s * 0.05)}px 0 rgba(255,255,255,.5), inset 0 -${Math.max(2, s * 0.09)}px 0 ${deep}, 0 ${s * 0.16}px ${s * 0.26}px -${s * 0.1}px ${alpha(c, 0.6)}`,
      }}
    >
      {/* gloss highlight */}
      <span className="pointer-events-none absolute rounded-full" style={{ top: "5%", left: "12%", width: "76%", height: "42%", background: "radial-gradient(closest-side, rgba(255,255,255,.55), rgba(255,255,255,0))" }} />
      <Icon size={s * 0.46} strokeWidth={2.6} color="#fff" className="relative" style={{ filter: `drop-shadow(0 ${Math.max(1, s * 0.035)}px 0 ${deep})`, marginTop: -s * 0.03 }} />
    </span>
  );
}
