/**
 * Guided (no-AI) versions of every agent. They use the founder's own answers plus proven
 * startup frameworks, so every founder gets a useful result even without an API key.
 */
import type { AgentId } from "../agents";
import type { Profile, Section } from "./profile";
import type { Research } from "../server/research";
import { matchCommunities, matchDirectories } from "./channels";
import { matchOpportunities, type OppType } from "./opportunities";

type A = Record<string, string>;
const t = (s?: string, fallback = "") => (s ?? "").trim() || fallback;
const list = (s?: string) => t(s).split(/[,\n]/).map((x) => x.trim()).filter(Boolean);

function idea(p: Profile, a: A): Section[] {
  const strong: string[] = [];
  const risks: string[] = [];
  if (t(a.whyYou)) strong.push(`Founder fit: ${t(a.whyYou)}. Lead with this in every pitch.`);
  else risks.push("You haven't said why you're the right person. Judges and investors ask this first.");
  if (t(a.problem).length > 25) strong.push("You can describe the problem clearly, which most first-time founders can't.");
  else risks.push("The problem is vague. Describe one specific moment when your customer feels it.");
  if (t(a.today)) { strong.push(`People already try to solve it (${t(a.today)}), which proves the problem is real.`); risks.push(`You need a clear reason people would switch from "${t(a.today)}" to ${p.startup}.`); }
  else risks.push("You don't know how people solve this today. If nobody tries to solve it, it may not hurt enough.");
  risks.push(`Riskiest assumption: that ${p.customer} will use ${p.startup} more than once. Test it before building more.`);
  return [
    { title: "Your one-liner", items: [/^(lets|helps|gives|makes|turns|matches|connects|teaches)\b/i.test(p.idea.trim()) ? `${p.startup} ${p.idea.trim().replace(/\.$/, "")} for ${p.customer}.` : `${p.startup} helps ${p.customer} ${p.idea.trim().replace(/^(to )/i, "").replace(/\.$/, "")}.`] },
    { title: "What's strong", items: strong },
    { title: "Biggest risks", items: risks },
    { title: "Test it this week", items: [
      `Talk to 5 ${p.customer} this week. Ask about the last time the problem happened, not whether they like your idea.`,
      "Make a one-page sign-up site (Carrd or Google Forms) and share it in two places your customers spend time. Count sign-ups.",
      "Fake the product by hand: solve the problem manually for 3 people and see if they come back for more.",
    ] },
  ];
}

function customer(p: Profile, a: A, r?: Research): Section[] {
  const where = list(a.where);
  const liveSubs = (r?.communities ?? []).slice(0, 4);
  const threads = (r?.discussions ?? []).slice(0, 4);
  return [
    { title: "Interview questions", items: [
      `Tell me about the last time you dealt with ${t(p.idea, "this problem")}.`,
      "What did you do about it? What did you try before that?",
      "What was the hardest part?",
      "How much time or money have you spent trying to fix it?",
      "If you could wave a magic wand, what would happen instead?",
      t(a.learn) ? `Ask directly about what you need to learn: ${t(a.learn)}` : "Who else do you know who deals with this?",
      "Can I show you something we're building and get your honest reaction?",
    ] },
    { title: "Where to find your first 10", items: [
      ...(where.length ? where.map((w) => `${w}: post a short, honest message asking for 15 minutes of feedback.`) : ["List three places your customers already gather, online and offline."]),
      ...liveSubs.map((c) => `${c.name}${c.meta ? ` (${c.meta})` : ""}: ask members about their experience with the problem (not your product). ${c.url}`),
      ...matchCommunities(`${p.idea} ${p.customer} ${t(a.where)}`, 5).filter((c) => !liveSubs.some((l) => l.name.toLowerCase() === c.name.toLowerCase())).map((c) => `${c.name}: ${c.angle} ${c.url}`),
      ...threads.map((d) => `People already discussing this: "${clip(d.name, 90)}" (${d.source}). Read the replies for exact customer words, and message the people who posted. ${d.url}`),
      "Ask every person you interview: 'Who else should I talk to?' One customer usually leads to two more.",
      "Your own network first: classmates, clubs, teachers, family friends.",
    ] },
    { title: "Message to send", items: [`Hi! I'm ${t(p.founder, "a student founder")} and I'm building ${p.startup} for ${p.customer}. I'm not selling anything. Could I ask you 5 quick questions about ${t(p.idea, "how you handle this")}? It would really help.`] },
    { title: "What to write down", items: ["Exact words they use to describe the problem (use them in your marketing).", "What they already pay for or spend time on.", "Whether they asked to try it or to be told when it's ready. That's your real signal."] },
  ];
}

function build(p: Profile, a: A): Section[] {
  const feats = list(a.features);
  const must = feats.slice(0, 3);
  const later = feats.slice(3);
  const codes = /code|html|react|python|swift|js|developer|program/i.test(t(a.skills)) && !/no cod|can't code|cannot code/i.test(t(a.skills));
  const hours = Math.max(1, parseInt(t(a.hours, "8"), 10) || 8);
  return [
    { title: "Build first", items: must.length ? must.map((f) => `${f}: the simplest version that lets ${p.customer} feel the core value.`) : ["List your features above. Only the one that solves the core problem goes first."] },
    { title: "Save for later", items: later.length ? later.map((f) => `${f}: add it only after real users ask for it.`) : ["Nothing yet. Every extra feature delays your launch."] },
    { title: "Tools to use", items: codes
      ? ["Next.js or React for the app, deployed free on Vercel.", "Supabase for logins and data (free tier).", "Stripe when you're ready to charge."]
      : ["No-code: Glide or Softr for apps, Carrd or Framer for websites.", "Google Forms and Sheets as a free backend to start.", "Tally or Typeform for sign-ups. Learn to code later if it takes off."] },
    { title: "Your 2-week plan", items: [
      `Days 1–3 (~${Math.ceil(hours * 0.4)}h): sketch the screens on paper and build a clickable mockup.`,
      `Days 4–8 (~${Math.ceil(hours * 0.8)}h): build ${must[0] ?? "the core feature"} end to end.`,
      `Days 9–11 (~${Math.ceil(hours * 0.5)}h): put it in front of 3 real users and watch them use it without helping.`,
      `Days 12–14 (~${Math.ceil(hours * 0.3)}h): fix the top problem they hit, then share it more widely.`,
    ] },
  ];
}

function pitch(p: Profile, a: A): Section[] {
  const traction = t(a.traction, "an early version that's ready for its first users");
  return [
    { title: "One-liner", items: [`${p.startup}: ${p.idea.replace(/\.$/, "")} for ${p.customer}.`] },
    { title: "30-second pitch", items: [
      `${t(a.story, `${p.customer} deal with this problem every day`)}. ${p.startup} fixes that: ${p.idea.replace(/\.$/, "")}. ${p.customer.charAt(0).toUpperCase() + p.customer.slice(1)} are our first users. So far we have ${traction}. ${t(a.ask) ? `We're here for ${t(a.ask)} to help us reach our next milestone.` : "Next, we're focused on growing our first users."}`,
    ] },
    { title: "Deck outline", items: [
      `1. Title: ${p.startup} and your one-liner`,
      "2. Problem: one real story, then how big it is",
      "3. Solution: what it does, in one sentence and one screenshot",
      "4. Demo: 2–3 screens showing it working",
      `5. Customer: who exactly (${p.customer}) and how you reach them`,
      `6. Traction: ${traction} (real numbers only)`,
      "7. Business model: who pays and how much",
      "8. Competition: who else exists and why you're different",
      "9. Team: why you're the people to build this",
      "10. Ask: what you want and what it unlocks",
    ] },
    { title: "Questions judges will ask", items: ["Why you? What do you know that others don't?", "How will you get your first 100 users?", "Who pays, and how much?", "What happens if a big company copies you?", "What will you do with the prize or investment?"] },
    { title: "Where to pitch it", items: matched(p, ["Competition", "Hackathon", "Program"], 6).map(oppLine) },
  ];
}

function money(p: Profile, a: A): Section[] {
  const price = parseFloat(t(a.price).replace(/[^0-9.]/g, "")) || 0;
  const costs = parseFloat(t(a.costs).replace(/[^0-9.]/g, "")) || 0;
  const breakeven = price > 0 ? Math.ceil(costs / price) : null;
  return [
    { title: "Pricing", items: [
      price ? `Start at $${price}${/sub|month/i.test(t(a.model)) ? "/month" : ""} and ask your first 10 customers if it feels fair. Raising prices later is easier than you think.` : "Pick a starting price, even a guess. A free product tells you nothing about demand.",
      "Offer a free version or trial so people can feel the value before paying.",
      t(a.model) ? `Your model (${t(a.model)}): make it simple enough to explain in one sentence.` : "Choose one model to start: subscription, one-time purchase, or organizations paying for groups.",
    ] },
    { title: "Break-even math", items: breakeven !== null
      ? [`Monthly costs $${costs} ÷ price $${price} = ${breakeven} paying customer${breakeven === 1 ? "" : "s"} to cover costs.`, `At 4% of free users upgrading (a common freemium rate), that's about ${Math.ceil(breakeven / 0.04)} free users.`]
      : ["Add a price and your monthly costs above to see how many customers you need to break even."] },
    { title: "Funding you can get", items: [
      ...matched(p, ["Grant", "Competition", "Fellowship"], 5).map(oppLine),
      "Free credits so you spend less: " + matched(p, ["Credits"], 4).map((o) => o.name).join(", ") + ". Find them all on the Opportunities page.",
      "Paul Graham's test: are you default alive? If revenue grows at today's rate with today's costs, do you reach profit before money runs out?",
      "Pre-sales: let early customers pay before you build. It's free money and proof of demand.",
      "Small grants for young founders and local business programs.",
      "Free credits: startup programs from cloud and software companies often give credits to student founders.",
    ] },
    { title: "Money basics", items: ["Keep business money separate from personal money from day one.", "Track every dollar in a simple spreadsheet: date, what, amount.", "If you're under 18, a parent or guardian will need to help with bank accounts, payments and contracts."] },
  ];
}

const oppLine = (o: { name: string; type: string; perk: string; url: string; ages: string[] }) => `${o.name} (${o.type}, ${o.ages.join("/")}): ${o.perk}. ${o.url}`;
const matched = (p: Profile, types: OppType[], n: number) => matchOpportunities({ text: `${p.idea} ${p.customer} ${p.startup}`, stage: p.stage, types, limit: n });
const clip = (x: string, n: number) => (x.length > n ? `${x.slice(0, n - 1).trim()}…` : x);
const nameOf = (x: string) => x.replace(/:/g, " –");
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
  return THEMES.map((t) => ({ ...t, n: cs.filter((c) => t.re.test(c.text)).length })).filter((t) => t.n > 0).sort((x, y) => y.n - x.n);
}

function launch(p: Profile, a: A, r?: Research): Section[] {
  const channels = list(a.channels);
  const goal = t(a.goal, "your first 100 users");
  const link = t(a.link, "[your link]");
  const niche = t(a.niche, p.customer);
  const text = `${p.idea} ${p.customer} ${niche}`;
  const live = (r?.communities ?? []).slice(0, 6);
  const curated = matchCommunities(text, 8).filter((c) => !live.some((l) => l.name.toLowerCase() === c.name.toLowerCase()));
  const threads = (r?.discussions ?? []).slice(0, 4);
  const dirs = matchDirectories(text, 8);
  const ch = channels.length ? channels : ["TikTok", "Instagram"];
  const g = parseInt(goal.replace(/[^0-9]/g, ""), 10) || 100;
  return [
    { title: "Where your customers are", items: [
      ...live.map((c) => `${c.name}${c.meta ? ` (${c.meta})` : ""}: ${c.detail ? clip(c.detail, 120) : "an active community for your niche"}. Read the rules, help first, then share. ${c.url}`),
      ...curated.map((c) => `${c.name}: ${c.angle} ${c.url}`),
      ...threads.map((d) => `Join this conversation (${d.source}${d.meta ? `, ${d.meta}` : ""}): "${clip(d.name, 90)}". Reply with a genuinely helpful answer; mention ${p.startup} only if it fits. ${d.url}`),
      `Offline: school clubs, teachers and group chats where ${p.customer} already are. Ask one person in each to share your post.`,
    ] },
    { title: "Launch sites for you", items: dirs.map((d) => `${d.name} (best for ${d.best.toLowerCase()}): ${d.how} ${d.url}`) },
    { title: "Ready-to-post drafts", items: [
      `Reddit (story + ask for feedback): "Title: I'm ${t(p.founder, "a student")} and I built ${p.startup} because ${p.customer} kept struggling with this. Honest feedback?" Body: 3 short paragraphs: the moment you noticed the problem, what you built (${p.idea.replace(/\.$/, "")}), and one specific question. Put ${link} at the end only if the rules allow.`,
      `Show HN / Product Hunt tagline: "${p.startup} – ${p.idea.replace(/\.$/, "")}". First comment: "Hi! I'm ${t(p.founder, "the founder")}. I built ${p.startup} for ${p.customer} after [your story]. It's free to try at ${link}. I'd love brutal feedback on [one thing]."`,
      `TikTok / Reels script (20s): Hook (0-2s): "POV: you're ${p.customer} and [the problem]." Middle: show the problem, then ${p.startup} solving it on screen. End: "It's free, link in bio." Post it on ${ch[0]} first.`,
      `LinkedIn: "Today I'm launching ${p.startup}. [One-line story.] It ${p.idea.replace(/\.$/, "")} for ${p.customer}. If you know someone who needs this, I'd be grateful for a share: ${link}"`,
      `DM to friends: "Hey! I just launched ${p.startup} (${p.idea.replace(/\.$/, "")}). Could you try it for 2 minutes and tell me one thing that confused you? ${link}"`,
      `Email to people who signed up early: "Subject: It's live. You're one of the first." Thank them, give one clear button to ${link}, and ask them to reply with feedback.`,
    ] },
    { title: "4-week traction plan", items: [
      `Week 1: Prepare. Make a list of 50 people to message, join ${live[0]?.name ?? curated[0]?.name ?? "3 communities"} and 2 others and comment helpfully every day (no links yet). Line up 10 friends who will try it on launch day.`,
      `Week 2: Launch. Post the drafts above on ${ch.slice(0, 2).join(" and ")}, submit to ${dirs.slice(0, 3).map((d) => d.name).join(", ")}, and DM all 50 people by hand. Reply to every comment within an hour.`,
      `Week 3: Do things that don't scale. Personally onboard the first 20 users on a quick call or chat. Post one short video a day showing a real use. Target: ${Math.ceil(g * 0.5)} sign-ups.`,
      `Week 4: Double down. Look at which channel brought the most sign-ups and post there 3x more. Ask every happy user to invite one friend. Goal: ${goal}.`,
    ] },
    { title: "Launch checklist", items: ["A landing page with one clear promise and one button.", "Sign-up works on a phone (test it yourself).", "A 30-second demo video and 4 screenshots.", `A list of 50 people and ${live.length + curated.length} communities to tell.`, "A way to see where sign-ups came from (UTM links or ask \"how did you hear about us?\").", "Read every community's rules before posting."] },
    { title: "Numbers to track", items: ["Sign-ups per day, by source", "% who come back a second time", "Replies and comments per post", `Progress toward your goal: ${goal}`] },
  ];
}

function competitor(p: Profile, a: A, r?: Research): Section[] {
  const alts = list(a.alternatives);
  const diff = t(a.different);
  const found = (r?.competitors ?? []).slice(0, 12);
  const themes = themesOf(r);
  const top = found.filter((f) => f.reviews).sort((x, y) => (y.reviews ?? 0) - (x.reviews ?? 0))[0];
  const map = [
    ...found.map((f) => `${nameOf(f.name)}: ${[f.source, f.rating ? `${f.rating}★${f.reviews ? ` from ${f.reviews.toLocaleString("en-US")} ratings` : ""}` : "", f.source === "Web research" ? "" : f.price, f.meta].filter(Boolean).join(" · ")}.${f.detail ? ` ${clip(f.detail, 140)}` : ""} ${f.url}`),
    ...alts.filter((x) => !found.some((f) => f.name.toLowerCase().includes(x.toLowerCase()))).map((x) => `${nameOf(x)}: you named this one. Write down its price, who it's for, and the #1 complaint in its reviews.`),
    "Doing nothing: your biggest competitor is often people just living with the problem. Know why they'd bother to switch.",
  ];
  if (!found.length && !alts.length) map.unshift(`No live results came back for "${t(a.niche, p.idea)}". Try a shorter niche (2-4 words, like "budget app for teens") and run Scout again.`);
  const complaints = (r?.complaints ?? []).slice(0, 8).map((c) => `"${clip(c.text, 200)}" (${c.stars}★ review of ${nameOf(c.app)}) ${c.url ?? ""}`.trim());
  return [
    { title: "Your competition map", items: map },
    { title: "What their users complain about", items: complaints.length ? [
      ...(themes.length ? [`Across ${r!.complaints.length} recent 1-2★ reviews, the top themes are: ${themes.slice(0, 3).map((x) => `${x.key} (${x.n})`).join(", ")}.`] : []),
      ...complaints,
    ] : [
      "No public low-star reviews were found for this niche yet. Read the 1-3★ reviews of each competitor above yourself and copy the exact words people use.",
      "Search \"[competitor] review\" and \"[competitor] alternative\" on Reddit and YouTube. Every repeated complaint is a feature you can win on.",
    ] },
    { title: "Gaps you can own", items: themes.length ? themes.slice(0, 5).map((x) => `${cap(x.key)} (${x.n} complaint${x.n === 1 ? "" : "s"}): ${x.gap}`) : [
      `Serve one specific slice of ${p.customer} better than anyone. Generic apps leave specific groups underserved.`,
      "Speed to first result: time how long each competitor takes to deliver value, and beat it by 10x.",
      "Price: if every competitor is a subscription, try a one-time price or a generous free tier (or the opposite).",
    ] },
    { title: "How you win", items: [
      diff ? `Your edge: ${diff}. Make this the first thing people notice on your site and in every post.` : "Write one thing you do better than every alternative. If you can't, narrow your customer until you can.",
      top ? `The biggest player here is ${nameOf(top.name)} (${top.reviews!.toLocaleString("en-US")} ratings). Don't fight them head-on: win the users their reviews say they're failing.` : `Own a niche first: be the best option for one specific slice of ${p.customer} before going broad.`,
      "Compete on what big players can't copy quickly: speed, a community, personal support, or caring about a group they ignore.",
      "List yourself as an alternative to each competitor on AlternativeTo and SaaSHub so people searching for them find you.",
    ] },
    { title: "Watch out for", items: [
      "A bigger company adding your feature for free. Your answer: focus and speed.",
      "Saying \"we have no competitors\". Judges always ask, and it sounds like you didn't look. Show this map instead.",
      "Copying competitors' features instead of solving the problem better.",
      found.length ? "Ratings and prices change. Re-run Scout every month and before every pitch." : "Re-run Scout with different niche words; the first search often misses competitors.",
    ] },
    { title: "Your positioning line", items: [`For ${p.customer} who are tired of ${themes[0] ? themes[0].pain : alts[0] ? `relying on ${alts[0]}` : "the usual options"}, ${does(p)}.${diff ? ` What makes it different: ${lower(diff.replace(/^we /i, "").replace(/\.$/, ""))}.` : ""}`] },
  ];
}

function offer(p: Profile, a: A): Section[] {
  const levers = [
    { k: "Dream outcome", v: t(a.outcome), fix: "Name the exact result your customer wants, in their words." },
    { k: "Proof it works", v: t(a.proof), fix: "Add proof: a demo video, a pilot, testimonials, or your own before/after." },
    { k: "Speed to first result", v: t(a.speed), fix: "Make the first win happen in minutes, not weeks." },
    { k: "Effort removed", v: t(a.effort), fix: "Find the most annoying step for them and remove it." },
  ];
  const outcome = t(a.outcome, `the result ${p.customer} want`);
  return [
    { title: "Value equation check", items: levers.map((l) => (l.v ? `✓ ${l.k}: ${l.v}` : `✗ ${l.k}: missing. ${l.fix}`)) },
    { title: "Your offer", items: [
      `${p.startup}: ${outcome}${t(a.speed) ? `, with your first result in ${t(a.speed).replace(/^first[^0-9]*?(in )?/i, "")}` : ""}${t(a.effort) ? `, without ${t(a.effort).toLowerCase()}` : ""}.`,
      "Lead with the outcome, not the features. People buy the result.",
    ] },
    { title: "Bonuses and guarantee", items: [
      "Bonus idea: a quick-start guide or checklist that gets them their first win faster.",
      "Bonus idea: access to a small community or group session with other users.",
      "Guarantee idea: \"Try it for 7 days. If it doesn't help, you don't pay.\" Only promise what you can deliver.",
    ] },
    { title: "Make it a no-brainer", items: ["Name your offer (e.g. \"The 7-Day Confidence Challenge\") so it sounds like a result, not a product.", "Add a real reason to act now: a founding-member price or limited pilot spots. Never fake scarcity.", "Show proof right next to the price."] },
  ];
}

function brand(p: Profile, a: A): Section[] {
  const vibe = list(a.vibe).slice(0, 3);
  const names = list(a.names);
  const v = vibe.join(" ").toLowerCase();
  const color = /bold|energ|loud|hype/.test(v) ? "Bright orange or red with black: energetic and confident."
    : /trust|smart|pro|serious/.test(v) ? "Deep blue with white and one warm accent: trustworthy and clear."
    : /fun|friend|play|young/.test(v) ? "Bright, friendly colors (green, yellow or pink) with rounded shapes."
    : /calm|kind|health|soft/.test(v) ? "Soft greens or blues with lots of white space: calm and kind."
    : /premium|lux|elegant/.test(v) ? "Black, off-white and one metallic or deep accent: premium."
    : "Pick one main color and one accent. Fewer colors look more professional.";
  const outcome = p.idea.replace(/^(lets you|helps you|helps)\s+/i, "").replace(/\.$/, "");
  return [
    { title: "Name check", items: [
      ...(names.length ? names.slice(0, 4).map((n) => `${n}: is it easy to spell after hearing it once? Under 3 syllables?`) : [`${p.startup}: is it easy to spell after hearing it once? Under 3 syllables?`]),
      "Check the domain at a registrar (try get, try or app versions if .com is taken).",
      "Check the same handle on Instagram, TikTok and X.",
      "Search the name on the USPTO trademark search (or your country's office) before you invest in it.",
    ] },
    { title: "Tagline options", items: [`${cap(outcome)}.`, `${p.startup}. Built for ${p.customer}.`, `The easiest way to ${outcome}.`, `Stop struggling. Start ${outcome.split(" ").slice(0, 3).join(" ")}.`] },
    { title: "Brand voice", items: [
      vibe.length ? `Sound ${vibe.join(", ")} in every post, email and screen.` : "Pick 3 words for how you sound, and use them to check every post.",
      `Do: talk like a friend who gets ${p.customer}. Short sentences.`,
      "Don't: use buzzwords, hype you can't back up, or fake stats.",
    ] },
    { title: "Look and feel", items: [color, t(a.admire) ? `Study what ${t(a.admire)} do well (simple logo, one signature color, consistent font), then make your own version.` : "Use one bold font for headlines and one simple font for text.", "Make a simple logo in Canva or Figma: your name in a good font is enough to start."] },
  ];
}
/** "Voca helps students…" whether the idea starts with a verb ("helps…", "lets…") or not ("an app that…"). */
const does = (p: Profile) => { const i = p.idea.trim().replace(/\.$/, ""); return /^(lets|helps|gives|makes|turns|matches|connects|teaches|finds|builds|shows|tracks|creates|is|uses)\b/i.test(i) ? `${p.startup} ${i}` : `${p.startup} is ${/^(a|an|the)\b/i.test(i) ? "" : "a way to "}${i}`; };
const lower = (s: string) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function sales(p: Profile, a: A): Section[] {
  const buyer = t(a.buyer, p.customer);
  const objection = t(a.objection, "I don't have time");
  const offerTxt = t(a.offerPrice, `${p.startup}`);
  return [
    { title: "Who to sell to first", items: [`Start with warm outreach: ${buyer} you already know or are one intro away from.`, "Make a list of 30 names in a spreadsheet: name, how you know them, date contacted, reply.", "Ask every happy user for 2 introductions. Referrals close far more easily than strangers."] },
    { title: "Outreach scripts", items: [
      `Warm: "Hey ${"{name}"}! I'm building ${p.startup}, which ${p.idea.replace(/\.$/, "")}. Do you know anyone who struggles with this? Would love your honest take."`,
      `Cold: "Hi ${"{name}"}, I noticed [something specific about them]. I'm a student founder building ${p.startup} for ${p.customer}. Could I show you a 2-minute demo this week?"`,
      `Follow-up (3 days later): "Just bumping this up. Happy to send a short video instead if that's easier."`,
    ] },
    { title: "Handle objections", items: [
      `"${objection}": agree first, then reframe. "Totally fair. That's exactly why we made the first step take 2 minutes."`,
      "\"It's too expensive\": compare the price to the cost of the problem, or offer a small pilot.",
      "\"Let me think about it\": ask \"What would you need to see to say yes?\" and answer that.",
    ] },
    { title: "Your sales week", items: [`Mon–Tue: message 10 warm contacts about ${offerTxt}.`, "Wed: follow up with everyone who hasn't replied.", "Thu: run 2-3 demos. Ask for the sale or a pilot at the end of each.", "Fri: write down every objection you heard and improve your answer."] },
  ];
}

function content(p: Profile, a: A): Section[] {
  const plats = list(a.platforms);
  const pl = plats.length ? plats : ["TikTok", "Instagram Reels"];
  const know = t(a.know, "building a startup as a young founder");
  const hrs = Math.max(1, parseInt(t(a.time, "3"), 10) || 3);
  const posts = Math.max(2, Math.min(7, Math.round(hrs * 1.5)));
  return [
    { title: "Content pillars", items: [`Build in public: your journey building ${p.startup}, wins and fails.`, `Teach: quick tips about ${know}.`, `Problem stories: moments ${p.customer} will recognize.`, `Proof: demos, user reactions (with permission), milestones.`] },
    { title: "10 post ideas", items: [
      `"Day 1 of building ${p.startup}" (then keep the series going)`,
      `"3 mistakes ${p.customer} make with ${know.split(" ").slice(0, 3).join(" ")}"`,
      `"I asked 10 ${p.customer} about their biggest struggle. Here's what they said"`,
      "A 20-second demo: problem, then your fix",
      `"Why I started ${p.startup}" (your real story)`,
      "Reacting to a common bad tip in your space",
      "Before/after of your product or a user's progress",
      "A behind-the-scenes look at your build or a meeting",
      "Answering a question from a comment",
      `"What I'd do if I was starting ${p.startup} from zero again"`,
    ] },
    { title: "Hooks that stop the scroll", items: [`"If you're one of the ${p.customer} who…"`, "\"Nobody tells you this about…\"", "\"I'm 1 [day/week] into building a startup and…\"", "\"Stop doing [common thing]. Do this instead.\""] },
    { title: "Posting schedule", items: [`${posts} posts a week on ${pl[0]}${pl[1] ? `, repost the same videos to ${pl.slice(1).join(" and ")}` : ""}.`, `Batch: film ${posts} short videos in one ${Math.ceil(hrs / 2)}-hour session each week.`, "Reply to every comment in the first hour. Comments are your best ideas for the next posts.", "Track: views, follows and sign-ups from each post. Double down on what works."] },
  ];
}

function investor(p: Profile, a: A): Section[] {
  const raising = t(a.raising);
  const notYet = !raising || /not|no\b|none/i.test(raising);
  return [
    { title: "Are you ready to raise?", items: [
      t(a.proof) ? `Your proof: ${t(a.proof)}. Lead every conversation with it.` : "You need proof first: users, a pilot, revenue, or strong growth. Ideas alone rarely get funded.",
      notYet ? "You said you're not raising yet. Good: free money first (competitions, grants, fellowships) keeps 100% of your company." : `You're raising ${raising}. Know exactly what milestone it gets you to.`,
      t(a.useOf) ? `Use of funds: ${t(a.useOf)}. Tie it to a measurable milestone.` : "Write what the money buys and what it proves (e.g. launch + 1,000 users).",
    ] },
    { title: "Who to approach", items: [
      ...matched(p, ["Grant", "Fellowship", "Competition"], 4).map((o) => `Non-dilutive first: ${oppLine(o)}`),
      ...matched(p, ["Accelerator", "Investor"], 5).map((o) => `${o.type}: ${oppLine(o)} Check their age and company rules first.`),
      "Non-dilutive first: pitch competitions, grants and fellowships in Opportunities (filter by \"Grant\" and \"Competition\").", "Youth-friendly programs and funds: see Opportunities, filtered by \"Investor\" and \"Fellowship\". Check each one's age rules.", "Angels you're connected to: teachers, alumni, local founders. A warm intro beats a cold email.", "Accelerators like Y Combinator or Techstars when you have traction."] },
    { title: "Cold email to investors", items: [`Subject: ${p.startup}: ${t(a.proof, "early traction")} (student founder)`, `"Hi {name}, I'm ${t(p.founder, "[name]")}, founder of ${p.startup}. We ${p.idea.replace(/\.$/, "")} for ${p.customer}. ${t(a.proof) ? `So far: ${t(a.proof)}.` : "[Your strongest real number.]"} ${notYet ? "We're not raising yet, but I'd value 15 minutes of advice." : `We're raising ${raising} to ${t(a.useOf, "[milestone]")}.`} Deck attached. Thanks!"`, "Keep it under 120 words. Send your deck as a PDF or link."] },
    { title: "Before you sign anything", items: ["If you're under 18, a parent or guardian must be involved, and many funds only invest in founders 18+ or in a registered company.", "A SAFE (Simple Agreement for Future Equity, created by Y Combinator) gives investors future shares. Understand the valuation cap and discount.", "Never sign without a lawyer reviewing it. Many offer free help for student founders.", "Give away as little equity as possible early. Every percent is hard to get back."] },
  ];
}

const GUIDES: Record<AgentId, (p: Profile, a: A, r?: Research) => Section[]> = { idea, customer, competitor, offer, build, brand, pitch, money, sales, launch, content, investor };

export function guided(id: AgentId, p: Profile, answers: A, research?: Research): Section[] {
  return GUIDES[id](p, answers, research);
}
