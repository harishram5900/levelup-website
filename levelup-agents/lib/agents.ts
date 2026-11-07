import { Banknote, Gem, Hammer, Handshake, Lightbulb, Megaphone, Palette, Presentation, Radar, TrendingUp, Users, Video, type LucideIcon } from "lucide-react";

export type AgentId = "idea" | "customer" | "competitor" | "offer" | "build" | "brand" | "pitch" | "money" | "sales" | "launch" | "content" | "investor";

export type Field = { id: string; label: string; placeholder: string; long?: boolean };

export type Agent = {
  id: AgentId;
  name: string;
  role: string;
  line: string; // one-sentence description for cards
  stage: string; // short caption for the journey
  world: number; // which world on the quest map (0-3)
  icon: LucideIcon;
  fields: Field[];
  sections: string[]; // the sections every answer contains, in order
  brief: string; // what the AI version should focus on
  playbooks: string[]; // ids from lib/cofounder/playbooks.ts
};

export const WORLDS = [
  { name: "Idea Island", line: "Find a problem worth solving" },
  { name: "Build Bay", line: "Make something people want" },
  { name: "Pitch Peak", line: "Price it, pitch it, sell it" },
  { name: "Launch Galaxy", line: "Grow and raise" },
];

/** The twelve co-founder agents, in the order a young founder needs them. */
export const AGENTS: Agent[] = [
  {
    id: "idea", name: "Idea", role: "Idea validator", icon: Lightbulb, world: 0,
    line: "Pressure-tests your idea, finds the weak spots and tells you what to test this week.",
    stage: "Check your idea is worth building",
    fields: [
      { id: "problem", label: "What problem are you solving?", placeholder: "e.g. Students freeze when they speak in class", long: true },
      { id: "today", label: "How do people deal with it today?", placeholder: "e.g. They avoid presentations or watch YouTube tips" },
      { id: "whyYou", label: "Why are you the right person to solve it?", placeholder: "e.g. I was that student, and I now coach 400+ others" },
    ],
    sections: ["Your one-liner", "What's strong", "Biggest risks", "Test it this week"],
    brief: "Validate the idea honestly. Name the riskiest assumption. Suggest three cheap tests the founder can run in 7 days without money.",
    playbooks: ["yc-want", "andreessen-pmf", "thiel-niche"],
  },
  {
    id: "customer", name: "Customer", role: "Customer finder", icon: Users, world: 0,
    line: "Writes your interview script and shows you where to find your first 10 users.",
    stage: "Talk to real customers",
    fields: [
      { id: "where", label: "Where do your customers spend time?", placeholder: "e.g. School clubs, Discord servers, TikTok" },
      { id: "learn", label: "What do you most need to learn from them?", placeholder: "e.g. Would they practice at home? Would parents pay?", long: true },
    ],
    sections: ["Interview questions", "Where to find your first 10", "Message to send", "What to write down"],
    brief: "Write customer interview questions about past behavior, not opinions or compliments (The Mom Test). Be concrete about channels a teenager can actually reach.",
    playbooks: ["mom-test", "blank-building", "gates-unhappy"],
  },
  {
    id: "competitor", name: "Scout", role: "Competitor scout", icon: Radar, world: 0,
    line: "Type your niche and Scout searches the App Store, Google Play, Hacker News, GitHub and the web for your real competitors, reads their bad reviews and finds the gap you can win.",
    stage: "Know your competition",
    fields: [
      { id: "niche", label: "Your niche in a few words (Scout searches this)", placeholder: "e.g. public speaking practice app" },
      { id: "alternatives", label: "Competitors you already know (optional)", placeholder: "e.g. Toastmasters, Speeko, a tutor", long: true },
      { id: "different", label: "What do you do that they don't?", placeholder: "e.g. Practice anytime, instant feedback, costs less" },
    ],
    sections: ["Your competition map", "What their users complain about", "Gaps you can own", "How you win", "Watch out for", "Your positioning line"],
    brief: "Use the live research provided (real apps, ratings, review counts and low-star reviews) to map direct competitors, indirect alternatives and doing nothing. Name real competitors from the research with their rating and link. Cluster the complaints into themes and turn each theme into a gap this founder can own. Find a small niche the founder can dominate first. Never claim facts about competitors that are not in the research or the founder's answers.",
    playbooks: ["thiel-niche", "yc-want"],
  },
  {
    id: "offer", name: "Offer", role: "Offer architect", icon: Gem, world: 1,
    line: "Uses the Value Equation to turn your product into an offer people feel silly saying no to.",
    stage: "Make an irresistible offer",
    fields: [
      { id: "outcome", label: "What dream result does your customer want?", placeholder: "e.g. Give a speech without shaking" },
      { id: "proof", label: "Why would they believe it works?", placeholder: "e.g. Demo video, a pilot, before/after results" },
      { id: "speed", label: "How fast do they get a first result?", placeholder: "e.g. First practice session in 2 minutes" },
      { id: "effort", label: "What's annoying or hard for them today?", placeholder: "e.g. Finding someone to practice with, feeling judged" },
    ],
    sections: ["Value equation check", "Your offer", "Bonuses and guarantee", "Make it a no-brainer"],
    brief: "Apply Alex Hormozi's Value Equation from $100M Offers: increase dream outcome and perceived likelihood, decrease time delay and effort. Build an offer with bonuses and a guarantee that a student founder can actually deliver.",
    playbooks: ["hormozi-value", "hormozi-grand-slam"],
  },
  {
    id: "build", name: "Build", role: "MVP planner", icon: Hammer, world: 1,
    line: "Cuts your feature list down to what matters and turns it into a 2-week build plan.",
    stage: "Build the smallest useful version",
    fields: [
      { id: "features", label: "Features you want (comma separated)", placeholder: "e.g. sign up, practice mode, feedback, streaks, leaderboard", long: true },
      { id: "skills", label: "What can you build with?", placeholder: "e.g. I know some HTML / no coding yet / my co-founder codes" },
      { id: "hours", label: "Hours per week you can spend", placeholder: "e.g. 10" },
    ],
    sections: ["Build first", "Save for later", "Tools to use", "Your 2-week plan"],
    brief: "Pick at most three must-have features that deliver the core value. Prefer free and no-code tools when the founder can't code.",
    playbooks: ["ries-mvp", "hoffman-embarrassed", "yc-talk-code"],
  },
  {
    id: "brand", name: "Brand", role: "Brand builder", icon: Palette, world: 1,
    line: "Checks your name, writes taglines and picks a voice, colors and look that fit.",
    stage: "Look like a real company",
    fields: [
      { id: "vibe", label: "3 words for how your brand should feel", placeholder: "e.g. bold, friendly, smart" },
      { id: "names", label: "Name ideas (if you're still deciding)", placeholder: "e.g. Voca, SpeakUp, Mic Drop" },
      { id: "admire", label: "Brands you love the look of", placeholder: "e.g. Duolingo, Nike, Notion" },
    ],
    sections: ["Name check", "Tagline options", "Brand voice", "Look and feel"],
    brief: "Give practical branding for a tiny startup: name checks (domain, social handles, trademark search), 3 to 5 tagline options, a voice guide with do and don't examples, and a color and font direction. Do not claim a name or domain is available.",
    playbooks: ["vaynerchuk-document", "yc-want"],
  },
  {
    id: "pitch", name: "Pitch", role: "Storyteller", icon: Presentation, world: 2,
    line: "Writes your one-liner, a 30-second pitch and the questions judges will ask.",
    stage: "Pitch it to judges and investors",
    fields: [
      { id: "story", label: "Why did you start this?", placeholder: "e.g. I froze and cried at my first speech", long: true },
      { id: "traction", label: "Progress so far (real numbers only)", placeholder: "e.g. Working demo, 30 students on a waitlist" },
      { id: "ask", label: "What are you pitching for?", placeholder: "e.g. A school competition, an accelerator, a grant" },
    ],
    sections: ["One-liner", "30-second pitch", "Deck outline", "Questions judges will ask", "Where to pitch it"],
    brief: "Write short, plain, confident sentences. Use the Sequoia deck order and Guy Kawasaki's 10/20/30 rule. Never invent traction, users, revenue or awards that the founder did not give.",
    playbooks: ["sequoia-deck", "kawasaki-102030"],
  },
  {
    id: "money", name: "Money", role: "Pricing and funding", icon: Banknote, world: 2,
    line: "Sets your price, does the break-even math and finds funding young founders can actually get.",
    stage: "Make money and find funding",
    fields: [
      { id: "model", label: "How will you charge?", placeholder: "e.g. Monthly subscription / one-time / schools pay" },
      { id: "price", label: "Price you're thinking of ($)", placeholder: "e.g. 8" },
      { id: "costs", label: "Monthly costs ($)", placeholder: "e.g. 40" },
      { id: "unitCost", label: "Cost to make or deliver one (optional, $)", placeholder: "e.g. 6" },
    ],
    sections: ["Pricing", "Break-even math", "Funding you can get", "Money basics"],
    brief: "Do simple, correct arithmetic. Recommend funding realistic for students: competitions, grants, small accelerators, pre-sales. Note that founders under 18 need a parent or guardian for bank accounts and contracts.",
    playbooks: ["graham-default-alive", "blakely-bootstrap", "chesky-cereal"],
  },
  {
    id: "sales", name: "Sales", role: "Sales closer", icon: Handshake, world: 2,
    line: "Finds your first buyers, writes outreach scripts and handles objections.",
    stage: "Get your first paying customers",
    fields: [
      { id: "buyer", label: "Who decides to buy? (user, parent, teacher, manager)", placeholder: "e.g. Club presidents and teachers" },
      { id: "objection", label: "What's the #1 reason someone would say no?", placeholder: "e.g. 'I don't have time' or 'it's too expensive'" },
      { id: "offerPrice", label: "What are you selling, and for how much?", placeholder: "e.g. A club plan for $3 per student" },
    ],
    sections: ["Who to sell to first", "Outreach scripts", "Handle objections", "Your sales week"],
    brief: "Use Alex Hormozi's Core Four from $100M Leads (warm outreach, free content, cold outreach, paid ads), starting with warm outreach. Write short, respectful scripts. Never suggest spam or misleading claims.",
    playbooks: ["hormozi-core-four", "cuban-sales", "naval-sell", "gadzhi-skill"],
  },
  {
    id: "launch", name: "Traction", role: "Launch and traction coach", icon: Megaphone, world: 3,
    line: "Finds the exact communities and launch sites for your niche, writes every post for you and plans your first 1,000 users week by week.",
    stage: "Launch and get traction",
    fields: [
      { id: "niche", label: "Your niche in a few words (we search communities for it)", placeholder: "e.g. public speaking for students" },
      { id: "link", label: "Link people can try (optional)", placeholder: "e.g. voca.app or your waitlist page" },
      { id: "channels", label: "Where are you already active?", placeholder: "e.g. TikTok, Instagram, school clubs, LinkedIn" },
      { id: "goal", label: "Goal for the first month", placeholder: "e.g. 100 sign-ups" },
    ],
    sections: ["Where your customers are", "Launch sites for you", "Ready-to-post drafts", "4-week traction plan", "Launch checklist", "Numbers to track"],
    brief: "Be a hands-on traction coach. Use the live research (real subreddits, threads and launch sites) to tell the founder exactly where to post, in what order, and how to follow each community's rules. Write complete, ready-to-paste post drafts for each top channel (Reddit, Product Hunt or Show HN, TikTok or Reels script, LinkedIn, a DM to friends). Plan free, organic growth: recruit users by hand first (Paul Graham's 'Do things that don't scale'). Every step is concrete, with a number and a day.",
    playbooks: ["graham-dont-scale", "graham-growth"],
  },
  {
    id: "content", name: "Content", role: "Content engine", icon: Video, world: 3,
    line: "Plans your content pillars, hooks and a posting schedule you can actually keep.",
    stage: "Build an audience",
    fields: [
      { id: "platforms", label: "Which platforms?", placeholder: "e.g. TikTok, YouTube Shorts, LinkedIn" },
      { id: "know", label: "What do you know a lot about?", placeholder: "e.g. public speaking, being a teen founder, coding" },
      { id: "time", label: "Hours per week for content", placeholder: "e.g. 3" },
    ],
    sections: ["Content pillars", "10 post ideas", "Hooks that stop the scroll", "Posting schedule"],
    brief: "Use 'Document, don't create' (Gary Vaynerchuk): turn the founder's real journey into content. Give specific hooks and a schedule that fits their hours. No fake stats or clickbait lies.",
    playbooks: ["vaynerchuk-document", "hormozi-core-four", "gadzhi-skill"],
  },
  {
    id: "investor", name: "Investor", role: "Fundraising coach", icon: TrendingUp, world: 3,
    line: "Tells you honestly if you're ready to raise, who fits, and writes your investor email.",
    stage: "Raise money the smart way",
    fields: [
      { id: "raising", label: "Are you raising? How much?", placeholder: "e.g. Not yet / $25K pre-seed" },
      { id: "useOf", label: "What would you do with the money?", placeholder: "e.g. Launch on the App Store, pay for AI costs" },
      { id: "proof", label: "Your strongest proof so far", placeholder: "e.g. Signed pilot with a 200-student organization" },
    ],
    sections: ["Are you ready to raise?", "Who to approach", "Cold email to investors", "Before you sign anything"],
    brief: "Be honest about readiness. For young founders, recommend non-dilutive money first (competitions, grants, fellowships), then youth-friendly funds. Explain a SAFE simply. Founders under 18 must involve a parent or guardian and a lawyer before signing anything. Never invent investor names, check sizes or terms.",
    playbooks: ["graham-default-alive", "sequoia-deck", "graham-growth"],
  },
];

export const agentById = (id: string) => AGENTS.find((a) => a.id === id);
