# Cluster Architecture v1.2

**Status:** Architectural foundation document — extended with conversion-layer rules.
**Purpose:** Design the graph structure that underpins expert-brand websites (doc.veri + future coach/specialist clients).
**Next step after this:** Component sketches → then `EXPERT_BRAND_TEMPLATE_BRIEFING_V2.md` → then doc.veri Histamin-cluster reference implementation.
**Audience:** Joost (architecture decisions) + Claude Code (later implementation).

---

## Changelog

### v1.2 (current)

v1.1 architecture is approved as foundation. v1.2 adds the conversion layer that v1.1 was missing — copy architecture, conversion routes, stricter Calendly logic, micro-product handling and a social storytelling component. v1.1 content is preserved; v1.2 only adds.

| # | Addition | Section |
|---|---|---|
| 1 | Site-wide conversion routes (6 visitor paths) | new §4.6 |
| 2 | Conversion Copy Architecture — persuasion sequence + 8 copy rules | new §5 |
| 3 | Stricter Calendly placement logic — new `calendlyContext` options | §4.4 expanded |
| 4 | Micro-product rule with explicit Glutenfrei Superpower example | §4.3 expanded |
| 5 | Social Storytelling / Instagram Showcase component | new §4.7 + §10.9 |

Existing v1.1 sections renumber by +1 from §6 onward.

### v1.1

Fixed 10 structural issues identified in review. All changes served one meta-principle: the cluster config must own strategy and routing, not duplicate content lists that are already declared in frontmatter.

| # | Change | Section |
|---|---|---|
| 1 | New principle: source-of-truth split between cluster config and content frontmatter | §1.10 |
| 2 | Removed `articles:` and `glossaryTerms:` full lists from cluster yaml; replaced with `featuredArticles` / `featuredGlossaryTerms` curation | §3.1, §7, §8 |
| 3 | `crossClusters` changed from string array to object-based with `relationship`, `bridgeText`, `priority`, `showOn` | §3.1, §7, §8 |
| 4 | Added `hubSlug` to cluster config + fixed route mismatch | §3.1, §9 |
| 5 | Added `hubFaq` to cluster config (curated, not auto-pulled from articles) | §3.1 |
| 6 | Masterclass signup tagging clarified: `source_cluster` vs `primary_cluster` vs `assigned_cluster` | §4.2, §12 |
| 7 | Analytics events declare tracking source: client / webhook / thank-you / server | §12 |
| 8 | Schema matrix replaces vague "Person ref" with `ExpertPerson @id reference where supported by schema type` | §11 |
| 9 | Hub-as-rendered-config wording softened: rendered from config WITH optional editorial blocks | §9 |
| 10 | Conversion asset taxonomy includes cluster-owned / cross-cluster / site-wide axis | §4 |

Minor v1.1 refinements: medical example phrasing neutralized, citation length split (sentence 15–35 / definition 25–50), homepage AI citation slot wording, quiz future-proofing note.

---

## 0. The problem this solves

A typical coach/expert website has three weaknesses:

1. **Content is siloed.** Blogs, products, FAQs, glossary, quizzes all exist as separate pages with no enforced relationships. Internal linking happens manually → drift, gaps, missed conversion paths.
2. **Conversion is one-page-deep.** Either a landing page sells (but doesn't rank) or a content page educates (but doesn't sell). No hybrid.
3. **Measurement is page-level.** You see pageviews but can't answer: "which content cluster generates revenue?"

Cluster architecture fixes all three by making the **cluster** — not the page — the organizing primitive of the site.

A cluster is a topic + audience + commercial goal bundled together. Pages inherit from clusters. Internal linking, schema, analytics events, and conversion routing flow from a single config file per cluster.

This architecture is especially designed for expert businesses where education, trust and commercial routing must reinforce each other. It is not for simple brochure sites.

---

## 1. Core principles

These ten principles are the spine of the architecture. Every implementation decision derives from them.

1. **Cluster is the organizing primitive.** Not pages. Not content collections. The cluster.
2. **Single source of truth per cluster — for strategy.** One `clusters/[slug].yaml` file defines the cluster's commercial logic, conversion routing, audience, analytics goals, and curated highlights. It does NOT duplicate content lists already declared in frontmatter.
3. **Pages inherit from cluster.** A page declares `cluster: histamin` in its frontmatter and gets bridges, related links, schema refs, and analytics tags automatically through build-time graph resolution.
4. **Three conversion asset types, with different routing logic.** Cluster-specific lead magnet, cross-cluster masterclass, and micro-product. Each behaves differently in the funnel.
5. **Primary + secondary cluster pattern.** A page has one commercial owner cluster (which drives its primary CTA and bridge logic) and can have multiple relevance clusters (which give it discoverability across hubs). This is not just taxonomy — it is routing.
6. **Hub pages are rendered from cluster config with optional editorial blocks.** The content graph, cards, products, glossary refs, conversion assets are generated automatically. The expert can add narrative sections without owning the page structure manually.
7. **Cross-cluster linking is a topical-authority signal with contextual integrity.** Cross-cluster bridges declare not just `which cluster` but also `the relationship` and `the bridge copy` — to prevent medically or commercially misleading auto-links.
8. **AI-citation has three specific slots per page, not everywhere.** Citable definition (top), first sentence of each FAQ answer, first paragraph of each H2 section. Outside these: human prose.
9. **Analytics events carry cluster context.** Every conversion event fires with `cluster`, `source_cluster`, `source_page_type`, and `product_type` properties — enabling cluster-level revenue measurement. Events declare their tracking source (client / webhook / thank-you / server).
10. **Source-of-truth split.** Cluster config owns: strategy, routing, conversion assets, analytics, audience, cross-cluster relationships, curated highlights. Content entries own: their own cluster membership and page metadata. Build utilities resolve the graph by reading all entries and matching cluster fields. Cluster config may curate featured items but must not duplicate the full content list.

---

## 2. What a cluster *is* (and isn't)

A cluster is the intersection of:

- **A topic** (e.g. "Histamin & Hormone")
- **An audience** (e.g. women experiencing histamine-cycle interaction symptoms)
- **A commercial goal** (e.g. selling Histamin Bundle + routing to coaching for complex cases)
- **A measurement target** (e.g. revenue from this cluster, conversion rate from blog → bundle)
- **A content set** (hub + blogs + glossary terms + quiz archetype + product)
- **An audience segment for targeting** (Meta Pixel + mailprovider tag)

A cluster is **not**:

- A topic category alone
- A blog category enum
- A folder structure (clusters can span folders)
- A page type (pages are physical; clusters are logical)

**Mental model:** if a topic is worth building 4+ pages around AND has a defined conversion path attached, it's a cluster. A cluster can be commercially active now or strategically commercial later (e.g. a masterclass-led cluster routing to multiple products), but it must have a defined conversion path — not "we'll figure it out."

---

## 3. Data model

### 3.1 Cluster config (`src/data/clusters/[slug].yaml`)

This is the single source of truth per cluster for **strategy and routing**. Page-level content references it but is not duplicated inside it.

```yaml
# src/data/clusters/histamin.yaml

# === IDENTITY ===
slug: histamin                          # internal identifier (logic, analytics, frontmatter refs)
hubSlug: histamin-und-hormone            # SEO-rich URL slug for the hub page
title: "Histamin & Hormone"
shortTitle: "Histamin"                   # for nav, breadcrumbs, cards
heroImage: "clusters/histamin-hero.webp"

# Citable definition — appears on hub page top, used in schema
# 25–50 words, standalone, no leading clauses, AI-extractable
citableDefinition: >
  Histamin ist ein körpereigener Botenstoff, der Immunreaktionen, Verdauung
  und Schlaf-Wach-Rhythmus steuert. Bei vielen Frauen verstärken sich
  Histamin-Symptome im Zyklus, in der Perimenopause oder bei chronischem
  Stress — weil Östrogen, Cortisol und der Histamin-Abbau eng zusammenhängen.

# Optional editorial intro block for hub (Verena's voice)
# Build pipeline reads this; if empty, hub renders structured content only.
hubIntro: >
  In meiner Praxis sehe ich täglich Frauen, die monatelang einzelne Lebensmittel
  weglassen — ohne nachhaltigen Erfolg. Das liegt daran, dass Histamin selten
  isoliert auftritt. Hier findest du, wie Hormone, Zyklus und Histamin
  zusammenspielen — und was wirklich hilft.

# === CONTENT CURATION (not source of truth) ===
# Articles belonging to this cluster are auto-resolved from content/blog/*.md
# where `cluster: histamin` is set in frontmatter.
# featuredArticles only controls ordering and highlighting on the hub.
featuredArticles:
  - blog/histamin-vor-der-periode
  - blog/oestrogen-dao-zusammenhang

# Same pattern: glossary entries with `cluster: histamin` in frontmatter are
# auto-resolved. featuredGlossaryTerms controls which appear prominently on hub.
featuredGlossaryTerms:
  - histamin
  - dao
  - oestrogen

# Optional exclusions if a content entry should be hidden from this cluster's
# hub even though it carries the cluster tag (rare).
excludeFromHub:
  - blog/legacy-test-page

# === HUB-LEVEL CURATED FAQ ===
# These are NOT auto-pulled from article contentSchema. Hub FAQ is editorial
# and answers cluster-overarching questions. If empty, hub falls back to
# top 3 article primaryQuestions.
hubFaq:
  - question: "Was ist eine Histaminintoleranz?"
    answer: "Eine Histaminintoleranz beschreibt eine eingeschränkte Fähigkeit, Histamin im Körper abzubauen. Die Symptome reichen von Hautrötungen über Verdauungsbeschwerden bis zu Kopfschmerzen."
  - question: "Warum verändern sich Histamin-Symptome im weiblichen Zyklus?"
    answer: "Östrogen kann die Aktivität des Enzyms DAO senken, das Histamin im Darm abbaut. Bei vielen Frauen verstärken sich Histamin-Symptome deshalb in der zweiten Zyklushälfte oder in hormonellen Übergangsphasen."

# === COMMERCIAL CORE ===
primaryProduct: produkte/histamin-bundle    # ONE primary — used in all bridges
secondaryProducts:                          # additional products in same cluster
  - produkte/histamin-quick-start

# Products from OTHER clusters commonly co-purchased — for cross-sell blocks
crossSellProducts:
  - produkte/perimenopause-protocol         # from perimenopause cluster
  - produkte/cycle-training-guide           # from zyklus cluster

# === CONVERSION ASSETS (cluster-specific) ===
leadMagnets:
  primary:
    slug: histamin-7-tage-guide
    type: pdf                               # pdf | checklist | mini-course
    title: "Der kostenlose 7-Tage Histamin-Guide"
    deliveryUrl: "https://..."
    emailTag: "lead_magnet_histamin_guide"

# === CROSS-CLUSTER LINKING (topical authority + editorial integrity) ===
# Object-based to prevent generic auto-bridges. Each entry declares the
# actual relationship and the copy that will be used in bridge components.
crossClusters:
  - cluster: perimenopause
    relationship: "Histamin-Symptome können sich in hormonellen Übergangsphasen verändern."
    bridgeText: >
      Histamin-Symptome verstärken sich bei manchen Frauen in der Perimenopause,
      weil hormonelle Veränderungen Schlaf, Stressresistenz und Histamin-Toleranz
      beeinflussen können.
    priority: 1
    showOn: [hub, articles, product]

  - cluster: zyklus
    relationship: "Viele Frauen bemerken histaminähnliche Beschwerden zyklusabhängig."
    bridgeText: >
      Wenn deine Beschwerden vor der Periode stärker werden, lohnt sich ein Blick
      auf den Zusammenhang zwischen Zyklus, Östrogen und Histamin-Abbau.
    priority: 2
    showOn: [hub, articles]

  - cluster: ernaehrung
    relationship: "Ernährung ist bei Histamin relevant, aber histaminarm und glutenfrei sind nicht dasselbe."
    bridgeText: >
      Histaminarme Ernährung und glutenfreie Ernährung sind nicht dasselbe.
      Im Ernährungsbereich findest du allgemeine Grundlagen zu Energie,
      Verträglichkeit und alltagstauglicher Umsetzung.
    priority: 3
    showOn: [hub]

# === FUNNEL ROUTING ===
calendlyContext: "coaching-only"
# Options:
#   "off"                  → never in this cluster
#   "coaching-only"        → only on coaching/trajectory pages — DEFAULT for doc.veri
#   "high-ticket-only"     → only on €500+ product pages + coaching
#   "complex-case-only"    → only when quiz/masterclass routes to a complex-case segment
#   "warm-only"            → coaching, quiz-results, masterclass-thankyou, /ueber bottom
#   "always"               → every page in cluster

# === AUDIENCE & TARGETING ===
audience:
  primaryICP: "Women 28–45 with cycle-dependent histamine symptoms"
  metaPixelEvent: "ViewContent_Histamin"
  emailListTag: "cluster_histamin"
  retargetingAudienceId: "TBD"              # Meta Custom Audience ID

# === MEASUREMENT ===
analytics:
  primarySuccessEvent: "histamin_bundle_purchase"
  secondarySuccessEvents:
    - "histamin_guide_download"
    - "histamin_coaching_call_booked"
  funnelOrder:                              # for cluster funnel chart in dashboard
    - "histamin_cluster_pageview"
    - "histamin_guide_download"
    - "histamin_bundle_view"
    - "histamin_bundle_checkout_click"
    - "histamin_bundle_purchase"
```

**Key change from v1:** the cluster yaml no longer holds the canonical lists of articles/glossary. Those live in content frontmatter. Cluster yaml only declares curation (`featured*`), exclusions, and hub-overarching content (`hubFaq`).

### 3.2 Content collection schemas

Each content type extends source-template collections with a mandatory `cluster:` field in frontmatter. This is the **page's declaration of cluster ownership** — the build pipeline reads this to assemble the cluster graph.

#### Articles (`src/content/blog/[slug].md`)

```yaml
title: "Warum Histamin vor der Periode schlimmer wird"
pageSlug: "histamin-vor-der-periode"
publishedDate: 2026-05-12
lastReviewedDate: 2026-05-12
excerpt: "Östrogen, DAO und der weibliche Zyklus..."
heroImage: "blog/histamin-period.webp"
authorId: "verena"
readingTime: 6

# === CLUSTER MEMBERSHIP (source of truth for graph resolution) ===
cluster: histamin                    # ONE primary cluster, required
secondaryClusters:                   # zero or more secondary, optional
  - zyklus
  - perimenopause

# Content schema for AI extraction
# Auto-rendered as cited definition + structured H2 sections
contentSchema:
  primaryQuestion: "Warum verstärken sich Histamin-Symptome vor der Periode?"
  primaryAnswer: >
    Viele Frauen bemerken vor der Periode stärkere Histamin-Symptome, weil
    Östrogen die Aktivität des Enzyms DAO senken kann. DAO baut Histamin
    im Darm ab — sinkt seine Aktivität, sammelt sich mehr Histamin an.
    Zusätzlich wirkt das in dieser Phase sinkende Progesteron weniger
    stabilisierend.

seo:
  title: "Histamin vor der Periode — warum wird es schlimmer? | doc.veri"
  description: "Östrogen, DAO und Progesteron erklärt..."
```

What's automatic at build time:
- Bridge to `produkte/histamin-bundle` at end of article (resolved via `cluster: histamin` → cluster's `primaryProduct`)
- "Related learning" sidebar with other articles where `cluster: histamin` (excluding current)
- Cross-cluster bridges to perimenopause + zyklus content (resolved via cluster yaml's `crossClusters` + article's `secondaryClusters`)
- Schema: `BlogPosting` + `FAQPage` (from `contentSchema`) + ExpertPerson @id reference
- Analytics: events fire with `cluster: 'histamin', source_page_type: 'article'`

**Note on the primaryAnswer example:** kept deliberately neutral. Hormone biology is more nuanced than "Östrogen steigt vor der Periode." For doc.veri Verena reviews actual claims. For the template, examples avoid absolute biological claims that may not hold across all cases.

#### Products (`src/content/produkte/[slug].md`)

```yaml
title: "Histamin Bundle"
pageSlug: "histamin-bundle"
heroImage: "products/histamin-bundle.webp"

# === CLUSTER + PRODUCT TYPE ===
cluster: histamin                    # primary cluster, required
productType: bundle                  # full-product | micro-product | bundle | recurring
price: "67 €"
currency: EUR
plugAndPayUrl: "https://plugandpay.com/checkout/..."

# Hybrid product page content (see §6 page type matrix for full template)
problemRecognition: >
  Du erkennst dich in einem oder mehreren Symptomen wieder: ...

failedSolutions:
  - "Strikte Lebensmittellisten ohne nachhaltigen Erfolg"
  - "Antihistaminika ohne Ursachenklärung"
  - "Allgemeine Histamin-Diäten ohne Zyklusbezug"

mechanism: >
  Histamin-Beschwerden bei Frauen sind oft nicht nur ein Ernährungsproblem.
  Östrogen, DAO, Stress und Schlaf wirken zusammen — und genau hier setzt
  das Bundle an.

includes:
  - title: "Audio-Modul 1: Histamin & Zyklus verstehen"
    description: "..."
    outcome: "Du verstehst, warum Symptome zyklusabhängig schwanken"
  # ...

targetAudience:
  forYouIf:
    - "Du bemerkst Histamin-Symptome besonders in der zweiten Zyklushälfte"
  notForYouIf:
    - "Du suchst medizinische Diagnostik (dafür buche ein Erstgespräch)"

faq:
  - question: "Wie schnell sehe ich Ergebnisse?"
    answer: "Viele Frauen berichten innerhalb von 2–4 Wochen..."

seo:
  title: "Histamin Bundle — Hormone, Zyklus & Ernährung | doc.veri"
  description: "..."
```

#### Glossary terms (`src/content/glossary/[slug].md`)

```yaml
term: "DAO (Diamin-Oxidase)"
slug: dao

cluster: histamin                    # primary cluster
secondaryClusters:
  - ernaehrung

# Citable definition — 25–50 words, AI-extractable
definition: >
  DAO (Diamin-Oxidase) ist das Enzym, das Histamin im Darm abbaut.
  Bei Frauen kann Östrogen die Aktivität von DAO senken — deshalb
  verstärken sich Histamin-Symptome bei manchen Frauen in der zweiten
  Zyklushälfte oder in hormonellen Übergangsphasen.

longDescription: >
  [Optional longer prose explanation, human voice]

relatedTerms:
  - histamin
  - oestrogen
  - mastzellen

linkedArticle: blog/oestrogen-dao-zusammenhang
```

#### Quiz archetypes (`src/content/archetypen/[slug].md`)

```yaml
title: "Histamin-Dominant"
pageSlug: "histamin-dominant"
heroImage: "archetypes/histamin-dominant.webp"

cluster: histamin                    # 1:1 mapping — archetype belongs to one cluster

shortDescription: >
  Deine Antworten deuten darauf hin, dass Histamin und sein
  Zusammenspiel mit Östrogen, DAO und Zyklus aktuell die größte
  Rolle bei deinen Symptomen spielen.

# (rest of fields)
```

#### Lead magnets (`src/content/lead-magnets/[slug].md`)

```yaml
title: "Der kostenlose 7-Tage Histamin-Guide"
pageSlug: "histamin-7-tage-guide"
coverImage: "lead-magnets/histamin-guide-cover.webp"

cluster: histamin                    # cluster-specific lead magnet
assetType: pdf                       # pdf | checklist | mini-course | audio
emailTag: "lead_magnet_histamin_guide"
deliveryUrl: "..."
```

#### Masterclasses (`src/content/masterclasses/[slug].md`)

```yaml
title: "Hormone, Histamin & Zyklus als Superpower"
pageSlug: "hormone-histamin-zyklus-superpower"

# === MASTERCLASS-SPECIFIC: MULTI-CLUSTER (cross-cluster asset) ===
assetType: masterclass
primaryCluster: hormone-zyklus       # strategic owner
secondaryClusters:                   # also surfaces in these cluster hubs
  - histamin
  - perimenopause

duration: "32 Minuten"
format: "Evergreen webinar (no live date)"

# Routing logic per post-watch segment (see §4.2)
postWatchRoutes:
  - segment: "histamin-leaning"
    recommendedProduct: produkte/histamin-bundle
    secondaryCTA: "calendly"
  - segment: "perimenopause-leaning"
    recommendedProduct: produkte/perimenopause-protocol
    secondaryCTA: "calendly"
  - segment: "cycle-training-leaning"
    recommendedProduct: produkte/cycle-training-guide
    secondaryCTA: "membership"
  - segment: "complex-case"
    recommendedProduct: null
    primaryCTA: "calendly"

# Email tagging on signup
emailTagOnSignup: "masterclass_hormone_histamin_zyklus"
emailTagOnWatch: "watched_hormone_masterclass"
```

---

## 4. The three conversion asset types — and their cluster scope

Conversion assets vary on two axes: **funnel role** (lead capture / education / purchase / booking) and **cluster scope** (cluster-owned / cross-cluster / site-wide). The architecture must handle all combinations.

| Asset | Funnel role | Cluster scope | Example |
|---|---|---|---|
| Lead magnet (PDF/checklist) | Lead capture | Cluster-owned | Histamin-Guide |
| Masterclass / webinar | Education + pre-sell | Cross-cluster | Hormone-Histamin-Zyklus Masterclass |
| Micro-product | Entry purchase / bump | Cluster-owned | Glutenfrei Superpower €7,99 |
| Full product / bundle | Main purchase | Cluster-owned | Histamin Bundle |
| Coaching / Calendly | High-intent booking | Cross-cluster routing | Discovery call |
| Quiz | Cold-traffic router | Site-wide → maps to cluster | Hormon-Typ Quiz |

### 4.1 Cluster-specific lead magnet

**Example:** "Der kostenlose 7-Tage Histamin-Guide"

- Belongs to one cluster (Histamin) via `cluster: histamin` in frontmatter
- Surfaces on: cluster hub, all articles in cluster, product page (as soft alt-CTA)
- Email tag: `cluster_histamin` + `lead_magnet_histamin_guide`
- Post-download email sequence: cluster-specific (5 emails about histamine, ending with bundle pitch)

### 4.2 Cross-cluster masterclass

**Example:** "Hormone, Histamin & Zyklus als Superpower"

- Belongs to **primary cluster + 2-3 secondary clusters** (declared in frontmatter)
- Surfaces on: all hubs of all linked clusters, in nav as main lead magnet for warm-traffic-from-content, homepage prominent

**Signup tagging — three distinct concepts:**

| Tag type | When set | Carries |
|---|---|---|
| `primary_cluster` | At signup, always | The masterclass's strategic owner cluster (`hormone-zyklus`) |
| `source_cluster` | At signup, only if visitor came from a cluster page | Where the visitor was when they signed up (e.g. `histamin` if signup came from Histamin hub) |
| `assigned_cluster` | After watch + self-select on thank-you page | The final commercial cluster the visitor is being routed toward |

This means: signup IS cluster-tagged (source_cluster + primary_cluster) — just not yet finalized (assigned_cluster comes later).

**Example event sequence:**

```js
// At signup, from Histamin hub
trackEvent('masterclass_signup', {
  masterclass_slug: 'hormone-histamin-zyklus-superpower',
  primary_cluster: 'hormone-zyklus',
  source_cluster: 'histamin',
  source_page_type: 'hub'
})
// Email tags: masterclass_hormone_histamin_zyklus + source_cluster_histamin

// After watch, user self-selects "histamin-leaning" on thank-you page
trackEvent('masterclass_segment_assigned', {
  masterclass_slug: 'hormone-histamin-zyklus-superpower',
  assigned_cluster: 'histamin',
  segment: 'histamin-leaning'
})
// Email tags add: assigned_cluster_histamin + segment_histamin_leaning
```

### 4.3 Micro-product / entry offer

**Example:** "Glutenfrei als Superpower" (€7,99)

- Belongs to one cluster (Ernährung) as a `productType: micro-product`
- Different from full products: lower friction, single-page checkout, often a checkout bump or upsell, not a strategic funnel pillar
- Surfaces on: cluster hub (as one of several products), checkout flow of other products (as bump offer)
- After purchase: tag as `customer_micro_product` + cluster tag → nurture toward full product

**[NEW in v1.2] Explicit micro-product rule:**

`Glutenfrei als Superpower` is treated as a micro-product, not a strategic masterclass or standalone funnel pillar. Architecture treats this product type as a distinct class:

```yaml
# src/content/produkte/glutenfrei-superpower.md
title: "Glutenfrei als Superpower"
cluster: ernaehrung
productType: micro-product
price: 7.99
primaryGoal: "entry_purchase"
calendlyContext: "off"
# Page is intentionally shorter than full-product pages
```

Micro-product pages:
- Are shorter than full bundle pages (no extensive failed-solutions or mechanism sections)
- Do NOT show Calendly
- Do NOT show full cluster cross-cluster bridge stack
- DO show a clear upsell/next-product reference (e.g. to the cluster's full product)
- Can appear as checkout bumps on other product checkouts (`bumpOffers: [glutenfrei-superpower]`)

### 4.4 Coaching / Calendly route

Not a content asset, but a routing rule. Per cluster, `calendlyContext` defines where Calendly appears.

**[EXPANDED in v1.2] — stricter placement logic.**

The default placement should NOT be `warm-only` for most expert sites. Calendly is for high-intent, complex-case visitors. Showing it too broadly tanks booking quality and pushes lukewarm visitors into calls that should have been emails, products or quizzes.

`calendlyContext` options:

| Option | Where Calendly appears |
|---|---|
| `off` | Never in this cluster |
| `coaching-only` | Only on coaching/trajectory pages — DEFAULT for doc.veri |
| `high-ticket-only` | Only on €500+ product pages + coaching pages |
| `complex-case-only` | Only when quiz/masterclass routes a visitor to a "complex-case" segment |
| `warm-only` | Coaching, quiz-results, masterclass-thankyou, /ueber bottom |
| `always` | Every page in cluster — rarely justified, mostly for trial-call-driven funnels |

**Where Calendly explicitly does NOT belong (for doc.veri-class sites):**

- Homepage hero
- Blog articles
- Glossary pages
- Community / membership pages
- Mini-product pages
- Standard bundle / simple product pages
- Footer as global CTA

**Where Calendly DOES belong:**

- Coaching trajectory pages (always)
- High-ticket aanbod / trajectory pages
- Quiz result pages — only for "complex-case" archetype
- Masterclass thank-you page — only for "complex-case" or high-intent segment
- /ueber bottom (subtle, after Verena's story has built trust)

**Per-cluster default for doc.veri:**

```yaml
calendlyContext: "coaching-only"
```

**Segment-level overrides:** quiz archetypes and masterclass post-watch segments can override the cluster default. Example:

```yaml
# In a quiz archetype
title: "Complex Hormonal Case"
calendlyOverride: true
primaryCTA: "calendly"
```

```yaml
# In masterclass postWatchRoutes
- segment: "complex-case"
  primaryCTA: "calendly"
  recommendedProduct: null
```

These overrides are surgical — they activate Calendly only for that specific page/segment combination, regardless of cluster-level `calendlyContext`.

### 4.5 Quiz (site-wide router, with future flexibility)

The main quiz is **site-wide**, not cluster-scoped. Each archetype maps to exactly one cluster (1:1). The quiz acts as the **router**: cold visitor → archetype → cluster.

**v1.1 scope:** one site-wide quiz with archetype → cluster mapping.

**Future flexibility:** the data model does not prevent cluster-specific niche quizzes later (e.g. "Histamin Symptom-Check" as a smaller quiz inside the Histamin cluster). These would live as a separate asset type and are deferred to v2+.

---

### 4.6 Site-wide Conversion Routes [NEW in v1.2]

The site supports multiple conversion routes. Each route serves a different visitor temperature. The architecture must enable all six and surface them appropriately in navigation, CTAs, related content blocks, and analytics events.

**Route 1 — Cold / unsure visitor**
```
Homepage or blog → Quiz → Archetype result → Product / lead magnet / coaching
```

**Route 2 — Educational visitor**
```
Blog → Hub → Related learning → Product bridge → Product page
```

**Route 3 — Masterclass visitor**
```
Homepage / Kostenlos / Hub → Masterclass → Thank-you segmentation → Product or Calendly
```

**Route 4 — High-intent visitor**
```
Homepage / About / Coaching → Calendly
```

**Route 5 — Micro-product buyer**
```
Product page or checkout bump → Micro-product purchase → Email nurture → Full product or coaching
```

**Route 6 — Social storytelling visitor**
```
Homepage → Social storytelling grid → Instagram / newsletter / relevant cluster page
```

**Implementation implications:**

- **Navigation** must expose entry points for routes 1, 3, 4 (Quiz, Kostenlos/Masterclass, Coaching). Routes 2, 5, 6 are reached via content, not nav.
- **Homepage** must prominently expose Quiz (Route 1) and Masterclass/Kostenlos (Route 3) as visible CTAs. Routes 2 and 6 are integrated as sections (blog preview, social storytelling). Route 4 (Coaching → Calendly) should be accessible via the Coaching navigation path, but Calendly should NOT appear as a prominent homepage CTA — homepage Calendly placement undermines the coaching-only / complex-case-only filtering this architecture enforces elsewhere.
- **Analytics events** must tag the route source so the dashboard can show which routes generate revenue (e.g. `route: 'quiz-cold'` vs `route: 'masterclass-warm'`).
- **Email sequences** branch per entry route — a Route 1 quiz signup gets different nurture than a Route 3 masterclass signup, even if both end with the same product pitch.

---

### 4.7 Social Storytelling / Instagram Showcase [NEW in v1.2]

A site-wide component that adds human storytelling and trust-building without dragging in live third-party embeds.

**Purpose:**
- Add human storytelling and personality
- Show the expert's active social presence without privacy/performance cost
- Build trust before the newsletter and footer
- Link to selected Instagram posts/reels — but as curated cards, not as a live embed

**Why curated cards, not live embed:**

Live Instagram embeds hurt page performance, introduce third-party tracking (GDPR friction in DE/EU), and give zero visual control. A curated grid of card-shaped links to specific Instagram posts achieves the same trust signal at a fraction of the cost.

**Component:** `<SocialStorytellingGrid />` or `<InstagramShowcase />`

**Config example:**

```yaml
# In src/data/site.ts or a dedicated content collection entry
socialShowcase:
  enabled: true
  platform: instagram
  title: "Mehr doc.veri im Alltag"
  subtitle: "Kurze Impulse zu Hormonen, Training und Ernährung — direkt aus Verenas Alltag."
  ctaLabel: "Auf Instagram folgen"
  ctaUrl: "https://instagram.com/doc.veri"
  posts:
    - title: "Warum Histamin vor der Periode schlimmer wird"
      image: "instagram/histamin-reel.webp"
      url: "https://instagram.com/..."
      type: "Reel"
    - title: "Trainierst du gegen deinen Zyklus?"
      image: "instagram/training-cycle.webp"
      url: "https://instagram.com/..."
      type: "Post"
    # ... 4 more posts recommended
```

**Recommended post mix (6 posts total):**
- 2 expert posts (educational, demonstrate authority)
- 2 relatable/story posts (everyday moments, build connection)
- 1 behind-the-scenes post (humanity, transparency)
- 1 product / lead-magnet post (soft commercial)

**Placement on homepage:**

Recommended:
```
... → Social storytelling section → Newsletter → Footer
```

Alternative accepted:
```
... → Newsletter → Social storytelling section → Footer
```

**Anti-pattern:** calling this a real Instagram embed if it isn't. The component must clearly link out, not pretend to be Instagram itself. Honesty avoids GDPR claims about embedded third-party content and protects user trust.

---

## 5. Conversion Copy Architecture [NEW in v1.2]

Cluster architecture controls the graph. Conversion copy controls whether the graph actually sells. This section defines the persuasion structure every commercial or hybrid page must follow, regardless of cluster.

### 5.1 Persuasion sequence

Every commercial or hybrid page must follow this sequence:

```
Recognition → Problem → Failed Solutions → Expert Mechanism → Method → Offer → Proof → CTA
```

This applies especially to:
- Product pages (full and hybrid sales-SEO)
- Masterclass pages
- Lead magnet landing pages
- Coaching pages
- Quiz archetype result pages
- Homepage offer sections

Authority pages (about, glossary, FAQ-mega) do not need this sequence — they have different jobs.

### 5.2 Above-the-fold rule

Every commercial page must hit four elements above the fold (within the first viewport on desktop, first scroll on mobile):

1. **Hook** — a specific recognizable tension, problem or desire
2. **Value proposition** — what the visitor gets, understands or can do after the next step
3. **Credibility** — why this expert can be trusted
4. **CTA** — the next logical action

Do not open commercial pages with abstract category language only.

**Bad:**
> "Evidence-based women's health for hormones and nutrition."

**Better:**
> "You eat well, train regularly and still feel like your body is working against you? doc.veri helps you understand how hormones, cycle, stress and nutrition interact — medically grounded, practical and without Bro-Science."

### 5.3 Relatability rule

Every commercial or hybrid page must include a recognition section near the top — using concrete lived situations, not abstract problem labels.

**Bad:**
> "You struggle with hormone balance."

**Better:**
> "You sleep worse before your period, react more strongly to certain foods, feel puffy or wired, and wonder why your body suddenly feels unpredictable."

The visitor should feel: *"This describes me."*

### 5.4 Failed solutions rule

Every product, masterclass and coaching page must explain what the ICP has likely already tried and why it didn't fully work. This section creates the need for the expert mechanism.

Common failed-solution categories:
- More discipline
- Generic meal plans
- Random supplements
- Strict food lists
- Training harder
- Copying advice made for men or generic bodies
- Treating symptoms one by one

### 5.5 Expert mechanism rule

Every commercial page needs a clear mechanism: the deeper explanation for why the problem keeps happening.

**Formula:**
> "Most people think the problem is **[surface explanation]**. But in many cases, **[deeper mechanism]** is involved. That is why **[expert method/product]** focuses on **[pillars]**."

The mechanism must connect directly to the product or next step. Without a mechanism, the offer feels like just another generic solution.

### 5.6 Product as logical next step

Products should not appear as random offers. Each product must be introduced as the practical next step after the explanation.

**Formula:**
> "If you recognize **[problem]** and want **[desired next step]**, **[product]** helps you **[specific outcome]** without **[common frustration]**."

### 5.7 Expert story rule

Expert pages and commercial pages must include more than credentials. Every expert story block should answer:

- Why does this expert care about this problem?
- What did they notice that generic advice misses?
- What repeated pattern did they see in clients/patients/students?
- What is their unique point of view?
- Why should the visitor stop blaming themselves?

**Credentials create trust. Story creates connection. Point of view creates differentiation.**

A page with only credentials reads as competent but generic. A page with story + point of view reads as someone the visitor wants to learn from.

### 5.8 Proof rule

Testimonials and proof should be selected for **recognition**, not only praise.

Strong proof includes:
- Before-state ("I had tried X, Y, Z without results")
- What the person had already tried
- What changed
- Why this method felt different
- Specific language from the ICP

Weak proof:
> "Great course, learned a lot!"

Strong proof:
> "Nach 2 Jahren Lebensmittellisten und Antihistaminika dachte ich, ich müsste damit leben. In den ersten 3 Wochen mit dem Bundle habe ich verstanden, warum meine Symptome zyklisch sind — und endlich gezielt etwas verändern können."

Featured testimonials on commercial pages should match the ICP being targeted on that page.

### 5.9 CTA temperature rule

Every CTA must match funnel temperature.

| Visitor temperature | Appropriate primary CTA |
|---|---|
| Cold (just landed, no signals) | Quiz, free guide, masterclass |
| Warm (engaged with content, returning) | Product, bundle, membership |
| Hot / complex (high intent, complex needs) | Calendly, coaching |

Do not use Calendly as the primary CTA on cold educational pages unless the cluster's `calendlyContext` or a segment override explicitly allows it. See §4.4.

### 5.10 How conversion copy interacts with cluster architecture

The cluster owns:
- Which product is the bridge target
- Which lead magnet surfaces
- Which crossClusters connect with which copy
- Which segment routes apply
- Which calendlyContext is in effect

Conversion copy owns:
- How each section is written
- The hook, mechanism, proof selection
- The story Verena tells about this product/cluster
- The objections she addresses

The architecture **enables** good conversion copy; it does not write it. Verena writes copy; the architecture ensures it lands in the right slots with the right routing.

---

## 6. Page type matrix

Every page on the site belongs to one of these types. Each type has fixed schema stack, fixed conversion behavior, and fixed cluster relationship.

| Page type | Cluster behavior | Schema stack | Primary CTA | AI citation slots |
|---|---|---|---|---|
| Homepage | Multi-cluster overview | `Organization` + `Person/MedicalProfessional` + `WebSite` (+`FAQPage` if FAQ block present) | Quiz (cold) + Angebot (warm) | Brand definition paragraph + first sentence of key H2 sections |
| About (`/ueber`) | Bound to founder, not cluster | `ProfilePage` + extended `Person` / `MedicalProfessional` | Calendly (bottom only) | Bio first paragraph |
| Hub (`/themen/[hubSlug]`) | One cluster — rendered config | `CollectionPage` + `WebPage` + `FAQPage` + `BreadcrumbList` | Cluster's primary conversion asset (product, masterclass, or lead magnet — depends on cluster config) | citableDefinition + each H2 first sentence |
| Article (`/blog/[slug]`) | Primary cluster | `BlogPosting` + `FAQPage` (if contentSchema) + ExpertPerson @id ref | Bridge to cluster primary product OR primary conversion asset | primaryAnswer + each H2 first sentence + each FAQ first sentence |
| Product (`/produkte/[slug]`) | Primary cluster (hybrid sales-SEO) | `Product` + `Offer` + `FAQPage` + `BreadcrumbList` + ExpertPerson @id ref (as provider/creator) | Plug-and-Pay checkout | What-is-this block + each FAQ first sentence |
| Coaching (`/coaching/[slug]`) | Often cross-cluster | `Service` + `FAQPage` + ExpertPerson @id ref | Calendly | outcomes block first sentence |
| Quiz archetype (`/quiz/typ/[slug]`) | One cluster (1:1) | `WebPage` + `BreadcrumbList` (+ `DefinedTerm` for archetype concept if appropriate) (+ `Product` ref to recommended product) (+ `FAQPage`) | Cluster primary product + Calendly secondary | shortDescription + first H2 |
| Glossary entry (in `/glossar`) | Primary cluster | `DefinedTerm` (within `DefinedTermSet` on parent page) | None / hub link | definition (whole) |
| Lead magnet landing | One cluster | `WebPage` + `Offer` (price: 0) (+ `FAQPage` if present) | Email signup form | "what you'll get" first line |
| Masterclass landing | Primary cluster + secondaries | `WebPage` + `Offer` (price: 0) (+ `VideoObject` after watch start) (+ `FAQPage`) | Email signup form | hook first sentence |
| FAQ mega-page | Site-wide | `FAQPage` (large) + `BreadcrumbList` | None / contextual links | each FAQ first sentence |
| Glossary mega-page | Site-wide | `DefinedTermSet` containing all terms | None | each definition |
| Legal pages | None | None | None | None |
| Dashboard `/sichtbarkeit` | Site-wide internal | None (noindex) | None | None |

---

## 7. Example: Histamin cluster (product-led, fully worked)

Full `clusters/histamin.yaml` was shown in §3.1. Here's what gets generated from it via build-time graph resolution.

### Graph resolution at build time

```
1. Read clusters/histamin.yaml → strategy + curation
2. Scan content/blog/*.md → find all articles with `cluster: histamin` → article list
3. Scan content/glossary/*.md → find all terms with `cluster: histamin` → glossary list
4. Apply featuredArticles ordering + excludeFromHub filter
5. Resolve crossClusters → fetch bridge data
6. Compute related products from primary + secondary + crossSell
7. Inject into all pages declaring `cluster: histamin`
```

### Hub page at `/themen/histamin-und-hormone`

Note the route uses `hubSlug` (`histamin-und-hormone`), not cluster `slug` (`histamin`). The latter is the internal identifier.

Auto-rendered from cluster config:

1. **Hero** — title, citableDefinition, hero image, "Quiz starten" CTA
2. **Hub intro** — optional `hubIntro` block (Verena's voice)
3. **Cluster definition block** — citableDefinition with `DefinedTerm` schema
4. **Article grid** — all articles where `cluster: histamin`, with `featuredArticles` first
5. **Glossary block** — auto-resolved glossary entries, `featuredGlossaryTerms` first
6. **Primary product card** — featured large card from `primaryProduct`
7. **Secondary products** — smaller cards
8. **Cross-cluster bridges** — auto-rendered from `crossClusters` objects with their `bridgeText`
9. **Lead magnet block** — primary lead magnet from yaml with inline email form
10. **Hub FAQ** — from `hubFaq` array (curated, editorial)
11. **Final CTA** — primary product OR coaching (depending on `calendlyContext`)

### Article `/blog/histamin-vor-der-periode`

Layout reads `cluster: histamin` from frontmatter, then resolves cluster yaml. Page renders:

1. Hero + breadcrumbs
2. AuthorByline ("Von Dr. Verena Mann · Notärztin")
3. Article content
4. **Auto-injected bridge** at end:
   > "Wenn du die Zusammenhänge zwischen Histamin, Zyklus und Hormonen in deinem Alltag praktisch umsetzen möchtest, ist das **Histamin Bundle** der nächste Schritt."
5. **Related learning** sidebar:
   - 3 other articles in cluster (excluding current)
   - 1 article from each crossCluster (only those with `showOn` containing `articles`)
   - Glossary terms relevant to article's `secondaryClusters`
6. **Lead magnet block** at scroll 30%: "Hol dir den kostenlosen Guide"
7. Schema: `BlogPosting` + `FAQPage` (from contentSchema) + ExpertPerson @id ref

### Cross-cluster bridges in action

On the article `/blog/histamin-vor-der-periode`, the system reads:

```
Article cluster: histamin
Article secondaryClusters: [zyklus, perimenopause]
Cluster yaml crossClusters: [perimenopause, zyklus, ernaehrung]

Bridge candidates (intersection): perimenopause (priority 1), zyklus (priority 2)
showOn filter: both have `articles` in showOn → both render

Bridge component receives:
[
  { cluster: 'perimenopause', bridgeText: '...', priority: 1 },
  { cluster: 'zyklus', bridgeText: '...', priority: 2 }
]
```

Content gets the precise, editorial bridge copy declared in cluster yaml — not generic "Read more about perimenopause" auto-text.

### Analytics events firing

```js
trackEvent('cluster_pageview', {
  cluster: 'histamin',
  page_type: 'article',
  page_slug: 'histamin-vor-der-periode'
})  // source: client

trackEvent('product_cta_click', {
  cluster: 'histamin',
  product: 'histamin-bundle',
  product_type: 'bundle',
  source_page_type: 'article',
  source_page_slug: 'histamin-vor-der-periode',
  source_cluster: 'histamin'
})  // source: client

trackEvent('product_checkout_completed', {
  cluster: 'histamin',
  product: 'histamin-bundle',
  product_type: 'bundle',
  revenue: 67,
  currency: 'EUR'
})  // source: webhook (Plug-and-Pay)
```

Dashboard aggregates by cluster: "Cluster Histamin generated 2,341 pageviews, 187 lead magnet downloads, 23 product CTA clicks, 8 purchases, €536 revenue this week."

---

## 8. Example: Hormone/Zyklus cluster (masterclass-led, cross-cluster)

```yaml
# src/data/clusters/hormone-zyklus.yaml

slug: hormone-zyklus
hubSlug: hormone-und-zyklus
title: "Hormone & Zyklus"
shortTitle: "Hormone"
heroImage: "clusters/hormone-hero.webp"

citableDefinition: >
  Der weibliche Hormonzyklus beeinflusst mehr als Periode und Fruchtbarkeit:
  Energie, Schlaf, Stimmung, Training, Histamin-Toleranz und Stressresistenz
  verändern sich im Laufe eines Zyklus. Wer ihren Zyklus versteht, kann
  Training, Ernährung und Alltag gezielt anpassen — statt gegen den Körper
  zu arbeiten.

hubIntro: >
  Hormone sind keine Black-Box. In diesem Bereich findest du
  evidenzbasiertes Wissen rund um Zyklus, Energie, Training und
  Perimenopause — sowie eine kostenlose Masterclass, die alles
  zusammenführt.

# === CONTENT CURATION ===
featuredArticles:
  - blog/zyklusbasiertes-training-grundlagen
  - blog/luteal-phase-energie

featuredGlossaryTerms:
  - oestrogen
  - progesteron
  - red-s

# === HUB-LEVEL CURATED FAQ ===
hubFaq:
  - question: "Was bedeutet zyklusbewusstes Training?"
    answer: "Zyklusbewusstes Training berücksichtigt, dass sich Energie, Belastbarkeit und Regeneration im Laufe des Zyklus verändern können. Statt jeden Tag gleich zu trainieren, werden Intensität und Volumen an die jeweilige Zyklusphase angepasst."
  - question: "Ab wann beginnt die Perimenopause?"
    answer: "Die Perimenopause kann bereits Mitte 30 beginnen, häufiger zwischen 40 und 45. Sie umfasst die Jahre vor der letzten Periode, in denen sich Hormone schrittweise verändern."

# No 1:1 quiz archetype — this cluster surfaces multiple archetypes
quizArchetype: null
relatedArchetypes:
  - hormone-imbalance
  - cycle-chaos
  - perimenopause-transition

# === COMMERCIAL: MULTI-PATH, MASTERCLASS-LED ===
primaryProduct: null                          # No single product — masterclass routes
secondaryProducts:
  - produkte/cycle-training-guide
  - produkte/perimenopause-protocol
  - produkte/histamin-bundle                  # also reachable via masterclass routing
crossSellProducts: []

# === MASTERCLASS AS PRIMARY CONVERSION ASSET ===
primaryConversionAsset:
  type: masterclass
  slug: hormone-histamin-zyklus-superpower

leadMagnets:
  primary:
    slug: zyklus-tracker
    type: pdf
    title: "Der kostenlose Zyklus-Tracker"
    emailTag: "lead_magnet_zyklus_tracker"

# === CROSS-CLUSTER LINKING (object-based) ===
crossClusters:
  - cluster: histamin
    relationship: "Zyklusabhängige Histamin-Symptome sind ein gemeinsamer Berührungspunkt."
    bridgeText: >
      Wenn deine Symptome eher mit Histamin und seinem zyklusabhängigen Verhalten
      zu tun haben, findest du im Histamin-Bereich vertiefte Inhalte und ein
      konkretes Produkt.
    priority: 1
    showOn: [hub, articles]

  - cluster: perimenopause
    relationship: "Perimenopause ist die hormonelle Übergangsphase nach der reproduktiven Zyklusphase."
    bridgeText: >
      Wenn du in deinen 40ern bist und Veränderungen bemerkst, die über
      normale Zyklusschwankungen hinausgehen, lohnt sich ein Blick auf
      die Perimenopause-Inhalte.
    priority: 2
    showOn: [hub, articles]

  - cluster: training
    relationship: "Training profitiert von Zykluswissen, ist aber ein eigenes Feld."
    bridgeText: >
      Du willst dein Training konkret zyklusbewusst aufbauen? Im Trainings-Bereich
      findest du praktische Pläne und Methodik.
    priority: 3
    showOn: [hub]

calendlyContext: "complex-case-only"
# Masterclass-led cluster: Calendly only surfaces when a segment explicitly
# requests it (e.g. "complex-case" in masterclass postWatchRoutes), never
# as a default CTA on cluster pages.

audience:
  primaryICP: "Women 28–48 wanting to understand and work with their cycle"
  metaPixelEvent: "ViewContent_Hormone"
  emailListTag: "cluster_hormone_zyklus"

analytics:
  primarySuccessEvent: "hormone_masterclass_signup"
  secondarySuccessEvents:
    - "hormone_masterclass_watched"
    - "post_masterclass_product_purchase"
    - "post_masterclass_coaching_booked"
  funnelOrder:
    - "hormone_cluster_pageview"
    - "hormone_masterclass_view"
    - "hormone_masterclass_signup"
    - "hormone_masterclass_watched"
    - "post_masterclass_product_purchase"
```

### What's different about a masterclass-led cluster

- **`primaryProduct: null`** — funnel doesn't push one product. Masterclass educates, then routes per segment.
- **`primaryConversionAsset: masterclass`** — hub layout uses this to feature the masterclass card as primary asset (not a product card).
- **Routing logic** lives in masterclass content frontmatter (`postWatchRoutes`), not in cluster config.
- **Cross-cluster object-based bridges** with editorial copy prevent generic "see also" cards that could be content-wise misleading.

---

## 9. Hub-as-rendered-config pattern

Hubs are rendered from cluster config with optional editorial blocks — they are not manually maintained article pages. The content graph, cards, products, glossary refs, conversion assets are generated automatically from cluster config + content-frontmatter graph resolution. The expert can add narrative sections (`hubIntro`, `hubFaq`) without owning the page structure manually.

### Route + slug mapping

Cluster has two slugs:
- `slug` — internal identifier used in frontmatter refs, analytics tags, build logic
- `hubSlug` — the SEO-rich URL slug for the hub page

The hub route reads `hubSlug`:

```astro
---
// src/pages/themen/[slug].astro
import HubLayout from '@/layouts/HubLayout.astro';
import { getAllClusters, getClusterArticles, getClusterGlossary } from '@/lib/clusters';

export async function getStaticPaths() {
  const clusters = await getAllClusters();
  return clusters.map(c => ({
    params: { slug: c.hubSlug },        // route uses hubSlug, not internal slug
    props: { cluster: c }
  }));
}

const { cluster } = Astro.props;
const articles = await getClusterArticles(cluster.slug);    // resolved by frontmatter cluster:
const glossary = await getClusterGlossary(cluster.slug);
---

<HubLayout cluster={cluster}>
  <HubHero {cluster} />
  {cluster.hubIntro && <HubIntro content={cluster.hubIntro} />}
  <CitableDefinitionBlock definition={cluster.citableDefinition} />

  {cluster.primaryConversionAsset?.type === 'masterclass' && (
    <MasterclassFeaturedCard slug={cluster.primaryConversionAsset.slug} />
  )}

  <ArticleGrid articles={articles} featured={cluster.featuredArticles} />
  <GlossarySection terms={glossary} featured={cluster.featuredGlossaryTerms} />

  {cluster.primaryProduct ? (
    <PrimaryProductCard product={cluster.primaryProduct} />
  ) : (
    <SecondaryProductsGrid products={cluster.secondaryProducts} />
  )}

  <CrossClusterBridges crossClusters={cluster.crossClusters} showOn="hub" />
  <LeadMagnetBlock magnet={cluster.leadMagnets?.primary} />
  <HubFAQ items={cluster.hubFaq} fallbackArticles={articles} />
  <ClusterFinalCTA {cluster} />
</HubLayout>
```

**Benefits:**
- Verena adds a new article with `cluster: histamin` → hub auto-includes it (no edit to cluster yaml needed)
- Cluster yaml edits → all derivative pages update
- New coach client: configure cluster yaml → hub renders
- No drift between "what the hub says" and "what's actually in the cluster"

**Trade-off:** less flexibility for one-off custom hub designs. Optional `customBlocks` array in cluster yaml can be added later if needed (deferred to v2+).

---

## 10. Component sketches

Each component has a single responsibility and receives explicit props — not just cluster slug. Where article/page context is needed, components receive it.

### 10.1 `<BlogToProductBridge cluster article context />`

Rendered at end of every article. Reads cluster config, generates contextual bridge to `primaryProduct` or `primaryConversionAsset`.

```astro
<BlogToProductBridge
  cluster={cluster.slug}
  article={entry}                    /* full article entry — used for topic-aware copy */
  context="article-end"              /* article-end | mid-article | sidebar */
/>
```

If `cluster.primaryProduct` is null (masterclass-led cluster), bridge points to `primaryConversionAsset` instead. Bridge copy can interpolate `entry.data.contentSchema.primaryQuestion` for topic awareness.

### 10.2 `<RelatedLearning cluster secondaryClusters excludeCurrent pageType />`

Auto-rendered sidebar (desktop) or bottom block (mobile).

```astro
<RelatedLearning
  cluster={cluster.slug}
  secondaryClusters={entry.data.secondaryClusters}
  excludeCurrent={entry.slug}
  pageType="article"                /* hub | article | product | archetype */
/>
```

Resolves:
- 3 most recent articles in primary cluster (excluding current)
- 1 article from each `secondaryCluster`
- Glossary terms relevant to primary + secondary clusters

### 10.3 `<CrossClusterBridges crossClusters showOn />`

```astro
<CrossClusterBridges
  crossClusters={cluster.crossClusters}
  showOn="article"                   /* filter — only bridges with this in showOn render */
/>
```

Renders editorial bridge cards using `bridgeText` from cluster yaml, ordered by `priority`.

### 10.4 `<ConversionAssetsBlock cluster pageType pageContext />`

Smart block that decides what to show based on cluster config + page context:
- On article page (cold→warm): shows cluster's primary lead magnet
- On product page: shows lead magnet as soft alt-CTA. Calendly only appears for high-ticket/trajectory pages or explicit segment overrides. Never on micro-products or standard bundles.
- On quiz-result page: shows recommended product + Calendly (if archetype is "complex-case" or cluster's `calendlyContext` allows)
- On masterclass thank-you: shows segment-routed product + Calendly (only for "complex-case" segment unless overridden)

### 10.5 `<MasterclassEmbed slug user />`

Renders masterclass player + signup form OR watch state based on user. Tracks watch progress for `masterclass_watched` event.

### 10.6 `<ClusterFunnelStatus cluster />` (dashboard only)

Dashboard-side component. Shows funnel chart for the cluster using `cluster.analytics.funnelOrder`, with conversion rates between steps.

### 10.7 `<CitableDefinitionBlock definition term />`

Visual emphasis block with semantic markup AI tools can extract cleanly:

```html
<aside class="citable-definition" itemscope itemtype="https://schema.org/DefinedTerm">
  <span itemprop="name">{term}</span>
  <p itemprop="description">{definition}</p>
</aside>
```

### 10.8 `<HubFAQ items fallbackArticles />`

Renders the cluster's curated `hubFaq` array. Falls back to top-3 article `contentSchema.primaryQuestion` items if `hubFaq` is empty. Wraps in `FAQAccordion` h3-in-summary pattern.

### 10.9 `<SocialStorytellingGrid config />` [NEW in v1.2]

Site-wide component for the Instagram showcase / social storytelling section. Reads `socialShowcase` config from `site.ts` (see §4.7 for config schema). Renders a curated grid of cards linking out to specific Instagram posts/reels — NOT a live Instagram embed.

```astro
<SocialStorytellingGrid
  config={siteConfig.socialShowcase}
/>
```

Behavior:
- If `config.enabled === false`, component renders nothing
- Renders `title`, `subtitle`, `posts` grid (6 cards), and final CTA button (`ctaLabel` → `ctaUrl`)
- Each card is a clickable link to the post URL with the cover image, title, and post type badge (Reel / Post)
- Cards open externally (`rel="noopener noreferrer" target="_blank"`)
- Tracks clicks via analytics event `social_card_click` with `platform` and `post_url` props

Visual treatment: Instagram-flavored aesthetic (square crops, type badges) without false implication of being a real Instagram embed. Honest framing avoids GDPR/third-party-content claims that live embeds attract.

---

## 11. Schema generation per page type

Schema stacking matrix — only stack what content actually justifies. The `ExpertPerson` is defined once as a global `@id` node and referenced from every page schema that needs author/expert attribution.

### Global expert node (defined once in `<head>` or in site-wide JSON-LD)

```json
{
  "@type": ["Person", "MedicalProfessional"],
  "@id": "https://docveri.de/#verena",
  "name": "Dr. Verena Mann",
  "jobTitle": "Notärztin",
  "url": "https://docveri.de/ueber",
  "image": "...",
  "sameAs": ["https://www.instagram.com/doc.veri/", "..."],
  "knowsAbout": ["Frauengesundheit", "Hormonbalance", "..."],
  "alumniOf": "..."
}
```

### Per-page schema stacks

| Page type | Required schemas | Optional schemas (only if content matches) | ExpertPerson attribution property |
|---|---|---|---|
| Homepage | `Organization` + `Person` (founder) + `WebSite` | `FAQPage` (if homepage has FAQ block) | `founder` on Organization |
| About | `ProfilePage` + extended `Person` / `MedicalProfessional` | `EducationalOccupationalCredential` array | `mainEntity` of ProfilePage = `@id` ref |
| Hub | `CollectionPage` + `WebPage` + `FAQPage` + `BreadcrumbList` | `DefinedTermSet` (if hub has glossary inline) | `about.creator` = `@id` ref |
| Article | `BlogPosting` + `BreadcrumbList` | `FAQPage` (if `contentSchema` present), `HowTo` (only if article has explicit numbered steps) | `author` = `@id` ref |
| Product | `Product` + `Offer` + `FAQPage` + `BreadcrumbList` | `Review` array if real reviews exist | `provider` or `creator` = `@id` ref |
| Coaching | `Service` + `FAQPage` | `Offer` (price withheld OK), `Review` | `provider` = `@id` ref |
| Quiz archetype | `WebPage` + `BreadcrumbList` | `DefinedTerm` (for archetype concept), `Product` ref to recommended, `FAQPage` | `author` = `@id` ref (if educational explanation) |
| Glossary entry | `DefinedTerm` (parent: `DefinedTermSet`) | none | none (term has no author) |
| Lead magnet landing | `WebPage` + `Offer` (price: 0) | `Course` (if mini-course), `FAQPage` | `creator` on Offer if applicable |
| Masterclass landing | `WebPage` + `Offer` (price: 0) | `Course`, `VideoObject` (after watch start), `FAQPage` | `creator` = `@id` ref |
| FAQ mega-page | `FAQPage` (large) + `BreadcrumbList` | none | none (FAQ-level) |
| Glossary mega-page | `DefinedTermSet` containing all terms | none | none |

**Anti-pattern:** stacking `HowTo` on every article. Only use when article has explicit numbered steps with start/end. Otherwise it's schema spam. Same caution for `Review` — only if real reviews exist.

**Rule:** ExpertPerson @id reference is used only on schema types where it is supported (`author`, `creator`, `provider`, `founder`, `mainEntity`). Do not force it onto schema types where there's no supported property.

---

## 12. Analytics events with cluster context

Every conversion event carries cluster + product + source properties so the dashboard can aggregate by cluster. Events also declare their **tracking source** so we know where the firing logic lives.

### Required event properties

Every conversion event MUST include:
```js
{
  cluster: 'histamin',                    // current page's primary cluster
  page_type: 'article',                   // page type taxonomy
  page_slug: 'histamin-vor-der-periode'
}
```

Conversion events that traverse clusters MUST also include:
```js
{
  source_cluster: 'histamin',
  target_cluster: 'perimenopause',
  source_page_type: 'article'
}
```

Product events MUST include:
```js
{
  product: 'histamin-bundle',
  product_type: 'bundle',
  product_cluster: 'histamin',
  price: 67,
  currency: 'EUR'
}
```

### Core event taxonomy with tracking source

| Event name | Fires when | Required props | Source |
|---|---|---|---|
| `cluster_pageview` | Any page with cluster context loaded | cluster, page_type, page_slug | client |
| `lead_magnet_view` | Lead magnet landing reached | cluster, magnet_slug | client |
| `lead_magnet_signup` | Form submitted | cluster, magnet_slug, email_tag | client (form submit) |
| `masterclass_signup` | Form submitted | masterclass_slug, primary_cluster, source_cluster | client (form submit) |
| `masterclass_watched` | Video reached >75% | masterclass_slug | client |
| `masterclass_segment_assigned` | User self-selects on thank-you page | masterclass_slug, assigned_cluster, segment | thank-you-page |
| `quiz_started` | First answer submitted | — | client |
| `quiz_completed` | Final question answered | archetype, cluster | client |
| `product_cta_click` | Buy button clicked | product, product_type, product_cluster, source_page_type, source_cluster | client |
| `product_checkout_completed` | Plug-and-Pay confirms purchase | product, cluster, revenue | webhook (Plug-and-Pay) |
| `coaching_cta_click` | Calendly button clicked | source_page_type, source_cluster | client |
| `coaching_booked` | Calendly confirms booking | source_cluster | webhook (Calendly) |
| `cross_cluster_link_click` | Cross-cluster bridge clicked | source_cluster, target_cluster | client |
| `social_card_click` | Social storytelling grid card clicked | platform, post_url, source_page_type | client |

### Why source-typing matters

- **Client-side events** fire from page JS. Reliable for pageviews + CTA clicks. Unreliable for purchases (ad blockers, browser closes between click and confirm).
- **Webhook events** fire from third-party server (Plug-and-Pay confirms payment; Calendly confirms booking). These are the source of truth for revenue + bookings.
- **Thank-you-page events** fire when user lands on a confirmation page. Useful for masterclass-segment-assigned and similar self-select flows.
- **Server events** would be from our own backend if/when we have one (none in v1 — static Astro deploy).

The dashboard must combine client + webhook + thank-you sources. Don't assume everything fires from frontend.

---

## 13. AI citation slots per content type

Concrete rules. Not "everything must be AI-optimized" (creates robotic site). Three slots per page where citation extractability is mandatory.

### Universal rule for citable text

A citable sentence:
- Stands alone (no "as we discussed earlier" or "wie oben beschrieben")
- For inline sentences: 15–35 words ideal
- For dedicated definition blocks (citableDefinition, glossary): 25–50 words ideal
- Subject-verb-object structure, no leading subordinate clause
- Includes the topic noun explicitly (not "it" or "this")
- Factual claim, not opinion or marketing copy

If a definition needs more nuance than fits in one sentence, use two short sentences instead of one long sentence. Long German sentences hurt readability and citation.

**Anti-pattern:** "In diesem Artikel sehen wir uns an, wie..." — AI's extract the meta-statement, not the content.

### Per content type

| Content type | Slot 1 | Slot 2 | Slot 3 |
|---|---|---|---|
| Cluster hub | `citableDefinition` | First sentence of each H2 in body | First sentence of each `hubFaq` answer |
| Article | `contentSchema.primaryAnswer` | First sentence of each H2 | First sentence of each FAQ answer (if FAQ exists) |
| Product page | `mechanism` block opening sentence | First sentence of each FAQ answer | "Was ist [topic]" definition (if present) |
| Glossary entry | `definition` (full) | first sentence of `longDescription` if present | — |
| Quiz archetype | `shortDescription` | First sentence of explanation H2 | First sentence of each FAQ answer |
| Masterclass | Hook sentence | "Was du lernst" first bullet | First FAQ answer |

### Implementation note

Citable text rendered with semantic markup AI tools can identify:

```html
<aside class="citable-definition" itemscope itemtype="https://schema.org/DefinedTerm">
  <span itemprop="name">Histamin</span>
  <p itemprop="description">{citableDefinition}</p>
</aside>
```

For FAQ answers, the existing FAQAccordion h3-in-summary pattern already provides this. Just enforce that the first sentence of each answer is citable.

---

## 14. Edge cases & open questions

Logged here, not solved in v1.1. To be addressed before v2 finalizes.

### Open: how does a page handle changing clusters?

If an article gets reassigned from `cluster: histamin` to `cluster: perimenopause`, all bridges, schema, analytics tags change. Implications:
- URLs: probably no change (URL doesn't depend on cluster)
- Email sequences: re-tag manually in mailprovider for affected subscribers
- Historical analytics: events stay tagged with old cluster (acceptable — historical data)

### Open: cross-cluster article — primary cluster choice

What if an article genuinely belongs to two clusters equally? E.g. "Histamin in der Perimenopause" — is it Histamin or Perimenopause primary?

**Rule v1.1:** assign by primary commercial intent. If reader is more likely to buy Histamin Bundle, primary = Histamin. If more likely to buy Perimenopause Protocol, primary = Perimenopause. `secondaryClusters` covers the dual relevance.

### Open: how do micro-products surface across clusters?

A €7,99 micro-product like Glutenfrei could be a checkout bump for multiple products in multiple clusters. Should it have multiple cluster memberships?

**Rule v1.1:** micro-products have ONE primary cluster (Ernährung) but can be referenced from other clusters' product pages via `bumpOffers: [glutenfrei-superpower]` in product frontmatter. Avoids cluster-membership inflation.

### Open: archetype-cluster overlap

What if quiz routes someone to archetype "Stress-Dominant" but that archetype's cluster is "Cortisol" — which doesn't exist yet?

**Rule v1.1:** quiz archetypes can only map to existing clusters. If a new archetype is added, its cluster must exist first. This forces clean cluster design over time.

### Open: hub page customization beyond hubIntro + hubFaq

What if Verena wants a custom block for one specific hub (e.g. add an embedded video at top)? Current pattern is config-driven.

**Rule v1.1:** add optional `customBlocks` array in cluster yaml that hub layout can render at named insertion points. Defer full implementation until first real need arises.

### Open: cluster lifecycle — adding, splitting, merging

Adding a cluster is easy (new yaml + tag content). Splitting one cluster into two (e.g. Hormone splits into Hormone + Zyklus) is harder — every page tagged `cluster: hormone` needs to be re-evaluated.

**Rule v1.1:** clusters are added carefully. Splitting/merging is a manual content migration. Document the impact before it happens.

### Open: video gating + schema

`VideoObject` schema is emitted when masterclass is watched. But if the video is registration-gated, should schema mention it before registration?

**Rule v1.1:** emit `Offer` (price: 0) at all times. Only emit `VideoObject` once user has registered + initiated playback. Avoids misleading schema for cold visitors.

---

## 15. Glossary of architecture terms

| Term | Meaning in this architecture |
|---|---|
| **Cluster** | Topic + audience + commercial goal + content set + measurement target. Defined in one yaml file. The organizing primitive. |
| **Primary cluster** | The single cluster a page belongs to. Determines bridges, schema refs, primary CTA, analytics tags. |
| **Secondary cluster** | Additional clusters a page is relevant to. Surfaces in those hubs but doesn't drive primary CTA. |
| **Cluster slug** | Internal identifier used in frontmatter refs, analytics, build logic. Short, kebab-case. |
| **Hub slug** | SEO-rich URL slug for the hub page. May be longer than cluster slug. |
| **Cross-cluster link** | An intentional, copy-curated link between two cluster hubs. Declared as objects with `relationship`, `bridgeText`, `priority`, `showOn`. |
| **Hub** | The auto-rendered page for a cluster at `/themen/[hubSlug]`. Built from cluster yaml + optional `hubIntro` + `hubFaq`. |
| **Cluster-specific lead magnet** | Lead magnet belonging to one cluster. Email tag = cluster tag. |
| **Cross-cluster masterclass** | Masterclass spanning multiple clusters. Routes per segment after watch. |
| **Micro-product** | Low-friction product (€5–15). Entry purchase or checkout bump. One cluster, referenceable from others. |
| **Citable definition** | 25–50 word standalone definition placed in fixed slots per content type. Designed for AI extraction. |
| **AI citation slot** | One of three fixed positions per page where text must be citable. Outside slots, prose is human. |
| **Conversion asset** | Any tool that captures or converts (quiz, lead magnet, masterclass, calendly route, product). |
| **Source cluster** | The cluster a visitor was on when they triggered an event (e.g. signup from Histamin hub). |
| **Primary cluster (of asset)** | The strategic owner cluster of a cross-cluster asset. |
| **Assigned cluster** | The final commercial cluster a visitor is routed toward after self-selection (post-masterclass). |
| **ExpertPerson** | The global `@id` Person/MedicalProfessional node referenced from every page schema needing expert attribution. |
| **Hub-as-rendered-config** | Pattern where hub pages are templates reading data + optional editorial blocks, not handwritten articles. |
| **Source-of-truth split** | Architectural principle: cluster config owns strategy; content frontmatter owns membership; build utilities resolve the graph. |
| **Conversion route** | One of six site-wide visitor paths (cold/quiz, educational/blog, masterclass, high-intent, micro-product, social). Each path has its own nav surface, CTA logic, and analytics tagging. See §4.6. |
| **Conversion Copy Architecture** | The persuasion structure (Recognition → Problem → Failed Solutions → Mechanism → Method → Offer → Proof → CTA) plus 8 copy rules that every commercial/hybrid page must follow. See §5. |
| **Calendly context** | Per-cluster setting (`off`, `coaching-only`, `high-ticket-only`, `complex-case-only`, `warm-only`, `always`) that controls where Calendly appears. Default for doc.veri: `coaching-only`. See §4.4. |
| **Social storytelling showcase** | Curated grid of Instagram post links (NOT a live embed), placed on homepage between content and footer. See §4.7. |

---

## 16. What this document does NOT decide

- **Component code.** Sketches only in §10. Implementation lives in v2 + Claude Code work.
- **Specific copy for doc.veri.** Verena's content.
- **Mailprovider integration specifics.** Wrapper exists; mapping cluster tags to provider features is implementation.
- **Visual design.** Tailwind tokens, fonts, layout — outside this document.
- **Routes per locale.** Cluster slugs may have per-locale translations — addressed at route-segment level, not cluster level.
- **Quiz scoring logic.** Already specified in source template. This document only specifies archetype → cluster mapping is 1:1.
- **Performance optimization.** Cluster yaml is read at build time; runtime impact is zero.

---

## 17. Next steps after this document

1. **Review v1.2 with Joost.** Particularly §3 (data model), §4 (asset types — including new §4.6 routes, §4.7 social showcase), §5 (Conversion Copy Architecture — new), §11 (schema matrix), §12 (analytics). Adjust where needed.
2. **Component-architecture document.** Detailed sketches of each component in §10, with prop signatures and rendering logic.
3. **`EXPERT_BRAND_TEMPLATE_BRIEFING_V2.md`.** Full template briefing incorporating cluster architecture, hybrid product pages, blog-to-product bridges, internal linking rules.
4. **doc.veri reference implementation: Histamin cluster, vertical slice.**
   - One cluster yaml (Histamin)
   - One hub page (auto-rendered from cluster yaml + featured articles + featured glossary + hubFaq)
   - One product page (hybrid)
   - Two articles (with `cluster: histamin` in frontmatter)
   - Three glossary entries
   - One quiz archetype
   - One lead magnet
   - Full analytics events firing (client + webhook configured)
   - Schema validating
5. **Once Histamin works end-to-end, replicate pattern for Hormone-Zyklus cluster** (with masterclass as primary asset — different routing).
6. **Then v2 of the entire site** can roll out cluster-by-cluster without rebuilding the architecture.

---

**End of v1.2.**

This document is the spine. Components, briefing v2, and implementation derive from it. The source-of-truth split (v1.1) remains the most consequential architectural principle — treat it as a hard rule. The conversion-copy architecture (v1.2 §5) is the most consequential commercial principle — it determines whether the graph actually sells.
