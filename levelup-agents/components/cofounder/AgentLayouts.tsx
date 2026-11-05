"use client";
import { AlertTriangle, ExternalLink, Flame, Globe, MessageSquare, Rocket, Star, Users, CalendarDays, Check, Copy, Gift, Mail, MapPin, Scale, ShieldCheck, Swords, Target, ThumbsDown, ThumbsUp, Wrench, X } from "lucide-react";
import { useState } from "react";
import type { AgentId } from "@/lib/agents";
import type { Section } from "@/lib/cofounder/profile";
import type { Research } from "@/lib/server/research";
import { milestones } from "@/lib/cofounder/traction";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/cofounder/profile";

/** Each agent's look: a color, a layout name and a gradient for its header. */
export const AGENT_STYLE: Record<AgentId, { color: string; layout: string }> = {
  idea: { color: "#F5A524", layout: "Scorecard" },
  customer: { color: "#14B8A6", layout: "Interview kit" },
  competitor: { color: "#EF4444", layout: "Battle map" },
  offer: { color: "#A855F7", layout: "Value equation" },
  build: { color: "#F97316", layout: "Build board" },
  brand: { color: "#EC4899", layout: "Brand board" },
  pitch: { color: "#3B82F6", layout: "Stage" },
  money: { color: "#22C55E", layout: "Money dashboard" },
  sales: { color: "#0EA5E9", layout: "Sales pipeline" },
  launch: { color: "#F43F5E", layout: "Mission control" },
  content: { color: "#8B5CF6", layout: "Content studio" },
  investor: { color: "#10B981", layout: "Data room" },
};

type P = { s: Section[]; titles: string[]; startup: string; research?: Research; ai?: boolean };
const sec = (p: P, i: number): Section => p.s[i] ?? { title: p.titles[i] ?? "", items: [] };
const strip = (t: string) => t.replace(/^[✓✗✔✘]\s*/, "");

function Label({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">{Icon && <Icon size={15} style={{ color: "var(--ag)" }} aria-hidden />}{children}</p>;
}
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-2xl bg-fg/[0.035] p-5 ring-1 ring-fg/[0.06]", className)}>{children}</section>;
}
function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); } catch { /* blocked */ } }} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-fg/5 hover:text-fg">{ok ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}{ok ? "Copied" : label}</button>;
}
/** Turns a plan step into a weekly goal on the dashboard (+25 XP when done). */
function AddGoal({ text, className }: { text: string; className?: string }) {
  const { ws, update } = useWorkspace();
  const t = text.replace(/^[^:]{1,20}:\s*/, "").replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s/)[0].slice(0, 100);
  const added = ws.goals.some((g) => g.text === t);
  return (
    <button type="button" disabled={added} onClick={() => update((w) => ({ ...w, goals: [...w.goals, { id: String(Date.now()), text: t, done: false }].slice(-10) }))}
      className={cn("inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition", added ? "text-good" : "bg-fg/[0.06] text-muted hover:bg-fg/10 hover:text-fg", className)}
      aria-label={added ? "Added to weekly goals" : `Add "${t}" to weekly goals`}>
      {added ? <><Check size={11} aria-hidden /> In goals</> : <>+ Goal</>}
    </button>
  );
}
/** Renders text with any URLs turned into small, safe links. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)"'<>]+)/g);
  if (parts.length === 1) return <>{text}</>;
  return <>{parts.map((x, i) => {
    if (!/^https?:\/\//.test(x)) return x;
    const url = x.replace(/[.,;]+$/, "");
    let host = url;
    try { const u = new URL(url); host = (u.hostname.replace(/^www\./, "") + (u.pathname.length > 1 ? u.pathname : "")).slice(0, 42); } catch { /* keep raw */ }
    return <a key={i} href={url} target="_blank" rel="noopener noreferrer nofollow" className="mx-0.5 inline-flex max-w-full items-center gap-0.5 break-all rounded-md px-1.5 py-0.5 align-baseline text-[0.85em] font-semibold underline-offset-2 hover:underline" style={{ background: "color-mix(in srgb, var(--ag) 14%, transparent)", color: "var(--ag)" }}>{host}<ExternalLink size={11} className="shrink-0" aria-hidden /></a>;
  })}</>;
}
const Empty = () => <p className="text-sm text-muted">Nothing here yet. Add more detail and run again.</p>;

/* 1. Idea: scorecard */
function IdeaLayout(p: P) {
  const [one, strong, risks, tests] = [0, 1, 2, 3].map((i) => sec(p, i));
  // Real evidence from the founder's own logged numbers (Growth tab), not a made-up score.
  const { ws } = useWorkspace();
  const ms = milestones(ws.traction);
  const done = (id: string) => ms.some((m) => m.id === id && m.done);
  const evidence = [
    { label: "Problem written down clearly", ok: strong.items.some((t) => /describe the problem clearly/i.test(t)) },
    { label: "Talked to 10 potential customers", ok: done("talk10") },
    { label: "Someone is using it", ok: done("user1") },
    { label: "Someone has paid", ok: done("dollar1") },
  ];
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-fg/15 bg-bg-2 p-6">
        <Label>{one.title}</Label>
        <p className="serif text-[30px] leading-[1.08] sm:text-[36px]">&ldquo;{one.items[0]}&rdquo;</p>
        <div className="mt-5 border-t border-fg/10 pt-4">
          <p className="mb-2 text-sm font-semibold">Evidence so far <span className="font-normal text-muted">· {evidence.filter((e) => e.ok).length} of {evidence.length}</span></p>
          <ul className="grid gap-1.5 sm:grid-cols-2">{evidence.map((e) => <li key={e.label} className={cn("flex items-center gap-2 text-sm", !e.ok && "text-muted")}><span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full border", e.ok ? "border-transparent bg-good text-white" : "border-fg/25")}>{e.ok && <Check size={10} strokeWidth={3} aria-hidden />}</span>{e.label}</li>)}</ul>
          <p className="mt-2 text-xs text-muted">Log customer talks, users and revenue in <a href="/app/growth" className="underline">Growth</a>. Evidence beats opinions.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><Label icon={ThumbsUp}>{strong.title}</Label>{strong.items.length ? <ul className="space-y-2">{strong.items.map((t, i) => <li key={i} className="flex gap-2 text-[15px]"><Check size={16} className="mt-1 shrink-0 text-good" aria-hidden /><Rich text={t} /></li>)}</ul> : <Empty />}</Card>
        <Card><Label icon={AlertTriangle}>{risks.title}</Label>{risks.items.length ? <ul className="space-y-2">{risks.items.map((t, i) => <li key={i} className="flex gap-2 text-[15px]"><AlertTriangle size={15} className="mt-1 shrink-0 text-red-500" aria-hidden /><Rich text={t} /></li>)}</ul> : <Empty />}</Card>
      </div>
      <Card><Label icon={Target}>{tests.title}</Label>
        <ol className="relative ml-3 space-y-5 border-l-2 border-dashed border-fg/15 pl-6">
          {tests.items.map((t, i) => <li key={i} className="relative"><span className="absolute -left-[35px] grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "var(--ag)" }}>{i + 1}</span><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold text-muted">{["Days 1–2", "Days 3–5", "Days 6–7", "Bonus"][i] ?? "Next"}</p><AddGoal text={t} /></div><p className="text-[15px]"><Rich text={t} /></p></li>)}
        </ol>
      </Card>
    </div>
  );
}

/* 2. Customer: interview kit */
function CustomerLayout(p: P) {
  const [qs, where, msg, notes] = [0, 1, 2, 3].map((i) => sec(p, i));
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Card>
        <div className="flex items-center justify-between"><Label>{qs.title}</Label><CopyBtn text={qs.items.map((q, i) => `${i + 1}. ${q}`).join("\n")} label="Copy script" /></div>
        <ol className="space-y-2.5">{qs.items.map((q, i) => (
          <li key={i} className="flex items-start gap-3"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-fg/[0.06] text-xs font-bold">{i + 1}</span><span className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-[15px]" style={{ background: "color-mix(in srgb, var(--ag) 14%, transparent)" }}>{q}</span></li>
        ))}</ol>
      </Card>
      <div className="space-y-4">
        <div className="mx-auto w-full max-w-[300px] rounded-[2rem] border-[6px] border-fg/15 bg-bg-2 p-3 shadow-xl">
          <p className="mb-2 text-center text-[11px] text-muted">New message</p>
          <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm px-3 py-2 text-sm text-white" style={{ background: "var(--ag)" }}><Rich text={msg.items[0] ?? ""} /></div>
          <div className="mt-2 flex justify-end"><CopyBtn text={msg.items[0] ?? ""} label="Copy message" /></div>
        </div>
        <Card><Label icon={MapPin}>{where.title}</Label><ul className="space-y-2">{where.items.map((t, i) => <li key={i} className="flex gap-2 text-sm"><MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--ag)" }} aria-hidden /><Rich text={t} /></li>)}</ul></Card>
        <section className="rounded-2xl bg-[#FFF7D6] p-5 text-[#3b2f00] shadow-sm" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,.07) 28px)" }}>
          <p className="mb-2 text-[12.5px] font-medium">{notes.title}</p>
          <ul className="space-y-[6px] text-sm leading-[22px]">{notes.items.map((t, i) => <li key={i}>☐ <Rich text={t} /></li>)}</ul>
        </section>
      </div>
    </div>
  );
}

/* 3. Scout: battle map */
function CompetitorLayout(p: P) {
  const [map, complaints, gaps, win, watch, line] = [0, 1, 2, 3, 4, 5].map((i) => sec(p, i));
  const found = (p.research?.competitors ?? []).slice(0, 12);
  const [summary, ...quotes] = complaints.items[0]?.startsWith("Across ") ? complaints.items : ["", ...complaints.items];
  const cards = found.length > 0;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-fg p-6 text-bg">
        <p className="text-[12.5px] font-medium opacity-70">{line.title}</p>
        <p className="serif mt-2 text-[27px] leading-[1.1] sm:text-[32px]">{line.items[0]}</p>
      </div>
      {cards && (
        <div>
          <Label icon={Globe}>Live scan · {found.length} found{p.research?.sources.length ? ` on ${p.research.sources.join(", ")}` : ""}</Label>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{found.map((f, i) => (
            <a key={i} href={f.url} target="_blank" rel="noopener noreferrer nofollow" className="group flex flex-col rounded-2xl bg-fg/[0.035] p-4 ring-1 ring-fg/[0.06] transition hover:ring-[color:var(--ag)]">
              <div className="flex items-start justify-between gap-2"><p className="font-semibold leading-snug">{f.name}</p><ExternalLink size={14} className="mt-1 shrink-0 text-muted group-hover:text-fg" aria-hidden /></div>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-bold text-red-500">{f.source}</span>
                {f.rating ? <span className="inline-flex items-center gap-0.5 font-semibold text-amber"><Star size={11} fill="currentColor" aria-hidden />{f.rating}</span> : null}
                {f.reviews ? <span>{f.reviews.toLocaleString("en-US")} ratings</span> : null}
                {f.source !== "Web research" && f.price ? <span>{f.price}</span> : null}
              </p>
              {f.detail && <p className="mt-2 line-clamp-3 text-sm text-muted">{f.detail}</p>}
              {f.source === "Web research" && f.price && <p className="mt-2 rounded-lg bg-red-500/[0.08] px-2 py-1 text-xs">{f.price}</p>}
            </a>
          ))}</div>
        </div>
      )}
      {(!cards || p.ai) && (
        <div><Label icon={Swords}>{map.title}</Label>
          <div className="grid gap-3 sm:grid-cols-2">{map.items.map((t, i) => {
            const k = t.indexOf(": ");
            return <div key={i} className="relative rounded-2xl bg-fg/[0.035] p-4 pl-12 ring-1 ring-fg/[0.06]"><span className="absolute left-3 top-4 grid h-7 w-7 place-items-center rounded-lg bg-red-500/15 text-[10px] font-black text-red-500">VS</span><p className="font-semibold">{k > 0 && k < 60 ? t.slice(0, k) : `Rival ${i + 1}`}</p><p className="text-sm text-muted"><Rich text={k > 0 && k < 60 ? t.slice(k + 2) : t} /></p></div>;
          })}</div>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><Label icon={ThumbsDown}>{complaints.title}</Label>
          {summary && <p className="mb-3 rounded-xl px-3 py-2 text-sm font-semibold" style={{ background: "color-mix(in srgb, var(--ag) 12%, transparent)" }}>{summary}</p>}
          <ul className="space-y-2">{quotes.map((t, i) => <li key={i} className="rounded-xl border-l-4 border-red-500/60 bg-bg-2 px-3 py-2 text-sm"><Rich text={t} /></li>)}</ul>
        </Card>
        <Card className="ring-good/30"><Label icon={Target}>{gaps.title}</Label><ul className="space-y-2">{gaps.items.map((t, i) => <li key={i} className="flex gap-2 text-[15px]"><Flame size={16} className="mt-1 shrink-0 text-good" aria-hidden /><span><Rich text={t} /></span></li>)}</ul></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="ring-good/30"><Label icon={ShieldCheck}>{win.title}</Label><ul className="space-y-2">{win.items.map((t, i) => <li key={i} className="flex gap-2 text-[15px]"><Check size={16} className="mt-1 shrink-0 text-good" aria-hidden /><span><Rich text={t} /></span></li>)}</ul></Card>
        <Card><Label icon={AlertTriangle}>{watch.title}</Label><ul className="space-y-2">{watch.items.map((t, i) => <li key={i} className="rounded-xl bg-red-500/[0.08] px-3 py-2 text-sm"><Rich text={t} /></li>)}</ul></Card>
      </div>
    </div>
  );
}

/* 4. Offer: value equation */
function OfferLayout(p: P) {
  const [eq, offer, bonus, nb] = [0, 1, 2, 3].map((i) => sec(p, i));
  const lever = (i: number) => {
    const t = eq.items[i] ?? "";
    const ok = /^[✓✔]/.test(t), bad = /^[✗✘]/.test(t);
    const [k, ...v] = strip(t).split(":");
    return (
      <div className={cn("flex-1 rounded-2xl p-4 text-left ring-2", ok ? "bg-good/10 ring-good/40" : bad ? "bg-red-500/10 ring-red-500/40" : "bg-fg/[0.04] ring-fg/10")}>
        <p className="flex items-center gap-1.5 text-sm font-bold">{ok ? <Check size={15} className="text-good" aria-hidden /> : bad ? <X size={15} className="text-red-500" aria-hidden /> : null}{k || ["Dream outcome", "Proof it works", "Speed", "Effort"][i]}</p>
        <p className="mt-1 text-sm text-muted">{v.join(":").trim()}</p>
      </div>
    );
  };
  return (
    <div className="space-y-4">
      <Card>
        <Label>{eq.title}</Label>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">{lever(0)}<span className="text-center text-2xl font-black text-muted">×</span>{lever(1)}</div>
        <div className="my-3 h-1 rounded-full" style={{ background: "var(--ag)" }} />
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">{lever(2)}<span className="text-center text-2xl font-black text-muted">×</span>{lever(3)}</div>
        <p className="mt-3 text-center text-xs text-muted">Value = (Dream outcome × Likelihood) ÷ (Time delay × Effort) · Alex Hormozi, $100M Offers</p>
      </Card>
      <div className="relative overflow-hidden rounded-2xl bg-fg p-6 text-bg">
        <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">THE OFFER</span>
        <p className="max-w-xl pr-16 text-xl font-bold leading-snug sm:text-2xl">{offer.items[0]}</p>
        {offer.items.slice(1).map((t, i) => <p key={i} className="mt-2 text-sm opacity-80"><Rich text={t} /></p>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label icon={Gift}>{bonus.title}</Label><div className="space-y-2">{bonus.items.map((t, i) => <div key={i} className="flex gap-3 rounded-xl border-2 border-dashed p-3 text-sm" style={{ borderColor: "color-mix(in srgb, var(--ag) 50%, transparent)" }}><Gift size={16} className="mt-0.5 shrink-0" style={{ color: "var(--ag)" }} aria-hidden /><Rich text={t} /></div>)}</div></div>
        <Card><Label>{nb.title}</Label><ul className="space-y-2">{nb.items.map((t, i) => <li key={i} className="flex gap-2 text-sm"><Check size={15} className="mt-0.5 shrink-0 text-good" aria-hidden /><Rich text={t} /></li>)}</ul></Card>
      </div>
    </div>
  );
}

/* 5. Build: kanban board + timeline */
function BuildLayout(p: P) {
  const [now, later, tools, plan] = [0, 1, 2, 3].map((i) => sec(p, i));
  const col = (s: Section, tone: string, Icon?: React.ElementType) => (
    <div className="flex min-w-0 flex-col rounded-2xl bg-fg/[0.03] p-3">
      <p className="mb-3 flex items-center justify-between px-1 text-sm font-bold"><span className="flex items-center gap-1.5">{Icon && <Icon size={14} aria-hidden />}{s.title}</span><span className="rounded-full bg-fg/10 px-2 text-xs">{s.items.length}</span></p>
      <div className="space-y-2">{s.items.map((t, i) => <div key={i} className={cn("rounded-xl bg-bg-2 p-3 text-sm shadow-sm ring-1 ring-fg/[0.06] border-l-4", tone)}><Rich text={t} /></div>)}</div>
    </div>
  );
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">{col(now, "border-orange-500")}{col(later, "border-fg/20")}{col(tools, "border-sky-500", Wrench)}</div>
      <Card><Label icon={CalendarDays}>{plan.title}</Label>
        <ol className="grid gap-3 md:grid-cols-4">{plan.items.map((t, i) => {
          const [when, ...rest] = t.split(":");
          return <li key={i} className="relative rounded-xl bg-bg-2 p-3 ring-1 ring-fg/[0.06]"><span className="mb-2 block h-1.5 rounded-full" style={{ background: "var(--ag)", opacity: 0.35 + i * 0.2 }} /><div className="flex items-center justify-between gap-1"><p className="text-xs font-bold" style={{ color: "var(--ag)" }}>{rest.length ? when : `Step ${i + 1}`}</p><AddGoal text={t} /></div><p className="mt-1 text-sm">{rest.length ? rest.join(":").trim() : t}</p></li>;
        })}</ol>
      </Card>
    </div>
  );
}

/* 6. Brand: brand board */
const SWATCH: [RegExp, string][] = [[/orange/i, "#F97316"], [/red/i, "#EF4444"], [/black/i, "#111111"], [/deep blue|navy/i, "#1E3A8A"], [/blue/i, "#3B82F6"], [/white|off-white/i, "#F8F8F5"], [/green/i, "#22C55E"], [/yellow/i, "#FACC15"], [/pink/i, "#EC4899"], [/gold|metallic/i, "#C9A227"]];
function BrandLayout(p: P) {
  const [names, tags, voice, look] = [0, 1, 2, 3].map((i) => sec(p, i));
  const sw = SWATCH.filter(([re]) => look.items.some((t) => re.test(t))).map(([, c]) => c).slice(0, 5);
  const styles = ["font-black tracking-tight", "font-light italic", "font-semibold uppercase tracking-widest text-base", "font-bold"];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <Card><Label>{tags.title}</Label>
          <div className="divide-y divide-fg/[0.08]">{tags.items.map((t, i) => <div key={i} className="flex items-center justify-between gap-3 py-3"><p className={cn("text-xl leading-snug", styles[i % styles.length])}><Rich text={t} /></p><CopyBtn text={t} /></div>)}</div>
        </Card>
        <Card><Label>{voice.title}</Label><ul className="space-y-2">{voice.items.map((t, i) => {
          const dont = /^don'?t/i.test(t), d = /^do\b/i.test(t);
          return <li key={i} className={cn("flex gap-2 rounded-xl px-3 py-2 text-sm", dont ? "bg-red-500/10" : d ? "bg-good/10" : "bg-fg/[0.04]")}>{dont ? <ThumbsDown size={14} className="mt-0.5 shrink-0 text-red-500" aria-hidden /> : <ThumbsUp size={14} className="mt-0.5 shrink-0 text-good" aria-hidden />}<Rich text={t} /></li>;
        })}</ul></Card>
      </div>
      <div className="space-y-4">
        <Card><Label>{look.title}</Label>
          <div className="mb-4 flex h-20 overflow-hidden rounded-xl ring-1 ring-fg/10">{(sw.length ? sw : ["var(--ag)", "#111111", "#F8F8F5"]).map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}</div>
          <ul className="space-y-2 text-sm">{look.items.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>
        </Card>
        <Card><Label>{names.title}</Label><ul className="space-y-2">{names.items.map((t, i) => <li key={i} className="flex gap-2 text-sm"><span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-fg/30" /><Rich text={t} /></li>)}</ul></Card>
      </div>
    </div>
  );
}

/* 7. Pitch: stage */
function PitchLayout(p: P) {
  const [one, pitch, deck, qs] = [0, 1, 2, 3].map((i) => sec(p, i));
  const words = (pitch.items[0] ?? "").split(/\s+/).filter(Boolean).length;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-fg/15 bg-bg-2 px-6 py-8 text-center">
        <Label>{one.title}</Label>
        <p className="serif mx-auto max-w-2xl text-[30px] leading-[1.08] sm:text-[36px]">{one.items[0]}</p>
      </div>
      <div className="rounded-2xl bg-fg p-6 text-bg">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="text-[12.5px] font-medium opacity-60">{pitch.title} · teleprompter</p><span className="rounded-full bg-white/10 px-3 py-1 text-xs">{words} words · ~{Math.round(words / 2.5)}s</span></div>
        <p className="text-lg leading-relaxed sm:text-xl">{pitch.items[0]}</p>
        <div className="mt-3"><CopyBtn text={pitch.items[0] ?? ""} label="Copy pitch" /></div>
      </div>
      <div><Label>{deck.title}</Label>
        <div className="flex gap-3 overflow-x-auto pb-2">{deck.items.map((t, i) => (
          <div key={i} className="aspect-video w-48 shrink-0 rounded-xl bg-bg-2 p-3 shadow ring-1 ring-fg/10"><p className="text-[10px] font-bold" style={{ color: "var(--ag)" }}>SLIDE {i + 1}</p><p className="mt-1 line-clamp-4 text-xs">{t.replace(/^\d+\.\s*/, "")}</p></div>
        ))}</div>
      </div>
      <Card><Label>{qs.title}</Label>
        <div className="grid gap-2 sm:grid-cols-2">{qs.items.map((q, i) => (
          <button key={i} type="button" onClick={() => setOpen(open === i ? null : i)} className="rounded-xl bg-bg-2 p-3 text-left text-sm ring-1 ring-fg/[0.08] transition hover:ring-fg/20">
            <span className="font-semibold">Q{i + 1}. {q}</span>
            {open === i && <span className="mt-2 block text-xs text-muted">Practice your answer out loud in under 20 seconds. Lead with a real fact or story.</span>}
          </button>
        ))}</div>
      </Card>
    </div>
  );
}

/* 8. Money: dashboard */
function MoneyLayout(p: P) {
  const [price, be, fund, basics] = [0, 1, 2, 3].map((i) => sec(p, i));
  const n = (be.items[0] ?? "").match(/=\s*(\d+)/)?.[1];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-2xl bg-fg p-6 text-bg">
          <p className="text-[12.5px] font-medium opacity-70">{be.title}</p>
          {n ? <><p className="mt-2 text-6xl font-black leading-none">{n}</p><p className="mt-1 opacity-80">paying customers to break even</p></> : <p className="mt-3 opacity-85">Add a price and monthly costs to see your number.</p>}
          {be.items.slice(n ? 0 : 0).map((t, i) => <p key={i} className="mt-3 text-sm opacity-75"><Rich text={t} /></p>)}
        </div>
        <Card><Label>{price.title}</Label><div className="space-y-2">{price.items.map((t, i) => <div key={i} className="flex gap-3 rounded-xl bg-bg-2 p-3 text-sm ring-1 ring-fg/[0.06]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-sm font-black text-white" style={{ background: "var(--ag)" }}>$</span><Rich text={t} /></div>)}</div></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><Label>{fund.title}</Label><ul className="space-y-2">{fund.items.map((t, i) => <li key={i} className="flex gap-2 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--ag)" }} /><Rich text={t} /></li>)}</ul></Card>
        <Card className="bg-amber/[0.07]"><Label icon={Scale}>{basics.title}</Label><ul className="space-y-2">{basics.items.map((t, i) => <li key={i} className="text-sm">• <Rich text={t} /></li>)}</ul></Card>
      </div>
    </div>
  );
}

/* 9. Sales: pipeline */
function SalesLayout(p: P) {
  const [who, scripts, obj, week] = [0, 1, 2, 3].map((i) => sec(p, i));
  return (
    <div className="space-y-4">
      <Card><Label icon={Target}>{who.title}</Label>
        <div className="space-y-2">{who.items.map((t, i) => <div key={i} className="mx-auto rounded-xl px-4 py-3 text-center text-sm text-white" style={{ width: `${100 - i * 12}%`, background: "var(--ag)", opacity: 1 - i * 0.18 }}><Rich text={t} /></div>)}</div>
      </Card>
      <div className="grid gap-3 md:grid-cols-3">{scripts.items.map((t, i) => {
        const m = t.match(/^([\w -]+?)(?:\s*\([^)]*\))?:\s*(.*)$/s);
        const tag = m ? m[1] : ["Warm", "Cold", "Follow-up"][i] ?? "Script";
        const body = (m ? m[2] : t).replace(/^"|"$/g, "");
        return <div key={i} className="flex flex-col rounded-2xl bg-bg-2 p-4 ring-1 ring-fg/10"><div className="mb-2 flex items-center justify-between"><span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: "var(--ag)" }}>{tag}</span><CopyBtn text={body} /></div><p className="flex-1 text-sm">{body}</p></div>;
      })}</div>
      <Card><Label>{obj.title}</Label>
        <div className="space-y-2">{obj.items.map((t, i) => {
          const m = t.match(/^[“"]?(.+?)[”"]?:\s*(.*)$/);
          return <div key={i} className="grid gap-2 sm:grid-cols-2"><p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm"><b>They say:</b> {m ? m[1].replace(/["“”]/g, "") : t}</p><p className="rounded-xl bg-good/10 px-3 py-2 text-sm"><b>You say:</b> {m ? m[2] : "Agree, then reframe around the outcome."}</p></div>;
        })}</div>
      </Card>
      <div><Label icon={CalendarDays}>{week.title}</Label>
        <div className="grid gap-2 sm:grid-cols-4">{week.items.map((t, i) => { const [d, ...r] = t.split(":"); return <div key={i} className="rounded-xl bg-fg/[0.04] p-3"><div className="flex items-center justify-between gap-1"><p className="text-xs font-bold" style={{ color: "var(--ag)" }}>{r.length ? d : `Day ${i + 1}`}</p><AddGoal text={t} /></div><p className="mt-1 text-sm">{r.length ? r.join(":").trim() : t}</p></div>; })}</div>
      </div>
    </div>
  );
}

/* 10. Launch: mission control */
function LaunchLayout(p: P) {
  const [where, sites, drafts, weeks, check, nums] = [0, 1, 2, 3, 4, 5].map((i) => sec(p, i));
  const [done, setDone] = useState<number[]>([]);
  const pct = Math.round((done.length / Math.max(1, check.items.length)) * 100);
  const split = (t: string) => { const k = t.indexOf(": "); return k > 0 && k < 70 ? [t.slice(0, k), t.slice(k + 2)] : ["", t]; };
  return (
    <div className="space-y-4">
      <div><Label icon={CalendarDays}>{weeks.title}</Label>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{weeks.items.map((t, i) => { const [w, r] = split(t); return <div key={i} className="rounded-2xl p-4 ring-1 ring-fg/[0.08]" style={{ background: `color-mix(in srgb, var(--ag) ${8 + i * 6}%, transparent)` }}><div className="flex items-center justify-between gap-1"><p className="text-[12.5px] font-semibold" style={{ color: "var(--ag)" }}>{w || `Week ${i + 1}`}</p><AddGoal text={t} /></div><p className="mt-1 text-sm"><Rich text={r} /></p></div>; })}</div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><Label icon={Users}>{where.title}</Label><ul className="space-y-2.5">{where.items.map((t, i) => { const [n, r] = split(t); return <li key={i} className="rounded-xl bg-bg-2 px-3 py-2.5 text-sm ring-1 ring-fg/[0.06]">{n && <p className="font-semibold">{n}</p>}<p className={n ? "mt-0.5 text-muted" : ""}><Rich text={r} /></p></li>; })}</ul></Card>
        <Card><Label icon={Rocket}>{sites.title}</Label><ul className="space-y-2.5">{sites.items.map((t, i) => { const [n, r] = split(t); return <li key={i} className="rounded-xl bg-bg-2 px-3 py-2.5 text-sm ring-1 ring-fg/[0.06]"><p className="flex items-center gap-2 font-semibold"><span className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-black text-white" style={{ background: "var(--ag)" }}>{i + 1}</span>{n || `Site ${i + 1}`}</p><p className="mt-0.5 text-muted"><Rich text={r} /></p></li>; })}</ul></Card>
      </div>
      <div><Label icon={MessageSquare}>{drafts.title}</Label>
        <div className="grid gap-3 md:grid-cols-2">{drafts.items.map((t, i) => { const [n, r] = split(t); return (
          <div key={i} className="flex flex-col rounded-2xl bg-bg-2 p-4 ring-1 ring-fg/10">
            <div className="mb-2 flex items-center justify-between gap-2"><p className="text-[12.5px] font-semibold" style={{ color: "var(--ag)" }}>{n || `Post ${i + 1}`}</p><CopyBtn text={r.replace(/^"|"$/g, "")} label="Copy post" /></div>
            <p className="whitespace-pre-line text-sm leading-relaxed"><Rich text={r} /></p>
          </div>); })}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-2xl bg-fg p-5 text-bg">
          <div className="flex items-center justify-between"><p className="text-[12.5px] font-medium opacity-60">{check.title}</p><span className="text-sm font-bold" style={{ color: "var(--ag)" }}>{pct}% ready</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--ag)" }} /></div>
          <ul className="mt-4 space-y-2">{check.items.map((t, i) => { const on = done.includes(i); return (
            <li key={i}><button type="button" role="checkbox" aria-checked={on} onClick={() => setDone(on ? done.filter((x) => x !== i) : [...done, i])} className="flex w-full gap-2.5 text-left text-sm"><span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border", on ? "border-transparent text-white" : "border-white/30")} style={on ? { background: "var(--ag)" } : undefined}>{on && <Check size={12} aria-hidden />}</span><span className={on ? "text-white/50 line-through" : ""}>{t}</span></button></li>
          ); })}</ul>
        </div>
        <div className="grid grid-cols-2 gap-3">{nums.items.map((t, i) => <div key={i} className="rounded-2xl bg-fg/[0.04] p-4 ring-1 ring-fg/[0.06]"><p className="text-3xl font-black text-muted">—</p><p className="mt-1 text-sm"><Rich text={t} /></p></div>)}</div>
      </div>
    </div>
  );
}

/* 11. Content: studio */
function ContentLayout(p: P) {
  const [pillars, posts, hooks, sched] = [0, 1, 2, 3].map((i) => sec(p, i));
  const tones = ["#8B5CF6", "#EC4899", "#0EA5E9", "#F59E0B"];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{pillars.items.map((t, i) => { const [k, ...r] = t.split(":"); return <div key={i} className="rounded-2xl p-4 text-white" style={{ background: tones[i % 4] }}><p className="text-xs font-bold uppercase tracking-wider opacity-75">Pillar {i + 1}</p><p className="mt-1 font-bold">{r.length ? k : t}</p>{r.length > 0 && <p className="mt-1 text-sm opacity-85">{r.join(":").trim()}</p>}</div>; })}</div>
      <div><Label>{posts.title}</Label>
        <div className="flex gap-3 overflow-x-auto pb-2">{posts.items.map((t, i) => (
          <div key={i} className="relative flex aspect-[9/16] w-36 shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-3 text-white" style={{ background: `linear-gradient(180deg, ${tones[i % 4]}55, #0B0D14 75%)` }}>
            <span className="absolute left-2 top-2 rounded-md bg-black/40 px-1.5 text-[10px] font-bold">#{i + 1}</span>
            <p className="text-xs font-semibold leading-snug"><Rich text={t} /></p>
          </div>
        ))}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><Label>{hooks.title}</Label><div className="space-y-2">{hooks.items.map((t, i) => <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-bg-2 px-3 py-2 ring-1 ring-fg/[0.08]"><p className="text-sm font-semibold"><Rich text={t} /></p><CopyBtn text={t.replace(/^"|"$/g, "")} /></div>)}</div></Card>
        <Card><Label icon={CalendarDays}>{sched.title}</Label><ul className="space-y-2">{sched.items.map((t, i) => <li key={i} className="flex gap-2 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--ag)" }} /><Rich text={t} /></li>)}</ul></Card>
      </div>
    </div>
  );
}

/* 12. Investor: data room */
function InvestorLayout(p: P) {
  const [ready, who, email, legal] = [0, 1, 2, 3].map((i) => sec(p, i));
  const subject = email.items.find((t) => /^subject:/i.test(t));
  const body = email.items.filter((t) => t !== subject);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card><Label icon={ShieldCheck}>{ready.title}</Label><ul className="space-y-2">{ready.items.map((t, i) => <li key={i} className="flex gap-2 rounded-xl bg-bg-2 px-3 py-2 text-sm ring-1 ring-fg/[0.06]"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: "var(--ag)" }}>{i + 1}</span><Rich text={t} /></li>)}</ul></Card>
        <Card><Label>{who.title}</Label><ol className="space-y-2">{who.items.map((t, i) => <li key={i} className="flex gap-3 text-sm"><span className="font-black" style={{ color: "var(--ag)" }}>{String(i + 1).padStart(2, "0")}</span><Rich text={t} /></li>)}</ol></Card>
      </div>
      <div className="overflow-hidden rounded-2xl bg-bg-2 ring-1 ring-fg/10">
        <div className="flex items-center gap-2 border-b border-fg/[0.08] px-4 py-2.5"><Mail size={15} style={{ color: "var(--ag)" }} aria-hidden /><span className="text-sm font-semibold">{email.title}</span><span className="ml-auto"><CopyBtn text={[subject, ...body].filter(Boolean).join("\n\n")} label="Copy email" /></span></div>
        {subject && <p className="border-b border-fg/[0.06] px-4 py-2 text-sm"><span className="text-muted">Subject </span>{subject.replace(/^subject:\s*/i, "")}</p>}
        <div className="space-y-3 px-4 py-4 text-sm leading-relaxed">{body.map((t, i) => <p key={i} className={i === body.length - 1 && body.length > 1 ? "text-xs text-muted" : ""}>{t.replace(/^"|"$/g, "")}</p>)}</div>
      </div>
      <section className="rounded-2xl border-2 border-amber/40 bg-amber/[0.07] p-5"><p className="mb-3 flex items-center gap-2 text-[12.5px] font-medium text-amber"><Scale size={14} aria-hidden />{legal.title}</p><ul className="space-y-2">{legal.items.map((t, i) => <li key={i} className="flex gap-2 text-sm"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber" aria-hidden /><Rich text={t} /></li>)}</ul></section>
    </div>
  );
}

const LAYOUTS: Record<AgentId, (p: P) => React.ReactNode> = {
  idea: IdeaLayout, customer: CustomerLayout, competitor: CompetitorLayout, offer: OfferLayout, build: BuildLayout, brand: BrandLayout,
  pitch: PitchLayout, money: MoneyLayout, sales: SalesLayout, launch: LaunchLayout, content: ContentLayout, investor: InvestorLayout,
};

const USED: Partial<Record<AgentId, number>> = { competitor: 6, launch: 6 };
export function AgentResultView({ agentId, sections, titles, startup, research, ai }: { agentId: AgentId; sections: Section[]; titles: string[]; startup: string; research?: Research; ai?: boolean }) {
  const L = LAYOUTS[agentId];
  const extra = sections.slice(USED[agentId] ?? 4).filter((x) => x.items.length);
  return (
    <>
      <L s={sections} titles={titles} startup={startup} research={research} ai={ai} />
      {extra.length > 0 && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">{extra.map((x) => (
          <Card key={x.title}><Label>{x.title}</Label><ul className="space-y-2">{x.items.map((t, i) => <li key={i} className="flex gap-2 text-[15px]"><Check size={16} className="mt-1 shrink-0" style={{ color: "var(--ag)" }} aria-hidden /><span><Rich text={t} /></span></li>)}</ul></Card>
        ))}</div>
      )}
    </>
  );
}
