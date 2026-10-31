// Публічний калькулятор (/poslugy/pryhon-avtomobiliv/kalkulyator) — та сама логіка, що на gal.in.ua/calculator:
// ті ж поля, збори, страхування й формула розмитнення. Відрізняються лише послуги AvtoMuto й доставка до Рудників.

import { CLIENT_TARIFFS, COMPANY_FEE, CUSTOMS } from '../data/import-calculator';
import { auctionFee } from './import-calc';

export type ClientVehicleType = 'car' | 'oversize' | 'moto' | 'moto_large';
export type ClientEngineType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'hydrogen';

export const CLIENT_VEHICLE_TYPES: { value: ClientVehicleType; label: string }[] = [
  { value: 'car', label: 'Легковий' },
  { value: 'oversize', label: 'Оверсайз' },
  { value: 'moto', label: 'Мотоцикл' },
  { value: 'moto_large', label: 'Великий мотоцикл' },
];

export const CLIENT_ENGINE_TYPES: { value: ClientEngineType; label: string }[] = [
  { value: 'petrol', label: 'Бензин' },
  { value: 'diesel', label: 'Дизель' },
  { value: 'electric', label: 'Електро' },
  { value: 'hybrid', label: 'Гібрид' },
  { value: 'hydrogen', label: 'Водень' },
];

export interface ClientCalcInput {
  priceUSD: number;
  year: number;
  /** «Розмитнення на наступний рік» — авто вважається на рік старшим. */
  customsNextYear: boolean;
  vehicleType: ClientVehicleType;
  engineType: ClientEngineType;
  /** Об'єм двигуна, см³, або ємність батареї, кВт·год (для електро). */
  engineVolume: number;
  auction: string;
  insurance: boolean;
  eurUsd: number;
  usdUah: number;
}

/** Коефіцієнт віку: повних років після року випуску, від 1 до 15. */
function ageCoefficient(year: number) {
  const age = new Date().getFullYear() - year - 1;
  return Math.min(Math.max(age, 1), CUSTOMS.maxAgeCoefficient);
}

/** Мито, акциз і ПДВ у USD. value — ціна + аукціонний збір. */
function customs(value: number, input: ClientCalcInput) {
  const { engineType, engineVolume: v, eurUsd } = input;
  const eur = (amount: number) => amount * eurUsd;
  const allowance = CLIENT_TARIFFS.customsDeliveryAllowance;

  if (engineType === 'electric') {
    const excise = eur(v * CUSTOMS.electricExcisePerKwh);
    return { toll: 0, excise, vat: (value + excise + allowance) * CUSTOMS.vatRate };
  }
  if (input.vehicleType === 'moto' || input.vehicleType === 'moto_large') {
    const rate = CUSTOMS.motoExcisePerCc.find((t) => v < t.upTo)?.rate ?? 0;
    const excise = eur(v * rate);
    const toll = value * CUSTOMS.dutyRate;
    return { toll, excise, vat: (value + toll + excise) * CUSTOMS.vatRate };
  }
  const year = input.customsNextYear ? input.year - 1 : input.year;
  const rates = CUSTOMS.excisePerLiter[engineType === 'diesel' ? 'diesel' : 'petrol'];
  const perLiter = v / 1000 > rates.upTo ? rates.high : rates.low;
  const excise = eur(perLiter) * (v / 1000) * ageCoefficient(year);
  const toll = (value + allowance) * CUSTOMS.dutyRate;
  return { toll, excise, vat: (value + toll + excise + allowance) * CUSTOMS.vatRate };
}

export function calculateClient(input: ClientCalcInput) {
  const price = input.priceUSD;
  const fee = auctionFee('copart', price).fee;
  const totalPurchase = price + fee;

  const t = CLIENT_TARIFFS;
  const insurance = input.insurance ? Math.max(Math.round(totalPurchase * t.insuranceRate), t.insuranceMin) : 0;
  const totalDelivery = t.shippingToKlaipeda + COMPANY_FEE + insurance + t.storageUsa + t.expedition;

  const c = customs(totalPurchase, input);
  const customsTotal = Math.round(c.toll + c.excise + c.vat);
  const totalAfterArrival = t.broker + t.loading + customsTotal + t.deliveryToRudnyky;

  const grandTotal = totalPurchase + totalDelivery + totalAfterArrival;
  return {
    price,
    auctionFee: fee,
    totalPurchase,
    shippingToKlaipeda: t.shippingToKlaipeda,
    services: COMPANY_FEE,
    insurance,
    storageUsa: t.storageUsa,
    expedition: t.expedition,
    totalDelivery,
    broker: t.broker,
    loading: t.loading,
    customs: customsTotal,
    toll: Math.round(c.toll),
    excise: Math.round(c.excise),
    vat: Math.round(c.vat),
    deliveryToRudnyky: t.deliveryToRudnyky,
    totalAfterArrival,
    grandTotal,
    grandTotalUAH: Math.round(grandTotal * input.usdUah),
  };
}
