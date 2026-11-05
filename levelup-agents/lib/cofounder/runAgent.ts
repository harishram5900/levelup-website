import { AGENTS, type AgentId } from "../agents";
import type { Research, ResearchKind } from "../server/research";
import { guided } from "./templates";
import { getWorkspace, type AgentResult, type Profile } from "./profile";
import { matchCommunities, matchDirectories } from "./channels";
import { matchOpportunities, type OppType } from "./opportunities";
import { supabase } from "../supabase";

async function authHeaders(): Promise<Record<string, string>> {
  try {
    const { data } = (await supabase()?.auth.getSession()) ?? { data: { session: null } };
    const token = data.session?.access_token;
    return token ? { authorization: `Bearer ${token}` } : {};
  } catch { return {}; }
}

/** Live research (App Store, Google Play, HN, GitHub, Reddit, Devpost, and web research for Pro). */
export async function fetchResearch(kind: ResearchKind, profile: Profile, niche: string, extra = ""): Promise<Research | undefined> {
  try {
    const res = await fetch("/api/research", { method: "POST", headers: { "content-type": "application/json", ...(await authHeaders()) }, body: JSON.stringify({ kind, profile, niche, extra }) });
    if (!res.ok) return undefined;
    return (await res.json()) as Research;
  } catch { return undefined; }
}

const RESEARCH_FOR: Partial<Record<AgentId, ResearchKind>> = { competitor: "competitors", launch: "traction", customer: "traction" };
const OPPS_FOR: Partial<Record<AgentId, OppType[]>> = {
  money: ["Grant", "Competition", "Fellowship", "Credits"], investor: ["Grant", "Fellowship", "Accelerator", "Investor"],
  pitch: ["Competition", "Hackathon", "Program"], build: ["Credits", "Hackathon"], idea: ["Competition", "Program"],
};

/** A short digest of research for the AI prompt. Every line keeps its source link. */
function digest(r: Research | undefined): string {
  if (!r) return "";
  const lines: string[] = [];
  const f = (x: { name: string; url: string; source: string; detail?: string; rating?: number; reviews?: number; price?: string; meta?: string }) =>
    `- ${x.name} [${x.source}]${x.rating ? ` ${x.rating}★` : ""}${x.reviews ? ` (${x.reviews} ratings)` : ""}${x.price ? ` ${x.price}` : ""}${x.meta ? ` · ${x.meta}` : ""}${x.detail ? ` · ${x.detail.slice(0, 160)}` : ""} ${x.url}`;
  if (r.competitors.length) lines.push("Competitors and launches found:", ...r.competitors.slice(0, 15).map(f));
  if (r.complaints.length) lines.push("Recent 1-2 star reviews of competitors:", ...r.complaints.slice(0, 12).map((c) => `- ${c.app} (${c.stars}★): "${c.text}"`));
  if (r.communities.length) lines.push("Communities found:", ...r.communities.slice(0, 12).map(f));
  if (r.discussions.length) lines.push("Recent discussions about the problem:", ...r.discussions.slice(0, 8).map(f));
  if (r.hackathons.length) lines.push("Open hackathons:", ...r.hackathons.slice(0, 8).map(f));
  return lines.join("\n").slice(0, 9000);
}

/** What the other agents already worked out, so every plan builds on the last one. */
function teamContext(exclude: AgentId): string {
  const w = getWorkspace();
  const parts: string[] = [];
  for (const a of AGENTS) {
    if (a.id === exclude) continue;
    const r = w.results[a.id];
    if (!r) continue;
    parts.push(`${a.name} agent:\n${r.sections.slice(0, 4).map((s) => `  ${s.title}: ${s.items.slice(0, 2).join(" | ").slice(0, 300)}`).join("\n")}`);
  }
  if (w.notes?.length) parts.push(`Founder notes: ${w.notes.slice(-8).join(" | ")}`);
  return parts.join("\n").slice(0, 6000);
}

function oppDigest(agentId: AgentId, p: Profile): string {
  const types = OPPS_FOR[agentId];
  const parts: string[] = [];
  if (types) parts.push("Matched opportunities from LevelUp's verified database:", ...matchOpportunities({ text: `${p.idea} ${p.customer} ${p.startup}`, stage: p.stage, types, limit: 10 }).map((o) => `- ${o.name} (${o.type}, ${o.org}, ages: ${o.ages.join("/")}, ${o.region}): ${o.what} Perk: ${o.perk}. ${o.url}`));
  if (agentId === "launch" || agentId === "content" || agentId === "customer") {
    const text = `${p.idea} ${p.customer}`;
    parts.push("Launch sites that fit:", ...matchDirectories(text, 8).map((d) => `- ${d.name}: ${d.how} ${d.url}`));
    parts.push("Communities that fit (always follow their rules):", ...matchCommunities(text, 8).map((c) => `- ${c.name}: ${c.angle} ${c.url}`));
  }
  return parts.join("\n").slice(0, 6000);
}

/** Research first (for agents that need it), then the AI route; if it's unavailable, use the guided version. */
export async function runAgent(agentId: AgentId, profile: Profile, answers: Record<string, string>, onStep?: (s: string) => void): Promise<AgentResult> {
  const kind = RESEARCH_FOR[agentId];
  let research: Research | undefined;
  if (kind && (agentId === "competitor" || agentId === "launch" || agentId === "customer")) {
    onStep?.(agentId === "competitor" ? "Searching the App Store, Google Play, Hacker News and the web…" : agentId === "customer" ? "Finding where your customers talk about this problem…" : "Finding communities and launch sites for your niche…");
    research = await fetchResearch(kind, profile, (answers.niche ?? "").trim(), answers.alternatives ?? "");
  }
  onStep?.("Writing your plan…");
  try {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ agentId, profile, answers, research: digest(research), team: teamContext(agentId), matches: oppDigest(agentId, profile) }),
    });
    const out = await res.json();
    if (out?.source === "ai" && Array.isArray(out.sections) && out.sections.length) return { sections: out.sections, source: "ai", at: Date.now(), research };
  } catch { /* network error: fall through */ }
  return { sections: guided(agentId, profile, answers, research), source: "guided", at: Date.now(), research };
}
