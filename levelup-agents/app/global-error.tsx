"use client";
import { useEffect } from "react";
import { reportError } from "@/lib/report";

/** Last-resort screen if the whole app shell fails. Plain HTML: no providers or fonts are available here. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { reportError(error, "global"); }, [error]);
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#07070b", color: "#fff", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 24 }}>
        <div style={{ maxWidth: 380 }}>
          <h1 style={{ fontSize: 28, margin: "0 0 10px" }}>LevelUp hit a snag</h1>
          <p style={{ color: "#a3a3b2", lineHeight: 1.5 }}>Your progress is saved. Please try again.</p>
          <button type="button" onClick={reset} style={{ marginTop: 20, background: "#FE8500", color: "#1a1100", border: 0, borderRadius: 999, padding: "14px 28px", fontSize: 16, fontWeight: 800 }}>Try again</button>
        </div>
      </body>
    </html>
  );
}
