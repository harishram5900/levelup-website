"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ease, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { NAV } from "./nav";

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <ul className="space-y-1">
      {NAV.map((n, i) => {
        const header = n.group && NAV[i - 1]?.group !== n.group ? n.group : null;
        const active = n.href === "/app" ? path === "/app" : path.startsWith(n.href);
        const Icon = n.icon;
        return (
          <li key={n.href}>
            {header && !collapsed && <p className="kicker px-3 pb-1 pt-4 text-[10px]">{header}</p>}
            <Link href={n.href} onClick={onNavigate} aria-current={active ? "page" : undefined} title={collapsed ? n.label : undefined}
              className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "text-fg" : "text-muted hover:text-fg")}>
              {active && <motion.span layoutId="nav-active" transition={spring} className="absolute inset-0 rounded-xl bg-fg/[0.07]" />}
              <Icon size={18} className="relative shrink-0" aria-hidden />
              {!collapsed && <span className="relative flex-1 truncate">{n.label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const path = usePathname();
  const title = NAV.find((n) => (n.href === "/app" ? path === "/app" : path.startsWith(n.href)))?.label ?? "Dashboard";

  useEffect(() => {
    try { setCollapsed(localStorage.getItem("lu-collapsed") === "1"); } catch {}
  }, []);
  const toggle = () => setCollapsed((c) => { try { localStorage.setItem("lu-collapsed", c ? "0" : "1"); } catch {} return !c; });

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <motion.aside animate={{ width: collapsed ? 76 : 248 }} transition={{ duration: 0.35, ease }} className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-fg/[0.07] bg-bg-2/40 p-3 md:flex">
        <div className="mb-6 flex items-center gap-2.5 px-2 pt-2">
          <Link href="/" aria-label="LevelUp home"><LogoMark /></Link>
          {!collapsed && <span className="font-display text-lg font-bold">LevelUp</span>}
        </div>
        <nav aria-label="App" className="flex-1"><NavList collapsed={collapsed} /></nav>
        <button type="button" onClick={toggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:text-fg">
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }}><ChevronsLeft size={18} aria-hidden /></motion.span>{!collapsed && "Collapse"}
        </button>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: 0.3, ease }} className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-fg/[0.07] bg-bg p-3 md:hidden" aria-label="App menu">
              <div className="mb-6 flex items-center justify-between px-2 pt-2">
                <span className="flex items-center gap-2.5 font-display text-lg font-bold"><LogoMark /> LevelUp</span>
                <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full hairline"><X size={16} aria-hidden /></button>
              </div>
              <nav aria-label="App mobile"><NavList onNavigate={() => setDrawer(false)} /></nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-fg/[0.07] bg-bg/70 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-full hairline md:hidden"><Menu size={16} aria-hidden /></button>
            <h1 className="font-sans text-base font-semibold tracking-normal">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold text-amber sm:inline">Beta</span>
            <ThemeToggle />
            
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
