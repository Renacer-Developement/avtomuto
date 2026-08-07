import raw from './remont-services.json';

export interface RemontCategory {
  title: string;
  slug: string;
  description: string;
  services: string[];
}

const descriptions: Record<string, string> = {
  'servisne-to':
    'Планове сервісне технічне обслуговування авто: заміна мастил, фільтрів, ременів і рідин згідно з регламентом виробника.',
  'halmivna-systema':
    'Діагностика та ремонт гальмівної системи — колодки, диски, супорти, гальмівна рідина та шланги.',
  pidviska:
    'Ремонт і діагностика ходової частини: амортизатори, важелі, сайлентблоки, розвал-сходження.',
  'rulove-keruvannia':
    'Ремонт рульового керування: рульова рейка, насос і рідина ГПК, рульові тяги та наконечники.',
  dvyhun:
    'Ремонт двигуна будь-якої складності — від заміни прокладок до капітального ремонту та заміни турбіни.',
  'palyvna-systema':
    'Діагностика та ремонт паливної системи: форсунки, паливний насос, паливний фільтр і бак.',
  'vykhlopna-systema':
    'Ремонт вихлопної системи: глушник, каталізатор, лямбда-зонд і сажовий фільтр.',
  zcheplennia:
    'Заміна та ремонт зчеплення: комплект зчеплення, маховик, робочий і головний циліндри.',
  transmisiia:
    'Ремонт трансмісії: КПП, АКПП, кардан, ШРКШ та мастила елементів трансмісії.',
  'kompiuterna-diahnostyka':
    'Комп’ютерна діагностика авто — точне визначення несправності перед початком ремонту, зчитування помилок ЕБУ.',
};

export const REMONT_CATEGORIES: RemontCategory[] = (
  raw as { categories: { title: string; slug: string; services: string[] }[] }
).categories.map((c) => ({
  ...c,
  description: descriptions[c.slug] ?? '',
}));

export function getRemontCategoryBySlug(slug: string): RemontCategory | undefined {
  return REMONT_CATEGORIES.find((c) => c.slug === slug);
}
