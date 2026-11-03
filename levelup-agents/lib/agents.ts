import { Banknote, Hammer, Lightbulb, Megaphone, Presentation, Users, type LucideIcon } from "lucide-react";

export type AgentId = "idea" | "customer" | "build" | "pitch" | "money" | "launch";

export type Field = { id: string; label: string; placeholder: string; long?: boolean };

export type Agent = {
  id: AgentId;
  name: string;
  role: string;
  line: string; // one-sentence description for cards
  stage: string; // short caption for the journey pipeline
  icon: LucideIcon;
  fields: Field[];
  sections: string[]; // the sections every answer contains, in order
  brief: string; // what the AI version should focus on
};

/** The six co-founder agents, in the order a young founder needs them. */
export const AGENTS: Agent[] = [
  {
    id: "idea", name: "Idea", role: "Idea validator", icon: Lightbulb,
    line: "Pressure-tests your idea, finds the weak spots and tells you what to test this week.",
    stage: "Check your idea is worth building",
    fields: [
      { id: "problem", label: "What problem are you solving?", placeholder: "e.g. Students freeze when they speak in class", long: true },
      { id: "today", label: "How do people deal with it today?", placeholder: "e.g. They avoid presentations or watch YouTube tips" },
      { id: "whyYou", label: "Why are you the right person to solve it?", placeholder: "e.g. I was that student, and I now coach 400+ others" },
    ],
    sections: ["Your one-liner", "What's strong", "Biggest risks", "Test it this week"],
    brief: "Validate the idea honestly. Name the riskiest assumption. Suggest three cheap tests the founder can run in 7 days without money.",
  },
  {
    id: "customer", name: "Customer", role: "Customer finder", icon: Users,
    line: "Writes your interview script and shows you where to find your first 10 users.",
    stage: "Talk to real customers",
    fields: [
      { id: "where", label: "Where do your customers spend time?", placeholder: "e.g. School clubs, Discord servers, TikTok" },
      { id: "learn", label: "What do you most need to learn from them?", placeholder: "e.g. Would they practice at home? Would parents pay?", long: true },
    ],
    sections: ["Interview questions", "Where to find your first 10", "Message to send", "What to write down"],
    brief: "Write customer interview questions about past behavior, not opinions or compliments. Be concrete about channels a teenager can actually reach.",
  },
  {
    id: "build", name: "Build", role: "MVP planner", icon: Hammer,
    line: "Cuts your feature list down to what matters and turns it into a 2-week build plan.",
    stage: "Build the smallest useful version",
    fields: [
      { id: "features", label: "Features you want (comma separated)", placeholder: "e.g. sign up, practice mode, feedback, streaks, leaderboard", long: true },
      { id: "skills", label: "What can you build with?", placeholder: "e.g. I know some HTML / no coding yet / my co-founder codes" },
      { id: "hours", label: "Hours per week you can spend", placeholder: "e.g. 10" },
    ],
    sections: ["Build first", "Save for later", "Tools to use", "Your 2-week plan"],
    brief: "Pick at most three must-have features that deliver the core value. Prefer free and no-code tools when the founder can't code.",
  },
  {
    id: "pitch", name: "Pitch", role: "Storyteller", icon: Presentation,
    line: "Writes your one-liner, a 30-second pitch and a 10-slide deck outline.",
    stage: "Pitch it to judges and investors",
    fields: [
      { id: "story", label: "Why did you start this?", placeholder: "e.g. I froze and cried at my first speech", long: true },
      { id: "traction", label: "Progress so far (real numbers only)", placeholder: "e.g. Working demo, 30 students on a waitlist" },
      { id: "ask", label: "What are you pitching for?", placeholder: "e.g. A school competition, an accelerator, a grant" },
    ],
    sections: ["One-liner", "30-second pitch", "Deck outline", "Questions judges will ask"],
    brief: "Write short, plain, confident sentences. Never invent traction, users, revenue or awards that the founder did not give.",
  },
  {
    id: "money", name: "Money", role: "Pricing and funding", icon: Banknote,
    line: "Sets your price, does the break-even math and finds funding young founders can actually get.",
    stage: "Make money and find funding",
    fields: [
      { id: "model", label: "How will you charge?", placeholder: "e.g. Monthly subscription / one-time / schools pay" },
      { id: "price", label: "Price you're thinking of ($)", placeholder: "e.g. 8" },
      { id: "costs", label: "Monthly costs ($)", placeholder: "e.g. 40" },
    ],
    sections: ["Pricing", "Break-even math", "Funding you can get", "Money basics"],
    brief: "Do simple, correct arithmetic. Recommend funding realistic for students: competitions, grants, small accelerators, pre-sales. Note that founders under 18 need a parent or guardian for bank accounts and contracts.",
  },
  {
    id: "launch", name: "Launch", role: "Growth coach", icon: Megaphone,
    line: "Builds your launch checklist and a 4-week plan to get your first users.",
    stage: "Launch and grow",
    fields: [
      { id: "channels", label: "Where will you share it?", placeholder: "e.g. TikTok, Instagram, school clubs, LinkedIn" },
      { id: "goal", label: "Goal for the first month", placeholder: "e.g. 100 sign-ups" },
    ],
    sections: ["Launch checklist", "4-week plan", "Content ideas", "Numbers to track"],
    brief: "Plan free, organic growth a student can do: short videos, communities, school networks, friends-of-friends. Make every step concrete.",
  },
];

export const agentById = (id: string) => AGENTS.find((a) => a.id === id);
