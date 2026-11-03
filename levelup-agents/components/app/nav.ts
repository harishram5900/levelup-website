import { Layers, LayoutDashboard, Settings, Trophy, type LucideIcon } from "lucide-react";
import { AGENTS } from "@/lib/agents";

export type NavItem = { href: string; label: string; icon: LucideIcon; group?: string };

export const NAV: NavItem[] = [
  { href: "/app", label: "Startup HQ", icon: LayoutDashboard },
  ...AGENTS.map((a) => ({ href: `/app/agents/${a.id}`, label: `${a.name} agent`, icon: a.icon, group: "Co-founder agents" })),
  { href: "/app/deck", label: "Pitch deck", icon: Layers, group: "Co-founder agents" },
  { href: "/app/opportunities", label: "Opportunities", icon: Trophy },
  { href: "/app/settings", label: "Settings", icon: Settings },
];
