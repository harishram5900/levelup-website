# LevelUp: your AI co-founder

LevelUp helps young entrepreneurs go from idea to launch. You pick an AI co-founder character (Pip, Blaze, Sage, Nova or Rocco), describe your startup once in **Startup HQ**, then 12 agents across 4 worlds walk you through each stage and hand you a document you can copy and use.

New agents: **Scout** (competition), **Offer** (Hormozi Value Equation), **Brand**, **Sales** (Core Four), **Content**, **Investor** (fundraising readiness, SAFE basics, investor email). The original six are below.

| Agent | What it gives you |
| --- | --- |
| Idea | One-liner, strengths, biggest risks, tests to run this week |
| Customer | Interview questions, where to find your first 10 users, outreach message |
| Build | Must-have features, what to cut, tools, a 2-week build plan |
| Pitch | One-liner, 30-second pitch, 10-slide deck outline, likely judge questions |
| Money | Pricing, break-even math, funding young founders can get, money basics |
| Launch | Launch checklist, 4-week plan, content ideas, numbers to track |

Also included:

- **Pitch deck builder** (`/app/deck`): one click builds a 10-slide deck from your HQ info and agent answers. Edit any slide, pick a theme (Royal, Tangerine, Paper), present full-screen with arrow keys, or **Download PDF** (browser print, one 16:9 slide per page). Anything LevelUp doesn't know appears as a highlighted [blank]; it never invents numbers.
- **Pip**, the robot co-founder mascot (`components/cofounder/Pip.tsx`), which guides setup and every agent.
- **Game layer** (`lib/cofounder/game.ts`): XP (agent +100, deck +150, goal +25, each active day +10), 7 levels from Dreamer to Legend, a daily streak, 10 badges, a quest map, and confetti for level-ups and badges.
- **Playbooks** (`lib/cofounder/playbooks.ts`): 23 frameworks from people like Alex Hormozi, Bill Gates, Paul Graham, Peter Thiel and Iman Gadzhi, each with its source. Agents show and use them; the AI prompt is grounded in them.
- **Recommendations** (`lib/cofounder/recommend.ts`): the dashboard suggests the next best moves based on the founder's progress.
- **Opportunities** (`lib/cofounder/opportunities.ts`): 60 competitions, hackathons, programs, fellowships, grants, free credits, accelerators and investors, with filters by type and age, plus bookmarks.
- **Tutorial**: a first-run guided tour narrated by the chosen character (`components/cofounder/Tour.tsx`); replay from Settings.
- **Dashboard colors**: 6 palettes, chosen at setup or in Settings.
- **Accounts**: sign up / sign in with Supabase; progress syncs across devices. Without Supabase keys the app runs in guest mode.

## It runs free

- **Guided mode (default, no cost):** with no API key set, every agent builds its plan from your answers using built-in templates. The UI labels it "Guided plan built from your answers."
- **AI mode (optional):** set `ANTHROPIC_API_KEY` and the agents write plans with Claude for your specific startup. The UI labels these "Written by AI." `LEVELUP_MODEL` overrides the model (default `claude-opus-5-5`). If a call fails, the app falls back to guided mode, so it never breaks.

`/api/agent` is rate-limited to 10 runs per IP per 10 minutes. The limit is kept in memory, per server instance.

## Free vs Pro

Pro (`lib/cofounder/plan.ts`): pitch deck designer, Offer, Sales and Investor agents, and the investor list in Opportunities. Everything else is free. The plan is stored in `profiles.plan` in Supabase; users can't edit it (column-level grants). Until payments are added, give someone Pro in Supabase → Table Editor → profiles → `plan = pro`. The upgrade page (`/app/upgrade`) collects a Pro waitlist.

Payments: Stripe Checkout (`/api/stripe/checkout`), billing portal (`/api/stripe/portal`) and a signed webhook (`/api/stripe/webhook`) that is the only thing that sets `plan = pro` / back to `free`. Env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`, `NEXT_PUBLIC_PAYMENTS=on`, `NEXT_PUBLIC_SITE_URL`. Webhook events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.

Note: Pro checks happen in the browser, so a technical user could get around them. When you add payments (e.g. Stripe), also check the plan on the server for anything valuable.

## Accounts and data (Supabase)

1. Create a free project at supabase.com.
2. SQL Editor → paste `supabase/schema.sql` → Run. This creates `profiles` (one row per sign-up), `workspaces` and `waitlist`, all with row-level security.
3. In Vercel → Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Project Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (server only; used for "Delete my account")
4. Redeploy. Sign-ups appear in Supabase → Table Editor → `profiles` (and the `signup_stats` view counts them per day).

Guests: everything is saved in the browser (localStorage key `levelup-hq-v1`). When a guest signs up, their progress moves into the account.

Security: see `SECURITY.md`.

## Run it locally

```bash
cd levelup-agents
npm install
npm run dev        # http://localhost:3000
```

Run `npm run build && npm start` for production and `npm run typecheck` for types only. It needs Node 18.18+.

## Deploy on Vercel

Import the repo and set **Root Directory** to `levelup-agents`. You can optionally add `ANTHROPIC_API_KEY` (and `LEVELUP_MODEL`) under Project Settings → Environment Variables, then redeploy.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing page with a free idea check (`#try`) |
| `/app` | Startup HQ: 3-step setup with Pip, level and XP, quest map, today's quest, goals, trophy case |
| `/app/agents/[id]` | One agent: questions, run, result, copy |
| `/app/deck` | Deck designer: 4 layouts, 8 color themes + custom colors, 4 fonts, logo and photo uploads, present mode, PDF |
| `/app/playbooks` | Frameworks from top founders and investors |
| `/signup`, `/signin`, `/reset` | Accounts (13+), password reset |
| `/privacy`, `/terms` | Plain-language drafts (have them reviewed) |
| `/api/account/delete` | Deletes the signed-in user's account |
| `/app/opportunities` | Competitions and programs |
| `/app/settings` | Theme, start over |
| `/api/agent` | Claude agent endpoint (structured JSON), guided fallback without a key |
| `/api/waitlist` | Stub waitlist endpoint |

## Placeholders to fill before launch

1. **Pricing:** `components/landing/Pricing.tsx`. Student $0, Pro $9 and Schools $3/student are placeholders.
2. **Traction:** `lib/traction.ts`. Shows "50,000+ users across LevelUp products" (founder-provided, includes the earlier LevelUp platform). Keep that wording; it's not the co-founder app's own user count.
3. **Opportunities:** `lib/cofounder/opportunities.ts`. Check each program's deadlines and eligibility on its official site.
4. **Waitlist:** `app/api/waitlist/route.ts` is memory-only on Vercel. Connect a real store.
5. **Logo, footer links and Open Graph image.**
