import { Bell, Lock, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

export function NurtureTeaser() {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[28px] glass p-8 sm:p-12">
        <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber/20 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Badge tone="amber">Coming soon</Badge>
            <h2 className="mt-5 text-5xl sm:text-7xl">Nurture Flow</h2>
            <p className="mt-4 max-w-lg text-lg text-muted">Your content brings people in. Nurture Flow will find the leads among them and follow up with messages made for each one, so interest turns into customers.</p>
            <a href="#waitlist" className="mt-7 inline-flex items-center gap-2 rounded-full hairline px-5 py-3 font-semibold transition-colors hover:bg-fg/5"><Bell size={16} aria-hidden /> Get notified</a>
          </div>
          <div className="relative space-y-3 opacity-80 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" aria-hidden>
            {["New lead from your Reel", "Asked about weekend hours", "Clicked your menu link"].map((t, i) => (
              <div key={t} className="flex items-center gap-3 rounded-2xl bg-fg/[0.04] p-4 blur-[0.4px]" style={{ marginLeft: i * 18 }}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-fg/10"><Users size={16} /></span>
                <span className="flex-1 text-sm">{t}</span><Lock size={14} className="text-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
