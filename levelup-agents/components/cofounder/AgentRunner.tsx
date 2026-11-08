"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy, Crown, Loader2, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AGENTS, WORLDS, type AgentId } from "@/lib/agents";
import { ease } from "@/lib/motion";
import { XP } from "@/lib/cofounder/game";
import { playbookById } from "@/lib/cofounder/playbooks";
import { useWorkspace } from "@/lib/cofounder/profile";
import { runAgent } from "@/lib/cofounder/runAgent";
import { cn } from "@/lib/utils";
import { Buddy, BuddySays, characterById } from "./Pip";
import { PlaybookCard } from "./PlaybookCard";
import { ProGate } from "./ProGate";
import { AGENT_STYLE, AgentResultView } from "./AgentLayouts";
import { Icon3D } from "@/components/ui/Icon3D";

// These agents put their questions on top and use the full width for results.
const TOP_FORM: AgentId[] = ["competitor", "customer", "brand", "pitch", "content", "launch", "sales"];
import { FREE_ITEMS, isProAgent, usePlan } from "@/lib/cofounder/plan";
import { deepDive, deepDiveTitles } from "@/lib/cofounder/proExtras";
import { Lock } from "lucide-react";
import { haptic } from "@/lib/native";
import { xpToast } from "./XpToast";

/** One agent's workspace: answer a few questions, get a document you can copy and use. */
// Takes an id (not the agent object) so a server page can render it: icons are functions.
export function AgentRunner({ agentId }: { agentId: AgentId }) {
  const agent = AGENTS.find((a) => a.id === agentId)!;
  const { ws, ready, update } = useWorkspace();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [copied, setCopied] = useState(false);
  const result = ws.results[agent.id];
  const nextAgent = AGENTS[AGENTS.findIndex((a) => a.id === agent.id) + 1];
  const ch = ws.prefs.character;
  const buddy = characterById(ch);
  const plan = usePlan();

  useEffect(() => { if (ready) setAnswers(ws.answers[agent.id] ?? {}); }, [ready, agent.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;
  if (!ws.profile) {
    return (
      <div className="glass mx-auto max-w-xl rounded-[24px] p-8 text-center">
        <Buddy character={ch} mood="wave" size={100} className="mx-auto" />
        <p className="mt-4 font-display text-4xl uppercase">Set up your Startup HQ first</p>
        <p className="mt-3 text-muted">Your agents need to know your startup before they can help. It takes one minute.</p>
        <Link href="/app" className="btn-play mt-6">Set up HQ <ArrowRight size={16} aria-hidden /></Link>
      </div>
    );
  }
  const profile = ws.profile;
  if (isProAgent(agent.id) && !plan.ready) return null;
  if (isProAgent(agent.id) && !plan.pro) return <ProGate title={`${agent.name} agent`} line={agent.line} />;

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await runAgent(agent.id, profile, answers, setStep);
    update((w) => ({ ...w, results: { ...w.results, [agent.id]: r }, answers: { ...w.answers, [agent.id]: answers } }));
    setLoading(false);
    haptic("success");
    if (!result) xpToast(XP.agent);
    // On phones the result is below the form: bring it into view.
    if (window.innerWidth < 1280) requestAnimationFrame(() => document.getElementById("agent-results")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const copy = async () => {
    if (!result) return;
    const txt = `${agent.name} agent · ${profile.startup}\n\n` + result.sections.map((s) => `${s.title}\n${(plan.pro ? s.items : s.items.slice(0, FREE_ITEMS)).map((i) => `- ${i}`).join("\n")}`).join("\n\n")
      + (plan.pro ? "\n\nPRO DEEP DIVE\n\n" + deepDive(agent.id, profile, answers).map((s) => `${s.title}\n${s.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n") : "");
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };
  const Icon = agent.icon;
  const input = "w-full rounded-xl hairline bg-bg-2/60 px-4 py-3 text-[15px] outline-none transition-colors focus:border-violet/60";
  const books = agent.playbooks.map(playbookById).filter(Boolean);

  const st = AGENT_STYLE[agent.id];
  const top = TOP_FORM.includes(agent.id);

  const form = (
    <form onSubmit={run} className={cn("glass h-fit rounded-[24px] p-6", top ? "space-y-4" : "space-y-5")} data-tour="agent-form">
      <p className="text-sm font-semibold">Answer what you can <span className="font-normal text-muted">· every question is optional</span></p>
      <div className={cn(top ? "grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 xl:grid-cols-3" : "space-y-5")}>
        {agent.fields.map((f) => (
          <div key={f.id}>
            <label htmlFor={`f-${f.id}`} className="mb-2 block text-sm font-semibold">{f.label}</label>
            {f.long
              ? <textarea id={`f-${f.id}`} rows={top ? 2 : 3} className={cn(input, "resize-y")} placeholder={f.placeholder} value={answers[f.id] ?? ""} onChange={(e) => setAnswers({ ...answers, [f.id]: e.target.value })} maxLength={600} />
              : <input id={`f-${f.id}`} className={input} placeholder={f.placeholder} value={answers[f.id] ?? ""} onChange={(e) => setAnswers({ ...answers, [f.id]: e.target.value })} maxLength={200} />}
          </div>
        ))}
      </div>
      <div className={cn(top && "flex flex-wrap items-center gap-4")}>
        <button type="submit" disabled={loading} className={cn("btn-play", !top && "w-full")}>
          {loading ? <><Loader2 size={18} className="animate-spin" aria-hidden /> Working on it…</> : <><Wand2 size={18} aria-hidden /> {result ? "Run again" : `Run the ${agent.name} agent`}{!result && <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">+{XP.agent} XP</span>}</>}
        </button>
        <p className={cn("text-xs text-muted", !top && "mt-3")}>Uses your Startup HQ info: {profile.startup}, for {profile.customer}.</p>
      </div>
    </form>
  );

  const playbooks = books.length > 0 && (
    <section className="glass rounded-[24px] p-5" data-tour="agent-playbook">
      <p className="kicker">Playbook from the greats</p>
      <p className="mt-1 text-sm text-muted">{buddy.name} uses these frameworks for this agent.</p>
      <div className={cn("mt-4 gap-3", top ? "grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 xl:grid-cols-3" : "space-y-3")}>{books.map((p) => <PlaybookCard key={p!.id} p={p!} compact />)}</div>
    </section>
  );

  const results = (
    <div id="agent-results" className="glass min-h-[420px] scroll-mt-20 rounded-[24px] p-5 sm:p-7" aria-live="polite">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid h-full min-h-[360px] place-items-center text-center">
            <div>
              <Buddy character={ch} mood={loading ? "think" : "happy"} size={110} className="mx-auto mb-4" />
              <p className="font-display text-3xl">{loading ? `${buddy.name} is on it` : `Your ${st.layout.toLowerCase()} appears here`}</p>
              {loading && step && <p className="mx-auto mt-2 max-w-md animate-pulse text-sm font-semibold" style={{ color: "var(--ag)" }}>{step}</p>}
              <p className="mx-auto mt-2 max-w-md text-muted">You'll get: {agent.sections.join(" · ")}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key={result.at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-3xl leading-none">{st.layout} · {profile.startup}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">{result.source === "ai" ? <><Sparkles size={12} style={{ color: "var(--ag)" }} aria-hidden /> Written by AI for your startup</> : "Guided plan built from your answers"}</p>
              </div>
              <button type="button" onClick={copy} className="btn-glass py-2 text-sm"><Copy size={14} aria-hidden /> {copied ? "Copied" : "Copy all"}</button>
            </div>
            <AgentResultView agentId={agent.id} sections={plan.pro ? result.sections : result.sections.map((x) => ({ ...x, items: x.items.slice(0, FREE_ITEMS) }))} titles={agent.sections} startup={profile.startup} research={result.research} ai={result.source === "ai"} />
            {plan.pro ? (
              <section className="mt-6 rounded-2xl p-5 ring-1" style={{ background: "color-mix(in srgb, var(--ag) 8%, transparent)", borderColor: "var(--ag)" }}>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "var(--ag)" }}><Crown size={14} aria-hidden /> Pro deep dive</p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {deepDive(agent.id, profile, answers).map((x) => (
                    <div key={x.title} className="rounded-2xl bg-bg-2/70 p-4 ring-1 ring-fg/[0.06]">
                      <p className="font-semibold">{x.title}</p>
                      <ul className="mt-2 space-y-2 text-sm">{x.items.map((it, k) => <li key={k} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0" style={{ color: "var(--ag)" }} aria-hidden />{it}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="relative mt-6 overflow-hidden rounded-2xl p-5 ring-1 ring-amber/40">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber"><Lock size={14} aria-hidden /> Pro deep dive · {deepDiveTitles(agent.id).length} advanced sections</p>
                <p className="mt-1 text-sm text-muted">You're seeing the top {FREE_ITEMS} points of each section. Pro unlocks every point plus:</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {deepDiveTitles(agent.id).map((title) => (
                    <div key={title} className="rounded-xl bg-fg/[0.04] p-3"><p className="font-semibold">{title}</p><div className="mt-2 space-y-1.5 blur-[3px]" aria-hidden><div className="h-2 w-11/12 rounded bg-fg/20" /><div className="h-2 w-9/12 rounded bg-fg/20" /><div className="h-2 w-10/12 rounded bg-fg/20" /></div></div>
                  ))}
                </div>
                <Link href="/app/upgrade" className="btn-play mt-4"><Crown size={16} aria-hidden /> Unlock the full plan</Link>
              </section>
            )}
            {nextAgent && !(isProAgent(nextAgent.id) && !plan.pro) ? (
              <Link href={`/app/agents/${nextAgent.id}`} className="group mt-6 flex items-center justify-between gap-4 rounded-2xl p-5 ring-1 transition-colors" style={{ background: `color-mix(in srgb, ${AGENT_STYLE[nextAgent.id].color} 12%, transparent)`, borderColor: AGENT_STYLE[nextAgent.id].color }}>
                <span><span className="kicker">Next quest · +{XP.agent} XP</span><span className="mt-1 block font-semibold">{nextAgent.name} agent: {nextAgent.stage}</span></span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            ) : (
              <Link href={plan.pro ? "/app/deck" : "/app/upgrade"} className="btn-play mt-6 w-full justify-between">
                <span className="text-left"><span className="block text-xs font-bold uppercase tracking-widest opacity-70">{plan.pro ? `Boss level · +${XP.deck} XP` : "Pro · Boss level"}</span>{plan.pro ? "Turn it all into a pitch deck" : "Unlock the pitch deck designer"}</span>
                <Crown size={22} aria-hidden />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1240px] space-y-6" style={{ ["--ag" as string]: st.color } as React.CSSProperties}>
      {/* Agent header: calm surface; the agent's color lives only in its icon */}
      <header className="flex items-center gap-4">
        <Icon3D icon={Icon} color={st.color} size={56} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted">{WORLDS[agent.world].name} · {agent.role}{result ? " · completed" : ""}</p>
          <h2 className="text-2xl sm:text-3xl">{agent.name} agent</h2>
        </div>
        <Buddy character={ch} mood={loading ? "think" : result ? "cheer" : "happy"} size={48} className="shrink-0" />
      </header>
      <p className="-mt-2 max-w-2xl text-[15px] text-muted">{loading ? (step || "Thinking about your startup…") : agent.line}</p>

      {top ? (
        <>{form}{results}{playbooks}</>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="space-y-6">{form}<div className="hidden xl:block">{playbooks}</div></div>
          {results}
          <div className="xl:hidden">{playbooks}</div>
        </div>
      )}
    </div>
  );
}
