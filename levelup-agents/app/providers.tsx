"use client";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { AuthSync } from "@/components/cofounder/AuthSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {/* "user" makes every framer-motion animation honor prefers-reduced-motion */}
      <MotionConfig reducedMotion="user"><AuthSync />{children}</MotionConfig>
    </ThemeProvider>
  );
}
