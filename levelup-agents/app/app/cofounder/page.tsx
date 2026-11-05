"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Loader2, Pin, Send, Sparkles, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FounderCall } from "@/components/cofounder/FounderCall";
import { Buddy, characterById } from "@/components/cofounder/Pip";
import { ProGate } from "@/components/cofounder/ProGate";
import { guidedReply, memoryFacts, memoryText } from "@/lib/cofounder/memory";
import { usePlan } from "@/lib/cofounder/plan";
import { useWorkspace, type ChatMsg } from "@/lib/cofounder/profile";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const SUGGESTIONS = ["What should I do this week?", "How should I price my product?", "Help me get my first 10 customers", "Write me a 30-second pitch", "What will judges ask me?", "I'm feeling stuck"];

/** Light markdown: **bold** and line breaks only (no HTML injection). */
function Rich({ text }: { text: string }) {
  return <>{text.split("\n").map((line, i) => <p key={i} className={cn(i > 0 && "mt-1.5")}>{line.split(/(\*\*[^*]+\*\*)/).map((part, k) => part.startsWith("**") && part.endsWith("**") ? <b key={k}>{part.slice(2, -2)}</b> : <span key={k}>{part}</span>)}</p>)}</>;
}

export default function CofounderChat() {
  const { ws, ready, update } = useWorkspace();
  const plan = usePlan();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [showMem, setShowMem] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const chat = useMemo(() => ws.chat ?? [], [ws.chat]);
  const buddy = characterById(ws.prefs.character);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [chat.length, busy]);

  if (!ready || !plan.ready) return null;
  if (!ws.profile) return <div className="glass mx-auto max-w-xl rounded-[24px] p-8 text-center"><p className="font-display text-3xl">Set up your Startup HQ first</p><Link href="/app" className="btn-play mt-6">Set up HQ</Link></div>;
  if (!plan.pro) return <ProGate title="AI co-founder" line={`Chat with ${buddy.name} anytime. It remembers your startup, every plan you've made, your goals and your past conversations, and answers like an experienced founder.`} />;

  const push = (m: ChatMsg) => update((w) => ({ ...w, chat: [...(w.chat ?? []), m].slice(-200) }));
  const remember = (facts: string[]) => facts.length && update((w) => {
    const have = new Set((w.notes ?? []).map((n) => n.toLowerCase()));
    return { ...w, notes: [...(w.notes ?? []), ...facts.filter((f) => !have.has(f.toLowerCase()))].slice(-50) };
  });

  const send = async (text: string) => {
    const q = text.trim(); if (!q || busy) return;
    setInput(""); setErr("");
    const userMsg: ChatMsg = { role: "user", text: q.slice(0, 2000), at: Date.now() };
    push(userMsg);
    setBusy(true);
    try {
      const { data } = (await supabase()?.auth.getSession()) ?? { data: { session: null } };
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${data.session?.access_token ?? ""}` },
        body: JSON.stringify({ character: buddy.name, memory: memoryText(ws), messages: [...chat, userMsg].slice(-20).map((m) => ({ role: m.role, text: m.text })) }),
      });
      const out = await res.json().catch(() => ({}));
      if (out?.source === "ai" && out.reply) { push({ role: "assistant", text: out.reply, at: Date.now(), source: "ai" }); remember(out.remember ?? []); }
      else if (res.status === 429 || res.status === 403) setErr(out?.error ?? "Please try again in a bit.");
      else push({ role: "assistant", text: guidedReply(ws, q), at: Date.now(), source: "guided" });
    } catch { push({ role: "assistant", text: guidedReply(ws, q), at: Date.now(), source: "guided" }); }
    setBusy(false);
  };

  const groups = memoryFacts(ws);
  const memoryPanel = (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><Brain size={18} className="text-violet" aria-hidden /><p className="font-display text-xl">What {buddy.name} remembers</p></div>
      <p className="text-xs text-muted">Saved to your account and used in every conversation. Pin anything else you want remembered.</p>
      <form onSubmit={(e) => { e.preventDefault(); const n = note.trim(); if (n) { remember([n.slice(0, 160)]); setNote(""); } }} className="flex gap-2">
        <label htmlFor="mem-note" className="sr-only">Something to remember</label>
        <input id="mem-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={160} placeholder="e.g. Our launch date is May 15" className="min-w-0 flex-1 rounded-xl hairline bg-bg-2/60 px-3 py-2 text-sm outline-none focus:border-violet/60" />
        <button type="submit" className="btn-icon" aria-label="Pin to memory"><Pin size={15} aria-hidden /></button>
      </form>
      <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
        {groups.map((g) => (
          <div key={g.group}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{g.group}</p>
            <ul className="mt-1 space-y-1">{g.facts.map((f, i) => (
              <li key={i} className="group flex items-start gap-2 rounded-lg bg-fg/[0.03] px-2.5 py-1.5 text-xs">
                <span className="flex-1">{f}</span>
                {g.group === "Pinned notes" && <button type="button" onClick={() => update((w) => ({ ...w, notes: (w.notes ?? []).filter((x) => x !== f) }))} aria-label={`Forget "${f}"`} className="text-muted opacity-60 hover:text-red-500 hover:opacity-100"><X size={12} aria-hidden /></button>}
              </li>
            ))}</ul>
          </div>
        ))}
      </div>
      {chat.length > 0 && <button type="button" onClick={() => { if (confirm("Clear your chat history? Your memory and plans stay.")) update((w) => ({ ...w, chat: [] })); }} className="btn-glass w-full justify-center text-xs"><Trash2 size={13} aria-hidden /> Clear chat history</button>}
    </div>
  );

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="glass flex h-[calc(100dvh-172px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] min-h-[380px] flex-col overflow-hidden rounded-[28px] md:h-[calc(100dvh-140px)] md:min-h-[520px]">
        <header className="flex items-center gap-3 border-b border-fg/[0.07] px-5 py-3">
          <Buddy character={ws.prefs.character} mood={busy ? "think" : "happy"} size={44} />
          <div className="min-w-0 flex-1"><p className="font-semibold">{buddy.name} · your AI co-founder</p><p className="truncate text-xs text-muted">Knows {ws.profile.startup}, {Object.keys(ws.results).length} plans, {ws.goals.length} goals{ws.notes?.length ? `, ${ws.notes.length} notes` : ""}</p></div>
          <button type="button" onClick={() => setShowMem(true)} className="btn-soft py-1.5 text-xs lg:hidden"><Brain size={14} aria-hidden /> Memory</button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
          {chat.length === 0 && (
            <div className="mx-auto max-w-md pt-6 text-center">
              <Buddy character={ws.prefs.character} mood="wave" size={96} className="mx-auto" />
              <p className="mt-3 font-display text-2xl">Hey{ws.profile.founder ? ` ${ws.profile.founder}` : ""}! What are we working on?</p>
              <p className="mt-1 text-sm text-muted">I already know about {ws.profile.startup} and everything you've built here. Ask me anything.</p>
            </div>
          )}
          {chat.map((m, i) => (
            <motion.div key={m.at + i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-2.5", m.role === "user" && "justify-end")}>
              {m.role === "assistant" && <Buddy character={ws.prefs.character} size={32} className="mt-1" />}
              <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed", m.role === "user" ? "rounded-br-sm bg-accent text-white" : "rounded-bl-sm bg-fg/[0.06]")}>
                <Rich text={m.text} />
                {m.role === "assistant" && m.source === "guided" && <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted">Guided mode</p>}
              </div>
            </motion.div>
          ))}
          {busy && <div className="flex items-center gap-2 text-sm text-muted"><Loader2 size={15} className="animate-spin" aria-hidden /> {buddy.name} is thinking…</div>}
          <div ref={end} />
        </div>

        {err && <p className="mx-4 mb-2 rounded-xl bg-amber/10 px-3 py-2 text-sm" role="alert">{err}</p>}
        {chat.length < 2 && <div className="flex gap-2 overflow-x-auto px-4 pb-2">{SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => send(s)} className="shrink-0 rounded-full bg-fg/[0.05] px-3 py-1.5 text-xs font-semibold text-muted hover:text-fg"><Sparkles size={11} className="mr-1 inline" aria-hidden />{s}</button>)}</div>}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2 border-t border-fg/[0.07] p-3">
          <label htmlFor="chat-input" className="sr-only">Message {buddy.name}</label>
          <textarea id="chat-input" rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} maxLength={2000} placeholder={`Message ${buddy.name}…`} className="max-h-40 min-h-[44px] flex-1 resize-none rounded-2xl hairline bg-bg-2/60 px-4 py-2.5 text-[15px] outline-none focus:border-violet/60" />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-white disabled:opacity-50"><Send size={17} aria-hidden /></button>
        </form>
      </section>

      <aside className="hidden space-y-5 lg:block">
        <div className="glass rounded-[24px] p-5">{memoryPanel}</div>
        <FounderCall compact />
      </aside>

      <AnimatePresence>
        {showMem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowMem(false)}>
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[28px] bg-bg-2 p-5">
              <button type="button" onClick={() => setShowMem(false)} aria-label="Close" className="absolute right-4 top-4 text-muted"><X size={18} aria-hidden /></button>
              {memoryPanel}
              <FounderCall compact className="mt-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
