import { describe, expect, it } from "vitest";
import { keywords } from "@/lib/server/research";
import { streakOf } from "@/lib/cofounder/game";
import { cleanName } from "@/lib/cofounder/social";

describe("research keywords", () => {
  it("drops filler words and keeps the niche", () => {
    expect(keywords("An app that helps students practice public speaking")).toBe("students practice public speaking");
    expect(keywords("")).toBe("");
  });
});

describe("streaks", () => {
  it("counts consecutive days ending today or yesterday", () => {
    expect(streakOf(["2026-11-03", "2026-11-04", "2026-11-05"], "2026-11-05")).toBe(3);
    expect(streakOf(["2026-11-01", "2026-11-04"], "2026-11-05")).toBe(1);
    expect(streakOf(["2026-10-01"], "2026-11-05")).toBe(0);
  });
});

describe("leaderboard name filter", () => {
  it("masks offensive words but leaves normal names alone", () => {
    for (const ok of ["Shitake Mushrooms", "Dickens Books", "Sextant Labs", "Rapeseed Farms", "Scunthorpe FC", "Cocktail Club", "Bassett"]) expect(cleanName(ok)).toBe(ok);
    expect(cleanName("shit startup")).not.toContain("shit");
    expect(cleanName("fuck this")).not.toContain("fuck");
    expect(cleanName("Maya")).toBe("Maya");
    expect(cleanName("Sussex Bakery")).toBe("Sussex Bakery");
    expect(cleanName(null)).toBe("");
  });
});
