/**
 * Pro deep dives: advanced, founder-grade sections for every agent, built from the founder's own
 * answers plus frameworks from YC, The Mom Test, Hormozi, Thiel, Sequoia and others.
 * Free users see the section titles as a locked preview.
 */
import type { AgentId } from "../agents";
import type { Profile, Section } from "./profile";

type A = Record<string, string>;
const t = (s?: string, f = "") => (s ?? "").trim() || f;
const list = (s?: string) => t(s).split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
const num = (s?: string) => parseFloat(t(s).replace(/[^0-9.]/g, "")) || 0;
const idea = (p: Profile) => p.idea.replace(/\.$/, "");

const DEEP: Record<AgentId, (p: Profile, a: A) => Section[]> = {
  idea: (p, a) => [
    { title: "Founder-market fit score", items: [
      `Lived the problem? ${t(a.whyYou) ? `Yes: ${t(a.whyYou)}. That's your unfair advantage. Put it in the first 10 seconds of every pitch.` : "Not stated. Investors ask \"why you?\" first. Write one sentence about your personal connection."}`,
      `Can you reach ${p.customer} for free? If you can name 3 places they gather, score yourself high. If not, that's your #1 risk, not the product.`,
      "Would you work on this for 5 years with no money? Paul Graham's point: the best ideas are ones the founders want for themselves.",
    ] },
    { title: "Kill criteria (decide now, not later)", items: [
      `If fewer than 3 of your first 10 ${p.customer} describe the problem without you prompting it, the pain isn't strong enough.`,
      "If nobody asks \"when can I use it?\" after 10 conversations, change the customer or the problem before writing more code.",
      "If you can't get 20 sign-ups in 14 days from a one-page site, the message or the audience is wrong. Fix that before building.",
      "Writing these down before you start stops you from lying to yourself later.",
    ] },
    { title: "The questions YC would ask you", items: [
      `What exactly does ${p.startup} do? (Answer in under 10 words. No buzzwords.)`,
      "How do you know people need this? (Name real conversations, not assumptions.)",
      "What's new that makes this possible now?",
      "Who are your competitors, and what do you understand that they don't?",
      "How many users do you have, and how fast is that growing week over week?",
    ] },
    { title: "30-day validation roadmap", items: [
      `Week 1: 10 problem interviews with ${p.customer} (The Mom Test rules: ask about their past, never pitch).`,
      "Week 2: one-page site with a single promise and a sign-up button. Share it in 3 communities. Target: 20 sign-ups.",
      "Week 3: deliver the result manually to 3 people (concierge MVP). Watch what they actually use.",
      "Week 4: ask for money or a commitment (pre-order, pilot letter). A real \"yes\" is worth 100 compliments.",
    ] },
  ],
  customer: (p, a) => [
    { title: "Interview mistakes that ruin your data", items: [
      "Pitching your idea in the first 5 minutes. They'll be polite and lie. Pitch only at the very end, if at all.",
      "Asking \"would you use this?\" Future promises are worthless. Ask \"when did you last…\" instead.",
      "Accepting compliments. \"That's so cool!\" is not data. Steer back: \"Thanks! When did this last happen to you?\"",
      "Talking more than 20% of the time. Your job is to listen and take notes.",
    ] },
    { title: "Score every interview (0–3)", items: [
      "0: They've never had the problem. 1: Had it, didn't care. 2: Tried to fix it. 3: Paid money or spent hours on a fix.",
      `Only 2s and 3s are your real early customers. Find more ${p.customer} who look exactly like them.`,
      "After 10 interviews, if your average is under 2, the problem isn't painful enough. Change it or change the customer.",
    ] },
    { title: "Signals that mean YES", items: [
      "They ask \"when can I use it?\" or \"can I try it now?\"",
      "They introduce you to someone else without you asking.",
      "They offer money, a pilot, or their time to test it.",
      `They describe ${t(a.learn, "the problem")} in emotional words ("hate", "stressed", "embarrassing").`,
    ] },
    { title: "Turn interviews into your first users", items: [
      "End every call with: \"If we build this, can I send it to you first?\" Write down every yes.",
      "Keep a simple CRM: name, score (0–3), quote, next step. Review it every Sunday.",
      "Send a 2-line update every 2 weeks to everyone who said yes. Paul Graham: early users are recruited one by one.",
    ] },
  ],
  competitor: (p, a) => [
    { title: "Competitor teardown checklist", items: [
      `For each alternative${list(a.alternatives).length ? ` (${list(a.alternatives).slice(0, 3).join(", ")})` : ""}: price, who it's for, onboarding time, and the #1 complaint in reviews.`,
      "Read their 1–3 star reviews. Every repeated complaint is a feature you can win on.",
      "Sign up for their product yourself. Time how long it takes to get the first result.",
    ] },
    { title: "Your moat over time", items: [
      "Today: speed and focus. Ship weekly; big companies ship quarterly.",
      `In 6 months: community. Make ${p.customer} feel like ${p.startup} is theirs.`,
      "In 2 years: data or network effects. Each new user should make the product better for others.",
    ] },
    { title: "How to answer \"what about [big company]?\"", items: [
      "\"They're built for everyone. We're built only for [your niche], so we can go deeper and faster.\"",
      "\"If they copy us, it validates the market, and we'll already own the customers who care most.\"",
      "Never say \"we have no competitors.\" It signals you didn't look.",
    ] },
    { title: "Monopoly test (Peter Thiel)", items: [
      "Proprietary tech: is something you do 10x better, not 10% better?",
      "Network effects: does it get better as more people use it?",
      "Economies of scale and brand: can you get cheaper and more trusted as you grow?",
      `Start with the smallest market ${p.startup} can dominate, then expand.`,
    ] },
  ],
  offer: (p, a) => [
    { title: "Grand Slam Offer stack", items: [
      `Core: ${t(a.outcome, "the dream result")} with ${p.startup}.`,
      "Bonus 1: a quick-start guide that gets the first win in under 10 minutes.",
      "Bonus 2: a private group or weekly live session (high value to them, low cost to you).",
      "Bonus 3: templates or checklists they'd otherwise make themselves.",
      "Name each bonus after the problem it solves, not what it is.",
    ] },
    { title: "Pricing psychology", items: [
      "Anchor: show the cost of the problem (time, money, embarrassment) before the price.",
      "Offer 2 options (monthly and yearly). People choose between options instead of yes/no.",
      "A guarantee lets you charge more: \"If you don't see results in 14 days, full refund.\"",
    ] },
    { title: "Scarcity and urgency (the honest way)", items: [
      "Founding-member price for the first 50 users, and actually close it at 50.",
      "Cohorts: start dates every month create natural deadlines.",
      "Never fake a timer. Fake scarcity destroys trust, especially with young customers.",
    ] },
    { title: "Offer test plan", items: [
      "Write 3 versions of the offer headline. Show each to 10 people. Count who asks \"how do I get it?\"",
      "Track: views, clicks, sign-ups, payments. The biggest drop-off is what to fix next.",
    ] },
  ],
  build: (p, a) => [
    { title: "MVP scope cutter", items: [
      `The one job ${p.startup} must do perfectly: ${idea(p)}. Everything else is optional for v1.`,
      `Cut list: ${list(a.features).slice(3).join(", ") || "logins, settings, notifications, dashboards"}. Add them only when 3+ users ask.`,
      "If a feature doesn't help a user reach the core result in their first session, it waits.",
    ] },
    { title: "Weekly ship rhythm", items: [
      "Monday: pick ONE thing to ship. Write the user story in one sentence.",
      "Wednesday: show the half-built version to one user.",
      "Friday: ship it, post a changelog, and ask 3 users what broke.",
      "Reid Hoffman: if you're not embarrassed by v1, you launched too late.",
    ] },
    { title: "Metrics to wire in from day 1", items: [
      "Activation: % of sign-ups who reach the core result in their first session.",
      "Retention: % who come back in week 2. This is the number that matters most.",
      "Track it in a spreadsheet if you have to. Not measuring is the real mistake.",
    ] },
    { title: "Tech decisions that save you later", items: [
      "Use managed services (Vercel, Supabase, Stripe) instead of building your own servers.",
      "Write down every shortcut you take in a \"tech debt\" note. Fix them when users are paying.",
      `With ${t(a.hours, "your")} hours a week, protect one deep-work block. Context switching kills small teams.`,
    ] },
  ],
  brand: (p, a) => [
    { title: "Brand story in 3 lines", items: [
      `Villain: the frustrating way ${p.customer} deal with this today.`,
      `Hero: ${p.customer} (not you, not the product).`,
      `Guide: ${p.startup}, the tool that helps them win. Use this in your bio, site and pitch.`,
    ] },
    { title: "Instant-trust checklist", items: [
      "Real founder face and story on your site (people trust people).",
      "One clear promise above the fold, one button.",
      "Social proof as soon as you have it: quotes, logos, numbers. Never fake any of it.",
      "Matching handle, logo and colors across every platform.",
    ] },
    { title: "Visual identity starter kit", items: [
      `Vibe: ${list(a.vibe).join(", ") || "pick 3 words"}. Every design choice should pass this test.`,
      "1 primary color, 1 accent, 1 neutral. 2 fonts max.",
      "Make 5 templates (post, story, thumbnail, slide, email header) so everything looks consistent.",
    ] },
    { title: "Words to own", items: [
      `Pick 3 phrases ${p.customer} use about the problem (from interviews) and repeat them everywhere.`,
      "Pick 1 word you want people to associate with you. Volvo owns \"safe\". What does yours own?",
    ] },
  ],
  pitch: (p, a) => [
    { title: "Story arc that wins rooms", items: [
      `Hook (10s): ${t(a.story) ? `"${t(a.story).slice(0, 120)}"` : "a personal moment when you felt the problem"}.`,
      `Problem (20s): how ${p.customer} suffer today, with one real example.`,
      `Solution (20s): ${p.startup} ${idea(p)}. Show, don't tell.`,
      `Proof (20s): ${t(a.traction, "your real progress, even if small")}.`,
      "Ask (10s): exactly what you want and what it unlocks.",
    ] },
    { title: "Tough Q&A drills", items: [
      "\"Why now?\" Point to a change in technology or behavior.",
      "\"How will you get users?\" Name a specific channel and your results so far.",
      "\"What if you fail?\" Show what you learn either way. Judges love founders who learn fast.",
      "Practice each answer out loud in under 20 seconds. Record yourself.",
    ] },
    { title: "Delivery like a pro", items: [
      "Open without \"Hi, my name is…\". Start with the story, then say your name.",
      "Pause for 2 seconds after your most important line.",
      "One idea per slide; you are the presentation, the slides are the backup.",
    ] },
    { title: "Judging rubric (how you'll be scored)", items: [
      "Problem clarity, solution fit, market size, traction, team, presentation.",
      "Most student pitches lose points on traction and market. Bring real numbers, even small ones.",
    ] },
  ],
  money: (p, a) => {
    const price = num(a.price), costs = num(a.costs);
    const users = price ? Math.ceil(((costs || 50) * 10) / price) : 0;
    return [
      { title: "Unit economics", items: [
        price ? `At $${price}/customer, ${users} paying customers covers ${costs ? `10× your $${costs} monthly costs` : "about $500/month"}.` : "Set a price to see how many customers you need.",
        "Customer acquisition cost (CAC): what you spend to get one customer. Keep it under 1/3 of what they pay you in a year.",
        "Lifetime value (LTV): price × months they stay. Raise LTV by improving retention, not just price.",
      ] },
      { title: "Revenue roadmap", items: [
        "Stage 1: first $1. Proves someone will pay at all.",
        "Stage 2: first $100/month. Proves it repeats.",
        `Stage 3: $1,000/month. Proves ${p.startup} can grow. This is when investors start listening.`,
      ] },
      { title: "Pricing experiments", items: [
        "Test 2 prices with different groups. If nobody complains about price, it's too low.",
        "Try annual plans with 2 months free. Cash up front funds growth.",
        "For schools or clubs: price per seat, sold to the person who controls a budget.",
      ] },
      { title: "Funding stack for young founders", items: [
        "1) Revenue and pre-sales. 2) Competitions and grants. 3) Fellowships. 4) Angels you know. 5) VCs, last.",
        "Every dollar you don't raise is equity you keep.",
        "Under 18: a parent or guardian must be involved in contracts and bank accounts.",
      ] },
    ];
  },
  sales: (p, a) => [
    { title: "Discovery call script (15 min)", items: [
      "1. \"What made you take this call?\" (Let them talk.)",
      `2. "Tell me about the last time you dealt with ${t(a.objection) ? "this" : "the problem"}."`,
      "3. \"What have you tried? What did it cost you?\"",
      "4. \"If this were solved, what would change for you?\"",
      `5. Only now: a 2-minute demo of ${p.startup}, then "Want to start a pilot?"`,
    ] },
    { title: "Follow-up cadence", items: [
      "Day 0: thank-you + recap of their problem in their words.",
      "Day 3: one useful resource (no pitch).",
      "Day 7: \"Should I hold a spot for you in this month's pilot?\"",
      "80% of deals close after the 5th touch. Most founders stop after 1.",
    ] },
    { title: "Close techniques that aren't pushy", items: [
      "Assumptive: \"Should we start Monday or Wednesday?\"",
      "Pilot close: \"Let's try it free for 2 weeks; if it works, it's $X after.\"",
      "Silence: ask for the sale, then stop talking.",
    ] },
    { title: "Pipeline math", items: [
      "Typical early funnel: 100 messages → 20 replies → 8 calls → 2 customers.",
      "Want 10 customers? Work backwards: about 500 messages. Put that number on your calendar.",
    ] },
  ],
  launch: (p, a) => [
    { title: "Launch-day runbook", items: [
      "T-7 days: line up 20 people who promise to share on launch day.",
      "T-1: schedule posts, test sign-up flow on phone, prepare replies.",
      `Launch day: post in ${list(a.channels).slice(0, 3).join(", ") || "your 3 best channels"}, reply to every comment within 1 hour.`,
      "T+1: thank everyone publicly, share early numbers, ask for feedback.",
    ] },
    { title: "Launch platforms to use", items: [
      "Product Hunt (tech), Reddit communities (follow each subreddit's rules), Discord servers, school newsletters.",
      "Local news and school papers love young founder stories. Pitch them a 3-line email.",
    ] },
    { title: "Referral loop design", items: [
      "Give both sides a reward: \"Invite a friend, you both get [bonus].\"",
      "Ask for referrals right after a user's first win, when they're happiest.",
      "Track your viral coefficient: invites sent × % who join. Above 0.5 is great early on.",
    ] },
    { title: "Post-launch 30-day plan", items: [
      "Talk to every user who signed up in week 1.",
      "Fix the #1 drop-off point in your funnel.",
      `Goal check: ${t(a.goal, "your first 100 users")}. Paul Graham: aim for 5–7% weekly growth.`,
    ] },
  ],
  content: (p, a) => [
    { title: "Viral hook formulas", items: [
      "\"I tried [thing] for 30 days. Here's what happened.\"",
      "\"The [number] mistakes every [audience] makes with [topic].\"",
      "\"POV: you're a [age] building a startup that [result].\"",
      "\"Nobody talks about this part of [topic]…\"",
    ] },
    { title: "Repurposing system", items: [
      "1 long video (5–10 min) → 5 short clips → 5 quote posts → 1 newsletter.",
      `Batch everything on one day per week (${t(a.time, "2–3")} hours).`,
      "Reply to comments with video replies. The algorithm loves them and it's free content.",
    ] },
    { title: "Weekly content scorecard", items: [
      "Track: views, follows, saves, and link clicks per post.",
      "Saves and shares matter more than likes. They signal real value.",
      "Each week, double down on your best format and drop your worst.",
    ] },
    { title: "Turn followers into users", items: [
      `One clear call to action on every post: "Try ${p.startup} free, link in bio."`,
      "Pin your founder story and best demo to the top of your profile.",
      "Collect emails early. You own an email list; you don't own followers.",
    ] },
  ],
  investor: (p, a) => [
    { title: "Data room checklist", items: [
      "Pitch deck (10 slides) and a 1-page memo.",
      "Metrics sheet: users, growth, retention, revenue (only real numbers).",
      "Cap table (who owns what), founder agreements, company documents.",
      "Product demo video (2 min).",
    ] },
    { title: "Investor CRM", items: [
      "Track: name, fund, check size, stage, intro source, status, next step.",
      "Aim for 3–5 warm intros per week. Cold emails convert far less.",
      "Send a monthly investor update even before you raise. Investors invest in lines, not dots.",
    ] },
    { title: "SAFE terms explained simply", items: [
      "Valuation cap: the maximum price your investor's money converts at later. Lower cap = more ownership for them.",
      "Discount: they get shares cheaper than the next investors (often 10–20%).",
      "Pro-rata: their right to invest more later. Fine to give, but understand it.",
    ] },
    { title: "Red flags to avoid", items: [
      "Anyone asking you to pay to pitch.",
      "Giving away more than ~10–15% in your first small round.",
      "Signing anything without a lawyer and (if under 18) a parent or guardian.",
      `"${t(a.raising, "Raise only when you know what milestone the money buys")}."`,
    ] },
  ],
};

export function deepDive(id: AgentId, p: Profile, answers: A): Section[] {
  return DEEP[id](p, answers);
}
export const deepDiveTitles = (id: AgentId) => DEEP[id]({ founder: "", startup: "your startup", idea: "", customer: "your customers", stage: "idea" }, {}).map((s) => s.title);
