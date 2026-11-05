import { describe, expect, it } from "vitest";
import { AGES, OPP_TYPES, OPPORTUNITIES, matchOpportunities, tagsFor } from "@/lib/cofounder/opportunities";

describe("opportunities database", () => {
  it("has 300+ entries with unique ids", () => {
    expect(OPPORTUNITIES.length).toBeGreaterThanOrEqual(300);
    const ids = OPPORTUNITIES.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("every entry is complete and links over https", () => {
    for (const o of OPPORTUNITIES) {
      expect(o.name && o.org && o.what && o.perk, o.id).toBeTruthy();
      expect(o.url, o.id).toMatch(/^https:\/\/[^\s]+$/);
      expect(OPP_TYPES, o.id).toContain(o.type);
      expect(o.stage.length, o.id).toBeGreaterThan(0);
      for (const a of o.ages) expect([...AGES, "Any age"], o.id).toContain(a);
    }
  });
  it("never invents deadlines or prize amounts in copy (those change yearly)", () => {
    for (const o of OPPORTUNITIES) expect(`${o.what} ${o.perk}`, o.id).not.toMatch(/deadline|due (on|by)|\b20\d\d\b/i);
  });
});

describe("matching", () => {
  it("guesses tags from a description", () => {
    expect(tagsFor("an AI tutor app for students")).toEqual(expect.arrayContaining(["ai", "edtech", "tech"]));
    expect(tagsFor("recycling bins for schools")).toContain("climate");
  });
  it("ranks niche-relevant entries first and respects type filters", () => {
    const r = matchOpportunities({ text: "climate startup reducing food waste", stage: "idea", types: ["Competition", "Grant"], limit: 8 });
    expect(r.length).toBe(8);
    expect(r.every((o) => o.type === "Competition" || o.type === "Grant")).toBe(true);
    expect(r.slice(0, 3).some((o) => o.tags.includes("climate"))).toBe(true);
  });
  it("hides programs a middle schooler can't join", () => {
    const r = matchOpportunities({ text: "coding app", age: "Middle school", limit: 50 });
    expect(r.every((o) => o.ages.includes("Middle school") || o.ages.includes("Any age"))).toBe(true);
  });
});
