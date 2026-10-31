// Майданчики аукціонів (США + Канада), згруповані за кодом штату/провінції.
// Ціна доставки по суші береться з REGION_TARIFFS (import-calculator.ts) за кодом регіону,
// а для віддалених майданчиків — з YARD_INLAND_OVERRIDES нижче.
// Аукціони час від часу відкривають/закривають майданчики — список варто періодично звіряти.

import { REGION_TARIFFS, type AuctionKey } from './import-calculator';

export const COPART_YARDS: Record<string, string[]> = {
  AL: ['Birmingham', 'Dothan', 'Mobile', 'Montgomery', 'Tanner'],
  AK: ['Anchorage'],
  AZ: ['Phoenix', 'Phoenix North', 'Tucson'],
  AR: ['Fayetteville', 'Little Rock'],
  CA: [
    'Adelanto', 'Antelope', 'Bakersfield', 'Fresno', 'Hayward', 'Long Beach', 'Los Angeles', 'Martinez',
    'Mentone', 'Rancho Cucamonga', 'Redding', 'Sacramento', 'San Bernardino', 'San Diego', 'San Jose',
    'Sun Valley', 'Vallejo', 'Van Nuys',
  ],
  CO: ['Colorado Springs', 'Denver', 'Denver Central', 'Denver South'],
  CT: ['Hartford', 'Hartford Springfield'],
  DE: ['Seaford'],
  FL: [
    'Ft. Pierce', 'Jacksonville East', 'Jacksonville North', 'Jacksonville West', 'Miami Central', 'Miami North',
    'Miami South', 'Ocala', 'Orlando North', 'Orlando South', 'Punta Gorda', 'Punta Gorda South', 'Tallahassee',
    'Tampa South', 'West Palm Beach',
  ],
  GA: [
    'Atlanta East', 'Atlanta North', 'Atlanta South', 'Atlanta West', 'Augusta', 'Cartersville', 'Fairburn',
    'Macon', 'Savannah', 'Tifton',
  ],
  HI: ['Honolulu'],
  ID: ['Boise'],
  IL: ['Chicago North', 'Chicago South', 'Peoria', 'Southern Illinois', 'Wheeling'],
  IN: ['Cicero', 'Dyer', 'Fort Wayne', 'Hammond', 'Indianapolis'],
  IA: ['Davenport', 'Des Moines'],
  KS: ['Kansas City', 'Wichita'],
  KY: ['Earlington', 'Lexington East', 'Lexington West', 'Louisville', 'Walton'],
  LA: ['Baton Rouge', 'New Orleans', 'Shreveport'],
  ME: ['Lyman', 'Windham'],
  MD: ['Baltimore', 'Baltimore East'],
  MA: ['Freetown', 'North Boston', 'South Boston', 'West Warren'],
  MI: ['Detroit', 'Flint', 'Ionia', 'Kincheloe', 'Lansing', 'Wayland'],
  MN: ['Minneapolis', 'Minneapolis North', 'St. Cloud'],
  MS: ['Grenada', 'Jackson'],
  MO: ['Columbia', 'Sikeston', 'Springfield', 'St. Louis'],
  MT: ['Billings', 'Helena'],
  NE: ['Lincoln'],
  NV: ['Las Vegas', 'Las Vegas West', 'Reno'],
  NH: ['Candia'],
  NJ: ['Glassboro East', 'Glassboro West', 'Somerville', 'Trenton'],
  NM: ['Albuquerque'],
  NY: ['Albany', 'Buffalo', 'Long Island', 'Newburgh', 'Rochester', 'Syracuse'],
  NC: ['China Grove', 'Concord', 'Gastonia', 'Lumberton', 'Mebane', 'Mocksville', 'Raleigh', 'Raleigh North'],
  ND: ['Bismarck'],
  OH: ['Cleveland East', 'Cleveland West', 'Columbus', 'Dayton'],
  OK: ['Oklahoma City', 'Tulsa'],
  OR: ['Eugene', 'Portland North', 'Portland South'],
  PA: [
    'Altoona', 'Chambersburg', 'Harrisburg', 'Philadelphia', 'Philadelphia East-Suburban', 'Pittsburgh East',
    'Pittsburgh North', 'Pittsburgh South', 'Pittsburgh West', 'Scranton', 'York Haven',
  ],
  RI: ['Exeter'],
  SC: ['Columbia', 'Greer', 'North Charleston', 'Spartanburg'],
  SD: ['Rapid City', 'Sioux Falls'],
  TN: ['Knoxville', 'Memphis', 'Nashville'],
  TX: [
    'Abilene', 'Amarillo', 'Andrews', 'Austin', 'Corpus Christi', 'Dallas', 'Dallas South', 'El Paso',
    'Ft. Worth', 'Houston', 'Houston East', 'Longview', 'Lufkin', 'McAllen', 'San Antonio', 'Waco',
  ],
  UT: ['Ogden', 'Salt Lake City'],
  VT: ['Rutland'],
  VA: ['Danville', 'Fredericksburg', 'Hampton', 'Richmond', 'Richmond East'],
  WA: ['Graham', 'North Seattle', 'Pasco', 'Spokane'],
  WV: ['Charleston'],
  WI: ['Appleton', 'Madison South', 'Milwaukee', 'Milwaukee North', 'Milwaukee South'],
  WY: ['Casper'],
  // Copart Canada
  AB: ['Calgary', 'Edmonton'],
  BC: ['Langley'],
  MB: ['Winnipeg'],
  NB: ['Moncton'],
  NS: ['Halifax'],
  ON: ['London', 'Ottawa', 'Toronto'],
  QC: ['Montreal'],
};

export const IAAI_YARDS: Record<string, string[]> = {
  AL: ['Birmingham', 'Dothan', 'Huntsville', 'Mobile'],
  AK: ['Anchorage'],
  AZ: ['Phoenix', 'Tucson'],
  AR: ['Fayetteville', 'Little Rock'],
  CA: [
    'Anaheim', 'Bakersfield', 'East Bay', 'Fontana', 'Fremont', 'Fresno', 'High Desert', 'Los Angeles',
    'Los Angeles South', 'Sacramento', 'San Diego', 'Santa Clarita',
  ],
  CO: ['Colorado Springs', 'Denver', 'Denver East'],
  CT: ['Hartford', 'Hartford-South'],
  DE: ['Dover'],
  FL: [
    'Fort Myers', 'Fort Pierce', 'Jacksonville', 'Miami', 'Miami-North', 'Orlando', 'Orlando-North', 'Pensacola',
    'Tampa', 'Tampa North', 'West Palm Beach',
  ],
  GA: ['Atlanta', 'Atlanta East', 'Atlanta North', 'Atlanta South', 'Savannah', 'Tifton'],
  HI: ['Honolulu'],
  ID: ['Boise'],
  IL: ['Central Illinois', 'Chicago-North', 'Chicago-South', 'Chicago-West', 'St. Louis'],
  IN: ['Fort Wayne', 'Indianapolis', 'Northern Indiana'],
  IA: ['Des Moines'],
  KS: ['Wichita'],
  KY: ['Lexington', 'Louisville'],
  LA: ['Baton Rouge', 'New Orleans', 'Shreveport'],
  ME: ['Portland-Gorham'],
  MD: ['Baltimore', 'Elkton', 'Metro DC'],
  MA: ['Boston-Shirley', 'Taunton', 'Templeton'],
  MI: ['Detroit', 'Flint', 'Grand Rapids'],
  MN: ['Minneapolis/St. Paul', 'Minneapolis South'],
  MS: ['Jackson'],
  MO: ['Kansas City', 'Springfield'],
  MT: ['Billings'],
  NE: ['Omaha'],
  NV: ['Las Vegas', 'Reno'],
  NH: ['Manchester'],
  NJ: ['Central New Jersey', 'Englishtown', 'Southern New Jersey'],
  NM: ['Albuquerque'],
  NY: ['Albany', 'Buffalo', 'Long Island', 'Newburgh', 'Rochester', 'Syracuse'],
  NC: ['Asheville', 'Charlotte', 'Greensboro', 'Raleigh'],
  ND: ['Fargo'],
  OH: ['Akron-Canton', 'Cincinnati', 'Cleveland', 'Columbus', 'Dayton'],
  OK: ['Oklahoma City', 'Tulsa'],
  OR: ['Portland', 'Portland South'],
  PA: ['Altoona', 'Erie', 'Philadelphia', 'Pittsburgh', 'Scranton', 'York Springs'],
  RI: ['Providence'],
  SC: ['Charleston', 'Columbia', 'Greenville'],
  SD: ['Sioux Falls'],
  TN: ['Chattanooga', 'Knoxville', 'Memphis', 'Nashville'],
  TX: [
    'Abilene', 'Amarillo', 'Austin', 'Corpus Christi', 'Dallas', 'Dallas/Ft Worth', 'El Paso', 'Fort Worth North',
    'Houston', 'Houston-North', 'Houston South', 'Lubbock', 'McAllen', 'San Antonio',
  ],
  UT: ['Salt Lake City'],
  VA: ['Fredericksburg-South', 'Northern Virginia', 'Richmond', 'Roanoke', 'Tidewater'],
  WA: ['Seattle', 'Spokane', 'Tacoma'],
  WV: ['Shady Spring'],
  WI: ['Milwaukee'],
  // IMPACT Canada (IAA)
  AB: ['Calgary', 'Edmonton'],
  BC: ['Abbotsford', 'Kamloops'],
  MB: ['Winnipeg'],
  NB: ['Moncton'],
  NL: ["St. John's"],
  NS: ['Halifax'],
  ON: ['London', 'Ottawa', 'Toronto'],
  PE: ['Charlottetown'],
  QC: ['Montreal', 'Quebec City'],
  SK: ['Regina', 'Saskatoon'],
};

/** Ціна доставки по суші для майданчиків, далеких від порту свого штату. Ключ — «CODE - Місто». */
export const YARD_INLAND_OVERRIDES: Record<string, number> = {
  'TX - El Paso': 750,
  'TX - Amarillo': 650,
  'TX - Lubbock': 650,
  'TX - Andrews': 700,
  'TX - Abilene': 550,
  'CA - Sacramento': 450,
  'CA - Redding': 550,
  'CA - Hayward': 450,
  'CA - Martinez': 450,
  'CA - Vallejo': 450,
  'CA - San Jose': 450,
  'CA - East Bay': 450,
  'CA - Fremont': 450,
  'CA - Fresno': 400,
  'NY - Buffalo': 550,
  'NY - Rochester': 500,
  'NY - Syracuse': 450,
  'PA - Pittsburgh': 550,
  'PA - Pittsburgh East': 550,
  'PA - Pittsburgh North': 550,
  'PA - Pittsburgh South': 550,
  'PA - Pittsburgh West': 550,
  'PA - Erie': 600,
  'FL - Pensacola': 550,
  'FL - Tallahassee': 450,
  'FL - Miami': 450,
  'FL - Miami Central': 450,
  'FL - Miami North': 450,
  'FL - Miami South': 450,
  'FL - Miami-North': 450,
  'MI - Kincheloe': 750,
  'WA - Spokane': 600,
  'WA - Pasco': 550,
  'BC - Kamloops': 650,
};

export interface YardOption {
  value: string;
  label: string;
}

export interface YardGroup {
  label: string;
  yards: YardOption[];
}

const YARDS_BY_AUCTION: Record<AuctionKey, Record<string, string[]>> = {
  copart: COPART_YARDS,
  iaai: IAAI_YARDS,
  // Manheim має сотні локацій дилерів — рахуємо лише за штатом.
  manheim: Object.fromEntries(Object.keys(REGION_TARIFFS).map((code) => [code, [REGION_TARIFFS[code].name]])),
};

/** Значення опції майданчика: «CODE - Місто», напр. «TX - Houston». */
export function yardGroups(auction: AuctionKey): YardGroup[] {
  return Object.entries(YARDS_BY_AUCTION[auction])
    .map(([code, cities]) => ({
      label: `${REGION_TARIFFS[code].name} (${code})`,
      yards: cities.map((city) => ({ value: `${code} - ${city}`, label: `${code} - ${city.toUpperCase()}` })),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'uk'));
}

export function yardInland(yard: string): { inland: number; port: ReturnType<typeof regionOf>['port'] } {
  const region = regionOf(yard);
  return { inland: YARD_INLAND_OVERRIDES[yard] ?? region.inland, port: region.port };
}

function regionOf(yard: string) {
  return REGION_TARIFFS[yard.slice(0, 2)];
}
