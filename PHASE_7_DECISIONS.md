# Phase 7A SEO, Accessibility, Privacy, and Deployment-Readiness Audit

## 1. Executive summary

The committed Phase 6 Astro site builds cleanly and preserves the approved one-page content, links, assets, responsive layout, and interactions. Phase 7A made no production implementation changes.

The audit found no critical accessibility issue and three serious issues: insufficient text contrast, an auto-advancing carousel without a visible pause control, and autoplaying product videos without user controls or reduced-motion handling. Six moderate, one minor, and five informational accessibility findings are recorded below.

The document title, language, charset, viewport, and heading hierarchy are present. Production SEO metadata, crawler files, social metadata/assets, structured data, verification tags, and deployment URL policy are not configured. These values must not be implemented until the project owner supplies or approves them.

The site has no analytics, tracking pixels, site-authored cookies, web-storage use, or consent tooling. It does make third-party requests to Google Fonts and, when loaded, Vimeo. Calendly is link-only. Stakeholder or legal review is required for third-party privacy, consent, and Content Security Policy decisions; this audit is not legal advice.

## 2. Current SEO status

| Item | Current status | Recommendation and information needed | Likely Astro location |
| --- | --- | --- | --- |
| Page title | Present: `SingFit STUDIO Caregiver Walkthrough` | Keep unless replacement copy is explicitly approved. | `src/data/site.ts`, passed through `src/pages/index.astro` to `src/layouts/SiteLayout.astro` |
| Language | Present: `<html lang="en">` | Keep unless a more specific approved locale is required. | `src/layouts/SiteLayout.astro` |
| Charset | Present: UTF-8 | Keep. | `src/layouts/SiteLayout.astro` |
| Viewport | Present: `width=device-width,initial-scale=1` | Keep. | `src/layouts/SiteLayout.astro` |
| Heading hierarchy | One `h1`, section `h2` headings, and subordinate `h3` headings; no skipped level found | Keep. | Section components |
| Semantic landmarks | A main landmark exists, but the site header and footer are nested inside it; the footer therefore does not expose the expected top-level content-info landmark | Move `SiteHeader` and `SiteFooter` outside `main` without a visual change. | `src/pages/index.astro` |
| Meta description | Missing; recommended | Supply approved page-description copy. Do not derive it from marketing copy without approval. | `src/data/site.ts`, `src/pages/index.astro`, `src/layouts/SiteLayout.astro` |
| Canonical URL | Missing; recommended | Supply the exact production HTTPS origin and canonical pathname. | `astro.config.mjs` (`site`) and `src/layouts/SiteLayout.astro` |
| Open Graph | Missing; recommended for sharing | Approve `og:title`, `og:description`, `og:type`, canonical URL, and image. | Shared metadata in `src/data/site.ts` and `src/layouts/SiteLayout.astro` |
| Twitter/X | Missing; recommended for sharing | Approve card type, title, description, image, and any site/creator handles. | Shared metadata in `src/data/site.ts` and `src/layouts/SiteLayout.astro` |
| Social-sharing image | No designated asset; recommended with social metadata | Supply or approve the final image, crop, dimensions, alt text, and stable public URL policy. | Approved asset under `public/` or `src/assets/`, referenced by the layout |
| Favicon / Apple touch icon | Missing; recommended | Supply approved icon artwork and required variants/sizes. | `public/`, linked by `src/layouts/SiteLayout.astro` |
| Robots meta directives | No explicit directive; browser/search-engine defaults apply | State the production indexing policy. Add an explicit directive only if the policy requires one. | `src/layouts/SiteLayout.astro` |
| `robots.txt` | Missing; recommended for an indexable production site | Supply the crawler policy and canonical sitemap URL after the production origin is known. | `public/robots.txt` or an Astro text endpoint |
| Sitemap | Missing; recommended for a public, indexable site | Confirm it is wanted and supply the production origin. The official Astro sitemap integration requires `site`. | `astro.config.mjs`, `package.json`, `package-lock.json` |
| Structured data | Missing; optional and potentially useful | Approve the schema type and every factual field. Do not invent organization, logo, contact, product, or medical-claim data. | Typed data plus JSON-LD in `src/layouts/SiteLayout.astro` or `src/pages/index.astro` |
| Search-engine verification | Missing; optional | Supply provider names and exact verification tokens if required. | `src/layouts/SiteLayout.astro` or host DNS/config, as directed by each provider |
| URL / base path | `base` is unset, and root-relative public media URLs assume deployment at `/` | Confirm root versus subpath deployment. If a subpath is chosen, audit and adapt every root-relative public URL. | `astro.config.mjs`, affected asset consumers |
| Trailing slash | No explicit project policy; Astro's default is `ignore`, while final behavior also depends on the static host | Approve the public URL form and host redirect behavior, including `/index.html`. | `astro.config.mjs` and host configuration |

Generated `dist/index.html` contains the current title, language, charset, viewport, headings, alt text, intrinsic image dimensions, and Vimeo title. It contains none of the missing metadata listed above. No favicon, `robots.txt`, sitemap, or web manifest is emitted.

## 3. Current accessibility status

Accessibility finding count: **0 critical, 3 serious, 6 moderate, 1 minor, and 5 informational**.

| ID | Severity | Current behavior | Recommended change | Alters approved parity behavior? | Approval required? |
| --- | --- | --- | --- | --- | --- |
| A11 | Serious | Automated testing found 10 contrast failures: white text on the orange primary CTA is about 2.73:1, and orange step numbers on the pale-orange background are about 2.46:1. Manual calculation also found normal muted text at about 4.06:1 on white. | Approve accessible foreground/background token combinations meeting the applicable WCAG contrast thresholds, then visually regress all affected uses. | Yes, colors would visibly change. | Yes |
| A12 | Serious | The testimonial carousel advances every 6.5 seconds and has no visible pause control. It pauses while focus is inside, but resumes after focus leaves. | Provide an operable, visible pause/play control and retain the user's paused state. | Yes, this adds a control and changes motion behavior. | Yes |
| A13 | Serious | Two muted product videos use `autoplay loop playsinline`, have no controls, and ignore `prefers-reduced-motion`. When the first video entered the desktop viewport it played continuously. | Under reduced motion, do not autoplay; provide an approved play/pause mechanism or another compliant way to stop the motion. Confirm the desired behavior for all users. | Yes, this changes approved autoplay behavior and UI. | Yes |
| A21 | Moderate | The mobile drawer traps focus, closes on Escape, restores opener focus, locks body scrolling, and synchronizes hidden/expanded state. It has no dialog semantics and does not make background content inert while open. | If approved, expose appropriate modal/dialog semantics and make non-drawer content inert/unavailable while open; retest assistive technology. | Assistive behavior changes; visual parity need not. | Yes, already identified as a parity decision |
| A22 | Moderate | All testimonial slides remain in the accessibility tree, including off-screen slides. The carousel uses `aria-live="polite"`, so automatic changes may be announced. | Expose only the active slide as appropriate, use stable carousel labeling, and prevent unwanted automatic announcements. | Assistive behavior changes. | Yes |
| A23 | Moderate | Focus entering the carousel stops autoplay; focus leaving always restarts it, even if a future user pause state or other stop condition should remain in force. | Model explicit pause reasons and resume only when autoplay was previously active and the user has not paused it. | Yes, motion behavior changes. | Yes |
| A24 | Moderate | Inactive carousel dots are approximately 9×9 CSS pixels with about 10 pixels between them; automated testing flagged three targets below the 24×24 target-size criterion. | Increase the clickable hit area to at least 24×24 without increasing the visible dot if visual parity is required. | No visible or content change is necessary. | No content decision; implementation should still be regression-tested |
| A25 | Moderate | `SiteHeader` and `SiteFooter` are inside `main`; this weakens landmark structure. | Place the header before `main` and the footer after it while keeping layout and order visually identical. | No. | No content decision; implementation should still be regression-tested |
| A26 | Moderate | Without JavaScript, primary page copy and FAQ answers remain readable, but the mobile drawer cannot open and only the first overflow-hidden testimonial is practically reachable. | Approve a progressive-enhancement fallback for mobile navigation and testimonials. | Yes, no-script behavior changes. | Yes |
| A31 | Minor | Focus styles are visible. Some translucent focus rings calculate below 3:1 against adjacent colors (about 2.83:1 on white and about 2.67:1 for the skip link ring against dark ink). | Approve a higher-contrast focus token and verify it on every background. | Yes, keyboard-only styling changes visibly. | Yes |
| A41 | Informational | The skip link becomes visible when focused and targets `#main-content`. Native activation could not be conclusively exercised through the available browser-control API. | Confirm Enter activation in a normal browser during Phase 7B. | No expected change. | No |
| A42 | Informational | Heading order, descriptive image alt text, link purposes, CTA link semantics, static FAQ readability, and Vimeo iframe title/permissions passed source and runtime inspection. | Preserve these behaviors. | No. | No |
| A43 | Informational | Drawer Tab/Shift+Tab wrapping, Escape close, focus restoration, scroll unlock, and hidden state passed manual browser smoke tests. Native Enter/Space button activation should still be included in normal-browser regression testing. | Preserve and regression-test. | No. | No |
| A44 | Informational | At 320×568 CSS pixels, no horizontal page overflow was found and primary controls fit the viewport. | Preserve; repeat across the approved browser/device matrix. | No. | No |
| A45 | Informational | The audit environment could inspect the reduced-motion code path but could not emulate the media feature in the in-app browser. It also did not provide a real screen-reader pass or reliable 200%/400% browser zoom emulation. | Complete reduced-motion, screen-reader, text-resize, and zoom tests in Phase 7B on the approved browser/device matrix. | No expected change from testing alone. | No |

No keyboard trap or browser console error was observed. Carousel arrow buttons are about 46×46 pixels, mobile menu controls about 46 pixels, and CTA controls about 54 pixels high; the dot controls are the touch-target exception.

## 4. Privacy and third-party status

| Service/item | Current use | Privacy, consent, and CSP consideration |
| --- | --- | --- |
| Google Fonts | The layout preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` and loads Source Sans 3 and Source Serif 4 from Google. | A page view makes third-party font requests and discloses normal request metadata such as IP address and user agent. Decide whether to keep external loading or approve self-hosting. CSP would need appropriate `style-src` and `font-src` rules. Stakeholder/legal review required. |
| Vimeo | One lazy iframe loads video `1194167243` with `badge=0`, `autopause=0`, `player_id=singfit-session-video`, and `app_id=58479`. It allows fullscreen, picture-in-picture, clipboard-write, and encrypted media and uses `strict-origin-when-cross-origin`. | Loading the iframe contacts Vimeo and may invoke Vimeo storage/tracking behavior. Decide whether this may load immediately/lazily or requires a consent-gated approach. CSP would need `frame-src` for Vimeo and potentially related media endpoints. Stakeholder/legal review required. |
| Calendly | Nine plain CTA links point to `https://calendly.com/rachelfrancine/complimentary-singfit-session`; there is no Calendly embed or script. | No Calendly request occurs until a visitor follows a link. Confirm the destination and whether outbound-link disclosure or measurement is desired. Any later analytics/consent decision must be explicit. |
| External legal links | Privacy, terms, and accessibility links point to `musicismedicine.singfit.com`, open in a new tab, and use `noopener noreferrer`. | Confirm the destinations and approved new-tab behavior. Review legal content and jurisdiction with qualified stakeholders. |

Repository and generated-output inspection found **no analytics library or tag manager, tracking pixel, first-party cookie write, `localStorage`, `sessionStorage`, consent banner/platform, or client-framework hydration**. The absence of those integrations needs explicit production confirmation; it is not permission to add them.

## 5. Deployment-readiness status

| Item | Current status | Required decision/information |
| --- | --- | --- |
| Production host | Unknown | Name the host/platform and account/project constraints. |
| Production domain | Unknown | Supply the exact HTTPS origin and whether `www` redirects to or from the apex. |
| Astro `site` | Unset | Set only after the production origin is approved. It is needed for reliable canonical and sitemap URLs. |
| Base path | Unset; current public URLs assume `/` | Confirm root deployment or exact subpath. |
| Canonical URL | Unknown | Supply the exact preferred home-page URL. |
| Trailing slash | Astro default `ignore`; host policy unknown | Choose `/path` versus `/path/` and normalization behavior. |
| Redirects | None configured | Approve HTTPS/host normalization, `/index.html` handling, trailing-slash rules, and any legacy URLs. Confirm whether empty `/pricing/` has meaning; it currently has no Astro route and returns 404 in preview. |
| Build command | `npm run build` works | Approve `npm ci` followed by `npm run build` for CI. |
| Publish directory | Astro emits `dist/` | Confirm `dist/` with the chosen host. |
| Node version | Normal project environment reports `v24.18.0` | Approve Node 24 as the production/CI major and define the host pinning mechanism. |
| Security headers | Not configured in the repository; local preview is not evidence of production headers | Approve host-specific HSTS, `X-Content-Type-Options`, referrer, permissions, framing, and related policy. |
| Content Security Policy | Not configured | Decide report-only versus enforcement and approve allowances for Google Fonts, Vimeo, same-origin media/assets, and any future approved integrations. Test before enforcement. |
| Cache headers | Not configured; local preview sends `Cache-Control: no-cache` | Approve immutable caching for hashed `/_astro/` assets, appropriate media caching/range support, and short/revalidation policy for HTML. |
| Deployment adapter | None; output is static | Confirm the host accepts static `dist/`. Add an adapter only if the selected platform requires one. |
| Preview workflow | Local `astro preview` works; no hosted preview workflow is configured | Define preview environment, access policy, branch/PR trigger, approval owner, and environment-specific indexing controls. |

Local preview returned 200 for `/` and `/index.html`, 404 for `/pricing/`, and 206 Partial Content with byte ranges for an MP4 request. Production routing, security headers, and caching remain host decisions.

## 6. Safe fixes that need no content decisions

These corrections do not require new copy, integrations, or deployment assumptions and can preserve visual parity:

1. Move the header and footer outside the main landmark (`A25`).
2. Increase carousel-dot hit areas to at least 24×24 pixels while preserving the visible dots (`A24`).

Both still require implementation review and visual/keyboard regression testing. They are recommendations for Phase 7B, not changes made in Phase 7A.

## 7. Changes requiring approval

1. Approve accessible replacement color/token combinations for CTA text, step numbers, muted text, and focus rings.
2. Approve a visible carousel pause/play control, persistent user pause state, off-screen-slide semantics, announcement behavior, and safer focus-exit behavior.
3. Approve reduced-motion and play/pause behavior for both autoplaying product videos.
4. Approve modal/dialog and background-inert semantics for the mobile drawer.
5. Approve a JavaScript-disabled fallback for mobile navigation and testimonials.
6. Approve all SEO copy, social card fields/assets, icons, crawler policy, sitemap, structured data, and verification tags before implementation.
7. Decide whether Google Fonts remains external or is self-hosted, and whether Vimeo requires consent gating. Obtain stakeholder/legal review.
8. Approve host-specific URL, redirect, security-header, CSP, caching, and preview policies.

## 8. Information the project owner must provide

Please provide or explicitly confirm:

1. Production host, exact HTTPS domain, root or subpath deployment, canonical home URL, trailing-slash form, and redirects (including `/index.html` and any intended `/pricing/` behavior).
2. Approved meta description, Open Graph/Twitter title and description, social image/crop/alt text, favicon/Apple icon artwork, indexing/robots policy, sitemap requirement, structured-data facts/type, and any verification tokens or social handles.
3. Whether Node 24, `npm ci && npm run build`, and `dist/` are the approved CI/deployment contract; also define the hosted preview workflow.
4. Approved accessibility choices listed in section 7, including acceptable replacement colors.
5. Whether external Google Fonts and the current Vimeo load behavior are acceptable, whether either requires consent, and the approved CSP/security/cache policy. Route privacy and consent questions to stakeholder/legal review.
6. Confirm that all nine CTAs should remain Calendly-only at `https://calendly.com/rachelfrancine/complimentary-singfit-session`, with no checkout flow.
7. Confirm Vimeo video `1194167243`, its current query parameters, fallback URL, title, and permissions.
8. Confirm the legal disclaimer; `Musical Health Technologies`; `1010 Wilshire Blvd. Los Angeles, CA 90017`; footer year `2026`; and the current privacy, terms, and accessibility URLs.
9. Confirm that production should have no analytics, pixels, cookies, storage, or consent tooling, or supply the exact approved integrations, events, and consent requirements.
10. Confirm whether the empty root `pricing/` directory has any future route meaning.
11. Decide the disposition of the eight inventoried unused legacy images/mockups (`asset-02.png`, `asset-03.png`, `asset-04.png`, `asset-06.png`, `asset-07.png`, `asset-09.png`, `hero-bold.png`, and `Chelsea & Gram Grams Brown - Arms Raised - SS - Original.png`) and the two store badges (`asset-10.svg`, `asset-11.png`): retain/archive, reintroduce, or delete.

No missing value should be guessed.

## 9. Recommended Phase 7B implementation scope

After the decisions above are supplied:

1. Implement approved shared metadata, canonical construction, icons/social assets, crawler policy, and sitemap without duplicating page data.
2. Apply the two safe semantic/target-size fixes and only the accessibility behavior/color changes explicitly approved by the owner.
3. Add only the approved static-host configuration for URL normalization, headers, CSP, caching, and previews; keep the static adapter-free output unless the selected host requires an adapter.
4. Add focused automated assertions for metadata, landmark order, drawer state/focus, carousel pause/state, video reduced-motion behavior, touch targets, links, and approved copy. Add a permanent accessibility dependency only if approved.
5. Re-run build/check, automated accessibility, keyboard, screen-reader, reduced-motion, text-resize/zoom, reflow, link, and deployment-preview checks.

Do not add analytics, consent tooling, structured data, redirects, or third-party integrations unless their exact implementation has been approved.

## 10. Items intentionally deferred

- All Phase 7 implementation, including metadata and accessibility corrections, is deferred to Phase 7B approval.
- Analytics, tracking, consent tooling, CSP, redirects, security/cache headers, and deployment configuration remain unchanged pending exact requirements.
- The current title, approved copy, CTA destinations, Vimeo configuration, legal content, footer content, external legal links, fonts, colors, motion, and interactions remain unchanged during this audit.
- The empty `pricing/` directory, unused legacy assets, store badges, dormant CSS selectors, and original root static-site files remain untouched pending human disposition and Phase 8 cleanup.
- A full screen-reader pass, reduced-motion emulation, 200%/400% zoom, broad browser/device testing, external-link validation, and visual comparison remain Phase 7B verification work.

## 11. Exact files likely to change during Phase 7B

Only approved work should select from this list:

| File/path | Likely reason |
| --- | --- |
| `src/layouts/SiteLayout.astro` | Shared metadata, canonical/social tags, icons, robots directive, approved JSON-LD |
| `src/pages/index.astro` | Page metadata inputs and top-level landmark order |
| `src/data/site.ts` | Typed approved metadata and stable site-level values |
| `astro.config.mjs` | Approved `site`, `base`, trailing-slash policy, sitemap integration, or required adapter |
| `src/styles/global.css` and affected component styles | Approved contrast/focus tokens and dot hit area |
| `src/components/SiteHeader.astro` | Approved drawer semantics/background isolation hooks |
| `src/scripts/mobile-menu.ts` | Approved inert/modal behavior and focus regression fixes |
| `src/components/sections/TestimonialsSection.astro` | Visible pause UI and active/off-screen slide semantics |
| `src/scripts/testimonial-carousel.ts` | Approved pause state, focus-exit, announcement, and reduced-motion logic |
| `src/components/ui/ProductPhoneVideo.astro` | Approved media controls/fallback semantics |
| `src/scripts/product-videos.ts` | Approved reduced-motion and autoplay policy |
| `public/robots.txt` or `src/pages/robots.txt.ts` | Approved crawler policy and sitemap reference |
| Approved files under `public/` or `src/assets/` | Favicon, Apple icon, and social-sharing image |
| `package.json` and `package-lock.json` | Only if sitemap/audit tooling or a host adapter is approved |
| Host-specific configuration file(s) | Only after the production host and policies are known |
| Test files under `tests/` | Approved metadata, accessibility, interaction, and deployment assertions |

`README.md` deployment instructions should be updated when the host is known, but the migration plan assigns final documentation and legacy cleanup to Phase 8; do not pull that cleanup into Phase 7B without approval.

## 12. Verification results

| Verification | Result |
| --- | --- |
| `node -v` | Passed: `v24.18.0` from the normal project environment |
| `npm ci` | Passed: 274 packages installed; no audit dependency was added to the repository |
| `npm run check` | Passed: 24 files, 0 errors, 0 warnings, 0 hints |
| `npm run build` | Passed: static build completed for 1 page and 23 images |
| Production preview | Passed locally at `127.0.0.1`; `/` and assets loaded, `/pricing/` returned the expected current 404, MP4 range request returned 206 |
| Automated accessibility | Temporary Lighthouse 13.4.1 accessibility audit completed with score 0.92; failed checks were color contrast (10 nodes) and target size (3 carousel dots). No permanent package or lockfile change was made. |
| Manual keyboard smoke tests | Drawer focus entry/wrapping, Escape close, focus restore, scroll lock/unlock, hidden state, carousel focus pause, and visible skip-link focus state were checked. Native Enter/Space activation remains a normal-browser follow-up. |
| Reduced motion / autoplay | Source inspection confirmed no reduced-motion handling for product videos. Runtime confirmed carousel auto-advance and visible product-video autoplay. In-browser reduced-motion emulation was unavailable, so emulated behavior remains a follow-up. |
| Generated HTML / metadata | Confirmed present title/language/charset/viewport/headings/alt text/Vimeo title and confirmed absent description/canonical/social/icon/robots/sitemap/structured-data/verification metadata. |
| Responsive reflow | No horizontal overflow at 320×568 CSS pixels; broader device and zoom testing remains. |
| Browser console | No warnings or errors observed during runtime checks. |

Phase 7A changed only this audit document. No production implementation file, integration, metadata, deployment configuration, dependency manifest, lockfile, asset, or legacy file was modified.
