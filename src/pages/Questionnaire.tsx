import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lock, Sparkles } from 'lucide-react'
import Chip, { OptionCard } from '../components/Chip'
import {
  ACTIVITIES, CIRCUMSTANCES, COLLEGE_PLANS, FIELDS, GPA, HERITAGE, INCOME, STATUS_OPTIONS, US_STATES,
} from '../data/options'
import { EMPTY_PROFILE, useStore } from '../lib/store'
import type { StudentProfile } from '../lib/types'

type Step = {
  title: string
  subtitle: string
  valid: (p: StudentProfile) => boolean
  render: (p: StudentProfile, set: <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) => void) => ReactNode
}

function toggleIn(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

const GRADES = [
  { id: '9', label: '9th grade', hint: 'Freshman' },
  { id: '10', label: '10th grade', hint: 'Sophomore' },
  { id: '11', label: '11th grade', hint: 'Junior' },
  { id: '12', label: '12th grade', hint: 'Senior' },
  { id: 'gap', label: 'Gap year', hint: 'Graduated, not yet enrolled' },
] as const

const STEPS: Step[] = [
  {
    title: "Let's start with you",
    subtitle: 'Basic info helps us match grade-level and location-specific awards.',
    valid: (p) => !!p.grade && !!p.state,
    render: (p, set) => (
      <div className="space-y-6">
        <div>
          <label className="label" htmlFor="fn">First name <span className="font-normal text-slate-400">(optional)</span></label>
          <input id="fn" className="input" placeholder="e.g. Maya" value={p.firstName} onChange={(e) => set('firstName', e.target.value)} />
        </div>
        <div>
          <span className="label">What grade are you in?</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GRADES.map((g) => (
              <OptionCard key={g.id} label={g.label} hint={g.hint} selected={p.grade === g.id} onClick={() => set('grade', g.id)} />
            ))}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="st">Which state do you live in?</label>
          <select id="st" className="input" value={p.state} onChange={(e) => set('state', e.target.value)}>
            <option value="">Select your state or territory</option>
            {US_STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>
    ),
  },
  {
    title: 'What is your immigration or residency status?',
    subtitle: 'This is the most important question — many scholarships have status rules hidden in the fine print. We’ll only show ones you can actually apply to.',
    valid: (p) => !!p.status,
    render: (p, set) => (
      <div>
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Your answer is private, never shared, and used only to filter eligibility. No documents or SSN required.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {STATUS_OPTIONS.map((s) => (
            <OptionCard key={s.id} label={s.label} hint={s.hint} selected={p.status === s.id} onClick={() => set('status', s.id)} />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Academics & plans',
    subtitle: 'Estimates are fine. Lots of scholarships have no GPA minimum at all.',
    valid: (p) => !!p.gpa,
    render: (p, set) => (
      <div className="space-y-7">
        <div>
          <span className="label">Unweighted GPA</span>
          <div className="flex flex-wrap gap-2">
            {GPA.map((g) => <Chip key={g.id} label={g.label} selected={p.gpa === g.id} onClick={() => set('gpa', g.id)} />)}
          </div>
        </div>
        <div>
          <span className="label">After high school I plan to attend…</span>
          <div className="flex flex-wrap gap-2">
            {COLLEGE_PLANS.map((c) => <Chip key={c.id} label={c.label} selected={p.collegePlan === c.id} onClick={() => set('collegePlan', c.id)} />)}
          </div>
        </div>
        <div>
          <span className="label">Fields you’re interested in <span className="font-normal text-slate-400">(pick any)</span></span>
          <div className="flex flex-wrap gap-2">
            {FIELDS.map((f) => <Chip key={f} label={f} selected={p.fields.includes(f)} onClick={() => set('fields', toggleIn(p.fields, f))} />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Your background',
    subtitle: 'Optional, but every answer unlocks more scholarships made specifically for students like you.',
    valid: () => true,
    render: (p, set) => (
      <div className="space-y-7">
        <div>
          <span className="label">Approximate household income</span>
          <div className="flex flex-wrap gap-2">
            {INCOME.map((i) => <Chip key={i.id} label={i.label} selected={p.income === i.id} onClick={() => set('income', p.income === i.id ? '' : i.id)} />)}
          </div>
        </div>
        <div>
          <span className="label">Will you be the first in your family to go to college?</span>
          <div className="flex flex-wrap gap-2">
            {(['yes', 'no', 'unsure'] as const).map((v) => (
              <Chip key={v} label={v === 'unsure' ? 'Not sure' : v[0].toUpperCase() + v.slice(1)} selected={p.firstGen === v} onClick={() => set('firstGen', v)} />
            ))}
          </div>
        </div>
        <div>
          <span className="label">Heritage <span className="font-normal text-slate-400">(optional, pick any)</span></span>
          <div className="flex flex-wrap gap-2">
            {HERITAGE.map((h) => <Chip key={h} label={h} selected={p.heritage.includes(h)} onClick={() => set('heritage', toggleIn(p.heritage, h))} />)}
          </div>
        </div>
        <div>
          <span className="label">Do any of these apply to you? <span className="font-normal text-slate-400">(optional)</span></span>
          <div className="flex flex-wrap gap-2">
            {CIRCUMSTANCES.map((c) => <Chip key={c} label={c} selected={p.circumstances.includes(c)} onClick={() => set('circumstances', toggleIn(p.circumstances, c))} />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'What do you do outside class?',
    subtitle: 'Clubs, sports, jobs, caregiving — it all counts.',
    valid: () => true,
    render: (p, set) => (
      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.map((a) => <Chip key={a} label={a} selected={p.activities.includes(a)} onClick={() => set('activities', toggleIn(p.activities, a))} />)}
      </div>
    ),
  },
  {
    title: 'Last thing — your preferences',
    subtitle: 'We’ll tailor results to how much time you want to spend applying.',
    valid: () => true,
    render: (p, set) => (
      <div className="space-y-7">
        <div>
          <span className="label">Essays?</span>
          <div className="grid gap-3 sm:grid-cols-3">
            <OptionCard label="Bring them on" hint="Show everything" selected={p.essayPref === 'any'} onClick={() => set('essayPref', 'any')} />
            <OptionCard label="Short ones only" hint="Under ~500 words" selected={p.essayPref === 'short'} onClick={() => set('essayPref', 'short')} />
            <OptionCard label="No essays" hint="Quick applications" selected={p.essayPref === 'none'} onClick={() => set('essayPref', 'none')} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="amt">
            Minimum award amount: <span className="text-brand-700">{p.minAmount ? `$${p.minAmount.toLocaleString()}+` : 'Any amount'}</span>
          </label>
          <input
            id="amt"
            type="range"
            min={0}
            max={10000}
            step={500}
            value={p.minAmount}
            onChange={(e) => set('minAmount', Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400"><span>Any</span><span>$10k+</span></div>
        </div>
      </div>
    ),
  },
]

export default function Questionnaire() {
  const { profile: saved, setProfile } = useStore()
  const [p, setP] = useState<StudentProfile>(saved ?? EMPTY_PROFILE)
  const [i, setI] = useState(0)
  const navigate = useNavigate()
  const step = STEPS[i]
  const last = i === STEPS.length - 1
  const pct = Math.round(((i + 1) / STEPS.length) * 100)

  const set = <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) => setP((prev) => ({ ...prev, [k]: v }))

  const next = () => {
    if (!step.valid(p)) return
    if (last) {
      setProfile(p)
      navigate('/matching')
    } else {
      setI(i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="grid-bg absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_40%)]" />
      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-brand-700">Step {i + 1} of {STEPS.length}</span>
          <span className="text-slate-500">{pct}% complete</span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {STEPS.map((_, idx) => (
            <div key={idx} className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-500 ${idx <= i ? 'w-full' : 'w-0'}`} />
            </div>
          ))}
        </div>

        <div key={i} className="card mt-8 animate-fade-up p-6 sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{step.title}</h1>
          <p className="mt-2 text-slate-600">{step.subtitle}</p>
          <div className="mt-8">{step.render(p, set)}</div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => (i === 0 ? navigate('/') : setI(i - 1))} className="btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button onClick={next} disabled={!step.valid(p)} className="btn-primary px-6 py-3">
            {last ? (
              <>
                <Sparkles className="h-4 w-4" /> Find my scholarships
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
