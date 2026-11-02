"use client";
import { motion } from "framer-motion";
import { AGENTS } from "@/lib/agents";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { GlassCard } from "@/components/ui/GlassCard";

export function AgentGrid() {
  return (
    <motion.ul variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {AGENTS.map((a) => {
        const Icon = a.icon;
        return (
          <motion.li key={a.id} variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
            <GlassCard className="h-full p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-fg/[0.06] text-fg transition-colors duration-300 group-hover:bg-accent group-hover:text-white"><Icon size={20} aria-hidden /></span>
                <span className="text-xs font-medium text-muted">{a.role}</span>
              </div>
              <h3 className="text-xl font-bold">{a.name} agent</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{a.line}</p>
            </GlassCard>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
