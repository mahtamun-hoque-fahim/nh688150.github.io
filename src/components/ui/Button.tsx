import type { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "secondary-light";
  className?: string;
}

const base =
  "inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_0_1px_var(--color-accent-hover),0_0_24px_var(--color-accent-faint)] active:bg-accent-dim",
  secondary:
    "bg-surface-elevated text-text border border-border hover:border-border-strong hover:bg-[#22242c]",
  "secondary-light":
    "bg-[#0a0a0c] text-white hover:bg-[#1a1a1e]",
};

export function Button({ href, children, icon, variant = "primary", className = "" }: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {icon}
      {children}
    </Link>
  );
}
