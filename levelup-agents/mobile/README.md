# LevelUp mobile app (iOS + Android)

The phone app is a native shell (Capacitor 8) around the live site. Each time the website deploys, the app updates too, with no store review needed. Native features:

- **Streak reminders:** scheduled on the phone, so there's no push server.
- **Haptics:** on level-ups and finished quests.
- **Native share sheet.**
- **In-app browser** for outside links.
- **Splash screen and status bar** that follow the app theme.
- **Android back button.**
- **Offline screen.**
- **Bottom tab bar** on phones.

| What | Where |
|---|---|
| Capacitor config (app id, URL, plugins) | `capacitor.config.ts` |
| Android Studio project | `android/` |
| Xcode project | `ios/` |
| Offline screen | `mobile/www/offline.html` |
| Icon and splash sources | `mobile/assets/` |
| Store screenshots, icons, feature graphic | `mobile/store/` |
| Native features (web side) | `lib/native.ts`, `components/NativeBridge.tsx` |

App id: **`tech.levelupinnovations.app`**. It's permanent once you publish, so change it in `capacitor.config.ts` before your first upload if you want a different one.

---

## 1. Before you submit (do these first)

1. **Run the SQL upgrade `supabase/007_reports_and_blocks.sql`** in Supabase → SQL Editor. It adds report and block to the leaderboard, which Apple requires for apps where people can see each other's names.
2. **Add a support email.** In Vercel → Settings → Environment Variables, add `NEXT_PUBLIC_CONTACT_EMAIL` (e.g. `support@levelupinnovations.tech`) and redeploy. It appears on the Privacy and Delete-account pages, which both stores check.
3. **Pro purchases in the app** are built in (RevenueCat). Inside the native app, Stripe checkout, prices and promo codes are hidden, and Pro is sold through the App Store / Google Play instead. People who paid on the web keep Pro when they sign in. To switch it on:
   1. Run `supabase/008_store_purchases.sql`.
   2. In App Store Connect and Play Console, create a monthly auto-renewing subscription called "LevelUp Pro".
   3. In RevenueCat (free to start), add both apps, create the entitlement **`pro`** and attach both products. Make a "default" offering with a Monthly package.
   4. Add `NEXT_PUBLIC_REVENUECAT_IOS_KEY`, `NEXT_PUBLIC_REVENUECAT_ANDROID_KEY` and `REVENUECAT_WEBHOOK_SECRET` in Vercel.
   5. In RevenueCat → Integrations → Webhooks, set the URL to `https://www.levelupinnovations.tech/api/revenuecat` and the Authorization header to your secret.
   6. Until the keys are set, the Go Pro screen in the app says "Pro in the app is coming soon".
   7. Full timeline and every setting: `mobile/PLAN.md`.
4. **Test on a real phone:**
   - **Android:** install `LevelUp-debug.apk` (sent separately, or build it below).
   - **iPhone:** run from Xcode or use TestFlight.

## 2. Build

You need Node 20+. For Android you need Android Studio. For iOS you need a Mac with Xcode 16+ and CocoaPods.

```bash
npm install
npx cap sync
```

**Android** (Play Store bundle):

```bash
npx cap open android
```

In Android Studio: Build → Generate Signed App Bundle → create an upload keystore (keep it safe) → release → `app-release.aab`.

**iOS:**

```bash
npx cap open ios
```

In Xcode:
1. Select the App target → Signing & Capabilities → choose your Apple Developer team.
2. Product → Archive → Distribute App → App Store Connect.

When you release a new native version, bump `versionCode`/`versionName` in `android/app/build.gradle` and Version/Build in Xcode. Web-only changes don't need a new store build.

## 3. Accounts you need

- **Apple Developer Program:** $99/year, developer.apple.com. Enroll as an organization if you can; it needs a D-U-N-S number. If you're under 18, a parent or guardian has to enroll.
- **Google Play Console:** $25 one-time, play.google.com/console. New personal accounts must run a **closed test with at least 12 testers for 14 days** before production. Start it early. Organization accounts skip this.

---

## 4. Store listing (copy and paste)

**App name:** LevelUp: AI Co-Founder

**Subtitle (iOS, 30 chars):** Build your startup with AI

**Short description (Play, 80 chars):** 12 AI co-founder agents, live competitor research and 300+ competitions & grants.

**Promotional text (iOS):** New: Scout finds your real competitors live and reads their bad reviews, so you know exactly what to build.

**Full description:**

```
LevelUp is the AI co-founder for young entrepreneurs. Turn an idea into a real startup, one quest at a time.

12 AI AGENTS, ONE REAL STARTUP
• Idea: pressure-tests your idea and tells you what to test this week
• Customer: interview scripts and where your first 10 users hang out
• Scout: type your niche and see your real competitors from the App Store, Google Play, Hacker News and GitHub, with ratings and what their users complain about
• Build, Brand, Offer, Pitch, Money, Sales, Content and Investor agents
• Traction: the exact communities and launch sites for your niche, ready-to-post drafts and a 4-week plan

300+ OPPORTUNITIES
Competitions, hackathons, grants, fellowships, scholarships, accelerators, free credits and investors for young founders, ranked for your startup. Plus a live search for hackathons open right now.

PLAYBOOKS FROM THE GREATS
Frameworks from Y Combinator, Paul Graham, Alex Hormozi, Peter Thiel and more, each with one step you can take today.

STAY MOTIVATED
XP, levels, badges, daily streaks, friendly reminders, leaderboards and teams. Pick your co-founder: Pip, Blaze, Sage, Nova or Rocco.

LEVELUP PRO
The AI co-founder chat that remembers your startup, full plans with deep dives, the pitch deck designer and the investor list.

Built for students and young founders (13+). Your data is never sold.
```

**Keywords (iOS, 100 chars):** `startup,entrepreneur,business plan,founder,pitch,ai,student,idea,competition,grant,side hustle`

**Category:** Business (primary), Education (secondary)

**URLs:**
- Privacy policy: https://www.levelupinnovations.tech/privacy
- Account deletion (Play): https://www.levelupinnovations.tech/delete-account
- Support / marketing: https://www.levelupinnovations.tech

**Screenshots:** `mobile/store/ios-6.9/` (1290×2796, iPhone 6.9") and `mobile/store/android-phone/` (1080×2160). Upload in numbered order.

**Icons:**
- `mobile/store/app-store-icon-1024.png`: App Store. iOS adds the rounded corners.
- `mobile/store/play-icon-512.png`: Google Play.

**Play feature graphic:** `mobile/store/play-feature-graphic.jpg` (1024×500).

---

## 5. Privacy answers

These match the current app. Update them if you add analytics or ads.

**Apple App Privacy (nutrition label).** Data **linked to the user**, used only for **App Functionality**, **not used for tracking**:
- Contact Info → Email Address
- Contact Info → Name (first name only)
- User Content → Other User Content (startup details, plans, goals, chats)
- User Content → Photos (only images the user adds to a pitch deck)
- Purchases → Purchase History (only whether they have Pro)

Everything else: **not collected**. Tracking: **No**.

**Google Play Data safety:**
- **Collected:** Email, Name, Other user-generated content, Photos, Purchase history.
  - Purpose: App functionality and Account management.
  - Not shared with third parties for their own use. Service providers (Supabase, Anthropic, Stripe) count as processing, not sharing.
- **Encrypted in transit:** Yes.
- **Users can request deletion:** Yes, in the app (Settings → Delete my account) and at /delete-account.
- **Ads:** No.

**Age rating:**
- **Apple:**
  - No violence, sexual content, gambling or medical content.
  - User-generated content: Yes, with report and block.
  - AI chat: Yes.
  - Unrestricted web access: No.
  - Expected rating: **13+**.
- **Google:**
  - Fill in the IARC questionnaire with the same answers.
  - Target audience: **13-15, 16-17, 18+**. Don't select under 13, or Families policies apply.

**Apple review notes (paste this):**

```
LevelUp is an AI co-founder for young entrepreneurs (13+). Sign up with email, or tap "Continue as guest" to try it without an account.
Native features: daily streak reminders (local notifications), haptic feedback, native share sheet, in-app browser for outside links, offline screen.
Account deletion: More → Settings → Delete my account.
Leaderboard moderation: tap ⋯ next to any founder to report or block. Reports are reviewed by our team.
Pro is an auto-renewing monthly subscription sold through in-app purchase (Go Pro tab under More), with Restore Purchases on the same screen.
Demo account: [add a test email and password with Pro enabled]
```

Create a demo account and set it to Pro in Supabase (profiles → plan = "pro") so the reviewer can see every feature.

---

## 6. Launch checklist

- [ ] SQL 007 and 008 run in Supabase
- [ ] RevenueCat set up (keys + webhook), store subscriptions created
- [ ] `APPLE_TEAM_ID` and `ANDROID_CERT_SHA256` set in Vercel (email links open the app)
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` set in Vercel, redeployed
- [ ] `ANTHROPIC_API_KEY` set in Vercel (AI plans and deep research for Pro)
- [ ] Demo Pro account created for reviewers
- [ ] Tested on a real Android phone (APK) and iPhone (TestFlight)
- [ ] Apple Developer + Play Console accounts
- [ ] Play: closed test with 12+ testers for 14 days (new personal accounts)
- [ ] Signed release builds uploaded (`.aab` to Play, archive to App Store Connect)
- [ ] Listing text, screenshots, icon, privacy answers, age rating filled in
- [ ] Submit for review (Apple usually 1-3 days; Google a few hours to a few days)
