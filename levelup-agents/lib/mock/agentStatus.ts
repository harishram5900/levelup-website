import type { AgentId } from "../agents";

// Sample status and last output per agent.
export const AGENT_STATUS: Record<AgentId, { active: boolean; lastRun: string; output: string; done: number }> = {
  research: { active: true, lastRun: "4 min ago", output: "12 trend ideas for a coffee shop, 3 marked high fit", done: 34 },
  script: { active: true, lastRun: "11 min ago", output: "Hook: “Nobody tells you this about opening at 6am…”", done: 27 },
  edit: { active: true, lastRun: "26 min ago", output: "22s vertical cut with captions, ready for review", done: 19 },
  review: { active: true, lastRun: "26 min ago", output: "Approved 4 posts, sent 1 back for a softer tone", done: 41 },
  publish: { active: false, lastRun: "Yesterday", output: "Paused by you. 3 posts waiting in the queue", done: 21 },
  optimize: { active: true, lastRun: "1 hr ago", output: "Short hooks under 3s beat long intros this week", done: 8 },
};
