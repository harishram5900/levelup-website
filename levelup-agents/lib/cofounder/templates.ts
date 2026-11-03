/**
 * Guided (no-AI) versions of every agent. They use the founder's own answers plus proven
 * startup frameworks, so every founder gets a useful result even without an API key.
 */
import type { AgentId } from "../agents";
import type { Profile, Section } from "./profile";

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

function customer(p: Profile, a: A): Section[] {
  const where = list(a.where);
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
      "Student pitch competitions (prize money, mentors, and credibility). See the Opportunities page.",
      "Paul Graham's test: are you default alive? If revenue grows at today's rate with today's costs, do you reach profit before money runs out?",
      "Pre-sales: let early customers pay before you build. It's free money and proof of demand.",
      "Small grants for young founders and local business programs.",
      "Free credits: startup programs from cloud and software companies often give credits to student founders.",
    ] },
    { title: "Money basics", items: ["Keep business money separate from personal money from day one.", "Track every dollar in a simple spreadsheet: date, what, amount.", "If you're under 18, a parent or guardian will need to help with bank accounts, payments and contracts."] },
  ];
}

function launch(p: Profile, a: A): Section[] {
  const channels = list(a.channels);
  const goal = t(a.goal, "your first 100 users");
  const ch = channels.length ? channels : ["TikTok", "Instagram", "your school network"];
  return [
    { title: "Launch checklist", items: ["A simple landing page with one clear button.", "A way to collect emails or sign-ups.", "A 30-second demo video.", `A list of 50 people and communities to tell (${ch.slice(0, 3).join(", ")}).`, "One sentence that explains what you do."] },
    { title: "4-week plan", items: [
      `Week 1: post your founder story on ${ch[0]}. Why you started ${p.startup}.`,
      `Week 2: share 3 short demos showing the problem and the fix.`,
      `Week 3: personally message 30 people from ${ch[1] ?? ch[0]} and ask them to try it.`,
      `Week 4: share results and what you learned, then ask users to invite a friend. Goal: ${goal}.`,
    ] },
    { title: "Content ideas", items: [`"I'm ${t(p.founder, "a student")} and I'm building ${p.startup} because…"`, `"POV: you're one of the ${p.customer} who…"`, '"Day 1 vs. day 30" progress videos', '"3 mistakes I made building my first startup"'] },
    { title: "Numbers to track", items: ["Sign-ups per week", "How many come back a second time", "Where sign-ups came from", `Progress toward your goal: ${goal}`] },
  ];
}


function competitor(p: Profile, a: A): Section[] {
  const alts = list(a.alternatives);
  const diff = t(a.different);
  return [
    { title: "Your competition map", items: [
      ...(alts.length ? alts.map((x) => `${x}: write down what it costs, who uses it, and the #1 complaint about it (check its reviews).`) : ["List every way people solve this today, including apps, people they pay, and doing it themselves."]),
      "Doing nothing: your biggest competitor is often people just living with the problem. Know why they'd bother to switch.",
    ] },
    { title: "How you win", items: [
      diff ? `Your edge: ${diff}. Make this the first thing people notice.` : "Write one thing you do better than every alternative. If you can't, narrow your customer until you can.",
      `Own a niche first: be the best option for one specific slice of ${p.customer} before going broad.`,
      "Compete on what big players can't copy quickly: speed, a community, or caring about a group they ignore.",
    ] },
    { title: "Watch out for", items: ["A bigger company adding your feature for free. Your answer: focus and speed.", "Assuming nobody else exists. Judges always ask, and \"no competitors\" sounds like you didn't look.", "Copying competitors' features instead of solving the problem better."] },
    { title: "Your positioning line", items: [`For ${p.customer} who are tired of ${alts[0] ? `relying on ${alts[0]}` : "the usual options"}, ${p.startup} ${p.idea.replace(/\.$/, "")}${diff ? `, and unlike others it ${diff.replace(/^we /i, "").replace(/\.$/, "")}` : ""}.`] },
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
    { title: "Who to approach", items: ["Non-dilutive first: pitch competitions, grants and fellowships in Opportunities (filter by \"Grant\" and \"Competition\").", "Youth-friendly programs and funds: see Opportunities, filtered by \"Investor\" and \"Fellowship\". Check each one's age rules.", "Angels you're connected to: teachers, alumni, local founders. A warm intro beats a cold email.", "Accelerators like Y Combinator or Techstars when you have traction."] },
    { title: "Cold email to investors", items: [`Subject: ${p.startup}: ${t(a.proof, "early traction")} (student founder)`, `"Hi {name}, I'm ${t(p.founder, "[name]")}, founder of ${p.startup}. We ${p.idea.replace(/\.$/, "")} for ${p.customer}. ${t(a.proof) ? `So far: ${t(a.proof)}.` : "[Your strongest real number.]"} ${notYet ? "We're not raising yet, but I'd value 15 minutes of advice." : `We're raising ${raising} to ${t(a.useOf, "[milestone]")}.`} Deck attached. Thanks!"`, "Keep it under 120 words. Send your deck as a PDF or link."] },
    { title: "Before you sign anything", items: ["If you're under 18, a parent or guardian must be involved, and many funds only invest in founders 18+ or in a registered company.", "A SAFE (Simple Agreement for Future Equity, created by Y Combinator) gives investors future shares. Understand the valuation cap and discount.", "Never sign without a lawyer reviewing it. Many offer free help for student founders.", "Give away as little equity as possible early. Every percent is hard to get back."] },
  ];
}

const GUIDES: Record<AgentId, (p: Profile, a: A) => Section[]> = { idea, customer, competitor, offer, build, brand, pitch, money, sales, launch, content, investor };

export function guided(id: AgentId, p: Profile, answers: A): Section[] {
  return GUIDES[id](p, answers);
}
