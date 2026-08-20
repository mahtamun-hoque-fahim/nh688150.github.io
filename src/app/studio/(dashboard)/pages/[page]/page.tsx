import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSectionsForPage } from "@/lib/actions/pages";
import { PAGE_GROUPS, type PageGroup } from "@/lib/studio-pages";
import { listProducts } from "@/lib/actions/products";
import { SECTION_LABELS, SECTION_SCHEMA_TYPE, FIELD_DEFS } from "@/lib/studio-section-fields";
import type { SectionRegistryKey } from "@/lib/content-schemas";
import { SectionEditorForm } from "@/components/studio/SectionEditorForm";
import { PeopleBelieveEditor } from "@/components/studio/PeopleBelieveEditor";

const PAGE_LABELS: Record<PageGroup, string> = {
  home: "Home",
  products: "Products",
  privacy: "Privacy",
  contact: "Contact",
  global: "Global (Footer, shared)",
};

export default async function PageSectionsPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  if (!PAGE_GROUPS.includes(page as PageGroup)) {
    notFound();
  }
  const pageGroup = page as PageGroup;

  const [sections, products] = await Promise.all([
    getSectionsForPage(pageGroup),
    pageGroup === "home" ? listProducts() : Promise.resolve([]),
  ]);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href="/studio/pages"
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-text-faint hover:text-text-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          All pages
        </Link>
        <h1 className="font-display text-2xl font-medium tracking-tight text-white">
          {PAGE_LABELS[pageGroup]}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section) => {
          const key = section.key as SectionRegistryKey;
          const schemaType = SECTION_SCHEMA_TYPE[key];

          if (schemaType === "people_believe") {
            return (
              <PeopleBelieveEditor
                key={key}
                initialContent={section.content}
                productSlugs={products.map((p) => p.slug)}
              />
            );
          }

          return (
            <SectionEditorForm
              key={key}
              sectionKey={key}
              label={SECTION_LABELS[key]}
              fields={FIELD_DEFS[schemaType]}
              initialContent={section.content}
              initialBackgroundMediaId={section.backgroundMediaId}
              initialBackgroundUrl={section.backgroundUrl}
            />
          );
        })}
      </div>
    </div>
  );
}
