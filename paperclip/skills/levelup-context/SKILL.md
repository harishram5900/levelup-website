---
name: levelup-context
description: What LevelUp is, who it serves, how the code is laid out and how to run it. Read before any LevelUp work.
---

# LevelUp context

**Product.** An AI co-founder app for founders aged 13-22. Twelve agents produce personalized plans, adapting to the kind of business (app, physical product, food, service, social impact). It has 300+ verified opportunities (competitions, grants, fellowships, hackathons), a weekly Growth check-in, XP, levels, badges, and five talking characters (Pip, Blaze, Sage, Nova, Rocco). Free plan plus LevelUp Pro.

**Users.** Mostly high school and college students, many under 18. Parents and teachers are secondary audiences. Write for a smart 15-year-old.

**Code.** Repository `harishram5900/levelup-website`, app in `levelup-agents/`:
- `app/` Next.js 15 App Router pages and API routes (`app/api/*`, POST-only except `/api/voice`)
- `lib/agents.ts` agent definitions; `lib/cofounder/templates.ts` guided plans; `lib/cofounder/context.ts` business-kind layer
- `lib/cofounder/opportunities.ts` opportunity database; `lib/cofounder/channels.ts` launch sites and communities
- `lib/server/research.ts` live research (App Store, Google Play, HN, GitHub, Devpost, Claude web search for Pro)
- `components/` UI; `app/globals.css` design system (Notebook type, warm neumorphism, 3D icons via `components/ui/Icon3D.tsx`)
- `mobile/` Capacitor shell, store kit and screenshots; `supabase/` SQL migrations

**Commands** (run inside `levelup-agents/`):
- `npm run build`, `npx tsc --noEmit -p .`, `npm run lint`
- `npx vitest run` unit tests; `npm run eval` 8-founder persona evaluation
- `BASE=http://localhost:3000 node scripts/smoke.mjs` device, slow-network and accessibility smoke tests

**Docs.** `docs/STRATEGY.md` (positioning, pricing, growth), `mobile/PLAN.md` (store launch), `RUNBOOK.md` (operations, rollbacks, env vars).

**Deploys.** Production is the Vercel project `levelup-ai-team` (domain levelupinnovations.tech). Never deploy to the old `levelup` project.
