"use client";
import Link from "next/link";
import { useEffect } from "react";
import { Buddy } from "@/components/cofounder/Pip";
import { reportError } from "@/lib/report";

/** Shown when a page crashes. Reports the error, keeps the founder's work safe, offers a retry. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { reportError(error, "boundary"); }, [error]);
  return (
    <main className="grid min-h-[70dvh] place-items-center px-6 py-16 text-center">
      <div className="max-w-md">
        <Buddy character="blaze" mood="think" size={120} className="mx-auto" />
        <p className="kicker mt-6">Something broke</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-none">That wasn&apos;t supposed to happen</h1>
        <p className="mt-3 text-muted">Your progress is safe. We&apos;ve been told about this error. Try again, and if it keeps happening, head back to your HQ.</p>
        {error.digest && <p className="mt-2 font-mono text-xs text-muted">Error code: {error.digest}</p>}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className="btn-play">Try again</button>
          <Link href="/app" className="btn-glass">Back to my HQ</Link>
        </div>
      </div>
    </main>
  );
}
