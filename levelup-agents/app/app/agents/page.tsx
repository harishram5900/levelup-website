"use client";
import { motion } from "framer-motion";
import { Check, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { AGENTS, WORLDS } from "@/lib/agents";
import { AGENT_STYLE } from "@/components/cofounder/AgentLayouts";
import { isProAgent, usePlan } from "@/lib/cofounder/plan";
import { useWorkspace } from "@/lib/cofounder/profile";
import { Icon3D } from "@/components/ui/Icon3D";

/** All 12 agents in one place, grouped by world. This is the "Agents" tab in the mobile app. */
export default function AgentsPage() {
  const { ws, ready } = useWorkspace();
  const { pro } = usePlan();
  if (!ready) return null;
  const done = AGENTS.filter((a) => ws.results[a.id]).length;
  return (
    <div className="mx-auto max-w-[1100px] space-y-7">
      <div>
        <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">Your agents</h2>
        <p className="mt-2 text-muted">{done} of {AGENTS.length} quests complete. Each agent builds on what the others worked out.</p>
        <div className="neo-in mt-3 h-3 overflow-hidden rounded-full"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(done / AGENTS.length) * 100}%` }} /></div>
      </div>
      {WORLDS.map((w, wi) => (
        <section key={w.name}>
          <p className="kicker">World {wi + 1} · {w.name}</p>
          <p className="mb-3 text-sm text-muted">{w.line}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.filter((a) => a.world === wi).map((a, i) => {
              const Icon = a.icon;
              const st = AGENT_STYLE[a.id];
              const locked = isProAgent(a.id) && !pro;
              const complete = !!ws.results[a.id];
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link href={locked ? "/app/upgrade" : `/app/agents/${a.id}`} className="glass group flex items-center gap-4 rounded-[20px] p-4 transition active:scale-[0.98]">
                    <Icon3D icon={Icon} color={st.color} size={52} state={locked ? "locked" : "idle"} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-semibold">{a.name} agent{complete && <Check size={15} className="text-good" aria-label="complete" />}{locked && <Lock size={13} className="text-amber" aria-label="Pro" />}</span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{a.stage}</span>
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-muted transition group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
