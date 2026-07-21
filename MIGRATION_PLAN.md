# SingFit Static-to-Astro Migration Plan

## Purpose and migration constraints

This document plans a framework migration of the current SingFit STUDIO Caregiver landing page. The checked-in HTML, CSS, JavaScript, copy, URLs, media, crops, responsive rules, and accessibility behavior are the baseline. This is not authorization to redesign, rewrite copy, add integrations, or remove unexplained legacy material.

This plan is based on a complete inspection of the current repository. Astro has **not** been initialized, and no implementation file was changed while preparing this plan.

### Official Astro guidance consulted

The Astro Docs MCP was consulted on 2026-07-21. The recommendations below use the current official guidance that:

- [`src/pages` is Astro's required file-based routing directory](https://docs.astro.build/en/basics/project-structure/#directories-and-files); `src/components`, `src/layouts`, and `src/styles` are conventional but intentionally flexible.
- Source code and assets that Astro should process belong under `src/`; files that must be copied unchanged and remain addressable by stable public URLs belong under [`public/`](https://docs.astro.build/en/basics/project-structure/#public).
- Local images should normally be imported from `src` and rendered with Astro's [`<Image />` or `<Picture />`](https://docs.astro.build/en/guides/images/#astro-components-for-images), but responsive generation, format conversion, `object-fit`, and `object-position` must be introduced only after crop parity is verified. Images in `public` are not optimized.
- Astro component `<style>` blocks are scoped by default. Global CSS is commonly imported by a layout, and [cascade order and specificity](https://docs.astro.build/en/guides/styling/#cascading-order) must be considered when splitting the existing stylesheet.
- Browser-native scripts in `src` can be loaded from Astro components and will be bundled, deduplicated, treated as modules, and support TypeScript. Astro does not require React, Vue, or another UI framework for this site's interactions. See [Scripts and event handling](https://docs.astro.build/en/guides/client-side-scripts/).
- The deployment URL should eventually be set with Astro's `site` option for canonical URLs and sitemap generation. Standard metadata belongs in the document `<head>`, commonly through a shared layout or head component, not as generic values invented in `astro.config.mjs`. See [Configuration overview](https://docs.astro.build/en/guides/configuring-astro/#common-new-project-tasks).
- Astro does not natively optimize video. The current short portrait product demonstrations can remain local static media for parity; the existing long-form video should remain on its current hosted service unless a separately reviewed media decision is made.

## 1. Current project inventory

### Repository contents and status

The repository is a small, framework-free static site. The tracked implementation consists of:

```text
index.html
css/styles.css
js/main.js
assets/*
README.md
```

Additional repository context:

- `AGENTS.md` contains the migration requirements and is currently untracked.
- `.codex/config.toml` configures the Astro Docs MCP and is currently untracked. It is tooling configuration, not site or deployment configuration.
- `pricing/` exists but is empty and untracked. It does not contain a page.
- Root and `assets/` `.DS_Store` files exist and are tracked. They have no runtime purpose.
- Git is on `main` at the single commit `a81658a` (`original static site before Astro migration`).
- There is no `package.json`, lockfile, `astro.config.*`, `tsconfig.json`, Node version declaration, test setup, CI workflow, container configuration, Netlify configuration, redirects file, headers file, or other build system.

### Pages and routes

| Source | Current route | Role | Notes |
| --- | --- | --- | --- |
| `index.html` | `/` (or `/index.html`) | Primary and only page | Complete SingFit STUDIO Caregiver landing page. |
| `pricing/` | No authored route | Empty directory | Some simple directory servers may display an empty directory listing at `/pricing/`; it is not an intentional HTML route. Do not turn it into a route without review. |

There are no 404, privacy, terms, accessibility, success, checkout, or form-processing pages in this repository. Privacy, terms, and accessibility destinations are external.

The primary entry page is `index.html`.

### Major page regions in visual/DOM order

1. **Skip link** — `Skip to main content`, targeting `#main-content`.
2. **Site header / top bar** — SingFit logo lockup, desktop anchor navigation, desktop Calendly CTA, mobile menu toggle, overlay, and off-canvas mobile drawer.
3. **Hero** — headline, caregiver product explanation, primary Calendly CTA, `#video` secondary CTA, microcopy, caregiver photo, and overlaid product-control device image.
4. **Who it is for** — `#who`; introductory copy, real caregiver image, overlaid looping product video, three numbered audience/situation rows, and Calendly CTA.
5. **Guided session video** — `#video`; explanatory copy, lazy Vimeo iframe, `<noscript>` Vimeo fallback, and Calendly CTA.
6. **Benefits** — `#benefits`; section introduction, a second looping portrait product video on larger viewports, three alternating benefit/image rows, and Calendly CTA.
7. **Caregiver stories** — `#stories`; introduction, four-slide auto-advancing testimonial carousel, arrows, dots, and Calendly CTA.
8. **Questions** — `#questions`; four static question-and-answer rows. These are not accordions and do not collapse.
9. **Final walkthrough CTA** — `#pricing`; free 20-minute live demo message, two proof chips, three-item checklist, Calendly CTA, and no-obligation note. Despite the ID and price-card class names, no price or checkout is shown.
10. **Legal disclaimer** — product-support/non-medical disclaimer.
11. **Footer** — repeated logo lockup, 2026 company/address copy, external privacy/terms/accessibility links, and a final Calendly CTA.

### CSS inventory

#### `css/styles.css`

The single local stylesheet is 1,976 lines and controls the whole site. Its responsibilities are:

- Design tokens in `:root`: colors, shadows, site padding, and section gap.
- Global box sizing, body background, font stacks, base image behavior, typography, focus rings, and skip-link behavior.
- Full-width site/layout constraints, headers, sections, typography sizing, and shared lead/microcopy rules.
- Desktop navigation, mobile menu button, overlay, drawer, open state, scroll locking, and drawer transitions.
- Shared primary/secondary buttons and focus styles.
- Hero grid, glass frame, hero crop, and transparent device overlay.
- Shared section CTA alignment.
- Who-section grid, framed image, phone/video overlay, and numbered situation rows.
- Vimeo panel and 16:9 iframe container.
- Benefits intro, phone preview, alternating benefit rows, image frames, and crop rules.
- CSS-rendered phone frames and portrait product-video sizing.
- Testimonial carousel layout, transition, arrows, dots, active state, and hidden optional pause control.
- Static FAQ grid.
- Final CTA/price-card/checklist presentation.
- Footer, legal disclaimer, and dormant store-badge styles.
- Responsive breakpoints at `min-width: 1320px` and `max-width: 1120px`, `920px`, `768px`, `720px`, `560px`, and `420px`.
- A `prefers-reduced-motion: reduce` block that nearly eliminates CSS animations/transitions and smooth scrolling, and explicitly disables the carousel track transition.

The stylesheet is global and strongly coupled to the current DOM through descendant selectors, structural pseudo-classes, and order-sensitive media queries. Important examples include `.section > *`, `.section.center h2`, `.benefit-row:nth-child(even)`, `.benefit-row:nth-child(2)`, `.benefit-row:nth-child(3)`, `.drawer-nav a:last-child`, `.price-list-checklist li::before`, and `.footer > *`.

Potentially dormant selectors exist for `.price-sub`, `.price-list div`, `.store-signal`, `.store-signal-label`, `.official-store-badges`, `.stores`, `.carousel-pause`, and `[data-carousel-pause]`. The HTML does not currently contain those structures. They must remain until parity and a human-reviewed unused-code audit are complete.

#### External CSS and fonts

- Google Fonts stylesheet: `https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap`
- Preconnects: `https://fonts.googleapis.com` and `https://fonts.gstatic.com` (`crossorigin` on the latter).
- Body copy uses Source Sans 3 with `Segoe UI`/system fallbacks.
- Headings use Source Serif 4 with Georgia/Times fallbacks.
- No local font files exist.

#### Inline styles

- `index.html` contains no `style` attributes and no `<style>` blocks.
- `js/main.js` writes one runtime inline style: `transform: translateX(-N%)` on `[data-track]` for the active carousel slide.
- `assets/asset-10.svg` is a standalone unused App Store badge and contains internal SVG `style="fill: ..."` attributes. These are part of the asset, not page-level inline CSS.

### JavaScript inventory

#### `js/main.js`

The only local script is loaded once at the end of `index.html` with `defer`. It contains three immediately invoked functions:

1. **Mobile navigation** (lines 1–58): opens/closes the drawer, sets `body.menu-open`, synchronizes `aria-expanded`/`aria-hidden`, focuses the close button on open, restores the previous focus on close, closes from the close button/overlay/any drawer link/Escape, and loops Tab focus between the first and last focusable drawer controls.
2. **Testimonial carousel** (lines 62–141): adds slide labels, advances by translating the track, wraps at both ends, updates dot state and `aria-current`, auto-advances every 6.5 seconds, stops on hover/focus, restarts on mouse leave/focus out, and begins paused when reduced motion is requested. It includes support for an optional `[data-carousel-pause]` element, but no such control exists in the current HTML and CSS would hide it.
3. **Product video viewport control** (lines 143–182): forces portrait demo videos to be muted/inline, attempts playback, and uses `IntersectionObserver` (`rootMargin: 180px 0`, `threshold: 0.2`) to play videos near/in view and pause videos out of view. Browsers without `IntersectionObserver` simply receive a play attempt for both videos.

There are no JavaScript dependencies or third-party script tags.

#### Inline scripts

There are no inline `<script>` blocks in `index.html` and no inline event-handler attributes such as `onclick`.

### Asset inventory

All runtime references are relative to `assets/`. “Unused” means not referenced by the current `index.html`, CSS, or JavaScript; it does not mean approved for deletion.

| Asset | Type and intrinsic size | Current use / visible content |
| --- | --- | --- |
| `asset-01.png` | Transparent PNG, 599×135, 7.6 KB | SingFit logo; used three times in header/drawer/footer. |
| `Fixed Laina Testimonial Image.png` | PNG, 1689×931, 1.98 MB | Hero caregiver/loved-one photo; used with `object-fit: cover`. |
| `asset-05.png` | Transparent PNG, 1080×1350, 412 KB | Hero tablet/device image showing Lyric Coach, Guide Singer, Backing Music, Your Voice, and Playback Speed. |
| `E_YpTUiw.jpeg` | JPEG, 2808×1872, 604 KB | Who-section photo of two women singing with headphones. |
| `screen-capture2.mp4` | MP4, 1.59 MB, portrait | Used in the who-section phone. Preview shows Session Playlist controls and “Blue Eyes.” Autoplay/loop/muted/inline. |
| `screen-capture1.mp4` | MP4, 14.29 MB, portrait | Used in benefits intro phone on viewports wider than 768px. Preview shows the SingFit Songs list/player. Autoplay/loop/muted/inline. |
| `Sandy-Tubman-and-Caregiver-Picture-Light-Blue-Background.jpeg` | JPEG, 978×582, 129 KB | First benefit image; older woman and caregiver singing with tablet against a blue background. |
| `asset-08.png` | PNG, 1448×1086, 3.16 MB | Second benefit image; caregiver and loved one laughing with a tablet. |
| `Alicia-and-woman-pink-shirt-sing-clean.jpeg` | JPEG, 900×528, 120 KB | Third benefit image; caregiver and older woman in pink using a tablet. |
| `asset-02.png` | PNG, 1448×1086, 2.85 MB | Unused; caregiver and older woman looking at a phone. |
| `asset-03.png` | Transparent PNG, 1080×1440, 734 KB | Unused; two angled SingFit phone mockups. |
| `asset-04.png` | PNG, 1448×1086, 2.97 MB | Unused; caregiver and older man using a tablet. |
| `asset-06.png` | PNG, 1448×1086, 3.01 MB | Unused; caregiver holding an older woman's hands. |
| `asset-07.png` | PNG, 1448×1086, 3.05 MB | Unused; older man in headphones with caregiver. |
| `asset-09.png` | PNG, 1448×1086, 3.22 MB | Unused; caregiver and older woman singing with a tablet. |
| `hero-bold.png` | PNG, 1536×1024, 2.30 MB | Unused; caregiver and older man singing with headphones/tablet. |
| `Chelsea & Gram Grams Brown - Arms Raised - SS - Original.png` | PNG, 1067×554, 755 KB | Unused; caregiver and older woman with arms raised at a table. |
| `asset-10.svg` | SVG, 119.664×40 view box, 10.8 KB | Unused official “Download on the App Store” badge. |
| `asset-11.png` | PNG, 478×142, 10.5 KB | Unused “Get it on Google Play” badge. |

There are no favicon files, social-sharing images designated by metadata, downloadable documents, audio-only files, WebP/AVIF files, local fonts, or icon libraries. The menu icon, close glyph, carousel arrows, dots, checklist marks, and decorative shapes are CSS/HTML glyphs rather than separate assets.

### External assets, services, and third parties

| Service | Current use | Integration details |
| --- | --- | --- |
| Google Fonts | Source Sans 3 and Source Serif 4 | External stylesheet plus two preconnects. This is an external asset/CDN request and may matter to CSP/privacy review. |
| Vimeo | Guided-session video | Lazy iframe at `https://player.vimeo.com/video/1194167243?badge=0&autopause=0&player_id=singfit-session-video&app_id=58479`; fallback link is `https://vimeo.com/1194167243`. Allows fullscreen, picture-in-picture, clipboard-write, and encrypted-media. |
| Calendly | Conversion destination | Plain links to `https://calendly.com/rachelfrancine/complimentary-singfit-session`; there is no embedded widget or Calendly script. |
| SingFit “Music is Medicine” site | Legal destinations | External privacy, terms, and accessibility pages open in a new tab with `noopener noreferrer`. |

No other CDN, package, iframe, remote image, or external script is present.

### Analytics, tracking, consent, and privacy tooling

- No analytics script, tag manager, advertising pixel, session replay, link tracking, campaign parameter handling, or custom analytics event exists in the repository.
- No consent banner, consent manager, cookie preference UI, or privacy script exists.
- No code writes cookies, local storage, or session storage.
- Vimeo and Google Fonts are third-party requests and may have privacy implications even though no site-owned consent tooling is present.
- Calendly and footer links are ordinary navigation. There are no click listeners or tracking attributes on CTAs.

These absences must be preserved unless a separately approved requirement supplies the missing integration and its exact configuration.

### Forms and destinations

There are no `<form>`, `<input>`, `<textarea>`, `<select>`, form endpoint, email link, telephone link, or on-site submission workflow. Conversion happens by navigating to Calendly.

### CTA, checkout, and navigation link inventory

#### Calendly CTAs

All nine external conversion CTAs use exactly the same destination:

`https://calendly.com/rachelfrancine/complimentary-singfit-session`

| Location | Visible label |
| --- | --- |
| Desktop header | Free Walkthrough |
| Mobile drawer | Free Walkthrough |
| Hero | Talk with the SingFit Team |
| Who section | See if SingFit Fits Your Routine |
| Guided-session video section | Get a Free App Walkthrough |
| Benefits section | Ask About SingFit |
| Stories section | Talk with the SingFit Team |
| Final CTA / `#pricing` | Schedule Your Free Walkthrough |
| Footer | Free Walkthrough |

No CTA has `target="_blank"`; all nine replace the current page.

#### Internal navigation and secondary CTAs

- Desktop and mobile navigation each link to `#video`, `#who`, `#benefits`, `#stories`, and `#questions`, in that order.
- The hero secondary button, `See a session`, links to `#video`.
- The skip link targets `#main-content`.
- No link targets `#pricing`, despite that section ID existing.

#### Other external links

- Vimeo `<noscript>` fallback: `https://vimeo.com/1194167243`.
- Privacy Policy: `https://musicismedicine.singfit.com/privacy`.
- Terms of Service: `https://musicismedicine.singfit.com/terms`.
- Accessibility Statement: `https://musicismedicine.singfit.com/accessibility`.

#### Checkout

There is **no checkout link or paid purchase flow** in the current project. The `#pricing` section presents a free walkthrough. A checkout URL must not be guessed or added during migration.

### SEO, metadata, icons, and structured data

Present in `index.html`:

- `<!doctype html>`.
- `<html lang="en">`.
- UTF-8 charset.
- Responsive viewport metadata.
- Title: `SingFit STUDIO Caregiver Walkthrough`.
- Google Fonts preconnects and stylesheet.

Not present:

- Meta description.
- Canonical URL.
- Open Graph metadata.
- Twitter/X card metadata.
- Social image declaration.
- Favicon or apple-touch icon.
- Web app manifest or theme color.
- Robots meta tag, `robots.txt`, or sitemap.
- Structured data / JSON-LD.
- Search-engine verification metadata.
- Alternate-language metadata.
- Analytics/verification metadata.

Do not invent any of these values. The final Astro layout should have typed, optional ownership points for them, but only approved data should be emitted.

### Existing development and deployment assumptions

- `README.md` describes the site as a static landing-page prototype.
- Local use is either opening `index.html` directly or running `python3 -m http.server 8080` from the repository root.
- Deployment guidance is “Netlify Drop” or uploading a zip of the folder contents.
- Relative URLs assume the page is served from the domain root or alongside `css/`, `js/`, and `assets/`.
- No explicit production domain, base path, trailing-slash rule, redirect behavior, headers/CSP, cache policy, or Node runtime is documented.
- Astro static output will need a build step and the deployment publish directory will change to `dist/`; that is a deployment behavior change requiring confirmation.

## 2. Interaction inventory

### Interaction-to-source/DOM map

| Interaction | Current behavior | Source | Required DOM/CSS dependencies |
| --- | --- | --- | --- |
| Skip navigation | Becomes visible on focus and jumps to main content. | `index.html`; `css/styles.css` | `.skip-link` with `href="#main-content"`; `<main id="main-content">`. |
| Smooth anchor navigation | All same-page anchor links scroll smoothly unless reduced motion is requested. | `css/styles.css` | `html { scroll-behavior: smooth; }`; IDs `video`, `who`, `benefits`, `stories`, `questions`; reduced-motion override. |
| Responsive navigation switch | Desktop nav is hidden and menu toggle shown at `max-width: 1120px`. | `css/styles.css` | `.desktop-nav`, `.menu-toggle`; source order and breakpoint must remain equivalent. |
| Mobile drawer open | Toggle opens overlay/drawer, locks body scroll, updates ARIA, remembers focus, and focuses close button. | `js/main.js` lines 1–34; CSS menu block | `[data-menu-toggle]`, `[data-mobile-drawer]`, `[data-menu-close]`, `[data-menu-overlay]`, `body.menu-open`, `#mobile-menu-drawer`, and `aria-controls` linkage. |
| Mobile drawer close | Close button, overlay click, any `.drawer-nav a`, or Escape closes; focus returns to the previously focused element. | `js/main.js` lines 30–40 | Exact selectors above plus `.drawer-nav a`; retained `lastFocusedElement`. |
| Mobile drawer focus loop | While open, Tab from last wraps to first and Shift+Tab from first wraps to last. | `js/main.js` lines 42–56 | Focusables must remain inside drawer and match `a[href], button:not([disabled])`. DOM order is close button, six links. |
| Drawer visual transition | Overlay opacity and drawer translation animate; `aria-hidden=true` also applies `visibility:hidden`. | `css/styles.css` | `body.menu-open`, matching ARIA attributes, `.menu-overlay`, `.mobile-drawer`. |
| Testimonial next/previous | Arrows wrap through four slides. | `js/main.js` lines 62–141 | One `[data-carousel]`, child `[data-track]`, `[data-prev]`, `[data-next]`; track children must be slides. |
| Testimonial dots | Four dot buttons select corresponding slides and update `is-active`/`aria-current`. | `js/main.js`; CSS carousel block | `[data-dots] button`; dot count and order must match direct `[data-track]` children. |
| Carousel auto-advance | Advances every 6,500 ms, wraps, and restarts after manual selection. | `js/main.js` lines 92–140 | Timer state and `showSlide()`; track inline transform; CSS 0.72-second transform transition. |
| Carousel pause conditions | Stops on mouseenter/focusin; restarts on mouseleave/focusout. Starts paused when `prefers-reduced-motion` matches. | `js/main.js` | Carousel region events and initial media-query result. There is no visible pause/play control. |
| Carousel accessibility mutation | At startup, labels each slide “N of 4”; dot active state receives `aria-current`; viewport announces changes politely. | `index.html`; `js/main.js` | `role="region"`, `aria-roledescription="carousel"`, `aria-label`, slide `aria-roledescription`, `.carousel-viewport[aria-live="polite"]`. |
| Optional carousel pause | Script supports `[data-carousel-pause]`, updating `aria-pressed` and Play/Pause text. | `js/main.js` lines 70, 102–109, 128–132; CSS lines 1003–1006 | No current element exists and CSS forces it hidden. Preserve as dormant legacy behavior until reviewed. |
| Product preview videos | Both local videos autoplay, loop, remain muted, play inline, load metadata, and disable picture-in-picture. | `index.html` video elements | `.product-video`, MP4 `<source>`, exact attributes. |
| Viewport-aware video playback | Videos play at/near 20% intersection with 180px vertical margin; pause outside it; fallback plays all where IntersectionObserver is unavailable. | `js/main.js` lines 143–182 | `.product-video`; standard video `play()`/`pause()`; observer settings. |
| Benefits video responsive visibility | Entire benefits phone preview is hidden at `max-width: 768px`. | `css/styles.css` | `.benefits-intro-media { display:none; }`; video remains in DOM. |
| Vimeo playback | Lazy, third-party 16:9 iframe provides its own controls and fullscreen/PiP behavior. | `index.html` lines 171–183; CSS video block | Exact Vimeo URL/query, title, `allow`, `allowfullscreen`, referrer policy, 16:9 container. |
| Button/link hover/focus | CTA, navigation, badge, carousel, and footer links have CSS hover/focus states. | `css/styles.css` | Existing classes and `:focus-visible`; some dormant badge selectors. |
| Responsive image crops | Hero, who, and benefit photos change container dimensions and/or object position by breakpoint. | `css/styles.css` | Exact nested wrappers and specificity documented in the asset section below. |
| Reduced motion | Globally reduces CSS animation/transition duration, disables smooth scroll and carousel track transition; carousel auto-advance starts paused. | `css/styles.css`; `js/main.js` | `prefers-reduced-motion`; product videos currently do **not** honor it and continue attempting autoplay. |

### Explicitly absent interactions

- FAQ rows are static; there is no accordion behavior, disclosure control, or hidden answer state.
- There is no modal dialog. The mobile drawer is modal-like but implemented as an `<aside>` plus overlay, not `<dialog>` and not `role="dialog"`.
- There is no slider drag/swipe gesture, keyboard Arrow-key carousel navigation, or touch-specific script.
- There is no scroll-reveal/parallax animation, sticky header, active-section nav highlight, or resize listener.
- There is no form validation/submission, checkout, authentication, download, or link-tracking behavior.
- There are no analytics events, consent callbacks, or third-party JavaScript APIs.

### Behavior that should be documented before any improvement

- The auto-advancing carousel has no visible pause control, even though the script contains dormant support and CSS hides it.
- Product videos ignore `prefers-reduced-motion` and have no controls.
- The drawer loops focus but does not make the background inert, does not declare dialog semantics, and Escape can call the close path even when already closed.
- Carousel `focusout` can restart while focus is moving within the carousel because no `relatedTarget` containment check is made.
- Carousel code assumes track, arrows, and the expected dots exist; it only guards the outer carousel.
- `<aside aria-hidden="true">` retains descendants in the DOM; visual hiding is handled with CSS `visibility` and translation.
- The `#pricing` ID suggests pricing, but the section contains only a free walkthrough.

These may be accessibility or maintainability opportunities, but changing them during initial parity would alter source-of-truth behavior. Handle them as separately approved follow-up work.

## 3. Proposed Astro architecture

### Architecture principles for this site

- Build one Astro route because the source has one authored page.
- Use static `.astro` components for markup. Do not install a client framework and do not use `client:*` hydration directives.
- Keep the entire legacy stylesheet intact through the whole-page parity phase; scope and split only after visual baselines pass.
- Extract only meaningful page regions, repeated UI, and behavior owners.
- Put repeated approved copy/URLs in typed data only where doing so reduces drift and preserves exact strings.
- Keep browser behavior in small, component-owned TypeScript modules using stable `data-*` hooks rather than styling classes.
- Do not add ClientRouter/view transitions to a single-page landing site; it adds lifecycle complexity without a current requirement.

### Pages

#### `src/pages/index.astro`

The only route. It composes the layout, header, seven landing-page sections, legal disclaimer, and footer in the current order. Keeping page composition here makes the landing flow obvious without turning wrappers into components.

No `src/pages/pricing.astro` should be created. The empty `pricing/` directory is not evidence of an approved route.

### Layouts and metadata ownership

#### `src/layouts/SiteLayout.astro`

Owns the full HTML document shell: doctype, `<html lang>`, `<head>`, `<body>`, skip link, global style import, Google Fonts preconnect/stylesheet, and a slot for page content. Even with one current page, this is justified because it centralizes the document-level contract and metadata without mixing it into a landing section.

Props should include at least `title` and optional approved metadata fields. At first it should emit only what exists today. Later it can own approved description, canonical, Open Graph/Twitter tags, favicon links, robots rules, and JSON-LD. It must not fabricate these values.

The production `site` value in `astro.config.mjs` must wait for the approved deployment domain.

### Global components

#### `src/components/SiteHeader.astro`

Owns the desktop header and the complete mobile drawer because they are two responsive presentations of the same navigation and one behavior boundary. It imports/contains the mobile-menu script and uses `navigation` data to avoid duplicated href/label drift. The logo inside the drawer remains part of this component.

#### `src/components/SiteFooter.astro`

Owns company/address copy, legal navigation, logo lockup, and final CTA. Footer legal links come from typed site data.

#### `src/components/LegalDisclaimer.astro`

Owns the legally sensitive disclaimer as one independently reviewable block. It is not merged into the final CTA because it has separate semantics and content ownership.

### Landing-page section components

#### `src/components/sections/HeroSection.astro`

Owns the hero copy, two CTAs, photo frame, and overlaid product-control mockup. The nested wrappers are retained because the current crop, glass frame, and absolute overlay depend on them.

#### `src/components/sections/AudienceSection.astro`

Owns `#who`, its intro, real image, floating portrait preview, numbered audience situations, and section CTA. The three situations come from typed landing data.

#### `src/components/sections/SessionVideoSection.astro`

Owns `#video`, the Vimeo iframe/fallback, surrounding copy, and CTA. The external embed settings remain literal and reviewable in this component (or in one typed media record), rather than being generalized into an unnecessary universal embed system.

#### `src/components/sections/BenefitsSection.astro`

Owns `#benefits`, the large-screen product preview, three alternating benefit rows, and CTA. Benefit rows are rendered from typed data, but the section keeps the structural order needed by the current alternating layout and crop rules.

#### `src/components/sections/TestimonialsSection.astro`

Owns `#stories`, the four testimonials, all carousel controls/ARIA, and the carousel script. This is a component because it has independent content and behavior, not because of its wrappers.

#### `src/components/sections/FaqSection.astro`

Owns `#questions` and renders the four approved static Q&A rows from typed data. It remains static markup; do not introduce accordion JavaScript.

#### `src/components/sections/FinalCtaSection.astro`

Owns `#pricing`, the proof chips, checklist, and final walkthrough card. It is distinct from generic section CTAs because its layout and content are unique.

### Reusable UI components

#### `src/components/ui/LogoLockup.astro`

Justified by three occurrences with the same logo/product text but a footer presentation variant. It owns intrinsic image dimensions/alt text and prevents three asset references from drifting.

#### `src/components/ui/CtaLink.astro`

Justified by repeated primary/secondary pill links. It renders an anchor, not a button, and accepts only the small set of current visual variants. It must preserve each visible label and href exactly.

#### `src/components/ui/SectionCta.astro`

Justified by the repeated button-plus-note pattern after the who, video, benefits, and stories sections. It can accept the label, note, and alignment variant. Do not force the hero, header, footer, or final price card into it because their structure differs.

#### `src/components/ui/ProductPhoneVideo.astro`

Justified by the two portrait demo videos sharing the same phone frame, HTML video attributes, and viewport playback behavior. It accepts a local public video URL and exact accessibility label, with named variants for floating versus intro placement. Its processed component script can initialize all `.product-video` instances once without a framework.

Do **not** create generic components for `Section`, `Container`, `Grid`, `ImageFrame`, `Heading`, `Paragraph`, `BenefitRow`, `FaqRow`, or individual wrappers during initial extraction. Their current value is either purely structural or unique to one section, and excessive abstraction would hide the parity-critical DOM.

### Typed data files

#### `src/data/site.ts`

Contains typed constants for:

- Site/product name and current page title.
- The single Calendly destination.
- Primary navigation labels/fragment URLs.
- Footer legal link labels/URLs/target behavior.
- Current Vimeo video ID, embed URL, fallback URL, and title if centralization is preferred.

Centralizing the Calendly URL is especially important because it appears nine times. Types should restrict internal links and external-link options without rewriting labels.

#### `src/data/landing-page.ts`

Contains exact approved repeated records:

- Three audience situations (`number`, `heading`, `body`).
- Three benefits (`heading`, `body`, imported image metadata, alt text`).
- Four testimonials (`quote`, `attribution`).
- Four FAQs (`question`, `answer`).
- Repeated section CTA label/note pairs if that improves reviewability.

Use explicit TypeScript interfaces or `satisfies` clauses. Store exact punctuation—including curly quotes, apostrophes, ellipses, and capitalization—without editorial normalization.

Unique long-form section copy should remain next to its section template unless the content team explicitly wants all landing copy data-driven.

### Styles

#### Parity stage

- Copy `css/styles.css` to `src/styles/legacy.css` without cleanup and import it once from `SiteLayout.astro`.
- Preserve source order, breakpoint order, custom-property values, specificity, and selectors.
- Keep the root static site runnable as the comparison baseline while Astro runs separately.

#### Final organization after parity

- `src/styles/global.css`: box sizing, document/body foundations, global image rule, base typography, global focus treatment, skip link, and reduced-motion foundation.
- `src/styles/tokens.css`: the existing `:root` custom properties with values unchanged. It can be imported by `global.css` if that does not alter output order.
- Shared page/section layout rules can remain in `global.css` where they truly cross component boundaries.
- Each component/section owns its parity-tested scoped styles after extraction. The header owns navigation/drawer rules; testimonial section owns carousel rules; ProductPhoneVideo owns phone/video rules; etc.
- `CtaLink.astro` owns shared button styling, with carefully tested variant classes.
- Remove `legacy.css` only after all migrated rules have an owner and visual diffs pass at every required viewport.

Because Astro scoped parent styles do not automatically style child-component markup, cross-component selectors must be deliberately placed in global/shared CSS or moved into the child. Do not paste `.section h2` into the page and assume it will style headings inside extracted components.

### Client-side scripts

- `src/scripts/mobile-menu.ts` or a processed `<script>` in `SiteHeader.astro`: preserve open/close/focus/ARIA behavior using the existing `data-menu-*` hooks.
- `src/scripts/testimonial-carousel.ts` or a processed `<script>` in `TestimonialsSection.astro`: preserve timer, wrap, dot, arrow, hover/focus pause, reduced-motion, and ARIA mutation behavior using `data-carousel*` hooks.
- `src/scripts/product-videos.ts` or a processed `<script>` in `ProductPhoneVideo.astro`: preserve IntersectionObserver values, mute/play fallback, and pause behavior.

Use processed Astro scripts with no extra attributes so Astro can bundle and deduplicate them. Keep DOM query guards at each behavior boundary. Do not install a UI framework. Do not introduce view transitions; if that decision changes later, scripts must be re-audited for `astro:page-load` lifecycle behavior.

### SEO and metadata ownership

- `SiteLayout.astro` owns current title, language, charset, viewport, font connections, and future optional approved metadata.
- `index.astro` supplies page-specific metadata props.
- `astro.config.mjs` owns only build-relevant `site`, `base`, output, and trailing-slash decisions after deployment details are approved.
- Favicons, `robots.txt`, a manifest, and other stable root-addressed files would belong in `public/` if supplied.
- Structured data should be emitted by the layout/page only after schema type and factual values are approved. None exists today.

## 4. Asset migration plan

### `src/assets`

Move/copy imported, locally owned visual assets here so Astro can infer dimensions and later optimize them. During phase 2, render them without changing crop or format behavior; introduce `<Image />`/`<Picture />` transformations only in phase 6.

Recommended locations:

- `src/assets/brand/singfit-logo.png`: `asset-01.png`.
- `src/assets/hero/caregiver-photo.png`: `Fixed Laina Testimonial Image.png`.
- `src/assets/hero/studio-controls-device.png`: `asset-05.png`.
- `src/assets/audience/caregiver-singing.jpeg`: `E_YpTUiw.jpeg`.
- `src/assets/benefits/sandy-tubman-caregiver.jpeg`: current Sandy file.
- `src/assets/benefits/caregiver-laughing-tablet.png`: `asset-08.png`.
- `src/assets/benefits/alicia-caregiver.jpeg`: current Alicia file.

Descriptive renames improve maintenance, but a rename map must be reviewed and Git history retained. Initial parity can keep original filenames to reduce simultaneous change.

The currently unused photos/mockups (`asset-02.png`, `asset-03.png`, `asset-04.png`, `asset-06.png`, `asset-07.png`, `asset-09.png`, `hero-bold.png`, and the Chelsea image) should be kept in `src/assets/archive/` or left in the legacy asset directory through phase 8. Because imports control emission, archived unused files can remain in source control without shipping to `dist`. Do not delete them until a human confirms they are obsolete.

### `public`

Use `public` for files that need unchanged bytes or simple public URLs:

- `public/media/screen-capture1.mp4` and `public/media/screen-capture2.mp4`. Astro does not optimize video, and native `<video><source src="/media/...">` keeps predictable delivery. Preserve MIME type, autoplay/loop/muted/playsinline/preload/PiP behavior, and source content.
- If retained, `public/badges/app-store.svg` (`asset-10.svg`) and `public/badges/google-play.png` (`asset-11.png`) should remain unmodified official badge artwork. They are not rendered today.
- Future approved favicon, `robots.txt`, manifest, and other stable root files.

If the product videos are instead imported from `src` for hashed filenames, that is acceptable only after confirming the host sends correct MP4 MIME/range/cache headers and behavior is identical. There is no current public URL contract for them, but their browser behavior is parity-critical.

### External services

- Keep the long-form guided-session video on Vimeo with the exact current video ID/query and iframe permissions for initial parity.
- Keep Google Fonts external for parity. Self-hosting could improve privacy/control but must be a separate reviewed change because font files, metrics, loading behavior, and licensing are not in the repository.
- Keep Calendly as external links. Do not replace links with an embed.
- Do not move local photos to a new image CDN/DAM during the framework migration.

### Crop and focal-point requirements

| Asset/context | Current crop behavior to preserve | Risk / verification focus |
| --- | --- | --- |
| Hero photo | Fills an absolutely sized panel with `object-fit: cover`; `object-position` is 52% center by default, 50% at ≤1120px, 54% at ≤720px, and 55% at ≤560px. | Keep both faces visible and preserve the tablet/table relationship. Astro responsive styles must not override these positions. |
| Who photo (`E_YpTUiw.jpeg`) | Framed `object-fit: cover`, `object-position: 50% center`; container height becomes a responsive clamp and changes again at ≤720px. | Both singers and their interaction must remain visible; a generated aspect ratio must not replace the container crop. |
| Benefit images | Desktop frame is 4:3 with `object-fit: cover` and `object-position: center 18%`. At ≤720px frame becomes 3:2 and the more-specific rule uses `center top`. | The source ratios vary and faces are near the upper portion. Verify each asset independently at both crop modes. |
| Hero device PNG | Transparent full image scaled by width and overlaid outside the panel; no `object-fit` crop. | Preserve alpha, full device edge, drop shadow, right/bottom overflow, and pointer-events behavior. Avoid format conversion artifacts around transparency/text. |
| Portrait product videos | Phone screen is `aspect-ratio: 9 / 19.5`, `object-fit: cover`, `object-position: top center`. | Confirm source UI is not horizontally cropped and top navigation remains visible. Benefits preview disappears at ≤768px; who preview remains. |
| Logo | Height-constrained with auto width; product descriptor disappears in header/drawer at ≤720px but remains in footer. | Preserve transparency, intrinsic ratio, and current rendered heights (34px, 30px in footer, 30px globally at small screens). |

Astro's responsive image `fit`/`position` props or higher-specificity component CSS can preserve focal points, but this must be validated before enabling global responsive image defaults. Do not globally enable a layout/fit/position that silently changes all images.

## 5. Migration phases

The root static files should remain runnable and untouched as the reference through phases 1–7. Serve the legacy root and Astro on different ports for side-by-side testing. Remove legacy files only in phase 8 after approval.

### Phase 1 — Astro project initialization

Actions:

- After this plan is reviewed, choose the package manager and record Node compatibility.
- Initialize a minimal current Astro project manually in the existing root so the legacy static files are not overwritten.
- Add `package.json`, lockfile, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, and minimal scripts (`dev`, `build`, `preview`, `astro`, `check`).
- Add `@astrojs/check` and TypeScript support required by `astro check`.
- Configure static output only; add no UI framework, CSS framework, content collection, sitemap integration, adapter, or view-transition router unless separately justified.
- Keep the legacy `index.html`, `css/`, `js/`, and `assets/` in place.

Gate before phase 2:

- `astro check` and an empty/minimal production build pass.
- Astro dev and preview servers start.
- The root legacy site still runs independently.
- The generated project contains no starter/demo content or unrequested integration.
- Deployment domain/base/trailing-slash uncertainties are recorded, not guessed.

### Phase 2 — Whole-page visual parity

Actions:

- Create `SiteLayout.astro` and copy the current page into `src/pages/index.astro` as one page-level template with the DOM order and class/data/id hooks intact.
- Import a byte-for-byte or semantically unchanged copy of the legacy stylesheet as `src/styles/legacy.css`.
- Copy referenced images into `src/assets` but initially render them in a way that preserves current bytes/crops. Copy MP4 files to `public/media` and update only the necessary paths.
- Load current `main.js` behavior through Astro without refactoring it yet.
- Preserve every URL, attribute, alt, title, ARIA value, media setting, font request, and approved string.
- Capture baseline and Astro screenshots at the required desktop/tablet/mobile viewports.

Gate before phase 3:

- DOM order, all visible text, all links, and all media sources match.
- Pixel/overlay comparison has no unexplained difference at 1440, 1280, 1024, 768, 390, and 320 CSS-pixel widths.
- All breakpoint transitions and crops match around 1120, 920, 768/720, 560, and 420px—not only at representative widths.
- Mobile drawer, carousel, videos, Vimeo, reduced motion, and anchors behave like the source.
- No missing assets or browser console errors.

### Phase 3 — Section component extraction

Actions:

- Extract the approved layout, global components, seven section components, legal disclaimer, and only the justified UI components listed above.
- Add `site.ts` and `landing-page.ts`; migrate repeated content one group at a time with exact-string comparisons.
- Preserve rendered HTML semantics and parity-critical wrappers.
- Keep `legacy.css` unchanged during extraction except for path necessities.

Gate before phase 4:

- Build/check pass after each extracted section.
- Snapshot DOM and text comparisons show no drift.
- Screenshots at desktop and mobile match after each major extraction.
- All anchors, ARIA relationships, `nth-child` ordering, and data hooks remain valid.

### Phase 4 — JavaScript migration

Actions:

- Move the three IIFEs into component-owned processed Astro scripts/TypeScript modules.
- Improve null/type guards only where output and behavior remain identical.
- Keep all timings, thresholds, focus order, state attributes, labels, selectors, and reduced-motion behavior unchanged.
- Do not add a client framework or new interaction.
- Record potential accessibility changes from the earlier ambiguity list as follow-up proposals, not silent parity edits.

Gate before phase 5:

- Menu testing passes by pointer and keyboard, including focus restoration and focus wrap.
- Carousel arrow/dot/auto/pause/wrap/ARIA behavior matches at normal and reduced motion.
- Both product videos play/pause at equivalent viewport thresholds and the no-IntersectionObserver fallback is covered or manually verified.
- No duplicate listeners or scripts appear after dev HMR or repeated component use.
- JavaScript-disabled content remains readable; the Vimeo `<noscript>` link remains present in output.

### Phase 5 — CSS organization

Actions:

- Extract tokens and true foundations to `tokens.css`/`global.css`.
- Move component-specific rules to the owning components in small, reviewable groups.
- Preserve media-query source order and cascade behavior.
- Resolve cross-component rules deliberately rather than relying on Astro scope leakage.
- Audit dormant selectors, but do not delete them until their related dormant assets/features are reviewed.

Gate before phase 6:

- `legacy.css` can be removed from the Astro import graph with no changed computed styles at reference viewports/states.
- Visual screenshot diffs are zero or explicitly reviewed.
- Focus, hover, open drawer, every carousel slide, reduced motion, and loaded-font states are included in comparison.
- No selector was removed solely because its purpose was initially unclear.

### Phase 6 — Asset and image optimization

Actions:

- Convert eligible imported photos to Astro `<Image />`/`<Picture />` one at a time.
- Set explicit `layout`, sizes, quality/format, loading priority, `fit`, and focal position per image instead of assuming one global policy.
- Keep the hero image high priority if measurement supports it; lazy-load below-the-fold benefit/audience images as appropriate without changing layout.
- Verify transparency and text clarity before optimizing logo/device mockup PNGs.
- Keep videos unchanged initially; separately evaluate compression or hosted delivery for the 14.29 MB screen capture.
- Confirm all unused assets remain archived or receive explicit deletion approval.

Gate before phase 7:

- Generated image dimensions prevent layout shift.
- Each crop/focal point matches at all required breakpoints.
- No face, device edge, or product UI is clipped differently.
- Image quality is visually approved on 1× and 2× displays.
- `dist` contains no unintended unused image variants and every referenced asset returns 200.
- Video playback, range requests, first frame, looping, and mobile inline behavior remain correct.

### Phase 7 — SEO and accessibility verification

Actions:

- Reconfirm title, language, headings, landmarks, alt text, skip link, ARIA, focus order, and reduced-motion behavior.
- Add only approved description/canonical/social/favicon/robots/structured data values.
- Configure Astro `site`, base, and trailing slash only from confirmed deployment details.
- Run automated accessibility checks plus full manual keyboard/screen-reader-oriented review of menu, carousel, and video.
- Verify Google Fonts/Vimeo privacy and CSP implications with the responsible human owner.

Gate before phase 8:

- Required SEO metadata is approved and present, or its intentional absence is recorded.
- There are no critical/serious automated accessibility findings without an accepted exception.
- Keyboard and reduced-motion acceptance tests pass.
- All routes, links, CTAs, media, analytics/tracking expectations, and consent expectations are signed off.

### Phase 8 — Removal of obsolete legacy files

Actions:

- Remove root `index.html`, `css/`, `js/`, and duplicate original `assets/` only after the Astro output is approved and Git preserves the source baseline.
- Remove `.DS_Store` files and add an appropriate ignore rule.
- Remove the empty `pricing/` directory only after confirming it is not a deployment placeholder.
- Delete or retain archived unused assets according to an explicit asset-owner decision.
- Update `README.md` with Astro commands and the confirmed deployment process/publish directory.
- Add deployment/CI configuration only for the selected host.

Final gate:

- Clean checkout and install reproduce build/check/test results.
- `dist/` is the only publish artifact and works on the approved host/base path.
- The complete acceptance checklist below passes.
- The migration report lists every created/moved/changed/removed file, dependencies, commands, test results, known differences, and remaining manual checks.

## 6. Risk assessment

| Area | Risk | Mitigation |
| --- | --- | --- |
| Global CSS | One stylesheet controls global foundations and every section; splitting changes cascade/order. | Preserve unchanged in phase 2, extract incrementally, compare computed styles and screenshots before deleting legacy rules. |
| Astro scoping | Parent scoped styles do not automatically style markup rendered by child components; generated scope selectors can alter specificity. | Place true cross-component rules globally and component rules with their owner; verify source order and specificity. |
| DOM/selector coupling | `nth-child`, `last-child`, direct-child, descendant, and data hooks depend on exact structure/order. | Keep wrappers/order through parity; add DOM tests for benefit order, nav last CTA, carousel children/dots, and ARIA controls. |
| Breakpoint order | Both 768px and 720px rules exist, and mobile crop behavior relies on source order/specificity. | Preserve exact media-query order until component extraction is fully tested at boundary widths. |
| Responsive crops | Hero and benefit focal points shift by viewport; Astro responsive image defaults can override `object-position`. | Use per-image fit/position and visual checks at every crop transition. |
| Transparent/product images | Format conversion can create halos, blur product UI text, or alter alpha. | Keep PNG initially; compare 1×/2× renders before accepting WebP/AVIF. |
| Local videos | One file is 14.29 MB; hosting must support correct MIME, range requests, caching, autoplay policy, and inline playback. | Keep MP4/native markup for parity; test production headers and iOS/Android behavior before compression/CDN changes. |
| Vimeo | Video ID/query/permissions/referrer policy and third-party cookies may be affected by iframe changes, CSP, or consent decisions. | Preserve iframe exactly, test playback/fullscreen/PiP, and review privacy/CSP separately. |
| Google Fonts | External availability, privacy, CSP, and loading can affect typography and layout. | Keep exact URL/preconnect for parity; do not self-host without approved font files and visual metrics testing. |
| Mobile menu | Behavior depends on body class, ARIA state, focus order, CSS visibility, and data hooks. Component extraction can break any link. | Keep behavior with header owner; automate open/close/Escape/overlay/link/Tab/focus-restore tests. |
| Carousel | Auto-advance, focus pause, `aria-live`, hidden pause support, slide/dot counts, and inline transform are coupled. | Preserve exact behavior first; test every control/state and document any later accessibility improvements separately. |
| Reduced motion | CSS and carousel respond, but product videos do not. A “fix” would intentionally change current behavior. | Preserve and document during parity; obtain accessibility approval before changing video behavior. |
| Browser compatibility | `100dvh`, `text-wrap: balance/pretty`, `backdrop-filter`, `aspect-ratio`, `clamp()`, and IntersectionObserver vary by browser/version. | Test current supported browser matrix on real Safari/Chrome/Firefox and mobile devices; retain fallbacks. |
| Accessibility semantics | Drawer is modal-like without dialog/inert semantics; carousel lacks visible pause; video has no controls. | Do not silently redesign; log as human-review decisions and run keyboard/screen-reader/reduced-motion tests. |
| CTA drift | Same Calendly URL appears nine times and can be mistyped during extraction. | Centralize one constant and add an assertion that all nine CTAs render the exact destination and labels. |
| Checkout ambiguity | `#pricing` and price-card names imply commerce, but no checkout exists. | Do not create a paid route/link; request exact approved destination if commerce is intended. |
| Tracking/consent | None exists. A generic starter, host, or integration could accidentally add telemetry, or stakeholders may expect missing production code. | Assert no unapproved analytics scripts/cookies; get explicit confirmation whether “none” is correct production behavior. |
| SEO gaps | Current page lacks description, canonical, social metadata, favicon, structured data, robots, and sitemap. | Create ownership points but emit no guessed values; collect approvals before phase 7. |
| Deployment | Current upload/Netlify Drop has no build step; Astro publishes `dist`. Domain/base/trailing slash/headers are unknown. | Confirm host and URL policy; configure build/publish commands and test deploy preview before legacy removal. |
| Unused legacy files | Unreferenced images/badges/selectors may represent unfinished or future approved features. | Archive without shipping, inventory explicitly, and delete only with human approval. |
| Content fidelity | Moving copy into data can normalize smart punctuation or whitespace. | Compare normalized visible text and review exact source strings; avoid editorial tooling. |

## 7. Acceptance criteria

### Required commands

Use the selected package manager consistently. Assuming pnpm is approved, the minimum commands are:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm astro check
corepack pnpm astro build
corepack pnpm astro preview --host 127.0.0.1 --port 4321
```

Recommended package scripts should make the equivalent commands available as:

```bash
corepack pnpm run check
corepack pnpm run build
corepack pnpm run preview
corepack pnpm run test:e2e
```

If Playwright is approved for repeatable browser checks, `test:e2e` should run the interaction, route, link, content, and screenshot suite against `astro preview`. A link checker such as Linkinator or Lychee may be run against the local preview, but external service responses must be reviewed because bot protection and rate limits can produce false failures.

### Build and route acceptance

- `astro check` exits 0 with no diagnostics.
- Production build exits 0 with no warnings that hide missing assets or invalid imports.
- Preview serves `/` successfully.
- `/index.html` behavior is intentionally decided and documented by host policy.
- No unintended `/pricing/` page exists unless separately approved.
- Direct navigation to every fragment ID succeeds and IDs remain unique.
- There are no runtime console errors, unhandled promise rejections, mixed-content errors, or failed local requests.
- No React/Vue/Svelte/other client framework dependency or hydrated island is present.

### Broken-link and CTA acceptance

- Crawl all generated HTML and verify every local `href`, `src`, and `srcset` candidate resolves.
- Manually or safely automatically verify Vimeo, Calendly, privacy, terms, and accessibility destinations.
- Assert that exactly nine rendered conversion CTAs use `https://calendly.com/rachelfrancine/complimentary-singfit-session` and that all nine labels match the inventory.
- Assert desktop/mobile nav fragments and hero `#video` CTA target existing IDs.
- Confirm no checkout URL was introduced. If a checkout becomes a requirement, verify it against stakeholder-supplied source data rather than this plan.
- Confirm footer external links retain `target="_blank" rel="noopener noreferrer"` and CTAs retain their current same-tab behavior.

### Asset and media acceptance

- Every generated `<img>` has correct alt text and explicit/inferred dimensions.
- All local image/video requests return 200 with correct content types.
- No source asset used by the page is absent from `dist`.
- No unreferenced archive asset is emitted accidentally.
- Hero image/device composition, who image/video overlay, all three benefit crops, and logo sizing match the source at each required viewport.
- Both local MP4s autoplay where the baseline does, remain muted/inline/looping, pause out of view, resume near view, and render the same visible product UI.
- The Vimeo iframe loads lazily, plays, enters fullscreen, supports intended PiP, retains its title, and has a working no-script fallback in generated HTML.

### Responsive viewport acceptance

Capture and compare full-page and component-state screenshots for at least:

- 1440×900 desktop.
- 1280×800 desktop.
- 1120px boundary on both sides (desktop navigation/mobile toggle change).
- 1024×768 tablet landscape-ish.
- 920px boundary on both sides.
- 768×1024 and the 768/720 boundaries on both sides.
- 560px and 420px boundaries on both sides.
- 390×844 modern phone.
- 320×568 narrow phone.

At each applicable viewport verify order, wrapping, spacing, heading balance, buttons, drawer dimensions, footer grid, device overlays, Vimeo ratio, carousel height, and focal points. Run comparisons with web fonts loaded, not only fallback fonts.

### Interaction acceptance

- Desktop navigation anchors scroll to the right sections.
- Mobile toggle appears only at the existing breakpoint and announces correct expanded state.
- Drawer opens/closes from all current triggers, locks/unlocks scroll, synchronizes `aria-hidden`, and restores focus.
- Carousel wraps both directions, every dot selects its slide, auto-advance uses 6.5 seconds, and hover/focus/reduced-motion pause behavior matches.
- Slide labels and dot `aria-current` values update correctly.
- Product-video observer and no-IntersectionObserver fallback behave as documented.
- FAQ remains static and fully readable; no accidental accordion is introduced.
- Site remains readable and navigable with JavaScript disabled, acknowledging that drawer/carousel controls will not be enhanced.

### Keyboard and accessibility acceptance

- Tab first reveals and activates the skip link, landing on `#main-content`.
- All links/buttons have a visible focus indicator with adequate contrast and no clipping.
- Drawer can be opened, traversed forward/backward, closed with Escape, and returns focus to the opener.
- Carousel arrows and dots are reachable and operable with Enter/Space; focus pausing works.
- There is no focus in visually hidden drawer content when closed.
- Heading levels, landmarks, nav labels, region labels, image alts, iframe title, and list semantics match the source intent.
- At `prefers-reduced-motion: reduce`, smooth scrolling/transitions and auto-advance stop as currently defined; the known product-video exception is either preserved/documented or changed only with approval.
- Automated accessibility testing (for example axe) reports no unreviewed critical or serious issue; manual keyboard testing is still required.

### Content, SEO, tracking, and privacy acceptance

- A normalized visible-text comparison against the original finds no changed approved copy. Any normalization should ignore layout-only whitespace, not punctuation or wording.
- Page title remains exactly `SingFit STUDIO Caregiver Walkthrough` unless approved copy is supplied.
- `lang`, charset, viewport, Google Font families/weights, and all current metadata remain present.
- No description/canonical/OG/social/favicon/structured data/robots value is invented; approved additions are verified individually.
- Search generated HTML/source bundles for expected third-party hosts and confirm only approved Google Fonts, Vimeo, Calendly, and legal-link destinations appear.
- Confirm no analytics, pixels, tag manager, tracking listener, cookies, local storage, or consent UI was added unless an exact approved implementation is supplied.
- If analytics is later supplied, validate script presence, consent gating, page view, and all requested CTA event payloads in the provider's debug mode.

### Visual comparison acceptance

- Serve the original static root and production Astro preview simultaneously.
- Capture identical viewport, device scale, font-loaded, animation-stabilized screenshots.
- Compare full pages plus state screenshots: closed/open drawer, each carousel slide, focus states, reduced motion, video first/playing frames where deterministic.
- Use pixel overlays/diffs as a diagnostic; every non-zero region must be explained and approved, including font rasterization allowances.
- Manually inspect Safari, Chrome, and Firefox plus representative iOS Safari and Android Chrome because browser-specific features are used.

## Proposed directory tree

This is the intended final structure, not a request to create it before plan approval:

```text
.
├── AGENTS.md
├── MIGRATION_PLAN.md
├── README.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml                 # if pnpm is approved
├── tsconfig.json
├── public/
│   ├── media/
│   │   ├── screen-capture1.mp4
│   │   └── screen-capture2.mp4
│   ├── badges/                    # retained only if unused badges are approved to remain
│   │   ├── app-store.svg
│   │   └── google-play.png
│   ├── favicon.*                  # only when approved assets are supplied
│   └── robots.txt                 # only when approved directives are supplied
├── src/
│   ├── assets/
│   │   ├── audience/
│   │   │   └── caregiver-singing.jpeg
│   │   ├── benefits/
│   │   │   ├── alicia-caregiver.jpeg
│   │   │   ├── caregiver-laughing-tablet.png
│   │   │   └── sandy-tubman-caregiver.jpeg
│   │   ├── brand/
│   │   │   └── singfit-logo.png
│   │   ├── hero/
│   │   │   ├── caregiver-photo.png
│   │   │   └── studio-controls-device.png
│   │   └── archive/               # unreferenced originals pending human disposition
│   ├── components/
│   │   ├── LegalDisclaimer.astro
│   │   ├── SiteFooter.astro
│   │   ├── SiteHeader.astro
│   │   ├── sections/
│   │   │   ├── AudienceSection.astro
│   │   │   ├── BenefitsSection.astro
│   │   │   ├── FaqSection.astro
│   │   │   ├── FinalCtaSection.astro
│   │   │   ├── HeroSection.astro
│   │   │   ├── SessionVideoSection.astro
│   │   │   └── TestimonialsSection.astro
│   │   └── ui/
│   │       ├── CtaLink.astro
│   │       ├── LogoLockup.astro
│   │       ├── ProductPhoneVideo.astro
│   │       └── SectionCta.astro
│   ├── data/
│   │   ├── landing-page.ts
│   │   └── site.ts
│   ├── layouts/
│   │   └── SiteLayout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── scripts/
│   │   ├── mobile-menu.ts
│   │   ├── product-videos.ts
│   │   └── testimonial-carousel.ts
│   └── styles/
│       ├── global.css
│       ├── legacy.css             # temporary through parity/extraction
│       └── tokens.css
└── tests/
    └── e2e/                       # if Playwright is approved
        ├── accessibility.spec.ts
        ├── interactions.spec.ts
        ├── links-and-content.spec.ts
        └── visual.spec.ts
```

The original root `index.html`, `css/`, `js/`, and `assets/` remain alongside this structure through phases 1–7 as the runnable baseline, then are removed only in phase 8.

## Decisions requiring human review

1. Approve this migration plan before implementation begins.
2. Choose package manager/lockfile (pnpm is recommended but no current project choice exists) and supported Node version.
3. Confirm production host, canonical domain, base path, trailing-slash behavior, redirect policy, build command, and publish directory.
4. Confirm whether the empty `pricing/` directory has any intended future route meaning.
5. Confirm whether `#pricing` should remain that ID even though it presents only a free walkthrough.
6. Confirm that Calendly—not checkout—is the complete intended conversion flow and that the current Calendly URL is still authoritative.
7. Approve the disposition of every unused image/mockup and the two store badges: archive, reintroduce, or delete.
8. Decide whether descriptive asset renaming is desirable or original filenames should be retained.
9. Approve any image format/quality optimization after crop/visual samples are shown, especially transparent product art.
10. Decide whether the 14.29 MB local product video should remain local, be recompressed, or move to a media CDN/host after parity.
11. Confirm whether Google Fonts should remain external or be self-hosted; no local font files currently exist.
12. Review Vimeo/Google Fonts privacy and CSP implications and whether consent tooling is required.
13. Confirm that the absence of analytics/tracking and consent code is intentional for production, or supply exact approved integrations/events.
14. Supply/approve meta description, canonical URL, favicon, social image/metadata, robots directives, sitemap requirement, and any structured data. None can be inferred safely.
15. Decide whether accessibility behavior changes should follow parity: visible carousel pause, reduced-motion handling for product video, improved drawer dialog/inert semantics, and safer carousel focus handling.
16. Confirm supported browsers/devices and the acceptable visual-diff threshold.
17. Confirm whether Playwright/axe and a link-checker may be added as development dependencies/tooling.
18. Confirm the legal disclaimer, footer year/company/address, and all external legal URLs remain approved current content.

## Ambiguities that must not be guessed

- The production domain and canonical URL.
- Whether the site deploys at `/` or a subpath.
- Whether `/pricing/` is intended to become a route.
- Any checkout/purchase URL; none exists.
- Any subscription price or plan; none is shown.
- Analytics/tag-manager IDs, event names, conversion definitions, or consent categories.
- Cookie/consent requirements for Vimeo and Google Fonts.
- Whether Vimeo's video ID `1194167243` and `app_id=58479` are production-final.
- Whether the current Calendly account/path is production-final.
- Approved SEO description, social copy/image, favicon, robots policy, or structured-data facts.
- Which unused assets are obsolete versus reserved for future approved content.
- Whether current images have publication/model-release restrictions or a required DAM source.
- Whether the portrait videos contain audio tracks that must be stripped versus merely muted.
- Whether the carousel's missing visible pause control is intentional.
- Whether product videos should stop for reduced motion.
- Whether the current mobile drawer semantics should be improved during or after parity.
- Whether the year `2026`, company name, and street address should be static or data-driven.
- Whether external links/Calendly should open in the current tab or a new tab; preserve current behavior until directed.

## Recommended first implementation phase

After human review and approval of this plan, begin **Phase 1 only**: add a minimal, current, static-output Astro toolchain alongside the untouched legacy site, with no framework integration or starter content. Verify `astro check`, `astro build`, and independent legacy/Astro local serving, then stop for review before copying the full page into Astro for Phase 2 visual parity.
