"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy, Loader2, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AGENTS, type AgentId } from "@/lib/agents";
import { ease } from "@/lib/motion";
import { useWorkspace } from "@/lib/cofounder/profile";
import { runAgent } from "@/lib/cofounder/runAgent";
import { cn } from "@/lib/utils";

/** One agent's workspace: answer a few questions, get a document you can copy and use. */
// Takes an id (not the agent object) so a server page can render it: icons are functions.
export function AgentRunner({ agentId }: { agentId: AgentId }) {
  const agent = AGENTS.find((a) => a.id === agentId)!;
  const { ws, ready, update } = useWorkspace();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = ws.results[agent.id];
  const nextAgent = AGENTS[AGENTS.findIndex((a) => a.id === agent.id) + 1];

  useEffect(() => { if (ready) setAnswers(ws.answers[agent.id] ?? {}); }, [ready, agent.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;
  if (!ws.profile) {
    return (
      <div className="glass mx-auto max-w-xl rounded-[24px] p-8 text-center">
        <p className="font-display text-4xl uppercase">Set up your Startup HQ first</p>
        <p className="mt-3 text-muted">Your agents need to know your startup before they can help. It takes one minute.</p>
        <Link href="/app" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 font-semibold">Set up HQ <ArrowRight size={16} aria-hidden /></Link>
      </div>
    );
  }
  const profile = ws.profile;

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await runAgent(agent.id, profile, answers);
    update((w) => ({ ...w, results: { ...w.results, [agent.id]: r }, answers: { ...w.answers, [agent.id]: answers } }));
    setLoading(false);
  };
  const copy = async () => {
    if (!result) return;
    const txt = `${agent.name} agent · ${profile.startup}\n\n` + result.sections.map((s) => `${s.title}\n${s.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n");
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };
  const Icon = agent.icon;
  const input = "w-full rounded-xl hairline bg-bg-2/60 px-4 py-3 text-[15px] outline-none transition-colors focus:border-violet/60";

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
      <form onSubmit={run} className="glass h-fit space-y-5 rounded-[24px] p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white"><Icon size={22} aria-hidden /></span>
          <div><h2 className="font-display text-3xl uppercase leading-none">{agent.name} agent</h2><p className="text-sm text-muted">{agent.role}</p></div>
        </div>
        <p className="text-[15px] text-muted">{agent.line}</p>
        {agent.fields.map((f) => (
          <div key={f.id}>
            <label htmlFor={`f-${f.id}`} className="mb-2 block text-sm font-semibold">{f.label}</label>
            {f.long
              ? <textarea id={`f-${f.id}`} rows={3} className={cn(input, "resize-y")} placeholder={f.placeholder} value={answers[f.id] ?? ""} onChange={(e) => setAnswers({ ...answers, [f.id]: e.target.value })} maxLength={600} />
              : <input id={`f-${f.id}`} className={input} placeholder={f.placeholder} value={answers[f.id] ?? ""} onChange={(e) => setAnswers({ ...answers, [f.id]: e.target.value })} maxLength={200} />}
          </div>
        ))}
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3.5 font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-70">
          {loading ? <><Loader2 size={18} className="animate-spin" aria-hidden /> Working on it…</> : <><Wand2 size={18} aria-hidden /> {result ? "Run again" : `Run the ${agent.name} agent`}</>}
        </button>
        <p className="text-xs text-muted">Uses your Startup HQ info: {profile.startup}, for {profile.customer}.</p>
      </form>

      <div className="glass min-h-[440px] rounded-[24px] p-5 sm:p-7" aria-live="polite">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid h-full min-h-[380px] place-items-center text-center">
              <div>
                {loading ? <Loader2 className="mx-auto mb-4 animate-spin text-violet" size={32} aria-hidden /> : <Icon className="mx-auto mb-4 text-violet" size={32} aria-hidden />}
                <p className="font-display text-3xl uppercase">{loading ? "Your co-founder is thinking" : "Your plan appears here"}</p>
                <p className="mt-2 text-muted">You'll get: {agent.sections.join(" · ")}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key={result.at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-3xl uppercase leading-none">{agent.name} plan for {profile.startup}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">{result.source === "ai" ? <><Sparkles size={12} className="text-violet" aria-hidden /> Written by AI for your startup</> : "Guided plan built from your answers"}</p>
                </div>
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full hairline px-4 py-2 text-sm hover:bg-fg/5"><Copy size={14} aria-hidden /> {copied ? "Copied" : "Copy all"}</button>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {result.sections.map((s, i) => (
                  <motion.section key={s.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4, ease }} className="rounded-2xl bg-fg/[0.035] p-5">
                    <h3 className="mb-3 font-display text-2xl uppercase text-violet">{s.title}</h3>
                    <ul className="space-y-2.5 text-[15px] leading-relaxed">
                      {s.items.map((it, k) => <li key={k} className="flex gap-2.5"><Check size={16} className="mt-1 shrink-0 text-good" aria-hidden /><span>{it}</span></li>)}
                    </ul>
                  </motion.section>
                ))}
              </div>
              {nextAgent && (
                <Link href={`/app/agents/${nextAgent.id}`} className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-violet/30 bg-violet/10 p-5 transition-colors hover:bg-violet/15">
                  <span><span className="kicker">Next step</span><span className="mt-1 block font-semibold">{nextAgent.name} agent: {nextAgent.stage}</span></span>
                  <ArrowRight size={20} aria-hidden />
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
