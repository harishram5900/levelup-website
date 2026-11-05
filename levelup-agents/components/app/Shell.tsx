"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, LineChart, ChevronsLeft, Crown, Flame, LayoutDashboard, Menu, Sparkles, Trophy, Zap, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ease, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { NAV, PRO_GROUP } from "./nav";
import { Celebrator } from "@/components/cofounder/Celebrate";
import { gameStats } from "@/lib/cofounder/game";
import { today, useWorkspace } from "@/lib/cofounder/profile";
import { Tour } from "@/components/cofounder/Tour";
import { Buddy } from "@/components/cofounder/Pip";
import { authEnabled, useAuth } from "@/lib/supabase";
import { ProBadge } from "@/components/cofounder/ProGate";
import { usePlan } from "@/lib/cofounder/plan";

function Account() {
  const { user, ready } = useAuth();
  const { ws } = useWorkspace();
  if (!ready) return null;
  if (user) {
    const name = (user.user_metadata?.display_name as string) || user.email || "?";
    return <Link href="/app/settings" aria-label="Account settings" title={user.email ?? ""} className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-bold text-white ring-2 ring-white/10">{name.charAt(0).toUpperCase()}</Link>;
  }
  if (!authEnabled || !ws.profile) return null;
  return <Link href="/signup" className="btn-glow hidden px-3.5 py-1.5 text-xs sm:inline-flex">Sign up to save</Link>;
}

function Stats() {
  const { ws, ready } = useWorkspace();
  const { bonusXp } = usePlan();
  if (!ready || !ws.profile) return null;
  const g = gameStats(ws, today(), bonusXp);
  return (
    <Link href="/app" data-tour="top-stats" className="flex items-center gap-1.5 rounded-full hairline py-1 pl-1 pr-3 text-xs font-semibold hover:bg-fg/5" aria-label={`Level ${g.level} ${g.title}, ${g.xp} XP, ${g.streak} day streak`}>
      <span className="grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1.5 text-white">{g.level}</span>
      <span className="hidden sm:inline">{g.title}</span>
      <span className="flex items-center gap-0.5 text-violet"><Zap size={13} aria-hidden />{g.xp}</span>
      <span className={cn("flex items-center gap-0.5", g.streak ? "text-amber" : "text-muted")}><Flame size={13} aria-hidden />{g.streak}</span>
    </Link>
  );
}

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  const { pro } = usePlan();
  const items = NAV.filter((n) => !(pro && n.href === "/app/upgrade"));
  const onProPage = items.some((n) => n.group === PRO_GROUP && n.href !== "/app" && path.startsWith(n.href));
  // The Pro section is a dropdown: closed by default, opens on Pro pages, remembers the choice.
  const [proOpen, setProOpen] = useState(false);
  useEffect(() => { try { setProOpen(localStorage.getItem("lu-pro-open") === "1"); } catch { /* ignore */ } }, []);
  useEffect(() => { if (onProPage) setProOpen(true); }, [onProPage]);
  const toggle = () => setProOpen((o) => { try { localStorage.setItem("lu-pro-open", o ? "0" : "1"); } catch { /* ignore */ } return !o; });
  const proCount = items.filter((n) => n.group === PRO_GROUP).length;

  return (
    <ul className="space-y-1">
      {items.map((n, i, arr) => {
        const header = n.group && arr[i - 1]?.group !== n.group ? n.group : null;
        const active = n.href === "/app" ? path === "/app" : path.startsWith(n.href);
        const Icon = n.icon;
        const inPro = n.group === PRO_GROUP;
        const hidden = inPro && (!proOpen || collapsed);
        return (
          <li key={n.href}>
            {header && header === PRO_GROUP && (collapsed ? (
              <button type="button" onClick={toggle} title="LevelUp Pro" aria-expanded={proOpen} className="mx-auto my-2 grid h-9 w-9 place-items-center rounded-xl bg-amber/20 text-amber ring-1 ring-amber/40"><Crown size={16} aria-hidden /></button>
            ) : (
              <div className="mx-1 mb-1 mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber/25 to-amber/5 py-1 pl-1 pr-2 ring-1 ring-amber/40">
                <button type="button" onClick={toggle} aria-expanded={proOpen} aria-controls="pro-nav" data-tour="nav-pro-group" className="flex min-w-0 flex-1 items-center gap-1.5 whitespace-nowrap rounded-lg px-1.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.06em] text-amber hover:bg-amber/10">
                  <Crown size={12} className="shrink-0" aria-hidden /> <span className="shrink-0 whitespace-nowrap">{header}</span>
                  <span className="shrink-0 rounded-full bg-amber/20 px-1.5 text-[9px] tracking-normal">{proCount}</span>
                  <motion.span animate={{ rotate: proOpen ? 180 : 0 }} className="ml-auto"><ChevronDown size={14} aria-hidden /></motion.span>
                </button>
                {pro ? <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-good">Active ✓</span> : <Link href="/app/upgrade" onClick={onNavigate} className="shrink-0 rounded-md bg-amber px-2 py-0.5 text-[10px] font-extrabold text-[#1a1100] hover:brightness-110">Unlock</Link>}
              </div>
            ))}
            {header && header !== PRO_GROUP && !collapsed && <p className="kicker px-3 pb-1 pt-4 text-[10px]">{header}</p>}
            <AnimatePresence initial={false}>
              {!hidden && (
                <motion.div id={inPro ? "pro-nav" : undefined} initial={inPro ? { height: 0, opacity: 0 } : false} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease }} className={inPro ? "overflow-hidden" : undefined}>
                  <Link href={n.href} onClick={onNavigate} data-tour={n.tour} aria-current={active ? "page" : undefined} title={collapsed ? n.label : undefined}
                    className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "text-fg" : "text-muted hover:text-fg", inPro && "ml-2")}>
                    {active && <motion.span layoutId="nav-active" transition={spring} className="absolute inset-0 rounded-xl bg-fg/[0.07]" />}
                    <Icon size={18} className="relative shrink-0" aria-hidden />
                    {!collapsed && <span className="relative flex-1 truncate">{n.label}</span>}
                    {!collapsed && n.pro && !pro && <ProBadge className="relative" />}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

/** Mobile bottom tab bar (the main navigation in the phone app). */
const TABS = [
  { href: "/app", label: "HQ", tour: "tab-hq", icon: LayoutDashboard, match: (p: string) => p === "/app" },
  { href: "/app/agents", label: "Agents", tour: "tab-agents", icon: Sparkles, match: (p: string) => p.startsWith("/app/agents") },
  { href: "/app/growth", label: "Growth", tour: "tab-growth", icon: LineChart, match: (p: string) => p.startsWith("/app/growth") },
  { href: "/app/opportunities", label: "Opportunities", tour: "tab-opps", icon: Trophy, match: (p: string) => p.startsWith("/app/opportunities") },
];
function TabBar({ path, onMore }: { path: string; onMore: () => void }) {
  const moreActive = !TABS.some((t) => t.match(path));
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-fg/[0.08] bg-bg/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {TABS.map((t) => {
          const on = t.match(path);
          const Icon = t.icon;
          return (
            <li key={t.href}>
              <Link href={t.href} data-tour={t.tour} aria-current={on ? "page" : undefined} className={cn("flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10.5px] font-semibold transition active:scale-95", on ? "text-fg" : "text-muted")}>
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition", on && "bg-amber/20 text-amber")}><Icon size={19} aria-hidden /></span>{t.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button type="button" onClick={onMore} data-tour="open-menu" aria-label="More: open the full menu" className={cn("flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 text-[10.5px] font-semibold transition active:scale-95", moreActive ? "text-fg" : "text-muted")}>
            <span className={cn("grid h-7 w-12 place-items-center rounded-full", moreActive && "bg-amber/20 text-amber")}><Menu size={19} aria-hidden /></span>More
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const path = usePathname();
  const title = path === "/app/agents" ? "Agents" : NAV.find((n) => (n.href === "/app" ? path === "/app" : path.startsWith(n.href)))?.label ?? "Dashboard";
  const { ws } = useWorkspace();

  useEffect(() => {
    try { setCollapsed(localStorage.getItem("lu-collapsed") === "1"); } catch {}
  }, []);
  const toggle = () => setCollapsed((c) => { try { localStorage.setItem("lu-collapsed", c ? "0" : "1"); } catch {} return !c; });

  return (
    <div className="app-scope flex min-h-dvh">
      {/* Desktop sidebar */}
      <motion.aside animate={{ width: collapsed ? 76 : 248 }} transition={{ duration: 0.35, ease }} className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-fg/[0.07] bg-bg-2/40 p-3 md:flex">
        <div className="mb-6 flex items-center gap-2.5 px-2 pt-2">
          <Link href="/" aria-label="LevelUp home"><LogoMark /></Link>
          {!collapsed && <Wordmark />}
          {!collapsed && ws.profile && <Buddy character={ws.prefs.character} size={30} className="ml-auto" />}
        </div>
        <nav aria-label="App" className="-mx-1 flex-1 overflow-y-auto px-1"><NavList collapsed={collapsed} /></nav>
        <button type="button" onClick={toggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:text-fg">
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }}><ChevronsLeft size={18} aria-hidden /></motion.span>{!collapsed && "Collapse"}
        </button>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: 0.3, ease }} className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-fg/[0.07] bg-bg p-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:hidden" aria-label="App menu">
              <div className="mb-6 flex items-center justify-between px-2 pt-2">
                <span className="flex items-center gap-2.5"><LogoMark /><Wordmark /></span>
                <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full hairline"><X size={16} aria-hidden /></button>
              </div>
              <nav aria-label="App mobile" className="max-h-[calc(100dvh-90px)] overflow-y-auto"><NavList onNavigate={() => setDrawer(false)} /></nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-fg/[0.07] bg-bg/70 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-base font-semibold tracking-normal">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Stats />
            <ThemeToggle />
            <Account />
          </div>
        </header>
        <main className={cn("min-w-0 flex-1 p-4 sm:p-6 md:pb-8 lg:p-8", ws.profile && "pb-[calc(6rem+env(safe-area-inset-bottom))]")}>{children}</main>
        {/* No tab bar until the founder has set up their startup (first launch is a focused flow). */}
        {ws.profile && <TabBar path={path} onMore={() => setDrawer(true)} />}
        <Celebrator />
        <Tour />
      </div>
    </div>
  );
}
