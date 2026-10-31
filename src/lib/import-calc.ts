import {
  AUCTIONS,
  AUCTION_FIXED_FEES,
  BUYER_FEE_PERCENT_ABOVE,
  BUYER_FEE_TIERS,
  CUSTOMS,
  VIRTUAL_BID_FEE_ABOVE,
  VIRTUAL_BID_FEE_TIERS,
  type FuelType,
  type VehicleType,
} from '../data/import-calculator';

/** Аукціонний збір за ціною лота й частка комісії банку за переказ. */
export function auctionFee(key: string, price: number) {
  const auction = AUCTIONS.find((a) => a.value === key)!;
  if (!price) return { fee: 0, transferFeeRate: auction.transferFeeRate };
  const buyerFee = BUYER_FEE_TIERS.find(([upTo]) => price <= upTo)?.[1] ?? price * BUYER_FEE_PERCENT_ABOVE;
  const virtualBidFee = VIRTUAL_BID_FEE_TIERS.find(([upTo]) => price <= upTo)?.[1] ?? VIRTUAL_BID_FEE_ABOVE;
  return { fee: Math.round(buyerFee + virtualBidFee + AUCTION_FIXED_FEES), transferFeeRate: auction.transferFeeRate };
}

export interface CustomsInput {
  /** Митна вартість у USD: лот + аукціонний збір + усі витрати на доставку й страхування до кордону України. */
  customsValue: number;
  fuel: FuelType;
  vehicle: VehicleType;
  /** Об'єм двигуна в літрах (легкові, пікапи). */
  liters: number;
  /** Об'єм двигуна в см³ (мотоцикли). */
  cc: number;
  /** Ємність батареї в кВт·год (електро). */
  kwh: number;
  year: number;
  eurUsd: number;
  /** Рік розмитнення (для «розмитнення наступного року»); за замовчуванням — поточний. */
  customsYear?: number;
}

export function exciseEur({
  fuel,
  vehicle,
  liters,
  cc,
  kwh,
  year,
  customsYear = new Date().getFullYear(),
}: Omit<CustomsInput, 'customsValue' | 'eurUsd'>) {
  if (fuel === 'electric') return kwh * CUSTOMS.electricExcisePerKwh;
  if (vehicle === 'moto') {
    const tier = CUSTOMS.motoExcisePerCc.find((t) => cc <= t.upTo)!;
    return cc * tier.rate;
  }
  // Гібрид рахуємо як бензиновий — за об'ємом і віком, як митний калькулятор qdpro.com.ua.
  const rates = CUSTOMS.excisePerLiter[fuel === 'hybrid' ? 'petrol' : fuel];
  const base = liters > rates.upTo ? rates.high : rates.low;
  const age = Math.min(Math.max(customsYear - year - 1, 1), CUSTOMS.maxAgeCoefficient);
  return base * liters * age;
}

/** Мито, акциз і ПДВ у USD. */
export function customsPayments(input: CustomsInput) {
  const duty = input.customsValue * (input.fuel === 'electric' ? CUSTOMS.electricDutyRate : CUSTOMS.dutyRate);
  const excise = exciseEur(input) * input.eurUsd;
  const vat = (input.customsValue + duty + excise) * CUSTOMS.vatRate;
  return { duty, excise, vat };
}
