# Falcotrix — Design Guide

Implementation spec for the design system. No rationale. No marketing copy. Just tokens, patterns, and constraints.

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

## Spacing scale

Tailwind defaults. Section vertical rhythm: `py-16` (CTA banner) to `py-28`–`py-32` (People Believes, Raw Performance).

## Border radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 4px | Badges |
| `rounded-md` | 6px | Buttons |
| `rounded-lg` | 8px | Product cards |
| `rounded-xl` | 12px | Raw Performance container |

## Components

### Button — primary
`src/components/ui/Button.tsx`, `variant="primary"` (default). Accent blue fill, glow shadow on hover.

### Button — secondary
`variant="secondary"` — dark surface fill with border, used on dark sections.

### Button — secondary-light
`variant="secondary-light"` — near-black fill, used only on the white CTA banner section.

### Product card
`src/components/ui/ProductCard.tsx` — surface card, lifts (`-translate-y-1`) and brightens border on hover. Supports an optional badge (e.g. "BETA") and either a CTA link or a status line (for not-yet-shipped products like Hearth).

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
