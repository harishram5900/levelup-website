import { cn } from "@/lib/utils";

export function Badge({ children, tone = "default", className }: { children: React.ReactNode; tone?: "default" | "accent" | "amber" | "good"; className?: string }) {
  const tones = {
    default: "hairline bg-fg/[0.04] text-muted",
    accent: "border border-violet/30 bg-violet/10 text-violet",
    amber: "border border-amber/30 bg-amber/10 text-amber",
    good: "border border-good/30 bg-good/10 text-good",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider", tones[tone], className)}>{children}</span>;
}
