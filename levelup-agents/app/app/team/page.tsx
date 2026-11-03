"use client";
import { Check, Copy, Crown, Loader2, LogOut, Plus, Trash2, UsersRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Buddy, type CharacterId } from "@/components/cofounder/Pip";
import { SignInGate } from "@/components/cofounder/SignInGate";
import { agentById } from "@/lib/agents";
import { useWorkspace } from "@/lib/cofounder/profile";
import { addTeamGoal, createTeam, getTeam, joinTeam, leaveTeam, removeTeamGoal, teamGoals, teamLink, toggleTeamGoal, type Team, type TeamGoal } from "@/lib/cofounder/social";
import { useAuth } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const ch = (c: string) => (["pip", "blaze", "sage", "nova", "rocco"].includes(c) ? c : "pip") as CharacterId;
const ROLES = ["Founder", "Co-founder", "CEO", "CTO", "CMO", "Designer", "Developer", "Marketing", "Sales", "Mentor"];
const input = "w-full rounded-xl hairline bg-bg-2/60 px-3 py-2.5 text-sm outline-none focus:border-violet/60";

export default function TeamPage() { return <Suspense fallback={null}><TeamInner /></Suspense>; }

function TeamInner() {
  const { user, ready } = useAuth();
  const { ws, update } = useWorkspace();
  const params = useSearchParams();
  const [team, setTeam] = useState<Team | null | undefined>(undefined);
  const [goals, setGoals] = useState<TeamGoal[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(ws.profile?.startup ? `${ws.profile.startup} team` : "");
  const [role, setRole] = useState("Founder");
  const [code, setCode] = useState((params.get("join") ?? "").toUpperCase());
  const [joinRole, setJoinRole] = useState("Co-founder");
  const [goal, setGoal] = useState("");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const t = await getTeam(); setTeam(t); setErr("");
      update((w) => (w.team === (t?.name ?? null) ? w : { ...w, team: t?.name ?? null }));
      if (t) setGoals(await teamGoals());
    } catch (e) { setErr((e as Error).message); setTeam(null); }
  }, [user, update]);
  useEffect(() => { load(); }, [load]);

  if (!ready) return null;
  if (!user) return <SignInGate title="Build with your team" line="Sign up to create a team, invite your co-founders, share weekly goals and see each other's progress." />;
  if (team === undefined) return <div className="grid h-60 place-items-center"><Loader2 className="animate-spin text-violet" aria-hidden /></div>;

  const run = async (fn: () => Promise<unknown>) => { setBusy(true); setErr(""); try { await fn(); await load(); } catch (e) { setErr((e as Error).message); } setBusy(false); };

  /* ---------- No team yet ---------- */
  if (!team) return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4"><Buddy character={ws.prefs.character} mood="wave" size={80} /><div><h2 className="font-display text-5xl leading-none">Your team</h2><p className="mt-2 text-muted">Startups are a team sport. Bring your co-founders and teammates in (up to 8).</p></div></div>
      {err && <p className="rounded-xl bg-amber/10 p-4 text-sm" role="alert">{err}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={(e) => { e.preventDefault(); run(() => createTeam(name, role)); }} className="glass space-y-3 rounded-[24px] p-6">
          <p className="font-display text-2xl">Create a team</p>
          <div><label htmlFor="t-name" className="mb-1 block text-sm font-semibold">Team name</label><input id="t-name" className={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="e.g. Voca team" /></div>
          <div><label htmlFor="t-role" className="mb-1 block text-sm font-semibold">Your role</label><select id="t-role" className={input} value={role} onChange={(e) => setRole(e.target.value)}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
          <button type="submit" disabled={busy || !name.trim()} className="btn-play w-full">{busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Plus size={16} aria-hidden />} Create team</button>
          <p className="text-xs text-muted">Your startup plans become the team's shared plans.</p>
        </form>
        <form onSubmit={(e) => { e.preventDefault(); run(() => joinTeam(code, joinRole)); }} className="glass space-y-3 rounded-[24px] p-6">
          <p className="font-display text-2xl">Join a team</p>
          <div><label htmlFor="t-code" className="mb-1 block text-sm font-semibold">Team code</label><input id="t-code" className={cn(input, "font-mono uppercase")} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={12} placeholder="e.g. 4KQ8ZP2M" /></div>
          <div><label htmlFor="t-jrole" className="mb-1 block text-sm font-semibold">Your role</label><select id="t-jrole" className={input} value={joinRole} onChange={(e) => setJoinRole(e.target.value)}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
          <button type="submit" disabled={busy || code.trim().length < 6} className="btn-glow w-full justify-center">{busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <UsersRound size={16} aria-hidden />} Join team</button>
          <p className="text-xs text-muted">Joining makes you friends with everyone on the team.</p>
        </form>
      </div>
    </div>
  );

  /* ---------- On a team ---------- */
  const link = teamLink(team.invite_code);
  const copy = async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* blocked */ } };
  const totalXp = team.members.reduce((n, m) => n + m.xp, 0);
  const sp = team.startup?.profile;
  const results = Object.entries(team.startup?.results ?? {});
  const doneGoals = goals.filter((g) => g.done).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-[32px] p-6 text-white sm:p-8" style={{ background: "radial-gradient(120% 140% at 100% 0%, #0EA5E9 0%, #0c4a6e 45%, #0B0D14 100%)" }}>
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Your team</p>
            <h2 className="font-display text-4xl leading-none">{team.name}</h2>
            <p className="mt-2 text-white/80">{team.members.length} member{team.members.length === 1 ? "" : "s"} · {totalXp} team XP · {doneGoals}/{goals.length} goals done</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-xs text-white/70">Invite teammates with code</p>
            <p className="font-mono text-2xl font-bold tracking-widest">{team.invite_code}</p>
            <button type="button" onClick={copy} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold hover:bg-white/25">{copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}{copied ? "Link copied" : "Copy invite link"}</button>
          </div>
        </div>
      </section>
      {err && <p className="rounded-xl bg-amber/10 p-4 text-sm" role="alert">{err}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="glass rounded-[24px] p-6">
          <h3 className="font-display text-2xl">Members</h3>
          <ul className="mt-4 space-y-2">{team.members.map((m, i) => (
            <li key={i} className={cn("flex items-center gap-3 rounded-2xl p-3", m.is_me ? "bg-violet/10" : "bg-fg/[0.04]")}>
              <Buddy character={ch(m.character)} size={44} />
              <div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 truncate font-semibold">{m.name}{m.is_me && <span className="text-xs text-violet">(you)</span>}{m.is_owner && <Crown size={13} className="text-amber" aria-label="Team owner" />}</p><p className="text-xs text-muted">{m.role ?? "Teammate"}</p></div>
              <span className="text-sm font-bold">{m.xp} XP</span>
            </li>
          ))}</ul>
        </section>

        <section className="glass rounded-[24px] p-6">
          <div className="flex items-center justify-between"><h3 className="font-display text-2xl">Team goals this week</h3><span className="text-xs text-muted">Everyone can add and tick</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-fg/10"><div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${goals.length ? (doneGoals / goals.length) * 100 : 0}%` }} /></div>
          <ul className="mt-4 space-y-2">
            {goals.length === 0 && <li className="text-sm text-muted">No team goals yet. Add the first one, like "Interview 10 customers".</li>}
            {goals.map((g) => (
              <li key={g.id} className="flex items-center gap-3 rounded-xl bg-fg/[0.04] px-3 py-2.5">
                <button type="button" role="checkbox" aria-checked={g.done} aria-label={`Mark "${g.text}" ${g.done ? "not done" : "done"}`} onClick={() => run(() => toggleTeamGoal(g.id, !g.done))} className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2", g.done ? "border-good bg-good text-white" : "border-fg/30 hover:border-sky-500")}>{g.done && <Check size={14} strokeWidth={3} aria-hidden />}</button>
                <span className={cn("flex-1 text-sm", g.done && "text-muted line-through")}>{g.text}</span>
                <button type="button" aria-label={`Remove "${g.text}"`} onClick={() => run(() => removeTeamGoal(g.id))} className="text-muted hover:text-red-500"><Trash2 size={14} aria-hidden /></button>
              </li>
            ))}
          </ul>
          <form onSubmit={(e) => { e.preventDefault(); const t = goal.trim(); if (!t) return; setGoal(""); run(() => addTeamGoal(team.invite_code, t, user.id)); }} className="mt-3 flex gap-2">
            <label htmlFor="team-goal" className="sr-only">New team goal</label>
            <input id="team-goal" value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={120} placeholder="Add a team goal" className={cn(input, "flex-1")} />
            <button type="submit" disabled={busy} aria-label="Add team goal" className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500 text-white"><Plus size={16} aria-hidden /></button>
          </form>
        </section>
      </div>

      <section className="glass rounded-[24px] p-6">
        <h3 className="font-display text-2xl">Team startup</h3>
        {sp?.startup ? <p className="mt-1 text-muted"><b className="text-fg">{sp.startup}</b> {sp.idea?.replace(/\.$/, "")} for {sp.customer}.</p> : <p className="mt-1 text-sm text-muted">The team owner hasn't set up their Startup HQ yet.</p>}
        <p className="mt-1 text-xs text-muted">Plans from the team owner's agents, shared with the whole team.</p>
        {results.length > 0 && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">{results.map(([id, r]) => {
            const a = agentById(id);
            return (
              <div key={id} className="rounded-2xl bg-fg/[0.04] p-4">
                <button type="button" onClick={() => setOpen(open === id ? null : id)} className="flex w-full items-center justify-between text-left font-semibold" aria-expanded={open === id}>{a ? `${a.name} agent` : id}<span className="text-xs text-muted">{open === id ? "Hide" : "View plan"}</span></button>
                {open === id && <div className="mt-3 space-y-3">{r.sections?.map((s, k) => <div key={k}><p className="text-xs font-bold uppercase tracking-wider text-sky-500">{s.title}</p><ul className="mt-1 space-y-1 text-sm">{s.items.map((it, j) => <li key={j}>• {it}</li>)}</ul></div>)}</div>}
              </div>
            );
          })}</div>
        )}
      </section>

      <div className="text-center"><button type="button" onClick={() => { if (confirm(`Leave ${team.name}?`)) run(leaveTeam); }} className="btn-glass text-sm text-red-500"><LogOut size={14} aria-hidden /> Leave team</button></div>
    </div>
  );
}
