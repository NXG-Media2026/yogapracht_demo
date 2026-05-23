# Universal vs Niche-Specific — Template Audit

This document classifies every meaningful piece of the template by **portability**:

- **UNIVERSAL** — works for any local-business niche unchanged
- **NICHE** — wired to "health clinic" (treatments / conditions / medical schema). Replaceable per niche.
- **DESIGN-LEVEL** — visual / copy / brand layer. Swap per client.

Read this before forking. It tells you what to keep, what to rewrite, and what to repaint.

---

## UNIVERSAL — keep as-is across niches

### Layouts

| File | Purpose |
|---|---|
| `src/layouts/BaseLayout.astro` | HTML shell, SEOHead, Header, Footer, sticky CTA, scroll-reveal IntersectionObserver, GA4 init, skip-to-content link. No niche assumptions. |
| `src/layouts/DashboardLayout.astro` | Visibility/sales dashboard chrome. Renders `client-report.json`. Niche-agnostic. |

### Components

| File | Purpose |
|---|---|
| `src/components/SEOHead.astro` | `<title>`, meta description, canonical, OG/Twitter cards, hreflang + x-default, GSC verification, font preload, JSON-LD slot. |
| `src/components/Header.astro` | Sticky header, dropdown nav, language switcher, mobile menu, 44px touch targets. |
| `src/components/Footer.astro` | Brand block, social icon row, NAP, opening hours, privacy link. Reads from `siteConfig`. |
| `src/components/TopBar.astro` | Phone + WhatsApp click-to-action above the fold. |
| `src/components/StickyMobileCTA.astro` | Bottom-fixed CTA on mobile. |
| `src/components/HeroSection.astro` | Image-bg hero with split CTA. Image is `ImageMetadata \| string`. |
| `src/components/CTABand.astro` | Bottom-of-page CTA section. Optional bg image. |
| `src/components/TrustBar.astro` | Stat row (years, patients, rating, reviews). Just numbers + labels. |
| `src/components/AtmosphereSection.astro` | Full-bleed image with overlay quote. |
| `src/components/DefinitionBlock.astro` | "What we do" 60/40 split (text + image). |
| `src/components/ApproachSection.astro` | 4-column "Our approach" with icon set. Icons are inline SVG paths in component. |
| `src/components/TestimonialSlider.astro` | Featured + grid testimonial cards. Reads `Testimonial[]`. |
| `src/components/TeamPreview.astro` | Avatar (CSS initials by default) + role + bio. Reads `siteConfig.team`. |
| `src/components/LocationPreview.astro` | Map embed + address + opening hours + service-area links. |
| `src/components/FAQAccordion.astro` | Native `<details>` + h3 question + prose answer. CSS-only. |
| `src/components/BreadcrumbNav.astro` | One-row breadcrumb with chevron separators. |
| `src/components/ReviewCTA.astro` | "Leave us a review" button → Google Business URL. |
| `src/components/AuthorByline.astro` | "Written by … · Last reviewed …" inline byline for articles. |
| `src/components/MedicalReviewerNote.astro` | "Medically reviewed by …" — *health-specific framing but the component itself just renders a name + date*. Rename to `ContentReviewerNote` for non-medical niches. |
| `src/components/LanguageSwitcher.astro` | EN ↔ NL toggle, route-aware. |
| `src/components/RelatedGuides.astro` | "Related articles" card grid for any blog/guide collection. |
| `src/components/GuideCard.astro` | Single article card. |
| `src/components/GuidesPreview.astro` | Homepage "Latest from the blog" 2-up. |

### Data utilities

| File | Purpose |
|---|---|
| `src/data/site.ts` | Single source of NAP, hours, socials, analytics, team, service areas. **Schema is universal** — content swaps per client. |
| `src/data/reviews.ts` | Review master list + helpers (`getReviews`, `aggregateRating`, `treatmentLabel`, `reviewText`). **Replace `treatmentSlug` enum per niche** — see Niche section. |
| `src/data/navigation.ts` | EN/NL nav arrays. Edit per niche to reflect page structure. |
| `src/data/client-report.json` | Visibility dashboard data. Universal shape. |

### Schema generators (`src/data/schema.ts`)

| Function | Universal? | Notes |
|---|---|---|
| `generateLocalBusiness()` | ✓ | Use everywhere. |
| `generateBreadcrumbs()` | ✓ | |
| `generateFAQPage()` | ✓ | |
| `generateAggregateRating()` | ✓ | Uses `@id` link to business — niche-agnostic. |
| `generateReviewArray()` | ✓ | |
| `generateArticle()` | ✓ | Type defaults to `BlogPosting`; can be `Article` or `MedicalScholarlyArticle`. |
| `generatePerson()` | ✓ | E-E-A-T author/team schema. |
| `generatePlace()` | ✓ | For service-area pages. |

### i18n core

| File | Purpose |
|---|---|
| `src/i18n/utils.ts` | `t()` translator, `getLocaleFromPath()`, `getTranslatedPath()`, `getCollectionBasePath()`. Locale-agnostic. |
| `src/i18n/ui.ts` | UI string dictionary. Add/remove keys per niche, but the file structure stays. |
| `src/i18n/routes.ts` | Route-segment + content-slug mappings. Swap entries per niche, keep shape. |

### Analytics

| File | Purpose |
|---|---|
| `src/lib/analytics.ts` | `trackEvent()`, `trackOnClick()`, GA4 init script generator. Silent no-op if `ga4MeasurementId` is empty. Event-name + page-type enums are extensible. |

### Style + tooling

| File | Purpose |
|---|---|
| `src/styles/global.css` | Self-hosted font @font-face, `js-reveal` animations, design tokens via CSS custom properties. |
| `tailwind.config.mjs` | Color tokens, font family, border radii. **Edit per client (design-level).** |
| `astro.config.mjs` | Astro + sitemap + image config. Universal. |
| `public/robots.txt`, `llms.txt`, sitemap | Universal — sitemap auto-generated from routes. |

---

## NICHE — replace per business type

These files are wired to "health clinic / treatments / conditions". For a different niche (e.g. law firm, restaurant, gym, accountant) you rewrite the *type* of content collection but reuse the layout patterns.

### Niche layouts (rename + adapt)

| File | What it does | Swap to … |
|---|---|---|
| `src/layouts/TreatmentLayout.astro` | Renders one service: title, definition, duration, price, related conditions, FAQ, MedicalReviewerNote, CTA. | `ServiceLayout.astro` for a generic services site. Drop `MedicalReviewerNote`, swap "Related conditions" for "Related services" or remove. |
| `src/layouts/ConditionLayout.astro` | Renders one problem/symptom: definition, symptoms, causes, when-to-seek-help, related treatments, FAQ. | Drop entirely for niches without a "problem ↔ solution" content pair. Or rename to `ProblemLayout` for accountants ("tax problems"), lawyers ("legal issues"). |
| `src/layouts/GuideLayout.astro` | Article layout. Picks `MedicalScholarlyArticle` schema for Treatment/Patient-Guide categories. | Keep, but pin schema to plain `BlogPosting`/`Article` for non-medical niches. |

### Niche components

| File | Why niche | Replacement |
|---|---|---|
| `src/components/RelatedConditions.astro` | "Conditions we treat" wording | `RelatedItems.astro` with a generic prop name. |
| `src/components/RelatedTreatments.astro` | "Treatment options" wording | Same — generalise the label via i18n key. |
| `src/components/MedicalReviewerNote.astro` | Medical YMYL framing | Rename to `ContentReviewerNote.astro`, drop "Medically" wording — useful for any expert-led content (financial advice, legal explainers). |
| `src/components/ServicesGrid.astro` | Generic enough to keep as-is. The "Featured + 3-up grid" pattern works for any service business. | Keep universal. |

### Niche schemas (`src/data/schema.ts`)

| Function | Niche tie-in | Replacement per niche |
|---|---|---|
| `generateMedicalBusiness()` | Schema.org `MedicalBusiness` type | Use `LocalBusiness` (already exported) for non-medical, or `LegalService`, `AccountingService`, `Restaurant`, `HealthClub`, etc. Same pattern, swap `@type`. |
| `generateService()` | Generic `Service` schema — universal. | Keep. |
| `generateMedicalCondition()` | Schema.org `MedicalCondition` — health-only | Drop entirely or replace with `Article` describing the problem domain. |
| `generateArticle({ type: 'MedicalScholarlyArticle' })` | Optional medical type | Always pass `type: 'BlogPosting'` for non-medical niches. |

### Niche content collections (`src/content.config.ts`)

| Collection | Niche fields | Replacement |
|---|---|---|
| `treatments` | `definition`, `duration`, `price`, `relatedConditions`, `faq` | Rename `services` for non-medical. Drop `relatedConditions` if no problem-pair exists. Keep `faq`. |
| `conditions` | `symptoms`, `causes`, `whenToSeekHelp`, `relatedTreatments`, `faq` | Drop or rename to `problems` / `topics` for niches that have a problem ↔ solution pairing (e.g. legal issues, tax problems). |
| `guides` | `category` enum: `Treatment / Prevention / Recovery / Patient Guide` | Replace category enum per niche (e.g. `Tax / Compliance / Strategy / Case Study`). |

### Niche pages

| File | Niche bit | Adapt |
|---|---|---|
| `src/pages/credentials.astro` (+ `/nl/kwaliteit.astro`) | "Hygiene & Infection Control", "Medical Equipment Calibration" | Rename to "Trust" or "Standards", swap clinic-specific certifications with niche-relevant ones (PI insurance for lawyers, ISO for B2B services). |
| `src/pages/treatments/...`, `src/pages/conditions/...` | Niche slugs | Rebuild URL structure to match new niche content. Update `routeSegments` in `i18n/routes.ts`. |

### Niche template strings

| Location | Niche language | Adapt |
|---|---|---|
| `src/i18n/ui.ts` | Keys like `treatment.duration`, `condition.symptoms`, `eeat.reviewedBy` | Add/rename keys for the new niche. Most general keys (`cta.book`, `nav.about`, `general.menu`) survive. |
| Treatment / condition / guide markdown frontmatter | Health vocabulary | Full content rewrite per niche. |

---

## DESIGN-LEVEL — swap per client (within the same niche)

These should change for every client even within identical niches. Touching them does NOT touch logic.

### Visual tokens

| File | What changes |
|---|---|
| `tailwind.config.mjs` | `accent`, `accent-dark`, `accent-light`, `bg`, `bg-alt`, `text`, `text-muted`, `border` color values. |
| `src/styles/global.css` | CSS custom properties (mirror Tailwind tokens), `@font-face` URLs if swapping fonts. |
| `public/fonts/` | Replace woff2 files; update `@font-face` `src` paths in `global.css`. Update `<link rel="preload">` paths in `SEOHead.astro`. |

### Imagery

| File | Replace |
|---|---|
| `src/assets/images/hero/*.webp` | Hero background |
| `src/assets/images/treatments/*.webp` | Service card images (rename folder per niche) |
| `src/assets/images/atmosphere/*.webp` | Lifestyle/place image |
| `src/assets/images/clinic/*.webp` | "What we do" image (rename folder per niche) |
| `src/assets/images/cta/*.webp` | Bottom CTA bg |
| `public/images/og/default.jpg` | OG default — regenerate at 1200×630 with new brand colors |
| `public/favicon.svg` | Brand mark |

### Copy + data

| File | What changes |
|---|---|
| `src/data/site.ts` | Every field per client (name, NAP, hours, team, socials, service areas, content review date). |
| `src/data/reviews.ts` | Replace placeholder reviews with verified ones. |
| `src/data/client-report.json` | Visibility metrics per client. |
| `src/data/faq-{en,nl}.json` | Site-wide FAQ content. |
| `src/data/navigation.ts` | Menu items if structure differs. |
| All markdown in `src/content/` | Per-client content. |
| `CLAUDE.md` | Project name + first paragraph (rest of file is template guidance). |

---

## TL;DR for forking decisions

- **Same niche, new client (clinic → another clinic):** swap `site.ts`, `content/`, `assets/images/`, `tailwind.config.mjs`, `public/fonts/`, `client-report.json`. Logic untouched.
- **New niche (clinic → law firm):** above + rename `treatments` → `services`, drop or rename `conditions`, swap `MedicalBusiness` → `LegalService` schema, rename `MedicalReviewerNote` → `ContentReviewerNote`, rewrite niche-specific i18n keys, redo URL segments in `routes.ts`. Layouts and components stay.
- **Universal core never gets touched** in either case: `BaseLayout`, `SEOHead`, `Header`, `Footer`, `analytics.ts`, `i18n/utils.ts`, schema architecture, content collection mechanism.
