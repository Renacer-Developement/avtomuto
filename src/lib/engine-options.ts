import type { VehicleType } from '../data/import-calculator';

export interface EngineOption {
  /** Об'єм у см³. */
  value: number;
  label: string;
}

// Авто: 0.8–6.0 л з кроком 0.1 л; мотоцикли — типові кубатури.
const CAR_CC = Array.from({ length: 53 }, (_, i) => 800 + i * 100);
const MOTO_CC = [50, 125, 250, 300, 400, 500, 600, 650, 700, 750, 800, 900, 1000, 1100, 1200, 1300, 1500, 1800, 2000];

export function engineOptions(vehicle: VehicleType): EngineOption[] {
  if (vehicle === 'moto') return MOTO_CC.map((cc) => ({ value: cc, label: `${cc} см³` }));
  return CAR_CC.map((cc) => ({ value: cc, label: `${(cc / 1000).toFixed(1)} л (${cc} см³)` }));
}

/** Ємність батареї електромобіля, кВт·год. */
export const BATTERY_OPTIONS = Array.from({ length: 29 }, (_, i) => 10 + i * 5);

export const DEFAULT_ENGINE_CC = 2000;
export const DEFAULT_BATTERY_KWH = 75;
