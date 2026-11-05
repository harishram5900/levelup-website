# LevelUp runbook

What to do, and where, when shipping or when something goes wrong.

## Deploys and rollback

- **Every push deploys.** Vercel builds each branch as a preview URL. The production branch goes to https://www.levelupinnovations.tech.
- **Before merging:** CI must be green (GitHub → Actions → CI). It runs typecheck, unit tests, the dependency audit, build, and smoke tests on 4 devices, slow 3G and accessibility.
- **Bad deploy? Roll back in 10 seconds:** Vercel → Project → Deployments → pick the last good one → ⋯ → **Instant Rollback**. Then fix forward on a branch.
- **The phone app loads the live site**, so a web rollback also rolls back the app. Native changes (plugins, icons, permissions) need a new store build.
- **Database changes are forward-only.** Write SQL that is safe to re-run, and add columns instead of renaming them, so a code rollback still works with the newer schema.

## Staging

- **Code:** every branch and PR gets its own Vercel preview URL. Test there before production.
- **Data (recommended before launch):**
  1. Create a second free Supabase project, "levelup-staging", and run the SQL files on it.
  2. In Vercel, set the Supabase variables for the **Preview** environment to the staging project.
  3. Use Stripe **test** keys and RevenueCat sandbox for Preview.
- This way previews never touch real users.

## Monitoring and alerts

| What | How |
|---|---|
| **Uptime** | Add a free monitor (UptimeRobot or Better Stack) for `https://www.levelupinnovations.tech/health` every 5 minutes, with email/SMS alerts. `/health` returns 200 when the app and database are up, 503 when the database is down. |
| **Errors** | App crashes are reported to `/api/log` and appear in Vercel → Logs as `"event":"client_error"`. Server errors appear as `console.error` lines. Check daily during launch week. On Vercel Pro you can add a log drain or alert rule for `client_error`. |
| **Performance** | Vercel → **Speed Insights** (enable it once in the dashboard) shows real-user Core Web Vitals per page. |
| **Analytics** | Vercel → **Analytics** (enable it once). Anonymous, cookieless page views. |
| **AI quality** | Run `scripts/evals/agent-evals.mjs` before each release (see the file for how). |

## Spend caps and billing alerts (set these before launch)

- **Anthropic:**
  1. console.anthropic.com → Settings → Limits: set a **monthly spend limit**, e.g. $50 to start, and email alerts at 50% and 80%.
  2. In the app, AI only runs for Pro users. It's rate-limited: agent 10/10 min per IP, chat per user per hour, deep research 8 per hour per user.
  3. `LEVELUP_MODEL` can switch agents to a cheaper model.
- **Vercel:** Settings → Billing → **Spend Management**: set a cap and notifications.
- **Supabase:** Billing → spend cap ON (the default on Pro).
- **Stripe / RevenueCat:** no spend risk, but turn on payout and dispute emails.

## Backups and restore

- **Automatic:** `.github/workflows/backup.yml` dumps the app data every night, **test-restores it into a scratch database**, encrypts it and keeps it 30 days. Turn it on by adding the GitHub secrets `SUPABASE_DB_URL` and `BACKUP_PASSPHRASE`. Check the run summary shows "Backup restored OK".
- **Supabase Pro** also keeps daily backups (7 days) with one-click restore. Worth it from launch.
- **Restore a nightly backup** (into a new or staging project first, never straight onto production):

```bash
gpg -d levelup-YYYY-MM-DD.dump.gpg > backup.dump
```

```bash
pg_restore --no-owner --clean --if-exists -d "$TARGET_DB_URL" backup.dump
```

- **Practice once before launch:** restore last night's backup into the staging project and sign in.

## Secrets

- Secrets only live in Vercel, Supabase, GitHub Actions secrets and the store consoles. `.env*` files are git-ignored, and the repo history has been scanned clean.
- **If a key leaks** (pasted somewhere, committed, shown in a screenshot): rotate it immediately at the provider, update it in Vercel, redeploy, and then check the provider's usage for abuse.
  - Anthropic: console → API keys → delete and create.
  - Supabase service role: Settings → API → JWT secret roll (this logs everyone out).
  - Stripe: Developers → API keys → roll.
  - RevenueCat webhook: change `REVENUECAT_WEBHOOK_SECRET` and the header together.

## Email

- Auth emails (confirm sign-up, reset password) come from Supabase.
- **Before launch:** set Supabase → Authentication → **SMTP** to Resend with sender `no-reply@levelupinnovations.tech`. Supabase's built-in email only allows a few emails per hour.
- DNS status (checked Nov 2026):
  - SPF and DKIM for the Resend sending domain: ✓
  - Bounce MX: ✓
  - **DMARC added** (`_dmarc`, `p=none`, monitoring only). After a few weeks of clean sending, tighten it to `p=quarantine`.
- Test both flows on a real phone (sign up → confirm email → lands signed in; forgot password → reset → sign in) after every auth change.

## Incident checklist

1. Is it down? Check `/health`, then the Vercel status page and the Supabase status page.
2. Did it start after a deploy? **Instant Rollback** first, investigate second.
3. Check Vercel → Logs for `client_error` and server errors.
4. AI failing? The app falls back to guided plans automatically. Check the Anthropic console for limits and outages.
5. Tell users if it lasts more than 30 minutes (Instagram story or the app's socials).
6. Write down what happened and add a test so it can't happen again.
