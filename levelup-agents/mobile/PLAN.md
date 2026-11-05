# LevelUp mobile app: plan to launch by December 31, 2026

## Screen map

```
First launch
  Welcome ─┬─ Get started → Setup (5 steps: co-founder · name · idea · customer + stage · colors) → Phone tour (7 steps) → HQ
           └─ I already have an account → Sign in → HQ (progress restored)

Bottom tabs (always visible after setup)
  HQ ............ level ring, XP, streak, today's quest, recommendations, weekly goals, playbook of the day, badges
  Agents ........ 12 agents in 4 worlds, progress bar, done ✓ and Pro 🔒 markers
                    └─ Agent → questions → (live research) → result layout → Pro deep dive → next quest
  Co-founder .... AI chat with memory (Pro), fits between header and tab bar
  Opportunities . 301 verified entries, For you ranking, type/age/region filters, live search, saved
  More .......... Playbooks · Pitch deck (Pro) · Leaderboard (report/block) · Friends & invites · Team
                  · Go Pro (in-app purchase) · Settings (reminders, legal, delete account)
```

## Features in the app

| Area | Status |
|---|---|
| Welcome screen, setup with always-visible buttons, phone tour | Done |
| Bottom tab bar, safe areas (notch and home bar), portrait lock | Done |
| 12 agents, Scout/Traction/Customer with live research | Done |
| Results scroll into view on phones; layouts for every agent | Done |
| AI co-founder chat sized for phones | Done |
| Streak reminders (on-device), haptics, share sheet, in-app browser | Done |
| Splash screen, app icons, status bar, Android back, offline screen | Done |
| Deep links: email confirmation and password reset open in the app | Done (needs `APPLE_TEAM_ID` and `ANDROID_CERT_SHA256`) |
| Pro by in-app purchase (App Store / Google Play via RevenueCat), restore purchases, manage subscription | Done (needs store products + RevenueCat keys) |
| Leaderboard report/block, name filter, Terms with zero-tolerance rule | Done (needs SQL 007) |
| Account deletion in app + public deletion page, privacy policy | Done |

## Timeline

| Dates | Milestone | Who |
|---|---|---|
| Nov 5-9 | Phone layout, onboarding, deep links, in-app purchase code, plan | Claude ✅ |
| **Nov 10-16** | **Open developer accounts now; these take the longest.** Apple ($99/yr; enrollment can take days, and an organization needs a D-U-N-S number, which can take ~2 weeks, so enroll as an individual if that's faster; under 18 needs a parent). Google Play ($25, identity check takes a few days). | You |
| Nov 10-16 | Run SQL 007 + 008, add the Vercel env vars below | You |
| Nov 17-23 | Create the "LevelUp Pro" monthly subscription in App Store Connect and Play Console. Create a RevenueCat project, entitlement `pro`, offering with the monthly package, webhook. Upload first builds: TestFlight + Play internal testing. Test on real phones. | You (Claude can walk you through each screen) |
| **Nov 24 - Dec 8** | **Google Play closed test: 12+ testers for 14 days in a row** (required for new personal accounts). Friends, classmates, LevelUp users. TestFlight beta in parallel. Fix what testers find. | You + Claude |
| Dec 8-12 | Final screenshots and listing. **Submit to Apple by Dec 12**: Apple slows down over the holidays, and late-December reviews can take longer. Apply for Play production access when the 14 days are done. | You |
| Dec 13-22 | Approvals, then release. Announce on social (the 7 videos, the ad). | You |
| Dec 23-31 | Buffer for a rejection fix or a second review. | |

## Settings you need to add (Vercel → Settings → Environment Variables)

| Variable | What it is | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_CONTACT_EMAIL` | Support email shown on Privacy and Delete-account pages | Your choice |
| `ANTHROPIC_API_KEY` | AI plans, chat and deep research (Pro) | console.anthropic.com |
| `NEXT_PUBLIC_REVENUECAT_IOS_KEY` | RevenueCat public Apple SDK key (starts with `appl_`) | RevenueCat → Project → API keys |
| `NEXT_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat public Google SDK key (starts with `goog_`) | RevenueCat → Project → API keys |
| `REVENUECAT_WEBHOOK_SECRET` | Any long random string; paste the same value as the webhook's Authorization header | You make it up |
| `APPLE_TEAM_ID` | 10-character Team ID (for Universal Links) | developer.apple.com → Membership |
| `ANDROID_CERT_SHA256` | App signing key fingerprint (for App Links) | Play Console → Setup → App signing |

The `NEXT_PUBLIC_*` keys are public SDK keys, meant to live in the app. The others are secret: add them only in Vercel, never in chat.
