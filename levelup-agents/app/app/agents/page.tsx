"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { SampleTag } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Switch } from "@/components/ui/Switch";
import { AGENTS, type AgentId } from "@/lib/agents";
import { AGENT_STATUS } from "@/lib/mock/agentStatus";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const [on, setOn] = useState<Record<AgentId, boolean>>(() => Object.fromEntries(AGENTS.map((a) => [a.id, AGENT_STATUS[a.id].active])) as Record<AgentId, boolean>);
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="font-display text-3xl font-bold">Your agents</h2><p className="mt-1 text-muted">Pause any agent at any time. Everything else keeps working.</p></div>
        <SampleTag />
      </div>
      <motion.ul variants={stagger(0.06)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AGENTS.map((a) => {
          const s = AGENT_STATUS[a.id];
          const active = on[a.id];
          const Icon = a.icon;
          return (
            <motion.li key={a.id} variants={fadeUp}>
              <GlassCard className={cn("h-full p-5 transition-opacity", !active && "opacity-70")}>
                <div className="flex items-center gap-3">
                  <span className={cn("grid h-11 w-11 place-items-center rounded-xl transition-colors", active ? "bg-accent text-white" : "bg-fg/10 text-muted")}><Icon size={20} aria-hidden /></span>
                  <div className="flex-1"><p className="font-semibold">{a.name}</p><p className="text-xs text-muted">{a.role}</p></div>
                  <Switch checked={active} onChange={(v) => setOn({ ...on, [a.id]: v })} label={`${active ? "Pause" : "Resume"} ${a.name} agent`} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className={cn("h-2 w-2 rounded-full", active ? "bg-good" : "bg-amber")} />
                  <span className={active ? "text-good" : "text-amber"}>{active ? "Running" : "Paused"}</span>
                  <span className="text-muted">· last run {s.lastRun} · {s.done} tasks this week</span>
                </div>
                <div className="mt-4 rounded-xl bg-fg/[0.04] p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Latest output</p>
                  <p className="mt-1 text-sm">{s.output}</p>
                </div>
              </GlassCard>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
