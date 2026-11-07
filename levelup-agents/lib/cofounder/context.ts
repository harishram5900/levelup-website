/**
 * Business context for the guided plans: what kind of startup this is, and grammatical building blocks
 * from the founder's own words. Lets every agent give a cupcake seller, a hardware maker and an app
 * builder advice in their own language instead of assuming everything is an app.
 */
import type { AgentId } from "../agents";
import type { Profile } from "./profile";

export type Kind = "app" | "product" | "food" | "service" | "social";
type A = Record<string, string>;
export type AllAnswers = Partial<Record<AgentId, A>>;

const RE = {
  social: /\b(donat\w*|non-?profit|charity|shelters?|volunteer\w*|food banks?|underserved|community service)\b/i,
  app: /\b(apps?|website|web ?app|platform|software|saas|ai|chatbot|online tool|games?|extension|bots?|api|plugin|marketplace|journaling app)\b/i,
  food: /\b(cupcakes?|cakes?|bak\w+|cookies?|snacks?|food|drinks?|coffee|tea|candy|meals?|lemonade|smoothies?|jams?|sauces?|treats?|desserts?|catering)\b/i,
  product: /\b(sensors?|devices?|hardware|robots?|kits?|clothing|clothes|streetwear|shirts?|t-shirts?|hoodies?|jewelry|candles?|stickers?|merch|prints?|handmade|crafts?|resell\w*|resale|vintage|thrift\w*|sneakers?|cosmetics|soaps?|skincare|bracelets?|accessories|furniture|plushies?)\b/i,
  service: /\b(tutor\w*|coaching|lessons?|classes|cleaning|lawn|mowing|babysit\w*|pet ?sitting|dog walking|photography|editing|repairs?|consulting|events?|dj|detailing|car wash|design services?)\b/i,
};

/** What kind of startup this is. Social impact wins when the idea is about donating or helping a community. */
export function kindOf(p: Profile, all: AllAnswers = {}): Kind {
  const idea = `${p.idea} ${p.startup}`;
  const extra = `${all.competitor?.niche ?? ""} ${all.launch?.niche ?? ""} ${all.competitor?.alternatives ?? ""}`;
  if (RE.social.test(idea)) return "social";
  if (RE.app.test(idea)) return "app";
  if (RE.food.test(idea)) return "food";
  if (RE.product.test(idea)) return "product";
  if (RE.service.test(idea)) return /\bapp\b/i.test(extra) ? "app" : "service";
  if (RE.app.test(extra)) return "app";
  return "app";
}

const VERB = /^(lets|helps|gives|makes|turns|matches|connects|teaches|finds|builds|shows|tracks|creates|uses|sells|buys|resells|offers|provides|delivers|brings|is|has|runs|organizes|donates|tests|texts|trains|coaches|plans|designs|prints|bakes|cooks|cleans|fixes|teaches|lets|rents|hosts|reviews|records|saves|sends|collects|recycles|grows|turns|curates|ships|edits|repairs|walks)\b/i;
const toBase = (v: string) => {
  const w = v.toLowerCase();
  if (w === "is") return "are";
  if (w === "has") return "have";
  if (/(ch|sh|x|ss|z)es$/.test(w)) return w.slice(0, -2);
  if (/[^aeiou]ies$/.test(w)) return w.slice(0, -3) + "y";
  if (/s$/.test(w)) return w.slice(0, -1);
  return w;
};

const tidy = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.\s]+$/, "");
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Ready-to-use phrases built from the founder's idea, grammatical whatever the wording. */
export function phrases(p: Profile) {
  const idea = lowerFirst(tidy(p.idea || ""));
  const startup = tidy(p.startup || "your startup");
  const m = idea.match(VERB);
  const verbLed = !!m;
  const noun = /^(a|an|the)\b/i.test(idea);
  // "Sweet Spot sells homemade cupcakes…" / "Unwind is a journaling app…" / "Stash is a way to budget…"
  const does = verbLed ? `${startup} ${idea}` : noun ? `${startup} is ${idea}` : `${startup} is a way to ${idea}`;
  // "we sell homemade cupcakes…" / "we're building a journaling app…"
  const we = verbLed
    ? (m![1].toLowerCase() === "is" ? `we're building ${idea.replace(/^is\s+/i, "")}` : `we ${toBase(m![1])} ${idea.slice(m![1].length).trim()}`)
    : noun ? `we're building ${idea}` : `we help people ${idea}`;
  // Joined verbs too: "we track waste and donate leftovers"
  const VERBS = VERB.source.slice(VERB.source.indexOf("(") + 1, VERB.source.lastIndexOf(")"));
  const weAll = !verbLed || m![1].toLowerCase() === "is" ? we : we.replace(new RegExp(`\\b(and|or|then) (${VERBS})\\b`, "gi"), (_m, j: string, vb: string) => `${j} ${toBase(vb)}`);
  // Short description that fits after "It" or in parentheses: "sells homemade cupcakes…"
  const what = verbLed ? idea : noun ? `is ${idea}` : `helps people ${idea}`;
  const own = tidy(p.customer || "your customers");
  // Coach voice ("only what students at your school need") vs. the founder's own voice for pitches and posts.
  const customer = own.replace(/\bmy\b/gi, "your").replace(/\bour\b/gi, "your").replace(/\bme\b/gi, "you");
  return { startup, idea, does, we: weAll, what, customer, own, founder: tidy(p.founder || "") };
}

/** Physical tech products (sensors, devices, kits) need different advice from clothes or crafts. */
export const isHardware = (p: Profile) => /\b(sensors?|devices?|hardware|robots?|electronics?|prototype|gadgets?|wearables?|drones?|3d[- ]print\w*|circuits?|arduino)\b/i.test(`${p.idea} ${p.startup}`);

/** Words that change with the kind of business. */
export function vocab(kind: Kind) {
  switch (kind) {
    case "food": return { users: "customers", signups: "orders", signup: "order", tryIt: "taste it", first: "first batch", page: "an order form (Google Forms or an Instagram post with a DM-to-order link)", demo: "photos and a taste test", product: "your product" };
    case "product": return { users: "customers", signups: "orders", signup: "order", tryIt: "see it in person", first: "first batch or prototype", page: "a simple product page or preorder form", demo: "photos or a short video of it in use", product: "your product" };
    case "service": return { users: "clients", signups: "bookings", signup: "booking", tryIt: "book a first session", first: "first few clients", page: "a booking page (Google Forms or Calendly)", demo: "a before/after or a short testimonial", product: "your service" };
    case "social": return { users: "partners", signups: "partners", signup: "partner", tryIt: "join a pilot", first: "first pilot", page: "a one-page site explaining the pilot", demo: "photos and numbers from a real pilot", product: "your program" };
    default: return { users: "users", signups: "sign-ups", signup: "sign-up", tryIt: "try it", first: "first version", page: "a one-page site with a sign-up button (Carrd or Google Forms)", demo: "a 30-second screen recording", product: "your app" };
  }
}

/** The founder's topic in a few words: their stated niche, or the most meaningful words of the idea. */
export function topicOf(p: Profile, all: AllAnswers = {}): string {
  const niche = (all.competitor?.niche || all.launch?.niche || "").trim();
  if (niche) return niche;
  const stop = new Set("a an the and or for to of in on with my our your their is are that this it its at by from as who what how app apps platform tool helps help lets let make makes sells sell buys buy uses use people users students teens kids".split(" "));
  return p.idea.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !stop.has(w)).slice(0, 3).join(" ") || "your niche";
}
