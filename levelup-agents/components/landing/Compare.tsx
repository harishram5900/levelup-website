import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const ROWS = [
  ["Time to first post", "Weeks of onboarding, briefs and calls", "Same day: tell us your brand, get a plan"],
  ["Your effort", "Write briefs, chase drafts, approve by email", "Approve or tweak in one tap"],
  ["Cost", "A monthly retainer most small businesses can't afford", "A simple plan, free during beta"],
  ["Speed on trends", "Slow, because ideas wait for the next meeting", "Daily: agents watch trends as they happen"],
  ["Learning from results", "A report at the end of the month", "Every post's results shape the next plan"],
];

export function Compare() {
  return (
    <Reveal>
      <div className="glass overflow-hidden rounded-[24px]">
        <div className="grid grid-cols-[1fr_1fr] border-b border-fg/[0.07] text-sm font-semibold sm:grid-cols-[200px_1fr_1fr]">
          <div className="hidden p-5 sm:block" />
          <div className="p-5 text-muted">A typical agency</div>
          <div className="relative p-5"><span className="text-gradient">LevelUp</span></div>
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
