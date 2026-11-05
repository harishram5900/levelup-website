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

import { checkinStreak, insights, milestones, primaryMetric, tractionSummary, weekOf, weeklyGrowth } from "@/lib/cofounder/traction";
describe("growth tracker", () => {
  const log = [
    { week: "2026-10-12", conversations: 3, users: 10, revenue: 0 },
    { week: "2026-10-19", conversations: 2, users: 11, revenue: 0 },
    { week: "2026-10-26", conversations: 4, users: 12.1, revenue: 0 },
    { week: "2026-11-02", conversations: 1, users: 13.31, revenue: 0 },
  ];
  it("weeks start on Monday", () => { expect(weekOf(new Date(2026, 10, 5))).toBe("2026-11-02"); expect(weekOf(new Date(2026, 10, 2))).toBe("2026-11-02"); expect(weekOf(new Date(2026, 10, 8))).toBe("2026-11-02"); });
  it("computes compounded weekly growth", () => { expect(Math.round(weeklyGrowth(log, "users")! * 100)).toBe(10); expect(weeklyGrowth([log[0]], "users")).toBeNull(); });
  it("picks revenue once there are two paid weeks", () => {
    const paid = [...log, { week: "2026-11-09", conversations: 0, users: 14, revenue: 5 }];
    expect(primaryMetric(log)).toBe("users");
    expect(primaryMetric(paid)).toBe("users");
    expect(primaryMetric([...paid, { week: "2026-11-16", conversations: 0, users: 15, revenue: 9 }])).toBe("revenue");
  });
  it("counts check-in streaks and milestones", () => {
    expect(checkinStreak(log, new Date(2026, 10, 5))).toBe(4);
    expect(milestones(log).find((m) => m.id === "talk10")!.done).toBe(true);
    expect(milestones(log).find((m) => m.id === "dollar1")!.done).toBe(false);
  });
  it("gives honest insights and an AI summary", () => {
    expect(insights(log, new Date(2026, 10, 5)).join(" ")).toMatch(/10% a week/);
    expect(insights([], new Date())[0]).toMatch(/first week/);
    expect(tractionSummary({ traction: log })).toMatch(/13\.31 users|growing 10% per week/);
  });
});
