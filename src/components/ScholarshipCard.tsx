import { Bookmark, CalendarDays, CheckCircle2, FileText, RefreshCw } from 'lucide-react'
import { CATEGORY_MAP } from '../data/options'
import { amountLabel, daysUntil, deadlineLabel } from '../lib/format'
import { useStore } from '../lib/store'
import type { MatchedScholarship } from '../lib/types'

export function MatchRing({ score }: { score: number }) {
  const r = 18
  const c = 2 * Math.PI * r
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#6366f1' : '#f59e0b'
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

export function DeadlinePill({ deadline }: { deadline?: string }) {
  const d = daysUntil(deadline)
  const urgent = d !== null && d <= 14
  const soon = d !== null && d <= 45
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        urgent ? 'text-rose-600' : soon ? 'text-amber-600' : 'text-slate-500'
      }`}
    >
      <CalendarDays className="h-3.5 w-3.5" />
      {deadline ? `${deadlineLabel(deadline)}${d !== null && d <= 45 ? ` · ${d === 0 ? 'today' : `${d}d left`}` : ''}` : 'Rolling deadline'}
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

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-slate-900">{amountLabel(s)}</span>
        {s.renewable && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <RefreshCw className="h-3 w-3" /> Renewable
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

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4 mt-4">
        <div className="flex flex-col gap-1">
          <DeadlinePill deadline={s.deadline} />
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <FileText className="h-3.5 w-3.5" />
            {s.essay === 'none' ? 'No essay' : s.essay === 'short' ? 'Short essay' : 'Full essay'}
          </span>
        </div>
        {isApplied ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Applied
          </span>
        ) : (
          <button onClick={onOpen} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700">
            View details
          </button>
        )}
      </div>
    </article>
  )
}
