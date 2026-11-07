import { NextResponse } from "next/server";
import { admin, userFrom } from "@/lib/server/billing";
import { keywords, research, type ResearchKind } from "@/lib/server/research";
import { isHardware, kindOf } from "@/lib/cofounder/context";

/**
 * Live research for the agents and the Opportunities page.
 * Free sources run for everyone (rate-limited). Deep web research with Claude runs for Pro users
 * when ANTHROPIC_API_KEY is set. Results are cached in memory for a few hours per query.
 */
export const maxDuration = 120;

const KINDS: ResearchKind[] = ["competitors", "opportunities", "traction"];
const hits = new Map<string, number[]>();
function allowed(key: string, limit: number, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) { hits.set(key, recent); return false; }
  hits.set(key, [...recent, now]);
  return true;
}
const cache = new Map<string, { at: number; data: unknown }>();
const TTL = 6 * 60 * 60 * 1000;
const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const kind = clean(body.kind, 20) as ResearchKind;
  if (!KINDS.includes(kind)) return NextResponse.json({ error: "Unknown kind" }, { status: 400 });

  const p = (body.profile ?? {}) as Record<string, unknown>;
  const idea = clean(p.idea, 300), customer = clean(p.customer, 120), startup = clean(p.startup, 60), stage = clean(p.stage, 20);
  const niche = clean(body.niche, 80);
  const extra = clean(body.extra, 400);
  const query = niche || keywords(`${idea} ${customer}`) || keywords(startup);
  if (!query) return NextResponse.json({ error: "Tell us your niche first" }, { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (!allowed(ip, 20)) return NextResponse.json({ error: "Too many searches. Try again in a few minutes." }, { status: 429 });

  // Deep research is a Pro feature (it costs real money per search).
  let deep = false;
  if (process.env.ANTHROPIC_API_KEY && body.deep !== false) {
    const user = await userFrom(req);
    if (user) {
      const { data: prof } = (await admin()?.from("profiles").select("plan").eq("id", user.id).maybeSingle()) ?? { data: null };
      deep = prof?.plan === "pro" && allowed(`deep:${user.id}`, 8, 60 * 60 * 1000);
    }
  }

  const key = `${kind}|${query.toLowerCase()}|${deep ? "deep" : "free"}|${idea}|${customer}|${extra}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return NextResponse.json(hit.data);

  const context = [
    `Startup: ${startup}`, `Idea: ${idea}`, `Customer: ${customer}`, `Stage: ${stage}`, `Niche: ${query}`,
    clean(body.age, 30) && `Founder age group: ${clean(body.age, 30)}`,
    clean(body.region, 40) && `Country/region: ${clean(body.region, 40)}`,
    extra && `More info: ${extra}`,
  ].filter(Boolean).join("\n");
  const tech = /\b(apps?|software|code|ai|web|platform|saas|tools?|api|bots?|developer|games?)\b/i.test(`${idea} ${query}`);
  const bizKind = kindOf({ idea, startup, customer } as never, { competitor: { niche, alternatives: extra } });
  const named = extra.split(/[,;\n]| and | or /i).map((x) => x.trim()).filter((x) => x.length > 1 && x.length < 40 && /^[A-Z0-9]/.test(x));
  const data = await research(kind, query, `${context}\nBusiness kind: ${bizKind}${bizKind === "app" ? "" : " (competitors are businesses, shops, brands or programs, not only apps; include local and offline alternatives)"}`, { deep, tech: tech || isHardware({ idea, startup } as never), appFirst: bizKind === "app", named });
  if (cache.size > 500) cache.clear();
  cache.set(key, { at: Date.now(), data });
  return NextResponse.json(data);
}
