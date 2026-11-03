import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { OPPORTUNITIES } from "@/lib/cofounder/opportunities";

export default function OpportunitiesPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <h2 className="font-display text-5xl uppercase">Opportunities</h2>
      <p className="mt-2 max-w-2xl text-muted">Competitions, hackathons and programs young founders can apply to. Dates and eligibility change every year, so always check the official site before you apply.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {OPPORTUNITIES.map((o) => (
          <GlassCard key={o.name} className="h-full p-6">
            <div className="flex items-start justify-between gap-3"><h3 className="font-display text-3xl uppercase leading-none">{o.name}</h3><Badge tone="accent">{o.type}</Badge></div>
            <p className="mt-2 text-sm font-semibold text-amber">{o.who}</p>
            <p className="mt-3 text-[15px] text-muted">{o.what}</p>
            <a href={o.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet hover:underline">Official site <ExternalLink size={14} aria-hidden /></a>
          </GlassCard>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">Tip: run the Pitch agent before you apply. Most applications ask for a one-liner, a short pitch and your progress so far.</p>
    </div>
  );
}
