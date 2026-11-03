import { BookOpen, Layers, LayoutDashboard, Settings, Trophy, type LucideIcon } from "lucide-react";
import { AGENTS, WORLDS } from "@/lib/agents";

export type NavItem = { href: string; label: string; icon: LucideIcon; group?: string; tour?: string };

export const NAV: NavItem[] = [
  { href: "/app", label: "Startup HQ", icon: LayoutDashboard, tour: "nav-hq" },
  ...AGENTS.map((a) => ({ href: `/app/agents/${a.id}`, label: `${a.name} agent`, icon: a.icon, group: WORLDS[a.world].name, tour: a.id === "idea" ? "nav-agents" : undefined })),
  { href: "/app/deck", label: "Pitch deck", icon: Layers, group: "Tools", tour: "nav-deck" },
  { href: "/app/playbooks", label: "Playbooks", icon: BookOpen, group: "Tools", tour: "nav-playbooks" },
  { href: "/app/opportunities", label: "Opportunities", icon: Trophy, group: "Tools", tour: "nav-opps" },
  { href: "/app/settings", label: "Settings", icon: Settings, group: "Account", tour: "nav-settings" },
];
