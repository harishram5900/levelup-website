# LevelUp: your AI marketing team

A website and demo web app for **LevelUp**, a team of six AI agents (Research, Script, Edit, Review, Publish, Optimize) that runs a small business's short-video marketing end to end.

It also ships one feature that **works today with no backend**: a free content-plan generator. Visitors describe their business and get a week of post ideas with hooks, shot lists and captions. It's the hook that brings people to the site and onto the waitlist before the agents launch.

## Run it locally

```bash
cd levelup-agents
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Type check only: `npm run typecheck`

Requires Node 18.18+ (tested on Node 22).

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project** and import the repo.
3. Set **Root Directory** to `levelup-agents` (this app lives in a subfolder of the repo).
4. Framework preset: **Next.js** (auto-detected). No environment variables are needed yet.
5. Deploy.

Note: on Vercel the filesystem is read-only, so the stub waitlist endpoint can't write to `data/waitlist.json` there. It falls back to memory and emails are lost on redeploy. Connect a real store before launch (see below).

## What's in it

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, platform marquee, animated agent pipeline, agent cards, product showcase, free plan tool, agency comparison, Nurture Flow teaser, pricing, FAQ, waitlist |
| `/app` | Dashboard: KPI cards, performance chart, live-looking agent activity feed |
| `/app/agents` | Status card for each agent with pause/resume toggles and latest output |
| `/app/calendar` | Week view with drag-and-drop posts (mouse, touch and keyboard) |
| `/app/create` | Brand setup wizard that ends with a generated first-week plan |
| `/app/nurture` | Locked "Coming soon" preview with a notify button |
| `/app/settings` | Theme, connected platforms (mock), approval setting |
| `/api/waitlist` | Stub endpoint that validates and stores emails |

## Project structure

```
app/                  routes (App Router), globals.css, template.tsx (page transitions)
components/ui/        Section, GlassCard, GradientButton/ButtonLink, Reveal, CountUp, Magnetic,
                      Switch, Accordion, Badge, Skeleton, ThemeToggle, Logo, PlatformIcon
components/landing/   landing page sections (Hero, Pipeline + AgentNode, Pricing, ...)
components/app/       app shell and app widgets
lib/motion.ts         the one shared motion config (easing, durations, springs, variants)
lib/agents.ts         the six agents
lib/generate.ts       free content-plan generator (template-based)
lib/traction.ts       where REAL numbers and testimonials go
lib/mock/             all sample data
```

Design tokens are CSS variables in `app/globals.css` (dark by default, light mode via the toggle). All animation respects `prefers-reduced-motion`.

## Everything that's mocked

- **All dashboard numbers, charts and activity:** `lib/mock/kpis.ts`, `performance.ts`, `activity.ts`. Labeled "Sample data" in the UI.
- **Agent status and outputs:** `lib/mock/agentStatus.ts`. Toggles only change local state.
- **Content calendar posts:** `lib/mock/calendar.ts`. Changes aren't saved.
- **Platform connections** in Settings and the wizard (TikTok, Instagram, YouTube, Facebook). Nothing connects to a real account.
- **The agents themselves.** Nothing is researched, edited or posted yet.
- **The free plan generator** (`lib/generate.ts`) is real but template-based, not AI. Swap `generatePlan` for an API call with the same input/output shape when the agents are ready.
- **The waitlist** (`app/api/waitlist/route.ts`) writes to `data/waitlist.json` locally (git-ignored).
- **Nurture Flow** is a "Coming soon" preview. The notify button only changes local state.
- **The account avatar ("SC")** in the app top bar.

## Placeholders to fill with real information

1. **Traction numbers:** `lib/traction.ts`. Set real values (waitlist count, posts published, hours saved). The stats strip on the landing page only appears once a value is set. Never put estimates here.
2. **Testimonials:** `lib/traction.ts → TESTIMONIALS`. Only real quotes, with permission.
3. **Pricing:** `components/landing/Pricing.tsx`. Starter $29 and Scale from $499 come from the brief. **Growth at $99 is a placeholder**; set your real price. Update the FAQ answer about cost if it changes.
4. **Waitlist storage:** replace the stub in `app/api/waitlist/route.ts` with a real store (a database, Resend audience, Airtable, etc.).
5. **Nurture Flow "Notify me"** in `app/app/nurture/page.tsx`: wire it to the same waitlist store.
6. **Footer and metadata:** `components/landing/Footer.tsx` (add social links and a contact email) and `app/layout.tsx` (title and description; add an Open Graph image).
7. **Logo:** `components/ui/Logo.tsx` and `app/icon.svg` use a placeholder mark. Swap in your real logo.
8. **Platform icons** in `components/ui/PlatformIcon.tsx` are simple generic glyphs, not official logos. Check each platform's brand guidelines before using official marks.

## Quality checks run

- Production build passes with no type errors.
- No console errors or horizontal overflow on any route at 375px, 768px and 1440px.
- Lighthouse (mobile, production build): landing page 90 / 100 / 100 / 100 (performance / accessibility / best practices / SEO), dashboard 86 / 100 / 100 / 100.
- Tested by hand in a headless browser: the free plan tool, waitlist signup, calendar drag-and-drop, agent toggles and the full Create wizard.
