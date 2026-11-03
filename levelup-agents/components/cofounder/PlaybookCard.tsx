import { BookOpen, Quote } from "lucide-react";
import type { Playbook } from "@/lib/cofounder/playbooks";
import { cn } from "@/lib/utils";

export function PlaybookCard({ p, compact, className }: { p: Playbook; compact?: boolean; className?: string }) {
  return (
    <article className={cn("rounded-2xl bg-fg/[0.04] p-4 ring-1 ring-fg/[0.06]", className)}>
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-sm font-bold text-white" aria-hidden>{p.who.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
        <div className="min-w-0"><p className="truncate text-sm font-semibold">{p.who}</p><p className="truncate text-xs text-muted">{p.known}</p></div>
      </div>
      <h4 className="mt-3 font-display text-2xl uppercase leading-none">{p.title}</h4>
      {p.quote && <p className="mt-2 flex gap-1.5 text-[15px] italic"><Quote size={14} className="mt-1 shrink-0 text-amber" aria-hidden />{p.quote}</p>}
      {!compact && <p className="mt-2 text-sm text-muted">{p.idea}</p>}
      <p className="mt-3 rounded-xl bg-amber/10 px-3 py-2 text-sm"><b className="text-amber">Do this:</b> {p.action}</p>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted"><BookOpen size={11} aria-hidden /> {p.source}</p>
    </article>
  );
}
