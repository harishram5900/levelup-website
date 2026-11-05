"use client";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, Globe, Loader2, Radar, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { BuddySays } from "@/components/cofounder/Pip";
import { AGES, OPP_TYPES, OPPORTUNITIES, REGIONS, matchOpportunities, type Age, type OppType } from "@/lib/cofounder/opportunities";
import { fetchResearch } from "@/lib/cofounder/runAgent";
import type { Research } from "@/lib/server/research";
import { useWorkspace } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import Link from "next/link";
import { ProBadge } from "@/components/cofounder/ProGate";
import { usePlan } from "@/lib/cofounder/plan";

const TYPE_TONE: Record<OppType, string> = {
  Competition: "bg-amber/15 text-amber", Hackathon: "bg-cyan/15 text-cyan", Program: "bg-violet/15 text-violet", Fellowship: "bg-pink-500/15 text-pink-500",
  Grant: "bg-good/15 text-good", Scholarship: "bg-orange-500/15 text-orange-500", Credits: "bg-sky-500/15 text-sky-500", Accelerator: "bg-fuchsia-500/15 text-fuchsia-500", Investor: "bg-emerald-500/15 text-emerald-500",
};

export default function OpportunitiesPage() {
  const { ws, ready, update } = useWorkspace();
  const [q, setQ] = useState("");
  const [type, setType] = useState<OppType | "All" | "Saved" | "For you">("For you");
  const [age, setAge] = useState<Age | "All">("All");
  const [region, setRegion] = useState<string>("All");
  const [niche, setNiche] = useState("");
  const [live, setLive] = useState<Research | null>(null);
  const [searching, setSearching] = useState(false);
  const stage = ws.profile?.stage;
  const { pro } = usePlan();

  const p = ws.profile;
  // "For you" ranks every opportunity by stage, niche tags and region, best first.
  const ranked = useMemo(() => (p ? matchOpportunities({ text: `${p.idea} ${p.customer} ${p.startup} ${niche}`, stage: p.stage, limit: OPPORTUNITIES.length }) : OPPORTUNITIES), [p, niche]);
  const list = useMemo(() => (type === "For you" ? ranked : OPPORTUNITIES).filter((o) => {
    if (type === "Saved" && !ws.saved.includes(o.id)) return false;
    if (type === "For you" && stage && !o.stage.includes(stage)) return false;
    if (region !== "All" && o.region !== region && o.region !== "Global") return false;
    if (type !== "All" && type !== "Saved" && type !== "For you" && o.type !== type) return false;
    if (age !== "All" && !o.ages.includes(age) && !o.ages.includes("Any age")) return false;
    const s = q.trim().toLowerCase();
    return !s || `${o.name} ${o.org} ${o.what} ${o.type} ${o.tags.join(" ")} ${o.region}`.toLowerCase().includes(s);
  }), [q, type, age, region, ws.saved, stage, ranked]);
  const findMore = async () => {
    if (!p) return;
    setSearching(true);
    setLive((await fetchResearch("opportunities", p, niche.trim(), [age !== "All" ? `Founder is in ${age}` : "", region !== "All" ? `Based in ${region}` : ""].filter(Boolean).join(". "))) ?? null);
    setSearching(false);
  };

  const toggle = (id: string) => update((w) => ({ ...w, saved: w.saved.includes(id) ? w.saved.filter((x) => x !== id) : [...w.saved, id] }));
  const counts = (t: OppType) => OPPORTUNITIES.filter((o) => o.type === t).length;
  if (!ready) return null;

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">Opportunities</h2>
          <p className="mt-2 max-w-2xl text-muted">{OPPORTUNITIES.length} verified competitions, hackathons, programs, fellowships, grants, scholarships, free credits, accelerators and investors, plus a live search for open ones.</p>
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search opportunities</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input data-tour="opp-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full rounded-full hairline bg-bg-2/60 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet/60" />
        </label>
      </div>

      <BuddySays character={ws.prefs.character} mood="happy" size={64}>
        {stage ? <>&ldquo;For you&rdquo; shows what fits a startup that's <b>{stage === "idea" ? "just an idea" : stage === "building" ? "being built" : "launched"}</b>. Save the ones you like. Always check the official site for deadlines and age rules.</> : <>Save the ones you like. Always check the official site for deadlines and age rules.</>}
        {" "}<span className="text-muted">Under 18? Most investors and accelerators need a parent or guardian, and often a registered company.</span>
      </BuddySays>

      {p && (
        <section className="glass rounded-[24px] p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet/15 text-violet"><Radar size={20} aria-hidden /></span>
            <div className="min-w-0 flex-1"><p className="font-semibold">Find more for {p.startup}</p><p className="text-sm text-muted">Searches open hackathons on Devpost right now{pro ? ", plus deep web research for competitions, grants and fellowships in your niche" : ""}.</p></div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); findMore(); }} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="opp-niche">Your niche</label>
            <input id="opp-niche" value={niche} onChange={(e) => setNiche(e.target.value)} maxLength={80} placeholder={`Your niche, e.g. "${p.idea.split(" ").slice(0, 4).join(" ")}"`} className="w-full flex-1 rounded-full hairline bg-bg-2/60 px-4 py-2.5 text-sm outline-none focus:border-violet/60" />
            <button type="submit" disabled={searching} className="btn-play py-2.5 text-sm">{searching ? <><Loader2 size={16} className="animate-spin" aria-hidden /> Searching…</> : <><Search size={16} aria-hidden /> Search live</>}</button>
          </form>
          {live && (
            <div className="mt-5 space-y-4">
              {live.web.length > 0 && (
                <div><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet"><Globe size={13} aria-hidden /> Found on the web for your niche · {live.web.length}</p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{live.web.map((f, i) => (
                    <a key={i} href={f.url} target="_blank" rel="noopener noreferrer nofollow" className="rounded-2xl bg-fg/[0.04] p-4 ring-1 ring-fg/[0.06] transition hover:ring-violet/50"><p className="font-semibold">{f.name}</p>{f.meta && <p className="mt-0.5 text-xs font-semibold text-amber">{f.meta}</p>}{f.detail && <p className="mt-1.5 text-sm text-muted">{f.detail}</p>}</a>
                  ))}</div>
                </div>
              )}
              <div><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan">Open hackathons right now · {live.hackathons.length}</p>
                {live.hackathons.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{live.hackathons.map((f, i) => (
                  <a key={i} href={f.url} target="_blank" rel="noopener noreferrer nofollow" className="rounded-2xl bg-fg/[0.04] p-4 ring-1 ring-fg/[0.06] transition hover:ring-cyan/50"><p className="font-semibold">{f.name}</p>{f.meta && <p className="mt-0.5 text-xs font-semibold text-cyan">{f.meta}</p>}{f.detail && <p className="mt-1.5 text-sm text-muted">{f.detail}</p>}</a>
                ))}</div> : <p className="text-sm text-muted">Nothing came back right now. Try again in a minute.</p>}
              </div>
              {!pro && <p className="text-sm text-muted"><Link href="/app/upgrade" className="font-semibold text-amber">Pro</Link> adds deep web research: open competitions, grants, fellowships and scholarships matched to your niche, age and country.</p>}
            </div>
          )}
        </section>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {(["For you", "All", "Saved", ...OPP_TYPES] as const).map((t) => (
          <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)}
            className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition", type === t ? "bg-fg text-bg" : "bg-fg/[0.05] text-muted hover:text-fg")}>
            {t === "For you" && <Sparkles size={13} className="mr-1 inline" aria-hidden />}{t}
            <span className="ml-1.5 text-xs opacity-60">{t === "All" ? OPPORTUNITIES.length : t === "Saved" ? ws.saved.length : t === "For you" ? "" : counts(t)}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by age">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Age</span>
        {(["All", ...AGES] as const).map((a) => (
          <button key={a} type="button" aria-pressed={age === a} onClick={() => setAge(a)} className={cn("rounded-lg border px-2.5 py-1 text-xs font-semibold transition", age === a ? "border-violet bg-violet/10 text-violet" : "border-fg/10 text-muted hover:text-fg")}>{a}</button>
        ))}
        <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-muted">Region</span>
        <label className="sr-only" htmlFor="opp-region">Region</label>
        <select id="opp-region" value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-lg border border-fg/10 bg-bg-2 px-2 py-1 text-xs font-semibold">
          {["All", ...REGIONS].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {list.length === 0 && <p className="rounded-2xl bg-fg/[0.04] p-8 text-center text-muted">{type === "Saved" ? "Nothing saved yet. Tap the bookmark on any card." : "No matches. Try another filter."}</p>}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((o, i) => {
          const saved = ws.saved.includes(o.id);
          if (o.type === "Investor" && !pro) return (
            <motion.article key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.03 }} className="glass relative flex flex-col overflow-hidden rounded-[22px] p-5">
              <div className="flex items-start justify-between gap-3"><span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", TYPE_TONE[o.type])}>{o.type}</span><ProBadge /></div>
              <h3 className="mt-3 font-display text-3xl uppercase leading-none blur-[6px] select-none" aria-hidden>{o.name}</h3>
              <p className="mt-3 flex-1 text-[15px] blur-[5px] select-none" aria-hidden>{o.what}</p>
              <div className="absolute inset-0 grid place-items-center bg-bg/30">
                <Link href="/app/upgrade" className="btn-play px-4 py-2 text-sm"><Lock size={14} aria-hidden /> Unlock investors with Pro</Link>
              </div>
            </motion.article>
          );
          return (
            <motion.article key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.03 }} className="glass flex flex-col rounded-[22px] p-5">
              <div className="flex items-start justify-between gap-3">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", TYPE_TONE[o.type])}>{o.type}</span>
                <button type="button" onClick={() => toggle(o.id)} aria-pressed={saved} aria-label={saved ? `Unsave ${o.name}` : `Save ${o.name}`} className={cn("btn-icon", saved && "text-amber")}>{saved ? <BookmarkCheck size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />}</button>
              </div>
              <h3 className="mt-3 font-display text-3xl uppercase leading-none">{o.name}</h3>
              <p className="mt-1 text-sm font-semibold text-muted">{o.org}</p>
              <p className="mt-3 flex-1 text-[15px]">{o.what}</p>
              <p className="mt-3 rounded-xl bg-fg/[0.04] px-3 py-2 text-sm"><b className="text-amber">You get:</b> {o.perk}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-xs text-muted">{o.ages.join(" · ")}{o.region !== "Global" ? ` · ${o.region}` : ""}</span>
                <a href={o.url} target="_blank" rel="noopener noreferrer" className="btn-soft py-2 text-sm">Official site <ExternalLink size={14} aria-hidden /></a>
              </div>
            </motion.article>
          );
        })}
      </div>
      <p className="text-center text-xs text-muted">Listed for information only. LevelUp isn't affiliated with these organizations. Details change every year; confirm on each official site.</p>
    </div>
  );
}
