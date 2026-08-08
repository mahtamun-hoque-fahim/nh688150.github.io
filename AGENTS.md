# Falcotrix

Marketing site for Falcotrix, a local-first desktop software company (Folio, ReelVault, Hearth).

## Git Identity (Session Start — run before any commit, every session)

```
git config user.name "mahtamun-hoque-fahim"
git config user.email "mahtamunhoquefahim@gmail.com"
```

Execute automatically at the start of every session, before the first commit — never ask, never skip, never commit as Claude. This applies across every Claude account/session working this repo.

## Setup & Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit`

## Conventions & Non-Negotiables

- No emojis anywhere in code or UI — lucide-react icons or inline SVG only
- No database, no auth — this is a static marketing site. Do not introduce Drizzle/Neon/Better Auth unless a real feature (e.g. beta signup, contact form) requires persistence, and confirm with Fahim first
- Fonts are self-hosted via Fontsource (`@fontsource-variable/*`), not `next/font/google` — the sandbox network this was built in cannot reach `fonts.googleapis.com`. Keep it this way unless there's a specific reason to switch back
- Deploy target: Vercel (primary). Cloudflare Workers mirror is planned but not yet configured — do not assume `@opennextjs/cloudflare` is wired up
- Next.js 16: this version has breaking changes from v15 — async `params`/`searchParams`/`cookies()`/`headers()`, Turbopack default, `proxy.ts` replaces `middleware.ts`. See the `next16builder` skill before writing new routes
- All copy on the homepage is client-locked, including "People Believes" (intentional, confirmed by Fahim, not a typo to fix)

## Security Gotchas

- `.env.local` is never committed — no env vars exist yet, but this applies the moment one is introduced
- The GitHub PAT used to push this repo was shared in chat — treat as rotated/revoked immediately after use, per standing rule

## Session Log

(Newest first. Maximum 10 entries — drop the oldest when an 11th is added.)

### 2026-08-08 (3)
- Did: Reverted Raw Performance's background treatment back to the original card-internal fill+object-cover (object-right-bottom), per Fahim showing a screenshot of an earlier Vercel preview he preferred. Removed the gradient overlay div entirely per his instruction — no darkening wash over the image anymore.
- Decided: Fahim's preference for this specific section overrides the "matches mockup more accurately" reasoning from the previous session — the visually bolder, more visible treatment was the one he wanted, not the more subtle/faithful-to-mockup one Claude had substituted.
- Next: Confirm on Vercel; continue toward `/folio`, `/reelvault`, `/hearth` subpages when ready.

### 2026-08-08 (2)
- Did: Diagnosed and fixed a severe hero background crop bug (55% of the image was being cut off — `object-cover` inside a wide-short container). Then restructured on Fahim's suggestion: Navbar is now `fixed` (floats transparently over the hero, no longer occupies layout space), Hero is `min-h-screen` with a true full-bleed `object-cover` background. This also fixed the crop math properly (81.7% visible vs. 44.8% before) since a full-viewport container's aspect ratio is much closer to the image's native proportions. Also moved the Raw Performance section's background glow to section-level (bleeding up from below the card) instead of confined inside it, matching the mockup.
- Decided: `object-cover` crop severity is driven entirely by how far the container's aspect ratio departs from the image's — check this before reaching for `fill`/`cover` on any future background image, most images have an intentional aspect ratio not meant to be reflowed into an arbitrary box shape.
- Next: Fahim to confirm this matches expectations, then re-verify on Vercel.

### 2026-08-08 (1)
- Did: Built and shipped the full homepage — Navbar (sticky frosted-glass, mobile hamburger), Hero, People Believes (3 product cards), Raw Performance (live diagnostic panel), CTA Banner, Footer. Scroll-reveal and hover states on every section. Verified responsive on mobile/desktop via Puppeteer screenshots.
- Decided: Self-hosted fonts (Fontsource) instead of `next/font/google` — sandbox network couldn't reach Google Fonts CDN, and self-hosting avoids a runtime dependency on it anyway. Also added a mobile hamburger menu not present in the original mockup, since the desktop-only nav would've made Product/Privacy/Contact unreachable on phones.
- Next: Fahim to review against mockup; then push to GitHub, import to Vercel, confirm live build; then scope `/folio`, `/reelvault`, `/hearth` subpages.
