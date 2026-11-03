import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * LevelUp mark: a rounded square with two stacked chevrons (a "rank up" insignia)
 * and a spark. Follows the user's dashboard colors through the CSS variables.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id={`m${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="rgb(var(--violet))" />
          <stop offset="1" stopColor="rgb(var(--cyan))" />
        </linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#m${id})`} />
      <rect width="40" height="40" rx="11" fill={`url(#s${id})`} />
      <path d="M11 27.5 20 19l9 8.5" stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M11 19.5 20 11l9 8.5" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="31" cy="9" r="3" fill="rgb(var(--amber))" />
    </svg>
  );
}

/** The "LevelUp" wordmark. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-brand text-[1.2rem] font-extrabold leading-none tracking-[-0.035em]", className)}>
      Level<span className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">Up</span>
    </span>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)} aria-label="LevelUp home">
      <LogoMark />
      <Wordmark />
    </Link>
  );
}
