# LevelUp company for Paperclip

An agent company that builds, grows and runs LevelUp, in the open [Agent Companies](https://github.com/paperclipai/paperclip/blob/master/docs/companies/companies-spec.md) format used by [Paperclip](https://github.com/paperclipai/paperclip). You are the board: agents work in drafts and pull requests, and nothing public, paid or merged happens without your approval.

**Team (11 agents):** CEO → CTO (Engineer, QA, Designer), CMO (Content Creator, Partnerships, Community and Support), Researcher, CFO.

**Skills:** `levelup-context` (product, code, commands), `approval-gates` (what needs your OK), `brand-voice`, `ship-checklist`.

**Projects:** Mobile store launch, Growth engine, Opportunities database, Quality and trust.

**Routines (America/Chicago):** CEO priorities and board report (Mon 9:00), quality run (Mon 8:00), metrics (Mon 8:00), growth experiment (Mon 11:00), content batch (Tue 10:00), opportunities refresh (Wed 10:00), feedback digest (Fri 9:00), competitor watch (1st of the month).

**Starter tasks:** store listing and ASO, release checklist, store screenshots, school club pilot plan, turning on character voices.

## Run it

Paperclip runs on your own computer (Node.js 24+). It needs no separate database.

1. Start Paperclip and finish setup:
   ```sh
   npx paperclipai onboard --yes
   ```
2. Import this company from a local clone of this repository:
   ```sh
   npx paperclipai company import ./paperclip --dry-run
   npx paperclipai company import ./paperclip
   ```
   Or use **Company settings → Import** in the Paperclip web app (http://localhost:3100).
3. Agents use the `claude_local` adapter (Claude Code on your machine). In the import screen, point each agent's workspace at your clone of `levelup-website`.
4. Everything imports **paused**. Review the agents, budgets (about $117 a month in total, adjustable per agent) and routines, then activate them.

Secrets (Anthropic, ElevenLabs, Supabase, Stripe) are never stored in this package. Add them in Paperclip or Vercel yourself.
