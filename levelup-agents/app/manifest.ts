import type { MetadataRoute } from "next";

/** Makes LevelUp installable (Add to Home Screen) and is reused by the native app shell. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "LevelUp: your AI co-founder",
    short_name: "LevelUp",
    description: "12 AI co-founder agents, live competitor research and 300+ competitions, grants and programs for young founders.",
    start_url: "/app?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#07070b",
    theme_color: "#0A45D6",
    categories: ["business", "education", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "AI co-founder", url: "/app/cofounder", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Opportunities", url: "/app/opportunities", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
