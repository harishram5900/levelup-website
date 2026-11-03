"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Buddy, CHARACTERS, type CharacterId } from "@/components/cofounder/Pip";
import { cn } from "@/lib/utils";

/** Landing section: meet the five co-founder characters. */
export function CharacterShowcase() {
  const [hover, setHover] = useState<CharacterId | null>(null);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {CHARACTERS.map((c, i) => (
        <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.08 }}
          onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)}
          className={cn("glass flex flex-col items-center rounded-[24px] p-5 text-center transition-transform hover:-translate-y-1", i === 4 && "col-span-2 sm:col-span-1")}>
          <div className="grid h-36 place-items-center rounded-2xl" style={{ background: `radial-gradient(circle at 50% 60%, ${c.color}33, transparent 70%)` }}>
            <Buddy character={c.id} mood={hover === c.id ? "cheer" : "wave"} size={104} />
          </div>
          <p className="mt-3 font-display text-3xl uppercase leading-none">{c.name}</p>
          <p className="text-sm font-semibold" style={{ color: c.color }}>{c.role}</p>
          <p className="mt-2 text-sm text-muted">{c.vibe}</p>
          <p className="mt-3 rounded-full bg-fg/[0.05] px-3 py-1 text-xs italic">&ldquo;{c.catchphrase}&rdquo;</p>
        </motion.div>
      ))}
    </div>
  );
}
