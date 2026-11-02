"use client";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#agents", label: "Agents" },
  { href: "#free-plan", label: "Free plan tool" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <motion.nav
        aria-label="Main"
        animate={{ maxWidth: scrolled ? 980 : 1200, paddingTop: scrolled ? 8 : 14, paddingBottom: scrolled ? 8 : 14 }}
        transition={{ duration: 0.4, ease }}
        className={cn("mx-auto flex items-center justify-between rounded-full px-4 transition-colors duration-300 sm:px-5", scrolled ? "glass" : "border border-transparent")}
      >
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-fg">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/app" className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-fg sm:block">Demo app</Link>
          <a href="#waitlist" className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:block">Join waitlist</a>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full hairline md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
          </button>
        </div>
      </motion.nav>
      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass mx-auto mt-2 max-w-site rounded-3xl p-3 md:hidden">
          {[...LINKS, { href: "/app", label: "Demo app" }, { href: "#waitlist", label: "Join waitlist" }].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-sm hover:bg-fg/5">{l.label}</a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
