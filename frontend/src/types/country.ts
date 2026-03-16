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
  description: string;
  section: 'costOfLiving' | 'qualityOfLife' | 'visas' | 'infrastructure' | 'climate' | 'taxes';
  format: MetricFormat;
  higherIsBetter: boolean;
}

export const METRICS: MetricDefinition[] = [
  // Стоимость жизни
  { key: 'costOfLivingIndex', label: 'Индекс стоимости жизни', description: 'Относительная стоимость потребительских товаров и услуг. Нью-Йорк = 100. Ниже — дешевле.', section: 'costOfLiving', format: 'number', higherIsBetter: false },
  { key: 'rentIndex', label: 'Индекс аренды', description: 'Сравнительная стоимость аренды жилья. Нью-Йорк = 100. Ниже — дешевле.', section: 'costOfLiving', format: 'number', higherIsBetter: false },
  { key: 'groceriesIndex', label: 'Индекс продуктов', description: 'Сравнительная стоимость продуктов питания. Нью-Йорк = 100. Ниже — дешевле.', section: 'costOfLiving', format: 'number', higherIsBetter: false },
  { key: 'restaurantPriceIndex', label: 'Индекс ресторанов', description: 'Сравнительная стоимость питания в ресторанах. Нью-Йорк = 100. Ниже — дешевле.', section: 'costOfLiving', format: 'number', higherIsBetter: false },
  { key: 'localPurchasingPowerIndex', label: 'Покупательная способность', description: 'Соотношение средних зарплат к ценам на товары. Нью-Йорк = 100. Выше — больше можно купить.', section: 'costOfLiving', format: 'number', higherIsBetter: true },
  { key: 'avgMonthlyRentUsd', label: 'Средняя аренда (мес.)', description: 'Средняя стоимость аренды жилья в долларах за месяц.', section: 'costOfLiving', format: 'currency', higherIsBetter: false },
  { key: 'avgMonthlySalaryUsd', label: 'Средняя зарплата (мес.)', description: 'Средняя месячная зарплата в долларах.', section: 'costOfLiving', format: 'currency', higherIsBetter: true },

  // Качество жизни
  { key: 'qualityOfLifeValue', label: 'Индекс качества жизни', description: 'Комплексная оценка условий жизни: безопасность, здравоохранение, климат, экономика. Выше — лучше.', section: 'qualityOfLife', format: 'number', higherIsBetter: true },
  { key: 'safetyValue', label: 'Безопасность', description: 'Уровень личной безопасности и криминальной обстановки. Выше — безопаснее.', section: 'qualityOfLife', format: 'number', higherIsBetter: true },
  { key: 'healthCareValue', label: 'Здравоохранение', description: 'Качество и доступность медицинских услуг. Выше — лучше.', section: 'qualityOfLife', format: 'number', higherIsBetter: true },
  { key: 'purchasingPowerValue', label: 'Покупательная способность (QoL)', description: 'Покупательная способность из индекса качества жизни. Выше — больше можно купить на среднюю зарплату.', section: 'qualityOfLife', format: 'number', higherIsBetter: true },
  { key: 'propertyPriceToIncomeValue', label: 'Цена недвижимости / доход', description: 'Соотношение стоимости недвижимости к годовому доходу. Ниже — доступнее жильё.', section: 'qualityOfLife', format: 'number', higherIsBetter: false },
  { key: 'trafficCommuteTimeValue', label: 'Время в пробках (мин)', description: 'Среднее время в пути на работу в одну сторону. Ниже — меньше времени в дороге.', section: 'qualityOfLife', format: 'number', higherIsBetter: false },
  { key: 'pollutionValue', label: 'Загрязнение', description: 'Уровень загрязнения окружающей среды. Ниже — чище воздух и среда.', section: 'qualityOfLife', format: 'number', higherIsBetter: false },

  // Визы
  { key: 'visaRequired', label: 'Нужна виза', description: 'Требуется ли виза для въезда (для граждан РФ).', section: 'visas', format: 'boolean', higherIsBetter: false },
  { key: 'maxStayDays', label: 'Макс. срок пребывания (дни)', description: 'Максимальное количество дней безвизового пребывания или по визе.', section: 'visas', format: 'number', higherIsBetter: true },
  { key: 'digitalNomadVisa', label: 'Digital Nomad виза', description: 'Наличие специальной визы для удалённых работников.', section: 'visas', format: 'boolean', higherIsBetter: true },

  // Инфраструктура
  { key: 'internetSpeedMbps', label: 'Скорость интернета (Mbps)', description: 'Средняя скорость фиксированного интернета в мегабитах в секунду.', section: 'infrastructure', format: 'number', higherIsBetter: true },
  { key: 'avgInternetCostUsd', label: 'Стоимость интернета ($/мес)', description: 'Средняя ежемесячная стоимость интернета в долларах.', section: 'infrastructure', format: 'currency', higherIsBetter: false },
  { key: 'populationMillions', label: 'Население (млн)', description: 'Численность населения страны в миллионах.', section: 'infrastructure', format: 'number', higherIsBetter: false },
  { key: 'officialLanguage', label: 'Официальный язык', description: 'Основной официальный язык страны.', section: 'infrastructure', format: 'string', higherIsBetter: false },
  { key: 'englishProficiency', label: 'Уровень английского', description: 'Уровень владения английским среди населения (high — высокий, medium — средний, low — низкий). Выше — проще общаться на английском.', section: 'infrastructure', format: 'string', higherIsBetter: false },

  // Климат
  { key: 'climateValue', label: 'Индекс климата', description: 'Комплексная оценка климата: температура, влажность, количество осадков и солнечных дней. Выше — комфортнее.', section: 'climate', format: 'number', higherIsBetter: true },
  { key: 'avgTemperatureC', label: 'Средняя температура (°C)', description: 'Среднегодовая температура воздуха в градусах Цельсия.', section: 'climate', format: 'number', higherIsBetter: false },
  { key: 'sunnyDaysPerYear', label: 'Солнечных дней в году', description: 'Среднее количество солнечных дней за год.', section: 'climate', format: 'number', higherIsBetter: true },

  // Налоги
  { key: 'incomeTaxRate', label: 'Ставка подоходного налога', description: 'Базовая ставка подоходного налога для физических лиц.', section: 'taxes', format: 'percent', higherIsBetter: false },
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
