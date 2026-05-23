export const ui = {
  nl: {
    'nav.home': 'Home',
    'nav.over': 'Over',
    'nav.contact': 'Contact',

    'cta.contact': 'Neem contact op',
    'cta.learnMore': 'Meer lezen',
    'cta.subscribe': 'Aanmelden',

    'testimonial.heading': 'Wat klanten zeggen',
    'faq.heading': 'Veelgestelde vragen',

    'newsletter.heading': 'Nieuwsbrief',
    'newsletter.subtitle': 'Blijf op de hoogte van het laatste nieuws.',
    'newsletter.placeholder': 'Je e-mailadres',
    'newsletter.button': 'Aanmelden',
    'newsletter.success': 'Welkom! Check je inbox.',
    'newsletter.sending': 'Even geduld…',
    'newsletter.error': 'Er ging iets mis. Probeer het opnieuw.',

    'general.readMore': 'Lees meer',
    'general.close': 'Sluiten',
    'general.menu': 'Menu',
    'general.skipToContent': 'Ga naar inhoud',

    'footer.rights': 'Alle rechten voorbehouden',
    'footer.privacy': 'Privacy',
    'footer.voorwaarden': 'Voorwaarden',

    'breadcrumb.home': 'Home',
  },
} as const;

export type UIKey = keyof typeof ui.nl;
