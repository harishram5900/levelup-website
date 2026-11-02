"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { PLATFORMS, PlatformIcon, type Platform } from "@/components/ui/PlatformIcon";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [connected, setConnected] = useState<Record<Platform, boolean>>({ tiktok: true, instagram: true, youtube: false, facebook: false });
  const [approve, setApprove] = useState(true);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="font-display text-3xl font-bold">Settings</h2>
      <GlassCard glow={false} className="p-6">
        <h3 className="font-sans text-base font-semibold tracking-normal">Appearance</h3>
        <div role="radiogroup" aria-label="Theme" className="mt-4 grid grid-cols-2 gap-3">
          {(["dark", "light"] as const).map((t) => (
            <button key={t} role="radio" aria-checked={mounted && resolvedTheme === t} onClick={() => setTheme(t)}
              className={cn("rounded-2xl p-4 text-left capitalize transition-colors", mounted && resolvedTheme === t ? "border border-violet/60 bg-violet/10" : "hairline hover:bg-fg/5")}>
              <span className={cn("mb-3 block h-12 rounded-xl", t === "dark" ? "bg-[#0b0b12]" : "bg-[#f3f3f7] ring-1 ring-black/5")} />{t}
            </button>
          ))}
        </div>
      </GlassCard>
      <GlassCard glow={false} className="p-6">
        <div className="flex items-center justify-between"><h3 className="font-sans text-base font-semibold tracking-normal">Connected platforms</h3><Badge>Mocked in demo</Badge></div>
        <ul className="mt-4 divide-y divide-fg/[0.07]">
          {PLATFORMS.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3.5">
              <PlatformIcon name={p.id} size={20} /><span className="flex-1 font-medium">{p.name}</span>
              <span className={cn("text-xs", connected[p.id] ? "text-good" : "text-muted")}>{connected[p.id] ? "Connected" : "Not connected"}</span>
              <Switch checked={connected[p.id]} onChange={(v) => setConnected({ ...connected, [p.id]: v })} label={`${p.name} connection`} />
            </li>
          ))}
        </ul>
      </GlassCard>
      <GlassCard glow={false} className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div><h3 className="font-sans text-base font-semibold tracking-normal">Approve posts before they go live</h3><p className="mt-1 text-sm text-muted">When on, nothing posts without your OK.</p></div>
          <Switch checked={approve} onChange={setApprove} label="Approve posts before publishing" />
        </div>
      </GlassCard>
    </div>
  );
}
