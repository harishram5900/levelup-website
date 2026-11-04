"use client";
import { CalendarCheck, Loader2, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { useWorkspace } from "@/lib/cofounder/profile";
import { supabase, useAuth } from "@/lib/supabase";
import { cn } from "@/lib/utils";

/** Pro perk: request a 1:1 call with LevelUp's founder. Uses a booking link if NEXT_PUBLIC_FOUNDER_CALL_URL is set. */
const BOOKING_URL = process.env.NEXT_PUBLIC_FOUNDER_CALL_URL;

export function FounderCall({ compact, className }: { compact?: boolean; className?: string }) {
  const { user } = useAuth();
  const { ws } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(ws.profile?.founder ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [topic, setTopic] = useState("");
  const [times, setTimes] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "err">("idle");
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase()?.from("call_requests").select("id").eq("status", "new").limit(1).then(({ data }) => setPending(!!data?.length));
  }, [user]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = supabase(); if (!sb) return;
    setState("busy");
    const { error } = await sb.from("call_requests").insert({ name: name.trim(), email: email.trim(), topic: topic.trim(), times: times.trim() || null });
    if (error) { setState("err"); setMsg(/row-level|policy/i.test(error.message) ? "Founder calls are a Pro perk." : /does not exist|schema cache/i.test(error.message) ? "Call requests are being switched on. Try again soon." : "Couldn't send that. Please try again."); return; }
    setState("done"); setPending(true);
  };
  const input = "w-full rounded-xl hairline bg-bg-2/60 px-3 py-2 text-sm outline-none focus:border-violet/60";

  return (
    <section className={cn("rounded-[24px] bg-gradient-to-br from-[#0B1030] to-[#1e293b] p-5 text-white ring-1 ring-white/10", className)}>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber text-[#1a1100]"><PhoneCall size={20} aria-hidden /></span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber">Pro perk</p>
          <p className="font-bold leading-tight">1:1 call with the founder</p>
          {!compact && <p className="mt-1 text-sm text-white/70">Talk through your startup with Harish, LevelUp's founder: your idea, pitch, first customers or anything you're stuck on.</p>}
        </div>
      </div>
      {state === "done" || (pending && !open) ? (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm"><CalendarCheck size={16} className="text-good" aria-hidden /> Request sent! You'll get an email to pick a time.</p>
      ) : BOOKING_URL ? (
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-play mt-4 w-full justify-center px-4 py-2.5 text-sm">Book a call</a>
      ) : !open ? (
        <button type="button" onClick={() => setOpen(true)} className="btn-play mt-4 w-full justify-center px-4 py-2.5 text-sm">Request a call</button>
      ) : (
        <form onSubmit={send} className="mt-4 space-y-2 text-fg">
          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="fc-name">Name</label><input id="fc-name" required value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Your name" className={input} />
            <label className="sr-only" htmlFor="fc-email">Email</label><input id="fc-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} placeholder="Email" className={input} />
          </div>
          <label className="sr-only" htmlFor="fc-topic">What do you want to talk about?</label>
          <textarea id="fc-topic" required minLength={5} value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={600} rows={3} placeholder="What do you want to talk about?" className={cn(input, "resize-y")} />
          <label className="sr-only" htmlFor="fc-times">Good times</label>
          <input id="fc-times" value={times} onChange={(e) => setTimes(e.target.value)} maxLength={200} placeholder="Good times for you (optional), e.g. weekdays after 5pm CT" className={input} />
          {state === "err" && <p className="text-sm text-red-400" role="alert">{msg}</p>}
          <button type="submit" disabled={state === "busy"} className="btn-play w-full justify-center px-4 py-2.5 text-sm">{state === "busy" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : "Send request"}</button>
          <p className="text-[11px] text-white/60">Under 18? Let a parent or guardian know about the call.</p>
        </form>
      )}
    </section>
  );
}
