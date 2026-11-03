"use client";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { BuddySays } from "@/components/cofounder/Pip";
import { AGES, OPP_TYPES, OPPORTUNITIES, type Age, type OppType } from "@/lib/cofounder/opportunities";
import { useWorkspace } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";

const TYPE_TONE: Record<OppType, string> = {
  Competition: "bg-amber/15 text-amber", Hackathon: "bg-cyan/15 text-cyan", Program: "bg-violet/15 text-violet", Fellowship: "bg-pink-500/15 text-pink-500",
  Grant: "bg-good/15 text-good", Credits: "bg-sky-500/15 text-sky-500", Accelerator: "bg-fuchsia-500/15 text-fuchsia-500", Investor: "bg-emerald-500/15 text-emerald-500",
};

export default function OpportunitiesPage() {
  const { ws, ready, update } = useWorkspace();
  const [q, setQ] = useState("");
  const [type, setType] = useState<OppType | "All" | "Saved" | "For you">("For you");
  const [age, setAge] = useState<Age | "All">("All");
  const stage = ws.profile?.stage;

  const list = useMemo(() => OPPORTUNITIES.filter((o) => {
    if (type === "Saved" && !ws.saved.includes(o.id)) return false;
    if (type === "For you" && stage && !o.stage.includes(stage)) return false;
    if (type !== "All" && type !== "Saved" && type !== "For you" && o.type !== type) return false;
    if (age !== "All" && !o.ages.includes(age) && !o.ages.includes("Any age")) return false;
    const s = q.trim().toLowerCase();
    return !s || `${o.name} ${o.org} ${o.what} ${o.type}`.toLowerCase().includes(s);
  }), [q, type, age, ws.saved, stage]);

  const toggle = (id: string) => update((w) => ({ ...w, saved: w.saved.includes(id) ? w.saved.filter((x) => x !== id) : [...w.saved, id] }));
  const counts = (t: OppType) => OPPORTUNITIES.filter((o) => o.type === t).length;
  if (!ready) return null;

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">Opportunities</h2>
          <p className="mt-2 max-w-2xl text-muted">{OPPORTUNITIES.length} competitions, programs, grants, free credits, accelerators and investors for young founders.</p>
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
      </div>

      {list.length === 0 && <p className="rounded-2xl bg-fg/[0.04] p-8 text-center text-muted">{type === "Saved" ? "Nothing saved yet. Tap the bookmark on any card." : "No matches. Try another filter."}</p>}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((o, i) => {
          const saved = ws.saved.includes(o.id);
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
                <span className="text-xs text-muted">{o.ages.join(" · ")}</span>
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
