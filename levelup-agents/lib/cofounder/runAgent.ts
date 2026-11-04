import type { AgentId } from "../agents";
import { guided } from "./templates";
import type { AgentResult, Profile } from "./profile";
import { supabase } from "../supabase";

/** Ask the AI route first; if it's unavailable, use the guided version. */
export async function runAgent(agentId: AgentId, profile: Profile, answers: Record<string, string>): Promise<AgentResult> {
  try {
    const { data } = (await supabase()?.auth.getSession()) ?? { data: { session: null } };
    const token = data.session?.access_token;
    const res = await fetch("/api/agent", { method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ agentId, profile, answers }) });
    const out = await res.json();
    if (out?.source === "ai" && Array.isArray(out.sections) && out.sections.length) return { sections: out.sections, source: "ai", at: Date.now() };
  } catch { /* network error: fall through */ }
  return { sections: guided(agentId, profile, answers), source: "guided", at: Date.now() };
}
