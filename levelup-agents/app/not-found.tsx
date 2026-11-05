import Link from "next/link";
import { Buddy } from "@/components/cofounder/Pip";

export const metadata = { title: "Page not found · LevelUp" };

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 text-center">
      <div className="max-w-md">
        <Buddy character="nova" mood="think" size={120} className="mx-auto" />
        <p className="kicker mt-6">Error 404</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-none">This page doesn&apos;t exist</h1>
        <p className="mt-3 text-muted">Nova searched the whole galaxy and couldn&apos;t find it. The link may be old or mistyped.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/app" className="btn-play">Go to my HQ</Link>
          <Link href="/" className="btn-glass">Home page</Link>
        </div>
      </div>
    </main>
  );
}
