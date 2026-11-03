import { BookOpen, Crown, Gift, Layers, LayoutDashboard, Medal, Settings, Trophy, UsersRound, type LucideIcon } from "lucide-react";
import { isProAgent } from "@/lib/cofounder/plan";
import { AGENTS, WORLDS } from "@/lib/agents";

export type NavItem = { href: string; label: string; icon: LucideIcon; group?: string; tour?: string; pro?: boolean };

export const NAV: NavItem[] = [
  { href: "/app", label: "Startup HQ", icon: LayoutDashboard, tour: "nav-hq" },
  ...AGENTS.map((a) => ({ href: `/app/agents/${a.id}`, label: `${a.name} agent`, icon: a.icon, group: WORLDS[a.world].name, tour: a.id === "idea" ? "nav-agents" : undefined, pro: isProAgent(a.id) })),
  { href: "/app/deck", label: "Pitch deck", icon: Layers, group: "Tools", tour: "nav-deck", pro: true },
  { href: "/app/playbooks", label: "Playbooks", icon: BookOpen, group: "Tools", tour: "nav-playbooks" },
  { href: "/app/opportunities", label: "Opportunities", icon: Trophy, group: "Tools", tour: "nav-opps" },
  { href: "/app/leaderboard", label: "Leaderboard", icon: Medal, group: "Community", tour: "nav-community" },
  { href: "/app/friends", label: "Friends & invites", icon: Gift, group: "Community" },
  { href: "/app/team", label: "Team", icon: UsersRound, group: "Community" },
  { href: "/app/upgrade", label: "Go Pro", icon: Crown, group: "Account", tour: "nav-pro" },
  { href: "/app/settings", label: "Settings", icon: Settings, group: "Account", tour: "nav-settings" },
];
