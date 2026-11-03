"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard, authInput, NotEnabled } from "@/components/auth/AuthCard";
import { authEnabled, friendlyAuthError, supabase, useAuth } from "@/lib/supabase";

export default function Reset() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (pw.length < 8 || !/[a-z]/i.test(pw) || !/\d/.test(pw)) { setErr("Use at least 8 characters with letters and numbers."); return; }
    const sb = supabase(); if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) setErr(friendlyAuthError(error.message)); else router.replace("/app");
  };
  return (
    <AuthCard title="New password" sub="Choose a new password for your account." mood="think">
      {!authEnabled ? <NotEnabled /> : !ready ? null : !user ? (
        <p className="text-sm text-muted">This reset link has expired or was already used. Go to Sign in and tap &ldquo;Forgot password&rdquo; again.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div><label htmlFor="rs-pw" className="mb-1.5 block text-sm font-semibold">New password</label><input id="rs-pw" type="password" autoComplete="new-password" className={authInput} value={pw} onChange={(e) => setPw(e.target.value)} maxLength={128} /></div>
          {err && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500" role="alert">{err}</p>}
          <button type="submit" disabled={busy} className="btn-play w-full">{busy && <Loader2 size={18} className="animate-spin" aria-hidden />}Save password</button>
        </form>
      )}
    </AuthCard>
  );
}
