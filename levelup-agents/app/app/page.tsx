"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ActivityFeed } from "@/components/app/ActivityFeed";
import { KpiCard } from "@/components/app/KpiCard";
import { SampleTag } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { KPIS } from "@/lib/mock/kpis";
import { fadeUp, stagger } from "@/lib/motion";
import { useFakeLoad } from "@/lib/useFakeLoad";
import dynamic from "next/dynamic";

// Recharts is heavy, so the chart loads in its own chunk after the page is interactive.
const PerformanceChart = dynamic(() => import("@/components/app/PerformanceChart").then((m) => m.PerformanceChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px]" />,
});

export default function Dashboard() {
  const ready = useFakeLoad();
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Good morning</p>
          <h2 className="font-display text-3xl font-bold">Here's your week so far</h2>
        </div>
        <SampleTag />
      </div>

      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[124px]" />)}</div>
      ) : (
        <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {KPIS.map((k) => <motion.div key={k.label} variants={fadeUp}><KpiCard {...k} /></motion.div>)}
        </motion.div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <GlassCard glow={false} className="p-5 sm:p-6">
          <div className="mb-2 flex items-center justify-between"><h3 className="font-sans text-base font-semibold tracking-normal">Views by platform</h3><span className="text-xs text-muted">Last 14 days</span></div>
          {ready ? <PerformanceChart /> : <Skeleton className="h-[300px]" />}
        </GlassCard>
        <GlassCard glow={false} className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between"><h3 className="font-sans text-base font-semibold tracking-normal">Agent activity</h3><span className="flex items-center gap-1.5 text-xs text-good"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-good" /> Live demo</span></div>
          {ready ? <ActivityFeed /> : <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>}
        </GlassCard>
      </div>

      <GlassCard className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div><p className="font-display text-xl font-bold">Next up: Optimize agent's suggestion</p><p className="mt-1 text-muted">Before-and-after posts got the most watch time. Plan two more for next week?</p></div>
        <Link href="/app/calendar" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Open calendar <ArrowRight size={16} aria-hidden /></Link>
      </GlassCard>
    </div>
  );
}
