"use client";
import { motion } from "framer-motion";
import { Bot, Check, Crown, Layers, Lock, PhoneCall, Sparkles } from "lucide-react";
import Link from "next/link";
import { AGENTS } from "@/lib/agents";
import { isProAgent } from "@/lib/cofounder/plan";
import { useWorkspace } from "@/lib/cofounder/profile";
import { Buddy, characterById } from "./Pip";

/** Dashboard upsell for free users: shows exactly what Pro would unlock for THEIR startup. */
export function ProBanner() {
  const { ws } = useWorkspace();
  const buddy = characterById(ws.prefs.character);
  const freeDone = AGENTS.filter((a) => !isProAgent(a.id) && ws.results[a.id]).length;
  const locked = AGENTS.filter((a) => isProAgent(a.id));
  const startup = ws.profile?.startup ?? "your startup";
  const perks = [
    { icon: Bot, text: `${buddy.name} as your AI co-founder, remembering everything about ${startup}` },
    { icon: PhoneCall, text: "A 1:1 call with Harish, LevelUp's founder" },
    { icon: Sparkles, text: `${locked.length} more agents: ${locked.map((a) => a.name).join(", ")}` },
    { icon: Layers, text: "Pitch deck designer + full plans with Pro deep dives" },
  ];
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[28px] p-6 text-white sm:p-7" style={{ background: "linear-gradient(120deg, #1a1100 0%, #3b2300 40%, #0B1030 100%)" }}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber/30 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber"><Crown size={14} aria-hidden /> LevelUp Pro</p>
          <h3 className="mt-2 font-display text-3xl leading-tight">{freeDone >= 3 ? `You've outgrown Free, ${ws.profile?.founder || "founder"}.` : `Build ${startup} with the full team.`}</h3>
          <p className="mt-1 text-white/75">{freeDone >= 3 ? `You've finished ${freeDone} free agents. The next steps (pricing, selling, launching, raising) are where startups win or lose.` : "Free gets you started. Pro gets you to customers, revenue and investors."}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">{perks.map((p) => <li key={p.text} className="flex items-start gap-2 text-sm"><p.icon size={16} className="mt-0.5 shrink-0 text-amber" aria-hidden />{p.text}</li>)}</ul>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/[0.06] p-5 text-center ring-1 ring-white/10 lg:w-64">
          <Buddy character={ws.prefs.character} mood="cheer" size={72} className="text-white" />
          <p className="web-only"><span className="font-display text-4xl">$9</span><span className="text-white/60">/month</span></p>
          <p className="-mt-2 text-xs text-white/60">Less than $0.30 a day</p>
          <Link href="/app/upgrade" className="btn-play w-full justify-center"><Crown size={16} aria-hidden /> Unlock Pro</Link>
          <Link href="/app/upgrade#promo" className="web-only text-xs text-white/60 hover:text-white">Have a promo code?</Link>
        </div>
      </div>
      <div className="relative mt-5 flex flex-wrap gap-2">{locked.map((a) => <span key={a.id} className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs"><Lock size={11} aria-hidden />{a.name}</span>)}<span className="flex items-center gap-1 rounded-full bg-good/20 px-2.5 py-1 text-xs text-good"><Check size={11} aria-hidden />Keep all your free progress</span></div>
    </motion.section>
  );
}
