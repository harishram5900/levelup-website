import { Search, PenLine, Clapperboard, ShieldCheck, Send, LineChart, type LucideIcon } from "lucide-react";

export type AgentId = "research" | "script" | "edit" | "review" | "publish" | "optimize";

export const AGENTS: { id: AgentId; name: string; role: string; line: string; icon: LucideIcon }[] = [
  { id: "research", name: "Research", role: "Trend scout", line: "Watches trends and competitors in your niche every day, so you post what people want now.", icon: Search },
  { id: "script", name: "Script", role: "Copywriter", line: "Turns those ideas into hooks and short scripts that sound like your brand, not a robot.", icon: PenLine },
  { id: "edit", name: "Edit", role: "Video editor", line: "Cuts clips, adds captions and visuals sized for every platform.", icon: Clapperboard },
  { id: "review", name: "Review", role: "Quality check", line: "Checks every post for tone, accuracy and brand rules before anything goes out.", icon: ShieldCheck },
  { id: "publish", name: "Publish", role: "Scheduler", line: "Posts to TikTok, Reels, Shorts and Facebook at the times your audience is online.", icon: Send },
  { id: "optimize", name: "Optimize", role: "Analyst", line: "Reads the results and feeds what worked back into tomorrow's plan.", icon: LineChart },
];
