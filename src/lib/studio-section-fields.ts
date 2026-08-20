import type { SectionRegistryKey } from "./content-schemas";

export const SECTION_LABELS: Record<SectionRegistryKey, string> = {
  "home:hero": "Hero",
  "home:people_believe": "People Believes",
  "home:raw_performance": "Raw Performance",
  "home:cta_banner": "CTA Banner",

  "products:hero": "Hero",
  "products:people_believe_heading": "Listing Heading",
  "products:cta_banner": "CTA Banner",

  "privacy:hero": "Hero",
  "privacy:card_1": "Card 1",
  "privacy:card_2": "Card 2",
  "privacy:card_3": "Card 3",
  "privacy:cta_banner": "CTA Banner",

  "contact:hero": "Hero",
  "contact:cta_banner": "CTA Banner",

  "global:footer": "Footer",
};

export type SchemaType =
  | "hero"
  | "cta_banner"
  | "footer"
  | "people_believe"
  | "raw_performance"
  | "products_listing_heading"
  | "privacy_card";

export const SECTION_SCHEMA_TYPE: Record<SectionRegistryKey, SchemaType> = {
  "home:hero": "hero",
  "home:people_believe": "people_believe",
  "home:raw_performance": "raw_performance",
  "home:cta_banner": "cta_banner",

  "products:hero": "hero",
  "products:people_believe_heading": "products_listing_heading",
  "products:cta_banner": "cta_banner",

  "privacy:hero": "hero",
  "privacy:card_1": "privacy_card",
  "privacy:card_2": "privacy_card",
  "privacy:card_3": "privacy_card",
  "privacy:cta_banner": "cta_banner",

  "contact:hero": "hero",
  "contact:cta_banner": "cta_banner",

  "global:footer": "footer",
};

export type FieldDef =
  | { key: string; label: string; kind: "text" }
  | { key: string; label: string; kind: "textarea" }
  | { key: string; label: string; kind: "string-array"; itemLabel: string };

export const FIELD_DEFS: Record<Exclude<SchemaType, "people_believe">, FieldDef[]> = {
  hero: [
    { key: "heading", label: "Heading", kind: "text" },
    { key: "headingLine2", label: "Heading line 2 (optional)", kind: "text" },
    { key: "paragraph", label: "Paragraph", kind: "textarea" },
  ],
  cta_banner: [
    { key: "heading", label: "Heading", kind: "text" },
    { key: "paragraph", label: "Paragraph", kind: "textarea" },
    { key: "primaryButtonLabel", label: "Primary button label", kind: "text" },
    { key: "primaryButtonHref", label: "Primary button link", kind: "text" },
    { key: "secondaryButtonLabel", label: "Secondary button label", kind: "text" },
    { key: "secondaryButtonHref", label: "Secondary button link", kind: "text" },
  ],
  footer: [
    { key: "tagline", label: "Tagline", kind: "textarea" },
    { key: "copyright", label: "Copyright line", kind: "text" },
  ],
  raw_performance: [
    { key: "heading", label: "Heading", kind: "text" },
    { key: "headingLine2", label: "Heading line 2", kind: "text" },
    { key: "paragraph", label: "Paragraph", kind: "textarea" },
  ],
  products_listing_heading: [
    { key: "heading", label: "Heading", kind: "text" },
    { key: "subheading", label: "Subheading", kind: "text" },
  ],
  privacy_card: [
    { key: "title", label: "Title", kind: "text" },
    { key: "paragraphs", label: "Paragraphs", kind: "string-array", itemLabel: "Paragraph" },
  ],
};
