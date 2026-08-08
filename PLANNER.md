# Falcotrix — Planner

> One-line description: Marketing site for Falcotrix, a local-first desktop software company (Folio, ReelVault, Hearth).

## Project Overview

**Purpose.** Public marketing site introducing Falcotrix and its desktop product line. Positions the brand around local-first, zero-cloud, hardware-native software.

**Target user.** Prospective users of Falcotrix desktop tools (Folio, ReelVault, Hearth) evaluating whether to download.

**Key value.** Communicates "your data never leaves your machine" clearly enough that a visitor downloads Folio or visits the products page.

**Current phase.** Building — homepage complete, product subpages not started.

---

## Architecture

**Stack:**
- Framework: Next.js 16.3.0 App Router (Turbopack)
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4 (tokens in `globals.css`)
- Fonts: self-hosted via Fontsource — `@fontsource-variable/google-sans-flex`, `@fontsource-variable/jetbrains-mono` (not `next/font/google` — see Notes & decisions)
- Icons: lucide-react only, no emoji
- Database / Auth: none at this stage — pure marketing site, no user accounts
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
5. Or clicks "Explore Folio" on the product card → `/folio` (not yet built)

### Flow 2: Visitor checks legitimacy before downloading
1. Lands on `/`
2. Scrolls to "Raw Performance" section — reads the local-hardware pitch, sees the diagnostic panel
3. Scrolls to footer → clicks "Privacy" or "Contact"

---

## DB Schema

Not applicable — no database in this project yet. Add this section if/when Folio's download tracking, beta signup (ReelVault), or a contact form needs persistence.

---

## API Routes

None yet. All CTAs currently point to in-page anchors or future static routes (`/folio`, `/reelvault`, `/hearth`).

---

## Env Vars

None required yet — the site is fully static with no external services wired up.

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
Status: `[ ]` pending

- [ ] `/folio` page
- [ ] `/reelvault` page
- [ ] `/hearth` page
- [ ] tree-man run to generate SITETREE.md once subpages are scoped

### Phase 3 — Launch readiness
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
