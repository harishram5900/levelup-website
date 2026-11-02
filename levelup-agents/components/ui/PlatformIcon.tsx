/** Simple, monochrome platform glyphs (not official logos). */
export type Platform = "tiktok" | "instagram" | "youtube" | "facebook";

export function PlatformIcon({ name, size = 20 }: { name: Platform; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "tiktok":
      return <svg {...p}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.5 2.6 2.4 4.4 5 4.6" /></svg>;
    case "instagram":
      return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>;
    case "youtube":
      return <svg {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" /></svg>;
    case "facebook":
      return <svg {...p}><path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .4-1.8 1.8-1.8H18V2.6c-.6-.1-1.6-.2-2.8-.2C12.6 2.4 11 4 11 6.8v2.7H8V13h3v8" /></svg>;
  }
}

export const PLATFORMS: { id: Platform; name: string }[] = [
  { id: "tiktok", name: "TikTok" },
  { id: "instagram", name: "Instagram Reels" },
  { id: "youtube", name: "YouTube Shorts" },
  { id: "facebook", name: "Facebook" },
];
