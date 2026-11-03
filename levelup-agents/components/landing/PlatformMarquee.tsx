const OUTPUTS = ["Idea check", "Customer interview script", "MVP plan", "Pitch deck (PDF)", "30-second pitch", "Pricing math", "Funding options", "Launch plan", "Weekly goals", "Competition prep", "XP & badges"];

export function PlatformMarquee() {
  const row = [...OUTPUTS, ...OUTPUTS];
  return (
    <section aria-label="What LevelUp helps you make" className="relative border-y border-fg/[0.07] py-8">
      <p className="kicker mb-6 text-center">What your co-founder helps you make</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-12 pr-12 hover:[animation-play-state:paused]">
          {[...row, ...row].map((o, i) => (
            <span key={i} className="flex items-center gap-3 font-display text-3xl uppercase text-muted" aria-hidden={i >= OUTPUTS.length}>
              <span className="h-2 w-2 rounded-full bg-amber" />{o}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
