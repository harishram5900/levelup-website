import { useEffect } from 'react'
import {
  AlertTriangle, BadgeCheck, Bookmark, CheckCircle2, ExternalLink, Globe2, GraduationCap, MapPin, Sparkles, X,
} from 'lucide-react'
import { CATEGORY_MAP, STATUS_SHORT } from '../data/options'
import { shortDate } from '../lib/format'
import { useStore } from '../lib/store'
import type { MatchedScholarship } from '../lib/types'
import { DeadlinePill, MatchRing } from './ScholarshipCard'

export default function ScholarshipDrawer({ s, onClose }: { s: MatchedScholarship | null; onClose: () => void }) {
  const { saved, toggleSaved, applied, toggleApplied } = useStore()

  useEffect(() => {
    if (!s) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [s, onClose])

  if (!s) return null
  const isSaved = saved.includes(s.id)
  const isApplied = applied.includes(s.id)

  const statuses =
    s.eligibleStatuses === 'all'
      ? null
      : s.eligibleStatuses.filter((x) => x !== 'not_sure').map((x) => STATUS_SHORT[x]).join(', ')

  const facts = [
    {
      icon: Globe2,
      label: 'Citizenship & status',
      value: s.citizenshipText,
      sub: statuses ? `We match this to: ${statuses}` : undefined,
      warn: !s.statusConfirmed,
    },
    { icon: MapPin, label: 'Location', value: s.locationText },
    {
      icon: GraduationCap,
      label: 'Who can apply',
      value: s.gradeText,
      sub: s.minGpaText ? `Minimum GPA: ${s.minGpaText}` : 'No minimum GPA listed',
    },
  ]

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={s.name}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg animate-slide-in flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <span className="text-sm font-semibold text-slate-500">Scholarship details</span>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex items-start gap-4">
            <MatchRing score={s.score} />
            <div>
              <h2 className="text-2xl font-bold leading-tight">{s.name}</h2>
              <p className="mt-1 text-slate-500">{s.provider}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-4 text-white">
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">Award</p>
              <p className="mt-1 font-display text-lg font-bold leading-snug">{s.amountText}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Deadline</p>
              <div className="mt-2">
                <DeadlinePill s={s} />
              </div>
              {s.deadlineDate && !s.deadlineExact && (
                <p className="mt-1 text-xs text-slate-400">Estimated {shortDate(s.deadlineDate)}</p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-800">
              <Sparkles className="h-4 w-4" /> Why it's a match
            </p>
            <ul className="mt-2 space-y-1">
              {s.reasons.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-brand-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {r}
                </li>
              ))}
            </ul>
          </div>

          {s.warnings.length > 0 && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <AlertTriangle className="h-4 w-4" /> Double-check before applying
              </p>
              <ul className="mt-2 space-y-1">
                {s.warnings.map((w) => (
                  <li key={w} className="text-sm text-amber-900">• {w}</li>
                ))}
              </ul>
            </div>
          )}

          {s.notes && (
            <>
              <h3 className="mt-6 font-sans text-sm font-bold uppercase tracking-wide text-slate-500">Eligibility notes</h3>
              <p className="mt-2 leading-relaxed text-slate-700">{s.notes}</p>
            </>
          )}

          <div className="mt-6 flex flex-wrap gap-1.5">
            {s.categories.map((c) => (
              <span key={c} className={`tag ${CATEGORY_MAP[c].color}`}>
                {CATEGORY_MAP[c].emoji} {CATEGORY_MAP[c].label}
              </span>
            ))}
          </div>

          <dl className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200">
            {facts.map((f) => (
              <div key={f.label} className="flex gap-3 p-4">
                <f.icon className={`mt-0.5 h-5 w-5 shrink-0 ${f.warn ? 'text-amber-500' : 'text-slate-400'}`} />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{f.label}</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{f.value}</dd>
                  {f.sub && <dd className="mt-0.5 text-xs text-slate-500">{f.sub}</dd>}
                </div>
              </div>
            ))}
          </dl>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            {s.verified && <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />}
            {s.verificationText} · Last checked {shortDate(s.lastChecked)}
          </p>
        </div>

        <div className="flex gap-2 border-t border-slate-100 p-4">
          <button onClick={() => toggleSaved(s.id)} className="btn-secondary px-4" aria-label="Save">
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button onClick={() => toggleApplied(s.id)} className="btn-secondary px-4">
            <CheckCircle2 className={`h-4 w-4 ${isApplied ? 'text-emerald-600' : ''}`} />
            {isApplied ? 'Applied' : 'Mark applied'}
          </button>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
            Official site <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </aside>
    </div>
  )
}
