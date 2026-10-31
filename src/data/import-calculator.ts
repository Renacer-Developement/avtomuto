// Тарифи калькулятора пригону авто зі США (/poslugy/pryhon-avtomobiliv/kalkulyator).
// Усі суми — у доларах США. Логістику, збори й комісії треба тримати актуальними вручну:
// значення нижче орієнтовні, їх варто звірити з вашими реальними тарифами перевізника/брокера.

export type VehicleType = 'car' | 'suv' | 'moto' | 'pickup';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type AuctionKey = 'copart' | 'iaai' | 'manheim';

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

export const VEHICLE_TYPES: Option<VehicleType>[] = [
  { value: 'car', label: 'Легковий' },
  { value: 'suv', label: 'Кросовер / позашляховик' },
  { value: 'pickup', label: 'Бус / пікап' },
  { value: 'moto', label: 'Мотоцикл' },
];

export const FUEL_TYPES: Option<FuelType>[] = [
  { value: 'petrol', label: 'Бензин' },
  { value: 'diesel', label: 'Дизель' },
  { value: 'hybrid', label: 'Гібрид' },
  { value: 'electric', label: 'Електро' },
];

export interface Auction {
  value: AuctionKey;
  label: string;
  /** Комісія банку за переказ коштів на аукціон, частка від (лот + збір). */
  transferFeeRate: number;
}

export const AUCTIONS: Auction[] = [
  { value: 'copart', label: 'Copart', transferFeeRate: 0.01 },
  { value: 'iaai', label: 'IAAI', transferFeeRate: 0.01 },
  { value: 'manheim', label: 'Manheim', transferFeeRate: 0.02 },
];

/**
 * Аукціонний збір: buyer fee за ціною лота (таблиця Copart) + virtual bid fee + $130 (gate, title, environmental).
 * Ті самі ставки, що в калькуляторі gal.in.ua. Межа — верхня ціна лота включно.
 */
export const BUYER_FEE_TIERS: [upTo: number, fee: number][] = [
  [99.99, 1], [199.99, 25], [299.99, 60], [349.99, 85], [399.99, 100], [449.99, 125], [499.99, 135],
  [549.99, 145], [599.99, 155], [699.99, 170], [799.99, 195], [899.99, 215], [999.99, 230],
  [1199.99, 250], [1299.99, 270], [1399.99, 285], [1499.99, 300], [1599.99, 315], [1699.99, 330],
  [1799.99, 350], [1999.99, 370], [2399.99, 390], [2499.99, 425], [2999.99, 460], [3499.99, 505],
  [3999.99, 555], [4499.99, 600], [4999.99, 625], [5499.99, 650], [5999.99, 675], [6499.99, 700],
  [6999.99, 720], [7499.99, 755], [7999.99, 775], [8499.99, 800], [9999.99, 820], [11499.99, 850],
  [11999.99, 860], [12499.99, 875], [14999.99, 890],
];
/** Дорожчі лоти — відсоток від ціни. */
export const BUYER_FEE_PERCENT_ABOVE = 0.06;
export const VIRTUAL_BID_FEE_TIERS: [upTo: number, fee: number][] = [
  [99.99, 0], [499.99, 50], [999.99, 65], [1499.99, 85], [1999.99, 95], [3999.99, 110], [5999.99, 125], [7999.99, 145],
];
export const VIRTUAL_BID_FEE_ABOVE = 160;
export const AUCTION_FIXED_FEES = 130;

/**
 * Тарифи публічного калькулятора — як у gal.in.ua (крім послуг AvtoMuto й доставки до Рудників).
 * customsDeliveryAllowance — умовна доставка, яку додають до ціни + збору для мита й ПДВ.
 */
export const CLIENT_TARIFFS = {
  shippingToKlaipeda: 1250,
  storageUsa: 0,
  expedition: 550,
  broker: 200,
  loading: 50,
  deliveryToRudnyky: 750,
  insuranceRate: 0.02,
  insuranceMin: 200,
  customsDeliveryAllowance: 1800,
};

export type ExportPortKey = 'nj' | 'sav' | 'jax' | 'hou' | 'chi' | 'la' | 'sea' | 'mtl';

/** Порти відправлення в США/Канаді та морська доставка з них до Клайпеди. */
export const EXPORT_PORTS: Record<ExportPortKey, { label: string; ocean: number }> = {
  nj: { label: 'Newark, NJ', ocean: 1150 },
  sav: { label: 'Savannah, GA', ocean: 1200 },
  jax: { label: 'Jacksonville, FL', ocean: 1250 },
  hou: { label: 'Houston, TX', ocean: 1450 },
  chi: { label: 'Chicago, IL', ocean: 1400 },
  la: { label: 'Los Angeles, CA', ocean: 2100 },
  sea: { label: 'Seattle, WA', ocean: 2300 },
  mtl: { label: 'Montreal, QC', ocean: 1300 },
};

/**
 * Тариф доставки по суші за штатом/провінцією: до якого порту веземо і скільки коштує.
 * Окремі віддалені майданчики мають власну ціну — див. YARD_INLAND_OVERRIDES в auction-yards.ts.
 */
export const REGION_TARIFFS: Record<string, { name: string; port: ExportPortKey; inland: number }> = {
  AL: { name: 'Алабама', port: 'sav', inland: 500 },
  AK: { name: 'Аляска', port: 'sea', inland: 1800 },
  AZ: { name: 'Аризона', port: 'la', inland: 500 },
  AR: { name: 'Арканзас', port: 'hou', inland: 550 },
  CA: { name: 'Каліфорнія', port: 'la', inland: 300 },
  CO: { name: 'Колорадо', port: 'hou', inland: 900 },
  CT: { name: 'Коннектикут', port: 'nj', inland: 400 },
  DE: { name: 'Делавер', port: 'nj', inland: 350 },
  FL: { name: 'Флорида', port: 'jax', inland: 400 },
  GA: { name: 'Джорджія', port: 'sav', inland: 350 },
  HI: { name: 'Гаваї', port: 'la', inland: 1600 },
  ID: { name: 'Айдахо', port: 'sea', inland: 750 },
  IL: { name: 'Іллінойс', port: 'chi', inland: 250 },
  IN: { name: 'Індіана', port: 'chi', inland: 350 },
  IA: { name: 'Айова', port: 'chi', inland: 450 },
  KS: { name: 'Канзас', port: 'hou', inland: 650 },
  KY: { name: 'Кентуккі', port: 'sav', inland: 650 },
  LA: { name: 'Луїзіана', port: 'hou', inland: 400 },
  ME: { name: 'Мен', port: 'nj', inland: 600 },
  MD: { name: 'Меріленд', port: 'nj', inland: 350 },
  MA: { name: 'Массачусетс', port: 'nj', inland: 450 },
  MI: { name: 'Мічиган', port: 'chi', inland: 450 },
  MN: { name: 'Міннесота', port: 'chi', inland: 550 },
  MS: { name: 'Міссісіпі', port: 'hou', inland: 600 },
  MO: { name: 'Міссурі', port: 'chi', inland: 550 },
  MT: { name: 'Монтана', port: 'sea', inland: 900 },
  NE: { name: 'Небраска', port: 'chi', inland: 600 },
  NV: { name: 'Невада', port: 'la', inland: 500 },
  NH: { name: 'Нью-Гемпшир', port: 'nj', inland: 500 },
  NJ: { name: 'Нью-Джерсі', port: 'nj', inland: 250 },
  NM: { name: 'Нью-Мексико', port: 'hou', inland: 800 },
  NY: { name: 'Нью-Йорк', port: 'nj', inland: 350 },
  NC: { name: 'Північна Кароліна', port: 'sav', inland: 450 },
  ND: { name: 'Північна Дакота', port: 'chi', inland: 900 },
  OH: { name: 'Огайо', port: 'nj', inland: 550 },
  OK: { name: 'Оклахома', port: 'hou', inland: 500 },
  OR: { name: 'Орегон', port: 'sea', inland: 450 },
  PA: { name: 'Пенсильванія', port: 'nj', inland: 350 },
  RI: { name: 'Род-Айленд', port: 'nj', inland: 400 },
  SC: { name: 'Південна Кароліна', port: 'sav', inland: 350 },
  SD: { name: 'Південна Дакота', port: 'chi', inland: 800 },
  TN: { name: 'Теннессі', port: 'sav', inland: 550 },
  TX: { name: 'Техас', port: 'hou', inland: 350 },
  UT: { name: 'Юта', port: 'la', inland: 800 },
  VT: { name: 'Вермонт', port: 'nj', inland: 550 },
  VA: { name: 'Вірджинія', port: 'nj', inland: 450 },
  WA: { name: 'Вашингтон', port: 'sea', inland: 300 },
  WV: { name: 'Західна Вірджинія', port: 'nj', inland: 550 },
  WI: { name: 'Вісконсин', port: 'chi', inland: 400 },
  WY: { name: 'Вайомінг', port: 'sea', inland: 1100 },
  // Канада
  AB: { name: 'Альберта (CA)', port: 'sea', inland: 1100 },
  BC: { name: 'Британська Колумбія (CA)', port: 'sea', inland: 400 },
  MB: { name: 'Манітоба (CA)', port: 'mtl', inland: 1300 },
  NB: { name: 'Нью-Брансвік (CA)', port: 'mtl', inland: 700 },
  NL: { name: 'Ньюфаундленд (CA)', port: 'mtl', inland: 1200 },
  NS: { name: 'Нова Шотландія (CA)', port: 'mtl', inland: 850 },
  ON: { name: 'Онтаріо (CA)', port: 'mtl', inland: 550 },
  PE: { name: 'Острів Принца Едварда (CA)', port: 'mtl', inland: 900 },
  QC: { name: 'Квебек (CA)', port: 'mtl', inland: 300 },
  SK: { name: 'Саскачеван (CA)', port: 'mtl', inland: 1500 },
};

/**
 * Логістика й послуги від Клайпеди до Рудників. Усе входить у митну вартість:
 * більша частина маршруту — Литва й Польща, тож рахуємо як доставку до кордону.
 * Перший рядок — вигрузка (в генераторі це «Експедиція»), решта — шлях до Рудників.
 */
export const PORT_COSTS: { label: string; amount: number }[] = [
  { label: 'Вигрузка з порту Клайпеда', amount: 400 },
  // Фіксована ціна, разом із проходженням кордону.
  { label: 'Доставка Клайпеда — Рудники', amount: 750 },
];

/** Пікапам і бусам потрібне місце в контейнері під більше авто. */
export const PICKUP_SHIPPING_MULTIPLIER = 1.5;
/** Мотоцикл займає менше місця в контейнері. */
export const MOTO_SHIPPING_MULTIPLIER = 0.5;

export const EXPORT_DOCS_FEE = 150;
export const BROKER_FEE = 250;
export const COMPANY_FEE = 300;
/** Страхування вантажу, частка від ціни лота. */
export const INSURANCE_RATE = 0.015;

/**
 * Розмитнення (Митний кодекс + ПКУ, ст. 215.3.5¹).
 * Митна вартість (ст. 58 МКУ) = лот + аукціонний збір + усі витрати на доставку й страхування
 * до кордону України: доставка по США, експортні документи, море, вигрузка в порту, доставка до кордону.
 */
export const CUSTOMS = {
  dutyRate: 0.1,
  electricDutyRate: 0,
  vatRate: 0.2,
  /** Ставки акцизу в євро за 1000 см³, залежно від об'єму. */
  excisePerLiter: {
    petrol: { upTo: 3, low: 50, high: 100 },
    diesel: { upTo: 3.5, low: 75, high: 150 },
  },
  /** Євро за 1 кВт·год ємності батареї. */
  electricExcisePerKwh: 1,
  maxAgeCoefficient: 15,
  /** Мотоцикли: євро за 1 см³ (без коефіцієнта віку). */
  motoExcisePerCc: [
    { upTo: 500, rate: 0.062 },
    { upTo: 800, rate: 0.443 },
    { upTo: Infinity, rate: 0.447 },
  ],
} as const;

/** Курс EUR/USD на випадок, якщо API НБУ недоступний. */
export const FALLBACK_EUR_USD = 1.16;
