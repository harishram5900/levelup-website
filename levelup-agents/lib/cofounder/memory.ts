import { AGENTS, agentById, type AgentId } from "../agents";
import { hasGap } from "./deck";
import { OPPORTUNITIES } from "./opportunities";
import { PLAYBOOKS } from "./playbooks";
import type { Workspace } from "./profile";
import { recommend } from "./recommend";

/** Everything the co-founder remembers about this founder, as short facts (shown in the UI and sent to the AI). */
export function memoryFacts(w: Workspace): { group: string; facts: string[] }[] {
  const p = w.profile;
  if (!p) return [];
  const groups: { group: string; facts: string[] }[] = [];
  groups.push({ group: "You & your startup", facts: [
    p.founder ? `Founder: ${p.founder}` : "",
    `Startup: ${p.startup}. ${p.startup} ${p.idea.replace(/\.$/, "")}.`,
    `Customer: ${p.customer}`,
    `Stage: ${p.stage === "idea" ? "just an idea" : p.stage === "building" ? "building it" : "launched"}`,
    w.team ? `Team: ${w.team}` : "",
  ].filter(Boolean) });
  const answers: string[] = [];
  for (const a of AGENTS) {
    const ans = w.answers[a.id];
    if (!ans) continue;
    for (const f of a.fields) { const v = (ans[f.id] ?? "").trim(); if (v) answers.push(`${a.name}: ${f.label.replace(/\?$/, "")} → ${v}`); }
  }
  if (answers.length) groups.push({ group: "What you've told your agents", facts: answers });
  const plans = AGENTS.filter((a) => w.results[a.id]).map((a) => `${a.name} plan: ${w.results[a.id]!.sections.map((s) => `${s.title}: ${s.items[0] ?? ""}`).join(" | ").slice(0, 400)}`);
  if (plans.length) groups.push({ group: "Plans you've made", facts: plans });
  const open = w.goals.filter((g) => !g.done).map((g) => `Open goal: ${g.text}`);
  const done = w.goals.filter((g) => g.done).map((g) => `Done: ${g.text}`);
  if (open.length || done.length) groups.push({ group: "Goals", facts: [...open, ...done] });
  const extra: string[] = [];
  if (w.deck) extra.push(`Pitch deck: ${w.deck.slides.length} slides, ${w.deck.slides.reduce((n, s) => n + [s.title, ...s.bullets].filter(hasGap).length, 0)} blanks left to fill`);
  for (const id of w.saved) { const o = OPPORTUNITIES.find((x) => x.id === id); if (o) extra.push(`Saved opportunity: ${o.name} (${o.type})`); }
  if (extra.length) groups.push({ group: "Progress", facts: extra });
  if (w.notes?.length) groups.push({ group: "Pinned notes", facts: w.notes });
  return groups;
}

/** Plain-text memory for the AI prompt (capped so requests stay small). */
export function memoryText(w: Workspace): string {
  return memoryFacts(w).map((g) => `## ${g.group}\n${g.facts.map((f) => `- ${f}`).join("\n")}`).join("\n\n").slice(0, 12000);
}

const TOPICS: { id: AgentId; words: RegExp }[] = [
  { id: "money", words: /pric|money|charge|revenue|break.?even|cost|profit|fund|grant/i },
  { id: "investor", words: /investor|raise|vc|safe|equity|angel|valuation/i },
  { id: "customer", words: /customer|user|interview|talk to|feedback|survey/i },
  { id: "pitch", words: /pitch|deck|judge|present|competition|slide/i },
  { id: "competitor", words: /compet|rival|alternative|copy|different/i },
  { id: "launch", words: /launch|grow|growth|market|users? fast|viral|first 100/i },
  { id: "content", words: /tiktok|instagram|content|post|video|youtube|social/i },
  { id: "sales", words: /sell|sales|close|outreach|cold|email|dm|objection/i },
  { id: "build", words: /build|mvp|code|app|feature|no.?code|tech/i },
  { id: "brand", words: /brand|name|logo|color|tagline|domain/i },
  { id: "offer", words: /offer|bonus|guarantee|value equation|hormozi/i },
  { id: "idea", words: /idea|validate|worth|pivot|problem/i },
];

/** Free "guided mode" replies (no AI key): answers from the founder's own saved plans plus a matching playbook. */
export function guidedReply(w: Workspace, msg: string): string {
  const p = w.profile!;
  const name = p.founder || "there";
  if (/stuck|stress|overwhelm|give up|quit|motivat|tired|scared/i.test(msg)) {
    const r = recommend(w)[0];
    return `I hear you, ${name}. Every founder hits this. Shrink the problem: do ONE small thing today. My pick: **${r?.title ?? "talk to one customer"}**. ${r?.why ?? ""}\n\nRemember why you started ${p.startup}: for ${p.customer}. Progress beats perfect.`;
  }
  if (/what (should|do) i do|next|where.*start|priorit/i.test(msg)) {
    const recs = recommend(w).slice(0, 3);
    return `Here's what I'd do next for ${p.startup}:\n${recs.map((r, i) => `${i + 1}. **${r.title}**: ${r.why}`).join("\n")}`;
  }
  const topic = TOPICS.find((x) => x.words.test(msg));
  if (topic) {
    const a = agentById(topic.id)!;
    const res = w.results[topic.id];
    const pb = PLAYBOOKS.find((x) => a.playbooks.includes(x.id));
    const fromPlan = res ? `From your **${a.name} plan**:\n${res.sections.slice(0, 2).map((s) => `• ${s.title}: ${s.items[0]}`).join("\n")}` : `You haven't run the **${a.name} agent** yet. It's built exactly for this. Open it from the sidebar and I'll write a plan for ${p.startup}.`;
    return `${fromPlan}${pb ? `\n\n**${pb.title}** (${pb.who}): ${pb.idea}\n👉 ${pb.action}` : ""}`;
  }
  const recs = recommend(w).slice(0, 2);
  return `Good question. I'm in guided mode right now, so I answer from your saved plans and founder playbooks. Try asking about pricing, customers, your pitch, competitors, launching or raising money.\n\nMeanwhile, for ${p.startup} I'd focus on:\n${recs.map((r) => `• ${r.title}`).join("\n")}`;
}
