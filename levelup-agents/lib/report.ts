"use client";
/**
 * Client error tracking: sends crashes to /api/log (shows up in Vercel logs as "client_error").
 * No personal data: message, stack, page path and app version only. Capped per page load.
 */
let sent = 0;
const seen = new Set<string>();
export function reportError(err: unknown, where = "client") {
  try {
    if (sent >= 5) return;
    const e = err instanceof Error ? err : new Error(String(err));
    const key = `${e.message}|${where}`;
    if (seen.has(key)) return;
    seen.add(key); sent++;
    const body = JSON.stringify({ message: e.message.slice(0, 500), stack: (e.stack ?? "").slice(0, 2000), where, path: location.pathname, native: document.documentElement.classList.contains("native") });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/log", new Blob([body], { type: "application/json" }));
    else fetch("/api/log", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch { /* never throw from the error reporter */ }
}

/** Catches errors React boundaries don't see (event handlers, async code). */
export function installGlobalErrorHandlers() {
  if (typeof window === "undefined" || (window as unknown as { __luErr?: boolean }).__luErr) return;
  (window as unknown as { __luErr?: boolean }).__luErr = true;
  window.addEventListener("error", (e) => { if (e.error) reportError(e.error, "window.error"); });
  window.addEventListener("unhandledrejection", (e) => reportError(e.reason, "unhandledrejection"));
}
