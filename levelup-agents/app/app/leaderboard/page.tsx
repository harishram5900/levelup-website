"use client";
import { motion } from "framer-motion";
import { Crown, Globe2, Loader2, Medal, Users, UsersRound } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Buddy, type CharacterId } from "@/components/cofounder/Pip";
import { SignInGate } from "@/components/cofounder/SignInGate";
import { LEVELS } from "@/lib/cofounder/game";
import { leaderboard, mySocial, setOnLeaderboard, type Board, type BoardRow } from "@/lib/cofounder/social";
import { useAuth } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const TABS: { id: Board; label: string; icon: React.ElementType; empty: string }[] = [
  { id: "global", label: "Global", icon: Globe2, empty: "Be the first founder on the global board!" },
  { id: "friends", label: "Friends", icon: Users, empty: "Invite friends to see how you stack up." },
  { id: "team", label: "Team", icon: UsersRound, empty: "Create or join a team to compete with your teammates." },
];
const levelOf = (xp: number) => { let i = 0; LEVELS.forEach((l, k) => { if (xp >= l.at) i = k; }); return { n: i + 1, title: LEVELS[i].title }; };
const ch = (c: string) => (["pip", "blaze", "sage", "nova", "rocco"].includes(c) ? c : "pip") as CharacterId;

export default function LeaderboardPage() { return <Suspense fallback={null}><Leaderboard /></Suspense>; }

function Leaderboard() {
  const { user, ready } = useAuth();
  const params = useSearchParams();
  const [tab, setTab] = useState<Board>((params.get("tab") as Board) || "global");
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [onBoard, setOnBoard] = useState<boolean | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setRows(null); setErr("");
    try { setRows(await leaderboard(tab)); } catch (e) { setErr((e as Error).message); setRows([]); }
  }, [user, tab]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (user) mySocial(user.id).then((s) => setOnBoard(s.on_leaderboard)).catch(() => {}); }, [user]);

  if (!ready) return null;
  if (!user) return <SignInGate title="Climb the leaderboard" line="Sign up to see where you rank against other young founders, your friends and your team." />;

  const toggle = async () => { const v = !onBoard; setOnBoard(v); try { await setOnLeaderboard(user.id, v); load(); } catch (e) { setErr((e as Error).message); setOnBoard(!v); } };
  const top = (rows ?? []).slice(0, 3);
  const rest = (rows ?? []).slice(3);
  const me = (rows ?? []).findIndex((r) => r.is_me);
  const t = TABS.find((x) => x.id === tab)!;
  const podium = [top[1], top[0], top[2]];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="font-display text-5xl leading-none">Leaderboard</h2><p className="mt-2 text-muted">Earn XP by finishing agents, hitting goals, showing up daily and inviting friends.</p></div>
        {me >= 0 && <span className="rounded-full bg-amber/15 px-4 py-2 text-sm font-bold text-amber">You're #{me + 1}</span>}
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-fg/[0.05] p-1" role="tablist">
        {TABS.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)} className={cn("flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition", tab === x.id ? "bg-bg-2 shadow" : "text-muted hover:text-fg")}><x.icon size={15} aria-hidden />{x.label}</button>
        ))}
      </div>

      {tab === "global" && onBoard !== null && (
        <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
          <p className="flex-1 text-sm">{onBoard ? "You're on the global leaderboard. Others see your first name, startup name and XP." : "You're hidden from the global board. Join to show your first name, startup name and XP."}</p>
          <button type="button" onClick={toggle} className={onBoard ? "btn-glass text-sm" : "btn-play px-4 py-2 text-sm"}>{onBoard ? "Hide me" : "Join the global board"}</button>
        </div>
      )}

      {err && <p className="rounded-xl bg-amber/10 p-4 text-sm" role="alert">{err}</p>}
      {rows === null ? <div className="grid h-60 place-items-center"><Loader2 className="animate-spin text-violet" aria-hidden /></div> : rows.length <= 1 && !err ? (
        <div className="glass rounded-[24px] p-8 text-center"><p className="font-semibold">{t.empty}</p>
          <div className="mt-4 flex justify-center gap-2">{tab === "team" ? <Link href="/app/team" className="btn-play px-4 py-2 text-sm">Go to Team</Link> : <Link href="/app/friends" className="btn-play px-4 py-2 text-sm">Invite friends</Link>}</div>
          {rows.length === 1 && <p className="mt-4 text-sm text-muted">Right now it's just you with {rows[0].total_xp} XP.</p>}
        </div>
      ) : (
        <>
          {/* Podium */}
          <div className="grid grid-cols-3 items-end gap-3">
            {podium.map((r, i) => {
              if (!r) return <div key={i} />;
              const place = i === 1 ? 1 : i === 0 ? 2 : 3;
              const h = place === 1 ? "h-36" : place === 2 ? "h-28" : "h-20";
              const tone = place === 1 ? "from-[#FFD08A] to-[#F5A524]" : place === 2 ? "from-[#E5E7EB] to-[#9CA3AF]" : "from-[#F3B78A] to-[#C2410C]";
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * place }} className="flex flex-col items-center text-center">
                  {place === 1 && <Crown className="mb-1 text-amber" size={22} aria-hidden />}
                  <Buddy character={ch(r.character)} mood={place === 1 ? "cheer" : "happy"} size={place === 1 ? 84 : 68} />
                  <p className={cn("mt-1 max-w-full truncate font-semibold", r.is_me && "text-violet")}>{r.name}{r.is_me && " (you)"}</p>
                  <p className="max-w-full truncate text-xs text-muted">{r.startup ?? "—"}</p>
                  <div className={cn("mt-2 grid w-full place-items-center rounded-t-2xl bg-gradient-to-b text-[#1a1100]", h, tone)}>
                    <div><p className="text-3xl font-black leading-none">{place}</p><p className="text-xs font-bold">{r.total_xp} XP</p></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* The rest */}
          <ol className="glass divide-y divide-fg/[0.06] overflow-hidden rounded-[24px]">
            {rest.map((r, i) => {
              const lv = levelOf(r.total_xp);
              return (
                <li key={i} className={cn("flex items-center gap-3 px-4 py-3", r.is_me && "bg-violet/10")}>
                  <span className="w-7 text-center font-bold text-muted">{i + 4}</span>
                  <Buddy character={ch(r.character)} size={36} />
                  <div className="min-w-0 flex-1"><p className="truncate font-semibold">{r.name}{r.is_me && <span className="text-violet"> (you)</span>}</p><p className="truncate text-xs text-muted">{r.startup ?? "Building something"} · Lv {lv.n} {lv.title}</p></div>
                  <span className="flex items-center gap-1 text-sm font-bold"><Medal size={14} className="text-amber" aria-hidden />{r.total_xp}</span>
                </li>
              );
            })}
            {rest.length === 0 && <li className="px-4 py-4 text-center text-sm text-muted">Invite more founders to fill the board!</li>}
          </ol>
        </>
      )}
      <p className="text-center text-xs text-muted">Only first names, startup names and XP are shown. The global board is opt-in.</p>
    </div>
  );
}
