# NXG Client Template — Volledig Stappenplan v2

> Bijgewerkt na eerste klant-build (Yogapracht, mei 2026). Dit document beschrijft hoe je vanuit de nxg-client-template een nieuwe klant-site opzet.

---

## Overzicht

**Wat we bouwen:** Een Astro 6 + Tailwind + Keystatic template die we per klant clonen. Elke klant-site heeft hetzelfde technische fundament maar eigen branding en content.

**Template repo:** `NXG-Media2026/nxg-client-template`  
**Referentie-implementatie:** `NXG-Media2026/yogapracht_demo`

**Elke klant-site bevat standaard:**
- Statische site, sub-2s laadtijd, 95+ Lighthouse score
- Pagina's: Home, Over, Diensten (index + detailpagina's), Reviews, Blog (index + detail), Contact, Privacy, Voorwaarden
- Schema.org structured data: LocalBusiness, AggregateRating, ReviewSnippets, BlogPosting, FAQPage, BreadcrumbList, WebSite, ProfilePage
- Keystatic CMS dashboard op `/keystatic` (klant beheert blog, FAQ's, testimonials)
- Alle afbeeldingen auto-WebP via Astro `<Image>` met GEO-geoptimaliseerde alt-teksten
- Default OG image voor social sharing
- Cookie consent-gated analytics (GA4 + Meta Pixel)
- MailerLite nieuwsbrief integratie
- Privacyverklaring (AVG-compliant) en Algemene Voorwaarden

---

## Technische stack

| Component | Versie/keuze | Notities |
|---|---|---|
| Framework | Astro 6.x | `output: 'static'` voor build, `'hybrid'` bij dev (Keystatic) |
| Adapter | `@astrojs/node@9` (alleen dev) | Geen adapter nodig voor Cloudflare Pages. Node adapter is alleen voor lokaal dev met Keystatic. |
| CSS | Tailwind 3.4 + `@tailwindcss/typography` | Semantische kleurnamen |
| CMS | Keystatic | `storage: { kind: 'local' }` voor dev |
| Blog | `@astrojs/mdx@5` | **NIET markdoc** — incompatibel met Astro |
| Content | Astro Content Collections | ALLE collections gebruiken `glob` loader (geen `type: 'data'`). Settings glob: `**/*.{yaml,md,mdx}` |
| Fonts | Self-hosted via fontsource | woff2 in `public/fonts/` |
| Afbeeldingen | Astro `<Image>` component | Auto WebP, responsive sizes |

**Kritieke regels:**
- `npm audit fix` → **NOOIT** uitvoeren, breekt Astro
- `npm install` → Gebruik `--legacy-peer-deps` als er peer dependency conflicts zijn
- `trailingSlash: 'never'` → Alle interne links zonder trailing slash
- `fields.mdx()` in Keystatic, **nooit** `fields.markdoc()` (ook voor singletons met content veld zoals about-bio)

---

## Fase 3 — Nieuwe klant opzetten (het eigenlijke werk)

> Fase 1 (Keystatic CMS) en Fase 2 (template extractie) zijn eenmalig afgerond. Dit is het stappenplan per nieuwe klant.

### Stap 1: Repo aanmaken (5 min)

```bash
# Via GitHub: klik "Use this template" op nxg-client-template
# Repo naam: NXG-Media2026/klantnaam
# Clone lokaal
git clone git@github.com:NXG-Media2026/klantnaam.git
cd klantnaam
npm install --legacy-peer-deps
```

### Stap 2: Informatie verzamelen van bestaande site (30 min)

**Geef Claude Code deze opdracht:**

```
Fetch de content van [klantnaam.com] en extraheer:
1. Alle teksten per pagina (home, over, diensten, contact)
2. Contactgegevens (email, telefoon, adres, KVK, BTW)
3. Social media URLs
4. Reviews/testimonials (naam, tekst, eventuele sterren)
5. FAQ's
6. Openingstijden / lestijden / spreekuren
7. Diploma's, certificeringen, lidmaatschappen
8. Kleuren (primary, accent, achtergrond) — gebruik browser JavaScript om computed styles te extraheren
9. Fonts (heading + body)
10. Logo's en afbeeldingen
```

**Controleer ook handmatig:**
- Google Maps voor exacte geo-coördinaten (nodig voor LocalBusiness schema)
- Keurmerken/brancheverenigingen (logo's voor footer)
- Bestaande reviews op Google, Facebook, etc.

### Stap 3: site.ts invullen (15 min)

Zoek alle `CHANGE_ME` waarden in `src/data/site.ts` en vervang:

```
- [ ] name, shortName, tagline
- [ ] url (https://www.klantnaam.com)
- [ ] founder: name, slug, role, bio, description, qualifications, credentials, education, languages, knowsAbout, image
- [ ] contact: email, phone, address (street, city, postalCode, country)
- [ ] socials: instagram, facebook, linkedin, youtube
- [ ] legal: businessName, responsiblePerson, street, postalCode, city, country, registerNumber, taxId, email, phone
```

### Stap 4: Branding instellen (30 min)

**Tailwind kleuren** (`tailwind.config.mjs`):

Gebruik semantische namen — verander alleen de hex-waarden:

```
- [ ] primary + primary-dark + primary-light
- [ ] accent + accent-dark + accent-light
- [ ] bg + bg-alt
- [ ] text + text-muted + text-inverse
- [ ] border
```

**Fonts:**

```bash
# Installeer fonts via fontsource
npm install --legacy-peer-deps @fontsource-variable/[heading-font] @fontsource/[body-font]

# Kopieer woff2 bestanden naar public/fonts/
cp node_modules/@fontsource-variable/[font]/files/*.woff2 public/fonts/
cp node_modules/@fontsource/[font]/files/*-latin-{400,500,600,700}-normal.woff2 public/fonts/
```

Update:
- `src/styles/global.css` → @font-face declaraties
- `tailwind.config.mjs` → fontFamily heading + body
- `src/components/SEOHead.astro` → font preload links

**Favicon:**

Update `public/favicon.svg`:
- Letter → eerste letter van bedrijfsnaam
- Kleur → primary kleur van de klant
- apple-touch-icon.png ook vervangen indien mogelijk

### Stap 5: Afbeeldingen plaatsen (30 min)

**Mapstructuur:**
```
src/assets/
  logos/         → header logo, footer logo, keurmerk-logo's
  [klantnaam]/   → profielfoto, hero, sfeerbeelden, yogaposes etc.
public/images/   → profielfoto (JPG kopie voor JSON-LD schema), og-default.jpg
```

**Regels voor ALLE afbeeldingen:**
- [ ] Gebruik ALTIJD de Astro `<Image>` component (auto WebP + responsive)
- [ ] Alt-teksten bevatten: **naam + beroep + bedrijfsnaam + plaatsnaam**
- [ ] Voorbeeld: `alt="Mariëlle van der Geest — gediplomeerd yogadocent bij Yogapracht in Hilvarenbeek"`
- [ ] Decoratieve afbeeldingen: `alt="" aria-hidden="true"`
- [ ] Hero/above-fold: `loading="eager"`, rest: `loading="lazy"`
- [ ] Responsive sizes: `widths={[480, 768, 1024]}` of `widths={[768, 1280, 1920]}` voor full-width

**Verplichte plaatsingen:**
```
- [ ] Header: logo
- [ ] Homepage hero: achtergrondafbeelding met text overlay
- [ ] Homepage "Over" sectie: profielfoto (rond, met border)
- [ ] Homepage diensten: decoratief icoon per card (indien beschikbaar)
- [ ] Homepage CTA-band: achtergrondafbeelding met text overlay
- [ ] Over pagina: profielfoto bovenaan + sfeerbeeld tussendoor
- [ ] Contact pagina: sfeerbeeld onderaan
- [ ] Footer: footer logo + keurmerk/branchevereniging logo's
```

**OG Image instellen:**
- Kopieer een geschikte foto naar `public/images/og-default.jpg`
- SEOHead.astro heeft al een fallback naar `/images/og-default.jpg`

### Stap 6: Content aanmaken (1-2 uur)

**Homepage** (`src/pages/index.astro`):
```
- [ ] Hero: koptekst, subtekst, CTA-tekst (link naar /diensten + /contact)
- [ ] Intro-sectie: korte uitleg wie de klant is en wat ze doen (met plaatsnaam)
- [ ] Diensten/mogelijkheden cards (clickable, linken naar /diensten/[slug])
- [ ] Voordelen-sectie: checkmark-lijst met sfeerbeeld
- [ ] Over-sectie: founder intro met profielfoto (link naar /over)
- [ ] Reviews sectie (trekt automatisch uit testimonials collection)
- [ ] CTA-band: achtergrondafbeelding met text overlay
- [ ] FAQ's (min. 4, inline in de pagina)
```

**Diensten overzicht** (`src/pages/diensten/index.astro`):
```
- [ ] Hero met sfeerbeeld
- [ ] Diensten-kaarten met korte beschrijving + link naar detailpagina
- [ ] Lesopbouw / werkwijze sectie
- [ ] CTA
```

**Diensten detail** (`src/pages/diensten/[slug].astro`):
```
- [ ] Hero/kop met breadcrumb (Diensten > [naam])
- [ ] Uitgebreide beschrijving van de dienst
- [ ] Voor-wie lijst (wanneer geschikt?)
- [ ] Praktische info (locatie, duur, tijden, prijs)
- [ ] Relevante testimonial (koppel aan juiste review)
- [ ] E-E-A-T blok: opleiding + opleidingsinstituut (authority link) + beroepsvereniging-lidmaatschappen + relevante specialisatie
- [ ] FAQ sectie: 3-4 inline items + FAQAccordion component
- [ ] CTA naar contact
- [ ] Service schema + FAQPage schema + BreadcrumbList schema
```

**Over pagina** (`src/pages/over.astro`):
```
- [ ] Persoonlijk verhaal / achtergrond
- [ ] Voordelen van de dienst (lijst)
- [ ] Uitleg over de methode/aanpak
- [ ] Wat gebeurt er tijdens een sessie/les
- [ ] Diploma's en opleidingen (volledige lijst)
```

**Contact pagina** (`src/pages/contact.astro`):
```
- [ ] Intro tekst
- [ ] Contactgegevens card (email, telefoon, adres)
- [ ] Openingstijden/lestijden/spreekuren card
- [ ] Google Maps embed (iframe)
- [ ] "Bekijk op Google Maps" link (target="_blank")
- [ ] Title bevat plaatsnaam
- [ ] H1 bevat bedrijfsnaam + plaatsnaam
```

**Reviews pagina** (`src/pages/reviews.astro`):
- Trekt automatisch alle testimonials uit de content collection
- Geen handmatige content nodig, alleen testimonials aanmaken

**Blog** (`src/content/blog/`):
```
- [ ] Minimaal 3-5 blogposts aanmaken voor topical authority
- [ ] Elke post bevat interne links naar relevante diensten en producten
- [ ] Cross-links tussen blogposts onderling (gerelateerde artikelen)
- [ ] Format: .md met YAML frontmatter (title, summary, publishDate, coverImage)
- [ ] Keystatic maakt nieuwe posts automatisch in het juiste format
```

**Testimonials** (`src/content/testimonials/`):
```
- [ ] Minimaal 3 reviews aanmaken als .yaml bestanden
- [ ] Velden: name, role (optioneel), text, rating (1-5)
- [ ] LET OP: veldnaam is "text", NIET "quote"
```

**FAQ's** (`src/content/faqs/`):
```
- [ ] Homepage FAQ's staan inline in index.astro
- [ ] Keystatic FAQ's zijn voor eventuele extra pagina's
- [ ] FAQ-antwoorden beginnen NOOIT met "Ja" of "Nee"
- [ ] Eerste zin moet standalone werken (AI-citeerbaarheid)
```

**Privacy pagina** (`src/pages/privacy.astro`):
```
- [ ] Template heeft al AVG-compliant basis
- [ ] Controleer of doelen kloppen voor deze klant
- [ ] Pas cookie-types aan (analytics, marketing)
```

**Voorwaarden pagina** (`src/pages/voorwaarden.astro`):
```
- [ ] Vraag klant om bestaande algemene voorwaarden
- [ ] Gebruik {siteConfig.name} in plaats van hardcoded bedrijfsnaam
- [ ] Bedrijfsgegevens onderaan via {siteConfig.legal.*}
```

### Stap 7: SEO/GEO checklist + Schema.org controleren (30 min)

Alle pagina's moeten de juiste schemas hebben:

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

**LocalBusiness (ALLE velden verplicht):**
- [ ] Juiste `@type` kiezen (HealthAndBeautyBusiness, Chiropractor, ProfessionalService, etc.)
- [ ] Geo-coördinaten ingevuld (latitude, longitude)
- [ ] Telefoonnummer, email, adres
- [ ] image (profielfoto), logo (OG image) — absolute URLs
- [ ] priceRange, hasMap (Google Maps URL), areaServed (City)
- [ ] openingHoursSpecification (dag + tijden)
- [ ] dateModified (automatisch via build-datum)
- [ ] Social media sameAs URLs
- [ ] founder → Person @id

### Stap 8: Navigatie en footer (10 min)

**`src/data/navigation.ts`:**
```typescript
export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Diensten', href: '/diensten' },     // Altijd meenemen
  { label: 'Aanbod', href: '/nichepagina' },     // Nichepagina of producten-overzicht
  { label: 'Masterclass', href: '/masterclass' },// Indien van toepassing
  { label: 'Over Mij', href: '/over' },          // Pas label aan per klant
  { label: 'Reviews', href: '/reviews' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact', isButton: true },
];
```

**Let op:** Alle subpagina's met eigen content (nichepagina's, masterclass, producten) moeten bereikbaar zijn vanuit de navigatie. Test dit altijd.

**Footer** (`src/components/Footer.astro`):
- [ ] "Diensten" link als eerste onder Pagina's
- [ ] Nichepagina / aanbod link (bijv. "Yoga bij overprikkeling")
- [ ] Masterclass / workshop link (indien aanwezig)
- [ ] Pagina-links matchen met navigatie
- [ ] Telefoonnummer met tel: link
- [ ] E-mailadres met mailto: link
- [ ] Fysiek adres (straat, postcode, stad)
- [ ] Keurmerk/branchevereniging logo's met alt-teksten (incl. plaatsnaam)
- [ ] Social media icons tonen (automatisch op basis van siteConfig)

### Stap 9: Lokaal testen (30 min)

```bash
npm run dev
```

**Checklist:**
```
- [ ] Homepage laadt correct met klant-branding
- [ ] Alle 7 pagina's bereikbaar (home, over, reviews, blog, contact, privacy, voorwaarden)
- [ ] Blog detail pagina werkt (/blog/[slug])
- [ ] Keystatic dashboard werkt op /keystatic
- [ ] Alle afbeeldingen laden (geen broken images)
- [ ] Favicon toont correct (juiste letter + kleur)
- [ ] OG image tags aanwezig (check via View Source)
- [ ] Schema.org markup aanwezig (check via View Source → zoek "application/ld+json")
- [ ] LocalBusiness bevat: image, logo, priceRange, hasMap, areaServed, openingHoursSpecification
- [ ] BreadcrumbList bevat "Home" als eerste item + absolute URLs
- [ ] Alle meta descriptions < 160 chars + bevatten plaatsnaam
- [ ] Footer bevat Diensten link + telefoon + adres
- [ ] Contact heeft Google Maps embed
- [ ] llms.txt bevat ALLE pagina's
- [ ] Geen console errors
- [ ] npm run build slaagt zonder errors
```

### Stap 10: Git commit + push (5 min)

```bash
git add .
git commit -m "feat: [klantnaam] klant-site volledig ingericht"
git push -u origin main
```

### Stap 11: Deploy (15 min)

**Cloudflare Pages:**
1. Framework preset: `Astro`
2. Build command: `npm run build` (automatisch ingevuld)
3. Build output directory: `dist` (automatisch ingevuld)
4. Root directory: leeg laten
5. Geen adapter nodig — astro.config.mjs schakelt automatisch naar `output: 'static'` bij build
6. `.npmrc` met `legacy-peer-deps=true` moet in de repo staan (voor peer dep conflicts)

**Custom domein:**
1. Cloudflare Pages → Custom domains → Add
2. DNS: CNAME record als domein elders staat
3. SSL automatisch via Cloudflare

### Stap 12: Analytics + Newsletter (15 min)

```
- [ ] GA4 property aanmaken → Meet-ID in .env als PUBLIC_GA_MEASUREMENT_ID
- [ ] Meta Pixel aanmaken → Pixel ID in .env als PUBLIC_META_PIXEL_ID
- [ ] MailerLite form aanmaken → Form ID in site.ts newsletter.formId
- [ ] Test: cookies accepteren → events checken in GA4/Meta
```

### Stap 13: Oplevering (30 min)

```
- [ ] Korte handleiding CMS sturen (3 screenshots, 5 zinnen)
- [ ] 15-min demo call plannen
- [ ] Hosting retainer in facturatiesysteem
- [ ] Uptime monitoring instellen
```

---

## Standaard template features (ALTIJD meenemen)

Deze features zijn verplicht bij elke klant-build. Ze zijn essentieel voor vindbaarheid (SEO/GEO):

| Feature | Waarom |
|---|---|
| Blog (index + detail) | Content marketing, long-tail SEO, BlogPosting schema |
| Reviews pagina + homepage sectie | Social proof, AggregateRating + ReviewSnippets schema |
| LocalBusiness schema met geo | Google Maps / local pack ranking |
| FAQPage schema | Featured snippets in zoekresultaten |
| BreadcrumbList schema + visuele breadcrumbs | Betere SERP weergave + UX navigatie |
| Regiopagina's (2-3 nabijgelegen steden) | GEO vindbaarheid, Service schema met areaServed |
| Prominente masterclass/workshop banner | Conversie op homepage, EducationEvent schema |
| Navigatie: alle content bereikbaar | Masterclass, aanbod, nichepagina's in header + footer |
| OG image | Social sharing ziet er professioneel uit |
| Privacy + Voorwaarden | Wettelijk verplicht, vertrouwen |
| Keurmerk-logo's in footer | Vertrouwen + branche-autoriteit |
| FAQ + FAQPage schema op ALLE diensten/product/masterclass/regio | Rich snippets + AI-citability |
| E-E-A-T blok op alle diensten/product/masterclass/regio | Google Quality Rater signals |
| Testimonials gekoppeld aan dienstenpagina's | Relevante social proof per dienst |
| Blog min. 3-5 posts met interne links | Topical authority + internal link equity |
| Quotable openingsalinea's op regiopagina's | AI-citability (60-80 woorden, feitelijk) |

---

## SEO/GEO checklist (VERPLICHT — van begin af aan volgen, niet achteraf)

### Meta & titels
```
- [ ] Alle meta descriptions ONDER 160 karakters
- [ ] Alle meta descriptions bevatten plaatsnaam
- [ ] Alle page titles bevatten bedrijfsnaam óf plaatsnaam
- [ ] H1 op homepage bevat bedrijfsnaam + plaatsnaam
- [ ] H1 op elke pagina is uniek en bevat relevante keywords
- [ ] Alle H2's beginnen met een topic noun (niet "Waarom..." of "Hoe...")
```

### Schema.org — LocalBusiness (alle velden verplicht)
```
- [ ] Juiste @type (HealthAndBeautyBusiness, Chiropractor, ProfessionalService, etc.)
- [ ] name, description, url, telephone, email
- [ ] address (streetAddress, addressLocality, postalCode, addressCountry)
- [ ] geo (latitude + longitude van Google Maps)
- [ ] image (profielfoto absolute URL)
- [ ] logo (OG image absolute URL)
- [ ] priceRange (bijv. "€" of "€€")
- [ ] hasMap (Google Maps URL naar adres)
- [ ] areaServed (@type City + name)
- [ ] openingHoursSpecification (dag, opens, closes)
- [ ] dateModified (automatisch via build-datum)
- [ ] sameAs (social media URLs)
- [ ] founder verwijst naar Person @id
```

### Schema.org — overige schemas
```
- [ ] Person schema op homepage: hasCredential, alumniOf, sameAs (persoonlijk), knowsAbout
- [ ] WebSite schema met dateModified
- [ ] Service per dienst: serviceType + areaServed (City)
- [ ] BreadcrumbList: "Home" als eerste item + absolute URLs (automatisch ingebouwd)
- [ ] AggregateRating + individuele ReviewSnippets op homepage
- [ ] FAQPage schema op homepage, nichepagina's, ALLE diensten, producten, masterclass en regiopagina's
- [ ] BlogPosting op blogposts, ProfilePage op over-pagina
- [ ] Product schema op betaalde producten (offers/price/priceCurrency)
- [ ] EducationEvent schema op masterclass/workshop pagina's
```

### Breadcrumbs
```
- [ ] URLs zijn absoluut (https://www.site.com/pad) — automatisch door generateBreadcrumbs
- [ ] "Home" automatisch als eerste item — automatisch door generateBreadcrumbs
- [ ] Breadcrumb parents kloppen (geen orphan-chains)
```

### Sitemap & indexering
```
- [ ] lastmod in sitemap config
- [ ] Privacy + voorwaarden UITGESLOTEN van sitemap
- [ ] /keystatic uitgesloten van sitemap
- [ ] robots.txt: Allow voor GPTBot, ClaudeBot, PerplexityBot
```

### Alt-teksten (alle afbeeldingen)
```
- [ ] Bevatten: bedrijfsnaam + plaatsnaam + dienst/context
- [ ] Decoratieve afbeeldingen: alt="" aria-hidden="true"
```

### Footer
```
- [ ] "Diensten" link aanwezig
- [ ] Telefoonnummer met tel: link
- [ ] E-mailadres met mailto: link
- [ ] Fysiek adres (straat, postcode, stad)
- [ ] Social media icons
- [ ] Keurmerk-logo's met alt-teksten inclusief plaatsnaam
```

### Contact pagina
```
- [ ] Google Maps embed (iframe)
- [ ] "Bekijk op Google Maps" link
- [ ] Contactgegevens card (email, telefoon, adres)
- [ ] Openingstijden/lestijden card
```

### llms.txt
```
- [ ] In public/ root
- [ ] Beschrijving bedrijf + eigenaar
- [ ] ALLE pagina's met absolute URLs
- [ ] Specialisaties/diensten opsomming
- [ ] Certificeringen/lidmaatschappen
- [ ] Sitemap URL
```

### AI-vindbaarheid & content
```
- [ ] Minimaal 3 quotable paragrafen (60-80 woorden) op homepage met explanation markers
- [ ] Minimaal 1 nichepagina per specialisatie (lange content, FAQPage schema)
- [ ] FAQ-antwoorden: eerste zin standalone, NOOIT beginnen met "Ja"/"Nee"
- [ ] FAQ + FAQPage schema op ALLE diensten-, product-, masterclass- en regiopagina's (3-4 items per pagina)
- [ ] E-E-A-T blok op ALLE diensten-, product-, masterclass- en regiopagina's (opleiding + authority links + lidmaatschappen)
- [ ] Credentials in tekst + in Person schema
- [ ] Testimonials koppelen aan juiste dienstenpagina (elke dienst toont relevante review)
- [ ] Navigatie bevat "Diensten" als vast item
- [ ] Blog: min. 3-5 posts met interne links naar diensten/producten + cross-links
- [ ] Regiopagina's: quotable openingsalinea (60-80 woorden, feitelijk, standalone als AI-antwoord)
- [ ] llms.txt: ALLE pagina's inclusief regiopagina's
```

### Producten & events (indien van toepassing)
```
- [ ] Betaalde producten: Product schema met offers/price/priceCurrency
- [ ] Prijs in meta description (bijv. "— €27")
- [ ] Gratis events/workshops: EducationEvent schema met isAccessibleForFree
```

---

## Veelgemaakte fouten

| Fout | Gevolg | Oplossing |
|---|---|---|
| `npm audit fix --force` | Breekt Astro volledig | **Nooit doen** |
| `fields.markdoc()` in Keystatic | Incompatibel met Astro, ook in singletons | Altijd `fields.mdx()`, ook voor about-bio |
| `output: 'hybrid'` hardcoded | Build faalt op Cloudflare | Alleen bij dev via `isDev` check, build is `'static'` |
| Afbeeldingen als `<img>` tag | Geen WebP conversie, geen optimalisatie | Altijd `<Image>` uit `astro:assets` |
| Alt-tekst zonder plaatsnaam | Mist GEO-signaal voor local SEO | Altijd bedrijfsnaam + plaatsnaam in alt |
| Testimonial veld `quote:` | Schema verwacht `text:` | Veldnaam is **altijd** `text:` |
| FAQ antwoord begint met "Ja"/"Nee" | AI kan het niet standalone citeren | Eerste zin moet op zichzelf staan |
| `.mdoc` bestanden gebruiken | Niet supported zonder markdoc | Gebruik .md, .mdx of .yaml |
| Content direct pushen zonder build | Broken deploy | Altijd eerst `npm run build` lokaal |
| Geen `--legacy-peer-deps` bij install | npm install faalt met peer conflicts | Altijd `--legacy-peer-deps` meegeven |
| Favicon niet aangepast | Oude template letter/kleur zichtbaar | Update letter + primary kleur in favicon.svg |
| Geen OG image | Social shares tonen geen afbeelding | Kopieer foto naar `public/images/og-default.jpg` |
| Meta description zonder plaatsnaam | Mist local SEO signaal | Altijd plaatsnaam in description |
| Meta description boven 160 chars | Wordt afgeknipt in Google | Altijd tellen, max 155-160 chars |
| H1 homepage zonder bedrijfsnaam/stad | Mist primair ranking signaal | H1 bevat altijd bedrijfsnaam + plaatsnaam |
| LocalBusiness zonder image/hasMap/priceRange | Incompleet schema, minder rich results | Altijd ALLE velden invullen (zie checklist) |
| Breadcrumbs met relatieve URLs | Ongeldige schema, Google negeert het | generateBreadcrumbs doet dit nu automatisch |
| Geen Google Maps op contact | Mist GEO bevestiging | Google Maps embed + link altijd op contact |
| Footer zonder adres/telefoon | Mist NAP consistentie | Footer bevat altijd telefoon + adres + Diensten link |
| llms.txt met maar 3 pagina's | AI-bots vinden niet alle content | Altijd ALLE pagina's + specialisaties opnemen |
| Sitemap met noindex pagina's | Conflicterend signaal naar Google | Privacy + voorwaarden uitsluiten van sitemap |
| Service schema zonder serviceType | Google kan dienst niet classificeren | Altijd serviceType + areaServed meegeven |
| Aanbod zonder Product schema | Prijs/beschikbaarheid niet zichtbaar in SERP | Product schema met offers/price op betaalde items |

---

## Tijdsinschatting per nieuwe klant

| Stap | Tijd |
|---|---|
| Repo aanmaken + npm install | 10 min |
| Info verzamelen van bestaande site | 30 min |
| site.ts + branding (kleuren, fonts, favicon) | 45 min |
| Afbeeldingen plaatsen + alt-teksten | 30 min |
| Content schrijven (alle pagina's) | 2-3 uur |
| Testimonials + FAQ's aanmaken | 30 min |
| Privacy + Voorwaarden | 30 min |
| SEO/GEO checklist + Schema.org | 30 min |
| Testen + build check | 30 min |
| Git commit + deploy | 15 min |
| Analytics + newsletter | 15 min |
| Oplevering + klant demo | 30 min |
| **Totaal** | **~6-8 uur** |

---

## Claude Code prompt voor nieuwe klant

Gebruik deze prompt bij het starten van een nieuwe klant-build:

```
We gaan een nieuwe klant-site bouwen op het NXG client template.

Klant: [NAAM]
Website: [URL of "geen bestaande site"]
Branche: [yoga/chiro/coach/etc]

Stappen:
1. Fetch alle content, contactgegevens, reviews, kleuren en fonts van de bestaande site
2. Als bestaande site: migratie-checklist doorlopen (zie sectie hieronder)
3. Vul site.ts in met alle klantgegevens
4. Stel branding in (Tailwind kleuren, fonts via fontsource, favicon)
5. Plaats alle afbeeldingen met GEO-geoptimaliseerde alt-teksten (altijd plaatsnaam erin)
6. Schrijf content voor alle pagina's: Home, Over, Diensten (index + detail), Reviews, Blog (min. 3-5 posts), Contact
7. Maak testimonials en FAQ's aan, koppel testimonials aan juiste dienstenpagina's
8. Maak 2-3 regiopagina's aan (unieke content, rijtijd, Service schema, quotable opener 60-80 woorden, FAQ + E-E-A-T)
9. FAQ + E-E-A-T op ALLE diensten-, product-, masterclass- en regiopagina's
10. Navigatie: alle subpagina's (nichepagina, masterclass, aanbod) bereikbaar in header EN footer
11. Visuele breadcrumbs op ALLE subpagina's inclusief privacy/voorwaarden (breadcrumbs prop op BaseLayout)
12. Prominente masterclass/workshop banner op homepage (indien van toepassing)
13. Blogposts: interne links naar diensten/producten + cross-links tussen posts
14. Schrijf privacy pagina (AVG) en voorwaarden pagina
15. Stel OG image in
16. SEO/GEO checklist doorlopen (zie sectie hierboven)
17. Build + commit

Standaard template features die ALTIJD mee moeten:
- Blog (index + detail, min. 3-5 posts met interne links naar diensten)
- Reviews pagina + homepage sectie + testimonials gekoppeld aan dienstenpagina's
- LocalBusiness schema COMPLEET (geo, image, logo, priceRange, hasMap, areaServed, openingHoursSpecification)
- FAQ + FAQPage schema op ALLE diensten/product/masterclass/regiopagina's (3-4 items per pagina)
- E-E-A-T blokken op ALLE diensten/product/masterclass/regiopagina's (opleiding + authority links + lidmaatschappen)
- Visuele breadcrumbs op ALLE subpagina's (inclusief privacy/voorwaarden)
- Regiopagina's (2-3 steden, unieke content, quotable opener 60-80 woorden, FAQ + E-E-A-T)
- Navigatie: masterclass/aanbod/nichepagina in header + footer
- Alle afbeeldingen via <Image> component (auto WebP)
- Alt-teksten met bedrijfsnaam + plaatsnaam + dienst

SEO/GEO regels (DIRECT toepassen, niet achteraf):
- Alle meta descriptions ONDER 160 chars met plaatsnaam
- H1 homepage bevat bedrijfsnaam + plaatsnaam
- Alle page titles bevatten bedrijfsnaam of plaatsnaam
- BreadcrumbList: absolute URLs, "Home" als eerste item (automatisch)
- Service schema: serviceType + areaServed per dienst
- Product schema op betaalde producten (prijs in meta description)
- EducationEvent schema op workshops/masterclasses
- Footer: Diensten link + telefoon + adres
- Contact: Google Maps embed + link
- llms.txt compleet (alle pagina's + specialisaties)
- Sitemap: privacy/voorwaarden uitsluiten

Overige regels:
- npm audit fix NOOIT uitvoeren
- Gebruik fields.mdx() in Keystatic, NIET markdoc
- FAQ-antwoorden beginnen NOOIT met "Ja" of "Nee"
- Testimonial veldnaam is "text", niet "quote"
- trailingSlash: 'never' — geen trailing slashes in links
```

---

## Site Migratie Checklist

> Gebruik dit bij het migreren van een BESTAANDE klantsite naar het template. Niet nodig bij greenfield builds.

### Bepaal het migratietype

| Vraag | Simpel | Serieus |
|---|---|---|
| Hoeveel pagina's? | 1-5 | 6+ |
| Inkomende backlinks? | <10 | 10+ |
| Rankt op zoektermen? | Nauwelijks | Ja |
| Blog/kennisbank? | Nee | Ja |
| Google Maps / GBP met reviews? | Nee/net aangemaakt | Ja |
| Site ouder dan 1 jaar? | Nee | Ja |

**<=2x Serieus** → Simpel pad (5-7 uur)
**>=3x Serieus** → Volledig pad (12-20 uur)

### Simpel pad

1. **Content ophalen** (30 min) — web_fetch per pagina
2. **URL-structuur** (15 min) — schone slugs, trailing slash beslissing
3. **Template vullen** (2-4 uur) — clone, site.ts, kleuren, content, Keystatic
4. **Deploy** (30 min) — Cloudflare Pages, custom domein, SSL
5. **Na live** (15 min) — GBP updaten, sitemap indienen

### Volledig pad

1. **SEO-inventaris** (1-2 uur) — NOOIT OVERSLAAN
   - Sitemap ophalen (sitemap.xml, wp-sitemap.xml, robots.txt)
   - Backlink analyse (Ubersuggest/Ahrefs) — pagina's met backlinks zijn HEILIG
   - Rankings checken (GSC of Ubersuggest) — top-10 zoektermen = prioriteit
   - GBP check (URL, reviews, Place ID)
   - Technical baseline (Lighthouse, structured data, CMS, robots.txt)

2. **URL-mapping** (1 uur) — spreadsheet: Oude URL | Nieuwe URL | Actie | Backlinks | Rankt op
   - URLs met backlinks/rankings blijven EXACT hetzelfde of krijgen 301
   - WordPress-URLs opruimen: /author/, /category/, /tag/, /feed/, /wp-admin/
   - Trailing slashes: 1 variant kiezen, andere redirecten

3. **Content ophalen** (1-2 uur) — web_fetch (<15 pagina's) of Firecrawl (15+)

4. **Content verbeteren** (2-4 uur) — copywriting + SEO + GEO regels toepassen (zie checklist hierboven)

5. **Schema markup** (1 uur) — minimaal: LocalBusiness, Person, FAQPage, Service, Review+AggregateRating, BreadcrumbList, BlogPosting

6. **Redirects** (30 min) — `_redirects` in `public/`, Cloudflare max 2000 regels
   - 301 voor verplaatste pagina's, 410 Gone alleen zonder SEO-waarde
   - Test met `curl -I https://domein.nl/oude-url`

7. **Template bouwen** (4-8 uur) — site.ts, branding, content, schema, llms.txt

8. **Testen voor DNS-cutover** (1 uur) — op staging URL (klantnaam.pages.dev)
   - Lighthouse 90+ / 95+ / 90+, redirects werken, schema valide

9. **DNS-cutover** (30 min)
   - 24u vooraf: TTL verlagen naar 300 sec
   - CNAME naar klantnaam.pages.dev, wacht op SSL
   - Na cutover: TTL verhogen, oude hosting pas na 48u uit

10. **Na-live checks** (1 uur, week 1) — GSC crawl errors, redirects, rankings monitoren

11. **Rapportage** (30 min) — Lighthouse voor/na, schema overzicht, CMS handleiding

12. **Oude hosting opzeggen** (na 2-4 weken) — backup, bevestig geen 404's

### Top 10 migratiefouten

1. Geen URL-mapping → broken backlinks, rankings kelderen
2. Trailing slashes inconsistent → duplicate URLs voor Google
3. Afbeeldingen niet gemigreerd → broken image links
4. WordPress feeds vergeten → 404's op /feed/
5. GBP niet bijgewerkt → belangrijkste lokale link broken
6. Te vroeg oude hosting opzeggen → DNS propagatie duurt tot 48u
7. Geen monitoring na migratie → 404's te laat ontdekt
8. Schema markup niet gevalideerd → Google negeert structured data
9. Meta Pixel/GA4 niet gemigreerd → conversie-data verloren
10. Booking widget URL niet aangepast → externe integraties broken
