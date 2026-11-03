"use client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard, authInput, NotEnabled } from "@/components/auth/AuthCard";
import { authEnabled, friendlyAuthError, supabase, useAuth } from "@/lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [unconfirmed, setUnconfirmed] = useState(false);
  const resend = async () => {
    const sb = supabase(); if (!sb) return;
    const { error } = await sb.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: `${location.origin}/app` } });
    setErr(""); setUnconfirmed(false);
    if (error) setErr(friendlyAuthError(error.message)); else setMsg("Confirmation email sent. Check your inbox (and spam).");
  };

  useEffect(() => { if (ready && user) router.replace("/app"); }, [ready, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg("");
    const sb = supabase(); if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pw });
    setBusy(false);
    if (error) { setErr(friendlyAuthError(error.message)); setUnconfirmed(/not confirmed/i.test(error.message)); }
    else router.replace("/app");
  };
  const forgot = async () => {
    setErr(""); setMsg("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErr("Type your email above first, then tap Forgot password."); return; }
    const sb = supabase(); if (!sb) return;
    await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/reset` });
    // Same message whether or not the account exists, so emails can't be discovered.
    setMsg("If there's an account with that email, a reset link is on its way.");
  };

  return (
    <AuthCard title="Welcome back" sub="Sign in to your Startup HQ." mood="happy" footer={<>New here? <Link href="/signup" className="font-semibold text-violet hover:underline">Sign up free</Link></>}>
      {!authEnabled ? <NotEnabled /> : (
        <form onSubmit={submit} className="space-y-4">
          <div><label htmlFor="si-email" className="mb-1.5 block text-sm font-semibold">Email</label><input id="si-email" type="email" required autoComplete="email" className={authInput} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} /></div>
          <div>
            <div className="mb-1.5 flex items-center justify-between"><label htmlFor="si-pw" className="text-sm font-semibold">Password</label><button type="button" onClick={forgot} className="text-xs font-semibold text-violet hover:underline">Forgot password?</button></div>
            <div className="relative">
              <input id="si-pw" type={show ? "text" : "password"} required autoComplete="current-password" className={`${authInput} pr-12`} value={pw} onChange={(e) => setPw(e.target.value)} maxLength={128} />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-fg">{show ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}</button>
            </div>
          </div>
          {err && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500" role="alert">{err}</p>}
          {unconfirmed && <button type="button" onClick={resend} className="btn-soft w-full justify-center">Resend confirmation email</button>}
          {msg && <p className="rounded-xl bg-good/10 p-3 text-sm text-good" role="status">{msg}</p>}
          <button type="submit" disabled={busy} className="btn-play w-full">{busy && <Loader2 size={18} className="animate-spin" aria-hidden />}Sign in</button>
          <Link href="/app" className="btn-glass w-full">Continue as guest</Link>
        </form>
      )}
    </AuthCard>
  );
}
