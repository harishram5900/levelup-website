# Running the LevelUp agent company (Paperclip)

The `paperclip/` folder is an importable [Paperclip](https://github.com/paperclipai/paperclip) company: 11 agents, 4 projects, 13 tasks and 4 skills. You are the board. Agents work in drafts and pull requests, and nothing public, paid or merged happens without your approval (see `paperclip/skills/approval-gates`).

## 1. Install and start (your own computer)

Paperclip needs **Node.js 24+** and runs as a normal (non-root) user.

```bash
node -v    # must print v24 or higher
```

```bash
npx paperclipai onboard --yes
```

```bash
npx paperclipai company import ./paperclip --dry-run
```

```bash
npx paperclipai company import ./paperclip
```

Run the import from the root of this repository. The app is then at <http://localhost:3100> (the company is at `/LEV/dashboard`). If the server is not running later, start it with `npx paperclipai run`.

> Running as root (some containers)? The embedded Postgres switches to another user and cannot read binaries under `/root`. Run Paperclip as a normal user instead.

## 2. Activate the agents

Everything imports **paused**, so nothing runs or spends money until you resume it.

1. **Check Claude Code works.** Agents use the `claude_local` adapter, which runs the `claude` CLI on your machine with your own login. Run `claude` once in a terminal and make sure you are signed in.
2. **Point each agent at your clone.** Open **Agents → (agent) → Configuration** and set the working directory to your local `levelup-website` folder. Do this at least for CEO, CTO, Engineer, QA, Designer, CMO and Content Creator.
3. **Review budgets.** The package totals about $117 a month ($15 CEO, $15 CTO, $25 Engineer, $10 QA, $8 Designer, $10 CMO, $8 Content Creator, $5 Partnerships, $5 Support, $12 Researcher, $4 CFO). Lower anything you like.
4. **Add secrets in Paperclip, never in an issue.** `ANTHROPIC_API_KEY` is optional if you use your Claude login. `ELEVENLABS_API_KEY` is needed for the voice task, and is added in the Vercel project, not here.
5. **Resume in this order**, one at a time, and watch the first run of each:
   1. **CEO**: reads the goals and creates the weekly plan.
   2. **CTO**, then **Engineer**, **QA**, **Designer**: development and store launch.
   3. **CMO**, then **Content Creator**, **Partnerships**, **Community and Support**: growth and marketing.
   4. **Researcher**: opportunities database and competitor watch.
   5. **CFO**: costs and pricing.
6. **Review the starter tasks** under **Tasks**: store listing and ASO, release checklist, store screenshots, school club pilot plan, character voices.
7. **Routines** (under **Routines**) are already active but only fire when the assigned agent is resumed. Times are America/Chicago: quality run and metrics Mon 08:00, CEO priorities Mon 09:00, growth experiment Mon 11:00, content batch Tue 10:00, opportunities refresh Wed 10:00, feedback digest Fri 09:00, competitor watch on the 1st.

## 3. Day-to-day

- **Dashboard** shows runs, spend and pending approvals.
- **Inbox** is where agents ask for your approval before anything public, paid or merged.
- Review the pull requests agents open on this repository, and merge them yourself.
- Pause an agent at any time from its page.
