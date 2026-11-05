import type { CapacitorConfig } from "@capacitor/cli";

/**
 * LevelUp native app (iOS + Android). The app loads the live site, so every web deploy updates
 * the app instantly; native features (reminders, haptics, share sheet, splash, status bar) come
 * from Capacitor plugins. If the phone is offline, mobile/www/offline.html is shown instead.
 * appId is permanent once published. Change it before your first store submission if needed.
 */
const config: CapacitorConfig = {
  appId: "tech.levelupinnovations.app",
  appName: "LevelUp",
  webDir: "mobile/www",
  server: {
    url: "https://www.levelupinnovations.tech/app?source=app",
    errorPath: "offline.html",
    allowNavigation: ["levelupinnovations.tech", "www.levelupinnovations.tech", "*.supabase.co"],
  },
  backgroundColor: "#07070b",
  ios: { contentInset: "never", scheme: "LevelUp" },
  android: { allowMixedContent: false },
  plugins: {
    SplashScreen: { launchShowDuration: 2000, launchAutoHide: true, backgroundColor: "#0A45D6", showSpinner: false, androidScaleType: "CENTER_CROP" },
    LocalNotifications: { smallIcon: "ic_stat_icon", iconColor: "#0A45D6" },
    StatusBar: { overlaysWebView: true },
  },
};

export default config;
