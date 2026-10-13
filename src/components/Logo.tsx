import { Link } from 'react-router-dom'

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lu-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#lu-g)" />
      <path d="M14 46h10V36h10V26h10V16" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 16h6v6" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="49" cy="46" r="6" fill="#fbbf24" />
    </svg>
  )
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="LevelUp home">
      <LogoMark className="h-9 w-9 transition-transform group-hover:-rotate-6" />
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        Level<span className={light ? 'text-sun-300' : 'text-brand-600'}>Up</span>
      </span>
    </Link>
  )
}
