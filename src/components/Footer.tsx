import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-slate-500">
            Scholarships for every U.S. high schooler — whatever your passport, visa or status says.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          <p>Your answers stay private and are only used to match eligibility.</p>
          <p className="mt-1">© {new Date().getFullYear()} LevelUp. Always verify details on the provider's site before applying.</p>
        </div>
      </div>
    </footer>
  )
}
