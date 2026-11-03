import type { AgentId } from "../agents";
import { guided } from "./templates";
import type { AgentResult, Profile } from "./profile";

/** Ask the AI route first; if it's unavailable, use the guided version. */
export async function runAgent(agentId: AgentId, profile: Profile, answers: Record<string, string>): Promise<AgentResult> {
  try {
    const res = await fetch("/api/agent", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agentId, profile, answers }) });
    const data = await res.json();
    if (data?.source === "ai" && Array.isArray(data.sections) && data.sections.length) return { sections: data.sections, source: "ai", at: Date.now() };
  } catch { /* network error: fall through */ }
  return { sections: guided(agentId, profile, answers), source: "guided", at: Date.now() };
}
