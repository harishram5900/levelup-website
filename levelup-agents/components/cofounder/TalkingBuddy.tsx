"use client";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LineId } from "@/lib/cofounder/lines";
import { chirp, hush, onSpeaking, say } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { Buddy, characterById, type CharacterId, type Mood } from "./Pip";

/** A character you can tap: it chirps, then talks. Bobs and glows while speaking. */
export function TalkingBuddy({ character, line = "hello", mood = "happy", size = 64, className, hint }: { character: CharacterId; line?: LineId; mood?: Mood; size?: number; className?: string; hint?: boolean }) {
  const [talking, setTalking] = useState(false);
  useEffect(() => onSpeaking((c) => setTalking(c === character)), [character]);
  const c = characterById(character);
  const tap = () => {
    if (talking) { hush(); return; }
    chirp(character);
    setTimeout(() => void say(character, line), 380);
  };
  return (
    <button type="button" onClick={tap} aria-label={talking ? `Stop ${c.name}` : `Hear ${c.name}`} className={cn("group relative shrink-0 rounded-full", className)}>
      {talking && <motion.span aria-hidden className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 3px ${c.color}55` }} animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.4, 0.9] }} transition={{ duration: 0.9, repeat: Infinity }} />}
      <motion.span className="block" animate={talking ? { y: [0, -3, 0], rotate: [0, -2, 2, 0] } : { y: 0 }} transition={talking ? { duration: 0.45, repeat: Infinity } : undefined}>
        <Buddy character={character} mood={talking ? "cheer" : mood} size={size} />
      </motion.span>
      {hint && !talking && (
        <span aria-hidden className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-bg-2 text-fg shadow-md ring-1 ring-fg/10 transition group-hover:scale-110"><Volume2 size={13} /></span>
      )}
    </button>
  );
}
