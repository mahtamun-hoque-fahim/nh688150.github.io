import { z } from "zod";

export const heroContentSchema = z.object({
  heading: z.string(),
  headingLine2: z.string().optional(),
  paragraph: z.string(),
});

export const ctaBannerContentSchema = z.object({
  heading: z.string(),
  paragraph: z.string(),
  primaryButtonLabel: z.string(),
  primaryButtonHref: z.string(),
  secondaryButtonLabel: z.string(),
  secondaryButtonHref: z.string(),
});

export const footerContentSchema = z.object({
  tagline: z.string(),
  copyright: z.string(),
});

export const peopleBelieveCardSchema = z.object({
  productSlug: z.string(),
  description: z.string(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  badge: z.string().optional(),
  status: z.string().optional(),
});

export const peopleBelieveContentSchema = z.object({
  heading: z.string(),
  subheading: z.string(),
  cards: z.array(peopleBelieveCardSchema),
});

export const rawPerformanceContentSchema = z.object({
  heading: z.string(),
  headingLine2: z.string(),
  paragraph: z.string(),
});

export const productsListingHeadingContentSchema = z.object({
  heading: z.string(),
  subheading: z.string(),
});

export const privacyCardContentSchema = z.object({
  title: z.string(),
  paragraphs: z.array(z.string()),
});

/** Registry keyed by `${page}:${sectionKey}` — the single source of truth
 * for what content shape every editable section on the marketing site
 * takes. The seed script and the (future) dashboard section editor both
 * read from this. */
export const SECTION_SCHEMAS = {
  "home:hero": heroContentSchema,
  "home:people_believe": peopleBelieveContentSchema,
  "home:raw_performance": rawPerformanceContentSchema,
  "home:cta_banner": ctaBannerContentSchema,

  "products:hero": heroContentSchema,
  "products:people_believe_heading": productsListingHeadingContentSchema,
  "products:cta_banner": ctaBannerContentSchema,

  "privacy:hero": heroContentSchema,
  "privacy:card_1": privacyCardContentSchema,
  "privacy:card_2": privacyCardContentSchema,
  "privacy:card_3": privacyCardContentSchema,
  "privacy:cta_banner": ctaBannerContentSchema,

  "contact:hero": heroContentSchema,
  "contact:cta_banner": ctaBannerContentSchema,

  "global:footer": footerContentSchema,
} as const;

export type SectionRegistryKey = keyof typeof SECTION_SCHEMAS;
