---
name: ship-checklist
description: The checks every code change passes before a pull request is opened. Use for any engineering task.
---

# Ship checklist

1. Work on a feature branch. Never commit to the default branch directly.
2. Keep the change to what the issue asks. Note anything else you noticed as a new issue.
3. In `levelup-agents/` run and paste results into the PR:
   - `npx tsc --noEmit -p .`
   - `npx vitest run`
   - `npm run eval` when you touched agents, templates, matching or research
   - `npm run build`
   - smoke tests against a local server for UI changes (all devices, 0 serious accessibility issues)
4. UI changes: attach phone-width screenshots (Pixel 7 and iPhone SE) in light and dark.
5. Never weaken a test or skip a check to get green. Fix the cause.
6. Security: API routes stay POST-only with auth and rate limits unless there's a reviewed reason; never log secrets or personal data.
7. Open the PR with: what changed, why, how it was tested, screenshots, risks. Ask the CTO for review.
