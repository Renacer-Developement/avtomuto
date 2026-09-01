export const SITE = {
  name: 'AvtoMuto',
  legalForm: 'ФОП',
  domain: 'https://avtomuto.com.ua',
  description:
    'AvtoMuto (Авто Мито) — автосервіс повного циклу у с. Рудники (Стрийський район, Львівська область): ремонт авто, автозапчастини, сертифікація, пригон авто, продаж авто, мийка/детейлінг, продаж коліс та евакуатор 24/7.',
  address: {
    region: 'Львівська область',
    district: 'Стрийський район',
    settlement: 'с. Рудники',
    full: 'Львівська область, Стрийський район, с. Рудники',
  },
  geo: {
    lat: 49.457073417216,
    lng: 23.889078272491,
  },
  hours: {
    general: 'Пн–Сб 09:00–18:00, Нд — вихідний',
    evacuator: 'Цілодобово, 24/7',
  },
  social: {
    instagram: 'https://www.instagram.com/avtomuto',
    tiktok: 'https://www.tiktok.com/@avtomuto',
  },
  brandVariants: [
    'AvtoMuto',
    'АвтоМуто',
    'Авто Муто',
    'Автомито Рудники',
    'Автомуто Стрий',
    'Автомуто Рудники',
  ],
  geoKeywords: ['Рудники', 'Стрий', 'Дрогобич', 'Львів', 'Львівська область'],
} as const;

export type TeamMemberKey = 'ihor' | 'volodymyr' | 'andriy';

export interface TeamMember {
  key: TeamMemberKey;
  name: string;
  role: string;
  phone: string;
  phoneDisplay: string;
}

export const TEAM: Record<TeamMemberKey, TeamMember> = {
  ihor: {
    key: 'ihor',
    name: 'Ігор',
    role: 'Ремонт авто, автозапчастини, продаж коліс',
    phone: '+380969571538',
    phoneDisplay: '+380 96 957 15 38',
  },
  volodymyr: {
    key: 'volodymyr',
    name: 'Володимир',
    role: 'Пригон авто, сертифікація',
    phone: '+380674283302',
    phoneDisplay: '+380 67 428 33 02',
  },
  andriy: {
    key: 'andriy',
    name: 'Андрій',
    role: 'Продаж авто, детейлінг, евакуатор',
    phone: '+380975733073',
    phoneDisplay: '+380 97 573 30 73',
  },
};

export function telHref(phone: string): string {
  return `tel:${phone}`;
}

export function waHref(phone: string): string {
  return `https://wa.me/${phone.replace('+', '')}`;
}

export function viberHref(phone: string): string {
  return `viber://chat?number=%2B${phone.replace('+', '')}`;
}

export function tgHref(phone: string): string {
  return `https://t.me/${phone}`;
}
