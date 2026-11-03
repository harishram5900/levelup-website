import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const ROWS = [
  ["Getting started", "Search YouTube and blogs, then guess what to do first", "12 agents in 4 worlds, with a clear next step every day"],
  ["Feedback on your idea", "Friends and family say it's great", "Honest risks, plus tests you can run this week"],
  ["Pitch and applications", "Start from a blank page the night before", "One-liner, pitch and a 10-slide deck you can present or download"],
  ["Cost", "Mentors and courses most students can't afford", "Free for student founders"],
  ["Accountability", "Nobody notices when you stop", "A weekly check-in that keeps you shipping"],
];

export function Compare() {
  return (
    <Reveal>
      <div className="glass overflow-hidden rounded-[24px]">
        <div className="grid grid-cols-[1fr_1fr] border-b border-fg/[0.07] text-sm font-semibold sm:grid-cols-[200px_1fr_1fr]">
          <div className="hidden p-5 sm:block" />
          <div className="p-5 text-muted">Building alone</div>
          <div className="relative p-5"><span className="text-gradient">With LevelUp</span></div>
        </div>
        {ROWS.map(([k, a, b]) => (
          <div key={k} className="grid grid-cols-[1fr_1fr] border-b border-fg/[0.07] last:border-0 sm:grid-cols-[200px_1fr_1fr]">
            <div className="col-span-2 px-5 pt-5 text-xs font-semibold uppercase tracking-wider text-muted sm:col-span-1 sm:py-5 sm:text-sm sm:normal-case sm:tracking-normal sm:text-fg">{k}</div>
            <div className="flex gap-2.5 p-5 text-[15px] text-muted"><Minus size={16} className="mt-1 shrink-0" aria-hidden />{a}</div>
            <div className="flex gap-2.5 bg-violet/[0.04] p-5 text-[15px]"><Check size={16} className="mt-1 shrink-0 text-good" aria-hidden />{b}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
