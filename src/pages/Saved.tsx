import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import ScholarshipCard from '../components/ScholarshipCard'
import ScholarshipDrawer from '../components/ScholarshipDrawer'
import { moneyFull } from '../lib/format'
import { useStore } from '../lib/store'
import type { MatchedScholarship } from '../lib/types'

export default function Saved() {
  const { results, saved, applied } = useStore()
  const [open, setOpen] = useState<MatchedScholarship | null>(null)
  const list = (results ?? [])
    .filter((s) => saved.includes(s.id))
    .sort((a, b) => (a.deadline ?? '9999').localeCompare(b.deadline ?? '9999'))
  const total = list.reduce((sum, s) => sum + (s.amountMax ?? s.amount), 0)
  const appliedCount = list.filter((s) => applied.includes(s.id)).length

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Saved scholarships</h1>
      <p className="mt-2 text-slate-600">Sorted by deadline so nothing slips by.</p>

      {list.length === 0 ? (
        <div className="card mt-8 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Bookmark className="h-6 w-6" />
          </div>
          <p className="mt-4 font-semibold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-slate-500">Tap the bookmark on any scholarship to build your shortlist.</p>
          <Link to={results ? '/results' : '/start'} className="btn-primary mt-6">
            {results ? 'Browse my matches' : 'Take the quiz'}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
            <div className="card p-4"><p className="font-display text-2xl font-bold">{list.length}</p><p className="text-xs text-slate-500">Saved</p></div>
            <div className="card p-4"><p className="font-display text-2xl font-bold text-emerald-600">{moneyFull(total)}</p><p className="text-xs text-slate-500">Potential</p></div>
            <div className="card p-4"><p className="font-display text-2xl font-bold">{appliedCount}/{list.length}</p><p className="text-xs text-slate-500">Applied</p></div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => <ScholarshipCard key={s.id} s={s} onOpen={() => setOpen(s)} />)}
          </div>
        </>
      )}
      <ScholarshipDrawer s={open} onClose={() => setOpen(null)} />
    </div>
  )
}
