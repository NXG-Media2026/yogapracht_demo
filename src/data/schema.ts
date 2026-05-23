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
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
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
}) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: { '@id': orgId },
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
