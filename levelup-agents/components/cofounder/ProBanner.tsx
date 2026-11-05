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
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[20px] p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber/15 text-amber"><Crown size={18} aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{freeDone >= 3 ? `You've outgrown Free, ${ws.profile?.founder || "founder"}` : `Build ${startup} with the full team`}</p>
          <p className="mt-0.5 text-sm text-muted">{freeDone >= 3 ? "Pricing, selling, launching and raising are where startups win or lose. Pro covers all of it." : "Free gets you started. Pro gets you to customers, revenue and investors."}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">{perks.map((p) => <li key={p.text} className="flex items-start gap-2.5 text-sm"><p.icon size={15} className="mt-0.5 shrink-0 text-amber" aria-hidden />{p.text}</li>)}</ul>
      <div className="mt-4 flex items-center gap-3">
        <Link href="/app/upgrade" className="btn-play flex-1 justify-center py-3 text-sm">See LevelUp Pro</Link>
        <p className="web-only shrink-0 text-sm text-muted"><b className="text-fg">$9</b>/mo</p>
      </div>
      <p className="mt-2.5 flex items-center gap-1 text-xs text-muted"><Check size={12} className="text-good" aria-hidden /> You keep everything you&apos;ve built on Free</p>
    </motion.section>
  );
}
