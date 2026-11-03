# Security

No website is unhackable. LevelUp uses layers, so if one fails the next still protects users.

## What's built in

| Layer | What it does | Where |
| --- | --- | --- |
| Security headers | CSP (only this site + Supabase can load code/data), no framing (clickjacking), HSTS, nosniff, strict referrer, camera/mic/location off | `next.config.ts` |
| App firewall (middleware) | Blocks hacking tools by user agent, scanner paths (`.env`, `.git`, WordPress, PHP…), path traversal, huge URLs; API accepts POST + JSON only, same-origin only (blocks CSRF), max 64 KB bodies, per-IP rate limits | `middleware.ts` |
| Database rules | Row-level security on every table: a user can only read/write their own profile and workspace; the waitlist is insert-only | `supabase/schema.sql` |
| Secrets | Only the public anon key reaches the browser. The service-role key is server-only (account deletion) and checks the user's own token first | `app/api/account/delete/route.ts` |
| Input checks | Length limits on every field, control characters stripped, AI prompt treats founder text as data not instructions, uploads limited to images ≤ 15 MB and re-encoded | `app/api/agent/route.ts`, `SlideView.tsx` |
| Auth | Supabase Auth (hashed passwords, PKCE), password rules, password-reset doesn't reveal which emails exist, 13+ age gate | `app/signup`, `app/signin` |

## Turn on the Vercel Firewall (2 minutes, free)

The firewall API needs it switched on once in the dashboard:

1. Vercel → project **levelup-ai-team** → **Firewall** → enable it.
2. **Bot Protection** (managed rules) → On, action *Challenge*.
3. **Add custom rules:**
   - *Block scanner paths*: Request Path, matches regex `(?i)(/\.(env|git|svn|htaccess)|wp-admin|wp-login|xmlrpc|phpmyadmin|\.php$|cgi-bin)` → **Deny**.
   - *Block attack tools*: User Agent, matches regex `(?i)(sqlmap|nikto|nmap|masscan|zgrab|acunetix|wpscan|gobuster|ffuf|nuclei)` → **Deny**.
   - *Rate limit API*: Request Path starts with `/api/` → **Rate limit** 60 requests / 60 s per IP.
4. Under **Attack Challenge Mode**, remember you can flip it on instantly during an attack.

## Before launch checklist

- Supabase → Authentication → turn **Confirm email** on; set Site URL to your production URL; add `/app` and `/reset` to redirect URLs.
- Supabase → Authentication → enable **leaked password protection** and CAPTCHA (hCaptcha/Turnstile) if bots sign up.
- Never commit `.env*` files. Keep `SUPABASE_SERVICE_ROLE_KEY` only in Vercel env vars.
- Run `npm audit` regularly and keep Next.js updated.
- Have someone review the privacy policy, especially for users under 18.
