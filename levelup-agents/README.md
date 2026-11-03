# LevelUp: your AI co-founder

LevelUp helps young entrepreneurs go from idea to launch. You describe your startup once in **Startup HQ**, then six co-founder agents walk you through each stage and hand you a document you can copy and use.

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
- A weekly goals check-in and a list of competitions and programs for young founders.

## It runs free

- **Guided mode (default, no cost):** with no API key set, every agent builds its plan from your answers using built-in templates. The UI labels it "Guided plan built from your answers."
- **AI mode (optional):** set `ANTHROPIC_API_KEY` and the agents write plans with Claude for your specific startup. The UI labels these "Written by AI." `LEVELUP_MODEL` overrides the model (default `claude-opus-5-5`). If a call fails, the app falls back to guided mode, so it never breaks.

`/api/agent` is rate-limited to 10 runs per IP per 10 minutes. The limit is kept in memory, per server instance.

## Your data

Your startup profile, agent results, answers and goals are saved in your browser's localStorage (key `levelup-hq-v1`). There are no accounts and no server database. Settings → Start over clears everything.

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
| `/app/deck` | Pitch deck builder, present mode, PDF download |
| `/app/opportunities` | Competitions and programs |
| `/app/settings` | Theme, start over |
| `/api/agent` | Claude agent endpoint (structured JSON), guided fallback without a key |
| `/api/waitlist` | Stub waitlist endpoint |

## Placeholders to fill before launch

1. **Pricing:** `components/landing/Pricing.tsx`. Student $0, Pro $9 and Schools $3/student are placeholders.
2. **Traction:** `lib/traction.ts`. The stats strip stays hidden until you add real numbers. Never use estimates.
3. **Opportunities:** `lib/cofounder/opportunities.ts`. Check each program's deadlines and eligibility on its official site.
4. **Waitlist:** `app/api/waitlist/route.ts` is memory-only on Vercel. Connect a real store.
5. **Logo, footer links and Open Graph image.**
