import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bookmark, Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useStore } from '../lib/store'

export default function Navbar() {
  const { match, saved } = useStore()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/#how', label: 'How it works' },
    { to: '/#who', label: 'Who we help' },
    ...(match ? [{ to: '/results', label: 'My matches' }] : []),
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) =>
            l.to.startsWith('/#') ? (
              <a key={l.to} href={l.to} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'}`
                }
              >
                {l.label}
              </NavLink>
            ),
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/saved"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            aria-label="Saved scholarships"
          >
            <Bookmark className="h-5 w-5" />
            {saved.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {saved.length}
              </span>
            )}
          </Link>
          <Link to="/start" className="btn-primary hidden sm:inline-flex">
            {match ? 'Retake quiz' : 'Find my scholarships'}
          </Link>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-slate-50">
              {l.label}
            </a>
          ))}
          <Link to="/start" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
            Find my scholarships
          </Link>
        </div>
      )}
    </header>
  )
}
