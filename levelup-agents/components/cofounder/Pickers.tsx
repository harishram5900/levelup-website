"use client";
import { chirp, say } from "@/lib/sound";
import { Check, Crown } from "lucide-react";
import Link from "next/link";
import { usePlan } from "@/lib/cofounder/plan";
import { PALETTES } from "@/lib/cofounder/palettes";
import type { PaletteId, Prefs } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";
import { Buddy, CHARACTERS } from "./Pip";

export function CharacterPicker({ value, onChange }: { value: Prefs["character"]; onChange: (c: Prefs["character"]) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" role="radiogroup" aria-label="Choose your co-founder">
      {CHARACTERS.map((c) => {
        const on = value === c.id;
        return (
          <button key={c.id} type="button" role="radio" aria-checked={on} onClick={() => { onChange(c.id); chirp(c.id); setTimeout(() => void say(c.id, "intro"), 380); }}
            className={cn("group relative flex flex-col items-center rounded-2xl p-3 pt-4 text-center transition", on ? "bg-violet/10 ring-2 ring-violet" : "bg-fg/[0.03] ring-1 ring-fg/10 hover:ring-fg/30")}>
            {on && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-violet text-white"><Check size={12} strokeWidth={3} aria-hidden /></span>}
            <Buddy character={c.id} mood={on ? "cheer" : "happy"} size={76} />
            <span className="mt-1 font-display text-2xl uppercase leading-none">{c.name}</span>
            <span className="text-xs font-semibold" style={{ color: c.color }}>{c.role}</span>
            <span className="mt-1 text-[11px] leading-snug text-muted">{c.vibe}</span>
          </button>
        );
      })}
    </div>
  );
}

export function PalettePicker({ value, onChange }: { value: PaletteId; onChange: (p: PaletteId) => void }) {
  const { pro } = usePlan();
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" role="radiogroup" aria-label="Dashboard colors">
      {PALETTES.map((p) => {
        const on = value === p.id;
        if (p.pro && !pro) return (
          <Link key={p.id} href="/app/upgrade" className="relative rounded-2xl p-2 text-center ring-2 ring-amber/40 transition hover:ring-amber" aria-label={`${p.name} theme (Pro)`}>
            <span className="flex h-12 overflow-hidden rounded-xl opacity-60"><span className="flex-[2]" style={{ background: `rgb(${p.primary})` }} /><span className="flex-1" style={{ background: `rgb(${p.secondary})` }} /><span className="flex-1" style={{ background: `rgb(${p.cta})` }} /></span>
            <span className="absolute left-1/2 top-5 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-amber text-[#1a1100]"><Crown size={12} aria-hidden /></span>
            <span className="mt-1.5 block text-xs font-semibold text-amber">{p.name}</span>
          </Link>
        );
        return (
          <button key={p.id} type="button" role="radio" aria-checked={on} onClick={() => onChange(p.id)}
            className={cn("rounded-2xl p-2 text-center ring-2 transition", on ? "ring-fg" : "ring-transparent hover:ring-fg/20")}>
            <span className="flex h-12 overflow-hidden rounded-xl">
              <span className="flex-[2]" style={{ background: `rgb(${p.primary})` }} />
              <span className="flex-1" style={{ background: `rgb(${p.secondary})` }} />
              <span className="flex-1" style={{ background: `rgb(${p.cta})` }} />
            </span>
            <span className="mt-1.5 block text-xs font-semibold">{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}
