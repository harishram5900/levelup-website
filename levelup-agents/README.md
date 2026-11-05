# LevelUp: your AI co-founder

LevelUp helps young founders (13+) go from an idea to a real startup. You pick an AI co-founder (Pip, Blaze, Sage, Nova or Rocco) and set up your **Startup HQ** once. Then 12 agents across 4 worlds hand you plans you can use. It runs on the web (https://www.levelupinnovations.tech) and as an iOS/Android app (see `mobile/`).

## What's in it

| Area | Where |
|---|---|
| 12 agents (Idea, Customer, **Scout**, Offer, Build, Brand, Pitch, Money, Sales, **Traction**, Content, Investor) | `lib/agents.ts`, UI `components/cofounder/AgentRunner.tsx` + `AgentLayouts.tsx` |
| Guided plans (no AI needed; also the fallback when the AI is down) | `lib/cofounder/templates.ts`, Pro deep dives `lib/cofounder/proExtras.ts` |
| AI plans + AI co-founder chat (Claude) | `app/api/agent`, `app/api/chat` |
| Live research: App Store (+ 1-2★ reviews), Google Play, Hacker News, GitHub, Reddit, Devpost, Claude web search (Pro) | `lib/server/research.ts`, `app/api/research` |
| 301 verified opportunities (competitions, hackathons, grants, fellowships, scholarships, credits, accelerators, investors) | `lib/cofounder/opportunities.ts`, page `app/app/opportunities` |
| Launch sites + communities for Traction | `lib/cofounder/channels.ts` |
| Game layer: XP, levels, streaks, badges, quests | `lib/cofounder/game.ts`, `components/cofounder/Celebrate.tsx` |
| Accounts + sync (Supabase), friends, teams, leaderboard (report/block) | `lib/supabase.ts`, `lib/cofounder/social.ts`, `components/cofounder/AuthSync.tsx`, `supabase/*.sql` |
| Payments: Stripe on the web, App Store / Google Play in the app (RevenueCat) | `app/api/stripe/*`, `lib/iap.ts`, `app/api/revenuecat` |
| Native app shell (Capacitor): reminders, haptics, share, deep links | `capacitor.config.ts`, `lib/native.ts`, `components/NativeBridge.tsx`, `android/`, `ios/` |
| Error pages, crash reports, health check | `app/not-found.tsx`, `app/error.tsx`, `lib/report.ts`, `app/api/log`, `app/health` |
| SEO/AEO | `app/sitemap.ts`, `app/robots.ts`, `components/landing/StructuredData.tsx`, `app/opengraph-image.png` |
| Security (firewall, CSP, rate limits) | `middleware.ts`, `next.config.ts`, `SECURITY.md` |

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional for a local guest-mode run
npm run dev                  # http://localhost:3000
```

Without any keys the app runs in **guest mode with guided plans**: no accounts, no AI, $0.

## Check it

```bash
npm run typecheck
npm test                                   # unit tests (vitest): data integrity, matching, every agent's guided plan, math, filters
npm run build && npm start &
BASE=http://localhost:3000 npm run smoke   # every page × 4 devices, first-launch flow, slow 3G, accessibility (axe)
```

AI evals (prompt injection, made-up facts, math) run against a deployment and cost a few cents. See the top of `scripts/evals/agent-evals.mjs`.

CI (`.github/workflows/ci.yml`) runs typecheck, unit tests, the dependency audit, build and smoke on every push. Vercel deploys every push: a preview URL per branch, and production from the production branch.

## Environment variables

Set these in Vercel → Settings → Environment Variables. **Never commit them or paste them in chat.**

| Variable | Needed for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Accounts, sync, leaderboard, account deletion |
| `ANTHROPIC_API_KEY` (`LEVELUP_MODEL` optional) | AI plans, chat, deep research (Pro only) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`, `NEXT_PUBLIC_PAYMENTS=on` | Web payments |
| `NEXT_PUBLIC_REVENUECAT_IOS_KEY`, `NEXT_PUBLIC_REVENUECAT_ANDROID_KEY`, `REVENUECAT_WEBHOOK_SECRET` | In-app purchases |
| `APPLE_TEAM_ID`, `ANDROID_CERT_SHA256` | Email links open the app |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact on Privacy / Delete-account pages |

## Database

Run the SQL files in `supabase/` in order in Supabase → SQL Editor (all are safe to re-run): `schema.sql`, then `002` through `008`. Pro can be given manually: Table Editor → profiles → `plan = pro`. Never commit real promo codes.

## Operations

See **`RUNBOOK.md`**: deploys, rollback, staging, monitoring and alerts, backups and restore, spend caps, rotating keys, and incident steps. The mobile launch plan is in `mobile/PLAN.md` and `mobile/README.md`.
