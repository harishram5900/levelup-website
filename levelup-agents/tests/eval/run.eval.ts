/**
 * Persona evaluation: runs every agent's guided plan and the opportunity matcher for 8 very different
 * young founders, checks quality automatically, and writes a full report for human review.
 * Run: npx vitest run --config vitest.eval.config.ts   (writes EVAL_OUT, default ./eval-report.json)
 */
import { writeFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { AGENTS } from "@/lib/agents";
import { guided } from "@/lib/cofounder/templates";
import { matchOpportunities, tagsFor } from "@/lib/cofounder/opportunities";
import { matchCommunities, matchDirectories } from "@/lib/cofounder/channels";
import { keywords } from "@/lib/server/research";
import { kindOf } from "@/lib/cofounder/context";
import { PERSONAS } from "./personas";

type Issue = { persona: string; agent: string; kind: string; text: string };
const issues: Issue[] = [];
const report: Record<string, unknown> = {};

// Automatic red flags in user-facing text.
const CHECKS: [string, RegExp][] = [
  ["broken-template", /undefined|null|NaN|\[object|\{\w+\}(?!\s*,)|\s{2,}\./],
  ["double-words", /\b(\w{3,})\s+\1\b/i],
  ["awkward-article", /\b(a|an) (a|an|the)\b/i],
  ["empty-quotes", /""|“”/],
  ["dangling-for", /\bfor \./],
  ["capital-mid-sentence-idea", /, [a-z]+ [A-Z][a-z]+ (helps|sells|tracks|matches|buys|is)\b/],
];

describe("persona evaluation", () => {
  for (const p of PERSONAS) {
    it(p.key, () => {
      const out: Record<string, unknown> = { profile: p.profile, tags: tagsFor(`${p.profile.idea} ${p.profile.customer}`), query: keywords(`${p.profile.idea} ${p.profile.customer}`) };
      for (const a of AGENTS) {
        const sections = guided(a.id, p.profile, p.answers[a.id] ?? {}, undefined, p.answers as never);
        out[a.id] = sections;
        expect(sections.length, `${p.key}/${a.id}`).toBeGreaterThan(0);
        const all = sections.flatMap((s) => s.items.map((i) => ({ s: s.title, i })));
        for (const { s, i } of all) for (const [kind, re] of CHECKS) if (re.test(i)) issues.push({ persona: p.key, agent: `${a.id}/${s}`, kind, text: i.slice(0, 220) });
        // Personalization: how many items mention the startup, customer or something the founder typed?
        const own = [p.profile.startup, p.profile.customer, ...Object.values(p.answers).flatMap((x) => Object.values(x)).flatMap((v) => v.split(/[,.]/).map((x) => x.trim()).filter((x) => x.length > 3))].map((x) => x.toLowerCase());
        const personal = all.filter(({ i }) => own.some((o) => i.toLowerCase().includes(o.slice(0, 18)))).length;
        (out as Record<string, unknown>)[`${a.id}__personal`] = `${personal}/${all.length}`;
        if (all.length && personal / all.length < 0.2) issues.push({ persona: p.key, agent: a.id, kind: "generic", text: `only ${personal}/${all.length} items reference this founder's startup or answers` });
      }
      out.opps = matchOpportunities({ text: `${p.profile.idea} ${p.profile.customer} ${p.profile.startup}`, stage: p.profile.stage, limit: 10 }).map((o) => `${o.type}: ${o.name} [${o.tags.join(",")}]`);
      out.kind = kindOf(p.profile, p.answers as never);
      out.communities = matchCommunities(`${p.profile.idea} ${p.profile.customer}`, 6, out.kind as never).map((c) => c.name);
      out.directories = matchDirectories(`${p.profile.idea} ${p.profile.customer}`, 6, out.kind as never).map((d) => d.name);
      report[p.key] = out;
    });
  }
  it("writes the report", () => {
    writeFileSync(process.env.EVAL_OUT || "eval-report.json", JSON.stringify({ issues, report }, null, 2));
    console.log(`ISSUES: ${issues.length}`);
    const byKind: Record<string, number> = {};
    for (const i of issues) byKind[i.kind] = (byKind[i.kind] ?? 0) + 1;
    console.log(JSON.stringify(byKind));
  });
});
