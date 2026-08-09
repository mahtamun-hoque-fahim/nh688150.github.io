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

### 2026-08-08 (6)
- Did: Rewrote the boot sequence's pacing per Fahim's feedback -- previous version finished in under a second, too fast to perceive. New version: fly-in settles (900ms) with bars at 0% and terminal fully empty -> "[INFO] Loading..." types in character-by-character (~42ms/char) -> percentage counts 0-100 over 2.4s using an ease-in-quad curve (t*t) so it visibly starts slow and accelerates -> brief pause -> each of the 5 log lines types in character-by-character (~20ms/char, 240ms gap between lines) -> permanent looping "Initializing" + 0-3 dots. GPU/OCR bars fill independently over 2.8s using the same accelerating curve, starting at the same moment as the loading label. Full sequence now runs ~9-10s once, verified frame-by-frame via Puppeteer timestamped sampling. Reduced-motion still short-circuits straight to the final settled state.
- Decided: used requestAnimationFrame + easeInQuad for the numeric ramps (bars, percentage) instead of the previous setInterval-with-random-increments approach -- produces a smooth, deliberately accelerating curve instead of jittery random steps, which is what actually reads as "speeding up" to a viewer.
- Next: Confirm on Vercel; continue toward `/folio`, `/reelvault`, `/hearth` subpages when ready.

### 2026-08-08 (5)
- Did: All buttons switched to sharp edges (`rounded-none`) — Button component, navbar Download/hamburger/mobile-menu, ProductCard CTAs. Cards/panels/badges left alone (not buttons). Rebuilt Raw Performance's terminal into a full scroll-triggered boot sequence: section manages its own IntersectionObserver (replacing the generic `Reveal` wrapper) so the card fade-in, bg image zoom (scale-100 to scale-125, 2.2s ease-out), and terminal fly-in (translate-x + opacity, backOut easing) all fire off the same trigger. `DiagnosticPanel` now takes an `active` prop and runs a phase machine: loading counter (rapid, ~400-500ms) to streamed log lines (220ms apart) to a permanent looping "Initializing" + 0-3 dots cycle (400ms/step). GPU/OCR bars rapid-fill from 0 to target on trigger, then GPU settles into its existing subtle live-drift. Everything correctly collapses to the final state instantly under `prefers-reduced-motion` (verified via Puppeteer's `emulateMediaFeatures`).
- Decided: kept the existing shared `.reveal`/`.is-visible` CSS classes for the card-level fade even though the observer moved into the component, rather than inventing a new animation primitive — one less thing to keep in sync visually with the rest of the site's reveals.
- Next: Confirm on Vercel; continue toward `/folio`, `/reelvault`, `/hearth` subpages when ready.

### 2026-08-08 (4)
- Did: Added a dedicated hero-specific background image (`hero-section-bg.png`, wave confined to bottom-left, ~2:1 aspect ratio — closer to viewport proportions than the shared asset, so `object-cover` barely needs to crop). Built `HeroParallaxBg.tsx` — a client component applying `translate3d(0, scrollY * 0.3, 0)` via a scroll listener + rAF, disabled under `prefers-reduced-motion`. Removed the hero's gradient overlay entirely. Set title to `text-white`, description to exact `#eeeeee` per instruction. Raw Performance section untouched — keeps the original shared `hero-bg.png`.
- Decided: anchored the new image's object-position to `left-bottom` rather than `bottom` (center) — the wave graphic sits in the source image's bottom-left corner, and on narrow mobile viewports a center-anchored crop would have cut through it.
- Next: Confirm on Vercel; continue toward `/folio`, `/reelvault`, `/hearth` subpages when ready.

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
