const ga4Id = import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? '';
const gscId = import.meta.env.PUBLIC_GSC_VERIFICATION_ID ?? '';
const metaPixelId = import.meta.env.PUBLIC_META_PIXEL_ID ?? '';
const emailProvider = import.meta.env.PUBLIC_EMAIL_PROVIDER ?? 'placeholder';

export const siteConfig = {
  // ============================================
  // KLANT-SPECIFIEK — VERANDER DEZE WAARDEN
  // ============================================
  name: 'Yogapracht',
  shortName: 'Yogapracht',
  tagline: 'Dé plek voor jouw yoga',
  url: 'https://www.yogapracht.com',
  defaultLocale: 'nl' as const,
  locales: ['nl'] as const,
  languageSwitcherEnabled: false,

  founder: {
    slug: 'marielle',
    name: 'Mariëlle van der Geest',
    role: 'Eigenaresse & Yogadocent',
    bio: 'Gediplomeerd hatha-rajayoga docent die vanuit plezier, vrijheid en intuïtie yoga deelt.',
    description: 'Mariëlle beoefent sinds 2011 hatha-rajayoga gebaseerd op de wetenschap van Patanjali. Vanuit haar diepste kern volgde zij de yogadocentopleiding bij opleidingsinstituut de Blikopener. Haar verwondering over de pracht van yoga drijft haar om zich hierin continu te verdiepen.',
    qualifications: [
      'Hatha en Raja yogadocentopleiding (2016–2020)',
      'Yoga en zwangeren (2021)',
      'Yoga met (chronische) pijn (2022)',
      'Stoelyoga (2023)',
      'Yoga en preventie van overprikkeling (2023)',
      'Do-In yoga, psoas en Oosterse geneeswijzen (2025)',
      'Yoga bij depressie (2025)',
    ],
    credentials: [
      { name: 'Hatha en Raja yogadocentopleiding', issuer: 'De Blikopener', year: 2020 },
      { name: 'Hatha en Raja yogadocent vervolgopleiding', issuer: 'De Blikopener', year: 2021 },
    ],
    education: [
      { institution: 'Opleidingsinstituut de Blikopener', degree: 'Hatha en Raja Yogadocent', year: 2020 },
    ],
    languages: ['Nederlands', 'Engels'],
    memberships: [] as string[],
    publications: [] as string[],
    knowsAbout: [
      'Hatha-rajayoga',
      'Stoelyoga',
      'Bedrijfsyoga',
      'Yoga bij chronische pijn',
      'Yoga bij depressie',
      'Ademhalingsoefeningen',
      'Meditatie',
      'Yoga en zwangerschap',
    ],
    image: '/images/marielle-portrait.jpg',
  },

  contact: {
    email: 'marielle@yogapracht.com',
    phone: '06-41024532',
    address: {
      street: 'Hakvoortseweg 12',
      city: 'Hilvarenbeek',
      postalCode: '5081 HA',
      country: 'NL',
    },
  },

  analytics: {
    ga4MeasurementId: ga4Id,
    gscVerificationId: gscId,
    metaPixelId,
    plausible: '',
    gtm: '',
  },

  socials: {
    instagram: 'https://www.instagram.com/yogapracht',
    facebook: 'https://www.facebook.com/Yogapracht',
    linkedin: 'https://www.linkedin.com/company/yogapracht',
    youtube: '',
  },

  newsletter: {
    provider: emailProvider as 'placeholder' | 'mailerlite' | 'kit',
    formId: '',
  },

  legal: {
    businessName: 'Yogapracht',
    responsiblePerson: 'Mariëlle van der Geest',
    street: 'Hakvoortseweg 12',
    postalCode: '5081 HA',
    city: 'Hilvarenbeek',
    country: 'Nederland',
    registerNumber: 'KVK 89658477',
    taxId: 'NL004751215B36',
    email: 'marielle@yogapracht.com',
    phone: '06-41024532',
  },

  // ============================================
  // TEMPLATE DEFAULTS — NORMAAL NIET AANPASSEN
  // ============================================
  locale: 'nl',
  currency: 'EUR',
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
