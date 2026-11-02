import { Bot, CalendarDays, LayoutDashboard, Lock, Settings, Wand2, type LucideIcon } from "lucide-react";

export const NAV: { href: string; label: string; icon: LucideIcon; soon?: boolean }[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/agents", label: "Agents", icon: Bot },
  { href: "/app/calendar", label: "Content calendar", icon: CalendarDays },
  { href: "/app/create", label: "Create", icon: Wand2 },
  { href: "/app/nurture", label: "Nurture Flow", icon: Lock, soon: true },
  { href: "/app/settings", label: "Settings", icon: Settings },
];
