"use client";
import { Check, Crown, Lock } from "lucide-react";
import Link from "next/link";
import { PRO_FEATURES } from "@/lib/cofounder/plan";
import { useWorkspace } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";
import { Buddy, characterById } from "./Pip";

export function ProBadge({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center gap-0.5 rounded-md bg-gradient-to-r from-amber to-[#FFD08A] px-1.5 py-px text-[10px] font-extrabold uppercase tracking-wider text-[#1a1100]", className)}><Crown size={10} aria-hidden />Pro</span>;
}

/** Shown in place of a Pro feature for free users. */
export function ProGate({ title, line }: { title: string; line: string }) {
  const { ws } = useWorkspace();
  const buddy = characterById(ws.prefs.character);
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-[32px] p-6 text-white sm:p-10" style={{ background: "radial-gradient(120% 140% at 100% 0%, rgb(var(--violet)) 0%, rgb(var(--violet) / .55) 35%, #0B1030 100%)" }}>
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber/30 blur-3xl" aria-hidden />
        <div className="relative flex flex-col items-center text-center">
          <div className="relative">
            <Buddy character={ws.prefs.character} mood="think" size={110} className="text-white" />
            <span className="absolute -right-2 bottom-4 grid h-10 w-10 place-items-center rounded-full bg-amber text-[#1a1100] shadow-lg"><Lock size={18} aria-hidden /></span>
          </div>
          <ProBadge className="mt-4" />
          <h2 className="mt-3 font-display text-5xl uppercase leading-none sm:text-6xl">{title}</h2>
          <p className="mt-3 max-w-lg text-white/80">{line}</p>
          <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm ring-1 ring-white/15">
            <b className="text-amber">{buddy.name}:</b> This one's part of LevelUp Pro. Keep crushing the free quests, and unlock this when you're ready to pitch, sell and raise.
          </p>
          <Link href="/app/upgrade" className="btn-play mt-6 text-lg"><Crown size={18} aria-hidden /> See LevelUp Pro</Link>
          <Link href="/app/upgrade#promo" className="mt-3 text-sm text-white/75 underline-offset-2 hover:underline">Have a promo code?</Link>
        </div>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {PRO_FEATURES.map((f) => (
          <li key={f.title} className="glass flex gap-3 rounded-2xl p-4"><Check size={18} className="mt-0.5 shrink-0 text-good" aria-hidden /><span><b className="block text-sm">{f.title}</b><span className="text-sm text-muted">{f.line}</span></span></li>
        ))}
      </ul>
    </div>
  );
}
