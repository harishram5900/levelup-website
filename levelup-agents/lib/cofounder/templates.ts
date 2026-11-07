/**
 * Guided (no-AI) versions of every agent. They use the founder's own answers plus proven startup
 * frameworks, so every founder gets a useful result even without an API key. Advice adapts to the kind
 * of business (app, physical product, food, service or social impact) via lib/cofounder/context.ts.
 */
import type { AgentId } from "../agents";
import type { Profile, Section } from "./profile";
import type { Research } from "../server/research";
import { matchCommunities, matchDirectories } from "./channels";
import { matchOpportunities, type OppType } from "./opportunities";
import { isHardware, kindOf, phrases, topicOf, vocab, type AllAnswers, type Kind } from "./context";

type A = Record<string, string>;
type Ctx = { p: Profile; a: A; r?: Research; all: AllAnswers; kind: Kind; ph: ReturnType<typeof phrases>; v: ReturnType<typeof vocab>; topic: string; hw: boolean };
const t = (s?: string, fallback = "") => (s ?? "").trim() || fallback;
const list = (s?: string) => t(s).split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
const num = (s?: string) => parseFloat(t(s).replace(/[^0-9.]/g, "")) || 0;
const clip = (x: string, n: number) => (x.length > n ? `${x.slice(0, n - 1).trim()}…` : x);
const nameOf = (x: string) => x.replace(/:/g, " –");
const lower = (s: string) => (/^([A-Z][a-z]|A )/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const money$ = (n: number) => `$${Number.isInteger(n) ? n.toLocaleString("en-US") : n.toFixed(2)}`;
const oppLine = (o: { name: string; type: string; perk: string; url: string; ages: string[] }) => `${o.name} (${o.type}, ${o.ages.join("/")}): ${o.perk}. ${o.url}`;
const matched = (c: Ctx, types: OppType[], n: number) => matchOpportunities({ text: `${c.p.idea} ${c.p.customer} ${c.topic}`, stage: c.p.stage, types, limit: n });
/** The founder's problem in their own words (from the Idea agent), if they gave it. */
const problemOf = (c: Ctx) => t(c.all.idea?.problem).replace(/\.$/, "");

/* ---------------- Idea ---------------- */
function idea(c: Ctx): Section[] {
  const { a, ph, v, kind } = c;
  const strong: string[] = [];
  const risks: string[] = [];
  if (t(a.whyYou)) strong.push(`Founder fit: ${t(a.whyYou).replace(/\.$/, "")}. Lead with this in every pitch.`);
  else risks.push("You haven't said why you're the right person. Judges and investors ask this first.");
  if (t(a.problem).length > 25) strong.push("You can describe the problem clearly, which most first-time founders can't.");
  else risks.push("The problem is vague. Describe one specific moment when your customer feels it.");
  if (t(a.today)) { strong.push(`People already deal with it somehow (${lower(t(a.today).replace(/\.$/, ""))}), which shows the need is real.`); risks.push(`You need a clear reason people would switch from what they do today (${lower(t(a.today).replace(/\.$/, ""))}) to ${ph.startup}.`); }
  else risks.push("You don't know how people solve this today. If nobody tries to solve it, it may not hurt enough.");
  risks.push(kind === "app"
    ? `Riskiest assumption: that ${ph.customer} will come back and use ${ph.startup} more than once. Test it before building more.`
    : kind === "social"
      ? `Riskiest assumption: that the organizations you need (like ${ph.customer}) will actually commit time to a pilot. Get one yes in writing early.`
      : c.hw || /one[- ]time/i.test(t(c.all.money?.model))
        ? `Riskiest assumption: that ${ph.customer} will actually pay${t(c.all.money?.price) ? ` $${t(c.all.money?.price).replace(/^\$/, "")}` : ""} for it, not just say it's cool. Paid preorders are the proof.`
        : `Riskiest assumption: that ${ph.customer} will pay your price again and again, not just once to support you. Track repeat ${v.signups}.`);
  const tests: Record<Kind, string[]> = {
    app: [
      `Talk to 5 of your target customers (${ph.customer}) this week. Ask about the last time the problem happened, not whether they like your idea.`,
      `Make ${v.page} and share it in two places your customers spend time. Count ${v.signups}.`,
      "Fake the product by hand: solve the problem manually for 3 people and see if they come back for more.",
    ],
    food: [
      `Take preorders before you bake more: post today's menu with a real price and a pickup day. Count real ${v.signups}, not likes.`,
      "Do a taste test with 10 people who aren't your friends. Ask which item they'd buy again and at what price.",
      `Sell one small batch at a real event this week and write down what sold out first and what was left over.`,
    ],
    product: [
      `Take preorders or deposits before making more. 10 paid preorders beat 100 compliments.`,
      `Show your ${v.first} to 5 target customers and watch how they use it. Ask what they'd pay.`,
      c.hw ? "Put up a preorder page (or a $1 deposit) and share it with the groups your customers are in. Count deposits, not likes." : "List it where buyers already shop (Instagram, Depop, Etsy or a local market) and see what happens in 7 days.",
    ],
    service: [
      `Do the service for 3 real ${v.users} this week, even at a small price. Ask each one for a short testimonial.`,
      `Make ${v.page} and share it in two places your customers spend time. Count ${v.signups}.`,
      "Ask every client: \"Would you book again, and who else needs this?\" Repeat bookings are your proof.",
    ],
    social: [
      "Talk to 3 of the organizations you need (schools, shelters, programs). Ask what stops them from doing this today.",
      "Run a tiny pilot by hand for one week and measure one number (e.g. meals saved or students helped).",
      "Write a one-page pilot proposal you can hand to a decision-maker, with the result you'll measure.",
    ],
  };
  return [
    { title: "Your one-liner", items: [`${ph.does}, for ${ph.own}.`] },
    { title: "What's strong", items: strong },
    { title: "Biggest risks", items: risks },
    { title: "Test it this week", items: tests[kind] },
  ];
}

/* ---------------- Customer ---------------- */
function customer(c: Ctx): Section[] {
  const { p, a, r, ph, v } = c;
  const where = list(a.where);
  const liveSubs = (r?.communities ?? []).slice(0, 4);
  const threads = (r?.discussions ?? []).slice(0, 4);
  const prob = problemOf(c);
  return [
    { title: "Interview questions", items: [
      prob ? `Tell me about the last time this happened to you: "${lower(prob)}".` : `Tell me about the last time you needed something like ${ph.startup}. What happened?`,
      "What did you do about it? What did you try before that?",
      "What was the most annoying part?",
      "How much time or money have you spent on this in the last month?",
      "If you could wave a magic wand, what would happen instead?",
      t(a.learn) ? `Then ask what you most need to learn: ${t(a.learn)}` : "Who else do you know who deals with this?",
      `Can I show you what I'm making and get your honest reaction?`,
    ] },
    { title: "Where to find your first 10", items: [
      ...(where.length ? where.map((w) => `${w}: post a short, honest message asking for 10 minutes of feedback.`) : ["List three places your customers already gather, online and offline."]),
      ...liveSubs.map((s) => `${s.name}${s.meta ? ` (${s.meta})` : ""}: ask members about their experience with the problem (not your product). ${s.url}`),
      ...matchCommunities(`${p.idea} ${p.customer} ${t(a.where)} ${c.topic}`, 4, c.kind).filter((s) => !liveSubs.some((l) => l.name.toLowerCase() === s.name.toLowerCase())).map((s) => `${s.name}: ${s.angle} ${s.url}`),
      ...threads.map((d) => `People already discussing this: "${clip(d.name, 90)}" (${d.source}). Read the replies for exact customer words. ${d.url}`),
      "Ask every person you interview: \"Who else should I talk to?\" One customer usually leads to two more.",
    ] },
    { title: "Message to send", items: [`Hi! I'm ${t(ph.founder, "a student founder")}, and I'm starting ${ph.startup} for ${ph.own}. I'm not selling anything yet. Could I ask you 5 quick questions${prob ? ` about ${lower(prob)}` : ""}? It would really help.`] },
    { title: "What to write down", items: ["The exact words they use to describe the problem (use them in your marketing).", "What they already pay for or spend time on.", `Whether they asked to ${v.tryIt} or to be told when it's ready. That's your real signal.`] },
  ];
}

/* ---------------- Build ---------------- */
function build(c: Ctx): Section[] {
  const { a, ph, v, kind } = c;
  const feats = list(a.features);
  const must = feats.slice(0, 3);
  const later = feats.slice(3);
  const codes = /code|html|react|python|swift|flutter|js|developer|program/i.test(t(a.skills)) && !/no cod|can't code|cannot code/i.test(t(a.skills));
  const hours = Math.max(1, parseInt(t(a.hours, "8"), 10) || 8);
  const tools: Record<Kind, string[]> = {
    app: codes
      ? ["Next.js or Flutter for the app, deployed free on Vercel or as a TestFlight build.", "Supabase for logins and data (free tier).", "Stripe when you're ready to charge."]
      : ["No-code: Glide or Softr for apps, Carrd or Framer for websites.", "Google Forms and Sheets as a free backend to start.", "Tally or Typeform for sign-ups. Learn to code later if it takes off."],
    food: ["Orders: a Google Form or Instagram DMs, tracked in a Google Sheet.", "Payments: Square, Venmo Business or Cash App (a parent may need to set it up if you're under 18).", "Photos: natural light and a plain background. Your phone is enough.", "Check your local cottage food rules before selling food you make at home."],
    product: c.hw
      ? ["Prototype with off-the-shelf parts (Arduino, ESP32, Raspberry Pi) and a 3D-printed case from a makerspace or library.", "Work out your bill of materials (BOM) cost per unit early: it decides your price.", "Preorders: a simple Shopify or Square page now, Kickstarter once you have a working demo video.", "Check safety and labeling rules for anything that touches water, food or electricity before you sell."]
      : ["Make a small first batch with what you have; don't buy inventory you haven't sold yet.", "Sell with an Instagram shop, Depop, Etsy or a simple Shopify Starter page.", "Track every cost per unit in a spreadsheet so you know your real margin.", "Payments: Square or Stripe (a parent may need to set it up if you're under 18)."],
    service: ["Bookings: Google Forms or Calendly (free).", "Payments: Square, Venmo Business or Cash App.", "A one-page site (Carrd) with your offer, price and 2 testimonials.", "A simple checklist so every client gets the same great result."],
    social: ["A one-page site (Carrd) explaining the problem, your pilot and how to join.", "Google Sheets to track the impact number you'll report (meals, students, hours).", "A shared Google Drive for partners: one-pager, sign-up form and results.", "Fiscal sponsorship (like Hack Club HCB) if you need to accept donations without registering a nonprofit."],
  };
  const plan = kind === "app"
    ? [`Days 1–3 (~${Math.ceil(hours * 0.4)}h): sketch the screens on paper and build a clickable mockup.`, `Days 4–8 (~${Math.ceil(hours * 0.8)}h): build ${must[0] ?? "the core feature"} end to end.`, `Days 9–11 (~${Math.ceil(hours * 0.5)}h): put it in front of 3 real ${v.users} and watch them use it without helping.`, `Days 12–14 (~${Math.ceil(hours * 0.3)}h): fix the top problem they hit, then share it more widely.`]
    : [`Days 1–3 (~${Math.ceil(hours * 0.4)}h): decide the one thing ${ph.startup} must do perfectly${kind === "social" ? " and the one number you'll measure" : ", and set your price"}.`, `Days 4–8 (~${Math.ceil(hours * 0.8)}h): make your ${v.first} and ${v.page}.`, `Days 9–11 (~${Math.ceil(hours * 0.5)}h): get it to 3 real ${v.users} and watch what they actually do.`, `Days 12–14 (~${Math.ceil(hours * 0.3)}h): fix the biggest problem, then ${kind === "social" ? "invite more partners" : `open ${v.signups} to more people`}.`];
  return [
    { title: "Build first", items: must.length ? must.map((f) => `${f}: the simplest version that lets ${ph.customer} feel the core value.`) : [`Your ${v.first}: only what ${ph.customer} need to get the core result. Everything else waits.`] },
    { title: "Save for later", items: later.length ? later.map((f) => `${f}: add it only after real ${v.users} ask for it.`) : [`Anything ${ph.customer} haven't asked for yet. Every extra delays your launch.`] },
    { title: "Tools to use", items: tools[kind] },
    { title: "Your 2-week plan", items: plan },
  ];
}

/* ---------------- Pitch ---------------- */
function pitch(c: Ctx): Section[] {
  const { a, ph, v } = c;
  const traction = t(a.traction, `an early version that's ready for its ${v.first === "first version" ? "first users" : v.users}`);
  const story = t(a.story).replace(/\.$/, "");
  return [
    { title: "One-liner", items: [`${ph.does}, for ${ph.own}.`] },
    { title: "30-second pitch", items: [
      `${story ? `${cap(story)}. ` : ""}${ph.does}, for ${ph.own}. So far, ${lower(traction.replace(/\.$/, ""))}. ${t(a.ask) ? `We're here for ${lower(t(a.ask))} to reach our next milestone.` : "Next, we're focused on our next 100 customers."}`,
    ] },
    { title: "Deck outline", items: [
      `1. Title: ${ph.startup} and your one-liner`,
      "2. Problem: one real story, then how big it is",
      "3. Solution: what it does, in one sentence",
      `4. Demo: ${v.demo}`,
      `5. Customer: who exactly (${ph.customer}) and how you reach them`,
      `6. Traction: ${traction} (real numbers only)`,
      "7. Business model: who pays, how much, and your margin",
      "8. Competition: who else exists and why you're different",
      "9. Team: why you're the people to build this",
      "10. Ask: what you want and what it unlocks",
    ] },
    { title: "Questions judges will ask", items: ["Why you? What do you know that others don't?", `How will you get your next 100 ${v.users}?`, "Who pays, how much, and what does each one cost you?", "What happens if a bigger company copies you?", "What will you do with the prize or investment?"] },
    { title: "Where to pitch it", items: matched(c, ["Competition", "Hackathon", "Program"], 6).map(oppLine) },
  ];
}

/* ---------------- Money ---------------- */
function money(c: Ctx): Section[] {
  const { a, kind, v } = c;
  const price = num(a.price), costs = num(a.costs), unit = num(a.unitCost);
  const margin = price - unit;
  const recurring = /sub|month|year|annual|per year|freemium|premium/i.test(t(a.model));
  const yearly = recurring && /year|annual/i.test(t(a.model));
  const perMonth = (x: number) => (yearly ? x / 12 : x);
  const be = price > 0 ? (unit > 0 ? (margin > 0 ? Math.ceil(costs / perMonth(margin)) : null) : Math.ceil(costs / perMonth(price))) : null;
  const who = (n: number | null) => (kind === "social" ? (n === 1 ? "partner" : "partners") : n === 1 ? "customer" : "customers");
  const pricing = [
    price ? `Start at ${money$(price)}${recurring ? `/${/year|annual/i.test(t(a.model)) ? "year" : "month"}` : ""} and ask your first 10 ${v.users} if it feels fair. Raising prices later is easier than you think.` : "Pick a starting price, even a guess. Giving it away tells you nothing about demand.",
    kind === "app" ? "Offer a free version or trial so people can feel the value before paying." : kind === "food" || kind === "product" ? "Offer a bundle (e.g. a box or set) to raise the average order without raising your base price." : kind === "service" ? "Offer a package (e.g. 4 sessions) at a small discount. Packages bring repeat clients." : "Ask organizations to cover the pilot cost, or find a sponsor who will.",
    t(a.model) ? `Your model (${t(a.model)}): make it simple enough to explain in one sentence.` : "Choose one model to start: subscription, one-time purchase, or organizations paying for groups.",
  ];
  const math = price <= 0 ? ["Add your price and monthly costs above to see how many sales you need to break even."]
    : unit > 0 && margin <= 0 ? [`Each sale costs ${money$(unit)} to make but sells for ${money$(price)}. You lose money on every sale. Raise the price or cut the cost before selling more.`]
    : [
      unit > 0 ? `Each sale: ${money$(price)} price − ${money$(unit)} cost = ${money$(margin)} profit (${Math.round((margin / price) * 100)}% margin).` : `You didn't add a cost per sale. If each one costs you something to make or deliver, add it above for the real math.`,
      recurring
        ? `Monthly costs ${money$(costs)} ÷ ${money$(Math.round(perMonth(unit > 0 ? margin : price) * 100) / 100)} per ${who(1)} a month${yearly ? ` (${money$(unit > 0 ? margin : price)} a year ÷ 12)` : ""} = ${be} paying ${who(be)} to break even.`
        : `Monthly costs ${money$(costs)} ÷ ${money$(unit > 0 ? margin : price)} per sale = ${be} sale${be === 1 ? "" : "s"} a month to break even.`,
      kind === "app" && /free|freemium/i.test(t(a.model)) ? `If about 4% of free users upgrade (a common freemium rate), that's about ${Math.ceil((be ?? 0) / 0.04)} free users.` : recurring ? `Every paying ${who(1)} after that is profit. Track it weekly in the Growth tab.` : (be ?? 0) >= 8 ? `That's about ${Math.ceil((be ?? 0) / 4.3)} a week. Track it weekly in the Growth tab.` : "That's very reachable. Track sales weekly in the Growth tab.",
    ];
  return [
    { title: "Pricing", items: pricing },
    { title: "Break-even math", items: math },
    { title: "Funding you can get", items: [
      ...matched(c, ["Grant", "Competition", "Fellowship"], 5).map(oppLine),
      kind === "app" ? "Free credits so you spend less: " + matched(c, ["Credits"], 4).map((o) => o.name).join(", ") + "." : "Pre-sales are your best funding: let customers pay before you make more.",
      "Paul Graham's test: are you default alive? With today's growth and costs, do you reach profit before money runs out?",
    ] },
    { title: "Money basics", items: ["Keep business money separate from personal money from day one.", "Track every dollar in a simple spreadsheet: date, what, amount.", "If you're under 18, a parent or guardian will need to help with bank accounts, payments and contracts."] },
  ];
}

/* ---------------- Launch & Traction ---------------- */
const THEMES: { key: string; pain: string; re: RegExp; gap: string }[] = [
  { key: "pricing and subscriptions", pain: "surprise charges and subscriptions they can't cancel", re: /price|pricey|expensive|subscription|paywall|charged|cancel|refund|trial|money|pay\b|scam/i, gap: "Simple, honest pricing: a real free tier, no surprise charges, and one-tap cancel. Say it loudly on your landing page." },
  { key: "bugs and crashes", pain: "apps that crash and glitch", re: /crash|bug|glitch|freez|broken|doesn.t work|not working|error|won.t load|keeps closing/i, gap: "Reliability: a small product that always works beats a big one that crashes. Test every release on a real phone." },
  { key: "ads", pain: "ads everywhere", re: /\bads?\b|advert/i, gap: "No ads (or very few). Make that part of your pitch." },
  { key: "generic or low-quality content", pain: "generic, one-size-fits-all content", re: /generic|inaccurate|wrong|useless|repetitive|boring|same thing|slop|low quality|shallow/i, gap: "Depth and personalization: make every session feel made for the user, not copy-pasted." },
  { key: "confusing design", pain: "confusing, cluttered apps", re: /confus|hard to use|complicated|interface|navigation|cluttered|too many/i, gap: "Dead-simple onboarding: first result in under 2 minutes with zero setup." },
  { key: "bad support", pain: "being ignored by support", re: /support|customer service|no response|no reply|ignored/i, gap: "Personal support: as a small startup you can reply to every user yourself, within hours." },
  { key: "account and login problems", pain: "login and sync problems", re: /login|log in|sign in|account|password|restore|sync/i, gap: "Frictionless accounts: let people try before signing up, and make restore and sync just work." },
  { key: "missing features", pain: "apps missing what they actually need", re: /wish|missing|need(s)? (a|to)|would be (nice|great)|please add|no option/i, gap: "Build the feature users keep asking competitors for. Read the reviews and list the exact requests." },
];
function themesOf(r?: Research) {
  const cs = r?.complaints ?? [];
  return THEMES.map((x) => ({ ...x, n: cs.filter((c) => x.re.test(c.text)).length })).filter((x) => x.n > 0).sort((x, y) => y.n - x.n);
}

function launch(c: Ctx): Section[] {
  const { p, a, r, ph, v, kind } = c;
  const channels = list(a.channels);
  const goal = t(a.goal, `your first 100 ${v.users}`);
  const link = t(a.link, "[your link]");
  const text = `${p.idea} ${p.customer} ${t(a.niche)} ${c.topic}`;
  const live = (r?.communities ?? []).slice(0, 6);
  const curated = matchCommunities(text, 8, kind).filter((s) => !live.some((l) => l.name.toLowerCase() === s.name.toLowerCase()));
  const threads = (r?.discussions ?? []).slice(0, 4);
  const dirs = matchDirectories(text, 8, kind);
  const ch = channels.length ? channels : kind === "app" ? ["TikTok", "Instagram"] : ["Instagram", "TikTok"];
  const g = parseInt(goal.replace(/[^0-9]/g, ""), 10) || 100;
  const prob = problemOf(c);
  const drafts = [
    `Instagram / TikTok post (${ch[0]}): Hook (0-2s): "${prob ? cap(lower(prob)) : `If you're one of the ${ph.customer}…`}" Then show ${kind === "app" ? `${ph.startup} solving it on screen` : `${ph.startup} in real life`} in 10 seconds. End with: "${kind === "app" ? "It's free, link in bio" : `${cap(v.signups)} open now, link in bio`}."`,
    `Reddit (story + ask for feedback): "I'm ${t(ph.founder, "a student")} and I started ${ph.startup}. Honest feedback?" Body: 3 short paragraphs: the moment you noticed the problem, what ${ph.startup} does (it ${ph.what}), and one specific question. Add ${link} only if the rules allow.`,
    kind === "app"
      ? `Product Hunt / Show HN tagline: "${ph.startup} – ${ph.what}". First comment: "Hi! I'm ${t(ph.founder, "the founder")}. I built ${ph.startup} for ${ph.own} after [your story]. It's free to try at ${link}. I'd love brutal feedback on [one thing]."`
      : `Local post (Nextdoor, community Facebook group or school newsletter): "Hi neighbors! I'm ${t(ph.founder, "a local student")} and I started ${ph.startup}. It ${ph.what}. ${cap(v.signups)} are open: ${link}. I'd love your support or feedback!"`,
    `LinkedIn: "Today I'm launching ${ph.startup}. [One-line story.] ${ph.does}, for ${ph.own}. If you know someone who'd love this, I'd be grateful for a share: ${link}"`,
    `DM to friends: "Hey! I just launched ${ph.startup}. Would you ${v.tryIt} and tell me one honest thing? ${link}"`,
  ];
  return [
    { title: "Where your customers are", items: [
      ...live.map((s) => `${s.name}${s.meta ? ` (${s.meta})` : ""}: ${s.detail ? clip(s.detail, 120) : "an active community for your niche"}. Read the rules, help first, then share. ${s.url}`),
      ...curated.map((s) => `${s.name}: ${s.angle} ${s.url}`),
      ...threads.map((d) => `Join this conversation (${d.source}${d.meta ? `, ${d.meta}` : ""}): "${clip(d.name, 90)}". Reply with a genuinely helpful answer; mention ${ph.startup} only if it fits. ${d.url}`),
      `Offline: clubs, events and group chats where ${ph.customer} already are. Ask one person in each to share your post.`,
    ] },
    { title: "Launch sites for you", items: dirs.map((d) => `${d.name} (best for ${d.best.toLowerCase()}): ${d.how} ${d.url}`) },
    { title: "Ready-to-post drafts", items: drafts },
    { title: "4-week traction plan", items: [
      `Week 1: Prepare. Make a list of 50 people to message, join ${live[0]?.name ?? curated[0]?.name ?? "3 communities"} and comment helpfully (no links yet). Line up 10 friends to share on launch day.`,
      `Week 2: Launch. Post the drafts above on ${ch.slice(0, 2).join(" and ")}, list on ${dirs.slice(0, 2).map((d) => d.name).join(" and ")}, and message all 50 people by hand. Reply to every comment within an hour.`,
      `Week 3: Do things that don't scale. Personally thank and follow up with your first 20 ${v.users}. Post one short video a day. Target: ${Math.ceil(g * 0.5)} ${v.signups}.`,
      `Week 4: Double down. See which channel brought the most ${v.signups} and post there 3x more. Ask every happy customer to tell one friend. Goal: ${goal}.`,
    ] },
    { title: "Launch checklist", items: [
      kind === "app" ? "A landing page with one clear promise and one button." : `${cap(v.page)}, with your price and how to get it.`,
      kind === "app" ? "Sign-up works on a phone (test it yourself)." : `Payment works and you can deliver your first 20 ${v.signups} on time.`,
      `${cap(v.demo)}.`,
      `A list of 50 people and ${live.length + curated.length} communities to tell.`,
      "A way to see where customers came from (ask \"how did you hear about us?\").",
      "Read every community's rules before posting.",
    ] },
    { title: "Numbers to track", items: [`${cap(v.signups)} per week, by where they came from`, kind === "app" ? "% who come back a second time" : "% of customers who buy again", "Replies and comments per post", `Progress toward your goal: ${goal}`] },
  ];
}

/* ---------------- Scout ---------------- */
function competitor(c: Ctx): Section[] {
  const { a, r, ph } = c;
  const alts = list(a.alternatives);
  const diff = t(a.different);
  const found = (r?.competitors ?? []).slice(0, 12);
  const themes = themesOf(r);
  const top = found.filter((f) => f.reviews).sort((x, y) => (y.reviews ?? 0) - (x.reviews ?? 0))[0];
  const map = [
    ...found.map((f) => `${nameOf(f.name)}: ${[f.source, f.rating ? `${f.rating}★${f.reviews ? ` from ${f.reviews.toLocaleString("en-US")} ratings` : ""}` : "", f.source === "Web research" ? "" : f.price, f.meta].filter(Boolean).join(" · ")}.${f.detail ? ` ${clip(f.detail, 140)}` : ""} ${f.url}`),
    ...alts.filter((x) => !found.some((f) => f.name.toLowerCase().includes(x.toLowerCase()))).map((x) => `${nameOf(x)}: you named this one. Write down its price, who it's for, and the #1 complaint about it.`),
    "Doing nothing: your biggest competitor is often people just living with the problem. Know why they'd bother to switch.",
  ];
  if (!found.length && !alts.length) map.unshift(`No live results came back for "${t(a.niche, c.topic)}". Try a shorter niche (2-4 words, like "budget app for teens") and run Scout again.`);
  const complaints = (r?.complaints ?? []).slice(0, 8).map((x) => `"${clip(x.text, 200)}" (${x.stars}★ review of ${nameOf(x.app)}) ${x.url ?? ""}`.trim());
  return [
    { title: "Your competition map", items: map },
    { title: "What their users complain about", items: complaints.length ? [
      ...(themes.length ? [`Across ${r!.complaints.length} recent 1-2★ reviews, the top themes are: ${themes.slice(0, 3).map((x) => `${x.key} (${x.n})`).join(", ")}.`] : []),
      ...complaints,
    ] : [
      "No public low-star reviews were found for this niche yet. Read the 1-3★ reviews of each competitor above yourself and copy the exact words people use.",
      "Search \"[competitor] review\" and \"[competitor] alternative\" on Reddit, Google and YouTube. Every repeated complaint is something you can win on.",
    ] },
    { title: "Gaps you can own", items: themes.length ? themes.slice(0, 5).map((x) => `${cap(x.key)} (${x.n} complaint${x.n === 1 ? "" : "s"}): ${x.gap}`) : [
      `Serve one specific slice of ${ph.customer} better than anyone. Big players can't go that deep.`,
      "Speed: time how long each competitor takes to deliver, and beat it.",
      "Personal touch: as a small team you can know every customer by name. Big competitors can't.",
    ] },
    { title: "How you win", items: [
      diff ? `Your edge: ${lower(diff.replace(/\.$/, ""))}. Make this the first thing people notice in every post.` : "Write one thing you do better than every alternative. If you can't, narrow your customer until you can.",
      top ? `The biggest player here is ${nameOf(top.name)} (${top.reviews!.toLocaleString("en-US")} ratings). Don't fight them head-on: win the people their reviews say they're failing.` : `Own a niche first: be the best option for one specific slice of ${ph.customer} before going broad.`,
      "Compete on what big players can't copy quickly: speed, a community, personal service, or caring about a group they ignore.",
    ] },
    { title: "Watch out for", items: [
      "A bigger company copying what works. Your answer: focus, speed and relationships.",
      "Saying \"we have no competitors\". Judges always ask, and it sounds like you didn't look. Show this map instead.",
      "Copying competitors instead of solving the problem better.",
      found.length ? "Ratings and prices change. Re-run Scout every month and before every pitch." : "Re-run Scout with different niche words; the first search often misses competitors.",
    ] },
    { title: "Your positioning line", items: [`For ${ph.customer} who are tired of ${themes[0] ? themes[0].pain : alts[0] ? `settling for ${alts[0]}` : "the usual options"}, ${ph.does}.${diff ? ` What makes it different: ${lower(diff.replace(/^we /i, "").replace(/\.$/, ""))}.` : ""}`] },
  ];
}

/* ---------------- Offer ---------------- */
function offer(c: Ctx): Section[] {
  const { a, ph, v, kind } = c;
  const prob = problemOf(c);
  const levers = [
    { k: "Dream outcome", v: t(a.outcome), fix: `Name the exact result ${ph.customer} want, in their words${prob ? ` (start from: "${lower(prob)}")` : ""}.` },
    { k: "Proof it works", v: t(a.proof, t(c.all.pitch?.traction)), fix: `Add proof: ${v.demo}, a pilot, testimonials, or your own before/after.` },
    { k: "Speed to first result", v: t(a.speed), fix: kind === "app" ? "Make the first win happen in minutes, not weeks." : kind === "social" ? "Show partners a first result within the first week of the pilot." : kind === "service" ? "Offer a first session this week." : "Make it fast to get: quick pickup, fast shipping or a launch date they can count on." },
    { k: "Effort removed", v: t(a.effort), fix: "Find the most annoying step for them and remove it." },
  ];
  const outcome = t(a.outcome) ? lower(t(a.outcome).replace(/\.$/, "")) : prob ? `the fix for "${lower(prob)}"` : `exactly what ${ph.customer} need`;
  const bonus: Record<Kind, string[]> = {
    app: ["Bonus: a quick-start guide or template that gets them their first win faster.", "Bonus: access to a small community or a live group session.", "Guarantee: \"Try it for 7 days. If it doesn't help, you don't pay.\" Only promise what you can deliver."],
    food: ["Bonus: a free extra item for preorders over a set amount.", "Bonus: a custom flavor or message for birthdays and events.", "Guarantee: \"If you don't love it, your next order is free.\""],
    product: c.hw ? ["Bonus: a quick setup video so it works the first time.", "Bonus: a founding-customer price for the first 50 preorders.", "Guarantee: if it arrives broken or doesn't work, you replace it."] : ["Bonus: free customization or a small add-on with each order.", "Bonus: early access to new drops for repeat customers.", "Guarantee: easy returns or a fix if something isn't right."],
    service: ["Bonus: a free follow-up check-in or a simple guide they keep.", "Bonus: a discount when they refer a friend.", "Guarantee: \"If you're not happy with the first session, it's free.\""],
    social: ["Bonus for partners: a simple monthly impact report they can share.", "Bonus: public recognition (a thank-you post or certificate).", "Promise: a clear, low-effort pilot with a set end date."],
  };
  return [
    { title: "Value equation check", items: levers.map((l) => (l.v ? `✓ ${l.k}: ${l.v}` : `✗ ${l.k}: missing. ${l.fix}`)) },
    { title: "Your offer", items: [
      `${ph.startup} gives ${ph.customer} ${outcome}${t(a.speed) ? `, with your first result ${lower(t(a.speed).replace(/^first[^0-9]*?(in )?/i, "in "))}` : ""}${t(a.effort) ? `, without ${lower(t(a.effort))}` : ""}.`,
      "Lead with the outcome, not the features. People buy the result.",
    ] },
    { title: "Bonuses and guarantee", items: bonus[kind] },
    { title: "Make it a no-brainer", items: [`Give your offer a name that sounds like a result (e.g. "The ${cap(c.topic.split(" ")[0] ?? "Starter")} Starter Pack").`, "Add a real reason to act now: a founding-customer price or limited spots. Never fake scarcity.", "Show proof right next to the price."] },
  ];
}

/* ---------------- Brand ---------------- */
function brand(c: Ctx): Section[] {
  const { a, ph } = c;
  const vibe = list(a.vibe).slice(0, 3);
  const names = list(a.names);
  const vv = vibe.join(" ").toLowerCase();
  const color = /bold|energ|loud|hype/.test(vv) ? "Bright orange or red with black: energetic and confident."
    : /trust|smart|pro|serious/.test(vv) ? "Deep blue with white and one warm accent: trustworthy and clear."
    : /fun|friend|play|young|sweet/.test(vv) ? "Bright, friendly colors (green, yellow or pink) with rounded shapes."
    : /calm|kind|health|soft/.test(vv) ? "Soft greens or blues with lots of white space: calm and kind."
    : /premium|lux|elegant/.test(vv) ? "Black, off-white and one metallic or deep accent: premium."
    : "Pick one main color and one accent. Fewer colors look more professional.";
  const prob = problemOf(c);
  return [
    { title: "Name check", items: [
      ...(names.length ? names.slice(0, 4).map((n) => `${n}: is it easy to spell after hearing it once? Under 3 syllables?`) : [`${ph.startup}: is it easy to spell after hearing it once? Under 3 syllables?`]),
      "Check the domain at a registrar (try get, try or shop versions if .com is taken).",
      "Check the same handle on Instagram, TikTok and X.",
      "Search the name on the USPTO trademark search (or your country's office) before you invest in it.",
    ] },
    { title: "Tagline options", items: [
      `${cap(ph.what.replace(/^(is|are) /, ""))}.`,
      `${ph.startup}. Made for ${ph.customer}.`,
      prob ? `Because ${lower(prob)} shouldn't be normal.` : `Made by someone who gets ${ph.customer}.`,
      `${cap(c.topic)}, done right.`,
    ] },
    { title: "Brand voice", items: [
      vibe.length ? `Sound ${vibe.join(", ")} in every post, message and package.` : "Pick 3 words for how you sound, and use them to check every post.",
      `Do: talk like a friend who gets ${ph.customer}. Short sentences.`,
      "Don't: use buzzwords, hype you can't back up, or fake stats.",
    ] },
    { title: "Look and feel", items: [color, t(a.admire) ? `Study what ${t(a.admire)} do well (simple logo, one signature color, consistent font), then make your own version.` : "Use one bold font for headlines and one simple font for text.", "Make a simple logo in Canva: your name in a good font is enough to start."] },
  ];
}

/* ---------------- Sales ---------------- */
function sales(c: Ctx): Section[] {
  const { a, ph, v, kind } = c;
  const buyer = t(a.buyer, ph.customer);
  const objection = t(a.objection, kind === "app" ? "I don't have time" : "It's too expensive");
  const offerTxt = t(a.offerPrice, ph.startup);
  const warm: Record<Kind, string> = {
    app: `Warm: "Hey [name]! I'm building ${ph.startup}: ${ph.what}. Would you try it for 2 minutes and tell me one honest thing?"`,
    food: `Warm: "Hey [name]! I started ${ph.startup}. It ${ph.what}. I'm taking orders for [day]. Want me to save you some?"`,
    product: `Warm: "Hey [name]! I started ${ph.startup}. It ${ph.what}. I'm opening preorders this week. Want to see it first?"`,
    service: `Warm: "Hey [name]! I started ${ph.startup}. It ${ph.what}. I have 3 spots this week. Do you or someone you know need help?"`,
    social: `Warm: "Hi [name]! I'm starting ${ph.startup}: ${ph.what}. Could I take 10 minutes to show you a small pilot idea?"`,
  };
  return [
    { title: "Who to sell to first", items: [`Start warm: ${buyer} you already know or are one intro away from.`, "Make a list of 30 names in a spreadsheet: name, how you know them, date contacted, reply.", `Ask every happy ${v.users === "users" ? "user" : "customer"} for 2 introductions. Referrals close far more easily than strangers.`] },
    { title: "Outreach scripts", items: [
      warm[kind],
      `Cold: "Hi [name], I noticed [something specific about them]. I'm a student founder and I started ${ph.startup} for ${ph.own}. Could I show you in 2 minutes this week?"`,
      "Follow-up (3 days later): \"Just bumping this up. Happy to send a short video instead if that's easier.\"",
    ] },
    { title: "Handle objections", items: [
      `"${objection}": agree first, then reframe. "Totally fair. ${kind === "app" ? "That's why the first step takes 2 minutes." : "That's why you can start small and see if you love it."}"`,
      "\"It's too expensive\": compare the price to the cost of the problem, or offer a smaller first purchase.",
      "\"Let me think about it\": ask \"What would you need to see to say yes?\" and answer that.",
    ] },
    { title: "Your sales week", items: [`Mon–Tue: message 10 warm contacts about ${offerTxt}.`, "Wed: follow up with everyone who hasn't replied.", `Thu: ${kind === "app" ? "run 2-3 demos and ask for the sale at the end of each" : kind === "social" ? "check in with each pilot partner and write down one result you can share" : `deliver your first ${v.signups} and ask each customer for a photo or review`}.`, "Fri: write down every objection you heard and improve your answer."] },
  ];
}

/* ---------------- Content ---------------- */
function content(c: Ctx): Section[] {
  const { a, ph, v, kind } = c;
  const plats = list(a.platforms);
  const pl = plats.length ? plats : ["TikTok", "Instagram Reels"];
  const know = t(a.know, c.topic);
  const hrs = Math.max(1, parseInt(t(a.time, "3"), 10) || 3);
  const posts = Math.max(2, Math.min(7, Math.round(hrs * 1.5)));
  const prob = problemOf(c);
  return [
    { title: "Content pillars", items: [`Behind the scenes: building ${ph.startup}, wins and fails.`, `Teach: quick, useful tips about ${know}.`, `Problem stories: moments ${ph.customer} will recognize${prob ? `, like "${lower(prob)}"` : ""}.`, `Proof: ${kind === "app" ? "demos, user reactions (with permission), milestones" : "happy customers (with permission), before/afters, sold-out moments"}.`] },
    { title: "10 post ideas", items: [
      `"Day 1 of building ${ph.startup}" (then keep the series going)`,
      `"3 mistakes people make with ${know}"`,
      `"I asked 10 ${ph.own} what they hate about ${know}. Here's what they said"`,
      kind === "app" ? "A 20-second demo: problem, then your fix" : `A 20-second process video: how you make ${v.product === "your product" ? "it" : "it happen"}`,
      `"Why I started ${ph.startup}" (your real story)`,
      `Reacting to a common bad tip about ${know}`,
      "A before/after",
      "Behind the scenes of a busy day",
      "Answering a question from a comment",
      `"What I'd do if I was starting ${ph.startup} from zero again"`,
    ] },
    { title: "Hooks that stop the scroll", items: [prob ? `"${cap(lower(prob))}? Watch this."` : `"If you're one of the ${ph.customer}…"`, `"Nobody tells you this about ${know}…"`, `"I'm a student and I started a ${kind === "app" ? "startup" : "business"} that…"`, "\"Stop doing [common thing]. Do this instead.\""] },
    { title: "Posting schedule", items: [`${posts} posts a week on ${pl[0]}${pl[1] ? `, repost the same videos to ${pl.slice(1).join(" and ")}` : ""}.`, `Batch: film ${posts} short videos in one ${Math.ceil(hrs / 2)}-hour session each week.`, "Reply to every comment in the first hour. Comments are your best ideas for the next posts.", `Track: views, follows and ${v.signups} from each post. Double down on what works.`] },
  ];
}

/* ---------------- Investor ---------------- */
function investor(c: Ctx): Section[] {
  const { a, ph, kind } = c;
  const raising = t(a.raising);
  const notYet = !raising || /not|no\b|none/i.test(raising);
  return [
    { title: "Are you ready to raise?", items: [
      t(a.proof) ? `Your proof: ${t(a.proof).replace(/\.$/, "")}. Lead every conversation with it.` : "You need proof first: customers, a pilot, revenue, or strong growth. Ideas alone rarely get funded.",
      notYet ? "You're not raising yet. Good: free money first (competitions, grants, fellowships) keeps 100% of your company." : `You're raising ${raising}. Know exactly what milestone it gets you to.`,
      kind === "food" || kind === "service" ? "Many great small businesses never need investors. Profit from day one is a superpower: investors are optional." : t(a.useOf) ? `Use of funds: ${t(a.useOf)}. Tie it to a measurable milestone.` : "Write what the money buys and what it proves (e.g. launch + 1,000 users).",
    ] },
    { title: "Who to approach", items: [
      ...matched(c, ["Grant", "Fellowship", "Competition"], 4).map((o) => `Non-dilutive first: ${oppLine(o)}`),
      ...(kind === "app" || kind === "product" ? matched(c, ["Accelerator", "Investor"], 4).map((o) => `${o.type}: ${oppLine(o)} Check their age and company rules first.`) : matched(c, ["Investor", "Program"], 2).map((o) => `${o.type}: ${oppLine(o)}`)),
      "Angels you're connected to: teachers, alumni, local business owners. A warm intro beats a cold email.",
    ] },
    { title: "Cold email to investors", items: [`Subject: ${ph.startup}: ${t(a.proof, "early traction")} (student founder)`, `"Hi [name], I'm ${t(ph.founder, "[your name]")}, founder of ${ph.startup}. ${cap(ph.we)}, for ${ph.own}. ${t(a.proof) ? `So far: ${t(a.proof).replace(/\.$/, "")}.` : "[Your strongest real number.]"} ${notYet ? "We're not raising yet, but I'd value 15 minutes of advice." : `We're raising ${raising} to ${t(a.useOf, "[milestone]")}.`} Thank you!"`, "Keep it under 120 words. Attach a short deck as a PDF or link."] },
    { title: "Before you sign anything", items: ["If you're under 18, a parent or guardian must be involved, and many funds only invest in founders 18+ or in a registered company.", "A SAFE (Simple Agreement for Future Equity, created by Y Combinator) gives investors future shares. Understand the valuation cap and discount.", "Never sign without a lawyer reviewing it. Many offer free help for student founders.", "Give away as little equity as possible early. Every percent is hard to get back."] },
  ];
}

const GUIDES: Record<AgentId, (c: Ctx) => Section[]> = { idea, customer, competitor, offer, build, brand, pitch, money, sales, launch, content, investor };

/** A guided plan for one agent. `all` is every answer the founder has given (so agents build on each other). */
export function guided(id: AgentId, p: Profile, answers: A, research?: Research, all: AllAnswers = {}): Section[] {
  const allA: AllAnswers = { ...all, [id]: answers };
  const kind = kindOf(p, allA);
  const c: Ctx = { p, a: answers, r: research, all: allA, kind, ph: phrases(p), v: vocab(kind), topic: topicOf(p, allA), hw: isHardware(p) };
  return GUIDES[id](c);
}
