# SingFit STUDIO Caregiver

This repository contains the finished Astro implementation of the SingFit STUDIO Caregiver landing page. It is a static, component-based migration of the approved original site rather than a redesign.

## Technology

- Astro with static output
- TypeScript
- Component-scoped CSS with shared global foundations and design tokens
- Astro image optimization for local images
- Browser-native, component-owned interaction scripts with no client UI framework or hydration runtime

## Project structure

- `src/pages` — file-based routes; the landing page is `/`
- `src/layouts` — shared HTML document shell and metadata ownership
- `src/components` — site, section, and reusable UI components
- `src/data` — typed navigation, links, and repeated landing-page content
- `src/scripts` — component-owned mobile drawer, carousel, and product-video behavior
- `src/styles` — global foundations and design tokens
- `src/assets` — imported images processed by Astro
- `public/media` — MP4 product previews copied unchanged to the build

## Local requirements

- Node.js 24
- npm

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Available project commands:

```bash
npm run dev
npm run check
npm run build
npm run preview
```

`npm run build` writes the production-ready static site to `dist/`. Run `npm run preview` after a build to inspect that output locally.

## Deployment status

No official production host is configured. The project can be deployed as a static Astro site by publishing `dist/`, but deployment-specific canonical URLs, sitemap generation, redirects, headers, Content Security Policy, caching rules, and analytics are intentionally deferred until a host and production requirements are approved.

The page currently emits `noindex, nofollow` because it is maintained as a review/portfolio snapshot, not as the official production SingFit website.

## External services

- Google Fonts supplies Source Sans 3 and Source Serif 4.
- Vimeo hosts the guided-session video embed.
- Calendly is the destination for all nine walkthrough calls to action.
- Privacy, terms, and accessibility policy links point to external SingFit pages.

The site currently includes no analytics, checkout, cookies, web storage, or consent tooling.

## Accessibility

Phase 7B ended with a Lighthouse accessibility score of 1.00. The site includes keyboard-operable carousel pause/play controls, product-video pause/play controls with reduced-motion-aware playback, and an accessible mobile drawer with focus management, background inertness, and focus restoration.

The remaining known limitation is that the mobile drawer and carousel controls do not provide equivalent enhanced behavior when JavaScript is disabled. Lighthouse is an automated signal, not a substitute for manual keyboard, screen-reader, responsive, and real-device testing.

## Migration history

`MIGRATION_PLAN.md` and `PHASE_7_DECISIONS.md` retain the migration architecture, verification history, approved decisions, and deferred production work. `AGENTS.md` contains the repository working rules.
