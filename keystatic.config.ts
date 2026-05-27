import { config, fields, collection, singleton } from '@keystatic/core'

const isLocal = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

export default config({
  storage: {
    kind: isLocal ? 'local' : 'cloud',
  },
  cloud: {
    project: 'yogapracht-demo/yogaprachtdemo',
  },

  ui: {
    brand: {
      name: 'Yogapracht',
    },
    navigation: {
      'Website': ['homepage', 'about', 'contact', 'masterclass'],
      'Content': ['blogposts', 'testimonials', 'faqs'],
      'Aanbod': ['diensten', 'producten'],
    },
  },

  collections: {
    blogposts: collection({
      label: 'Blogartikelen',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content', data: 'yaml' },
      entryLayout: 'content',
      columns: ['publishDate', 'summary'],
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        summary: fields.text({
          label: 'Samenvatting',
          description: 'Korte tekst die verschijnt in Google-zoekresultaten. Houd het onder 160 tekens.',
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
          description: 'Wordt bovenaan het artikel getoond. Liefst liggend formaat.',
        }),
        content: fields.mdx({
          label: 'Artikel',
        }),
      },
    }),

    testimonials: collection({
      label: 'Klantervaringen',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      columns: ['role', 'rating'],
      schema: {
        name: fields.slug({
          name: { label: 'Naam' },
        }),
        role: fields.text({
          label: 'Omschrijving',
          description: 'Bijv. "Deelneemster groepslessen" of "Stoelyoga deelneemster"',
        }),
        text: fields.text({
          label: 'Review tekst',
          multiline: true,
          description: 'De ervaring van de klant in eigen woorden.',
        }),
        rating: fields.integer({
          label: 'Sterren',
          defaultValue: 5,
          validation: { min: 1, max: 5 },
          description: 'Beoordeling van 1 tot 5 sterren.',
        }),
      },
    }),

    faqs: collection({
      label: 'Veelgestelde vragen',
      slugField: 'question',
      path: 'src/content/faqs/*',
      columns: ['page'],
      schema: {
        question: fields.slug({
          name: { label: 'Vraag' },
        }),
        answer: fields.text({
          label: 'Antwoord',
          multiline: true,
          description: 'Tip: begin NIET met "Ja" of "Nee" — start met een volledige zin.',
        }),
        order: fields.integer({
          label: 'Volgorde',
          defaultValue: 0,
          description: 'Lager nummer = hoger op de pagina.',
        }),
        page: fields.select({
          label: 'Pagina',
          options: [
            { label: 'Homepage', value: 'home' },
            { label: 'Over', value: 'about' },
            { label: 'Diensten', value: 'services' },
          ],
          defaultValue: 'home',
          description: 'Op welke pagina wordt deze vraag getoond?',
        }),
      },
    }),

    diensten: collection({
      label: 'Diensten',
      slugField: 'title',
      path: 'src/content/diensten/*',
      columns: ['prijs'],
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        subtitle: fields.text({
          label: 'Korte beschrijving',
          description: 'Verschijnt op het dienstenkaartje op de homepage (1-2 zinnen).',
        }),
        description: fields.text({
          label: 'Uitgebreide beschrijving',
          multiline: true,
          description: 'De hoofdtekst op de dienstenpagina.',
        }),
        voorWie: fields.text({
          label: 'Voor wie geschikt',
          multiline: true,
          description: 'Eén doelgroep per regel. Bijv. "Mensen met stressklachten".',
        }),
        praktisch: fields.text({
          label: 'Praktische informatie',
          multiline: true,
          description: 'Lestijden, duur, locatie, groepsgrootte, etc.',
        }),
        prijs: fields.text({
          label: 'Prijs',
          description: 'Bijv. "€15 per les" of "Op aanvraag".',
        }),
      },
    }),

    producten: collection({
      label: 'Online producten',
      slugField: 'name',
      path: 'src/content/producten/*',
      columns: ['price'],
      schema: {
        name: fields.slug({ name: { label: 'Productnaam' } }),
        price: fields.text({
          label: 'Prijs',
          description: 'Alleen het getal, zonder €-teken. Bijv. "27".',
        }),
        description: fields.text({
          label: 'Korte beschrijving',
          description: 'Verschijnt in zoekresultaten en op de overzichtspagina.',
        }),
        longDescription: fields.text({
          label: 'Uitgebreide beschrijving',
          multiline: true,
          description: 'De volledige tekst op de productpagina.',
        }),
        features: fields.text({
          label: 'Wat je krijgt',
          multiline: true,
          description: 'Eén item per regel. Bijv. "Videoles van 45 minuten".',
        }),
        ctaText: fields.text({
          label: 'Knoptekst',
          description: 'Tekst op de bestelknop.',
          defaultValue: 'Nu bestellen',
        }),
      },
    }),
  },

  singletons: {
    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/settings/homepage',
      schema: {
        heroTitel: fields.text({
          label: 'Hoofdtitel',
          description: 'De grote tekst bovenaan je homepage.',
        }),
        heroSubtekst: fields.text({
          label: 'Ondertitel',
          multiline: true,
          description: 'Korte tekst direct onder de hoofdtitel.',
        }),
        heroCtaPrimary: fields.text({
          label: 'Knop 1 (groen)',
          defaultValue: 'Gratis proefles aanvragen',
        }),
        heroCtaSecondary: fields.text({
          label: 'Knop 2 (wit)',
          defaultValue: 'Bekijk de mogelijkheden',
        }),
        introTitel: fields.text({
          label: 'Intro-sectie titel',
        }),
        introTekst: fields.text({
          label: 'Intro-sectie tekst',
          multiline: true,
        }),
        ctaBandTitel: fields.text({
          label: 'Oproep-band titel',
          description: 'De koptekst in de brede groene band.',
        }),
        ctaBandTekst: fields.text({
          label: 'Oproep-band tekst',
          multiline: true,
        }),
        ctaBandKnop: fields.text({
          label: 'Oproep-band knoptekst',
          defaultValue: 'Gratis proefles aanvragen',
        }),
      },
    }),

    about: singleton({
      label: 'Over mij',
      path: 'src/content/settings/about',
      format: { contentField: 'bio' },
      schema: {
        headline: fields.text({ label: 'Koptekst' }),
        subheadline: fields.text({ label: 'Onderkop' }),
        bio: fields.mdx({
          label: 'Mijn verhaal',
          description: 'Je persoonlijke biografie. Gebruik koppen (##) om het op te delen.',
        }),
        profileImage: fields.image({
          label: 'Profielfoto',
          directory: 'src/assets/images',
          publicPath: '@assets/images/',
          description: 'Vierkante foto werkt het beste.',
        }),
      },
    }),

    contact: singleton({
      label: 'Contactgegevens',
      path: 'src/content/settings/contact',
      schema: {
        businessName: fields.text({ label: 'Bedrijfsnaam' }),
        phone: fields.text({ label: 'Telefoonnummer' }),
        email: fields.text({ label: 'E-mailadres' }),
        address: fields.text({
          label: 'Adres',
          multiline: true,
          description: 'Straat, postcode en plaats op aparte regels.',
        }),
        openingHours: fields.text({
          label: 'Openingstijden',
          multiline: true,
          description: 'Eén regel per dag, bijv. "Maandag: 09:00 – 17:00".',
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
          description: 'Waar gaat de masterclass over?',
        }),
        forWho: fields.text({
          label: 'Voor wie',
          multiline: true,
          description: 'Eén doelgroep per regel.',
        }),
        learningGoals: fields.text({
          label: 'Wat je leert',
          multiline: true,
          description: 'Eén leerdoel per regel.',
        }),
        ctaText: fields.text({
          label: 'Aanmeldknop tekst',
          defaultValue: 'Gratis aanmelden',
        }),
      },
    }),
  },
})
