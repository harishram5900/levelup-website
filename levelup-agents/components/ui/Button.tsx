import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-[transform,box-shadow,background-color,border-color] duration-200 will-change-transform hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_8px_30px_-8px_rgb(var(--violet)/0.7)] hover:shadow-[0_14px_40px_-8px_rgb(var(--cyan)/0.6)]",
  ghost: "text-fg hover:bg-fg/5",
  outline: "hairline bg-bg-2/40 text-fg hover:border-fg/25 hover:bg-fg/5",
};

type Common = { variant?: Variant; size?: "md" | "lg"; className?: string; children: React.ReactNode };

export function GradientButton({ variant = "primary", size = "md", className, children, ...rest }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], size === "lg" && "px-7 py-3.5 text-base", className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ href, variant = "primary", size = "md", className, children }: Common & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], size === "lg" && "px-7 py-3.5 text-base", className)}>
      {children}
    </Link>
  );
}
