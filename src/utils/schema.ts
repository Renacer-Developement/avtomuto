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

interface ServiceSchemaOptions {
  /** Перелік населених пунктів замість одного рядка areaServed (напр. села евакуатора). */
  areaServedList?: string[];
  /** Послуга доступна цілодобово (евакуатор) — додає hoursAvailable 24/7. */
  allDay?: boolean;
}

export function serviceSchema(service: Service, path: string, options: ServiceSchemaOptions = {}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    name: service.title,
    description: service.description,
    // Organization повністю описана лише на головній, тому тут дублюємо ключові поля
    // провайдера — щоб сторінка послуги була самодостатньою для валідаторів і Google.
    provider: {
      '@type': 'AutomotiveBusiness',
      '@id': `${SITE.domain}/#organization`,
      name: SITE.name,
      alternateName: SITE.brandVariants,
      url: SITE.domain,
      telephone: TEAM[service.responsible].phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE.address.settlement.replace('с. ', ''),
        addressRegion: SITE.address.region,
        addressCountry: 'UA',
      },
    },
    url: `${SITE.domain}${path}`,
    areaServed: options.areaServedList
      ? options.areaServedList.map((name) => ({ '@type': 'Place', name }))
      : (service.areaServed ?? SITE.address.region),
  };
  if (options.allDay) {
    schema.hoursAvailable = {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    };
  }
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

/** Каталог авто як ItemList: посилання на сторінки конкретних авто (там — повна Vehicle-розмітка). */
export function carItemListSchema(cars: CarListing[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Авто в наявності — AvtoMuto',
    numberOfItems: cars.length,
    itemListElement: cars.map((car, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: carTitle(car),
      url: `${SITE.domain}/poslugy/prodaz-auto/${car.slug}`,
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
          seller: { '@id': `${SITE.domain}/#organization` },
          areaServed: ['Рудники', 'Львів', 'Стрий', 'Дрогобич', 'Миколаїв', 'Городок', 'Львівська область'],
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
