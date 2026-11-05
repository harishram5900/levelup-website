"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { isNative, openExternal, platform, scheduleReminders } from "@/lib/native";
import { installGlobalErrorHandlers } from "@/lib/report";
import { getWorkspace, today, useWorkspace } from "@/lib/cofounder/profile";
import { gameStats } from "@/lib/cofounder/game";
import { characterById } from "@/components/cofounder/Pip";

/** Wires the web app into the native shell: status bar, splash, back button, links and reminders. */
export function NativeBridge() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { ws, ready } = useWorkspace();

  useEffect(() => { installGlobalErrorHandlers(); }, []);

  // One-time setup.
  useEffect(() => {
    if (!isNative()) return;
    const html = document.documentElement;
    html.classList.add("native", `native-${platform()}`);
    const cleanups: (() => void)[] = [];
    (async () => {
      try { const { SplashScreen } = await import("@capacitor/splash-screen"); await SplashScreen.hide({ fadeOutDuration: 250 }); } catch { /* ignore */ }
      try {
        const { App } = await import("@capacitor/app");
        const back = await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack && location.pathname !== "/app") window.history.back();
          else App.minimizeApp();
        });
        const resume = await App.addListener("resume", () => remind(false));
        // App Links / Universal Links: a tapped levelupinnovations.tech link (email confirmation,
        // password reset, invite) opens here. Load it fully so Supabase can finish signing in.
        const open = await App.addListener("appUrlOpen", ({ url }) => {
          try {
            const u = new URL(url);
            if (/(^|\.)levelupinnovations\.tech$/.test(u.hostname)) window.location.href = `${u.pathname}${u.search}${u.hash}`;
          } catch { /* ignore */ }
        });
        cleanups.push(() => { back.remove(); resume.remove(); open.remove(); });
      } catch { /* ignore */ }
      try {
        const { LocalNotifications } = await import("@capacitor/local-notifications");
        const tap = await LocalNotifications.addListener("localNotificationActionPerformed", (e) => {
          const url = (e.notification.extra as { url?: string } | undefined)?.url;
          if (url?.startsWith("/")) router.push(url);
        });
        cleanups.push(() => tap.remove());
      } catch { /* ignore */ }
    })();
    // Outside links open in the in-app browser instead of replacing the app.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || !a.href) return;
      try {
        const u = new URL(a.href);
        if (/^https?:$/.test(u.protocol) && u.host !== location.host) { e.preventDefault(); openExternal(u.href); }
      } catch { /* ignore */ }
    };
    document.addEventListener("click", onClick, true);
    cleanups.push(() => document.removeEventListener("click", onClick, true));
    return () => cleanups.forEach((c) => c());
  }, [router]);

  // Status bar follows the theme.
  useEffect(() => {
    if (!isNative()) return;
    (async () => {
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setStyle({ style: resolvedTheme === "light" ? Style.Light : Style.Dark });
        if (platform() === "android") { await StatusBar.setOverlaysWebView({ overlay: true }); }
      } catch { /* ignore */ }
    })();
  }, [resolvedTheme]);

  // Reschedule reminders whenever the founder shows up. Only ask for permission after their first quest.
  useEffect(() => { if (ready && ws.profile) remind(Object.keys(ws.results).length > 0); }, [ready, ws.profile, ws.results]);
  return null;
}

function remind(ask: boolean) {
  const w = getWorkspace();
  if (!w.profile) return;
  scheduleReminders({ name: w.profile.startup, streak: gameStats(w, today()).streak, buddy: characterById(w.prefs.character).name, ask });
}
