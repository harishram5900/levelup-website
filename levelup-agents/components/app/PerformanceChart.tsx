"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useReducedMotion } from "framer-motion";
import { PERFORMANCE } from "@/lib/mock/performance";

const SERIES = [
  { key: "tiktok", name: "TikTok", color: "rgb(var(--violet))" },
  { key: "reels", name: "Reels", color: "rgb(var(--cyan))" },
  { key: "shorts", name: "Shorts", color: "rgb(var(--amber))" },
  { key: "facebook", name: "Facebook", color: "rgb(var(--good))" },
] as const;

export function PerformanceChart() {
  const reduce = useReducedMotion();
  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs text-muted" aria-label="Legend">
        {SERIES.map((s) => <li key={s.key} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}</li>)}
      </ul>
      <div className="h-[280px] w-full" role="img" aria-label="Sample chart: views per platform over two weeks, rising overall">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PERFORMANCE} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="rgb(var(--line) / 0.07)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "rgb(var(--muted))", fontSize: 11 }} tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fill: "rgb(var(--muted))", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip contentStyle={{ background: "rgb(var(--bg-2))", border: "1px solid rgb(var(--line) / 0.1)", borderRadius: 12, color: "rgb(var(--fg))", fontSize: 12 }} />
            {SERIES.map((s, i) => (
              <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} fill={`url(#g-${s.key})`}
                isAnimationActive={!reduce} animationDuration={1400} animationBegin={i * 150} animationEasing="ease-out" />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
