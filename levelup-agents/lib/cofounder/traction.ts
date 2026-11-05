/**
 * Traction tracker: the founder logs real numbers once a week; LevelUp turns them into
 * week-over-week growth (the metric YC partners ask about first), milestones and next steps.
 * Pure functions only, so they're easy to test and reuse in the AI context.
 */
import type { CheckIn, Workspace } from "./profile";

export const XP_CHECKIN = 20;
export type Metric = "users" | "revenue" | "conversations";
export const METRIC_LABEL: Record<Metric, string> = { users: "Users", revenue: "Revenue", conversations: "Customer conversations" };

/** Monday of the week containing `d` (local time), as YYYY-MM-DD. */
export function weekOf(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}
const weekNum = (w: string) => Math.round(new Date(`${w}T12:00:00`).getTime() / (7 * 86_400_000));

export function sorted(log: CheckIn[] = []) { return [...log].sort((a, b) => a.week.localeCompare(b.week)); }

/** The metric that matters most right now: revenue once there are 2+ paid weeks (so growth is measurable), else users, else conversations. */
export function primaryMetric(log: CheckIn[] = []): Metric {
  if (log.filter((c) => c.revenue > 0).length >= 2) return "revenue";
  if (log.some((c) => c.users > 0)) return "users";
  return "conversations";
}

/** Week-over-week growth of a metric, compounded over the last up-to-4 weeks. null when it can't be computed. */
export function weeklyGrowth(log: CheckIn[] = [], m: Metric = primaryMetric(log)): number | null {
  const s = sorted(log).filter((c) => c[m] > 0);
  if (s.length < 2) return null;
  const last = s[s.length - 1], first = s[Math.max(0, s.length - 5)];
  const weeks = weekNum(last.week) - weekNum(first.week);
  if (weeks <= 0 || first[m] <= 0) return null;
  return Math.pow(last[m] / first[m], 1 / weeks) - 1;
}

/** Consecutive weekly check-ins ending this week or last week. */
export function checkinStreak(log: CheckIn[] = [], now = new Date()): number {
  const have = new Set(log.map((c) => weekNum(c.week)));
  let w = weekNum(weekOf(now));
  if (!have.has(w)) w -= 1;
  let n = 0;
  while (have.has(w)) { n++; w--; }
  return n;
}

export const totalConversations = (log: CheckIn[] = []) => log.reduce((n, c) => n + c.conversations, 0);
export const latest = (log: CheckIn[] = []) => sorted(log).at(-1) ?? null;

export type Milestone = { id: string; label: string; done: boolean };
export function milestones(log: CheckIn[] = []): Milestone[] {
  const users = Math.max(0, ...log.map((c) => c.users));
  const rev = Math.max(0, ...log.map((c) => c.revenue));
  const talks = totalConversations(log);
  return [
    { id: "talk10", label: "Talked to 10 customers", done: talks >= 10 },
    { id: "user1", label: "First user", done: users >= 1 },
    { id: "talk25", label: "Talked to 25 customers", done: talks >= 25 },
    { id: "user10", label: "10 users", done: users >= 10 },
    { id: "dollar1", label: "First dollar", done: rev > 0 },
    { id: "user100", label: "100 users", done: users >= 100 },
    { id: "rev100", label: "$100 in a week", done: rev >= 100 },
    { id: "user1k", label: "1,000 users", done: users >= 1000 },
    { id: "rev1k", label: "$1,000 in a week", done: rev >= 1000 },
  ];
}

/** Honest, specific next-step advice from the numbers (no AI needed). */
export function insights(log: CheckIn[] = [], now = new Date()): string[] {
  const s = sorted(log);
  if (!s.length) return ["Log your first week. Zeros count too: founders who measure early grow faster."];
  const out: string[] = [];
  if (!s.some((c) => c.week === weekOf(now))) out.push("You haven't checked in this week yet. It takes 30 seconds.");
  const talks = totalConversations(s);
  if (talks < 10) out.push(`You've talked to ${talks} customer${talks === 1 ? "" : "s"} so far. Get to 10 before building more. The Customer agent has the script.`);
  const g = weeklyGrowth(s);
  const m = primaryMetric(s);
  if (g !== null) {
    const pct = Math.round(g * 100);
    if (pct >= 10) out.push(`${METRIC_LABEL[m]} are growing ${pct}% a week. Paul Graham calls 10% a week exceptional. Keep doing exactly what's working.`);
    else if (pct >= 5) out.push(`${METRIC_LABEL[m]} are growing ${pct}% a week, inside YC's "good" range of 5-7%. Push your best channel harder to reach 10%.`);
    else if (pct > 0) out.push(`${METRIC_LABEL[m]} are growing ${pct}% a week. Aim for 5-7%: pick one channel from your Traction plan and double it this week.`);
    else out.push(`${METRIC_LABEL[m]} didn't grow lately. Talk to 5 users this week and ask what almost made them quit.`);
  }
  const last = s[s.length - 1];
  if (last.users > 0 && last.revenue === 0) out.push("You have users but no revenue yet. Ask your 3 most active users if they'd pay, and what price feels fair.");
  return out.slice(0, 3);
}

/** One line for the AI's context, so every agent plans around the founder's real numbers. */
export function tractionSummary(w: Pick<Workspace, "traction">): string {
  const s = sorted(w.traction);
  if (!s.length) return "";
  const l = s[s.length - 1];
  const g = weeklyGrowth(s);
  return `Real traction (founder-logged, week of ${l.week}): ${l.users} users, $${l.revenue} revenue that week, ${totalConversations(s)} customer conversations in total${g !== null ? `, ${METRIC_LABEL[primaryMetric(s)].toLowerCase()} growing ${Math.round(g * 100)}% per week` : ""}.${l.note ? ` Latest learning: ${l.note}` : ""}`;
}
