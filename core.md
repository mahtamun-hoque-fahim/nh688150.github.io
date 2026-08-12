# core.md — Falcotrix instruction log

Standalone log of everything Fahim says/instructs for this project, appended as the conversation happens. Separate from AGENTS.md's Session Log (which tracks dev work, not instructions verbatim).

---

## 2026-08-07 to 2026-08-08

- Building a website for Falcotrix, a software company. Build section-by-section with strict rules to log every work in core.md. Site must be responsive on every device. (Later clarified: core.md logging was deferred for a bit, then explicitly turned back on — see below.)
- Uploaded `homepage.png` mockup — full homepage design reference.
- Told to skip core.md for the moment; start with homepage; will build other pages later. Asked to confirm understanding of the image and what's needed from Fahim.
- Uploaded `Falcotrix_Logo_1_.png` (logo mark) and `Frame_97.png` (blue wave background asset).
- Answers to open questions:
  1. Accent color: `#0048FF`
  2. Font: "Google Sans, get it from fonts.google.com"
  3. Logo: uploaded (use as-is)
  4. Copy: final, including "People Believes" (not a typo to fix)
  5. Folio / ReelVault / Hearth: separate pages, to be built later
  6. Stack: Next.js + Tailwind confirmed as default; confirm smooth build on Vercel first, establish Cloudflare later
  7. Background graphic: uploaded (`Frame_97.png`), use directly rather than recreating in SVG
- Corrected Claude on Google Sans: it does exist on fonts.google.com (Google Sans Flex, the variable version) — Claude had initially said it wasn't available; confirmed via search that Fahim was right.
- Asked which Next.js version — confirmed Next.js 16 (16.3.0, current stable) as the build target.
- Instruction: whenever Fahim says something in future, log that too (this is why core.md exists as a standalone file, not folded into AGENTS.md's session log).
- Asked where code/iterations should be pushed. Clarified via two questions:
  - core.md logging: standalone file (not merged into AGENTS.md)
  - GitHub repo: already exists, Fahim would provide the URL
- Provided repo URL: `https://github.com/mahtamun-hoque-fahim/nh688150.github.io` — flagged to Fahim that this doesn't match the GitHub Pages username-repo naming convention (not blocking, since Vercel is the deploy target).
- Provided GitHub PAT for push access (treated as burned/rotate-immediately per standing rule; not stored anywhere in the repo or docs).
- Build order specified: **Navbar → Hero → People Believes → Raw Performance → CTA Banner → Footer**.
- Requirements: sticky frosted-glass navbar on scroll, scroll-reveal animations on sections, hover states on all buttons + cards, smooth transitions throughout.
- Said "go, fire up" — build began.
- Asked "pushed yet?" — prompted finishing visual verification and completing the first push.
- Uploaded a screenshot of the deployed `falcotrix.vercel.app` and asked to find out why the hero background image wasn't showing fully — diagnosed as a severe `object-cover` crop (55% of the image was being cut off from the top) caused by a container whose aspect ratio didn't match the image; fixed by rendering at natural aspect ratio, improving visible fraction from 44.8% to 71.7%.
- Proposed a cleaner architecture: full height/width hero container with the background image set to `cover`, nav not taking up layout space at the top. Implemented: Navbar switched from `sticky` to `fixed` (floats transparently over hero, turns frosted-glass on scroll, no longer pushes page content down); Hero switched to `min-h-screen` with true `object-cover` full-bleed background — this also fixed the crop math properly (81.7% of the image visible vs. the original short-container's 44.8%, since a full-viewport container's aspect ratio is much closer to the image's native proportions). Also restructured the Raw Performance section's background glow to live at the section level (bleeding up from below the card) rather than confined inside the card, matching the mockup more accurately.
- Uploaded a screenshot of an earlier Vercel preview showing the Raw Performance section's background graphic and said 'I liked it, bring just this one back' — restored the original fill+object-cover-right-bottom treatment inside the card, and removed the gradient overlay div per instruction (no darkening wash over the image).
- Uploaded a new, hero-specific background image ("Hero_Section__1_.png", 1280x641, wave graphic confined to bottom-left corner with more black negative space, closer to 2:1 aspect ratio). Instructions: use it only in the Hero section (not Raw Performance, which keeps the original asset), add a parallax scroll effect, no overlay on the image, title color #fff, description color #eee.
- Instructions: (1) every button gets sharp edges (no border-radius), (2) Raw Performance section redesigned with a scroll-triggered boot sequence -- no dark overlay on bg img, terminal panel flies in while the bg image punches into a zoom, a "Loading N%" counter runs first (fast), then the INFO/OK log lines stream in one at a time, GPU_THREAD_UTIL bar rapid-fills with the percentage counting up alongside it, and the cursor line becomes a permanent looping "Initializing" / "Initializing." / "Initializing.." / "Initializing..." cycle, forever.
- Feedback on the boot sequence: the counting/speeding-up parts were too fast; wanted it slower so the acceleration is actually felt/enjoyed. Clarified exact order: terminal flies in with bars empty and no text at all -> "Loading" word types in -> percentage rises -> other log lines type in line by line.
- Feedback: the terminal box was growing in height as each line came up. Wanted a fixed final height from the start, with text filling into it rather than the box resizing.

## 2026-08-11

- New task: build the Products listing page at `/products`, then `/folio`, `/reelvault`, `/hearth` as one real parent + child route per product. Match existing design system exactly (accent `#0048FF`, Google Sans Flex self-hosted, JetBrains Mono for terminal/code, `rounded-none` buttons, dark-first palette, scroll-reveal + hover states). Build section-by-section, confirming each piece, logging everything in core.md — same discipline as the homepage build.
- Uploaded `Product_Page__Listing.png` mockup — the `/products` page. Confirmed via analysis this reuses the existing design language (not a new one): Navbar → new Hero variant ("Native Utilities" / "Built To Run Fully Offline") → expanded "People Believes"-style alternating image/text panels for Folio, ReelVault, Hearth → same CTABanner → same Footer.
- Answers to open questions:
  1. Hero copy on `/products` is final, word-for-word, as shown in the mockup.
  2. Placeholder image boxes: Fahim will drop real images in later — build as reserved placeholders for now.
  3. Navbar "Product" link should point to `/products` once the page exists (previously `/#product` anchor on homepage).
  4. Build `/products` first; `/folio`, `/reelvault`, `/hearth` mockups/scope to be provided after.
- Background treatment instruction for `/products`, using the same homepage hero image (`hero-section-bg.png`) in three different treatments down the page:
  1. Hero: fully desaturated (grayscale).
  2. Next section (product listing): fully desaturated + rotated 180°.
  3. Just before the final CTA banner: normal full color, no rotation.
- Confirmed: full desaturation (not partial), rotate the whole image asset 180° (not a horizontal flip), and the "before final CTA" normal-color treatment is the glow bleeding in near the end of the listing section, right before the white CTA banner.
- Said "go, fire up" with a fresh PAT — build began. Built and pushed the `/products` Hero section (`ProductsHero.tsx`, reusable `WaveBg.tsx` for the three background treatments) plus rewired the "Product" nav link and both "Visit Products Page" buttons (homepage Hero + CTABanner) to point to `/products`.
- Checked screenshot of live Vercel deploy — confirmed Hero matched. Asked to continue to the next section.
- Built `ProductListing.tsx` (the alternating Folio/ReelVault/Hearth panels), `PlaceholderImage.tsx` (IMAGE-BRIEF style reserved-space placeholder), extended `WaveBg.tsx` with `position`/`opacity`/`bounds` props for the glow treatment, and wired `CTABanner` (reused as-is, matching the mockup's literal reuse of the same banner) between the listing and Footer. Verified via Puppeteer: initial full-page screenshot attempts gave false negatives (fixed-nav duplication artifact from `fullPage: true` tiling, and a synthetic scroll-jump test outrunning the 0.7s/200ms-delay reveal transition on the third panel) — resolved by testing with realistic scroll timing, confirmed all three panels, the rotated wave (dialed to a subtle 0.12 opacity), and the normal-color glow bleed all render correctly matching the mockup, on both desktop and mobile.

