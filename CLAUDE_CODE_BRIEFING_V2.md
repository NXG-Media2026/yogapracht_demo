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
| Framework | Astro 6.x | `output: 'static'` voor build, `'hybrid'` bij dev (Keystatic) |
| Adapter | `@astrojs/node@9` (alleen dev) | Geen adapter nodig voor Cloudflare Pages static deploy |
| CSS | Tailwind 3.4 + `@tailwindcss/typography` | Semantische kleurnamen (primary, accent, bg, etc.) |
| CMS | Keystatic | `storage: { kind: 'local' }` voor dev |
| Blog content | `@astrojs/mdx@5` | **NIET markdoc** — incompatibel met Astro |
| Content | Astro Content Collections | ALLE collections gebruiken `glob` loader uit `astro/loaders` (geen `type: 'data'`) |
| Fonts | Self-hosted via fontsource | woff2 in `public/fonts/` |
| Afbeeldingen | Astro `<Image>` component | Auto WebP, responsive sizes |
| Analytics | GA4 + Meta Pixel | Alleen laden na cookie consent |
| Email | MailerLite | Consent-gated |

## Standaard template features (VERPLICHT bij elke klant)

Deze features moeten ALTIJD mee — ze zijn essentieel voor vindbaarheid:

1. **Blog** — /blog index + /blog/[slug] detail, BlogPosting schema, Keystatic MDX editor
2. **Reviews** — /reviews pagina + TestimonialCard + homepage sectie, AggregateRating + ReviewSnippets schema
3. **Local SEO schemas** — LocalBusiness (juiste subtype), AggregateRating, ReviewSnippets, FAQPage, BreadcrumbList, WebSite, ProfilePage, Service
4. **Pagina's** — Home, Over, Diensten (index + detailpagina's), Reviews, Blog, Contact, Privacy (AVG), Voorwaarden
5. **Diensten** — /diensten overzicht + /diensten/[slug] per dienst, Service schema, links vanuit homepage
6. **Image SEO** — Alle images via `<Image>` (auto WebP), alt-teksten met bedrijfsnaam + plaatsnaam + dienst
7. **OG image** — Default social sharing image op alle pagina's
8. **Keurmerk-logo's** — Branchevereniging/certificering logo's in footer

### Copywriting regels voor diensten en content

- **Homepage** moet altijd bevatten: hero met CTA, intro-sectie, uitleg-sectie (wat is de methode), diensten-kaarten (clickable), voor-wie sectie, voordelen-lijst, founder-sectie, reviews, CTA-band, FAQ
- **Dienstenpagina's** bevatten: hero/kop, uitgebreide beschrijving, voor-wie lijst, praktische info, relevante testimonial, CTA
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
6. Content schrijven: alle pagina's, testimonials (.yaml), FAQ's, blog (min. 1 post)
7. Privacy (AVG) en Voorwaarden pagina invullen
8. OG image instellen (`public/images/og-default.jpg`)
9. SEO/GEO checklist doorlopen (zie sectie hierboven): LocalBusiness compleet, meta descriptions < 160 chars + plaatsnaam, breadcrumbs, Product/Event schemas, footer met adres/telefoon, Google Maps op contact, llms.txt compleet
10. `npm run build` → git commit → deploy

## Belangrijke regels

### Nooit doen
- `npm audit fix` of `npm audit fix --force` — **NOOIT**, breekt Astro
- `fields.markdoc()` in Keystatic — **incompatibel met Astro**, altijd `fields.mdx()` (ook voor singletons met content veld)
- `output: 'hybrid'` hardcoded — **alleen bij dev** via `isDev` check, build is altijd `'static'`
- `type: 'data'` in content collections — **verouderd in Astro 6**, gebruik altijd `glob` loader
- `@astrojs/cloudflare` adapter — **niet nodig** voor Cloudflare Pages static deploy
- Afbeeldingen als `<img>` tag — **altijd `<Image>` uit `astro:assets`**
- `.mdoc` bestanden gebruiken — **niet supported zonder markdoc**, gebruik `.md`, `.mdx` of `.yaml`
- Trailing slashes in links — `trailingSlash: 'never'` staat in de config

### Altijd doen
- `--legacy-peer-deps` bij npm install (staat ook in `.npmrc` voor Cloudflare builds)
- FAQ-antwoorden: eerste zin moet standalone werken, NOOIT beginnen met "Ja"/"Nee"
- H2 koppen: beginnen met een topic noun
- Alt-teksten: bevatten bedrijfsnaam + plaatsnaam + beroep/dienst
- Testimonial veldnaam is `text:` in YAML, **niet** `quote:`
- ALLE collections gebruiken `glob` loader, bijv: `loader: glob({ pattern: '**/*.yaml', base: 'src/content/testimonials' })`
- Settings collection glob: `**/*.{yaml,md,mdx}` — moet `.mdx` bevatten voor singletons met `fields.mdx()` content
- Keystatic blog: `format: { contentField: 'content', data: 'yaml' }` + `entryLayout: 'content'`
- Test altijd met `npm run build` voordat je iets als klaar beschouwt
- Alle tracking scripts alleen laden na cookie consent

## astro.config.mjs patroon

Keystatic vereist `hybrid` output + node adapter (SSR voor admin routes). Maar Cloudflare Pages is static. Daarom is de config conditioneel:

```javascript
const isDev = process.argv.includes('dev');

// Keystatic + node adapter alleen laden bij dev
let keystatic, nodeAdapter;
if (isDev) {
  keystatic = (await import('@keystatic/astro')).default;
  nodeAdapter = (await import('@astrojs/node')).default;
}

export default defineConfig({
  output: isDev ? 'hybrid' : 'static',   // hybrid voor dev, static voor build
  ...(isDev ? { adapter: nodeAdapter({ mode: 'standalone' }) } : {}),
  integrations: [
    ...(isDev ? [keystatic()] : []),      // Keystatic alleen bij dev
    // ... overige integrations
  ],
});
```

**Belangrijk:** `@astrojs/node` staat als devDependency, `.npmrc` bevat `legacy-peer-deps=true`.

## Keystatic config structuur

```typescript
collections: {
  blogposts: collection({
    // slugField: 'title', path: 'src/content/blog/*'
    // format: { contentField: 'content', data: 'yaml' }, entryLayout: 'content'
    // schema: title (slug), summary (text max 160), publishDate (date),
    //         coverImage (image), content (fields.mdx())
  }),
  faqs: collection({
    // slugField: 'question', path: 'src/content/faqs/*'
    // schema: question (slug), answer (text multiline),
    //         order (integer), page (select: home/about/services)
  }),
  testimonials: collection({
    // slugField: 'name', path: 'src/content/testimonials/*'
    // schema: name (slug), role (text), text (text multiline),
    //         rating (integer 1-5)
  }),
}
singletons: {
  contact: singleton({ /* businessName, phone, email, address, openingHours */ }),
  about: singleton({ /* headline, subheadline, bio (fields.mdx), profileImage */ }),
}
```

## Schema.org per pagina

| Pagina | Schemas |
|---|---|
| Homepage | LocalBusiness, WebSite, FounderPerson, AggregateRating, ReviewSnippets, FAQPage |
| Diensten index | BreadcrumbList |
| Diensten detail | Service (met serviceType + areaServed), BreadcrumbList |
| Over | ProfilePage, BreadcrumbList |
| Reviews | BreadcrumbList, ReviewSnippets, AggregateRating |
| Blog index | BreadcrumbList |
| Blog detail | BlogPosting, BreadcrumbList |
| Contact | BreadcrumbList |
| Nichepagina's | FAQPage, BreadcrumbList |
| Aanbod (betaald) | Product (met offers/price), BreadcrumbList |
| Masterclass/workshop | EducationEvent, BreadcrumbList |

## Mapstructuur afbeeldingen

```
src/assets/
  logos/           → header logo, footer logo, keurmerk-logo's
  [klantnaam]/     → profielfoto, hero, sfeerbeelden
public/images/     → profielfoto kopie (voor JSON-LD), og-default.jpg
public/fonts/      → self-hosted woff2 bestanden
```

## Referentie

Bij twijfel: bekijk de werkende Yogapracht implementatie in `NXG-Media2026/yogapracht_demo`. Alle patronen daar zijn het bewezen sjabloon.
