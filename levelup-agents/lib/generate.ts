/**
 * Free content-plan generator. Template-based (no AI, no network), so it works today.
 * When the real agents ship, swap `generatePlan` for an API call with the same input/output shape.
 */
import type { Platform } from "@/components/ui/PlatformIcon";

export type Tone = "friendly" | "bold" | "expert" | "funny";
export type PlanInput = { brand: string; niche: string; tone: Tone; platforms: Platform[]; seed?: number };
export type PlanItem = { day: string; platform: Platform; format: string; hook: string; beats: string[]; caption: string; tags: string[] };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Tpl = { format: string; hook: (n: string, b: string) => string; beats: (n: string, b: string) => string[] };

const TEMPLATES: Tpl[] = [
  { format: "Behind the scenes", hook: (n) => `What a normal day in ${n} actually looks like`, beats: (_, b) => ["Open on the first thing you do each morning", `Show 3 quick moments people never see at ${b}`, "End on the finished result and a smile"] },
  { format: "Myth vs. fact", hook: (n) => `The biggest myth about ${n} (and what's true)`, beats: (n) => [`State the myth people believe about ${n}`, "Show why it's wrong with one clear example", "Give the one thing they should do instead"] },
  { format: "Before and after", hook: () => "Watch this go from “meh” to “wow” in 10 seconds", beats: () => ["Show the before for 2 seconds, no talking", "Fast cuts of the work in progress", "Reveal the after, hold for 3 seconds"] },
  { format: "Quick tips", hook: (n) => `3 ${n} tips I wish I knew sooner`, beats: () => ["Tip 1: the easiest win, said in one sentence", "Tip 2: a mistake most people make", "Tip 3: the one that surprises people, then ask which they'll try"] },
  { format: "Customer question", hook: () => "Someone asked us this, and it's a great question", beats: () => ["Show or read the question on screen", "Answer it simply in under 15 seconds", "Invite people to comment their own questions"] },
  { format: "Meet the founder", hook: (_, b) => `Why I started ${b}`, beats: () => ["One sentence on the moment it started", "The hard part nobody saw", "What you're proud of today, then a thank-you"] },
  { format: "Trend remix", hook: (n) => `POV: you finally found a ${n} spot that gets it`, beats: () => ["Use a trending sound that fits your vibe", "Act out the relatable moment", "Cut to your product or service as the payoff"] },
  { format: "Day in numbers", hook: (_, b) => `One day at ${b}, in numbers`, beats: () => ["Count up real moments: cups, orders, smiles, miles", "Keep each number on screen under 2 seconds", "End with “and tomorrow we do it again”"] },
  { format: "Mistake to avoid", hook: (n) => `Stop doing this if you care about ${n}`, beats: () => ["Show the common mistake", "Explain the cost in one line", "Show the better way, step by step"] },
];

const TONE_CAPTION: Record<Tone, (h: string, b: string) => string> = {
  friendly: (h, b) => `${h} 💛 Come say hi at ${b}!`,
  bold: (h, b) => `${h}. ${b} does it differently. Follow for more.`,
  expert: (h, b) => `${h}. Save this for later. From the team at ${b}.`,
  funny: (h, b) => `${h} (we tried our best 😅) · ${b}`,
};

const TONE_OPENER: Record<Tone, string> = {
  friendly: "",
  bold: "Real talk: ",
  expert: "",
  funny: "Okay so… ",
};

/** Small deterministic RNG so the same input + seed gives the same plan. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const hash = (str: string) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function tagify(word: string) {
  return "#" + word.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function generatePlan({ brand, niche, tone, platforms, seed = 0 }: PlanInput): PlanItem[] {
  const b = brand.trim() || "your business";
  const n = niche.trim().toLowerCase() || "small business";
  const plats: Platform[] = platforms.length ? platforms : ["tiktok", "instagram"];
  const rand = rng(hash(b + n + tone) + seed * 7919);
  const pool = [...TEMPLATES].sort(() => rand() - 0.5);
  return DAYS.map((day, i) => {
    const t = pool[i % pool.length];
    // Use the tone opener on every third post only, so it doesn't get repetitive.
    const hook = (i % 3 === 0 ? TONE_OPENER[tone] : "") + t.hook(n, b);
    const nicheTag = tagify(n);
    return {
      day,
      platform: plats[i % plats.length],
      format: t.format,
      hook,
      beats: t.beats(n, b),
      caption: TONE_CAPTION[tone](t.hook(n, b), b),
      tags: [nicheTag, tagify(b), "#smallbusiness", i % 2 ? "#behindthescenes" : "#tips"].filter((v, k, a) => v.length > 1 && a.indexOf(v) === k),
    };
  });
}
