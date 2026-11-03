"use client";
import { useState } from "react";
import { PlaybookCard } from "@/components/cofounder/PlaybookCard";
import { BuddySays } from "@/components/cofounder/Pip";
import { AGENTS } from "@/lib/agents";
import { PLAYBOOKS } from "@/lib/cofounder/playbooks";
import { useWorkspace } from "@/lib/cofounder/profile";
import { cn } from "@/lib/utils";

export default function PlaybooksPage() {
  const { ws } = useWorkspace();
  const [who, setWho] = useState("All");
  const people = ["All", ...Array.from(new Set(PLAYBOOKS.map((p) => p.who)))];
  const list = PLAYBOOKS.filter((p) => who === "All" || p.who === who);
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div>
        <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">Playbooks</h2>
        <p className="mt-2 max-w-2xl text-muted">{PLAYBOOKS.length} frameworks from founders and investors like Alex Hormozi, Bill Gates, Paul Graham and Peter Thiel, each with a step you can take today. Your agents use them too.</p>
      </div>
      <BuddySays character={ws.prefs.character} size={60}>These are summaries of their public books and essays, with the source on every card. Read the originals when one clicks for you!</BuddySays>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by person">
        {people.map((p) => <button key={p} type="button" aria-pressed={who === p} onClick={() => setWho(p)} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition", who === p ? "bg-fg text-bg" : "bg-fg/[0.05] text-muted hover:text-fg")}>{p}</button>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <div key={p.id}>
            <PlaybookCard p={p} className="h-full" />
            <p className="mt-1.5 px-2 text-xs text-muted">Used by: {AGENTS.filter((a) => a.playbooks.includes(p.id)).map((a) => `${a.name} agent`).join(", ") || "Pip's daily tip"}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted">LevelUp is not affiliated with or endorsed by anyone named here.</p>
    </div>
  );
}
