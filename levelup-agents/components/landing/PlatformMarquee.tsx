import { PLATFORMS, PlatformIcon } from "@/components/ui/PlatformIcon";

export function PlatformMarquee() {
  const row = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS];
  return (
    <section aria-label="Platforms LevelUp posts to" className="relative border-y border-fg/[0.07] py-8">
      <p className="kicker mb-6 text-center">Posts for you on</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-16 pr-16 hover:[animation-play-state:paused]">
          {[...row, ...row].map((p, i) => (
            <span key={i} className="flex items-center gap-3 text-lg font-semibold text-muted" aria-hidden={i >= PLATFORMS.length}>
              <PlatformIcon name={p.id} size={24} /> {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
