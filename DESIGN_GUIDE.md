# Falcotrix — Design Guide

Implementation spec for the design system. No rationale. No marketing copy. Just tokens, patterns, and constraints.

## Layout / container widths

Every section's outer container follows this scale — `mx-auto max-w-{N} px-6 lg:px-6`:

| Context | Max-width |
|---|---|
| Navbar | `max-w-[1400px]` (custom, wider than any content container) |
| Wide content (ProductDetail, ProductListing, PeopleBelieve, RawPerformance, CTABanner, Footer) | `max-w-7xl` |
| Hero sections, PrivacyContent, ProductHeader | `max-w-6xl` |
| Narrow content (ContactForm) | `max-w-4xl` |

Base padding is `px-6` at all sizes; `lg:px-6` (not `lg:px-8`) at large breakpoints — kept intentionally tight so containers don't leave excess edge gap on common desktop widths (1366-1440px). Don't reach for `lg:px-8` on new sections.

## Color tokens

CSS variables in `src/app/globals.css` (Tailwind v4 — tokens auto-promote to utilities):

```css
@theme {
  /* Surfaces */
  --color-bg: #08090c;
  --color-surface: #131419;
  --color-surface-elevated: #1b1d24;
  --color-border: #24262e;
  --color-border-strong: #33353f;

  /* Glass / transparent cards */
  --color-glass: #ffffff0f;
  --color-glass-hover: #ffffff17;
  --color-glass-border: #ffffff19;
  --color-glass-border-strong: #ffffff26;

  /* Text */
  --color-text: #f5f6f8;
  --color-text-muted: #9a9ea8;
  --color-text-faint: #63666f;

  /* Brand */
  --color-accent: #0048ff;
  --color-accent-hover: #0d55ff;
  --color-accent-dim: #003ad1;
  --color-accent-faint: #0048ff1a;

  /* Light section (CTA banner only) */
  --color-light-bg: #ffffff;
  --color-light-text: #0a0a0c;
  --color-light-text-muted: #565961;
}
```

Client-locked value: `--color-accent: #0048FF`. Do not adjust without Fahim's sign-off.

## Typography

**Families** (self-hosted via Fontsource, imported in `src/app/layout.tsx`):
- Display + body: Google Sans Flex Variable (`--font-display`) — used for everything except code/data
- Mono: JetBrains Mono Variable (`--font-mono`) — diagnostic panel, timestamps, IDs only

Both are variable fonts with a `wght` axis (1–1000). Standard Tailwind `font-*` weight utilities (`font-medium`, `font-semibold`, etc.) work directly — the browser interpolates the axis from the CSS `font-weight` property, no special handling needed.

Client-locked value: "Google Sans" per brief — implemented as Google Sans Flex (the current, publicly-shipping variable version on Google Fonts).

**Size scale:** Tailwind defaults (`text-sm` through `text-7xl`) — hero headline runs `text-5xl` → `text-7xl` across breakpoints, section headings `text-4xl` → `text-5xl`.

**Hero section text color:** all text in any hero section — heading and subtitle paragraph — is plain `text-white`. No two-tone headings (no `text-text-muted` spans mixed into a hero `h1`), no `#eeeeee`-tinted paragraphs. Applies to every hero across the site (homepage, `/products`, `/privacy`, `/contact`, and any future one).

## Spacing scale

Tailwind defaults. Section vertical rhythm: `py-16` (CTA banner) to `py-28`–`py-32` (People Believes, Raw Performance).

## Border radius

| Token | Value | Use |
|---|---|---|
| `rounded-none` | 0px | Buttons, input fields (Name/Email/Subject/Time/Details) |
| `rounded-sm` | 4px | Badges |
| `rounded-lg` | 8px | Product cards, glass/transparent cards |
| `rounded-xl` | 12px | Raw Performance container |

## Components

### Button — primary
`src/components/ui/Button.tsx`, `variant="primary"` (default). Accent blue fill, glow shadow on hover.

### Button — secondary
`variant="secondary"` — dark surface fill with border, used on dark sections.

### Button — secondary-light
`variant="secondary-light"` — near-black fill, used only on the white CTA banner section.

### Product card
`src/components/ui/ProductCard.tsx` — surface card, lifts (`-translate-y-1`) and brightens border on hover. Supports an optional badge (e.g. "BETA") and either a CTA link or a status line (for not-yet-shipped products like Hearth). Opaque fill (`bg-surface`) — not a transparent card, does not use the glass treatment below.

### Glass / transparent card
Standard for ANY card that sits over imagery/background art rather than a flat section background — e.g. `src/components/sections/ProductListing.tsx`'s product panels. Background: `bg-glass` (white at <10% opacity, `--color-glass`) + `backdrop-blur-md`. Border: `border-glass-border`, brightening to `border-glass-border-strong` + `bg-glass-hover` on hover. Do not use `bg-surface/NN` + arbitrary opacity for new transparent cards — always use the `glass` token set so every translucent card in the app shares one visual language.

### Scroll indicator
`src/components/ui/ScrollIndicator.tsx` — small animated `ChevronDown`, absolutely positioned bottom-center of the section (`bottom-8`), gentle bob + fade via the `animate-scroll-hint` CSS keyframe. Standard on every hero section — homepage, `/products`, `/privacy`, `/contact`, and the generic `ProductHeader` used by every individual product page. Any new hero-style section should include it by default.

### Diagnostic panel
`src/components/ui/DiagnosticPanel.tsx` — client component, the Raw Performance section's signature element. GPU_THREAD_UTIL value drifts subtly every ~1.8s via `setInterval` for a "live system" feel; disabled under `prefers-reduced-motion`.

### Scroll reveal
`src/components/ui/Reveal.tsx` — wraps any section/block, fades + translates up on first intersection (`IntersectionObserver`, threshold 0.15). Supports `delayMs` for staggering multiple children (used for the three product cards). No-ops under `prefers-reduced-motion`.

## Animation defaults

- Hover transitions: `transition-colors duration-150 ease-out` (links), `transition-all duration-200 ease-out` (buttons)
- Card hover lift: `transition-all duration-300 ease-out`
- Scroll reveal: `0.7s cubic-bezier(0.16, 1, 0.3, 1)`, opacity + `translateY(24px)`
- Navbar frosted-glass transition: `duration-300 ease-out`

All motion is wrapped in `prefers-reduced-motion: reduce` handling — see `globals.css`.

## Dark mode notes

Dark-first, no light mode. One deliberate exception: the CTA banner section (`--color-light-bg` / `--color-light-text`) is white by design per the locked mockup — not a light-mode toggle, just that one section's fixed treatment.

- Background uses `#08090c`, not pure `#000000`
- Text uses `#f5f6f8`, not pure `#ffffff`

## Focus indicators

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

## Responsive breakpoints

Mobile-first Tailwind defaults (`sm`, `md`, `lg`). Navbar switches from hamburger menu to full inline nav at `md`. Product cards go 1-column → 3-column at `md`. Raw Performance copy/panel goes stacked → 2-column at `lg`.
