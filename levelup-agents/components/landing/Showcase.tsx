"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, FileText, LineChart } from "lucide-react";
import { useState } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

const TABS = [
  { id: "calendar", label: "Content calendar", icon: CalendarDays, blurb: "See every post for the week. Drag to move one. Agents fill the gaps." },
  { id: "script", label: "Script editor", icon: FileText, blurb: "Every script opens with a hook, says one thing, and sounds like you." },
  { id: "perf", label: "Performance", icon: LineChart, blurb: "Views, watch time and followers in one place, with what to do next." },
] as const;

function CalendarMock() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const posts: [number, string, "tiktok" | "instagram" | "youtube" | "facebook"][] = [[0, "Meet the team", "tiktok"], [1, "Before & after", "instagram"], [1, "FAQ answers", "youtube"], [2, "Packing orders", "tiktok"], [3, "Weekend special", "facebook"], [4, "Customer story", "instagram"]];
  return (
    <div className="grid grid-cols-5 gap-2">
      {days.map((d, di) => (
        <div key={d} className="min-h-[220px] rounded-xl bg-fg/[0.03] p-2">
          <p className="mb-2 text-xs font-semibold text-muted">{d}</p>
          {posts.filter((p) => p[0] === di).map(([, t, pl], i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (di + i) * 0.06 }} className="mb-2 rounded-lg hairline bg-bg-2 p-2 text-[11px] leading-tight">
              <PlatformIcon name={pl} size={13} /><p className="mt-1 font-medium">{t}</p>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
function ScriptMock() {
  const lines = [["Hook (0–3s)", "Nobody tells you this about opening a café at 6am…"], ["Beat 1", "Show the empty street and the first espresso shot."], ["Beat 2", "Three fast cuts: pastries, regulars, the line forming."], ["Close", "“See you tomorrow.” Text on screen: open 6am–2pm."]];
  return (
    <div className="space-y-3">
      {lines.map(([k, v], i) => (
        <motion.div key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i, ease }} className="rounded-xl bg-fg/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet">{k}</p><p className="mt-1">{v}</p>
        </motion.div>
      ))}
      <p className="text-xs text-muted">Tone: friendly · Length: 18s · Platform: TikTok</p>
    </div>
  );
}
function PerfMock() {
  const bars = [32, 48, 41, 63, 58, 77, 92];
  return (
    <div>
      <div className="flex h-[200px] items-end gap-3">
        {bars.map((h, i) => (
          <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, ease, delay: i * 0.06 }} className="flex-1 rounded-t-lg bg-accent opacity-80" />
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-fg/[0.03] p-4 text-sm"><b>Next step:</b> <span className="text-muted">before-and-after posts got the most watch time. Two more are planned for next week.</span></p>
    </div>
  );
}

export function Showcase() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("calendar");
  const current = TABS.find((t) => t.id === tab)!;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div role="tablist" aria-label="Product views" className="flex gap-2 overflow-x-auto lg:flex-col">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = t.id === tab;
          return (
            <button key={t.id} role="tab" aria-selected={on} aria-controls="showcase-panel" onClick={() => setTab(t.id)} className={cn("relative shrink-0 rounded-2xl px-5 py-4 text-left transition-colors", on ? "text-fg" : "text-muted hover:text-fg")}>
              {on && <motion.span layoutId="tab-bg" className="absolute inset-0 rounded-2xl glass" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
              <span className="relative flex items-center gap-3 font-semibold"><Icon size={18} aria-hidden /> {t.label}</span>
              <span className="relative mt-1 hidden text-sm text-muted lg:block">{t.blurb}</span>
            </button>
          );
        })}
      </div>
      <div id="showcase-panel" role="tabpanel" aria-label={current.label} className="glass min-h-[340px] rounded-[24px] p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between"><p className="font-display text-lg font-bold">{current.label}</p><span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Example</span></div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }} className="overflow-x-auto">
            <div className="min-w-[460px]">{tab === "calendar" ? <CalendarMock /> : tab === "script" ? <ScriptMock /> : <PerfMock />}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
