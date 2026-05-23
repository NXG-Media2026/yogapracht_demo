# Fork & Adapt Playbook

How to spin up a new client site (or a new niche) from this template, fast.

Companion: see `UNIVERSAL_VS_NICHE.md` for what's portable, niche-specific, or design-only.

---

## 1. Fork the repository

```bash
# Clone the template
gh repo create <client-slug> --template <org>/costa-blanca-movement --private --clone
cd <client-slug>

# Or: classic GitHub fork via the UI, then:
git clone git@github.com:<org>/<client-slug>.git
cd <client-slug>

# Install + sanity build
npm install
npm run build   # must pass before you change anything
```

Add a deploy target on first commit:
- Cloudflare Pages → Connect to Git → branch `main` → build `npm run build` → output `dist` → env `NODE_VERSION=20`.
- Custom domain: add in Pages dashboard, point DNS at Cloudflare nameservers (apex domain recommended over `www`).

Update `siteConfig.url` in `src/data/site.ts` to the production URL **before** the first deploy — every canonical, hreflang, OG tag, and sitemap entry derives from it.

---

## 2. Always swap (same niche, new client)

These files change for every client. Logic stays.

```
src/data/site.ts                      # name, shortName, url, NAP, hours, socials, analytics IDs, team, service areas
src/data/reviews.ts                   # replace placeholder reviews; mark `featured: true` for homepage subset
src/data/client-report.json           # dashboard data
src/data/faq-{en,nl}.json             # site-wide FAQ content
src/data/navigation.ts                # menu structure if it differs

src/content/treatments/{en,nl}/*.md   # service pages
src/content/conditions/{en,nl}/*.md   # condition pages (drop folder if niche has none)
src/content/guides/{en,nl}/*.md       # blog/article pages

src/assets/images/                    # all hero, service, atmosphere, clinic, cta images
public/images/og/default.jpg          # 1200×630 OG fallback — regenerate with brand colors
public/favicon.svg                    # brand mark
public/fonts/*.woff2                  # if changing fonts (else keep)

tailwind.config.mjs                   # colors (accent, bg, text)
src/styles/global.css                 # CSS custom properties + @font-face if fonts changed

CLAUDE.md                             # update first paragraph (project name + niche)
```

**Rule of thumb:** if a content/data/asset file maps 1:1 to a real-world client fact, it's swappable. If it implements behaviour, it isn't.

---

## 3. Adapt per niche (clinic → other niche)

Beyond the per-client list, when changing the *type* of business you also touch:

```
src/content.config.ts                  # rename collections (treatments → services); add/drop fields
src/i18n/routes.ts                     # rewrite routeSegments for new URL structure
src/i18n/ui.ts                         # add/rename keys (treatment.* → service.*)

src/pages/treatments/...               # rename + rewrite for new niche
src/pages/conditions/...               # drop or rename (e.g. → /problems/)
src/pages/credentials.astro            # swap clinic certifications for niche-relevant ones

src/layouts/TreatmentLayout.astro      # rename → ServiceLayout, drop MedicalReviewerNote if not YMYL
src/layouts/ConditionLayout.astro      # drop entirely if no "problem ↔ solution" model

src/components/MedicalReviewerNote.astro       # rename → ContentReviewerNote, drop "Medically"
src/components/RelatedConditions.astro         # rename → RelatedItems
src/components/RelatedTreatments.astro         # rename → RelatedServices

src/data/schema.ts                     # swap generateMedicalBusiness → LegalService / AccountingService / Restaurant / etc.
                                        # drop generateMedicalCondition if irrelevant
                                        # always pass type: 'BlogPosting' for non-YMYL articles
```

For a non-medical niche, also remove the `MedicalReviewerNote` insertion from `TreatmentLayout` / `ConditionLayout` (or update the component to a neutral "Last reviewed" framing).

---

## 4. Never touch (universal core)

Editing these creates regressions. They work the same for every niche and every client.

```
src/layouts/BaseLayout.astro           # HTML shell, JS init, scroll-reveal, GA4 wiring
src/layouts/DashboardLayout.astro      # /visibility chrome

src/components/SEOHead.astro           # canonical, hreflang+x-default, OG/Twitter, font preload, JSON-LD slot
src/components/Header.astro            # nav structure (edit nav DATA in navigation.ts, not the component)
src/components/Footer.astro            # structure (edit DATA in site.ts)
src/components/BreadcrumbNav.astro
src/components/FAQAccordion.astro      # h3 in summary + prose answer is the citability pattern — preserve
src/components/AuthorByline.astro
src/components/TestimonialSlider.astro
src/components/CTABand.astro / HeroSection.astro / TrustBar.astro / ServicesGrid.astro / TeamPreview.astro / LocationPreview.astro / GuidesPreview.astro / GuideCard.astro / RelatedGuides.astro / AtmosphereSection.astro / DefinitionBlock.astro / ApproachSection.astro / TopBar.astro / StickyMobileCTA.astro / ReviewCTA.astro / LanguageSwitcher.astro

src/i18n/utils.ts                      # locale detection, t(), getTranslatedPath
src/lib/analytics.ts                   # event tracking + GA4 init

src/data/schema.ts (architecture)      # baseAddress/baseGeo/baseOpeningHours/baseSameAs helpers and the @id linking pattern
                                        # specific schema functions are niche-adaptable; the helpers are not

astro.config.mjs                       # Astro + sitemap config
```

If something in this list seems wrong for a niche, you're probably solving the wrong problem — push the customisation into data/content/i18n instead.

---

## 5. Per-client checklist (pre-launch)

This checklist is duplicated in `CLAUDE.md` for in-context reference. Run through it before going live.

### Identity & domain
- [ ] `site.ts`: `name`, `shortName` (≤22 chars), `tagline`, `url` (production, no trailing slash)
- [ ] DNS pointed at Cloudflare; SSL active
- [ ] Custom domain set in Cloudflare Pages
- [ ] `public/favicon.svg` replaced

### NAP (single source of truth)
- [ ] `phone` (E.164) + `phoneDisplay`
- [ ] `email`, `whatsappNumber`, `whatsappUrl`
- [ ] `address` (street, city, province, postalCode, country, countryCode)
- [ ] `geo.latitude` / `geo.longitude` (use Google Maps "What's here?")
- [ ] `googleMapsUrl` and optional `googleMapsEmbed`
- [ ] `openingHours` AND `openingHoursSpecification` — both must match

### Social + analytics
- [ ] `socials.{google,instagram,facebook,linkedin,youtube}` (empty string = hide)
- [ ] `analytics.ga4MeasurementId` (`G-XXXXXXXXXX`)
- [ ] `analytics.gscVerificationId` (HTML tag method from Search Console)
- [ ] Submit sitemap in Search Console: `https://<domain>/sitemap-index.xml`

### Content
- [ ] All treatment / service markdown rewritten with real content
- [ ] All condition / problem markdown rewritten (or folder removed)
- [ ] At least 3 guide articles published
- [ ] Team members in `site.ts` with credentials, education, languages, memberships
- [ ] Real reviews in `reviews.ts` (verified — never invent reviews; this is FTC-actionable)
- [ ] FAQ JSON polished — first 1-2 sentences answer standalone, definition markers added
- [ ] Service area pages reflect actual coverage
- [ ] `medicalContentReview.lastReviewedDate` updated to today

### SEO
- [ ] All `<title>` tags ≤60 chars (auto via `siteConfig.shortName`)
- [ ] All meta descriptions ≤150 chars
- [ ] Self-referential hreflang + x-default (auto via SEOHead — verify for any new pages)
- [ ] OG default image regenerated with brand colors at 1200×630
- [ ] Canonical URL on every page (auto via BaseLayout default)
- [ ] Schema validates: paste any built page's JSON-LD into `search.google.com/test/rich-results`

### Visual
- [ ] `tailwind.config.mjs` accent color matches brand
- [ ] `src/styles/global.css` CSS custom properties mirror Tailwind values
- [ ] All `src/assets/images/` replaced; `<Image>` densities still build
- [ ] If fonts changed: woff2 files in `public/fonts/`, `@font-face` paths updated, preload `<link>` paths in SEOHead updated
- [ ] Hero, atmosphere, clinic, CTA images all client-relevant

### Accessibility
- [ ] All interactive targets ≥44×44px (`Header.astro` already enforced)
- [ ] All accent text on white uses `text-accent-dark` (5.05:1) — not `text-accent` (4.08:1, fails AA for normal text)
- [ ] Inline body links carry an underline OR are inside a clickable card with hover affordance
- [ ] All images have meaningful `alt` text — decorative images use `aria-hidden="true"` or empty `alt=""`
- [ ] Run Lighthouse mobile — target 95+ on all four categories

### Build & deploy
- [ ] `npm run build` passes with 0 errors, 0 warnings
- [ ] Production preview spot-check: `/`, `/<service>/`, `/about`, `/contact`, `/reviews`, `/faq`, `/guides`, `/credentials` and the `/nl/` mirror of each
- [ ] Sitemap entries match expected route count
- [ ] No `console.error` in browser devtools on any page

---

## 6. Common pitfalls (from this build, paid-for in real time)

### Astro content collections

- **`slug` is reserved.** Use `pageSlug` in frontmatter. Reusing the field name breaks `getCollection()`.
- **EN and NL collections share an `id` namespace.** If `dry-needling.md` exists in both `en/` and `nl/` folders, Astro errors on duplicate IDs. Rename the NL file (e.g. `dry-needling-therapie.md`) and keep `pageSlug` matching the URL.
- **Adding a new collection requires a content store reset.** Astro caches collections in `node_modules/.astro/`. After adding `guides`, the dev server may show 0 entries until you `rm -rf node_modules/.astro` or restart.

### Astro Image

- `<Image>` only optimises images imported from `src/`, not `public/`. Move images to `src/assets/`, import them at the page top, pass them as `ImageMetadata` to components.
- `densities` and `widths` are mutually exclusive. Use `widths` + `sizes="100vw"` for responsive (hero, full-bleed); use `width` + `densities={[1, 2]}` for fixed-size cards.
- `densities={[1, 1.5, 2]}` on a source the same size as `width` produces redundant variants — Astro upscales or reuses the source. Either source the image bigger than `width × maxDensity` or use `widths`.
- Keep `og/default.jpg` in `public/` — the SEOHead fallback URL is absolute and needs a stable path.

### Fonts

- Bundling fonts via `@fontsource-*` packages prevents reliable preload — Vite hashes the filenames. Self-host woff2 files in `public/fonts/`, write your own `@font-face` rules in `global.css`, drop the package imports.
- Preload only the *primary* weight per family used above the fold. Preloading every weight defeats the optimisation.

### SEO

- Title length budget: site name eats ~22 chars. `siteConfig.shortName` keeps room for actual page topic.
- Self-referential hreflang is required (each translated page must list itself in its own hreflang). Auto-emitted from SEOHead based on `defaultLocale` — verify when you add new bilingual pages.
- AggregateRating must reference the business via `@id`. Standalone aggregate ratings without `itemReviewed` are ignored by Google.

### NL parity

- Adding a new section to the EN homepage and forgetting the NL homepage is the #1 recurring regression. The "Languages parity check" section in `CLAUDE.md` exists because this happened multiple times.
- The line-count diff command in `CLAUDE.md` catches most missed sections in seconds.

### Reviews

- Never invent reviews. The Review schema author + body must reflect actual patient feedback. FTC enforcement and Google policy are both strict.
- Featured reviews on homepage and full review list must align — keep one `Review[]` master list (in `src/data/reviews.ts`) and filter via `getReviews({ featuredOnly: true })`. Drift between two sources confused us once and will confuse the next maintainer.

### Build cache

- Cloudflare Pages caches `node_modules/` between builds. If `package.json` changed but the lockfile hasn't, install may use stale modules. Purge build cache from the Pages dashboard if the deployed site doesn't match local `npm run build`.

### Worktree gotcha

- Working in `.claude/worktrees/<name>/` while editing files in the main project directory leads to git status inconsistencies. Always run `git status` from the directory where the actual changes live before committing.

### Route translation (localizePath vs getCollectionBasePath)

- `localizePath('/privacy', 'es')` returns `/es/privacy` — it does NOT translate the segment.
- For translated URL slugs (privacy → privacidad, voorwaarden → terms), use `getCollectionBasePath()` or `getRouteSegment()`.
- When adding new translated routes: (1) add to `routeSegments` in `routes.ts`, (2) expand the type union in `getCollectionBasePath()` in `utils.ts`, (3) use `getCollectionBasePath()` in Footer legal links.
- Always click-test footer legal links in EVERY language after building.

### Cookie consent / GDPR

- GA4 and Meta Pixel must NEVER load in `BaseLayout <head>`. They must be dynamically loaded by `CookieConsent.astro` AFTER the user clicks "Accept all".
- Only `getTrackingScript()` (the `window.trackEvent` wrapper) belongs in `<head>`.
- Calendly and other third-party embeds must be click-to-load (placeholder button → dynamic script load on click).

### npm audit

- NEVER run `npm audit fix --force`. It upgrades Astro across major versions and breaks the build.
- npm audit warnings are normal and should be ignored.
- If someone already ran it: `git checkout -- package.json package-lock.json && rm -rf node_modules && npm install`.

### Legal pages pattern

- Privacy and Terms need a full binding version in the primary language.
- Secondary language versions are summaries that link to the binding version.
- Footer legal links must use `getCollectionBasePath()`, not `localizePath()`.

### Separate repo for each client

- Each client site must be its own GitHub repo, not a branch of the template.
- Fork or copy the template, then push to a new repo.
- Commit ALL client-specific changes before pushing — uncommitted changes don't transfer.

---

## What "done" looks like

A forked client site is ready when:

1. `npm run build` outputs ≥40 pages with 0 errors / 0 warnings.
2. Lighthouse mobile shows 95+ on Performance, Accessibility, Best Practices, SEO.
3. `search.google.com/test/rich-results` validates the homepage with no errors (warnings about missing optional fields like `award` are fine).
4. The pre-launch checklist above is fully ticked.
5. The deploy URL renders correctly on a real phone — not just emulator — including font swap, image lazy load, and sticky CTA.

If all five are green, ship.
