import { AGENTS } from "../agents";
import { hasGap } from "./deck";
import { OPPORTUNITIES } from "./opportunities";
import { PLAYBOOKS } from "./playbooks";
import type { Workspace } from "./profile";
import { PRO_AGENTS } from "./plan";

export type Rec = { id: string; title: string; why: string; href: string; cta: string; tag: string; external?: boolean };

/** What a good co-founder would tell you to do next, based on where the startup is. */
export function recommend(w: Workspace, pro = false): Rec[] {
  const r = w.results;
  const p = w.profile!;
  const recs: Rec[] = [];
  const done = (id: keyof typeof r) => !!r[id];

  if (!done("idea")) recs.push({ id: "idea", tag: "Start here", title: "Pressure-test your idea", why: "Most startups fail because nobody wants what they built. Two minutes now saves months later.", href: "/app/agents/idea", cta: "Run Idea agent" });
  if (done("idea") && !done("customer")) recs.push({ id: "customer", tag: "Mom Test", title: `Talk to 5 ${p.customer} this week`, why: "Before you build more, hear the problem in their words. Ask about the past, not about your idea.", href: "/app/agents/customer", cta: "Get interview script" });
  if (p.stage === "idea" && done("customer") && !done("build")) recs.push({ id: "build", tag: "Ship fast", title: "Build the smallest version in 2 weeks", why: "Reid Hoffman's rule: if you're not embarrassed by v1, you launched too late.", href: "/app/agents/build", cta: "Plan my MVP" });
  if (pro && done("customer") && !done("offer")) recs.push({ id: "offer", tag: "Hormozi", title: "Turn your product into an offer", why: "People buy outcomes. The Value Equation shows what to fix: proof, speed or effort.", href: "/app/agents/offer", cta: "Build my offer" });
  if (pro && p.stage !== "idea" && !done("sales")) recs.push({ id: "sales", tag: "Sales cures all", title: "Get your first paying customer", why: "Revenue is the strongest proof you can show judges and investors.", href: "/app/agents/sales", cta: "Get sales scripts" });
  if (done("pitch") && !w.deck) recs.push(pro
    ? { id: "deck", tag: "Boss level", title: "Build your pitch deck", why: "You already wrote your pitch. One click turns it into a 10-slide deck.", href: "/app/deck", cta: "Build deck" }
    : { id: "pro", tag: "Pro", title: "Turn your pitch into a deck", why: "LevelUp Pro designs a 10-slide deck from your answers, plus the Offer, Sales and Investor agents.", href: "/app/upgrade", cta: "See Pro" });
  if (w.deck) {
    const gaps = w.deck.slides.reduce((n, s) => n + [s.title, ...s.bullets].filter(hasGap).length, 0);
    if (gaps > 0) recs.push({ id: "deck-gaps", tag: "Polish", title: `Fill ${gaps} blanks in your deck`, why: "Real numbers and stories beat placeholders. Judges notice.", href: "/app/deck", cta: "Open deck" });
  }
  if (!w.goals.some((g) => !g.done)) recs.push({ id: "goal", tag: "Weekly check-in", title: "Set one goal for this week", why: "Founders who set a weekly goal ship faster. Try: \"Interview 5 customers\".", href: "/app#goals", cta: "Add a goal" });
  const next = AGENTS.find((a) => !r[a.id] && (pro || !PRO_AGENTS.includes(a.id)));
  if (next && !recs.some((x) => x.id === next.id)) recs.push({ id: next.id, tag: "Next quest", title: `${next.name} agent: ${next.stage.toLowerCase()}`, why: next.line, href: `/app/agents/${next.id}`, cta: "Start" });

  // Matched opportunity, rotated by day so it feels fresh.
  const fits = OPPORTUNITIES.filter((o) => o.stage.includes(p.stage) && !w.saved.includes(o.id) && o.type !== "Investor");
  if (fits.length) {
    const o = fits[new Date().getDate() % fits.length];
    recs.push({ id: `opp-${o.id}`, tag: o.type, title: `Look at ${o.name}`, why: `${o.what} ${o.perk}.`, href: o.url, cta: "Official site", external: true });
  }
  return recs.slice(0, 4);
}

/** A different playbook each day. */
export function playbookOfTheDay() {
  const d = new Date();
  const n = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate();
  return PLAYBOOKS[n % PLAYBOOKS.length];
}
