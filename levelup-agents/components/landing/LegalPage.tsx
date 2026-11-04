import { Logo } from "@/components/ui/Logo";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Logo />
      <h1 className="mt-10 text-6xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated {updated}</p>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed [&_h2]:mt-8 [&_h2]:font-sans [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:normal-case [&_h2]:tracking-normal [&_li]:ml-5 [&_li]:list-disc">{children}</div>
      <p className="mt-12 rounded-xl bg-amber/10 p-4 text-sm">This is a plain-language starting draft, not legal advice. Have it reviewed before LevelUp collects data at scale.</p>
    </main>
  );
}
