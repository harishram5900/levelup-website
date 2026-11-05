"use client";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { isNative, remindersEnabled, scheduleReminders } from "@/lib/native";
import { getWorkspace, today } from "@/lib/cofounder/profile";
import { gameStats } from "@/lib/cofounder/game";
import { characterById } from "./Pip";

/** Streak reminders (phone app only). Scheduled on the device; no push server. */
export function Reminders() {
  const [native, setNative] = useState(false);
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => { setNative(isNative()); remindersEnabled().then(setOn); }, []);
  if (!native) return null;
  const enable = async () => {
    const w = getWorkspace();
    await scheduleReminders({ name: w.profile?.startup ?? "your startup", streak: gameStats(w, today()).streak, buddy: characterById(w.prefs.character).name, ask: true });
    setOn(await remindersEnabled());
  };
  return (
    <section className="glass rounded-[24px] p-6">
      <p className="flex items-center gap-2 font-semibold"><Bell size={16} aria-hidden /> Streak reminders</p>
      <p className="mt-1 text-sm text-muted">A friendly nudge at 7pm if you haven&apos;t shown up that day. Never more than one a day.</p>
      {on ? <p className="mt-3 text-sm font-semibold text-good">On. Turn them off anytime in your phone&apos;s settings.</p>
        : <button type="button" onClick={enable} className="btn-play mt-3 text-sm">Turn on reminders</button>}
    </section>
  );
}
