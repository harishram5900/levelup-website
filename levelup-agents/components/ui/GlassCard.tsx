"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Glass card with a soft glow that follows the cursor (CSS variables only, no re-renders). */
export function GlassCard({ className, children, glow = true, ...rest }: React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !glow) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn("group relative overflow-hidden rounded-[20px] glass", className)}
      {...rest}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--violet) / 0.14), transparent 60%)" }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
