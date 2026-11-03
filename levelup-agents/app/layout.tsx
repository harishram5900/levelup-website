import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LevelUp: your AI co-founder",
  description:
    "An AI co-founder for young entrepreneurs: 12 agents, a pitch deck designer, playbooks from top founders, and 60 competitions, programs and investors.",
};

export const viewport: Viewport = {
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
