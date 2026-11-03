/** Email sanity checks used on sign-up. The database hook (supabase/004_real_emails.sql) enforces the same blocklist. */
export const DISPOSABLE = [
  "mailinator.com", "10minutemail.com", "10minutemail.net", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "grr.la",
  "tempmail.com", "temp-mail.org", "temp-mail.io", "tempmail.net", "tempmailo.com", "tempr.email", "throwawaymail.com", "trashmail.com",
  "yopmail.com", "yopmail.net", "getnada.com", "nada.email", "dispostable.com", "maildrop.cc", "mailnesia.com", "mintemail.com",
  "fakeinbox.com", "spamgourmet.com", "mohmal.com", "emailondeck.com", "burnermail.io", "mailcatch.com", "moakt.com", "mytemp.email",
  "inboxkitten.com", "tempinbox.com", "discard.email", "33mail.com", "spambox.us", "trashmail.de", "wegwerfmail.de", "mail.tm", "mailpoof.com",
];
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.co": "gmail.com", "gamil.com": "gmail.com", "gnail.com": "gmail.com", "gmail.con": "gmail.com", "gmal.com": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com", "outlok.com": "outlook.com", "outlook.co": "outlook.com",
  "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com", "yhoo.com": "yahoo.com", "icloud.co": "icloud.com", "iclod.com": "icloud.com",
};
const SHAPE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function checkEmail(raw: string): { ok: boolean; error?: string; suggestion?: string } {
  const email = raw.trim().toLowerCase();
  if (!SHAPE.test(email)) return { ok: false, error: "Please enter a real email address." };
  const domain = email.split("@")[1];
  if (DISPOSABLE.includes(domain)) return { ok: false, error: "Please use your real email. Temporary inboxes aren't allowed." };
  if (TYPOS[domain]) return { ok: false, error: `Did you mean ${email.split("@")[0]}@${TYPOS[domain]}?`, suggestion: `${email.split("@")[0]}@${TYPOS[domain]}` };
  return { ok: true };
}
