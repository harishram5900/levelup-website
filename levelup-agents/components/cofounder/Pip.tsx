"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";

export type Mood = "happy" | "think" | "cheer" | "wave";

/** Pip, LevelUp's robot co-founder. Pure SVG so it stays crisp at any size. */
export function Pip({ mood = "happy", size = 120, className }: { mood?: Mood; size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const armsUp = mood === "cheer";
  return (
    <motion.svg
      viewBox="0 0 120 130" width={size} height={size * (130 / 120)} className={cn("shrink-0 overflow-visible", className)} role="img" aria-label={`Pip the co-founder robot, ${mood === "think" ? "thinking" : mood === "cheer" ? "cheering" : "smiling"}`}
      animate={reduce ? undefined : { y: mood === "cheer" ? [0, -8, 0] : [0, -3, 0] }}
      transition={{ duration: mood === "cheer" ? 0.6 : 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4D8DFF" /><stop offset="1" stopColor="#105BFF" /></linearGradient>
        <radialGradient id={`g${id}`}><stop offset="0" stopColor="#FFD08A" /><stop offset="1" stopColor="#FE8500" /></radialGradient>
      </defs>
      {/* shadow */}
      <ellipse cx="60" cy="126" rx="30" ry="4" fill="currentColor" opacity="0.12" />
      {/* antenna */}
      <line x1="60" y1="22" x2="60" y2="8" stroke="#105BFF" strokeWidth="4" strokeLinecap="round" />
      <motion.circle cx="60" cy="7" r="6" fill={`url(#g${id})`} animate={reduce ? undefined : { scale: [1, 1.25, 1], opacity: [1, 0.8, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ transformOrigin: "60px 7px" }} />
      {/* arms */}
      <motion.path d={armsUp ? "M22 70 Q8 50 12 34" : "M22 72 Q8 82 12 96"} stroke="#105BFF" strokeWidth="8" strokeLinecap="round" fill="none" />
      <motion.g style={{ transformOrigin: "98px 72px" }} animate={mood === "wave" && !reduce ? { rotate: [0, -25, 0, -25, 0] } : { rotate: 0 }} transition={{ duration: 1.4, repeat: mood === "wave" ? Infinity : 0, repeatDelay: 0.8 }}>
        <path d={armsUp || mood === "wave" ? "M98 70 Q112 50 108 34" : "M98 72 Q112 82 108 96"} stroke="#105BFF" strokeWidth="8" strokeLinecap="round" fill="none" />
      </motion.g>
      {/* body */}
      <rect x="20" y="22" width="80" height="96" rx="34" fill={`url(#b${id})`} />
      <rect x="20" y="22" width="80" height="96" rx="34" fill="white" opacity="0.08" />
      {/* face screen */}
      <rect x="30" y="36" width="60" height="44" rx="20" fill="#14151D" />
      {/* eyes */}
      {mood === "cheer" ? (
        <g stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none"><path d="M40 58 Q46 50 52 58" /><path d="M68 58 Q74 50 80 58" /></g>
      ) : (
        <motion.g animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }} style={{ transformOrigin: "60px 56px" }}>
          <ellipse cx={mood === "think" ? 48 : 46} cy={mood === "think" ? 52 : 56} rx="5.5" ry="7" fill="#fff" />
          <ellipse cx={mood === "think" ? 76 : 74} cy={mood === "think" ? 52 : 56} rx="5.5" ry="7" fill="#fff" />
        </motion.g>
      )}
      {/* mouth */}
      {mood === "think" ? <path d="M54 70 H66" stroke="#FE8500" strokeWidth="3.5" strokeLinecap="round" /> : <path d={mood === "cheer" ? "M48 66 Q60 78 72 66 Z" : "M50 67 Q60 74 70 67"} stroke="#FE8500" strokeWidth="3.5" strokeLinecap="round" fill={mood === "cheer" ? "#FE8500" : "none"} />}
      {/* cheeks */}
      <circle cx="38" cy="68" r="3" fill="#FE8500" opacity="0.5" /><circle cx="82" cy="68" r="3" fill="#FE8500" opacity="0.5" />
      {/* chest badge */}
      <circle cx="60" cy="98" r="9" fill="#fff" opacity="0.18" />
      <path d="M56 101 L60 93 L64 101" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {mood === "think" && <g fill="currentColor" opacity="0.5"><circle cx="104" cy="22" r="3" /><circle cx="112" cy="12" r="4.5" /></g>}
    </motion.svg>
  );
}

/** Pip with a speech bubble. */
export function PipSays({ mood = "happy", size = 88, children, className }: { mood?: Mood; size?: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-end gap-3", className)}>
      <Pip mood={mood} size={size} />
      <AnimatePresence mode="wait">
        <motion.div key={String(children).slice(0, 40)} initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          className="relative mb-6 min-w-0 rounded-2xl rounded-bl-sm bg-fg/[0.06] px-4 py-3 text-[15px] leading-snug ring-1 ring-fg/10">
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
