import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CalendarClock, DollarSign, Info, Layers, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import ScholarshipCard from '../components/ScholarshipCard'
import ScholarshipDrawer from '../components/ScholarshipDrawer'
import { CATEGORIES, STATUS_OPTIONS } from '../data/options'
import { daysUntil, deadlineSortKey, moneyFull } from '../lib/format'
import { useStore } from '../lib/store'
import type { CategoryId, MatchedScholarship } from '../lib/types'

type Sort = 'match' | 'deadline' | 'amount'
const PAGE = 24

const isConfirmed = (s: MatchedScholarship) => s.statusConfirmed
const dueSoon = (s: MatchedScholarship) => {
  const d = daysUntil(s.deadlineDate)
  return d !== null && d <= 30
}

export default function Results() {
  const { match, profile } = useStore()
  const results = match?.results ?? null
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('match')
  const [confirmedOnly, setConfirmedOnly] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [closingSoon, setClosingSoon] = useState(false)
  const [localOnly, setLocalOnly] = useState(false)
  const [limit, setLimit] = useState(PAGE)
  const [open, setOpen] = useState<MatchedScholarship | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const counts = useMemo(() => {
    const m = new Map<CategoryId, number>()
    results?.forEach((s) => s.categories.forEach((c) => m.set(c, (m.get(c) ?? 0) + 1)))
    return m
  }, [results])

  const filtered = useMemo(() => {
    if (!results) return []
    const needle = q.trim().toLowerCase()
    const list = results.filter((s) => {
      if (cat !== 'all' && !s.categories.includes(cat)) return false
      if (confirmedOnly && !isConfirmed(s)) return false
      if (verifiedOnly && !s.verified) return false
      if (closingSoon && !dueSoon(s)) return false
      if (localOnly && s.states === 'national') return false
      if (needle && !`${s.name} ${s.provider} ${s.notes}`.toLowerCase().includes(needle)) return false
      return true
    })
    if (sort === 'amount') list.sort((a, b) => (b.amountMax ?? -1) - (a.amountMax ?? -1))
    if (sort === 'deadline') list.sort((a, b) => deadlineSortKey(a).localeCompare(deadlineSortKey(b)))
    return list
  }, [results, cat, q, sort, confirmedOnly, verifiedOnly, closingSoon, localOnly])

  if (!results || !profile) return <Navigate to="/start" replace />

  const total = results.reduce((sum, s) => sum + (s.amountMax ?? 0), 0)
  const soonCount = results.filter(dueSoon).length
  const confirmedCount = results.filter(isConfirmed).length
  const statusLabel = STATUS_OPTIONS.find((s) => s.id === profile.status)?.label
  const activeFilters = [confirmedOnly, verifiedOnly, closingSoon, localOnly].filter(Boolean).length

  const resetView = () => setLimit(PAGE)
  const chooseCat = (c: CategoryId | 'all') => {
    setCat(c)
    resetView()
  }

  const stats = [
    { icon: Layers, label: 'Scholarships matched', value: results.length.toLocaleString(), tone: 'text-brand-600 bg-brand-50' },
    { icon: DollarSign, label: 'Listed award value', value: `${moneyFull(total)}+`, tone: 'text-emerald-600 bg-emerald-50' },
    { icon: ShieldCheck, label: 'Status rules confirmed', value: confirmedCount, tone: 'text-teal-600 bg-teal-50' },
    { icon: CalendarClock, label: 'Due in ~30 days', value: soonCount, tone: 'text-rose-600 bg-rose-50' },
  ]

  const CategoryList = (
    <nav className="space-y-1">
      <button
        onClick={() => chooseCat('all')}
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${cat === 'all' ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
      >
        <span>✨ All matches</span>
        <span className={`text-xs ${cat === 'all' ? 'text-white/80' : 'text-slate-400'}`}>{results.length}</span>
      </button>
      {CATEGORIES.filter((c) => counts.get(c.id)).map((c) => (
        <button
          key={c.id}
          onClick={() => chooseCat(c.id)}
          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${cat === c.id ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          <span className="truncate">{c.emoji} {c.label}</span>
          <span className={`text-xs ${cat === c.id ? 'text-white/80' : 'text-slate-400'}`}>{counts.get(c.id)}</span>
        </button>
      ))}
    </nav>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-700">
            <Sparkles className="h-4 w-4" /> Your personalized matches
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {profile.firstName ? `${profile.firstName}, you’re eligible for ` : 'You’re eligible for '}
            <span className="text-brand-600">{results.length}</span> scholarships
          </h1>
          <p className="mt-2 text-slate-600">
            Filtered for {statusLabel ?? 'your status'} · {profile.grade === 'gap' ? 'gap year' : `grade ${profile.grade}`} · {profile.state}
            {match && ` · ${match.scanned} high-school scholarships scanned`}
          </p>
        </div>
        <Link to="/start" className="btn-secondary self-start md:self-auto">Edit answers</Link>
      </div>

      {match && match.notices.length > 0 && (
        <div className="mt-5 space-y-2">
          {match.notices.map((n) => (
            <div key={n} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{n}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-3 p-4">
            <div className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:flex ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold sm:text-2xl">{s.value}</p>
              <p className="text-xs leading-tight text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile categories */}
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
        {[{ id: 'all' as const, emoji: '✨', label: 'All' }, ...CATEGORIES.filter((c) => counts.get(c.id))].map((c) => (
          <button
            key={c.id}
            onClick={() => chooseCat(c.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${cat === c.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
          >
            {c.emoji} {c.label} <span className="opacity-70">{c.id === 'all' ? results.length : counts.get(c.id)}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Categories</p>
            {CategoryList}
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  resetView()
                }}
                placeholder="Search scholarships or providers"
                className="w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-200"
                aria-label="Sort by"
              >
                <option value="match">Best match</option>
                <option value="deadline">Deadline soonest</option>
                <option value="amount">Highest award</option>
              </select>
              <button onClick={() => setFiltersOpen(!filtersOpen)} className={`btn-secondary rounded-xl py-2.5 ${activeFilters ? 'border-brand-300 text-brand-700' : ''}`}>
                <SlidersHorizontal className="h-4 w-4" /> Filters{activeFilters ? ` (${activeFilters})` : ''}
              </button>
            </div>
          </div>

          {filtersOpen && (
            <div className="mt-3 flex flex-wrap gap-2 animate-fade-up">
              {[
                { on: confirmedOnly, set: setConfirmedOnly, label: '🛡️ Status rules confirmed' },
                { on: verifiedOnly, set: setVerifiedOnly, label: '✅ Verified 2026' },
                { on: closingSoon, set: setClosingSoon, label: '⏰ Due in ~30 days' },
                { on: localOnly, set: setLocalOnly, label: '📍 State & local only' },
              ].map((f) => (
                <button
                  key={f.label}
                  onClick={() => {
                    f.set(!f.on)
                    resetView()
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${f.on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {f.label}
                </button>
              ))}
              {activeFilters > 0 && (
                <button
                  onClick={() => {
                    setConfirmedOnly(false)
                    setVerifiedOnly(false)
                    setClosingSoon(false)
                    setLocalOnly(false)
                  }}
                  className="inline-flex items-center gap-1 px-2 text-sm text-slate-500 hover:text-slate-800"
                >
                  <X className="h-4 w-4" /> Clear
                </button>
              )}
            </div>
          )}

          <p className="mt-5 text-sm text-slate-500">
            Showing <strong className="text-slate-800">{Math.min(limit, filtered.length)}</strong> of {filtered.length}
          </p>

          {filtered.length === 0 ? (
            <div className="card mt-4 p-12 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 font-semibold">No scholarships match these filters</p>
              <p className="mt-1 text-sm text-slate-500">Try clearing a filter or picking another category.</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, limit).map((s) => (
                <ScholarshipCard key={s.id} s={s} onOpen={() => setOpen(s)} />
              ))}
            </div>
          )}

          {limit < filtered.length && (
            <div className="mt-8 text-center">
              <button onClick={() => setLimit(limit + PAGE)} className="btn-secondary px-8 py-3">
                Show more ({filtered.length - limit} left)
              </button>
            </div>
          )}
        </div>
      </div>

      <ScholarshipDrawer s={open} onClose={() => setOpen(null)} />
    </div>
  )
}
