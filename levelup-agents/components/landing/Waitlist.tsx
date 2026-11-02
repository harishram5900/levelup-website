"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { ease } from "@/lib/motion";

/** Small, subtle confetti burst made of 18 dots. */
function Burst() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const colors = ["rgb(var(--violet))", "rgb(var(--cyan))", "rgb(var(--amber))"];
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const d = 70 + (i % 3) * 30;
        return (
          <motion.span key={i} className="absolute h-2 w-2 rounded-full" style={{ background: colors[i % 3] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 0.4 }} transition={{ duration: 0.9, ease }} />
        );
      })}
    </div>
  );
}

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState("done");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  return (
    <div className="relative mx-auto max-w-xl">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }} className="relative flex flex-col items-center gap-3 py-4 text-center">
            <Burst />
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-white"><Check size={26} aria-hidden /></span>
            <p className="font-display text-2xl font-bold">You're on the list.</p>
            <p className="text-muted">We'll email you when your spot in the beta opens.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="wl-email" className="sr-only">Email address</label>
            <input id="wl-email" type="email" required value={email} onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }} placeholder="you@business.com" className="flex-1 rounded-full hairline bg-bg-2/70 px-6 py-4 outline-none transition-colors focus:border-violet/60" aria-describedby="wl-msg" />
            <Magnetic strength={0.15}>
              <button type="submit" disabled={state === "loading"} className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-70 sm:w-auto">
                {state === "loading" ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <>Join waitlist <ArrowRight size={18} aria-hidden /></>}
              </button>
            </Magnetic>
          </motion.form>
        )}
      </AnimatePresence>
      <p id="wl-msg" role="status" className="mt-3 min-h-5 text-center text-sm text-red-500">{state === "error" ? msg : ""}</p>
    </div>
  );
}
