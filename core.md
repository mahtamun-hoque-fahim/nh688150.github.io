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
