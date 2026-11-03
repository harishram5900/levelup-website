"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useWorkspace } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const { update } = useWorkspace();
  const [mounted, setMounted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="font-display text-5xl uppercase">Settings</h2>
      <GlassCard glow={false} className="p-6">
        <h3 className="font-sans text-base font-semibold normal-case tracking-normal">Appearance</h3>
        <div role="radiogroup" aria-label="Theme" className="mt-4 grid grid-cols-2 gap-3">
          {(["dark", "light"] as const).map((t) => (
            <button key={t} role="radio" aria-checked={mounted && resolvedTheme === t} onClick={() => setTheme(t)}
              className={cn("rounded-2xl p-4 text-left capitalize transition-colors", mounted && resolvedTheme === t ? "border border-violet/60 bg-violet/10" : "hairline hover:bg-fg/5")}>
              <span className={cn("mb-3 block h-12 rounded-xl", t === "dark" ? "bg-[#21232E]" : "bg-[#f4f5f9] ring-1 ring-black/5")} />{t}
            </button>
          ))}
        </div>
      </GlassCard>
      <GlassCard glow={false} className="p-6">
        <h3 className="font-sans text-base font-semibold normal-case tracking-normal">Your data</h3>
        <p className="mt-1 text-sm text-muted">Your startup info, agent plans and goals are saved in this browser only. Clearing your browser data removes them.</p>
        {!confirm ? (
          <button type="button" onClick={() => { setConfirm(true); setCleared(false); }} className="mt-4 rounded-xl hairline px-4 py-2.5 text-sm font-semibold hover:bg-fg/5">Start over with a new startup</button>
        ) : (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="text-sm">This deletes your startup info, every agent plan and your goals. This can't be undone.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => { update(() => ({ profile: null, results: {}, answers: {}, goals: [] })); setConfirm(false); setCleared(true); }} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete everything</button>
              <button type="button" onClick={() => setConfirm(false)} className="rounded-xl hairline px-4 py-2 text-sm font-semibold hover:bg-fg/5">Cancel</button>
            </div>
          </div>
        )}
        {cleared && <p className="mt-3 text-sm text-good" role="status">Cleared. Head to Startup HQ to set up a new startup.</p>}
      </GlassCard>
    </div>
  );
}
