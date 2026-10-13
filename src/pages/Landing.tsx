import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Bot, ClipboardList, LayoutGrid, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { CATEGORIES, STATUS_OPTIONS } from '../data/options'
import { LogoMark } from '../components/Logo'
import { useStats } from '../lib/useStats'

const steps = [
  { icon: ClipboardList, title: 'Answer a 3-minute quiz', body: 'Tell us your grade, state, status, interests and goals. Skip anything you’re not comfortable sharing.' },
  { icon: Bot, title: 'We scan every scholarship', body: 'We check every listing’s fine print — citizenship rules, grade, GPA, location — against your answers.' },
  { icon: LayoutGrid, title: 'Get a sorted, categorized list', body: 'Only scholarships you can actually win, ranked by match and grouped into clear categories.' },
]

const preview = [
  { name: 'TheDream.US National Scholarship', amt: 'Up to $33k', tag: '🗽 Undocumented, DACA & TPS', score: 96 },
  { name: 'Microsoft HOLA Scholarship', amt: 'Up to $10k', tag: '🔬 STEM & Computer Science', score: 91 },
  { name: 'Jack Kent Cooke College Scholarship', amt: 'Up to $55k/yr', tag: '💛 Financial Need & First-Gen', score: 88 },
]

export default function Landing() {
  const stats = useStats()
  const count = stats?.highSchoolEligible
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-300/40 via-violet-300/40 to-sun-300/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered scholarship matching
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Every student deserves{' '}
              <span className="bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">a way up.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              LevelUp finds the scholarships <em>you</em> qualify for — whether you’re a citizen, green-card holder, DACA
              recipient, undocumented, a refugee, or here on a visa. One quiz. Hundreds of real options.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/start" className="btn-primary px-7 py-3.5 text-base">
                Find my scholarships <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#how" className="btn-secondary px-7 py-3.5 text-base">
                See how it works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-500" /> 100% free</span>
              <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-emerald-500" /> No SSN needed</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Status kept private</span>
            </div>
          </div>

          {/* Preview card */}
          <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:150ms]">
            <div className="absolute -right-6 -top-6 hidden animate-float rounded-2xl bg-white p-3 shadow-lift sm:block">
              <p className="text-xs text-slate-500">Status rules checked</p>
              <p className="font-display text-xl font-bold text-emerald-600">Every listing</p>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <LogoMark className="h-10 w-10" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Hi Maya 👋</p>
                  <p className="text-xs text-slate-500">Here are your top matches</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {preview.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 animate-fade-up" style={{ animationDelay: `${300 + i * 120}ms` }}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">{p.score}%</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.tag}</p>
                    </div>
                    <span className="font-display font-bold">{p.amt}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
              </div>
              <p className="mt-2 text-xs text-slate-500">Example results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            [count ? String(count) : '—', 'high-school scholarships'],
            ['14', 'clear categories'],
            ['10', 'immigration statuses supported'],
            ['50 + DC', 'states & territories'],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">{n}</p>
              <p className="mt-1 text-sm text-slate-500">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600">How it works</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">From quiz to shortlist in minutes</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card relative p-7">
              <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-slate-100">0{i + 1}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-sans text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who we help */}
      <section id="who" className="scroll-mt-20 bg-gradient-to-b from-brand-950 to-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-sm font-bold uppercase tracking-widest text-sun-300">No matter your status</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Built for every high schooler in America</h2>
            <p className="mt-4 text-lg text-slate-300">
              Most scholarship sites quietly filter out students without a Social Security number. We do the opposite:
              we hunt down the awards that welcome you, and tell you exactly which ones you can apply to.
            </p>
            <Link to="/start" className="btn-primary mt-8 bg-white text-brand-700 hover:bg-brand-50">
              Start the quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-3">
            {STATUS_OPTIONS.filter((s) => s.id !== 'not_sure').map((s) => (
              <div key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-colors hover:bg-white/10">
                <BadgeCheck className="h-5 w-5 text-sun-300" />
                <p className="mt-3 font-semibold">{s.label}</p>
                <p className="text-sm text-slate-400">{s.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Organized for you</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Every match, neatly categorized</h2>
          <p className="mt-4 text-slate-600">Browse by what matters to you — from no-essay awards to scholarships for your hometown.</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((c) => (
            <span key={c.id} className={`tag px-4 py-2 text-sm ${c.color}`}>
              <span className="text-base">{c.emoji}</span> {c.label}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 px-6 py-14 text-center text-white sm:px-12">
          <div className="grid-bg absolute inset-0 opacity-30" />
          <h2 className="relative text-3xl font-extrabold sm:text-4xl">Your future is worth applying for.</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/80">Three minutes now could mean thousands of dollars for college.</p>
          <Link to="/start" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand-700 shadow-lg hover:bg-sun-300 hover:text-slate-900">
            Level up now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
