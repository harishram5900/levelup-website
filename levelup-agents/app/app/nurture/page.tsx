"use client";
import { motion } from "framer-motion";
import { Bell, Check, Lock, MessageSquare, Target, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ease } from "@/lib/motion";

const FEATURES = [
  { icon: Target, t: "Find leads", d: "Spot people who comment, DM or click with real buying intent." },
  { icon: MessageSquare, t: "Personal follow-ups", d: "Send each lead a message that fits what they asked about." },
  { icon: Users, t: "Turn interest into customers", d: "See every lead's journey from first view to first visit." },
];

export default function NurturePage() {
  const [notified, setNotified] = useState(false);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-[28px] glass p-8 text-center sm:p-14">
        <div aria-hidden className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber/20 blur-3xl" />
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease }} className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-fg/10"><Lock size={26} aria-hidden /></motion.span>
        <div className="relative mt-6"><Badge tone="amber">Coming soon</Badge></div>
        <h2 className="relative mt-4 font-display text-4xl font-bold">Nurture Flow</h2>
        <p className="relative mx-auto mt-3 max-w-lg text-muted">Not live yet. When it launches, Nurture Flow will find leads from your content and follow up with each one personally.</p>
        <button type="button" onClick={() => setNotified(true)} disabled={notified} className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-80">
          {notified ? <><Check size={18} aria-hidden /> We'll let you know</> : <><Bell size={18} aria-hidden /> Notify me</>}
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {FEATURES.map((f, i) => { const Icon = f.icon; return (
          <motion.div key={f.t} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08, ease }} className="rounded-[20px] glass p-5 opacity-75">
            <Icon size={20} className="text-amber" aria-hidden /><p className="mt-3 font-semibold">{f.t}</p><p className="mt-1 text-sm text-muted">{f.d}</p>
          </motion.div>); })}
      </div>
    </div>
  );
}
