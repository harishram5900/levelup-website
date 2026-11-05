"use client";
/**
 * Native app features (iOS and Android via Capacitor). Every function is safe to call on the web:
 * it does nothing, or uses the web fallback, when the app isn't running inside the native shell.
 */
import { Capacitor } from "@capacitor/core";

export const isNative = () => typeof window !== "undefined" && Capacitor.isNativePlatform();
export const platform = () => (typeof window === "undefined" ? "web" : Capacitor.getPlatform()) as "ios" | "android" | "web";

/** Light tap, success buzz or warning, for XP, level-ups and important buttons. */
export async function haptic(kind: "tap" | "success" | "warning" = "tap") {
  if (!isNative()) return;
  try {
    const { Haptics, ImpactStyle, NotificationType } = await import("@capacitor/haptics");
    if (kind === "tap") await Haptics.impact({ style: ImpactStyle.Light });
    else await Haptics.notification({ type: kind === "success" ? NotificationType.Success : NotificationType.Warning });
  } catch { /* not available */ }
}

/** Native share sheet; falls back to the Web Share API, then to copying the link. Returns how it shared. */
export async function share(opts: { title: string; text: string; url?: string }): Promise<"shared" | "copied" | "failed"> {
  try {
    if (isNative()) {
      const { Share } = await import("@capacitor/share");
      await Share.share({ title: opts.title, text: opts.text, url: opts.url, dialogTitle: opts.title });
      return "shared";
    }
    if (typeof navigator !== "undefined" && navigator.share) { await navigator.share(opts); return "shared"; }
    await navigator.clipboard.writeText([opts.text, opts.url].filter(Boolean).join(" "));
    return "copied";
  } catch {
    return "failed";
  }
}

/** Opens an outside link in the in-app browser (native) or a new tab (web). */
export async function openExternal(url: string) {
  if (isNative()) {
    try { const { Browser } = await import("@capacitor/browser"); await Browser.open({ url, presentationStyle: "popover" }); return; } catch { /* fall through */ }
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

const STREAK_ID = 1001, COMEBACK_ID = 1002;
const at = (daysAhead: number, hour: number) => { const d = new Date(); d.setDate(d.getDate() + daysAhead); d.setHours(hour, 0, 0, 0); return d; };

/**
 * Streak reminders, scheduled on the phone (no server, no tracking):
 * tomorrow at 7pm if they haven't shown up yet, and a gentle nudge after 3 quiet days.
 * Rescheduled every time the founder opens the app, so active founders never get nagged.
 */
export async function scheduleReminders(opts: { name: string; streak: number; buddy: string; ask: boolean }) {
  if (!isNative()) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    let perm = await LocalNotifications.checkPermissions();
    if (perm.display === "prompt" && opts.ask) perm = await LocalNotifications.requestPermissions();
    if (perm.display !== "granted") return;
    await LocalNotifications.cancel({ notifications: [{ id: STREAK_ID }, { id: COMEBACK_ID }] });
    await LocalNotifications.schedule({
      notifications: [
        { id: STREAK_ID, title: opts.streak > 1 ? `🔥 Keep your ${opts.streak}-day streak alive` : "🔥 Start a streak today", body: `${opts.buddy} has your next quest for ${opts.name} ready. 2 minutes is enough.`, schedule: { at: at(1, 19), allowWhileIdle: true }, extra: { url: "/app" } },
        { id: COMEBACK_ID, title: `${opts.buddy} misses you 👀`, body: `Your co-founders are waiting. One small step on ${opts.name} today?`, schedule: { at: at(3, 17), allowWhileIdle: true }, extra: { url: "/app" } },
      ],
    });
  } catch { /* plugin missing or user declined */ }
}

export async function remindersEnabled(): Promise<boolean | null> {
  if (!isNative()) return null;
  try { const { LocalNotifications } = await import("@capacitor/local-notifications"); return (await LocalNotifications.checkPermissions()).display === "granted"; } catch { return null; }
}
