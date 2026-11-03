"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";

export type Mood = "happy" | "think" | "cheer" | "wave";
export type CharacterId = "pip" | "blaze" | "sage" | "nova" | "rocco";

export const CHARACTERS: { id: CharacterId; name: string; role: string; vibe: string; catchphrase: string; color: string }[] = [
  { id: "pip", name: "Pip", role: "The Builder", vibe: "Calm, practical robot. Turns big ideas into small next steps.", catchphrase: "Let's build it.", color: "#105BFF" },
  { id: "blaze", name: "Blaze", role: "The Hype Coach", vibe: "Baby dragon with big energy. Pushes you to ship fast.", catchphrase: "Ship it today!", color: "#FF5A1F" },
  { id: "sage", name: "Sage", role: "The Strategist", vibe: "Wise owl. Asks the hard questions investors will ask.", catchphrase: "Let's think it through.", color: "#7C5CFF" },
  { id: "nova", name: "Nova", role: "The Explorer", vibe: "Space cat. Always hunting for competitions and opportunities.", catchphrase: "New opportunity spotted!", color: "#0EA5A4" },
  { id: "rocco", name: "Rocco", role: "The Hustler", vibe: "Street-smart raccoon. Lives for sales and money.", catchphrase: "Let's close a deal.", color: "#5B6170" },
];
export const characterById = (id?: string) => CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];

function Eyes({ mood, x1, x2, y, dark, pupil = "#14151D", reduce }: { mood: Mood; x1: number; x2: number; y: number; dark?: boolean; pupil?: string; reduce: boolean | null }) {
  if (mood === "cheer") return <g stroke={dark ? "#fff" : "#14151D"} strokeWidth="4" strokeLinecap="round" fill="none"><path d={`M${x1 - 6} ${y + 2} Q${x1} ${y - 6} ${x1 + 6} ${y + 2}`} /><path d={`M${x2 - 6} ${y + 2} Q${x2} ${y - 6} ${x2 + 6} ${y + 2}`} /></g>;
  const dy = mood === "think" ? -4 : 0, dx = mood === "think" ? 2 : 0;
  return (
    <motion.g animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }} style={{ transformOrigin: `60px ${y}px` }}>
      {dark ? <>
        <ellipse cx={x1 + dx} cy={y + dy} rx="5.5" ry="7" fill="#fff" /><ellipse cx={x2 + dx} cy={y + dy} rx="5.5" ry="7" fill="#fff" />
      </> : <>
        <circle cx={x1} cy={y} r="8" fill="#fff" /><circle cx={x2} cy={y} r="8" fill="#fff" />
        <circle cx={x1 + dx + 1} cy={y + dy + 1} r="4.5" fill={pupil} /><circle cx={x2 + dx + 1} cy={y + dy + 1} r="4.5" fill={pupil} />
        <circle cx={x1 + dx + 2.5} cy={y + dy - 1} r="1.5" fill="#fff" /><circle cx={x2 + dx + 2.5} cy={y + dy - 1} r="1.5" fill="#fff" />
      </>}
    </motion.g>
  );
}

function Mouth({ mood, y, color = "#FE8500" }: { mood: Mood; y: number; color?: string }) {
  if (mood === "think") return <path d={`M55 ${y + 2} H65`} stroke={color} strokeWidth="3.5" strokeLinecap="round" />;
  if (mood === "cheer") return <path d={`M49 ${y - 1} Q60 ${y + 11} 71 ${y - 1} Z`} stroke={color} strokeWidth="3" strokeLinejoin="round" fill={color} />;
  return <path d={`M51 ${y} Q60 ${y + 7} 69 ${y}`} stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />;
}

/** The co-founder characters. Pure SVG, original designs, crisp at any size. */
export function Buddy({ character = "pip", mood = "happy", size = 120, className }: { character?: CharacterId; mood?: Mood; size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const c = characterById(character);
  const armsUp = mood === "cheer";
  const wave = mood === "wave";
  const label = `${c.name} the ${c.role.replace("The ", "").toLowerCase()}, ${mood === "think" ? "thinking" : mood === "cheer" ? "cheering" : mood === "wave" ? "waving" : "smiling"}`;

  const arms = (color: string, w = 8) => <>
    <path d={armsUp ? "M24 70 Q8 50 12 34" : "M24 74 Q10 84 14 96"} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />
    <motion.g style={{ transformOrigin: "96px 72px" }} animate={wave && !reduce ? { rotate: [0, -22, 0, -22, 0] } : { rotate: 0 }} transition={{ duration: 1.4, repeat: wave ? Infinity : 0, repeatDelay: 0.8 }}>
      <path d={armsUp || wave ? "M96 70 Q112 50 108 34" : "M96 74 Q110 84 106 96"} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />
    </motion.g>
  </>;

  let art: React.ReactNode;
  if (character === "blaze") {
    art = <>
      <defs><linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset="1" stopColor="#E8380D" /></linearGradient></defs>
      {/* wings + tail */}
      <motion.path d="M26 60 L4 40 L10 62 L2 70 L24 74 Z" fill="#FFB020" animate={reduce ? undefined : { rotate: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ transformOrigin: "26px 64px" }} />
      <motion.path d="M94 60 L116 40 L110 62 L118 70 L96 74 Z" fill="#FFB020" animate={reduce ? undefined : { rotate: [0, 8, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ transformOrigin: "94px 64px" }} />
      <path d="M86 108 Q112 112 108 94 L116 92 L106 84" stroke="#E8380D" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {arms("#E8380D", 7)}
      <path d="M40 30 L34 10 L50 26 Z" fill="#FFD08A" /><path d="M80 30 L86 10 L70 26 Z" fill="#FFD08A" />
      <rect x="22" y="22" width="76" height="96" rx="36" fill={`url(#b${id})`} />
      <ellipse cx="60" cy="96" rx="22" ry="18" fill="#FFD08A" opacity="0.9" />
      <path d="M48 90 H72 M50 98 H70 M53 106 H67" stroke="#E8A040" strokeWidth="2" strokeLinecap="round" />
      <Eyes mood={mood} x1={46} x2={74} y={52} reduce={reduce} />
      <circle cx="55" cy="64" r="1.6" fill="#7A1A00" /><circle cx="65" cy="64" r="1.6" fill="#7A1A00" />
      <Mouth mood={mood} y={70} color="#7A1A00" />
      {mood === "cheer" && <motion.path d="M60 6 Q54 0 60 -6 Q66 0 60 6" fill="#FFB020" animate={reduce ? undefined : { scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />}
    </>;
  } else if (character === "sage") {
    art = <>
      <defs><linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B82FF" /><stop offset="1" stopColor="#5B3FE0" /></linearGradient></defs>
      <path d="M22 36 L28 12 L46 28 Z" fill="#5B3FE0" /><path d="M98 36 L92 12 L74 28 Z" fill="#5B3FE0" />
      {/* wings as arms */}
      <path d={armsUp ? "M24 76 Q2 52 14 32 Q22 56 30 64 Z" : "M24 60 Q6 80 16 104 Q26 88 30 80 Z"} fill="#4A30C4" />
      <motion.g style={{ transformOrigin: "96px 70px" }} animate={wave && !reduce ? { rotate: [0, -18, 0, -18, 0] } : { rotate: 0 }} transition={{ duration: 1.4, repeat: wave ? Infinity : 0, repeatDelay: 0.8 }}>
        <path d={armsUp || wave ? "M96 76 Q118 52 106 32 Q98 56 90 64 Z" : "M96 60 Q114 80 104 104 Q94 88 90 80 Z"} fill="#4A30C4" />
      </motion.g>
      <rect x="22" y="20" width="76" height="98" rx="36" fill={`url(#b${id})`} />
      <ellipse cx="60" cy="96" rx="24" ry="19" fill="#E9E3FF" opacity="0.9" />
      <path d="M50 92 q4 4 8 0 q4 4 8 0 q4 4 8 0 M48 102 q4 4 8 0 q4 4 8 0 q4 4 8 0" stroke="#B7A8F5" strokeWidth="2" fill="none" />
      <circle cx="45" cy="52" r="15" fill="#E9E3FF" /><circle cx="75" cy="52" r="15" fill="#E9E3FF" />
      <Eyes mood={mood} x1={45} x2={75} y={52} reduce={reduce} pupil="#2A1A6E" />
      <path d="M55 66 L60 76 L65 66 Z" fill="#FFB020" />
      {mood === "think" && <path d="M38 36 L52 40 M82 36 L68 40" stroke="#2A1A6E" strokeWidth="3" strokeLinecap="round" />}
      {/* graduation cap */}
      <path d="M36 22 L60 12 L84 22 L60 32 Z" fill="#14151D" /><path d="M78 24 V36" stroke="#FFB020" strokeWidth="2" /><circle cx="78" cy="37" r="2.5" fill="#FFB020" />
    </>;
  } else if (character === "nova") {
    art = <>
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2DD4BF" /><stop offset="1" stopColor="#0E8F8E" /></linearGradient>
        <radialGradient id={`h${id}`} cx="0.35" cy="0.3"><stop offset="0" stopColor="#fff" stopOpacity="0.55" /><stop offset="1" stopColor="#fff" stopOpacity="0.08" /></radialGradient>
      </defs>
      <path d="M86 112 Q114 112 110 86" stroke="#0E8F8E" strokeWidth="7" fill="none" strokeLinecap="round" />
      {arms("#0E8F8E", 8)}
      <rect x="24" y="64" width="72" height="54" rx="26" fill="#E6FFFB" />
      <rect x="24" y="64" width="72" height="54" rx="26" fill="none" stroke="#9EEDE2" strokeWidth="2" />
      <circle cx="60" cy="90" r="9" fill="#FE8500" /><path d="M60 84 l2 4 4 1 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -1 Z" fill="#fff" />
      <path d="M36 30 L32 10 L50 22 Z" fill="#0E8F8E" /><path d="M84 30 L88 10 L70 22 Z" fill="#0E8F8E" />
      <path d="M38 26 L36 15 L46 22 Z" fill="#FBCFE8" /><path d="M82 26 L84 15 L74 22 Z" fill="#FBCFE8" />
      <ellipse cx="60" cy="48" rx="32" ry="28" fill={`url(#b${id})`} />
      <Eyes mood={mood} x1={47} x2={73} y={46} reduce={reduce} pupil="#053B3A" />
      <path d="M57 58 L63 58 L60 61 Z" fill="#FB7185" />
      <Mouth mood={mood} y={63} color="#053B3A" />
      <path d="M30 56 L18 54 M30 60 L18 62 M90 56 L102 54 M90 60 L102 62" stroke="#053B3A" strokeWidth="1.6" strokeLinecap="round" />
      {/* helmet */}
      <circle cx="60" cy="48" r="44" fill={`url(#h${id})`} stroke="#B9F5EC" strokeWidth="2.5" />
      <motion.path d="M100 14 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5 Z" fill="#FFD08A" animate={reduce ? undefined : { opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ transformOrigin: "100px 19px" }} />
    </>;
  } else if (character === "rocco") {
    art = <>
      <defs><linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8B92A3" /><stop offset="1" stopColor="#4B5161" /></linearGradient></defs>
      {/* striped tail */}
      <g transform="rotate(-25 98 104)"><rect x="90" y="84" width="16" height="40" rx="8" fill="#4B5161" /><rect x="90" y="94" width="16" height="6" fill="#1F232C" /><rect x="90" y="108" width="16" height="6" fill="#1F232C" /></g>
      {arms("#3A3F4C", 8)}
      <path d="M30 34 L28 14 L46 26 Z" fill="#4B5161" /><path d="M90 34 L92 14 L74 26 Z" fill="#4B5161" />
      <rect x="22" y="22" width="76" height="96" rx="34" fill={`url(#b${id})`} />
      <ellipse cx="60" cy="98" rx="20" ry="16" fill="#D9DCE3" />
      {/* bandit mask */}
      <path d="M28 52 Q44 38 60 50 Q76 38 92 52 Q86 64 74 62 Q60 56 46 62 Q34 64 28 52 Z" fill="#1F232C" />
      <Eyes mood={mood} x1={45} x2={75} y={52} reduce={reduce} dark />
      <ellipse cx="60" cy="68" rx="14" ry="9" fill="#EEF0F4" />
      <ellipse cx="60" cy="64" rx="4" ry="3" fill="#1F232C" />
      <Mouth mood={mood} y={70} color="#1F232C" />
      {/* backwards cap */}
      <path d="M32 30 Q60 6 88 30 Z" fill="#FE8500" /><rect x="22" y="27" width="20" height="6" rx="3" fill="#E06A00" />
      <circle cx="60" cy="16" r="2.5" fill="#E06A00" />
      {mood === "cheer" && <text x="96" y="30" fontSize="16" fontWeight="800" fill="#16A34A">$</text>}
    </>;
  } else {
    art = <>
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4D8DFF" /><stop offset="1" stopColor="#105BFF" /></linearGradient>
        <radialGradient id={`g${id}`}><stop offset="0" stopColor="#FFD08A" /><stop offset="1" stopColor="#FE8500" /></radialGradient>
      </defs>
      <line x1="60" y1="22" x2="60" y2="8" stroke="#105BFF" strokeWidth="4" strokeLinecap="round" />
      <motion.circle cx="60" cy="7" r="6" fill={`url(#g${id})`} animate={reduce ? undefined : { scale: [1, 1.25, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ transformOrigin: "60px 7px" }} />
      {arms("#105BFF")}
      <rect x="20" y="22" width="80" height="96" rx="34" fill={`url(#b${id})`} />
      <rect x="30" y="36" width="60" height="44" rx="20" fill="#14151D" />
      <Eyes mood={mood} x1={46} x2={74} y={56} reduce={reduce} dark />
      <Mouth mood={mood} y={68} />
      <circle cx="38" cy="68" r="3" fill="#FE8500" opacity="0.5" /><circle cx="82" cy="68" r="3" fill="#FE8500" opacity="0.5" />
      <circle cx="60" cy="98" r="9" fill="#fff" opacity="0.18" />
      <path d="M56 101 L60 93 L64 101" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>;
  }

  return (
    <motion.svg viewBox="0 0 120 130" width={size} height={size * (130 / 120)} className={cn("shrink-0 overflow-visible", className)} role="img" aria-label={label}
      animate={reduce ? undefined : { y: mood === "cheer" ? [0, -8, 0] : [0, -3, 0] }} transition={{ duration: mood === "cheer" ? 0.6 : 2.6, repeat: Infinity, ease: "easeInOut" }}>
      <ellipse cx="60" cy="126" rx="30" ry="4" fill="currentColor" opacity="0.12" />
      {art}
      {mood === "think" && <g fill="currentColor" opacity="0.45"><circle cx="106" cy="24" r="3" /><circle cx="114" cy="13" r="4.5" /></g>}
    </motion.svg>
  );
}

/** Backwards-compatible name for the default character. */
export function Pip(props: { mood?: Mood; size?: number; className?: string; character?: CharacterId }) {
  return <Buddy {...props} />;
}

/** A character with a speech bubble. */
export function BuddySays({ character, mood = "happy", size = 88, children, className }: { character?: CharacterId; mood?: Mood; size?: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-end gap-3", className)}>
      <Buddy character={character} mood={mood} size={size} />
      <AnimatePresence mode="wait">
        <motion.div key={String(children).slice(0, 40)} initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          className="relative mb-6 min-w-0 rounded-2xl rounded-bl-sm bg-fg/[0.06] px-4 py-3 text-[15px] leading-snug ring-1 ring-fg/10">
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export const PipSays = BuddySays;
