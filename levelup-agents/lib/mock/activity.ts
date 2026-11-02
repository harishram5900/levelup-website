import type { AgentId } from "../agents";

// Sample agent activity. The dashboard cycles through these to look live.
export const ACTIVITY: { agent: AgentId; text: string }[] = [
  { agent: "research", text: "Spotted a rising sound in #smallbusiness, saved to ideas" },
  { agent: "script", text: "Drafted 3 hooks for “Behind the counter at 6am”" },
  { agent: "edit", text: "Cut a 22s Reel from Tuesday's raw footage, captions added" },
  { agent: "review", text: "Flagged one caption for tone, rewrote it in your voice" },
  { agent: "publish", text: "Scheduled 2 TikToks for 6:30pm, your best time slot" },
  { agent: "optimize", text: "Before-and-after posts are outperforming, boosting them next week" },
  { agent: "research", text: "Competitor launched a giveaway, suggested a response idea" },
  { agent: "script", text: "Rewrote a script to open with a question instead of a statement" },
  { agent: "publish", text: "Posted “3 mistakes new customers make” to Shorts" },
  { agent: "optimize", text: "Moved Friday posts earlier based on last 2 weeks of views" },
];
