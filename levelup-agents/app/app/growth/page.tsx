"use client";
import { Check, Lightbulb, LineChart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useWorkspace, type CheckIn } from "@/lib/cofounder/profile";
import { METRIC_LABEL, XP_CHECKIN, checkinStreak, insights, latest, milestones, primaryMetric, sorted, totalConversations, weekOf, weeklyGrowth, type Metric } from "@/lib/cofounder/traction";
import { haptic } from "@/lib/native";
import { xpToast } from "@/components/cofounder/XpToast";
import { cn } from "@/lib/utils";

const fmt = (m: Metric, v: number) => (m === "revenue" ? `$${v.toLocaleString("en-US")}` : v.toLocaleString("en-US"));
const weekLabel = (w: string) => new Date(`${w}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** Weekly traction check-in: real numbers in, growth rate and honest next steps out. */
export default function GrowthPage() {
  const { ws, ready, update } = useWorkspace();
  const log = useMemo(() => sorted(ws.traction), [ws.traction]);
  const week = weekOf();
  const current = log.find((c) => c.week === week);
  const prev = latest(log.filter((c) => c.week < week));
  const [form, setForm] = useState({ conversations: "", users: "", revenue: "", note: "" });
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<Metric | null>(null);

  useEffect(() => {
    if (!ready) return;
    const c = current ?? (prev ? { ...prev, conversations: 0, revenue: 0, note: "" } : null);
    setForm({ conversations: current ? String(current.conversations) : "", users: c ? String(c.users) : "", revenue: current ? String(current.revenue) : "", note: current?.note ?? "" });
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;
  const m = view ?? primaryMetric(log);
  const g = weeklyGrowth(log, m);
  const pct = g === null ? null : Math.round(g * 100);
  const last = latest(log);
  const series = log.slice(-12);
  const max = Math.max(1, ...series.map((c) => c[m]));
  const ms = milestones(log);
  const streak = checkinStreak(log);

  const num = (v: string) => Math.max(0, Math.min(1e9, Math.round(Number(v.replace(/[^0-9.]/g, "")) || 0)));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: CheckIn = { week, conversations: num(form.conversations), users: num(form.users), revenue: num(form.revenue), note: form.note.trim().slice(0, 200) || undefined };
    update((w) => ({ ...w, traction: [...(w.traction ?? []).filter((c) => c.week !== week), entry].slice(-104) }));
    setSaved(true); haptic("success");
    if (!current) xpToast(XP_CHECKIN);
    setTimeout(() => setSaved(false), 2500);
  };
  const remove = (wk: string) => update((w) => ({ ...w, traction: (w.traction ?? []).filter((c) => c.week !== wk) }));
  const input = "w-full rounded-xl hairline bg-bg px-3.5 py-3 text-lg font-semibold tabular-nums outline-none focus:border-violet/60";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl">Growth</h2>
        <p className="mt-1 text-muted">Log your real numbers once a week. The first thing YC partners ask is how fast you&apos;re growing.</p>
      </div>

      {/* Headline metric */}
      <section className="glass rounded-[20px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex rounded-lg bg-fg/[0.05] p-0.5 text-xs font-semibold" role="tablist" aria-label="Metric">
              {(["users", "revenue", "conversations"] as Metric[]).map((k) => (
                <button key={k} type="button" role="tab" aria-selected={m === k} onClick={() => setView(k)} className={cn("rounded-md px-2.5 py-1 transition", m === k ? "bg-bg-2 text-fg shadow-sm" : "text-muted")}>{k === "conversations" ? "Talks" : METRIC_LABEL[k]}</button>
              ))}
            </div>
            <p className="kicker">{METRIC_LABEL[m]}{m === "users" ? "" : " this week"}</p>
            <p className="mt-1 text-4xl font-bold tabular-nums">{last ? fmt(m, last[m]) : "—"}</p>
          </div>
          <div className="text-right">
            <p className="kicker">Weekly growth</p>
            <p className={cn("mt-1 text-2xl font-bold tabular-nums", pct === null ? "text-muted" : pct >= 5 ? "text-good" : pct > 0 ? "text-amber" : "text-red-500")}>{pct === null ? "—" : `${pct > 0 ? "+" : ""}${pct}%`}</p>
            <p className="text-xs text-muted">YC &ldquo;good&rdquo;: 5–7%</p>
          </div>
        </div>
        {series.length > 0 ? (
          <div className="mt-5" role="img" aria-label={`${METRIC_LABEL[m]} over the last ${series.length} weeks`}>
            <div className="flex h-28 items-end gap-1.5">
              {series.map((c) => (
                <div key={c.week} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                  <span className="mb-1 text-[10px] font-semibold tabular-nums text-muted opacity-0 transition group-hover:opacity-100">{fmt(m, c[m])}</span>
                  <div className={cn("w-full max-w-10 rounded-md", c.week === week ? "bg-amber" : "bg-fg/25")} style={{ height: `${Math.max(3, (c[m] / max) * 85)}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted"><span>{weekLabel(series[0].week)}</span><span>This week</span></div>
          </div>
        ) : <p className="mt-4 text-sm text-muted">Your chart appears after your first check-in.</p>}
      </section>

      {/* Check-in */}
      <form onSubmit={save} className="glass space-y-4 rounded-[20px] p-5">
        <div className="flex items-center justify-between">
          <div><p className="font-semibold">Week of {weekLabel(week)}</p><p className="text-sm text-muted">{current ? "Checked in. Update anytime this week." : `30 seconds · +${XP_CHECKIN} XP`}{streak > 1 ? ` · ${streak}-week streak` : ""}</p></div>
          {current && <span className="flex items-center gap-1 rounded-full bg-good/15 px-2.5 py-1 text-xs font-bold text-good"><Check size={12} aria-hidden /> Done</span>}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">Customer talks</span><input inputMode="numeric" className={input} value={form.conversations} onChange={(e) => setForm({ ...form, conversations: e.target.value })} placeholder="0" aria-describedby="h-talks" /></label>
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">Total users</span><input inputMode="numeric" className={input} value={form.users} onChange={(e) => setForm({ ...form, users: e.target.value })} placeholder="0" /></label>
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">Revenue ($)</span><input inputMode="decimal" className={input} value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} placeholder="0" /></label>
        </div>
        <p id="h-talks" className="-mt-2 text-xs text-muted">Talks and revenue are for this week. Users is your total right now (sign-ups or active users, pick one and stay consistent).</p>
        <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">Biggest thing you learned this week (optional)</span>
          <input className="w-full rounded-xl hairline bg-bg px-3.5 py-3 text-[15px] outline-none focus:border-violet/60" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} maxLength={200} placeholder="e.g. Teachers care more than students do" /></label>
        <button type="submit" className="btn-play w-full">{saved ? <><Check size={18} aria-hidden /> Saved</> : current ? "Update this week" : "Save check-in"}</button>
      </form>

      {/* Insights */}
      <section className="glass rounded-[20px] p-5">
        <p className="mb-3 flex items-center gap-2 font-semibold"><Lightbulb size={16} className="text-amber" aria-hidden /> What the numbers say</p>
        <ul className="space-y-2.5">{insights(log).map((t) => <li key={t} className="text-[15px] leading-relaxed">{t}</li>)}</ul>
      </section>

      {/* Milestones */}
      <section className="glass rounded-[20px] p-5">
        <p className="mb-3 font-semibold">Milestones <span className="font-normal text-muted">· {ms.filter((x) => x.done).length} of {ms.length}</span></p>
        <ul className="grid gap-2 sm:grid-cols-2">{ms.map((x) => (
          <li key={x.id} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm", x.done ? "bg-good/10 font-semibold" : "bg-fg/[0.03] text-muted")}>
            <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border", x.done ? "border-transparent bg-good text-white" : "border-fg/20")}>{x.done && <Check size={12} aria-hidden />}</span>{x.label}
          </li>
        ))}</ul>
        <p className="mt-3 text-xs text-muted">{totalConversations(log)} customer conversations logged in total.</p>
      </section>

      {/* History */}
      {log.length > 0 && (
        <section className="glass overflow-hidden rounded-[20px]">
          <p className="flex items-center gap-2 px-5 pt-5 font-semibold"><LineChart size={16} aria-hidden /> History</p>
          <table className="mt-3 w-full text-sm tabular-nums">
            <thead><tr className="text-left text-xs text-muted"><th className="px-5 py-2 font-semibold">Week</th><th className="py-2 font-semibold">Talks</th><th className="py-2 font-semibold">Users</th><th className="py-2 font-semibold">Revenue</th><th className="sr-only">Delete</th></tr></thead>
            <tbody>{[...log].reverse().map((c) => (
              <tr key={c.week} className="border-t border-fg/[0.06]">
                <td className="px-5 py-2.5">{weekLabel(c.week)}</td><td>{c.conversations}</td><td>{c.users}</td><td>${c.revenue}</td>
                <td className="pr-3 text-right"><button type="button" onClick={() => remove(c.week)} className="btn-icon h-8 w-8" aria-label={`Delete week of ${weekLabel(c.week)}`}><Trash2 size={14} aria-hidden /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </section>
      )}
    </div>
  );
}
