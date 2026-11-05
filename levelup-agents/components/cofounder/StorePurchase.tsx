"use client";
import { Crown, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buyPro, getProOffer, iapAvailable, manageSubscription, restorePro, type ProOffer } from "@/lib/iap";
import { haptic, platform } from "@/lib/native";
import { refreshPlan } from "@/lib/cofounder/plan";

/** Pro through the App Store / Google Play (shown only inside the native app). */
export function StorePurchase({ uid, pro }: { uid: string | null; pro: boolean }) {
  const [on, setOn] = useState(false);
  const [offer, setOffer] = useState<ProOffer | null>(null);
  const [busy, setBusy] = useState<"" | "buy" | "restore" | "wait">("");
  const [msg, setMsg] = useState("");

  useEffect(() => { setOn(iapAvailable()); }, []);
  useEffect(() => {
    if (!on || !uid || pro) return;
    getProOffer(uid).then(setOffer).catch(() => setMsg("The store isn't available right now. Try again later."));
  }, [on, uid, pro]);

  // The webhook flips the plan on the server within seconds; poll until it lands.
  const waitForPro = async () => {
    setBusy("wait");
    for (let i = 0; i < 15; i++) { if (await refreshPlan()) { haptic("success"); setBusy(""); return; } await new Promise((r) => setTimeout(r, 2000)); }
    setBusy(""); setMsg("Payment received. Pro will unlock in a minute. Pull down or reopen the app if it doesn't.");
  };

  if (!on) return <p className="glass rounded-[24px] p-5 text-sm"><b>Pro in the app is coming soon.</b> <span className="text-muted">Already Pro? Sign in with the same account and everything unlocks here too.</span></p>;
  if (pro) return (
    <div className="glass flex flex-wrap items-center gap-3 rounded-[24px] p-5">
      <p className="flex-1 font-semibold">You&apos;re on LevelUp Pro. 🎉</p>
      <button type="button" onClick={() => manageSubscription()} className="btn-glass text-sm">Manage subscription</button>
    </div>
  );
  if (!uid) return (
    <div className="glass rounded-[24px] p-5">
      <p className="font-semibold">Create a free account first</p>
      <p className="mt-1 text-sm text-muted">Your Pro unlocks on every device you sign in to.</p>
      <Link href="/signup" className="btn-play mt-3 w-full">Sign up to upgrade</Link>
    </div>
  );
  const store = platform() === "ios" ? "Apple ID" : "Google Play";
  return (
    <div className="glass space-y-3 rounded-[24px] p-5">
      <button type="button" disabled={!offer || !!busy} className="btn-play w-full text-lg"
        onClick={async () => {
          if (!offer) return;
          setBusy("buy"); setMsg("");
          try { if (await buyPro(uid, offer.pkg)) await waitForPro(); else setBusy(""); }
          catch (e) { setMsg((e as Error).message); setBusy(""); }
        }}>
        {busy === "buy" || busy === "wait" ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Crown size={18} aria-hidden />}
        {busy === "wait" ? "Unlocking Pro…" : offer ? (offer.trial ? `Try ${offer.trial}, then ${offer.price}/${offer.period}` : `Get Pro · ${offer.price}/${offer.period}`) : "Loading price…"}
      </button>
      <button type="button" disabled={!!busy} className="btn-glass w-full text-sm"
        onClick={async () => { setBusy("restore"); setMsg(""); try { if (await restorePro(uid)) await waitForPro(); else { setBusy(""); setMsg("No active Pro subscription found for this account."); } } catch (e) { setBusy(""); setMsg((e as Error).message); } }}>
        {busy === "restore" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <RotateCcw size={16} aria-hidden />} Restore purchases
      </button>
      {msg && <p className="text-sm" role="status">{msg}</p>}
      <p className="text-xs leading-relaxed text-muted">
        Payment is charged to your {store} account. The subscription renews automatically every {offer?.period ?? "month"} unless you cancel at least 24 hours before the end of the current period. Manage or cancel anytime in your {store} subscription settings. Under 18? Ask a parent or guardian first.{" "}
        <Link href="/terms" className="underline">Terms of Use</Link> · <Link href="/privacy" className="underline">Privacy Policy</Link>
      </p>
    </div>
  );
}
