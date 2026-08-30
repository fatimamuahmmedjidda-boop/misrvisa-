import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "gold" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald text-white hover:bg-emerald-dark shadow-sm hover:shadow-md",
  secondary:
    "bg-white text-emerald border border-emerald/20 hover:border-emerald hover:bg-ivory",
  gold: "bg-gold text-emerald-dark hover:bg-gold-dark shadow-sm hover:shadow-md",
  ghost: "text-emerald hover:text-emerald-light",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
