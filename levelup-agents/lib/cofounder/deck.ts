import type { Slide, Workspace } from "./profile";

const clean = (s?: string) => (s ?? "").trim().replace(/\.$/, "");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const list = (s?: string) => clean(s).split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
/** Text in [brackets] marks a gap the founder still needs to fill. The deck shows it highlighted. */
const gap = (what: string) => `[${what}]`;
const items = (w: Workspace, agent: keyof Workspace["results"], title: string) =>
  w.results[agent]?.sections.find((s) => s.title.toLowerCase() === title.toLowerCase())?.items ?? [];

let n = 0;
const slide = (kind: Slide["kind"], kicker: string, title: string, bullets: string[]): Slide => ({ id: `s${Date.now().toString(36)}${n++}`, kind, kicker, title, bullets: bullets.filter(Boolean).slice(0, 4) });

/** Builds a 10-slide investor/judge deck from the founder's HQ info and agent answers. Never invents numbers. */
export function buildDeck(w: Workspace): Slide[] {
  const p = w.profile!;
  const A = w.answers;
  const idea = A.idea ?? {}, pitch = A.pitch ?? {}, build = A.build ?? {}, money = A.money ?? {}, launch = A.launch ?? {}, customer = A.customer ?? {};
  const features = list(build.features).slice(0, 3);
  const price = clean(money.price).replace(/[^0-9.]/g, "");
  const firstPitchLine = items(w, "pitch", "One-liner")[0];

  return [
    slide("cover", p.founder ? `Presented by ${p.founder}` : "Pitch deck", p.startup, [cap(firstPitchLine?.replace(`${p.startup}: `, "") ?? `${clean(p.idea)} for ${clean(p.customer)}.`)]),
    slide("content", "The problem", clean(idea.problem) ? cap(clean(idea.problem)) : gap("The problem in one sentence"), [
      `Who feels it: ${clean(p.customer)}`,
      clean(idea.today) ? `Today they ${clean(idea.today).replace(/^they\s+/i, "")}` : gap("How people deal with it today"),
      gap("One real moment or quote from a customer"),
    ]),
    slide("content", "Our solution", `${p.startup} ${clean(p.idea)}`, features.length ? features.map((f) => cap(f)) : [gap("Feature 1"), gap("Feature 2"), gap("Feature 3")]),
    slide("content", "Why now", "The timing is right", [gap("What changed recently that makes this possible (tech, behavior, cost)"), gap("Why this couldn't have worked 5 years ago")]),
    slide("content", "Customer", `Built for ${clean(p.customer)}`, [
      clean(customer.where) ? `Where we find them: ${clean(customer.where)}` : gap("Where your customers spend time"),
      gap("How many of them exist (cite a source)"),
      gap("What we learned from customer interviews"),
    ]),
    slide("content", "Traction", "Progress so far", clean(pitch.traction) ? [cap(clean(pitch.traction)), gap("Your next milestone and date")] : [gap("Real numbers only: users, waitlist, pilots, revenue"), gap("Your next milestone and date")]),
    slide("content", "Business model", clean(money.model) ? cap(clean(money.model)) : gap("How you make money"), [
      price ? `Price: $${price}${/month|subscription/i.test(money.model ?? "") ? " per month" : ""}` : gap("Price"),
      items(w, "money", "Break-even math")[0] ?? gap("Break-even: costs ÷ price"),
      gap("Who pays (users, parents, schools, businesses)"),
    ]),
    slide("content", "Go to market", "How we'll grow", [
      clean(launch.channels) ? `Channels: ${clean(launch.channels)}` : gap("Your first channels"),
      clean(launch.goal) ? `First-month goal: ${clean(launch.goal)}` : gap("First-month goal"),
      gap("Your unfair advantage in reaching customers"),
    ]),
    slide("content", "Team", "Why us", [
      clean(idea.whyYou) ? cap(clean(idea.whyYou)) : gap("Why you're the right founder"),
      clean(pitch.story) ? `Our story: ${clean(pitch.story)}` : gap("Why you started this"),
      gap("Team members and roles"),
    ]),
    slide("closing", "The ask", clean(pitch.ask) ? `We're here for ${clean(pitch.ask)}` : gap("What you're asking for"), [
      gap("What you'll do with it"),
      gap("Your email or website"),
    ]),
  ];
}

export const hasGap = (s: string) => /\[[^\]]+\]/.test(s);
