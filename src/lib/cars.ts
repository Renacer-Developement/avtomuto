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
  /** Сума знижки в $, розпарсена з текстового поля "znizka" в Hygraph */
  discountUsd?: number;
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
  znizka?: string;
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
  znizka
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

// "znizka" — текстове поле в Hygraph (не Int), тому може містити пробіли, "$" тощо —
// беремо лише цифри. Порожнє значення чи 0 означає "знижки немає".
function parseDiscount(raw?: string): number | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return undefined;
  const n = Number(digits);
  return n > 0 ? n : undefined;
}

function mapCar(c: HygraphCarListing): CarListing {
  return {
    id: c.id,
    slug: c.slug || c.id,
    name: c.name,
    model: c.model,
    year: c.year,
    status: c.status ?? 'available',
    priceUsd: c.priceUsd,
    discountUsd: parseDiscount(c.znizka),
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
// Hygraph без явного "first" повертає лише перші 100 записів — з більшою кількістю
// авто в CMS частина каталогу мовчки зникала зі списку. Тому вичитуємо сторінками,
// поки чергова сторінка не виявиться коротшою за PAGE_SIZE.
const PAGE_SIZE = 100;

async function fetchAllCarListings(): Promise<HygraphCarListing[]> {
  const all: HygraphCarListing[] = [];
  let skip = 0;

  while (true) {
    const data = await hygraphFetch<{ carListings: HygraphCarListing[] }>(
      `
        query CarListings($first: Int!, $skip: Int!) {
          carListings(orderBy: createdAt_DESC, first: $first, skip: $skip) {
            ${CAR_FIELDS}
          }
        }
      `,
      { first: PAGE_SIZE, skip }
    );

    if (!data?.carListings) return skip === 0 ? [] : all;
    all.push(...data.carListings);
    if (data.carListings.length < PAGE_SIZE) break;
    skip += PAGE_SIZE;
  }

  return all;
}

export async function getCarListings(): Promise<CarListing[]> {
  const cars = (await fetchAllCarListings()).map(mapCar);
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

/** Ціна авто з урахуванням знижки (не менше 0). Без знижки — просто priceUsd. */
export function finalPriceUsd(car: Pick<CarListing, 'priceUsd' | 'discountUsd'>): number | undefined {
  if (car.priceUsd == null) return undefined;
  if (!car.discountUsd) return car.priceUsd;
  return Math.max(car.priceUsd - car.discountUsd, 0);
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
  const finalPrice = finalPriceUsd(car);
  const price = finalPrice ? ` — $${finalPrice.toLocaleString('uk-UA')}` : '';
  return `${carTitle(car)}${price}. ${specs ? `${specs}. ` : ''}Перевірене авто в наявності, AvtoMuto, с. Рудники.`;
}
