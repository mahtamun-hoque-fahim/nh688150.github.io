import Link from "next/link";
import { FileText } from "lucide-react";
import { PAGE_GROUPS } from "@/lib/studio-pages";

const PAGE_LABELS: Record<(typeof PAGE_GROUPS)[number], string> = {
  home: "Home",
  products: "Products",
  privacy: "Privacy",
  contact: "Contact",
  global: "Global (Footer, shared)",
};

export default function StudioPagesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-white">Pages</h1>
        <p className="mt-2 text-sm text-text-muted">
          Edit copy and background images for every section, on every page.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
        {PAGE_GROUPS.map((page) => (
          <Link
            key={page}
            href={`/studio/pages/${page}`}
            className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-surface-elevated"
          >
            <FileText className="h-4 w-4 text-text-faint" strokeWidth={1.5} />
            <span className="text-sm text-text">{PAGE_LABELS[page]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
