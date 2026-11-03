"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, spring, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Pricing is a placeholder until launch. Yearly = 2 months free.
const TIERS = [
  { name: "Starter", monthly: 29, plus: false, for: "Solo founders and local shops getting consistent.", features: ["All 6 agents", "2 platforms", "Up to 12 posts a month", "Weekly plan and results"] },
  { name: "Growth", monthly: 99, plus: false, featured: true, for: "Businesses ready to post every day.", features: ["Everything in Starter", "All 4 platforms", "Up to 60 posts a month", "Trend alerts", "Brand voice training"] },
  { name: "Scale", monthly: 499, plus: true, for: "Brands with high volume or many locations.", features: ["Everything in Growth", "Usage-based posting volume", "Multiple brands", "Priority support"] },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div>
      <div className="mb-12 flex flex-col items-center gap-4">
        <Badge tone="good">Free during beta</Badge>
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
                  <span className="text-sm text-muted">{t.plus ? "from " : ""}</span>
                  <motion.span key={price} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>${price}</motion.span>
                  <span className="mb-1.5 text-muted">/mo{t.plus ? "+" : ""}</span>
                </div>
                <p className="mt-1 h-5 text-xs text-muted">{yearly ? `Billed yearly at $${t.monthly * 10}${t.plus ? "+" : ""}` : "Billed monthly"}</p>
                <a href="#waitlist" className={cn("mt-6 block rounded-full py-3 text-center font-semibold transition-transform hover:-translate-y-0.5", t.featured ? "bg-cta" : "hairline")}>Join waitlist</a>
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
