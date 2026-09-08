import { SITE, TEAM } from '../data/site';
import type { Service } from '../data/services';
import { carTitle, finalPriceUsd, type CarListing } from '../lib/cars';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${SITE.domain}/#organization`,
    name: SITE.name,
    alternateName: SITE.brandVariants,
    url: SITE.domain,
    description: SITE.description,
    image: `${SITE.domain}/images/og-default.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.settlement,
      addressLocality: SITE.address.settlement.replace('с. ', ''),
      addressRegion: SITE.address.region,
      addressCountry: 'UA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [SITE.social.instagram, SITE.social.tiktok],
    contactPoint: Object.values(TEAM).map((member) => ({
      '@type': 'ContactPoint',
      telephone: member.phone,
      contactType: 'customer service',
      name: member.name,
      areaServed: 'UA',
      availableLanguage: 'Ukrainian',
      contactOption: member.role,
    })),
  };
}

export function serviceSchema(service: Service, path: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    name: service.title,
    description: service.description,
    provider: { '@id': `${SITE.domain}/#organization` },
    url: `${SITE.domain}${path}`,
    areaServed: service.areaServed ?? SITE.address.region,
  };
  return schema;
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${SITE.domain}${item.href}`,
    })),
  };
}

export function vehicleSchema(car: CarListing, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: carTitle(car),
    brand: { '@type': 'Brand', name: car.name },
    model: car.model,
    vehicleModelDate: car.year ? String(car.year) : undefined,
    mileageFromOdometer: car.mileageKm != null ? { '@type': 'QuantitativeValue', value: car.mileageKm, unitCode: 'KMT' } : undefined,
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    vehicleEngine: car.engineVolume ? { '@type': 'EngineSpecification', engineDisplacement: `${car.engineVolume} L` } : undefined,
    vehicleIdentificationNumber: car.vin,
    image: car.photoUrls,
    url: `${SITE.domain}${path}`,
    offers: car.priceUsd
      ? {
          '@type': 'Offer',
          price: finalPriceUsd(car),
          priceCurrency: 'USD',
          availability:
            car.status === 'available'
              ? 'https://schema.org/InStock'
              : car.status === 'sold'
                ? 'https://schema.org/SoldOut'
                : 'https://schema.org/PreOrder',
          itemCondition: 'https://schema.org/UsedCondition',
          url: `${SITE.domain}${path}`,
        }
      : undefined,
  };
}

export function blogPostingSchema(post: { title: string; excerpt: string; date: string }, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@id': `${SITE.domain}/#organization` },
    publisher: { '@id': `${SITE.domain}/#organization` },
    image: `${SITE.domain}/images/og-default.png`,
    mainEntityOfPage: `${SITE.domain}${path}`,
    url: `${SITE.domain}${path}`,
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
