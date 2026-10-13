import { AlertTriangle, BadgeCheck, Bookmark, CalendarDays, CheckCircle2, MapPin } from 'lucide-react'
import { CATEGORY_MAP } from '../data/options'
import { daysUntil, shortDate } from '../lib/format'
import { useStore } from '../lib/store'
import type { MatchedScholarship } from '../lib/types'

export function MatchRing({ score }: { score: number }) {
  const r = 18
  const c = 2 * Math.PI * r
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#6366f1' : '#f59e0b'
  return (
    <div className="relative h-12 w-12 shrink-0" title={`${score}% match`}>
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800">{score}%</span>
    </div>
  )
}

/** Shows the source's deadline wording, plus a countdown when a date is known or estimated. */
export function DeadlinePill({ s }: { s: Pick<MatchedScholarship, 'deadlineText' | 'deadlineDate' | 'deadlineExact'> }) {
  const d = daysUntil(s.deadlineDate)
  const urgent = d !== null && d <= 14
  const soon = d !== null && d <= 45
  const label = s.deadlineExact && s.deadlineDate ? shortDate(s.deadlineDate) : s.deadlineText
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${urgent ? 'text-rose-600' : soon ? 'text-amber-600' : 'text-slate-500'}`}>
      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
      <span className="line-clamp-1">
        {label}
        {d !== null && d <= 45 && ` · ${s.deadlineExact ? '' : '~'}${d === 0 ? 'today' : `${d}d left`}`}
      </span>
    </span>
  )
}

export default function ScholarshipCard({ s, onOpen }: { s: MatchedScholarship; onOpen: () => void }) {
  const { saved, toggleSaved, applied } = useStore()
  const isSaved = saved.includes(s.id)
  const isApplied = applied.includes(s.id)

  return (
    <article className="card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start gap-4">
        <MatchRing score={s.score} />
        <div className="min-w-0 flex-1">
          <button onClick={onOpen} className="text-left">
            <h3 className="font-sans text-base font-bold leading-snug text-slate-900 group-hover:text-brand-700">{s.name}</h3>
          </button>
          <p className="mt-0.5 truncate text-sm text-slate-500">{s.provider}</p>
        </div>
        <button
          onClick={() => toggleSaved(s.id)}
          className={`rounded-full p-2 transition-colors ${isSaved ? 'text-brand-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
          aria-label={isSaved ? 'Remove from saved' : 'Save scholarship'}
        >
          <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-display text-xl font-bold leading-tight text-slate-900">{s.amountText}</span>
        {s.verified && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600" title={s.verificationText}>
            <BadgeCheck className="h-3.5 w-3.5" /> Verified 2026
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {s.categories.slice(0, 3).map((c) => (
          <span key={c} className={`tag ${CATEGORY_MAP[c].color}`}>
            {CATEGORY_MAP[c].emoji} {CATEGORY_MAP[c].label}
          </span>
        ))}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{s.reasons[0]}</p>
      {s.warnings[0] && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-2">{s.warnings[0]}</span>
        </p>
      )}

      <div className="flex-1" />
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <div className="flex min-w-0 flex-col gap-1">
          <DeadlinePill s={s} />
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{s.locationText}</span>
          </span>
        </div>
        {isApplied ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Applied
          </span>
        ) : (
          <button onClick={onOpen} className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700">
            View details
          </button>
        )}
      </div>
    </article>
  )
}
