/**
 * Structured logging: one JSON line per event, so Vercel Logs (and any log drain or alert)
 * can filter by "event". Never log secrets, tokens, emails or startup content.
 */
export function log(level: "info" | "warn" | "error", event: string, data: Record<string, unknown> = {}) {
  const line = JSON.stringify({ level, event, at: new Date().toISOString(), ...data });
  if (level === "error") console.error(line); else if (level === "warn") console.warn(line); else console.log(line);
}
