"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, spring, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Prices are placeholders until launch. Yearly = 2 months free. "Schools & clubs" is per student.
const TIERS = [
  { name: "Student", monthly: 0, plus: false, for: "For student founders building their first startup.", features: ["7 co-founder agents (starter plans)", "Startup HQ, XP, badges and leaderboards", "Playbooks from top founders", "Competitions, grants and free credits"] },
  { name: "Pro", monthly: 9, plus: false, featured: true, for: "For founders ready to pitch, sell and raise.", features: ["AI co-founder chat that remembers you", "1:1 call with the founder", "Full plans + Pro deep dives on all 12 agents", "Pitch deck designer, Launch Galaxy and investor list"] },
  { name: "Schools & clubs", monthly: 3, plus: true, for: "For schools, clubs and programs that teach entrepreneurship.", features: ["Pro for every student", "Teacher dashboard (coming soon)", "Cohort progress tracking", "Per-student pricing"] },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div>
      <div className="mb-12 flex flex-col items-center gap-4">
        <Badge tone="good">Start free. Upgrade when you're ready to pitch.</Badge>
        <div role="radiogroup" aria-label="Billing period" className="relative flex rounded-full hairline p-1">
          {(["Monthly", "Yearly"] as const).map((p) => {
            const on = (p === "Yearly") === yearly;
            return (
              <button key={p} role="radio" aria-checked={on} onClick={() => setYearly(p === "Yearly")} className={cn("relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors", on ? "text-white" : "text-muted")}>
                {on && <motion.span layoutId="bill" transition={spring} className="absolute inset-0 -z-10 rounded-full bg-accent" />}
                {p}{p === "Yearly" && <span className="ml-1.5 text-xs opacity-80">2 months free</span>}
              </button>
            );
          })}
        </div>
      </div>
      <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-5 md:grid-cols-3">
        {TIERS.map((t) => {
          const price = yearly ? Math.round((t.monthly * 10) / 12) : t.monthly;
          return (
            <motion.div key={t.name} variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
              <GlassCard className={cn("h-full p-7", t.featured && "ring-1 ring-violet/50")}>
                <div className="flex items-center justify-between"><h3 className="text-2xl font-bold">{t.name}</h3>{t.featured && <Badge tone="accent">Most popular</Badge>}</div>
                <p className="mt-2 min-h-[48px] text-sm text-muted">{t.for}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-sm text-muted">{t.plus ? "per student " : ""}</span>
                  <motion.span key={price} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>${price}</motion.span>
                  <span className="mb-1.5 text-muted">{t.monthly === 0 ? "forever" : "/mo"}</span>
                </div>
                <p className="mt-1 h-5 text-xs text-muted">{t.monthly === 0 ? "No card needed" : yearly ? `Billed yearly at $${t.monthly * 10}` : "Billed monthly"}</p>
                <a href={t.monthly === 0 ? "/signup" : t.plus ? "#waitlist" : "/app/upgrade"} className={cn("mt-6 block rounded-full py-3 text-center font-semibold transition-transform hover:-translate-y-0.5", t.featured ? "bg-cta" : "hairline")}>{t.monthly === 0 ? "Start free" : t.plus ? "Join waitlist" : "Get Pro"}</a>
                <ul className="mt-7 space-y-3 text-[15px]">
                  {t.features.map((f) => <li key={f} className="flex gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-good" aria-hidden />{f}</li>)}
                </ul>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
