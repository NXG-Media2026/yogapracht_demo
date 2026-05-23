# VA Build Playbook — Expert Brand Website from Template

**Version:** 1.0
**For:** Virtual assistants, junior devs, or anyone building a new site from this template.
**Skill required:** Basic comfort with terminal commands, copy-pasting, and filling in forms. No coding knowledge needed.
**Time:** 15-25 hours spread over 3-5 days.

---

## How this document works

This playbook is a **sequential checklist**. Follow it top to bottom. Don't skip steps. Don't jump ahead.

Every step has:
- **What to do** — the exact action
- **What to check** — how you know it worked
- **What to say to Claude Code** — the exact prompt to paste

If something breaks, don't try to fix it yourself. Copy the error message and paste it to Claude Code. He can fix almost anything.

---

## BEFORE YOU START — Client Onboarding Questionnaire

Fill in this form COMPLETELY before opening Claude Code. Every blank field will cause problems later. If the client hasn't provided something, write "TBD" and flag it — don't guess.

### Brand Identity
```
Business name:          _______________
Short name (max 22 chars): _______________
Tagline (1 sentence):   _______________
Domain (e.g. example.com): _______________
Primary language:       ___ (nl / en / es / de)
Secondary languages:    ___ (comma-separated, or "none")
```

### Business Details
```
Legal entity name:      _______________
Chamber of commerce (KVK): _______________
VAT number:             _______________
Street address:         _______________
City:                   _______________
Postal code:            _______________
Country:                _______________
Phone (international):  ___ (e.g. +31 6 12345678)
Email:                  _______________
WhatsApp number:        ___ (or "same as phone" or "none")
```

### Design
```
Primary accent color:   ___ (hex code, e.g. #C4653A)
Dark accent (hover):    ___ (hex code, slightly darker)
Light accent (backgrounds): ___ (hex code, very light tint)
Background color:       ___ (hex code, usually near-white)
Text color:             ___ (hex code, usually dark charcoal)
Heading font:           ___ (e.g. "Playfair Display", "DM Serif Display")
Body font:              ___ (e.g. "Inter", "DM Sans")
Logo file:              ___ (path to SVG or PNG)
Favicon file:           ___ (path to SVG)
OG image:               ___ (1200x630 PNG/JPG, or "generate from brand colors")
```

### Services / Products
```
Service 1 name:         _______________
Service 1 description:  _______________
Service 1 price:        _______________

Service 2 name:         _______________
Service 2 description:  _______________
Service 2 price:        _______________

(add more as needed)

Product 1 name:         _______________
Product 1 price:        _______________
Product 1 checkout URL: ___ (Plug & Pay, Stripe, or "TBD")

(add more as needed)
```

### Content Clusters
A cluster = a main topic the expert is known for. Most experts have 2-3 clusters.

```
Cluster 1 name:         _______________
Cluster 1 description:  _______________
Cluster 1 main product: _______________

Cluster 2 name:         _______________
Cluster 2 description:  _______________
Cluster 2 main product: _______________
```

### Proof / Social Proof
```
Client testimonial 1:   _______________
Client testimonial 2:   _______________
Client testimonial 3:   _______________
(real quotes only — NEVER invent testimonials)

Case study 1 client:    _______________
Case study 1 result:    _______________

Case study 2 client:    _______________
Case study 2 result:    _______________
```

### Tracking & Legal
```
GA4 Measurement ID:     ___ (G-XXXXXXXXXX, or "TBD")
Meta Pixel ID:          ___ (or "none")
Google Search Console:  ___ (verification code, or "TBD")
Calendly URL:           ___ (or "none")
Newsletter provider:    ___ (MailerLite / Mailchimp / ConvertKit / "none")
```

### Images Needed
```
Founder/team photo:     ___ (path or "TBD")
Hero image:             ___ (path or "TBD")
Service images:         ___ (paths or "TBD")
Case study images:      ___ (paths or "TBD")
```

---

## STARTING PROMPT — Copy-Paste to Claude Code

Once the questionnaire is filled in, paste this entire block into Claude Code as your first message. Replace the `{{PLACEHOLDERS}}` with the actual values from the questionnaire.

```
I'm building an expert-brand website from the doc.veri/costa-blanca-movement template.

## Client details
- Business name: {{BUSINESS_NAME}}
- Short name: {{SHORT_NAME}}
- Domain: {{DOMAIN}}
- Languages: {{PRIMARY_LANGUAGE}} (primary), {{SECONDARY_LANGUAGES}}
- Address: {{FULL_ADDRESS}}
- Phone: {{PHONE}}
- Email: {{EMAIL}}

## Design
- Accent color: {{ACCENT_HEX}}
- Heading font: {{HEADING_FONT}}
- Body font: {{BODY_FONT}}

## Niche
This is a {{NICHE_TYPE}} website (e.g. "coach", "therapist", "consultant", "agency").

## Clusters (main topics)
1. {{CLUSTER_1_NAME}}: {{CLUSTER_1_DESCRIPTION}}
2. {{CLUSTER_2_NAME}}: {{CLUSTER_2_DESCRIPTION}}

## Services
1. {{SERVICE_1}}
2. {{SERVICE_2}}

## Products
1. {{PRODUCT_1}} — {{PRICE_1}}
2. {{PRODUCT_2}} — {{PRICE_2}}

## What to do

Read the following files in this order before writing any code:
1. src/docs/EXECUTION_PROTOCOL.md — your process rules
2. src/docs/FORK_AND_ADAPT_PLAYBOOK.md — what to change
3. src/docs/UNIVERSAL_VS_NICHE.md — what NOT to change

Then execute Phase 0 from the Execution Protocol: produce the required-input
checklist showing what we have and what's still TBD.

After the Phase 0 checklist, proceed with Phase 1 (Architecture adaptation):
- Update src/data/site.ts with all business details above
- Update tailwind.config.mjs with the design colors
- Update src/styles/global.css with fonts
- Rename/create content collections for the niche
- Update i18n keys and route segments for all configured languages
- Update navigation.ts for the new page structure

Build after Phase 1 and report the completion level.

IMPORTANT RULES:
- NEVER run `npm audit fix --force` — it breaks Astro
- NEVER skip the Phase 0 intake audit
- Report completion level after every major phase
- A green build is NOT a finished website
- NEVER invent testimonials, reviews, or credentials
- All legal pages need a binding version in the primary language
- Cookie consent MUST gate analytics/marketing scripts (GDPR)
- Calendly must be click-to-load (no third-party scripts before user interaction)
- llms.txt is REQUIRED, not optional — especially for AI visibility businesses
- Use getCollectionBasePath() for legal page links in Footer, NOT localizePath()
```

---

## PHASE-BY-PHASE EXECUTION

### Phase 0 — Intake Audit (30 min)

**What happens:** Claude Code reads the brief and produces a table of everything needed.

**What you check:**
- [ ] Claude Code produced a table with columns: Category | Item | Status | Blocking? | Needed from user
- [ ] Every "TBD" from your questionnaire appears in the table
- [ ] No items are marked "done" that are actually still placeholder

**What to say if something is wrong:**
```
This item is not actually done — [item name] is still a placeholder. Mark it as TBD.
```

### Phase 1 — Architecture Adaptation (2-3 hours)

**What happens:** Claude Code rewrites site.ts, colors, fonts, collections, routes, navigation.

**What you check:**
- [ ] Run `npm run build` — it should pass with 0 errors
- [ ] The build output shows page URLs that make sense for this client (not old template URLs)
- [ ] No German, Dutch, or other wrong-language routes appear (unless they should)

**What to say when done:**
```
Build passes. Move to Phase 2: component adaptation.
```

**DANGER ZONE — Common mistakes at this phase:**

| Problem | What happened | What to say |
|---------|--------------|-------------|
| Build fails with "collection not found" | Collection was renamed but pages still reference old name | "Build fails: [paste error]. The collection was renamed but the pages still reference the old name." |
| Wrong language in URLs | Route segments weren't translated | "These URLs are in the wrong language: [list URLs]. Update the route segments in src/i18n/routes.ts." |
| `npm audit` warnings | Normal. **DO NOT** run `npm audit fix --force` | Ignore the warnings. They don't affect the site. |

### Phase 2 — Component Adaptation (2-3 hours)

**What happens:** Layouts and components are adapted for the new niche.

**What you check:**
- [ ] Run `npm run dev` and open `localhost:4321` in your browser
- [ ] Homepage loads — you see the client's name, not the template's
- [ ] Navigation links work
- [ ] Footer shows correct business details
- [ ] Mobile menu works (shrink your browser window)

**What to say when done:**
```
Components look correct. Move to Phase 3: content seeding.
```

### Phase 3 — Content Seeding (3-5 hours)

**What happens:** Claude Code creates content for services, cases, guides, products, and cluster pages.

**What you check:**
- [ ] Each service page has real content, not lorem ipsum
- [ ] Case studies use real client names and real results (from questionnaire)
- [ ] Product pages show correct prices
- [ ] No fake testimonials or invented credentials
- [ ] At least 1 guide/blog per cluster exists

**IMPORTANT:** This is where you need to give Claude Code the actual copywriting or approve what he generates. Don't let placeholder content slip through.

**What to say if content is thin:**
```
The case study for [client name] is too thin. Here's the real content:
- Client: [name]
- Situation: [what they were struggling with]
- What we did: [the work]
- Result: [specific numbers or outcomes]
- Quote from client: "[actual quote]"

Rewrite the case study with this real information.
```

### Phase 4 — Post-Build Audit (1-2 hours)

**What happens:** Claude Code runs three mandatory audits.

**What you check:**
- [ ] Claude produces Audit 4a (brief compliance) — every requirement from the starting prompt is checked
- [ ] Claude produces Audit 4b (missing inputs) — a table of what the client still needs to provide
- [ ] Claude produces Audit 4c (placeholder report) — every TBD, placeholder, or fake value is listed

**This is your quality gate.** Do NOT proceed to visual polish until all three audits are delivered.

**What to say:**
```
Run the Phase 4 post-build audit from the Execution Protocol:
4a. Brief compliance audit
4b. Missing-input audit
4c. Placeholder report

Do all three before proceeding.
```

### Phase 5 — Asset Integration (1-2 hours)

**What happens:** Wire real images, logos, founder photos.

**Prerequisite:** The client must have provided actual image files. If they haven't, skip to Phase 6 and come back.

**What you check:**
- [ ] Logo displays in header
- [ ] Favicon shows in browser tab
- [ ] Founder photo appears on about page
- [ ] No broken image icons on any page
- [ ] OG image works (test: paste any page URL into a social media composer)

### Phase 6 — Legal & Tracking (2-3 hours)

**What happens:** Privacy, terms, cookie consent, analytics, newsletter forms.

**What you check:**
- [ ] Privacy page exists and links from footer
- [ ] Terms page exists and links from footer
- [ ] Cookie consent banner appears on first visit
- [ ] Clicking "Accept all" — GA4 starts (check browser DevTools → Network → filter "google")
- [ ] Clicking "Necessary only" — NO GA4, NO Meta Pixel
- [ ] Calendly loads ONLY after clicking the placeholder button (not automatically)
- [ ] Footer legal links work in ALL languages

**CRITICAL CHECKS — these are the mistakes from previous builds:**

| Check | How to verify | What's wrong if it fails |
|-------|--------------|--------------------------|
| Footer privacy link goes to correct locale page | Click the privacy link on each language version | Footer uses `localizePath()` instead of `getCollectionBasePath()` — tell Claude to fix |
| Cookie consent gates ALL tracking | Clear localStorage, reload, check Network tab | Scripts load before consent — privacy violation |
| Calendly doesn't load until clicked | Reload page, check Network tab for calendly.com | Script loads on page load — privacy issue |
| Privacy page has binding version reference | EN/ES pages should link to NL binding version | Missing cross-reference |

**What to say:**
```
Build the legal and tracking setup following Phase 6 of the Execution Protocol.

Rules:
- Cookie consent MUST gate GA4 and Meta Pixel behind explicit consent
- Calendly must be click-to-load (button placeholder until user clicks)
- Privacy: full version in primary language, summary in other languages linking to binding version
- Terms: same pattern — full in primary, summary in others
- Footer legal links must use getCollectionBasePath(), NOT localizePath()
- All legal pages need route segments in src/i18n/routes.ts
```

### Phase 7 — Visual Polish (1-2 hours)

**What happens:** Responsive checks, font loading, image lazy loading, Lighthouse.

**What you check:**
- [ ] Open the site on your phone (not just desktop browser shrunk) — does it look right?
- [ ] Text is readable on mobile
- [ ] Buttons are large enough to tap (44x44px minimum)
- [ ] No horizontal scrolling on mobile
- [ ] Images load smoothly (no layout jumping)

**What to say:**
```
Run a visual polish pass on all pages:
- Check responsive layout on mobile, tablet, desktop
- Verify font loading (no flash of unstyled text)
- Run Lighthouse mobile audit — target 95+ on all categories
- Fix any console.error messages
```

### Phase 8 — Final Launch Audit (1 hour)

**What happens:** Full checklist before going live.

**What you check — THE FINAL LIST:**
- [ ] `npm run build` passes with 0 errors
- [ ] Page count matches expectations (write down the expected number: ___)
- [ ] robots.txt is accessible at `/robots.txt`
- [ ] llms.txt is accessible at `/llms.txt`
- [ ] Sitemap is at `/sitemap-index.xml`
- [ ] Schema validates (paste homepage URL into search.google.com/test/rich-results)
- [ ] No placeholder values in production output
- [ ] All forms work
- [ ] All CTAs link to correct destinations
- [ ] Legal pages linked from every footer
- [ ] OG tags work (social preview tool)
- [ ] No console errors on any page

**What to say:**
```
Run the Phase 8 final launch audit from the Execution Protocol. Check every item on the checklist. Report any failures.
```

---

## DEPLOYMENT

### Option A — Cloudflare Pages (recommended)

1. Push to GitHub: `git push origin main`
2. Go to dash.cloudflare.com → Pages → Create a project → Connect to Git
3. Settings:
   - Framework: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `NODE_VERSION` = `20`
4. Deploy
5. Add custom domain in Pages → Custom domains

### Option B — Vercel

1. Push to GitHub
2. Go to vercel.com → Import project
3. Framework: Astro
4. Deploy

### After deployment
- [ ] Submit sitemap in Google Search Console
- [ ] Verify GA4 is receiving data (GA4 Realtime report)
- [ ] Test cookie consent on live site
- [ ] Test on a real phone (not just desktop browser)

---

## CONTENT ENGINE — What to Build After Launch

The site architecture is done, but the content engine that drives traffic isn't. Here's what to build:

### Per cluster: 3 blog articles minimum
Each article should:
- Target a specific search query
- Include a recognition opening (not encyclopedia-style)
- Have clear H2/H3 structure
- Include an FAQ section
- Bridge to the cluster's main product at the end

**What to say to Claude Code:**
```
Write 3 blog articles for the [CLUSTER_NAME] cluster.

Target queries:
1. "[search query 1]"
2. "[search query 2]"
3. "[search query 3]"

Each article needs:
- Recognition opening (felt moment, not encyclopedia intro)
- Clear H2/H3 structure with AI-citable definitions
- FAQ section (3-4 questions)
- Product bridge to [PRODUCT_NAME] at the end
- Expert perspective callout (what generic advice misses)

Write in [LANGUAGE]. Tone: calm, professional, specific.
```

### Lead magnets (1 per cluster)
A free download that captures email addresses.

### Newsletter sequences
Post-download email sequence (5 emails per cluster).

---

## TROUBLESHOOTING — What Goes Wrong and How to Fix It

### "npm audit fix --force" broke everything
**NEVER run this.** It upgrades Astro to an incompatible version.

**Fix:**
```
git checkout -- package.json package-lock.json
rm -rf node_modules
npm install
```

### Build fails with "Cannot find module"
A file was deleted or renamed without updating imports.
```
Paste the full error to Claude Code. He will trace and fix the import.
```

### Footer legal links go to wrong page or 404
Root cause: `localizePath()` only prepends the locale prefix but doesn't translate the URL segment.
```
Fix: Footer must use getCollectionBasePath('privacy', locale) instead of localizePath('/privacy', locale). Same for terms/voorwaarden.
```

### Cookie consent doesn't block scripts
Root cause: Analytics scripts are in BaseLayout `<head>` instead of being loaded dynamically by CookieConsent.
```
Fix: Remove GA4/Meta Pixel from BaseLayout <head>. They must only load via the CookieConsent component after the user clicks "Accept all".
```

### Calendly loads before user clicks
Root cause: Calendly script is loaded on page load instead of on click.
```
Fix: CalendlyEmbed must show a button placeholder. The Calendly widget.js script loads only when the user clicks the button.
```

### Homepage shows in wrong language
Root cause: `<html lang="...">` doesn't match the page locale.
```
Check that BaseLayout receives the correct locale prop from every page.
```

### Pages render with old template content
Root cause: Astro content collection cache is stale.
```
Delete node_modules/.astro/ and restart the dev server.
```

### EN and NL pages have different sections
Root cause: A section was added to one language but not the other.
```
Compare line counts: find both homepage files, check they have the same number of sections. Add missing sections.
```

### Schema validation fails
```
Paste the JSON-LD into https://validator.schema.org/ and share the errors with Claude Code.
```

### Build shows wrong page count
Expected page count = (pages per locale) x (number of locales) + universal pages.
```
Count your pages manually and compare with build output. If pages are missing, check that content collection entries have the correct locale/language field.
```

---

## CRITICAL LESSONS FROM PREVIOUS BUILDS

These are mistakes that happened on real projects and cost hours to fix. Read this section before every build.

### 1. Route translation trap
`localizePath('/privacy', 'es')` returns `/es/privacy` — it does NOT translate "privacy" to "privacidad".
For translated URL segments, use `getCollectionBasePath()` or `getRouteSegment()`.
Always test footer links in EVERY language.

### 2. Content collection IDs
EN and NL content in the same collection share an ID namespace. If `service-one.md` exists in both, Astro errors on duplicate IDs. Use different filenames (e.g. `service-one.md` for EN, `dienst-een.md` for NL) and set `pageSlug` in frontmatter to control the URL.

### 3. Consent before scripts
GDPR requires consent BEFORE loading tracking scripts. The pattern:
- BaseLayout: only loads the `trackEvent()` wrapper (no GA4, no Meta Pixel)
- CookieConsent: on "Accept all", dynamically creates `<script>` tags for GA4 and Meta Pixel
- On page reload: checks localStorage for prior consent before loading

### 4. Click-to-load for third-party embeds
Calendly, YouTube, Vimeo, etc. must NOT load until the user interacts. Show a placeholder button. On click: remove button, create widget, load script.

### 5. Never invent content
Never generate fake testimonials, reviews, case studies, or credentials. If the client hasn't provided them, use placeholder text clearly marked as "[PLACEHOLDER — client to provide]" or hide the section entirely.

### 6. Primary language is the binding legal version
Privacy and Terms pages in secondary languages are summaries. They must link to the primary-language version as the legally binding text.

### 7. Schema @id linking
Schema.org entities must reference each other via `@id`. AggregateRating must reference the business. Reviews must reference the business. Stand-alone ratings without `itemReviewed` are ignored by Google.

### 8. Build cache on hosting platforms
Cloudflare Pages caches `node_modules/` between builds. If something works locally but not on deploy, purge the build cache from the dashboard.

### 9. Font handling
Don't use `@fontsource-*` npm packages — they hash filenames and break preloading. Self-host woff2 files in `public/fonts/`, write `@font-face` in `global.css`, and add preload `<link>` tags in SEOHead.

### 10. The "finished" trap
A passing `npm run build` is the starting line, not the finish line. The Execution Protocol defines 6 completion levels — "technical build complete" is level 2 of 6.

---

## REFERENCE — Where Things Live

Quick lookup for when you need to find or change something.

| What | Where | Notes |
|------|-------|-------|
| Business name, address, phone | `src/data/site.ts` | Single source of truth. Never hardcode elsewhere. |
| Brand colors | `tailwind.config.mjs` | CSS custom properties in `src/styles/global.css` must match. |
| Fonts | `public/fonts/` + `src/styles/global.css` | @font-face rules + preload links in SEOHead |
| Navigation menu | `src/data/navigation.ts` | Per-language arrays |
| UI text (button labels, etc.) | `src/i18n/ui.ts` | Per-language keys |
| URL segments | `src/i18n/routes.ts` | Maps route keys to locale-specific slugs |
| Route translation helper | `src/i18n/utils.ts` | `getCollectionBasePath()`, `getRouteSegment()` |
| Content (services, cases, etc.) | `src/content/` | Markdown with YAML frontmatter |
| Cluster strategy | `src/data/clusters/` | YAML files per cluster |
| Schema.org generators | `src/data/schema.ts` | JSON-LD for structured data |
| Analytics tracking | `src/lib/analytics.ts` | `trackEvent()` wrapper |
| Cookie consent | `src/components/CookieConsent.astro` | Gates GA4 + Meta Pixel |
| robots.txt | `public/robots.txt` | Crawler directives |
| llms.txt | `public/llms.txt` | AI-readable site description |
| Layouts | `src/layouts/` | BaseLayout, ServiceLayout, GuideLayout, etc. |
| HTML head (SEO) | `src/components/SEOHead.astro` | Title, meta, OG, hreflang, schema slot |

---

## DOCUMENT HIERARCHY

This playbook is the only document you need to follow. The other docs exist for Claude Code's reference:

| Document | Purpose | You need to read it? |
|----------|---------|---------------------|
| **VA_BUILD_PLAYBOOK.md** (this file) | Step-by-step build guide | YES — follow it |
| EXECUTION_PROTOCOL.md | Process rules for Claude Code | NO — Claude reads it |
| FORK_AND_ADAPT_PLAYBOOK.md | What files to change per niche | NO — Claude reads it |
| UNIVERSAL_VS_NICHE.md | What's portable vs niche-specific | NO — Claude reads it |
| CLUSTER_ARCHITECTURE_V1.2.md | System design spec | NO — Claude reads it |
| EXPERT_BRAND_TEMPLATE_BRIEFING_V2.md | Technical template briefing | NO — Claude reads it |

You follow this playbook. Claude Code follows the others.
