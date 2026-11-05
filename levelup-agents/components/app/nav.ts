import { BookOpen, Bot, Crown, Gift, Layers, LayoutDashboard, LineChart, Medal, Settings, Trophy, UsersRound, type LucideIcon } from "lucide-react";
import { isProAgent } from "@/lib/cofounder/plan";
import { AGENTS } from "@/lib/agents";

export type NavItem = { href: string; label: string; icon: LucideIcon; group?: string; tour?: string; pro?: boolean };
export const PRO_GROUP = "LevelUp Pro";

const agentItem = (a: (typeof AGENTS)[number], group: string) => ({ href: `/app/agents/${a.id}`, label: `${a.name} agent`, icon: a.icon, group, tour: a.id === "idea" ? "nav-agents" : undefined, pro: isProAgent(a.id) });

/** Free agents first, then every Pro feature grouped in one highlighted section. */
export const NAV: NavItem[] = [
  { href: "/app", label: "Startup HQ", icon: LayoutDashboard, tour: "nav-hq" },
  { href: "/app/growth", label: "Growth", icon: LineChart, tour: "nav-growth" },
  ...AGENTS.filter((a) => !isProAgent(a.id)).map((a) => agentItem(a, "Your agents")),
  { href: "/app/cofounder", label: "AI co-founder", icon: Bot, group: PRO_GROUP, tour: "nav-chat", pro: true },
  ...AGENTS.filter((a) => isProAgent(a.id)).map((a) => agentItem(a, PRO_GROUP)),
  { href: "/app/deck", label: "Pitch deck designer", icon: Layers, group: PRO_GROUP, tour: "nav-deck", pro: true },
  { href: "/app/playbooks", label: "Playbooks", icon: BookOpen, group: "Tools", tour: "nav-playbooks" },
  { href: "/app/opportunities", label: "Opportunities", icon: Trophy, group: "Tools", tour: "nav-opps" },
  { href: "/app/leaderboard", label: "Leaderboard", icon: Medal, group: "Community", tour: "nav-community" },
  { href: "/app/friends", label: "Friends & invites", icon: Gift, group: "Community" },
  { href: "/app/team", label: "Team", icon: UsersRound, group: "Community" },
  { href: "/app/upgrade", label: "Go Pro", icon: Crown, group: "Account", tour: "nav-pro" },
  { href: "/app/settings", label: "Settings", icon: Settings, group: "Account", tour: "nav-settings" },
];
