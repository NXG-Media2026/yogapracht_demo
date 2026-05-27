# CLAUDE CODE BRIEFING — NXG Client Template

## Context

Ik ben Joost, founder van NXG Media. Ik bouw Astro + Tailwind websites voor klanten (coaches, health clinics, yogadocenten, experts). Ik heb een herbruikbare klant-template gebouwd en de eerste klant-site (Yogapracht) succesvol opgeleverd.

**Repos:**
- `NXG-Media2026/yogapracht_demo` — eerste klant-site (referentie-implementatie)
- Template wordt geëxtraheerd uit yogapracht_demo voor toekomstige klanten

## Wat is er al af

- **Fase 1 (Keystatic CMS):** AFGEROND — CMS werkt met blog, FAQ's, testimonials, settings
- **Fase 2 (Template extractie):** AFGEROND — CHANGE_ME placeholders, generieke kleuren, voorbeeld content
- **Fase 3 (Eerste klant Yogapracht):** AFGEROND — volledig werkende site met alle content, afbeeldingen en schemas

## Huidige taak

Per nieuwe klant: clone de template, vul klantgegevens in, pas branding aan, schrijf content, deploy.

## Technische stack

| Component | Keuze | Let op |
|---|---|---|
| Framework | Astro 6.x | `output: 'static'` (ondersteunt per-page SSR met adapter) |
| Adapter dev | `@astrojs/node@9` | Voor lokale Keystatic admin UI |
| Adapter prod | `@astrojs/cloudflare@13` | Vereist voor Keystatic Cloud `/keystatic` SSR routes |
| CSS | Tailwind 3.4 + `@tailwindcss/typography` | Semantische kleurnamen (primary, accent, bg, etc.) |
| CMS | Keystatic + Keystatic Cloud | `storage: { kind: 'local' }` dev, `{ kind: 'cloud' }` prod |
| Blog content | `@astrojs/mdx@5` | **NIET markdoc** — incompatibel met Astro |
| Content | Astro Content Collections | ALLE collections gebruiken `glob` loader uit `astro/loaders` (geen `type: 'data'`) |
| Fonts | Self-hosted via fontsource | woff2 in `public/fonts/` |
| Afbeeldingen | Astro `<Image>` component | Auto WebP, responsive sizes |
| Analytics | GA4 + Meta Pixel | Alleen laden na cookie consent |
| Email | MailerLite | Consent-gated |

## Standaard template features (VERPLICHT bij elke klant)

Deze features moeten ALTIJD mee — ze zijn essentieel voor vindbaarheid:

1. **Blog** — /blog index + /blog/[slug] detail, BlogPosting schema, Keystatic MDX editor. Minimaal 3-5 posts voor topical authority
2. **Reviews** — /reviews pagina + TestimonialCard + homepage sectie, AggregateRating + ReviewSnippets schema. Testimonials koppelen aan juiste dienstenpagina
3. **Local SEO schemas** — LocalBusiness (juiste subtype), AggregateRating, ReviewSnippets, FAQPage, BreadcrumbList, WebSite, ProfilePage, Service
4. **Pagina's** — Home, Over, Diensten (index + detailpagina's), Reviews, Blog, Contact, Privacy (AVG), Voorwaarden
5. **Diensten** — /diensten overzicht + /diensten/[slug] per dienst, Service schema, links vanuit homepage
6. **Visuele breadcrumbs** — Op ALLE subpagina's (inclusief privacy/voorwaarden) via BaseLayout `breadcrumbs` prop
7. **Regiopagina's** — 2-3 service area pages voor nabijgelegen steden (unieke content, rijtijd, Service schema met areaServed, FAQ + E-E-A-T blok, quotable openingsalinea 60-80 woorden)
8. **Prominente masterclass/workshop** — Full-width banner op homepage met CTA + afbeelding (indien van toepassing)
9. **Navigatie compleet** — Alle subpagina's (nichepagina, masterclass, aanbod) bereikbaar vanuit header EN footer
10. **Image SEO** — Alle images via `<Image>` (auto WebP), alt-teksten met bedrijfsnaam + plaatsnaam + dienst
11. **OG image** — Default social sharing image op alle pagina's
12. **Keurmerk-logo's** — Branchevereniging/certificering logo's in footer
13. **FAQ + FAQPage schema** — Op ALLE diensten-, product-, masterclass- en regiopagina's. 3-4 inline FAQ items per pagina met FAQAccordion component + generateFAQPage schema
14. **E-E-A-T blokken** — Op ALLE diensten-, product-, masterclass- en regiopagina's. Opleiding, opleidingsinstituut (authority link), beroepsvereniging-lidmaatschappen, relevante specialisatie per pagina
15. **Interne linking vanuit blog** — Blogposts bevatten links naar relevante diensten, producten en andere blogposts

### Copywriting regels voor diensten en content

- **Homepage** moet altijd bevatten: hero met CTA, intro-sectie, uitleg-sectie (wat is de methode), diensten-kaarten (clickable), **prominente masterclass/workshop banner** (indien van toepassing), voor-wie sectie, voordelen-lijst, founder-sectie, reviews, CTA-band, online aanbod, FAQ
- **Dienstenpagina's** bevatten: hero/kop, uitgebreide beschrijving, voor-wie lijst, praktische info, relevante testimonial, E-E-A-T blok (opleiding + lidmaatschappen + authority links), FAQ sectie (3-4 items + FAQPage schema), CTA
- **H2 koppen** beginnen altijd met een topic noun (niet "Waarom..." of "Hoe...")
- **Alt-teksten** bevatten bedrijfsnaam + plaatsnaam + dienst/context
- **FAQ antwoorden** eerste zin moet standalone werken, NOOIT beginnen met "Ja"/"Nee"

### SEO/GEO regels (VERPLICHT — van begin af aan volgen, niet achteraf)

#### Meta & titels
- **Alle meta descriptions** ONDER 160 karakters, bevatten altijd plaatsnaam
- **Alle page titles** bevatten bedrijfsnaam óf plaatsnaam
- **H1 homepage** bevat bedrijfsnaam + plaatsnaam
- **Alle H2's** beginnen met een topic noun (niet "Waarom..." of "Hoe...")

#### Schema.org — LocalBusiness
Moet ALLE velden bevatten (niet optioneel):
- `@type` (juiste subtype), `name`, `description`, `url`, `telephone`, `email`
- `address` (streetAddress, addressLocality, postalCode, addressCountry)
- `geo` (latitude + longitude van Google Maps)
- `image` (profielfoto absolute URL), `logo` (OG image absolute URL)
- `priceRange` (bijv. "€"), `hasMap` (Google Maps URL)
- `areaServed` (@type City + name), `openingHoursSpecification` (dag, opens, closes)
- `dateModified` (automatisch via build-datum), `sameAs` (social media URLs)
- `founder` verwijst naar Person `@id`

#### Schema.org — overige (alle verplicht)
- **Person** op homepage: `hasCredential`, `alumniOf`, `sameAs` (persoonlijk), `knowsAbout`
- **WebSite** met `dateModified`
- **Service** per dienst: `serviceType` + `areaServed` (City) — URLs relatief (schema prepend automatisch)
- **BreadcrumbList**: "Home" altijd als eerste item (automatisch), altijd absolute URLs (automatisch)
- **AggregateRating** + individuele **ReviewSnippets** op homepage
- **Product** schema op betaalde producten (met `offers/price/priceCurrency`)
- **EducationEvent** schema op masterclass/workshop pagina's
- **FAQPage** op homepage en nichepagina's
- **BlogPosting** op blogposts, **ProfilePage** op over-pagina

#### Breadcrumbs
- URLs zijn ABSOLUUT (ingebouwd in `generateBreadcrumbs`)
- "Home" wordt automatisch prepend (ingebouwd)
- Breadcrumb parents moeten kloppen (geen orphan-chains)

#### Sitemap & indexering
- `lastmod: new Date()` in sitemap config
- Privacy + voorwaarden UITGESLOTEN van sitemap (zijn noindex)
- `/keystatic` uitgesloten
- `robots.txt`: Allow voor GPTBot, ClaudeBot, PerplexityBot

#### Footer (verplicht)
- "Diensten" link in footer navigatie
- Telefoonnummer met `tel:` link
- E-mailadres met `mailto:` link  
- Fysiek adres (straat, postcode, stad)
- Keurmerk-logo's met alt-teksten inclusief plaatsnaam

#### Contact pagina (verplicht)
- Google Maps embed (iframe)
- "Bekijk op Google Maps" link (`target="_blank"`)
- Contactgegevens card + openingstijden card

#### llms.txt
- In `public/` root, bevat: bedrijfsbeschrijving + eigenaar, ALLE pagina's met absolute URLs, specialisaties, certificeringen, sitemap URL

#### AI-vindbaarheid
- **Quotable content** — minimaal 3 paragrafen van 60-80 woorden op homepage met explanation markers
- **Nichepagina's** — 1+ lange content pagina's per specialisatie met FAQPage schema
- **Testimonials** koppelen aan juiste dienstenpagina
- **Navigatie** bevat "Diensten" als vast item
- **Credentials** in tekst + in Person schema (niet alleen sales-copy)

## Stappen per nieuwe klant

1. Clone template repo, `npm install --legacy-peer-deps`
2. Fetch content + kleuren + fonts + reviews + certificeringen van bestaande site
3. Vul `src/data/site.ts` in (alle CHANGE_ME waarden)
4. Branding: Tailwind kleuren, fonts (fontsource → public/fonts/), favicon (letter + primary kleur)
5. Alle afbeeldingen plaatsen met GEO-geoptimaliseerde alt-teksten
6. Content schrijven: alle pagina's, testimonials (.yaml), FAQ's, blog (min. 3 posts met interne links naar diensten)
7. Regiopagina's aanmaken (2-3 nabijgelegen steden, unieke content + rijtijd + quotable openingsalinea + FAQ + E-E-A-T)
8. FAQ + E-E-A-T: op ALLE diensten-, product-, masterclass- en regiopagina's (3-4 FAQ items + FAQPage schema + E-E-A-T blok met opleiding + lidmaatschappen)
9. Testimonials koppelen: per dienstenpagina een relevante review tonen
10. Navigatie: alle subpagina's bereikbaar vanuit header + footer (nichepagina, masterclass, aanbod)
11. Visuele breadcrumbs op ALLE subpagina's inclusief privacy/voorwaarden (`breadcrumbs` prop op BaseLayout)
12. Privacy (AVG) en Voorwaarden pagina invullen
13. OG image instellen (`public/images/og-default.jpg`)
14. SEO/GEO checklist doorlopen: LocalBusiness compleet, meta descriptions < 160 chars + plaatsnaam, Product/Event schemas, footer met adres/telefoon, Google Maps op contact, llms.txt compleet (incl. regiopagina's)
15. Keystatic UI: `ui.brand` met klantnaam, `ui.navigation` groepen, `columns` in lijstweergaves, duidelijke Nederlandse descriptions
16. `npm run build` → git commit → deploy (Cloudflare Pages: preset "None", output `dist/client`)

## Belangrijke regels

### Nooit doen
- `npm audit fix` of `npm audit fix --force` — **NOOIT**, breekt Astro
- `fields.markdoc()` in Keystatic — **incompatibel met Astro**, altijd `fields.mdx()` (ook voor singletons met content veld)
- `output: 'hybrid'` — **verwijderd in Astro 6**, gebruik altijd `output: 'static'` (ondersteunt per-page SSR met adapter)
- `type: 'data'` in content collections — **verouderd in Astro 6**, gebruik altijd `glob` loader
- Afbeeldingen als `<img>` tag — **altijd `<Image>` uit `astro:assets`**
- `.mdoc` bestanden gebruiken — **niet supported zonder markdoc**, gebruik `.mdx` of `.yaml`
- Trailing slashes in links — `trailingSlash: 'never'` staat in de config
- `wrangler.toml` in de project root — **breekt Cloudflare Pages deployment**, zet Pages in beta Wrangler-modus
- Cloudflare adapter zonder `imageService: 'compile'` — **breekt alle afbeeldingen**, routeert ze via /_image runtime
- Blog bestanden als `.md` — **Keystatic Cloud herkent ze niet**, gebruik altijd `.mdx`
- Framework preset "Astro" in Cloudflare Pages — **veroorzaakt 404's**, gebruik "None" + `dist/client` als output

### Altijd doen
- `--legacy-peer-deps` bij npm install (staat ook in `.npmrc` voor Cloudflare builds)
- FAQ-antwoorden: eerste zin moet standalone werken, NOOIT beginnen met "Ja"/"Nee"
- H2 koppen: beginnen met een topic noun
- Alt-teksten: bevatten bedrijfsnaam + plaatsnaam + beroep/dienst
- Testimonial veldnaam is `text:` in YAML, **niet** `quote:`
- ALLE collections gebruiken `glob` loader, bijv: `loader: glob({ pattern: '**/*.yaml', base: 'src/content/testimonials' })`
- Blog collection glob: `**/*.{md,mdx}` — Keystatic maakt `.mdx` bestanden
- Settings collection glob: `**/*.{yaml,md,mdx}` — moet `.mdx` bevatten voor singletons met `fields.mdx()` content
- Keystatic blog: `format: { contentField: 'content', data: 'yaml' }` + `entryLayout: 'content'`
- Test altijd met `npm run build` voordat je iets als klaar beschouwt
- Alle tracking scripts alleen laden na cookie consent
- FAQ + FAQPage schema op ALLE diensten-, product-, masterclass- en regiopagina's (3-4 items inline, FAQAccordion component)
- E-E-A-T blok op ALLE diensten-, product-, masterclass- en regiopagina's (opleiding + opleidingsinstituut authority link + beroepsvereniging-lidmaatschappen)
- Testimonials koppelen aan de juiste dienstenpagina (niet alleen op homepage/reviews)
- Blogposts bevatten interne links naar relevante diensten en producten
- Regiopagina's hebben quotable openingsalinea (60-80 woorden, feitelijk, standalone als AI-antwoord)
- llms.txt bijwerken bij ELKE nieuwe pagina (ook regiopagina's)
- `.wrangler/` in `.gitignore` — lokale Wrangler state mag nooit in git
- Cloudflare Pages: build output directory `dist/client`, framework preset "None"
- Post-build script `scripts/prepare-pages.mjs` genereert `_worker.js` + `_routes.json`

## astro.config.mjs patroon

Keystatic Cloud vereist dat de `/keystatic` SSR route ook in productie beschikbaar is. Daarom:
- **Dev:** `@astrojs/node` adapter (lokale Keystatic admin)
- **Productie:** `@astrojs/cloudflare` adapter met `imageService: 'compile'`
- **Keystatic** altijd als integratie geladen (niet conditioneel)
- **Output** altijd `'static'` — Astro 6 ondersteunt per-page SSR met adapter

```javascript
import keystatic from '@keystatic/astro';

const isDev = process.argv.includes('dev');

let adapter;
if (isDev) {
  adapter = (await import('@astrojs/node')).default({ mode: 'standalone' });
} else {
  adapter = (await import('@astrojs/cloudflare')).default({
    imageService: 'compile',  // VERPLICHT — zonder dit worden images via /_image gerouteerd en breken ze
  });
}

export default defineConfig({
  output: 'static',
  adapter,
  integrations: [
    keystatic(),
    // ... overige integrations
  ],
});
```

**Belangrijk:** `@astrojs/node` staat als devDependency, `@astrojs/cloudflare` als dependency. `.npmrc` bevat `legacy-peer-deps=true`.

## Cloudflare Pages deployment

De `@astrojs/cloudflare` adapter v13 genereert een Workers-structuur (`dist/server/` + `dist/client/`), maar Cloudflare Pages herkent dit NIET automatisch. Vereiste setup:

### Post-build script (`scripts/prepare-pages.mjs`)

Bundelt `dist/server/entry.mjs` tot `dist/client/_worker.js` + maakt `_routes.json`:

```javascript
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

// Bundle server entry for Cloudflare Pages Advanced Mode
execSync('npx esbuild dist/server/entry.mjs --bundle --outfile=dist/client/_worker.js --format=esm --target=es2022 --external:cloudflare:* --external:node:*', { stdio: 'inherit' });

// Routes: alleen /keystatic en /_image naar de Worker, rest is static
writeFileSync('dist/client/_routes.json', JSON.stringify({
  version: 1,
  include: ['/keystatic', '/keystatic/*', '/_image'],
  exclude: [],
}, null, 2));
```

**Build command in package.json:** `"build": "astro build && node scripts/prepare-pages.mjs"`

### Cloudflare Pages dashboard instellingen

| Instelling | Waarde | Waarom |
|---|---|---|
| Framework preset | **None** | "Astro" preset veroorzaakt conflicten met adapter v13 |
| Build command | `npm run build` | Draait astro build + post-build script |
| Build output directory | **`dist/client`** | Adapter zet static files in `dist/client/`, niet `dist/` |

### Valkuilen (geleerd uit productie)

- **GEEN `wrangler.toml` in de root** — zet Pages in beta "Wrangler configuration mode" waardoor `_worker.js` niet wordt herkend
- **`imageService: 'compile'` is VERPLICHT** — zonder dit routeert de adapter alle images via `/_image` runtime endpoint die een IMAGES binding nodig heeft. Met `'compile'` worden images bij build geoptimaliseerd als statische WebP bestanden
- **`.wrangler/` in `.gitignore`** — lokale Wrangler state mag NOOIT in git (veroorzaakt deploy errors)
- **Blog bestanden moeten `.mdx` zijn** — Keystatic met `fields.mdx()` herkent GEEN `.md` bestanden

## Keystatic config structuur

```typescript
// UI: brand naam + navigatie-groepen voor overzichtelijk CMS
ui: {
  brand: { name: 'Klantnaam' },
  navigation: {
    'Website': ['homepage', 'about', 'contact', 'masterclass'],
    'Content': ['blogposts', 'testimonials', 'faqs'],
    'Aanbod': ['diensten', 'producten'],
  },
},

collections: {
  blogposts: collection({
    // slugField: 'title', path: 'src/content/blog/*'
    // format: { contentField: 'content', data: 'yaml' }, entryLayout: 'content'
    // columns: ['publishDate', 'summary']  ← extra kolommen in lijstweergave
    // schema: title (slug), summary (text max 160), publishDate (date),
    //         coverImage (image), content (fields.mdx())
    // BESTANDEN MOETEN .mdx ZIJN — Keystatic Cloud herkent geen .md
  }),
  faqs: collection({
    // slugField: 'question', path: 'src/content/faqs/*'
    // columns: ['page']
    // schema: question (slug), answer (text multiline),
    //         order (integer), page (select: home/about/services)
  }),
  testimonials: collection({
    // slugField: 'name', path: 'src/content/testimonials/*'
    // columns: ['role', 'rating']
    // schema: name (slug), role (text), text (text multiline),
    //         rating (integer 1-5)
  }),
  diensten: collection({ /* title, subtitle, description, voorWie, praktisch, prijs */ }),
  producten: collection({ /* name, price, description, longDescription, features, ctaText */ }),
}
singletons: {
  homepage: singleton({ /* heroTitel, heroSubtekst, heroCtaPrimary/Secondary, introTitel/Tekst, ctaBand */ }),
  about: singleton({ /* headline, subheadline, bio (fields.mdx), profileImage */ }),
  contact: singleton({ /* businessName, phone, email, address, openingHours */ }),
  masterclass: singleton({ /* title, description, forWho, learningGoals, ctaText */ }),
}
```

## Schema.org per pagina

| Pagina | Schemas |
|---|---|
| Homepage | LocalBusiness, WebSite, FounderPerson, AggregateRating, ReviewSnippets, FAQPage |
| Diensten index | BreadcrumbList |
| Diensten detail | Service (met serviceType + areaServed), FAQPage, BreadcrumbList |
| Over | ProfilePage, BreadcrumbList |
| Reviews | BreadcrumbList, ReviewSnippets, AggregateRating |
| Blog index | BreadcrumbList |
| Blog detail | BlogPosting, BreadcrumbList |
| Contact | BreadcrumbList |
| Nichepagina's | FAQPage, BreadcrumbList |
| Aanbod (betaald) | Product (met offers/price), FAQPage, BreadcrumbList |
| Masterclass/workshop | EducationEvent, FAQPage, BreadcrumbList |
| Regiopagina's | Service (met areaServed), FAQPage, BreadcrumbList |

## Mapstructuur afbeeldingen

```
src/assets/
  logos/           → header logo, footer logo, keurmerk-logo's
  [klantnaam]/     → profielfoto, hero, sfeerbeelden
public/images/     → profielfoto kopie (voor JSON-LD), og-default.jpg
public/fonts/      → self-hosted woff2 bestanden
```

## Site Migratie (bestaande klantsite overbrengen)

> Bij BESTAANDE sites: altijd eerst migratietype bepalen. Bij greenfield builds (geen bestaande site) dit overslaan.

### Simpel vs. serieus

**Simpel** (5-7 uur): <=5 pagina's, <10 backlinks, geen rankings, geen blog.
**Serieus** (12-20 uur): 6+ pagina's, 10+ backlinks, rankings, blog, GBP met reviews.

### Serieus pad — kritieke stappen

1. **SEO-inventaris** — NOOIT overslaan. Sitemap ophalen, backlinks analyseren, rankings checken, GBP noteren.
2. **URL-mapping** — Spreadsheet: Oude URL → Nieuwe URL → Actie. URLs met backlinks zijn HEILIG (exact behouden of 301).
3. **Redirects** — `_redirects` bestand in `public/`. Cloudflare Pages max 2000 regels. WordPress-URLs opruimen (/author/, /category/, /tag/, /feed/).
4. **DNS-cutover** — TTL 24u vooraf verlagen naar 300s. Oude hosting pas na 48u deactiveren.
5. **Na-live monitoring** — Week 1: GSC crawl errors, `site:domein.nl`, rankings vergelijken.

### Top 5 migratiefouten

1. Geen URL-mapping → broken backlinks, rankings kelderen
2. GBP niet bijgewerkt → belangrijkste lokale link broken
3. Te vroeg oude hosting opzeggen → DNS propagatie duurt tot 48u
4. WordPress feeds/author pages vergeten → 404's
5. Geen monitoring na migratie → 404's te laat ontdekt

Volledige checklist: zie `NOTION_BRIEFING_V2.md` → "Site Migratie Checklist" sectie.

## Referentie

Bij twijfel: bekijk de werkende Yogapracht implementatie in `NXG-Media2026/yogapracht_demo`. Alle patronen daar zijn het bewezen sjabloon.
