/**
 * Everything the characters can say out loud. Lines are fixed (not free text) so each one is
 * generated once, cached by the CDN forever and can't be abused to burn voice credits.
 */
import { AGENTS, type AgentId } from "../agents";

export type CharacterId = "pip" | "blaze" | "sage" | "nova" | "rocco";
export type LineId = "intro" | "hello" | "cheer" | "levelup" | "badge" | "streak" | `agent-${AgentId}`;

const BASE: Record<CharacterId, Record<"intro" | "hello" | "cheer" | "levelup" | "badge" | "streak", string>> = {
  pip: {
    intro: "Hi, I'm Pip, the builder. I turn big ideas into small next steps. Let's build it, together.",
    hello: "Hey! Good to see you. One small step today and we're moving.",
    cheer: "Nice work. That's one more brick in the wall.",
    levelup: "Level up! Your startup just got stronger.",
    badge: "New badge unlocked. I knew you could do it.",
    streak: "You're on a streak. Keep the engine running.",
  },
  blaze: {
    intro: "Yo! I'm Blaze, your hype coach. I'm here to make you ship faster than anyone. Ship it today!",
    hello: "Let's go! What are we shipping today?",
    cheer: "Boom! That's how founders move!",
    levelup: "Level up! You're on fire right now!",
    badge: "Badge unlocked! Put that on the wall!",
    streak: "Streak's alive! Don't you dare stop now!",
  },
  sage: {
    intro: "Hello. I'm Sage, your strategist. I'll ask the hard questions investors will ask, before they do. Let's think it through.",
    hello: "Welcome back. What's the most important question today?",
    cheer: "Well done. Thoughtful work compounds.",
    levelup: "You've reached a new level. Wisdom earned, not given.",
    badge: "A new badge. Proof of real progress.",
    streak: "Consistency is the quiet superpower. You have it.",
  },
  nova: {
    intro: "Hey there, I'm Nova, the explorer. I hunt down competitions, grants and opportunities for you. New opportunity spotted!",
    hello: "Hi! I found new things to explore today.",
    cheer: "Yes! Mission complete.",
    levelup: "Level up! New worlds unlocked.",
    badge: "Ooh, a shiny new badge!",
    streak: "Another day, another discovery. Nice streak.",
  },
  rocco: {
    intro: "What's up, I'm Rocco, the hustler. I live for sales and money, and I'll help you get paid. Let's close a deal.",
    hello: "Hey boss. Who are we selling to today?",
    cheer: "That's money. Nice.",
    levelup: "Level up. Now we're talking business.",
    badge: "New badge. That's street cred right there.",
    streak: "Streak's still going. Hustle pays.",
  },
};

/** The text for a line, or null if the line doesn't exist. */
export function lineText(c: CharacterId, id: string): string | null {
  const set = BASE[c];
  if (!set) return null;
  if (id in set) return set[id as keyof typeof set];
  const m = id.match(/^agent-(\w+)$/);
  const a = m && AGENTS.find((x) => x.id === m[1]);
  if (!a) return null;
  const who = c === "pip" ? "" : c === "blaze" ? "Let's go! " : c === "sage" ? "" : c === "nova" ? "Ooh! " : "Alright. ";
  return `${who}This is the ${a.name} agent. ${a.line} Answer a few questions and I'll make you a plan.`;
}
