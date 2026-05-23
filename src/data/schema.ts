import { siteConfig } from './site';

const founderUrl = `${siteConfig.url}/over#${siteConfig.founder.slug}`;
const orgId = `${siteConfig.url}#org`;

function baseSameAs(): string[] {
  return Object.values(siteConfig.socials).filter((url): url is string => Boolean(url));
}

export function generateFounderPerson() {
  const { founder } = siteConfig;
  const fullImage = founder.image
    ? (founder.image.startsWith('http') ? founder.image : `${siteConfig.url}${founder.image}`)
    : undefined;

  // Persoonlijke social profiles (niet bedrijfspagina's)
  const personalSameAs = [
    siteConfig.socials.linkedin,
    siteConfig.socials.instagram,
  ].filter(Boolean);

  // Credentials uit site config
  const hasCredential = founder.credentials.map(c => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.name,
    credentialCategory: 'Professional Certification',
    recognizedBy: { '@type': 'Organization', name: c.issuer },
    dateCreated: String(c.year),
  }));

  const alumniOf = founder.education.map(e => ({
    '@type': 'EducationalOrganization',
    name: e.institution,
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': founderUrl,
    name: founder.name,
    url: founderUrl,
    jobTitle: founder.role,
    description: founder.description,
    worksFor: { '@id': orgId },
    ...(founder.languages.length > 0 && { knowsLanguage: [...founder.languages] }),
    ...(founder.knowsAbout.length > 0 && { knowsAbout: [...founder.knowsAbout] }),
    ...(fullImage && { image: fullImage }),
    ...(personalSameAs.length > 0 && { sameAs: personalSameAs }),
    ...(hasCredential.length > 0 && { hasCredential }),
    ...(alumniOf.length > 0 && { alumniOf }),
  });
}

export function generateOrganization() {
  const sameAs = baseSameAs();
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: siteConfig.url,
    founder: { '@id': founderUrl },
    ...(sameAs.length > 0 && { sameAs }),
  });
}

export function generateWebSite(locale: string = 'nl') {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: locale,
    dateModified: new Date().toISOString().split('T')[0],
  });
}

export function generateBreadcrumbs(items: Array<{ name: string; url: string }>) {
  const allItems = [
    { name: 'Home', url: '/' },
    ...items,
  ];
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  });
}

export function generateFAQPage(faqs: Array<{ question: string; answer: string }>) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

export function generateService(service: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: `${siteConfig.url}${service.url}`,
    provider: { '@id': orgId },
    ...(service.serviceType && { serviceType: service.serviceType }),
    areaServed: {
      '@type': 'City',
      name: siteConfig.contact.address.city,
    },
  });
}

export function generateArticle(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    inLanguage: 'nl',
    mainEntityOfPage: { '@type': 'WebPage', '@id': article.url },
    author: { '@id': founderUrl },
    publisher: { '@id': orgId },
    ...(article.image && {
      image: article.image.startsWith('http') ? article.image : `${siteConfig.url}${article.image}`,
    }),
  });
}

export function generateProfilePage() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: { '@id': founderUrl },
  });
}

export function generateLocalBusiness() {
  const sameAs = baseSameAs();
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': orgId,
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    image: `${siteConfig.url}/images/marielle-portrait.jpg`,
    logo: `${siteConfig.url}/images/og-default.jpg`,
    priceRange: '€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: siteConfig.contact.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.4872,
      longitude: 5.1386,
    },
    hasMap: 'https://www.google.com/maps?q=Hakvoortseweg+12,+Hilvarenbeek',
    areaServed: {
      '@type': 'City',
      name: siteConfig.contact.address.city,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Monday',
        opens: '09:00',
        closes: '10:15',
      },
    ],
    founder: { '@id': founderUrl },
    dateModified: new Date().toISOString().split('T')[0],
    ...(sameAs.length > 0 && { sameAs }),
  });
}

export function generateAggregateRating(reviews: Array<{ rating: number }>) {
  if (reviews.length === 0) return '';
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': orgId,
    name: siteConfig.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: reviews.length,
    },
  });
}

export function generateReviewSnippets(reviews: Array<{ name: string; text: string; rating: number }>) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': orgId,
    name: siteConfig.name,
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewBody: r.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
      },
    })),
  });
}

export function generateProduct(product: {
  name: string;
  description: string;
  url: string;
  price: string;
  image?: string;
}) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: `${siteConfig.url}${product.url}`,
    brand: { '@id': orgId },
    ...(product.image && {
      image: product.image.startsWith('http') ? product.image : `${siteConfig.url}${product.image}`,
    }),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: { '@id': orgId },
    },
  });
}

export function generateEvent(event: {
  name: string;
  description: string;
  url: string;
  eventAttendanceMode?: string;
}) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    name: event.name,
    description: event.description,
    url: `${siteConfig.url}${event.url}`,
    organizer: { '@id': orgId },
    performer: { '@id': founderUrl },
    eventAttendanceMode: event.eventAttendanceMode ?? 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    isAccessibleForFree: true,
    inLanguage: 'nl',
    location: {
      '@type': 'VirtualLocation',
      url: `${siteConfig.url}${event.url}`,
    },
  });
}
