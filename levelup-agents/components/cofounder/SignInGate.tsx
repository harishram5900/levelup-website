"use client";
import Link from "next/link";
import { useWorkspace } from "@/lib/cofounder/profile";
import { authEnabled } from "@/lib/supabase";
import { Buddy } from "./Pip";

/** Shown on social pages when the founder is browsing as a guest. */
export function SignInGate({ title, line }: { title: string; line: string }) {
  const { ws } = useWorkspace();
  return (
    <div className="glass mx-auto max-w-xl rounded-[28px] p-8 text-center">
      <Buddy character={ws.prefs.character} mood="wave" size={100} className="mx-auto" />
      <h2 className="mt-4 font-display text-4xl">{title}</h2>
      <p className="mt-2 text-muted">{line}</p>
      {authEnabled ? (
        <div className="mt-6 flex justify-center gap-3"><Link href="/signup" className="btn-play">Sign up free</Link><Link href="/signin" className="btn-glass">Sign in</Link></div>
      ) : <p className="mt-6 text-sm text-muted">Accounts are switching on soon.</p>}
      <p className="mt-4 text-xs text-muted">Your guest progress moves into your account when you sign up.</p>
    </div>
  );
}
