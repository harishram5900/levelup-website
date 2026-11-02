import Link from "next/link";

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <linearGradient id="lg-mark" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="rgb(var(--violet))" />
          <stop offset="1" stopColor="rgb(var(--cyan))" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lg-mark)" />
      <path d="M9 22h5M13 17h5M17 12h6" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20 9l3 3-3 3" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight" aria-label="LevelUp home">
      <LogoMark />
      LevelUp
    </Link>
  );
}
