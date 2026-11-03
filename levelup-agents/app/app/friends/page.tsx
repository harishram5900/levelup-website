"use client";
import { Check, Copy, Gift, Link2, Loader2, Mail, MessageCircle, Send, UserPlus, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Buddy } from "@/components/cofounder/Pip";
import { SignInGate } from "@/components/cofounder/SignInGate";
import { useWorkspace } from "@/lib/cofounder/profile";
import { addFriend, inviteLink, leaderboard, mySocial, type BoardRow, type Social } from "@/lib/cofounder/social";
import { useAuth } from "@/lib/supabase";

export default function FriendsPage() {
  const { user, ready } = useAuth();
  const { ws } = useWorkspace();
  const [s, setS] = useState<Social | null>(null);
  const [friends, setFriends] = useState<BoardRow[]>([]);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    try { setS(await mySocial(user.id)); setFriends((await leaderboard("friends")).filter((f) => !f.is_me)); setErr(""); }
    catch (e) { setErr((e as Error).message); }
  }, [user]);
  useEffect(() => { load(); }, [load]);

  if (!ready) return null;
  if (!user) return <SignInGate title="Invite friends, earn XP" line="Sign up to get your invite link. Every friend who joins gives you +50 XP, and you can compete on the friends leaderboard." />;

  const link = s?.invite_code ? inviteLink(s.invite_code) : "";
  const startup = ws.profile?.startup;
  const text = `I'm building ${startup ? `${startup} ` : "my startup "}with LevelUp, an AI co-founder for young founders. Join me and let's level up together: ${link}`;
  const copy = async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* blocked */ } };
  const add = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    try { const n = await addFriend(code); setMsg(`You and ${n} are now friends! 🎉`); setCode(""); load(); }
    catch (e2) { setMsg((e2 as Error).message); }
    setBusy(false);
  };
  const share = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(text)}` },
    { label: "Text", icon: Send, href: `sms:?&body=${encodeURIComponent(text)}` },
    { label: "Email", icon: Mail, href: `mailto:?subject=${encodeURIComponent("Build a startup with me on LevelUp")}&body=${encodeURIComponent(text)}` },
    { label: "X", icon: Link2, href: `https://x.com/intent/post?text=${encodeURIComponent(text)}` },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="relative overflow-hidden rounded-[32px] p-6 text-white sm:p-8" style={{ background: "radial-gradient(120% 140% at 100% 0%, #EC4899 0%, #7c1d4f 45%, #0B0D14 100%)" }}>
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <Buddy character={ws.prefs.character} mood="cheer" size={110} className="mx-auto text-white md:mx-0" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Friends & invites</p>
            <h2 className="mt-1 font-display text-4xl leading-none">Build with your friends</h2>
            <p className="mt-2 max-w-lg text-white/80">Every friend who signs up with your link gives you <b className="text-white">+50 XP</b>, and you both show up on each other's leaderboard.</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Users size={15} aria-hidden /> {s?.friends ?? "–"} friends</span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Zap size={15} aria-hidden /> +{s?.bonus_xp ?? 0} invite XP</span>
            </div>
          </div>
        </div>
      </section>

      {err && <p className="rounded-xl bg-amber/10 p-4 text-sm" role="alert">{err}</p>}

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="glass rounded-[24px] p-6">
          <p className="flex items-center gap-2 font-semibold"><Gift size={18} className="text-pink-500" aria-hidden /> Your invite link</p>
          <div className="mt-3 flex gap-2">
            <input readOnly value={s ? link : "Loading…"} aria-label="Your invite link" className="min-w-0 flex-1 rounded-xl hairline bg-bg-2/60 px-3 py-2.5 text-sm" onFocus={(e) => e.currentTarget.select()} />
            <button type="button" onClick={copy} disabled={!s} className="btn-play px-4 py-2.5">{copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}{copied ? "Copied" : "Copy"}</button>
          </div>
          <p className="mt-2 text-xs text-muted">Your code: <b className="font-mono text-fg">{s?.invite_code ?? "…"}</b></p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {share.map((x) => <a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer" className={`btn-glass justify-center text-sm ${!s ? "pointer-events-none opacity-50" : ""}`}><x.icon size={15} aria-hidden />{x.label}</a>)}
          </div>
        </section>
        <form onSubmit={add} className="glass rounded-[24px] p-6">
          <p className="flex items-center gap-2 font-semibold"><UserPlus size={18} className="text-violet" aria-hidden /> Add a friend by code</p>
          <p className="mt-1 text-sm text-muted">Already on LevelUp? Ask for their 8-letter code.</p>
          <div className="mt-3 flex gap-2">
            <label htmlFor="friend-code" className="sr-only">Friend's code</label>
            <input id="friend-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={12} placeholder="e.g. 7F3K9QAB" className="min-w-0 flex-1 rounded-xl hairline bg-bg-2/60 px-3 py-2.5 font-mono text-sm uppercase outline-none focus:border-violet/60" />
            <button type="submit" disabled={busy || code.trim().length < 6} className="btn-soft">{busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : "Add"}</button>
          </div>
          {msg && <p className="mt-2 text-sm" role="status">{msg}</p>}
        </form>
      </div>

      <section className="glass rounded-[24px] p-6">
        <div className="flex items-center justify-between"><h3 className="font-display text-2xl">Your friends</h3><Link href="/app/leaderboard?tab=friends" className="text-sm font-semibold text-violet hover:underline">Friends leaderboard →</Link></div>
        {friends.length === 0 ? <p className="mt-3 text-sm text-muted">No friends yet. Share your link. The first one who joins unlocks the <b>Recruiter</b> badge!</p> : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{friends.map((f, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl bg-fg/[0.04] p-3">
              <Buddy character={(f.character as "pip") ?? "pip"} size={44} />
              <div className="min-w-0"><p className="truncate font-semibold">{f.name}</p><p className="truncate text-xs text-muted">{f.startup ?? "Building something"} · {f.total_xp} XP</p></div>
            </li>
          ))}</ul>
        )}
      </section>
    </div>
  );
}
