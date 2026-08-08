import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  name: string;
  badge?: string;
  description: string;
  cta?: { label: string; href: string };
  status?: string;
}

export function ProductCard({ name, badge, description, cta, status }: ProductCardProps) {
  return (
    <div className="group flex h-full flex-col rounded-lg border border-border bg-surface p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-strong hover:bg-surface-elevated hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2.5">
        <h3 className="font-display text-2xl font-medium tracking-tight">{name}</h3>
        {badge && (
          <span className="inline-flex items-center rounded-sm bg-accent px-2 py-0.5 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">{description}</p>

      {cta && (
        <Link
          href={cta.href}
          className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-none bg-surface-elevated px-4 py-2 text-sm font-semibold text-text transition-all duration-200 ease-out group-hover:bg-[#22242c] hover:gap-2.5"
        >
          {cta.label}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
        </Link>
      )}

      {status && (
        <p className="mt-6 text-xs italic text-text-faint">
          <span className="font-mono not-italic">Status:</span> {status}
        </p>
      )}
    </div>
  );
}
