# NXG Client Template — Volledig Stappenplan v2

> Bijgewerkt na eerste klant-build (Yogapracht, mei 2026). Dit document beschrijft hoe je vanuit de nxg-client-template een nieuwe klant-site opzet.

---

## Overzicht

**Wat we bouwen:** Een Astro 6 + Tailwind + Keystatic template die we per klant clonen. Elke klant-site heeft hetzelfde technische fundament maar eigen branding en content.

**Template repo:** `NXG-Media2026/nxg-client-template`  
**Referentie-implementatie:** `NXG-Media2026/yogapracht_demo`

**Elke klant-site bevat standaard:**
- Statische site, sub-2s laadtijd, 95+ Lighthouse score
- Pagina's: Home, Over, Reviews, Blog (index + detail), Contact, Privacy, Voorwaarden
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
- [ ] Hero: koptekst, subtekst, CTA-tekst
- [ ] Diensten/mogelijkheden cards (3 stuks)
- [ ] Over-sectie korte intro
- [ ] Reviews sectie (trekt automatisch uit testimonials collection)
- [ ] CTA-band tekst
- [ ] FAQ's (min. 4, inline in de pagina)
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
```

**Reviews pagina** (`src/pages/reviews.astro`):
- Trekt automatisch alle testimonials uit de content collection
- Geen handmatige content nodig, alleen testimonials aanmaken

**Blog** (`src/content/blog/`):
```
- [ ] Minimaal 1 blogpost aanmaken (liefst 3+)
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

### Stap 7: Schema.org controleren (15 min)

Alle pagina's moeten de juiste schemas hebben:

| Pagina | Schemas |
|---|---|
| Homepage | LocalBusiness, WebSite, AggregateRating, FAQPage |
| Over | ProfilePage, BreadcrumbList |
| Reviews | BreadcrumbList, ReviewSnippets, AggregateRating |
| Blog index | BreadcrumbList |
| Blog detail | BlogPosting, BreadcrumbList |
| Contact | BreadcrumbList |

**LocalBusiness:**
- [ ] Juiste `@type` kiezen (HealthAndBeautyBusiness, Chiropractor, ProfessionalService, etc.)
- [ ] Geo-coördinaten ingevuld (latitude, longitude)
- [ ] Telefoonnummer, email, adres
- [ ] Social media sameAs URLs

### Stap 8: Navigatie en footer (10 min)

**`src/data/navigation.ts`:**
```typescript
export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Over Mij', href: '/over' },   // Pas label aan per klant
  { label: 'Reviews', href: '/reviews' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact', isButton: true },
];
```

**Footer** (`src/components/Footer.astro`):
- [ ] Pagina-links matchen met navigatie
- [ ] Keurmerk/branchevereniging logo's toegevoegd
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
| BreadcrumbList schema | Betere SERP weergave |
| OG image | Social sharing ziet er professioneel uit |
| Privacy + Voorwaarden | Wettelijk verplicht, vertrouwen |
| Keurmerk-logo's in footer | Vertrouwen + branche-autoriteit |

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
| Schema.org controleren | 15 min |
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
2. Vul site.ts in met alle klantgegevens
3. Stel branding in (Tailwind kleuren, fonts via fontsource, favicon)
4. Plaats alle afbeeldingen met GEO-geoptimaliseerde alt-teksten (altijd plaatsnaam erin)
5. Schrijf content voor alle pagina's: Home, Over, Reviews, Blog, Contact
6. Maak testimonials en FAQ's aan
7. Schrijf privacy pagina (AVG) en voorwaarden pagina
8. Stel OG image in
9. Controleer alle Schema.org markup
10. Build + commit

Standaard template features die ALTIJD mee moeten:
- Blog (index + detail pagina's)
- Reviews pagina + homepage sectie
- LocalBusiness schema met geo-coordinaten
- Alle afbeeldingen via <Image> component (auto WebP)
- Alt-teksten met bedrijfsnaam + plaatsnaam

Regels:
- npm audit fix NOOIT uitvoeren
- Gebruik fields.mdx() in Keystatic, NIET markdoc
- FAQ-antwoorden beginnen NOOIT met "Ja" of "Nee"
- Testimonial veldnaam is "text", niet "quote"
- trailingSlash: 'never' — geen trailing slashes in links
```
