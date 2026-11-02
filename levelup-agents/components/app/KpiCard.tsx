"use client";
import { TrendingUp } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { GlassCard } from "@/components/ui/GlassCard";

export function KpiCard({ label, value, delta, suffix = "", decimals = 0 }: { label: string; value: number; delta: number; suffix?: string; decimals?: number }) {
  return (
    <GlassCard className="p-5">
      <p className="text-sm text-muted">{label}</p>
      <CountUp to={value} suffix={suffix} decimals={decimals} className="mt-2 block font-display text-3xl font-bold" />
      <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-good"><TrendingUp size={13} aria-hidden /> +{delta}% vs last week</p>
    </GlassCard>
  );
}
