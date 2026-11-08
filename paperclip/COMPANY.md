---
schema: agentcompanies/v1
kind: company
slug: levelup
name: LevelUp
description: AI co-founder app for young founders (13-22). The agent team that builds, grows and runs it, with Harish as the board.
version: 0.1.0
license: MIT
authors:
  - name: Harish Ramasubramanian
homepage: https://www.levelupinnovations.tech
tags:
  - startup
  - consumer
  - edtech
goals:
  - Launch the LevelUp mobile app on the App Store and Google Play by December 31
  - Grow to 1,000 weekly active founders with 5% week-over-week growth
  - Reach the first 100 paying LevelUp Pro subscribers
  - Keep the app fast, safe for teens and honest in every claim
requirements:
  secrets:
    - ANTHROPIC_API_KEY
---

# LevelUp

LevelUp is an AI co-founder for young founders. Twelve agents (Idea, Customer, Scout, Offer, Build, Brand, Pitch, Money, Sales, Traction, Content, Investor) turn a founder's idea into a plan, matched to 300+ real competitions, grants and programs, with weekly growth tracking, characters that talk, and game-style progress.

- Web: https://www.levelupinnovations.tech
- Code: `levelup-agents/` in the `harishram5900/levelup-website` repository (Next.js 15, Supabase, Stripe, RevenueCat, Capacitor for iOS and Android)
- Strategy: `levelup-agents/docs/STRATEGY.md`, mobile plan: `levelup-agents/mobile/PLAN.md`, operations: `levelup-agents/RUNBOOK.md`

## How this company works

Harish is the board. The CEO turns the goals above into a weekly plan, assigns work, and reports every Monday. Every agent works in drafts and pull requests: nothing is published, sent, bought or merged without board approval (see the `approval-gates` skill).

## Org chart

- CEO (reports to the board)
  - CTO: engineering lead
    - Engineer: web and mobile features
    - QA: tests, persona evals, release checks
    - Designer: UI and store assets
  - CMO: growth and marketing lead
    - Content Creator: short videos, posts, blog and SEO
    - Partnerships: schools, clubs and youth programs
    - Community and Support: user feedback and replies
  - Researcher: opportunities database and competitor watch
  - CFO: costs, pricing and revenue metrics
