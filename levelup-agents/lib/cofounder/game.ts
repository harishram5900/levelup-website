import { Banknote, Flame, UserPlus, UsersRound, Gem, Hammer, Handshake, Layers, Lightbulb, Megaphone, Palette, Presentation, Radar, Rocket, Target, TrendingUp, Users, Video, type LucideIcon } from "lucide-react";
import { AGENTS } from "../agents";
import type { Workspace } from "./profile";
import { XP_CHECKIN, checkinStreak, milestones } from "./traction";

export const XP = { agent: 100, goal: 25, deck: 150, day: 10 } as const;

export const LEVELS = [
  { at: 0, title: "Dreamer" },
  { at: 100, title: "Explorer" },
  { at: 250, title: "Builder" },
  { at: 450, title: "Hustler" },
  { at: 700, title: "Launcher" },
  { at: 1000, title: "Founder" },
  { at: 1400, title: "Mogul" },
  { at: 1900, title: "Legend" },
];

export type Badge = { id: string; name: string; how: string; icon: LucideIcon; earned: (w: Workspace, streak: number, bonus: number) => boolean };

export const BADGES: Badge[] = [
  { id: "first-step", name: "First Step", how: "Finish the Idea agent", icon: Lightbulb, earned: (w) => !!w.results.idea },
  { id: "talk-to-users", name: "People Person", how: "Finish the Customer agent", icon: Users, earned: (w) => !!w.results.customer },
  { id: "scout", name: "Scout", how: "Finish the Scout agent", icon: Radar, earned: (w) => !!w.results.competitor },
  { id: "offer-master", name: "Offer Master", how: "Finish the Offer agent", icon: Gem, earned: (w) => !!w.results.offer },
  { id: "brand-icon", name: "Brand Icon", how: "Finish the Brand agent", icon: Palette, earned: (w) => !!w.results.brand },
  { id: "closer", name: "Closer", how: "Finish the Sales agent", icon: Handshake, earned: (w) => !!w.results.sales },
  { id: "creator", name: "Creator", how: "Finish the Content agent", icon: Video, earned: (w) => !!w.results.content },
  { id: "investor-ready", name: "Investor Ready", how: "Finish the Investor agent", icon: TrendingUp, earned: (w) => !!w.results.investor },
  { id: "shipper", name: "Shipper", how: "Finish the Build agent", icon: Hammer, earned: (w) => !!w.results.build },
  { id: "storyteller", name: "Storyteller", how: "Finish the Pitch agent", icon: Presentation, earned: (w) => !!w.results.pitch },
  { id: "money-brain", name: "Money Brain", how: "Finish the Money agent", icon: Banknote, earned: (w) => !!w.results.money },
  { id: "launcher", name: "Liftoff", how: "Finish the Traction agent", icon: Megaphone, earned: (w) => !!w.results.launch },
  { id: "deck-master", name: "Deck Master", how: "Build your pitch deck", icon: Layers, earned: (w) => !!w.deck },
  { id: "goal-getter", name: "Goal Getter", how: "Complete 3 weekly goals", icon: Target, earned: (w) => w.goals.filter((g) => g.done).length >= 3 },
  { id: "on-fire", name: "On Fire", how: "Show up 3 days in a row", icon: Flame, earned: (_w, s) => s >= 3 },
  { id: "recruiter", name: "Recruiter", how: "Invite a friend who signs up", icon: UserPlus, earned: (_w, _s, b) => b >= 50 },
  { id: "team-player", name: "Team Player", how: "Create or join a team", icon: UsersRound, earned: (w) => !!w.team },
  { id: "measured", name: "Measured", how: "Log 4 weekly check-ins in a row", icon: TrendingUp, earned: (w) => checkinStreak(w.traction) >= 4 },
  { id: "first-dollar", name: "First Dollar", how: "Log your first revenue", icon: Banknote, earned: (w) => milestones(w.traction).some((m) => m.id === "dollar1" && m.done) },
  { id: "ten-talks", name: "Mom Test Pro", how: "Log 10 customer conversations", icon: Users, earned: (w) => milestones(w.traction).some((m) => m.id === "talk10" && m.done) },
  { id: "all-in", name: "All In", how: "Finish all 12 agents", icon: Rocket, earned: (w) => AGENTS.every((a) => w.results[a.id]) },
];

const dayNum = (d: string) => Math.round(new Date(`${d}T12:00:00`).getTime() / 86_400_000);

/** Consecutive days up to today (or yesterday, so a streak survives until you miss a full day). */
export function streakOf(days: string[], todayStr: string): number {
  const set = new Set(days.map(dayNum));
  let d = dayNum(todayStr);
  if (!set.has(d)) d -= 1;
  let n = 0;
  while (set.has(d)) { n++; d--; }
  return n;
}

export function gameStats(w: Workspace, todayStr: string, bonus = 0) {
  const agentsDone = AGENTS.filter((a) => w.results[a.id]).length;
  const goalsDone = w.goals.filter((g) => g.done).length;
  const streak = streakOf(w.days, todayStr);
  const checkins = new Set((w.traction ?? []).map((c) => c.week)).size;
  const xp = agentsDone * XP.agent + goalsDone * XP.goal + (w.deck ? XP.deck : 0) + new Set(w.days).size * XP.day + checkins * XP_CHECKIN + bonus;
  let li = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.at) li = i; });
  const cur = LEVELS[li];
  const next = LEVELS[li + 1];
  const pctToNext = next ? Math.round(((xp - cur.at) / (next.at - cur.at)) * 100) : 100;
  const badges = BADGES.filter((b) => b.earned(w, streak, bonus)).map((b) => b.id);
  return { xp, level: li + 1, title: cur.title, next, pctToNext, toNext: next ? next.at - xp : 0, streak, agentsDone, goalsDone, badges };
}
