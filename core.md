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
