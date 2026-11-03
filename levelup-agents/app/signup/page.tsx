"use client";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthCard, authInput, NotEnabled } from "@/components/auth/AuthCard";
import { authEnabled, friendlyAuthError, supabase, useAuth } from "@/lib/supabase";
import { checkEmail } from "@/lib/emailCheck";

function ResendButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "busy" | "sent" | "err">("idle");
  const [msg, setMsg] = useState("");
  const resend = async () => {
    const sb = supabase(); if (!sb) return;
    setState("busy");
    const { error } = await sb.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: `${location.origin}/app` } });
    if (error) { setState("err"); setMsg(friendlyAuthError(error.message)); } else { setState("sent"); setMsg("Sent again. It can take a minute."); }
  };
  return (
    <div>
      <button type="button" onClick={resend} disabled={state === "busy" || state === "sent"} className="btn-soft w-full justify-center">{state === "busy" ? "Sending…" : "Resend confirmation email"}</button>
      {msg && <p className={`mt-2 text-sm ${state === "err" ? "text-red-500" : "text-good"}`} role="status">{msg}</p>}
    </div>
  );
}

export default function SignUpPage() { return <Suspense fallback={null}><SignUp /></Suspense>; }

function SignUp() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const params = useSearchParams();
  const [ref, setRef] = useState("");
  useEffect(() => {
    // Invite codes come from ?ref=CODE (also remembered if they browse around first).
    const fromUrl = (params.get("ref") ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
    try { if (fromUrl) localStorage.setItem("lu-ref", fromUrl); setRef(fromUrl || localStorage.getItem("lu-ref") || ""); } catch { setRef(fromUrl); }
  }, [params]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [age, setAge] = useState<"13+" | "under13" | "">("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => { if (ready && user) router.replace("/app"); }, [ready, user, router]);

  const strong = pw.length >= 8 && /[a-z]/i.test(pw) && /\d/.test(pw);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (age !== "13+") { setErr("You need to be 13 or older to create an account."); return; }
    const ec = checkEmail(email);
    if (!ec.ok) { setErr(ec.error!); if (ec.suggestion) setEmail(ec.suggestion); return; }
    if (!strong) { setErr("Use at least 8 characters with letters and numbers."); return; }
    if (!agree) { setErr("Please agree to the Terms and Privacy Policy."); return; }
    const sb = supabase(); if (!sb) return;
    setBusy(true);
    const { data, error } = await sb.auth.signUp({ email: email.trim(), password: pw, options: { data: { display_name: name.trim().slice(0, 60), age_confirmed: true, ...(ref ? { ref } : {}) }, emailRedirectTo: `${location.origin}/app` } });
    setBusy(false);
    if (error) { setErr(friendlyAuthError(error.message)); return; }
    if (data.session) router.replace("/app");
    else setSent(true);
  };

  if (sent) {
    return (
      <AuthCard title="Check your email" sub={`We sent a confirmation link to ${email}.`} mood="cheer">
        <div className="space-y-4 text-center">
          <MailCheck size={40} className="mx-auto text-good" aria-hidden />
          <p className="text-sm text-muted">Click the link to activate your account, then you'll land in your HQ. Don't see it? Check spam.</p>
          <ResendButton email={email} />
          <Link href="/signin" className="btn-glass w-full">Back to sign in</Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Sign up free" sub="Save your startup, XP and deck across all your devices." footer={<>Already have an account? <Link href="/signin" className="font-semibold text-violet hover:underline">Sign in</Link></>}>
      {!authEnabled ? <NotEnabled /> : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          {ref && <p className="rounded-xl bg-good/10 p-3 text-sm">🎉 A friend invited you. You'll be friends on LevelUp as soon as you sign up.</p>}
          <div><label htmlFor="su-name" className="mb-1.5 block text-sm font-semibold">First name</label><input id="su-name" autoComplete="given-name" className={authInput} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="e.g. Harish" /></div>
          <div><label htmlFor="su-email" className="mb-1.5 block text-sm font-semibold">Email</label><input id="su-email" type="email" required autoComplete="email" className={authInput} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} placeholder="you@example.com" /></div>
          <div>
            <label htmlFor="su-pw" className="mb-1.5 block text-sm font-semibold">Password</label>
            <div className="relative">
              <input id="su-pw" type={show ? "text" : "password"} required minLength={8} autoComplete="new-password" className={`${authInput} pr-12`} value={pw} onChange={(e) => setPw(e.target.value)} maxLength={128} />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-fg">{show ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}</button>
            </div>
            <div className="mt-2 flex gap-1" aria-hidden>{[pw.length >= 8, /[a-z]/i.test(pw) && /\d/.test(pw), pw.length >= 12].map((ok, i) => <span key={i} className={`h-1 flex-1 rounded-full ${ok ? "bg-good" : "bg-fg/10"}`} />)}</div>
            <p className="mt-1 text-xs text-muted">At least 8 characters, with letters and numbers.</p>
          </div>
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">How old are you?</legend>
            <div className="grid grid-cols-2 gap-2">
              {([["13+", "13 or older"], ["under13", "Under 13"]] as const).map(([v, l]) => (
                <button key={v} type="button" aria-pressed={age === v} onClick={() => setAge(v)} className={`rounded-xl py-2.5 text-sm font-semibold transition ${age === v ? "bg-accent text-white" : "hairline text-muted hover:text-fg"}`}>{l}</button>
              ))}
            </div>
            {age === "under13" && <p className="mt-2 rounded-xl bg-amber/10 p-3 text-sm">You can use LevelUp as a guest without an account; your progress saves in this browser. Ask a parent or guardian before sharing your startup online. <Link href="/app" className="font-semibold text-violet underline">Continue as guest</Link></p>}
          </fieldset>
          <label className="flex items-start gap-2.5 text-sm"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[rgb(var(--violet))]" /><span>I agree to the <Link href="/terms" className="text-violet underline">Terms</Link> and <Link href="/privacy" className="text-violet underline">Privacy Policy</Link>.</span></label>
          {err && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500" role="alert">{err}</p>}
          <button type="submit" disabled={busy || age === "under13"} className="btn-play w-full">{busy ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null}Create my account</button>
          <p className="text-center text-xs text-muted">Already used LevelUp as a guest? Your progress moves into your account automatically.</p>
        </form>
      )}
    </AuthCard>
  );
}
