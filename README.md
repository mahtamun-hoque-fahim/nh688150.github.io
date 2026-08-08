# Falcotrix

Marketing site for Falcotrix, a local-first desktop software company (Folio, ReelVault, Hearth).

## Tech stack

- Next.js 16.3.0 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- Fontsource (self-hosted Google Sans Flex + JetBrains Mono)
- lucide-react

## Prerequisites

- Node.js >= 20.9.0
- npm

## Local setup

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Env vars

None required at this stage — the site is fully static.

## Commands

- Dev server: `npm run dev`
- Build: `npm run build`
- Start (production build): `npm run start`
- Type check: `npx tsc --noEmit`

## Folder structure

```
src/
  app/            App Router pages, layout, globals.css
  components/
    ui/           Button, ProductCard, Reveal, DiagnosticPanel
    sections/     Navbar, Hero, PeopleBelieve, RawPerformance, CTABanner, Footer
public/
  images/         logo.png, hero-bg.png
```
