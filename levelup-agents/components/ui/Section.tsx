import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLElement> & { as?: "section" | "div"; inner?: string };

/** Page section with the site's max width and consistent vertical rhythm. */
export function Section({ as: Tag = "section", className, inner, children, ...rest }: Props) {
  return (
    <Tag className={cn("relative px-5 py-24 sm:py-32", className)} {...rest}>
      <div className={cn("mx-auto w-full max-w-site", inner)}>{children}</div>
    </Tag>
  );
}

export function SectionHeading({ kicker, title, sub, center = true }: { kicker: string; title: React.ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={cn("mb-14 max-w-2xl", center && "mx-auto text-center")}>
      <p className="kicker mb-4">{kicker}</p>
      <h2 className="text-4xl font-bold sm:text-5xl">{title}</h2>
      {sub && <p className="mt-5 text-lg text-muted">{sub}</p>}
    </div>
  );
}
