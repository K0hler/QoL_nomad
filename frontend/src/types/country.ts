export interface CountryData {
  countryName: string;
  // Cost of Living (CSV 1)
  costOfLivingIndex: number | null;
  rentIndex: number | null;
  groceriesIndex: number | null;
  restaurantPriceIndex: number | null;
  localPurchasingPowerIndex: number | null;
  // Quality of Life (CSV 2)
  qualityOfLifeValue: number | null;
  qualityOfLifeCategory: string | null;
  safetyValue: number | null;
  safetyCategory: string | null;
  healthCareValue: number | null;
  healthCareCategory: string | null;
  climateValue: number | null;
  climateCategory: string | null;
  pollutionValue: number | null;
  pollutionCategory: string | null;
  purchasingPowerValue: number | null;
  purchasingPowerCategory: string | null;
  costOfLivingQolValue: number | null;
  costOfLivingQolCategory: string | null;
  propertyPriceToIncomeValue: number | null;
  propertyPriceToIncomeCategory: string | null;
  trafficCommuteTimeValue: number | null;
  trafficCommuteTimeCategory: string | null;
  // City-level aggregated data (CSV 3)
  avgInternetCostUsd: number | null;
  avgMonthlyRentUsd: number | null;
  avgMonthlySalaryUsd: number | null;
  // Supplementary static data
  visaRequired: boolean | null;
  maxStayDays: number | null;
  digitalNomadVisa: boolean | null;
  internetSpeedMbps: number | null;
  avgTemperatureC: number | null;
  sunnyDaysPerYear: number | null;
  populationMillions: number | null;
  officialLanguage: string | null;
  englishProficiency: 'high' | 'medium' | 'low' | null;
  incomeTaxRate: number | null;
}

export type MetricFormat = 'number' | 'percent' | 'currency' | 'boolean' | 'string';

export interface MetricDefinition {
  key: keyof CountryData;
  label: string;
  section: 'costOfLiving' | 'qualityOfLife' | 'visas' | 'infrastructure' | 'climate' | 'taxes';
  format: MetricFormat;
  higherIsBetter: boolean;
}

export const METRICS: MetricDefinition[] = [
  // Стоимость жизни
  { key: 'costOfLivingIndex', label: 'Индекс стоимости жизни', section: 'costOfLiving', format: 'number', higherIsBetter: false },
  { key: 'rentIndex', label: 'Индекс аренды', section: 'costOfLiving', format: 'number', higherIsBetter: false },
  { key: 'groceriesIndex', label: 'Индекс продуктов', section: 'costOfLiving', format: 'number', higherIsBetter: false },
  { key: 'restaurantPriceIndex', label: 'Индекс ресторанов', section: 'costOfLiving', format: 'number', higherIsBetter: false },
  { key: 'localPurchasingPowerIndex', label: 'Покупательная способность', section: 'costOfLiving', format: 'number', higherIsBetter: true },
  { key: 'avgMonthlyRentUsd', label: 'Средняя аренда (мес.)', section: 'costOfLiving', format: 'currency', higherIsBetter: false },
  { key: 'avgMonthlySalaryUsd', label: 'Средняя зарплата (мес.)', section: 'costOfLiving', format: 'currency', higherIsBetter: true },

  // Качество жизни
  { key: 'qualityOfLifeValue', label: 'Индекс качества жизни', section: 'qualityOfLife', format: 'number', higherIsBetter: true },
  { key: 'safetyValue', label: 'Безопасность', section: 'qualityOfLife', format: 'number', higherIsBetter: true },
  { key: 'healthCareValue', label: 'Здравоохранение', section: 'qualityOfLife', format: 'number', higherIsBetter: true },
  { key: 'purchasingPowerValue', label: 'Покупательная способность (QoL)', section: 'qualityOfLife', format: 'number', higherIsBetter: true },
  { key: 'propertyPriceToIncomeValue', label: 'Цена недвижимости / доход', section: 'qualityOfLife', format: 'number', higherIsBetter: false },
  { key: 'trafficCommuteTimeValue', label: 'Время в пробках (мин)', section: 'qualityOfLife', format: 'number', higherIsBetter: false },
  { key: 'pollutionValue', label: 'Загрязнение', section: 'qualityOfLife', format: 'number', higherIsBetter: false },

  // Визы
  { key: 'visaRequired', label: 'Нужна виза', section: 'visas', format: 'boolean', higherIsBetter: false },
  { key: 'maxStayDays', label: 'Макс. срок пребывания (дни)', section: 'visas', format: 'number', higherIsBetter: true },
  { key: 'digitalNomadVisa', label: 'Digital Nomad виза', section: 'visas', format: 'boolean', higherIsBetter: true },

  // Инфраструктура
  { key: 'internetSpeedMbps', label: 'Скорость интернета (Mbps)', section: 'infrastructure', format: 'number', higherIsBetter: true },
  { key: 'avgInternetCostUsd', label: 'Стоимость интернета ($/мес)', section: 'infrastructure', format: 'currency', higherIsBetter: false },
  { key: 'populationMillions', label: 'Население (млн)', section: 'infrastructure', format: 'number', higherIsBetter: false },
  { key: 'officialLanguage', label: 'Официальный язык', section: 'infrastructure', format: 'string', higherIsBetter: false },
  { key: 'englishProficiency', label: 'Уровень английского', section: 'infrastructure', format: 'string', higherIsBetter: false },

  // Климат
  { key: 'climateValue', label: 'Индекс климата', section: 'climate', format: 'number', higherIsBetter: true },
  { key: 'avgTemperatureC', label: 'Средняя температура (°C)', section: 'climate', format: 'number', higherIsBetter: false },
  { key: 'sunnyDaysPerYear', label: 'Солнечных дней в году', section: 'climate', format: 'number', higherIsBetter: true },

  // Налоги
  { key: 'incomeTaxRate', label: 'Ставка подоходного налога', section: 'taxes', format: 'percent', higherIsBetter: false },
];

export const SECTION_LABELS: Record<MetricDefinition['section'], string> = {
  costOfLiving: '💰 Стоимость жизни',
  qualityOfLife: '🏥 Качество жизни',
  visas: '🛂 Визы и пребывание',
  infrastructure: '🌐 Инфраструктура',
  climate: '☀️ Климат',
  taxes: '💼 Налоги',
};

export const SECTION_ORDER: MetricDefinition['section'][] = [
  'costOfLiving', 'qualityOfLife', 'visas', 'infrastructure', 'climate', 'taxes',
];

export function formatValue(value: CountryData[keyof CountryData], format: MetricFormat): string {
  if (value === null || value === undefined) return 'N/A';
  switch (format) {
    case 'number':
      return typeof value === 'number' ? value.toFixed(1) : String(value);
    case 'percent':
      return typeof value === 'number' ? `${value}%` : String(value);
    case 'currency':
      return typeof value === 'number' ? `$${value.toFixed(0)}` : String(value);
    case 'boolean':
      return value ? 'Да' : 'Нет';
    case 'string':
      return String(value);
    default:
      return String(value);
  }
}
