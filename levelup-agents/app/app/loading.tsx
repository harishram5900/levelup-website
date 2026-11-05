/** Skeleton while an app page loads (shown instantly on navigation). */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1100px] animate-pulse space-y-5" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-2/3 rounded-2xl bg-fg/[0.07]" />
      <div className="h-4 w-1/2 rounded-full bg-fg/[0.05]" />
      <div className="h-44 rounded-[24px] bg-fg/[0.05]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-[20px] bg-fg/[0.05]" />
        <div className="h-28 rounded-[20px] bg-fg/[0.05]" />
      </div>
    </div>
  );
}
