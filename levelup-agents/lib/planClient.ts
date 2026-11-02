import { generatePlan, type PlanInput, type PlanItem } from "./generate";

export type PlanResult = { plan: PlanItem[]; source: "ai" | "template" };

/** Ask the AI route for a plan; fall back to the built-in templates if it's unavailable. */
export async function fetchPlan(input: PlanInput): Promise<PlanResult> {
  try {
    const res = await fetch("/api/plan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
    const data = await res.json();
    if (data?.source === "ai" && Array.isArray(data.plan) && data.plan.length === 7) return { plan: data.plan, source: "ai" };
  } catch { /* network error: use templates */ }
  return { plan: generatePlan(input), source: "template" };
}
