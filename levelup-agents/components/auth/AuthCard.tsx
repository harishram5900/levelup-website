"use client";
import Link from "next/link";
import { Buddy, type CharacterId, type Mood } from "@/components/cofounder/Pip";
import { Logo } from "@/components/ui/Logo";

export function AuthCard({ title, sub, mood = "wave", character = "pip", children, footer }: { title: string; sub: string; mood?: Mood; character?: CharacterId; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgb(var(--violet)/0.25),transparent_70%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="glass rounded-[28px] p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <Buddy character={character} mood={mood} size={72} />
            <div><h1 className="text-4xl leading-none">{title}</h1><p className="mt-1 text-sm text-muted">{sub}</p></div>
          </div>
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-muted">{footer}</div>}
        <p className="mt-6 text-center text-xs text-muted"><Link href="/privacy" className="hover:text-fg">Privacy</Link> · <Link href="/terms" className="hover:text-fg">Terms</Link> · <Link href="/" className="hover:text-fg">Home</Link></p>
      </div>
    </div>
  );
}

export const authInput = "w-full rounded-xl hairline bg-bg-2/60 px-4 py-3 text-[15px] outline-none transition-colors focus:border-violet/60";

export function NotEnabled() {
  return (
    <div className="space-y-4 text-center">
      <p className="rounded-xl bg-amber/10 p-4 text-sm">Accounts are being switched on soon. You can use everything right now as a guest: your progress saves in this browser.</p>
      <Link href="/app" className="btn-play w-full">Continue as guest</Link>
    </div>
  );
}
