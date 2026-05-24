import { config, fields, collection, singleton } from '@keystatic/core'

// Lokaal werken: kind: 'local'. Keystatic Cloud voor klant: kind: 'cloud'.
// In dev-mode altijd lokaal, in productie (Keystatic Cloud) altijd cloud.
const isLocal = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

export default config({
  storage: {
    kind: isLocal ? 'local' : 'cloud',
  },
  cloud: {
    project: 'yogapracht-demo/yogaprachtdemo',
  },

  collections: {
    blogposts: collection({
      label: 'Blogartikelen',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content', data: 'yaml' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        summary: fields.text({
          label: 'Samenvatting',
          description: 'Korte omschrijving voor zoekresultaten (max 160 tekens)',
          validation: { length: { max: 160 } },
        }),
        publishDate: fields.date({
          label: 'Publicatiedatum',
          defaultValue: { kind: 'today' },
        }),
        coverImage: fields.image({
          label: 'Omslagfoto',
          directory: 'src/assets/images/blog',
          publicPath: '@assets/images/blog/',
        }),
        content: fields.mdx({
          label: 'Inhoud',
        }),
      },
    }),

    faqs: collection({
      label: 'Veelgestelde vragen',
      slugField: 'question',
      path: 'src/content/faqs/*',
      schema: {
        question: fields.slug({
          name: { label: 'Vraag' },
        }),
        answer: fields.text({
          label: 'Antwoord',
          multiline: true,
        }),
        order: fields.integer({
          label: 'Volgorde',
          defaultValue: 0,
          description: 'Lager nummer = hoger op de pagina',
        }),
        page: fields.select({
          label: 'Tonen op pagina',
          options: [
            { label: 'Homepage', value: 'home' },
            { label: 'Over', value: 'about' },
            { label: 'Diensten', value: 'services' },
          ],
          defaultValue: 'home',
        }),
      },
    }),

    testimonials: collection({
      label: 'Klantervaringen',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      schema: {
        name: fields.slug({
          name: { label: 'Naam klant' },
        }),
        role: fields.text({
          label: 'Functie / omschrijving',
          description: 'Bijv: "Yogadocente, Amsterdam"',
        }),
        text: fields.text({
          label: 'Testimonial tekst',
          multiline: true,
        }),
        rating: fields.integer({
          label: 'Sterren (1-5)',
          defaultValue: 5,
          validation: { min: 1, max: 5 },
        }),
      },
    }),

    diensten: collection({
      label: 'Diensten',
      slugField: 'title',
      path: 'src/content/diensten/*',
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        subtitle: fields.text({
          label: 'Korte beschrijving',
          description: 'Wordt getoond op de dienstenkaart op de homepage (1-2 zinnen)',
        }),
        description: fields.text({
          label: 'Volledige beschrijving',
          multiline: true,
          description: 'De hoofdtekst op de dienstenpagina',
        }),
        voorWie: fields.text({
          label: 'Voor wie geschikt',
          multiline: true,
          description: 'Eén doelgroep per regel',
        }),
        praktisch: fields.text({
          label: 'Praktische info',
          multiline: true,
          description: 'Tijden, duur, locatie, groepsgrootte etc.',
        }),
        prijs: fields.text({
          label: 'Prijs',
          description: 'Bijv. "€15 per les" of "Op aanvraag"',
        }),
      },
    }),

    producten: collection({
      label: 'Online producten',
      slugField: 'name',
      path: 'src/content/producten/*',
      schema: {
        name: fields.slug({ name: { label: 'Productnaam' } }),
        price: fields.text({
          label: 'Prijs',
          description: 'Bijv. "27" (alleen het getal, zonder €)',
        }),
        description: fields.text({
          label: 'Korte beschrijving',
          description: 'Wordt getoond in zoekresultaten en op cards',
        }),
        longDescription: fields.text({
          label: 'Uitgebreide beschrijving',
          multiline: true,
          description: 'De volledige tekst op de productpagina',
        }),
        features: fields.text({
          label: 'Wat je krijgt',
          multiline: true,
          description: 'Eén item per regel (bijv. "Videoles van 45 minuten")',
        }),
        ctaText: fields.text({
          label: 'Knoptekst',
          description: 'Tekst op de bestelknop (bijv. "Nu bestellen")',
          defaultValue: 'Nu bestellen',
        }),
      },
    }),
  },

  singletons: {
    contact: singleton({
      label: 'Contactgegevens',
      path: 'src/content/settings/contact',
      schema: {
        businessName: fields.text({ label: 'Bedrijfsnaam' }),
        phone: fields.text({ label: 'Telefoonnummer' }),
        email: fields.text({ label: 'E-mailadres' }),
        address: fields.text({ label: 'Adres', multiline: true }),
        openingHours: fields.text({
          label: 'Openingstijden',
          multiline: true,
          description: 'Eén regel per dag, bijv: "Maandag: 09:00 – 17:00"',
        }),
      },
    }),

    about: singleton({
      label: 'Over ons',
      path: 'src/content/settings/about',
      format: { contentField: 'bio' },
      schema: {
        headline: fields.text({ label: 'Koptekst' }),
        subheadline: fields.text({ label: 'Onderkop' }),
        bio: fields.mdx({ label: 'Biografie' }),
        profileImage: fields.image({
          label: 'Profielfoto',
          directory: 'src/assets/images',
          publicPath: '@assets/images/',
        }),
      },
    }),

    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/settings/homepage',
      schema: {
        heroTitel: fields.text({
          label: 'Hero titel',
          description: 'De grote koptekst bovenaan de homepage',
        }),
        heroSubtekst: fields.text({
          label: 'Hero subtekst',
          multiline: true,
          description: 'Tekst onder de hero titel',
        }),
        heroCtaPrimary: fields.text({
          label: 'Primaire knop (hero)',
          defaultValue: 'Gratis proefles aanvragen',
        }),
        heroCtaSecondary: fields.text({
          label: 'Secundaire knop (hero)',
          defaultValue: 'Bekijk de mogelijkheden',
        }),
        introTitel: fields.text({
          label: 'Intro sectie titel',
        }),
        introTekst: fields.text({
          label: 'Intro sectie tekst',
          multiline: true,
        }),
        ctaBandTitel: fields.text({
          label: 'CTA-band titel',
          description: 'De koptekst in de brede call-to-action band',
        }),
        ctaBandTekst: fields.text({
          label: 'CTA-band tekst',
          multiline: true,
        }),
        ctaBandKnop: fields.text({
          label: 'CTA-band knoptekst',
          defaultValue: 'Gratis proefles aanvragen',
        }),
      },
    }),

    masterclass: singleton({
      label: 'Masterclass',
      path: 'src/content/settings/masterclass',
      schema: {
        title: fields.text({ label: 'Titel' }),
        description: fields.text({
          label: 'Beschrijving',
          multiline: true,
        }),
        forWho: fields.text({
          label: 'Voor wie',
          multiline: true,
          description: 'Eén doelgroep per regel',
        }),
        learningGoals: fields.text({
          label: 'Wat je leert',
          multiline: true,
          description: 'Eén leerdoel per regel',
        }),
        ctaText: fields.text({
          label: 'Aanmeldknop tekst',
          defaultValue: 'Gratis aanmelden',
        }),
      },
    }),
  },
})
