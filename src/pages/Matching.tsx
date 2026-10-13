import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import { LogoMark } from '../components/Logo'
import { STATUS_OPTIONS } from '../data/options'
import { findScholarships } from '../lib/api'
import { useStore } from '../lib/store'
import { useStats } from '../lib/useStats'

const DURATION = 4200

const PHASES = [
  'Reading your profile',
  'Scanning scholarship databases',
  'Checking citizenship & visa rules',
  'Matching state & local awards',
  'Ranking by fit and deadline',
]

export default function Matching() {
  const { profile, setMatch } = useStore()
  const stats = useStats()
  const total = stats?.highSchoolEligible ?? 0
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  // Progress animation (independent of the request so it survives StrictMode remounts)
  useEffect(() => {
    if (!profile) return
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / DURATION)
      setProgress(1 - Math.pow(1 - k, 2))
      setPhase(Math.min(PHASES.length - 1, Math.floor(k * PHASES.length)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [profile])

  useEffect(() => {
    if (!profile || started.current) return
    started.current = true
    Promise.all([findScholarships(profile), new Promise((r) => setTimeout(r, DURATION + 300))])
      .then(([response]) => {
        setMatch(response)
        navigate('/results', { replace: true })
      })
      .catch((e: Error) => setError(e.message))
  }, [profile, setMatch, navigate])

  if (!profile) return <Navigate to="/start" replace />
  const statusLabel = STATUS_OPTIONS.find((s) => s.id === profile.status)?.label

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-brand-300/40 via-violet-300/30 to-sun-300/30 blur-3xl" />
      <div className="card relative w-full max-w-md p-8 text-center">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-3xl bg-brand-400/30" />
          <LogoMark className="relative h-24 w-24 animate-float" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold">
          {profile.firstName ? `Hang tight, ${profile.firstName}!` : 'Finding your scholarships…'}
        </h1>
        <p className="mt-2 text-slate-600">
          Our AI is reviewing every listing{statusLabel ? ` for ${statusLabel} eligibility` : ''}.
        </p>

        <p className="mt-6 font-display text-5xl font-extrabold tabular-nums text-brand-700">
          {total ? Math.round(total * progress) : `${Math.round(progress * 100)}%`}
        </p>
        <p className="text-sm text-slate-500">{total ? `of ${total} scholarships scanned` : 'scanned'}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        </div>

        <ul className="mt-6 space-y-2.5 text-left">
          {PHASES.map((ph, idx) => (
            <li key={ph} className={`flex items-center gap-3 text-sm transition-opacity ${idx > phase ? 'opacity-40' : ''}`}>
              {idx < phase ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"><Check className="h-3 w-3" /></span>
              ) : idx === phase ? (
                <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
              ) : (
                <span className="h-5 w-5 rounded-full border-2 border-slate-200" />
              )}
              {ph}
            </li>
          ))}
        </ul>

        {error && (
          <div className="mt-6 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
            {error}{' '}
            <button className="font-semibold underline" onClick={() => navigate('/start')}>Try again</button>
          </div>
        )}
      </div>
    </div>
  )
}
