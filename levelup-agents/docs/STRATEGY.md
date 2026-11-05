# LevelUp strategy: how we win (Nov 2026)

## The market today

| Category | Examples | Price | What they do | Where they fall short for young founders |
|---|---|---|---|---|
| AI business-plan writers | LivePlan, IdeaBuddy, Upmetrics, Venturekit | ~$6–40/mo | Generate plans, financials, pitch documents | Built for adults with a small business. They output **documents**, not progress. No habit, no coaching, nothing for a 16-year-old. |
| AI "co-founder" tools | aicofounder.com (formerly Buildpad), ValidatorAI | ~$0–25/mo | Phased idea → product guidance, idea scoring | General founders, desktop-first. Free tiers stop after early phases. Simulated users instead of real ones. |
| Teen entrepreneurship games | FamBiz, Venture Valley, The StartUp Game | Free / school licences | Simulated companies, classroom play | **Fake companies.** Nothing carries over to a real startup. |
| Programs | YC Startup School, LaunchX, Diamond Challenge | Free–$$$ | Courses, cohorts, competitions | Seasonal, not daily, and they don't do the work with you. |

These sources are mostly vendor and affiliate pages, and prices change often. Treat the ranges as directional.

**The gap:** nobody gives a young founder a **daily, game-like co-founder that does the work with them on their real startup** and measures real progress.

## Positioning

> **LevelUp is the AI co-founder for young founders: 12 agents that do the work with you, real research on your market, and a daily habit that turns an idea into users and revenue.**

Our moats, in the order a user feels them:

1. **It does the work.** Scout finds your real competitors and reads their bad reviews. Traction finds the exact communities and writes the posts. Opportunities matches 300+ competitions and grants. Competitors give templates.
2. **It measures real progress.** The Growth tracker logs customer talks, users and revenue weekly and computes growth rate, the number YC asks about first. Every agent plans around those real numbers.
3. **It's a habit.** XP, streaks, weekly check-ins, reminders, characters. Duolingo-style retention, applied to a real startup instead of a simulation.
4. **It's built for 13–22.** Plain language, parent/guardian guidance, youth-specific opportunities, safe social features.

## Pricing (recommendation)

- **Free:** the 6 core agents, Growth tracker, opportunities, playbooks. Generous on purpose: free users bring friends.
- **Pro: $9/month or $59/year** (show "$4.92/mo, save 45%"), with a **7-day free trial on the annual plan only**.
  - Subscription benchmarks suggest trials on annual plans lift direct purchases.
  - Offer two plans, never more; more choices lower conversion.
  - Apple requires clear trial length, post-trial price and auto-renew terms, and the store screen already shows them.
- **Paywall moments:**
  1. Right after the first plan is delivered (the value moment).
  2. When opening a Pro agent.
  3. When asking the co-founder.
  4. Never before the user has seen value.
- **Later:** a **Club / Classroom plan** (teachers, DECA/FBLA chapters, school clubs). One buyer, 20–40 users. Schools buy, students spread it.

To do: create the annual price in Stripe and the store products (App Store / Play), then add `STRIPE_PRICE_ID_PRO_YEARLY`.

## Growth engine

1. **Content:** the 7 videos and founder-face scripts. Every agent result is screenshot-worthy, so add a "Share my scorecard" image next.
2. **Referrals:** +50 XP per friend already exists. Next: "Invite your co-founder" so teams join together.
3. **Competitions as a channel:** Diamond Challenge, DECA, FBLA and hackathon participants need exactly this. Sponsor or partner, and offer "Pitch prep with LevelUp".
4. **Schools and clubs:** a teacher dashboard (Club plan) turns one sale into a classroom.
5. **App stores:** good screenshots, keywords and ratings prompts after a win (finishing an agent, hitting a milestone).

## Metrics that matter

| Metric | Definition | Target |
|---|---|---|
| Activation | % of new users who finish their first agent on day 1 | 60%+ |
| Weekly active founders | Users who did something meaningful this week | Up 5–7% week over week (YC "good") |
| Check-in rate | % of weekly actives who log Growth numbers | 40%+ |
| D7 / D30 retention | Came back on day 7 / day 30 | 35% / 20% |
| Trial → paid | Annual trials that convert | 30%+ |
| Free → paid | Over 30 days | 3–5% |

## Next 8 weeks (to launch by Dec 31)

1. Launch on Play and the App Store with in-app purchase (see `mobile/PLAN.md`).
2. Annual plan + trial; paywall after first plan.
3. Shareable result cards (Idea scorecard, Growth chart): the viral loop.
4. Ratings prompt after milestones; streak reminders already on.
5. Club plan pilot with 2–3 school clubs or DECA chapters (manual onboarding is fine).
6. Weekly review of the metrics above. Kill what doesn't move them.

### Sources
- [Best AI Co-Founder Platforms 2026 (BigIdeasDB)](https://bigideasdb.com/best-ai-cofounder-platforms-2026)
- [I Spent 15+ Hours Testing AI Business Plan Writers (LivePlan blog)](https://www.liveplan.com/blog/planning/ai-business-plan-writing-tools-ranked)
- [8 Best AI Business Plan Generators for 2026 (fast.io)](https://fast.io/resources/best-ai-business-plan-generators-2026/)
- [Buildpad review 2026 (AI Indigo)](https://aiindigo.com/blog/building-with-certainty-a-thorough-review-of-buildpad-in-2026)
- [Buildpad pricing (Toolradar)](https://toolradar.com/tools/buildpad/pricing)
- [FamBiz simulation for grades 7–12 (THE Journal)](https://thejournal.com/articles/2024/03/21/fambiz-entrepreneurship-simulation-game-released-for-grade-7-12-students.aspx)
- [What does a high-performing paywall look like in 2026? (Adapty)](https://adapty.io/blog/high-performing-paywall-2026/)
- [Mobile App Paywall Conversion Benchmarks 2026 (Strataigize)](https://www.strataigize.com/insights/paywall-conversion-benchmarks-2026/)
- [Common iOS paywall rejections (RevenueFlo)](https://revenueflo.com/blog/common-ios-paywall-rejections-and-the-fixes-that-work)
