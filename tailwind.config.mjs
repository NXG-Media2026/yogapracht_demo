/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // === KLANT-SPECIFIEK — VERANDER DEZE KLEUREN ===
        primary: {
          DEFAULT: '#51315E',       // Hoofdkleur (diep paars)
          dark: '#3D2447',          // Hoofdkleur donkerder (hover/footer)
          light: '#C185B9',         // Hoofdkleur lichter (lavendel)
        },
        accent: {
          DEFAULT: '#428065',       // Accentkleur (salie groen)
          dark: '#356851',          // Accentkleur donkerder
          light: '#A0BE9B',         // Accentkleur lichter (zacht groen)
        },
        bg: {
          DEFAULT: '#FDF8F4',       // Achtergrondkleur (warm crème)
          alt: '#F9F1EA',           // Alternatieve achtergrond
          white: '#FFFFFF',
        },
        // === TEMPLATE DEFAULTS — NORMAAL NIET AANPASSEN ===
        text: {
          DEFAULT: '#212121',
          muted: '#666666',
          inverse: '#FFFFFF',
        },
        border: '#E8DCD2',
      },
      fontFamily: {
        // === KLANT-SPECIFIEK — VERANDER NAAR KLANT-FONTS ===
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        image: '16px',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.text.muted'),
            '--tw-prose-headings': theme('colors.text.DEFAULT'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.text.DEFAULT'),
            '--tw-prose-bullets': theme('colors.accent.DEFAULT'),
            '--tw-prose-counters': theme('colors.accent.DEFAULT'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.text.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.accent.DEFAULT'),
            maxWidth: 'none',
            lineHeight: '1.8',
            fontSize: '1.0625rem',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationColor: 'rgba(81, 49, 94, 0.3)',
              transition: 'text-decoration-color 200ms',
              '&:hover': {
                textDecorationColor: theme('colors.primary.dark'),
              },
            },
            h2: {
              fontFamily: theme('fontFamily.heading').join(', '),
              fontWeight: '400',
              fontSize: '1.75em',
              marginTop: '2.5em',
              marginBottom: '0.75em',
              lineHeight: '1.3',
            },
            h3: {
              fontFamily: theme('fontFamily.heading').join(', '),
              fontWeight: '400',
              fontSize: '1.375em',
              marginTop: '2em',
              marginBottom: '0.6em',
              lineHeight: '1.35',
            },
            h4: {
              fontFamily: theme('fontFamily.heading').join(', '),
              fontWeight: '500',
              fontSize: '1.125em',
              marginTop: '1.75em',
              marginBottom: '0.5em',
            },
            'ul > li': {
              paddingLeft: '0.25em',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'ol > li': {
              paddingLeft: '0.25em',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            li: {
              lineHeight: '1.7',
            },
            strong: {
              fontWeight: '600',
            },
            hr: {
              marginTop: '2.5em',
              marginBottom: '2.5em',
            },
          },
        },
        lg: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '1.8',
            p: {
              marginTop: '1.35em',
              marginBottom: '1.35em',
            },
            h2: {
              fontSize: '1.875em',
              marginTop: '2.5em',
              marginBottom: '0.8em',
            },
            h3: {
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '0.65em',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
