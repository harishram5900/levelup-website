import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.levelupinnovations.tech"),
  applicationName: "LevelUp",
  appleWebApp: { capable: true, title: "LevelUp", statusBarStyle: "black-translucent" },
  icons: { apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: false },
  title: "LevelUp: your AI co-founder",
  description:
    "An AI co-founder for young entrepreneurs: 12 agents, a pitch deck designer, playbooks from top founders, live competitor research, and 300+ competitions, grants, fellowships, programs and investors.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07070b" },
    { media: "(prefers-color-scheme: light)", color: "#f8f8fb" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="grain min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
