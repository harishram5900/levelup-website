import { describe, expect, it } from "vitest";
import { AGENTS } from "@/lib/agents";
import { guided } from "@/lib/cofounder/templates";
import type { Research } from "@/lib/server/research";
import type { Profile } from "@/lib/cofounder/profile";

const P: Profile = { founder: "Maya", startup: "Voca", idea: "helps students practice public speaking", customer: "high school students", stage: "building" };
const R: Research = {
  kind: "competitors", query: "public speaking", sources: ["App Store"], ai: false, at: 0, web: [], hackathons: [], discussions: [], communities: [],
  competitors: [{ name: "Speeko: AI for Public Speaking", url: "https://apps.apple.com/us/app/speeko/id1", source: "App Store", rating: 4.7, reviews: 4759, price: "Free" }],
  complaints: [{ app: "Speeko", stars: 1, text: "Charged me after the trial and I can't cancel the subscription", url: "https://apps.apple.com/x" }, { app: "Speeko", stars: 2, text: "App keeps crashing when I record", url: "https://apps.apple.com/x" }],
};

describe("guided plans (used whenever the AI is unavailable)", () => {
  it("every agent returns its sections, with no empty or 'undefined' text, even with no answers", () => {
    for (const a of AGENTS) {
      const out = guided(a.id, P, {});
      expect(out.length, a.id).toBeGreaterThanOrEqual(a.sections.length > 4 ? 4 : a.sections.length);
      for (const s of out) {
        expect(s.title, a.id).toBeTruthy();
        for (const it of s.items) { expect(it, `${a.id}/${s.title}`).not.toMatch(/undefined|null|NaN|\[object/); }
      }
    }
  });
  it("Scout uses real research: names the competitor and turns complaints into gaps", () => {
    const out = guided("competitor", P, { niche: "public speaking", different: "Live AI audience that talks back" }, R);
    const text = JSON.stringify(out);
    expect(text).toContain("Speeko");
    expect(text).toContain("4.7★");
    expect(out.find((s) => s.title === "Gaps you can own")!.items[0]).toMatch(/pricing/i);
  });
  it("positioning line reads as a sentence whatever the founder typed", () => {
    const line = guided("competitor", P, { different: "Live AI audience that talks back" }, R).find((s) => s.title === "Your positioning line")!.items[0];
    expect(line).toMatch(/^For high school students who are tired of .+, Voca helps students practice public speaking\. What makes it different: live AI audience that talks back\.$/);
    const line2 = guided("competitor", { ...P, idea: "an app for speech practice" }, {}).find((s) => s.title === "Your positioning line")!.items[0];
    expect(line2).toContain("Voca is an app for speech practice.");
  });
  it("Money does correct break-even math", () => {
    const out = guided("money", P, { price: "$8", costs: "40" });
    expect(out.find((s) => s.title === "Break-even math")!.items[0]).toContain("= 5 paying customers");
  });
  it("Traction includes launch sites and copyable drafts with the founder's link", () => {
    const out = guided("launch", P, { link: "voca.app", channels: "TikTok" });
    expect(out.find((s) => s.title === "Launch sites for you")!.items.length).toBeGreaterThan(3);
    expect(JSON.stringify(out.find((s) => s.title === "Ready-to-post drafts"))).toContain("voca.app");
  });
});
