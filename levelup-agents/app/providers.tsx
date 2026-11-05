"use client";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { AuthSync } from "@/components/cofounder/AuthSync";
import { NativeBridge } from "@/components/NativeBridge";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {/* "user" makes every framer-motion animation honor prefers-reduced-motion */}
      <MotionConfig reducedMotion="user"><AuthSync /><NativeBridge />{children}</MotionConfig>
    </ThemeProvider>
  );
}
