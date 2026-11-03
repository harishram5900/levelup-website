"use client";
import { Cloud, CloudOff, GraduationCap, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CharacterPicker, PalettePicker } from "@/components/cofounder/Pickers";
import { replaceWorkspace, resetWorkspace, useWorkspace } from "@/lib/cofounder/profile";
import { authEnabled, supabase, useAuth } from "@/lib/supabase";
import { paymentsEnabled, usePlan } from "@/lib/cofounder/plan";
import { openBillingPortal } from "@/lib/cofounder/billing";
import { cn } from "@/lib/utils";

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-[24px] p-6">
      <h3 className="font-display text-3xl uppercase leading-none">{title}</h3>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { ws, update } = useWorkspace();
  const { user } = useAuth();
  const { pro } = usePlan();
  const [mounted, setMounted] = useState(false);
  const [confirm, setConfirm] = useState<"" | "reset" | "delete">("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setMounted(true), []);

  const signOut = async () => { await supabase()?.auth.signOut(); replaceWorkspace({}); router.push("/"); };
  const deleteAccount = async () => {
    const sb = supabase(); if (!sb) return;
    setBusy(true); setMsg("");
    const { data } = await sb.auth.getSession();
    const res = await fetch("/api/account/delete", { method: "POST", headers: { authorization: `Bearer ${data.session?.access_token ?? ""}` } });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(body.error ?? "Couldn't delete the account."); return; }
    await sb.auth.signOut(); replaceWorkspace({}); router.push("/");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="font-display text-5xl uppercase">Settings</h2>

      <Card title="Account" sub={user ? "Your progress saves to your account and syncs across devices." : "You're using LevelUp as a guest. Progress saves in this browser only."}>
        {user ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm"><Cloud size={16} className="text-good" aria-hidden /> Signed in as <b>{user.email}</b> · {pro ? "Pro" : "Free plan"}</p>
            <div className="flex flex-wrap gap-2">
              {pro && paymentsEnabled && <button type="button" onClick={() => openBillingPortal().catch((e) => setMsg((e as Error).message))} className="btn-soft text-sm">Manage billing</button>}
              {!pro && <Link href="/app/upgrade" className="btn-glow text-sm">Upgrade to Pro</Link>}
              <button type="button" onClick={signOut} className="btn-glass text-sm"><LogOut size={15} aria-hidden /> Sign out</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm text-muted"><CloudOff size={16} aria-hidden /> Not signed in</p>
            {authEnabled ? <div className="flex gap-2"><Link href="/signin" className="btn-glass text-sm">Sign in</Link><Link href="/signup" className="btn-glow text-sm">Sign up to save</Link></div> : <span className="text-xs text-muted">Accounts are coming soon.</span>}
          </div>
        )}
      </Card>

      <Card title="Your co-founder" sub="Pick who guides you. Switch anytime.">
        <CharacterPicker value={ws.prefs.character} onChange={(c) => update((w) => ({ ...w, prefs: { ...w.prefs, character: c } }))} />
      </Card>

      <Card title="Dashboard colors" sub="Changes buttons, highlights and your HQ banner.">
        <PalettePicker value={ws.prefs.palette} onChange={(p) => update((w) => ({ ...w, prefs: { ...w.prefs, palette: p } }))} />
      </Card>

      <Card title="Appearance">
        <div role="radiogroup" aria-label="Theme" className="grid grid-cols-2 gap-3">
          {(["dark", "light"] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={mounted && resolvedTheme === t} onClick={() => setTheme(t)}
              className={cn("rounded-2xl p-4 text-left capitalize transition-colors", mounted && resolvedTheme === t ? "border border-violet/60 bg-violet/10" : "hairline hover:bg-fg/5")}>
              <span className={cn("mb-3 block h-12 rounded-xl", t === "dark" ? "bg-[#21232E]" : "bg-[#f4f5f9] ring-1 ring-black/5")} />{t}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Tutorial" sub="Take the guided tour of your HQ again.">
        <button type="button" data-tour="replay" onClick={() => { update((w) => ({ ...w, prefs: { ...w.prefs, tourDone: false } })); router.push("/app"); }} className="btn-soft"><GraduationCap size={16} aria-hidden /> Replay tutorial</button>
      </Card>

      <Card title="Your data" sub={user ? "Saved to your account (protected so only you can read it)." : "Saved in this browser only."}>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setConfirm("reset")} className="btn-glass text-sm">Start over with a new startup</button>
          {user && <button type="button" onClick={() => setConfirm("delete")} className="btn-glass text-sm text-red-500">Delete my account</button>}
        </div>
        {confirm && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="text-sm">{confirm === "reset" ? "This deletes your startup info, every agent plan, your deck and goals. This can't be undone." : "This permanently deletes your account and everything saved in it. This can't be undone."}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" disabled={busy} onClick={() => { if (confirm === "reset") { resetWorkspace(); setConfirm(""); setMsg("Cleared. Head to Startup HQ to set up a new startup."); } else deleteAccount(); }} className="btn-danger text-sm">{confirm === "reset" ? "Delete everything" : busy ? "Deleting…" : "Delete my account"}</button>
              <button type="button" onClick={() => setConfirm("")} className="btn-glass text-sm">Cancel</button>
            </div>
          </div>
        )}
        {msg && <p className="mt-3 text-sm" role="status">{msg}</p>}
      </Card>
    </div>
  );
}
