import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * LevelUp mark: a flat square with a bold "L" and a raised step in negative space.
 * The L is the base; the step above it is the next level. One color, no effects,
 * so it works at 16px, in print and in a single color.
 */
export function LogoMark({ size = 30, className, mono }: { size?: number; className?: string; mono?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className={cn("shrink-0", className)}>
      <rect width="40" height="40" rx="9" fill={mono ? "currentColor" : "rgb(var(--violet))"} />
      <path d="M10 9h6v16h14v6H10z" fill={mono ? "rgb(var(--bg))" : "#fff"} />
      <path d="M22 9h8v8h-8z" fill={mono ? "rgb(var(--bg))" : "#fff"} />
    </svg>
  );
}

/** The "levelup" wordmark: lowercase, heavy and tightly set. */
export function Wordmark({ className }: { className?: string }) {
  return <span className={cn("font-brand text-[1.3rem] font-extrabold leading-none tracking-[-0.055em] text-fg", className)}>levelup</span>;
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)} aria-label="LevelUp home">
      <LogoMark />
      <Wordmark />
    </Link>
  );
}
