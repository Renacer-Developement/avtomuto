import { hygraphFetch } from './hygraph';

export type CarStatus = 'available' | 'in_transit' | 'on_order' | 'sold';

export const CAR_STATUS_LABELS: Record<CarStatus, string> = {
  available: 'В наявності',
  in_transit: 'В дорозі',
  on_order: 'Під замовлення',
  sold: 'Продано',
};

export interface CarListing {
  id: string;
  /** Слаг для URL сторінки авто; якщо в Hygraph не заповнений — код падає назад на id */
  slug: string;
  name: string; // марка, напр. "Opel"
  model: string; // модель, напр. "Astra"
  year?: number;
  status: CarStatus;
  priceUsd?: number;
  mileageKm?: number;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  bodyType?: string;
  engineVolume?: string;
  color?: string;
  vin?: string;
  features: string[];
  description: string;
  /** URL фото з Hygraph Asset Picker (не локальні файли, тому рендеряться як звичайні <img>) */
  photoUrls: string[];
}

interface HygraphCarListing {
  id: string;
  slug?: string;
  name: string;
  model: string;
  year?: number;
  status?: CarStatus;
  priceUsd?: number;
  mileageKm?: number;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  bodyType?: string;
  engineVolume?: string;
  color?: string;
  vin?: string;
  features?: string[];
  description: string;
  photo: { url: string }[];
}

// "status" в Hygraph має API ID "car_Status" (не "status"), а "transmission" — "transmmisiion"
// (одруківка в схемі) — тому аліаси нижче. "color" — звичайний текст (напр. "Сірий"), не Color-поле.
const CAR_FIELDS = `
  id
  slug
  name
  model
  year
  status: car_Status
  priceUsd
  mileageKm
  fuelType
  transmission: transmmisiion
  driveType
  bodyType
  engineVolume
  color
  vin
  features
  description
  photo(first: 50) { url }
`;

// fuelType, transmission і driveType — enum-поля в Hygraph з внутрішніми (не українськими) значеннями.
const FUEL_TYPE_LABELS: Record<string, string> = {
  benzin: 'Бензин',
  dizel: 'Дизель',
  electric: 'Електро',
  hybrid: 'Гібрид',
};

const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: 'Автоматична',
  mechanic: 'Механічна',
};

const DRIVE_TYPE_LABELS: Record<string, string> = {
  front: 'Передній',
  end: 'Задній',
  full: 'Повний',
};

function mapCar(c: HygraphCarListing): CarListing {
  return {
    id: c.id,
    slug: c.slug || c.id,
    name: c.name,
    model: c.model,
    year: c.year,
    status: c.status ?? 'available',
    priceUsd: c.priceUsd,
    mileageKm: c.mileageKm,
    fuelType: c.fuelType ? (FUEL_TYPE_LABELS[c.fuelType] ?? c.fuelType) : undefined,
    transmission: c.transmission ? (TRANSMISSION_LABELS[c.transmission] ?? c.transmission) : undefined,
    driveType: c.driveType ? (DRIVE_TYPE_LABELS[c.driveType] ?? c.driveType) : undefined,
    bodyType: c.bodyType,
    engineVolume: c.engineVolume,
    color: c.color,
    vin: c.vin?.toUpperCase(),
    features: (c.features ?? []).map((f) => f.trim()).filter(Boolean),
    description: c.description,
    photoUrls: (c.photo ?? []).map((p) => p.url),
  };
}

/**
 * Авто в наявності підвантажуються з Hygraph (модель CarListing), коли налаштовано
 * HYGRAPH_ENDPOINT. Поки CMS не підключено, каталог порожній, чи в схемі ще немає
 * потрібних полів — сторінка показує порожній стан із закликом зателефонувати
 * відповідальному майстру (запит просто повертає null, помилка йде у консоль сервера).
 */
export async function getCarListings(): Promise<CarListing[]> {
  const data = await hygraphFetch<{ carListings: HygraphCarListing[] }>(`
    query CarListings {
      carListings(orderBy: createdAt_DESC) {
        ${CAR_FIELDS}
      }
    }
  `);

  if (!data?.carListings) return [];
  const cars = data.carListings.map(mapCar);
  // Продані авто лишаються в загальному списку для соціального доказу, але завжди в кінці —
  // стабільне сортування зберігає порядок createdAt_DESC для решти.
  return cars.sort((a, b) => Number(a.status === 'sold') - Number(b.status === 'sold'));
}

export async function getCarBySlug(slugOrId: string): Promise<CarListing | undefined> {
  const cars = await getCarListings();
  return cars.find((c) => c.slug === slugOrId || c.id === slugOrId);
}

export function carTitle(car: Pick<CarListing, 'name' | 'model' | 'year'>): string {
  return car.year ? `${car.name} ${car.model}, ${car.year}` : `${car.name} ${car.model}`;
}

/** ЧПУ-слаг марки авто для сторінок /poslugy/prodaz-auto/marka/[brand] */
export function brandSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Meta description для сторінки авто — навмисно НЕ бере car.description напряму:
 * це вільний текст з Hygraph, який пишуть менеджери під час внесення авто, і він може бути
 * будь-якої довжини (до кількох сотень символів), без урахування ліміту сніпета Google.
 */
export function carMetaDescription(car: CarListing): string {
  const specs = [
    car.mileageKm != null ? `${car.mileageKm.toLocaleString('uk-UA')} км` : null,
    car.fuelType,
    car.transmission,
  ]
    .filter(Boolean)
    .join(', ');
  const price = car.priceUsd ? ` — $${car.priceUsd.toLocaleString('uk-UA')}` : '';
  return `${carTitle(car)}${price}. ${specs ? `${specs}. ` : ''}Перевірене авто в наявності, AvtoMuto, с. Рудники.`;
}
