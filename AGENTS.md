# SingFit Astro Project Instructions

## Project objective

Convert the existing SingFit static HTML, CSS, and JavaScript website into a maintainable Astro website.

The current site is the source of truth for:

- Visual design
- Approved copy
- Responsive behavior
- Images and image crops
- Links and checkout destinations
- Embedded media
- Analytics and tracking
- Accessibility behavior
- Interactive functionality

This is a framework migration and architectural refactor, not a redesign.

## Required working process

Before modifying implementation files:

1. Inspect the entire existing project.
2. Identify all pages, sections, assets, scripts, dependencies, links, integrations, and interactive behaviors.
3. Consult the Astro Docs MCP for current Astro-specific recommendations.
4. Produce a migration plan.
5. Do not begin implementation until the migration plan has been reviewed.

Work incrementally after the plan is approved. Keep the site runnable after each major phase.

## Astro architecture

Use current official Astro conventions confirmed through the Astro Docs MCP.

Prefer:

- `src/pages` for routes
- `src/layouts` for shared page shells
- `src/components` for meaningful reusable components
- `src/components/sections` for major landing-page sections
- `src/components/ui` for genuinely reusable UI patterns
- `src/assets` for locally imported and optimized assets
- `public` for files that require unchanged public URLs or should not be processed
- `src/styles` for design tokens, foundations, resets, and true global styles
- Typed data modules for repeated structured content

Astro components should be used for static structure whenever possible.

Do not introduce React, Vue, Svelte, or another frontend framework merely because the current site contains JavaScript. Prefer Astro components and browser-native JavaScript unless a framework component has a clear, documented benefit.

Do not convert every HTML element or wrapper into a component. Components should represent:

- A meaningful page section
- A reusable UI pattern
- A piece with its own behavior
- A piece with independent data or editing responsibility

## Visual and content safeguards

Do not:

- Redesign the website
- Rewrite approved copy
- Change fonts
- Change colors
- Change spacing
- Change breakpoints
- Change animation behavior
- Change image crops or focal points
- Replace current assets with placeholders
- Change CTA or checkout URLs
- Remove analytics or tracking code
- remove code merely because its purpose is initially unclear

Preserve the most current version of every asset and piece of content.

When existing behavior appears questionable, document it before changing it.

## CSS

Initially preserve the existing CSS closely enough to achieve visual parity.

After parity is established:

- Separate true global styles from component-specific styles
- Preserve existing CSS custom-property values
- Consolidate design tokens where appropriate
- Use Astro scoped styles where they improve ownership and maintainability
- Avoid unnecessary specificity
- Remove obsolete selectors only after verifying they are unused
- Do not introduce a CSS framework unless explicitly requested

## JavaScript and interactivity

Inventory every existing interactive feature before changing scripts.

Move behavior toward the component that owns it.

Prefer:

- Browser-native JavaScript
- Progressive enhancement
- Minimal client-side JavaScript
- Semantic HTML controls
- Keyboard-accessible interactions
- Reduced-motion support

Preserve existing:

- Navigation behavior
- Sliders or carousels
- Accordions
- Video controls and embeds
- Forms
- CTA behavior
- Analytics events
- Consent behavior
- Third-party scripts

## Assets and images

Determine whether each asset belongs in `src/assets` or `public`.

Use Astro image optimization when it safely preserves:

- Intended dimensions
- Responsive behavior
- Crop
- Focal point
- Visual quality
- Loading priority
- Public URL requirements

Avoid responsive cropping that cuts off faces or other important subjects.

## SEO and metadata

Preserve and centralize, where appropriate:

- Page titles
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Social sharing images
- Favicons
- Structured data
- Indexing directives
- Existing analytics and verification metadata

## Verification

A task is not complete merely because the build succeeds.

Before declaring the migration complete:

- Run the production build
- Run Astro checks
- Confirm all routes load
- Confirm no assets are missing
- Confirm all internal and external links
- Confirm every CTA and checkout destination
- Confirm embedded media
- Confirm interactive functionality
- Confirm keyboard behavior
- Confirm mobile and desktop responsive behavior
- Confirm approved copy is unchanged
- Confirm analytics and tracking remain present
- Confirm no unnecessary client-side framework was introduced
- Compare the Astro version against the original site

Report:

- Important architectural decisions
- Files created, moved, changed, or removed
- Dependencies added or removed
- Commands run
- Test results
- Known differences
- Remaining manual checks
