export const PAGE_GROUPS = ["home", "products", "privacy", "contact", "global"] as const;
export type PageGroup = (typeof PAGE_GROUPS)[number];
