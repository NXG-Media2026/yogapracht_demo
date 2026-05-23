import { config, fields, collection, singleton } from '@keystatic/core'

export default config({
  storage: {
    kind: 'local',
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
  },
})
