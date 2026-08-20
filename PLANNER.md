# Falcotrix — Planner

> One-line description: Marketing site for Falcotrix, a local-first desktop software company (Folio, ReelVault, Hearth).

## Project Overview

**Purpose.** Public marketing site introducing Falcotrix and its desktop product line. Positions the brand around local-first, zero-cloud, hardware-native software.

**Target user.** Prospective users of Falcotrix desktop tools (Folio, ReelVault, Hearth) evaluating whether to download.

**Key value.** Communicates "your data never leaves your machine" clearly enough that a visitor downloads Folio or visits the products page.

**Current phase.** Building — homepage, `/products`, `/privacy`, `/contact`, and `/folio` complete. Falcotrix Studio (`/studio`, admin dashboard) underway — auth/schema foundation done, content-management screens (Pages, Products, Media, Contact inbox) still placeholders.

---

## Architecture

**Stack:**
- Framework: Next.js 16.3.0 App Router (Turbopack)
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4 (tokens in `globals.css`)
- Fonts: self-hosted via Fontsource — `@fontsource-variable/google-sans-flex`, `@fontsource-variable/jetbrains-mono` (not `next/font/google` — see Notes & decisions)
- Icons: lucide-react only, no emoji
- Database / Auth: Neon (Postgres) + Drizzle ORM, Better Auth (email/password, admin plugin, invite-only account creation — no public sign-up). Introduced for Falcotrix Studio (`/studio`), the admin dashboard. See DB Schema, API Routes, Env Vars below.
- Deployment: Vercel (primary); Cloudflare Workers via `@opennextjs/cloudflare` planned as secondary, not yet configured

**Deployment topology:**
- `main` → Vercel production (once repo is imported to Vercel)
- Cloudflare mirror: deferred until after Vercel is confirmed stable

**Folder structure (summary):** see README.

---

## User Flows

### Flow 1: Visitor evaluates and downloads Folio
1. Lands on `/` (homepage)
2. Reads hero — "Quality Software On Your Machine"
3. Scrolls to "People Believes" — sees Folio / ReelVault / Hearth cards
4. Clicks "Download Folio" (hero, or CTA banner, or navbar) → `/#download` anchor for now, real download link TBD
5. Or clicks "Explore Folio" on the product card → `/folio` (moving to `/products/folio` once Studio's dynamic product route ships — see Studio phase)

### Flow 2: Visitor checks legitimacy before downloading
1. Lands on `/`
2. Scrolls to "Raw Performance" section — reads the local-hardware pitch, sees the diagnostic panel
3. Scrolls to footer → clicks "Privacy" or "Contact"

### Flow 3: Admin signs in and invites a teammate
1. Admin goes to `/studio/login`, signs in with email/password
2. From `/studio/team`, enters a teammate's email and sends an invite
3. Teammate receives an email (Resend) with a link to `/studio/accept-invite/[token]`
4. Teammate sets their own name + password — Better Auth's `admin` plugin creates the account server-side (`auth.api.createUser`), independent of the public sign-up route, which stays disabled
5. Teammate is redirected to `/studio/login` to sign in with their new credentials

### Flow 4: Admin forgets their password
1. From `/studio/login`, clicks "Forgot password?" → `/studio/forgot-password`
2. Enters email, Better Auth's `sendResetPassword` callback emails a reset link via Resend
3. Link lands on `/studio/reset-password?token=...`, admin sets a new password
4. No other admin or "owner" is ever in this loop — self-service, structurally (hashed passwords, no plaintext recovery)

---

## DB Schema

Neon (Postgres) + Drizzle ORM. Schema lives in `src/lib/db/schema.ts`.

**Better Auth tables** (shape required by the Drizzle adapter — don't rename columns without checking Better Auth's docs first):
- `user` — id, name, email, emailVerified, image, `role` (flat "admin" for everyone), `banned`/`banReason`/`banExpires` (admin plugin fields, unused today), timestamps
- `session` — id, userId, token, expiresAt, ipAddress, userAgent, impersonatedBy, timestamps
- `account` — id, userId, accountId, providerId, password (hashed), OAuth token fields (unused, credential-only today), timestamps
- `verification` — id, identifier, value, expiresAt, timestamps (Better Auth's internal token storage — password reset, etc.)

**App tables:**
- `invite` — id, email, token, invitedByUserId, status (pending/accepted/expired), expiresAt, createdAt. Link-based invites, no shared temp passwords.
- `media_asset` — id, url, cloudinaryPublicId, altText, width, height, createdByUserId, createdAt. Every uploaded image lives here once; any content slot below references an asset by id — shared or unique per slot is a dashboard choice, not a schema distinction.
- `page_section` — id, page (home/products/privacy/contact), sectionKey (hero/about/cta_banner/card_1/...), content (jsonb, shape varies per sectionKey), backgroundMediaId, updatedByUserId, updatedAt. Unique on (page, sectionKey). Layout/animation stays code-controlled; only content + background are editable.
- `product` — id, slug (unique), name, tagline, published, order, logoMediaId, listingImageMediaId, heroBackgroundMediaId, contentBackgroundMediaId, aboutParagraphs (jsonb string[]), aboutTagline, aboutClosing, updatedByUserId, timestamps. A slug only resolves to a live `/products/[slug]` route if a row exists with `published = true`.
- `product_module` — id, productId, title, description, order
- `product_screenshot` — id, productId, mediaId, caption, order
- `contact_message` — id, name, email, subject, time, details, status (new/read/archived), createdAt

---

## API Routes

- `POST/GET /api/auth/[...all]` — Better Auth's mounted handler (sign-in, sign-out, session, password reset, admin plugin endpoints)
- Server Actions (not REST routes, called directly from Client Components): `src/lib/actions/invites.ts` — `createInvite`, `getInviteByToken`, `acceptInvite`, `listInvites`, `listAdmins`
- More Server Actions land here as Studio's Pages/Products/Media/Contact screens are built (see Studio phase below)

**One-off scripts** (not part of the deployed app, run manually):
- `npm run seed` — idempotent, migrates today's hardcoded marketing copy + Folio's content into real DB rows. Safe to re-run.
- `npm run create-admin -- email name password` — bootstraps the very first admin account. Every admin after that is created via the in-app invite flow, not this script.
- `npm run db:push` — pushes the Drizzle schema to Neon (no migration files, direct sync — fine for this project's stage)
- `npm run db:studio` — opens Drizzle's own DB browser UI locally

---

## Env Vars

None of these have real values yet — schema/code is built and verified (`tsc`, `next build` both pass), but nothing has been tested against a live Neon/Cloudinary/Resend account. See `.env.example` for the full documented list:

- `DATABASE_URL` / `DATABASE_URL_UNPOOLED` — Neon, pooled vs. direct
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` / `NEXT_PUBLIC_BETTER_AUTH_URL` — Better Auth
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — Media Library uploads
- `RESEND_API_KEY` / `CONTACT_NOTIFY_EMAIL` — invite emails, password resets, contact form notifications

---

## Timeline / Phases

### Phase 1 — Homepage
Status: `[x]` done

- [x] Next.js 16 project bootstrapped, pushed to GitHub
- [x] Design tokens (color, type, spacing) established from mockup
- [x] Navbar — sticky, frosted-glass on scroll, mobile hamburger menu
- [x] Hero section
- [x] People Believes section (Folio / ReelVault / Hearth cards)
- [x] Raw Performance section (live diagnostic panel)
- [x] CTA Banner (light section)
- [x] Footer
- [x] Scroll-reveal on every section, hover states on every button/card
- [x] Responsive pass (mobile, tablet, desktop) verified via screenshot

### Phase 2 — Product subpages
Status: `[~]` in progress

- [x] `/products` listing page
- [x] `/privacy` page (built exactly per mockup; two known issues flagged, see Notes & decisions)
- [x] `/contact` page (form UI + client-side state complete; submit handler stubbed, needs a real backend — see Notes & decisions)
- [x] `/folio` page (built `ProductHeader`/`ProductDetail` as generic reusable components — ReelVault/Hearth are a content swap, not a rebuild; module copy and screenshots are placeholders pending admin dashboard — see Notes & decisions)
- [ ] `/reelvault` page — deferred, will be created via Studio's Products screen once built, not hand-written
- [ ] `/hearth` page — same as above
- [ ] tree-man run to generate SITETREE.md once subpages are scoped

### Phase 3 — Studio (admin dashboard)
Status: `[~]` in progress

- [x] Step 1: Drizzle schema (Better Auth tables + invite/media_asset/page_section/product/product_module/product_screenshot/contact_message), Neon client (`getDb()`, lazy), Better Auth instance (email/password, `disableSignUp: true`, admin plugin, Resend-backed password reset), `/api/auth/[...all]` handler, `proxy.ts` route protection, `.env.example`
- [x] `/studio/login`, `/studio/forgot-password`, `/studio/reset-password`, `/studio/accept-invite/[token]` — full auth UI, invite-link account creation (no shared temp passwords), self-service password reset
- [x] `/studio` dashboard shell (sidebar nav, sign-out) + `/studio/team` (list admins, list/send invites) — fully functional against the invite Server Actions
- [x] Verified: `tsc --noEmit` clean, `next build` succeeds (marketing pages stay static, Studio/auth pages correctly dynamic), redirect flow tested end-to-end with a temporary local-only test secret (not a real credential, never committed)
- [x] Step 2: `src/lib/content-schemas.ts` — zod schemas per `(page, sectionKey)`, the shared source of truth for both the seed script and the future dashboard section editor. `scripts/seed.ts` (`npm run seed`) — idempotent, migrates every page's current hardcoded copy into real `page_section` rows (home/products/privacy/contact heroes, People Believes, Raw Performance, CTA banner × 4 pages, Footer, all 3 Privacy cards including the still-unfixed duplicate) plus Folio's `product` + 6 `product_module` rows. `scripts/create-admin.ts` (`npm run create-admin`) — bootstraps Fahim's first admin account directly (every account after that goes through the invite flow, not this script). Fixed in review: originally crashed with a raw stack trace instead of a clean error when `DATABASE_URL` was unset — now matches `seed.ts`'s graceful-failure pattern.
- [x] Step 3: Media Library — `src/lib/cloudinary.ts` (lazy client, `uploadImage`/`deleteImage`), `src/lib/actions/media.ts` (`uploadMedia`/`listMedia`/`deleteMedia`, session-gated, 10MB/type-validated), `MediaUploadForm.tsx` + `MediaGrid.tsx` (upload form, responsive grid, copy-URL, delete-with-confirmation), `/studio/media` wired to real data, `next.config.ts`'s `remotePatterns` for Cloudinary images.
- [x] Step 4: Product CRUD — `src/lib/actions/products.ts` (list/get/create/update/delete + module and screenshot CRUD, batched media joins), `MediaPicker.tsx` (reusable image picker/uploader — also ready for Step 5), `ModulesManager.tsx`, `ScreenshotsManager.tsx`, `ProductEditForm.tsx`, `DeleteProductButton.tsx`, `NewProductForm.tsx`. `/studio/products` and `/studio/products/[id]` fully functional, replacing both placeholders.
- [x] Step 5: Page section editor — `src/lib/studio-section-fields.ts` (field metadata driven off `content-schemas.ts`), `src/lib/actions/pages.ts` (`getSectionsForPage`, `updatePageSection` — zod-validated, upserts), `SectionEditorForm.tsx` (generic, reuses `MediaPicker.tsx`), `PeopleBelieveEditor.tsx` (specialized — cards array referencing real products by slug). `/studio/pages` (5 groups: home/products/privacy/contact/global) and `/studio/pages/[page]` fully functional, replacing the placeholder.
- [ ] Step 6: Contact form → real DB write + `/studio/contact` inbox (currently a placeholder) + Resend notification
- [ ] Step 7: Swap every hardcoded marketing page over to DB reads; move `/folio` → `/products/folio` with a redirect from the old URL; dynamic `app/products/[slug]/page.tsx` route
- [ ] Real Neon, Cloudinary, and Resend credentials needed before any of this can be tested live — Fahim to provide when ready, flagged individually as each becomes necessary

### Phase 4 — Launch readiness
Status: `[ ]` pending

- [ ] Real download links (replace `/#download` anchor)
- [ ] Contact method (form or mailto) wired up
- [ ] SEO pass (Airborne) — meta tags, OG image, sitemap
- [ ] Vercel deploy verified
- [ ] Cloudflare Workers mirror configured

---

## Next Steps

In order:
1. Fahim to review homepage against mockup and flag any changes
2. Push Phase 1 to GitHub, import to Vercel, confirm live build
3. Scope `/folio`, `/reelvault`, `/hearth` pages when ready to build them

---

## Notes & decisions

**2026-08-08.** Repo `nh688150.github.io` does not match the GitHub Pages username-repo naming convention (`mahtamun-hoque-fahim.github.io`) — flagged to Fahim, not blocking since deploy target is Vercel.

**2026-08-08.** Used `Google_Sans_Flex` typeface per Fahim's explicit brief. Confirmed via search that Google Sans Flex is now genuinely published on Google Fonts (this postdates Claude's training data).

**2026-08-08.** Switched font loading from `next/font/google` to self-hosted `@fontsource-variable/google-sans-flex` + `@fontsource-variable/jetbrains-mono`. Reason: the build sandbox's network allowlist doesn't include `fonts.googleapis.com`/`fonts.gstatic.com`, so `next/font/google` failed the build here. Self-hosting also removes a runtime dependency on Google's font CDN, consistent with the self-hosted-font precedent on Bindu. Confirmed builds clean either way on Vercel's open network, but self-hosting is the safer, verifiable choice.

**2026-08-08.** Added a mobile hamburger menu to the navbar — the original mockup only showed a desktop nav, and without it the Product/Privacy/Contact links would have been unreachable below the `md` breakpoint.

**2026-08-08.** Hero and Navbar restructured: Navbar is `fixed` (floats transparently over the hero, no layout space of its own, frosted-glass kicks in on scroll); Hero is `min-h-screen` with a true full-bleed `object-cover` background. This was also the fix for a background-image crop bug — a full-viewport container's aspect ratio is much closer to the source image's native proportions than the previous short internal box was, so `cover` needs to crop far less (81.7% of the image visible vs. 44.8% before). Raw Performance section's background glow moved to section-level, bleeding up from below the card, rather than confined inside it — matches the mockup's subtle bottom-edge glow instead of a distracting shape stuffed into the card.

**2026-08-11.** Placeholder images across `/products` (Folio, ReelVault, Hearth panels) are temporary — Fahim's plan is to eventually build a dashboard to upload real product images, which will replace these `PlaceholderImage`/`IMAGE-BRIEF` slots. No dashboard exists yet; this is a forward-looking note, not a Phase 2/3 commitment yet. Revisit once a dashboard/CMS phase is actually scoped — will need auth + storage (Cloudinary, per Falcotrix's would-be stack precedent) + likely a DB table for image metadata, none of which exist in this project today.

**2026-08-11.** `/privacy` built exactly per its mockup, per Fahim's explicit "build as it is, we'll edit it later." Two known issues carried over from the mockup, deliberately not fixed yet:
1. Hero subtitle is a verbatim copy of `/products`' paragraph, including "Every product below runs entirely on your machine" — doesn't quite fit a page with no products listed.
2. The 2nd and 3rd content cards are word-for-word identical, both titled "Telemetry & Analytics" with the same three paragraphs — needs a real 3rd section (or the duplicate removed) once Fahim decides what that content should be.

**2026-08-11.** `/contact`'s form (`ContactForm.tsx`) is a fully working client-side UI — controlled inputs, validation, idle/submitting/success/error states — but the submit handler is a stub (a 600ms `setTimeout`, no real network call). Per AGENTS.md's no-backend-unless-needed rule, this wasn't wired to a real endpoint yet, but was deliberately built so it is: the `formData` shape (`name`, `email`, `subject`, `time`, `details`) matches what a real `/api/contact` route would expect, and the TODO comment in the submit handler marks exactly where to swap in a real call (e.g. Resend, matching the stack precedent noted below). When this becomes a priority, needs: an API route, an email service (Resend), and a decision on whether "Time" means preferred contact time/timezone or something else — currently just a free-text field with no semantic validation.

**2026-08-11.** `/folio`'s Modules section content and Screenshots grid are both explicitly temporary, per Fahim's instruction to log this: the 6 module titles/descriptions are hardcoded verbatim from the mockup for now, but will eventually be provided from an admin dashboard once one is built — same forward-looking status as the dashboard-driven product images noted above. Same for the Screenshots grid, currently `PlaceholderImage` reserved slots. `ProductHeader` and `ProductDetail` (in `src/components/ui/` and `src/components/sections/` respectively) were built as generic, prop-driven components specifically so that when a real dashboard/CMS phase happens, swapping hardcoded content for fetched data is a data-source change, not a component rewrite — and so `/reelvault`/`/hearth` can reuse them today with different props.
