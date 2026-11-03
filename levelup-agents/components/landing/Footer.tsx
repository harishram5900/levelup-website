import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-fg/[0.07] px-5 py-12">
      <div className="mx-auto flex max-w-site flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted">An AI co-founder for young entrepreneurs. Built by student founders.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-14 gap-y-3 text-sm">
          <a href="#how" className="text-muted hover:text-fg">How it works</a>
          <a href="#pricing" className="text-muted hover:text-fg">Pricing</a>
          <a href="#try" className="text-muted hover:text-fg">Check my idea</a>
          <a href="#faq" className="text-muted hover:text-fg">FAQ</a>
          <Link href="/app/opportunities" className="text-muted hover:text-fg">Opportunities</Link>
          <a href="#waitlist" className="text-muted hover:text-fg">Join waitlist</a>
          <Link href="/privacy" className="text-muted hover:text-fg">Privacy</Link>
          <Link href="/terms" className="text-muted hover:text-fg">Terms</Link>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-site text-xs text-muted">© {new Date().getFullYear()} LevelUp. Competition and program names belong to their organizers; LevelUp is not affiliated with them.</p>
    </footer>
  );
}
