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
    { title: "Your one-liner", items: [`${p.startup} helps ${p.customer} ${p.idea.replace(/^(to |helps? )/i, "")}.`] },
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

const GUIDES: Record<AgentId, (p: Profile, a: A) => Section[]> = { idea, customer, build, pitch, money, launch };

export function guided(id: AgentId, p: Profile, answers: A): Section[] {
  return GUIDES[id](p, answers);
}
