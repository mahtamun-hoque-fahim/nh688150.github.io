import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Better Auth tables — shape matches Better Auth's Drizzle adapter   */
/* expectations for the emailAndPassword provider. Do not rename      */
/* columns without checking better-auth's drizzle adapter docs first. */
/* ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("admin"), // flat role model — every account is an admin
  banned: boolean("banned").notNull().default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  impersonatedBy: text("impersonated_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  password: text("password"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* App tables                                                         */
/* ------------------------------------------------------------------ */

/** Pending admin invitations — link-based, no shared temp passwords. */
export const invite = pgTable("invite", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  invitedByUserId: text("invited_by_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // pending | accepted | expired
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Media Library — every uploaded image (backgrounds, logos, screenshots)
 * lives here once. Any content slot references an asset by id; multiple
 * slots may point to the same asset (shared) or different ones
 * (unique per page) — that's a dashboard choice, not a schema distinction.
 */
export const mediaAsset = pgTable("media_asset", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id").notNull(),
  altText: text("alt_text"),
  width: integer("width"),
  height: integer("height"),
  createdByUserId: text("created_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Editable copy + background for every fixed section on the four
 * marketing pages (home, products, privacy, contact). Layout/animation
 * stays code-controlled — only `content` (shape varies per sectionKey,
 * validated in the app layer) and `backgroundMediaId` are editable.
 */
export const pageSection = pgTable(
  "page_section",
  {
    id: text("id").primaryKey(),
    page: text("page").notNull(), // home | products | privacy | contact
    sectionKey: text("section_key").notNull(), // hero | about | cta_banner | card_1 ...
    content: jsonb("content").$type<Record<string, unknown>>().notNull(),
    backgroundMediaId: text("background_media_id").references(() => mediaAsset.id, {
      onDelete: "set null",
    }),
    updatedByUserId: text("updated_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("page_section_page_key_idx").on(table.page, table.sectionKey)],
);

/**
 * Individual product pages (Folio, ReelVault, Hearth, future). A slug
 * only resolves to a live /products/[slug] route if a row exists here
 * with published = true.
 */
export const product = pgTable("product", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default("By Falcotrix"),
  published: boolean("published").notNull().default(true),
  order: integer("order").notNull().default(0),

  logoMediaId: text("logo_media_id").references(() => mediaAsset.id, { onDelete: "set null" }),
  listingImageMediaId: text("listing_image_media_id").references(() => mediaAsset.id, {
    onDelete: "set null",
  }),
  heroBackgroundMediaId: text("hero_background_media_id").references(() => mediaAsset.id, {
    onDelete: "set null",
  }),
  contentBackgroundMediaId: text("content_background_media_id").references(
    () => mediaAsset.id,
    { onDelete: "set null" },
  ),

  aboutParagraphs: jsonb("about_paragraphs").$type<string[]>().notNull().default([]),
  aboutTagline: text("about_tagline"),
  aboutClosing: text("about_closing"),

  updatedByUserId: text("updated_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productModule = pgTable("product_module", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
});

export const productScreenshot = pgTable("product_screenshot", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  mediaId: text("media_id")
    .notNull()
    .references(() => mediaAsset.id, { onDelete: "cascade" }),
  caption: text("caption"),
  order: integer("order").notNull().default(0),
});

export const contactMessage = pgTable("contact_message", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  time: text("time"),
  details: text("details").notNull(),
  status: text("status").notNull().default("new"), // new | read | archived
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
