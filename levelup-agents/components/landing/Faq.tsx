import { Accordion } from "@/components/ui/Accordion";

const FAQ = [
  { q: "Who is LevelUp for?", a: "Young entrepreneurs, mostly ages 13 to 22, who have an idea or a side project and want help turning it into a real startup. You don't need experience, a co-founder or money." },
  { q: "Is it really free?", a: "Yes. The free Student plan includes Startup HQ, 6 agents with starter plans, playbooks, XP, badges, leaderboards and competitions. Pro adds the AI co-founder chat that remembers you, a 1:1 call with the founder, full plans with deep dives on all 12 agents (including Money, Offer, Sales, Traction, Content and Investor), the pitch deck designer and the investor list." },
  { q: "Does it replace a real co-founder or mentor?", a: "No. It gets you unstuck and moving fast, with a clear plan and honest feedback. We still recommend finding people to build with, and the Customer and Pitch agents help you do that." },
  { q: "Will the AI make things up about my startup?", a: "Our agents are told never to invent users, revenue, awards or numbers. Plans are built from what you tell them. Always check anything you submit to a competition." },
  { q: "Where is my data stored?", a: "Right now, your startup info and plans stay in your own browser. Accounts that sync across devices are coming." },
  { q: "I'm under 18. Can I use it?", a: "Yes. LevelUp is built for students. For anything involving money, bank accounts or contracts, the Money agent reminds you to involve a parent or guardian." },
];

export function Faq() {
  return <Accordion items={FAQ} />;
}
