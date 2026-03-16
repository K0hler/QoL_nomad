import { useState, useMemo } from 'react';
import './index.css';
import rawData from './assets/data/merged_db.json';

// Types
interface CountryData {
  countryName: string;
  costOfLivingIndex: number | null;
  rentIndex: number | null;
  groceriesIndex: number | null;
  restaurantPriceIndex: number | null;
  localPurchasingPowerIndex: number | null;
  qualityOfLifeValue: number | null;
  safetyValue: number | null;
  healthCareValue: number | null;
  climateValue: number | null;
  pollutionValue: number | null;
}

export default function App() {
  const [search, setSearch] = useState('');
  const [maxCostIndex, setMaxCostIndex] = useState<number>(80);
  const [minQoL, setMinQoL] = useState<number>(100);

  const filteredCountries = useMemo(() => {
    const data = rawData as CountryData[];

    return data.filter(country => {
      // 1. Поиск по тексту (страна)
      const matchesSearch = search === '' ||
        country.countryName.toLowerCase().includes(search.toLowerCase());

      // 2. Фильтр по Cost of Living Index (чем меньше, тем дешевле)
      const costIndex = country.costOfLivingIndex || 0;
      const matchesCost = costIndex > 0 && costIndex <= maxCostIndex;

      // 3. Фильтр по качеству жизни
      const qol = country.qualityOfLifeValue || 0;
      const matchesQol = qol >= minQoL;

      return matchesSearch && matchesCost && matchesQol;
    }).sort((a, b) => {
      // Сортировка по QoL по умолчанию
      const qolA = a.qualityOfLifeValue || 0;
      const qolB = b.qualityOfLifeValue || 0;
      return qolB - qolA;
    });
  }, [search, maxCostIndex, minQoL]);

  return (
    <div className="container">
      <header className="header">
        <h1>Nomad Destinations</h1>
        <p>Найти лучшую страну для жизни по вашему бюджету 🌍</p>
      </header>

      <section className="filters-section glass-panel">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по стране..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="sliders-grid">
          <div className="filter-group">
            <label>
              <span>Макс. Индекс стоимости жизни</span>
              <span>{maxCostIndex}</span>
            </label>
            <input
              type="range"
              min="20" max="150" step="5"
              value={maxCostIndex}
              onChange={(e) => setMaxCostIndex(Number(e.target.value))}
            />
          </div>

          <div className="filter-group">
            <label>
              <span>Мин. Качество жизни</span>
              <span>{minQoL}</span>
            </label>
            <input
              type="range"
              min="0" max="250" step="10"
              value={minQoL}
              onChange={(e) => setMinQoL(Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      <section className="cities-grid">
        {filteredCountries.map((country, idx) => {
          return (
            <article key={`${country.countryName}-${idx}`} className="city-card glass-panel fade-in" style={{ animationDelay: `${(idx % 20) * 0.05}s` }}>
              <div className="card-header">
                <h2 className="card-title">
                  {country.countryName}
                  <span style={{ fontSize: '1.2rem' }}>🏳️</span>
                </h2>
                <div className="card-subtitle">Country Stats</div>
              </div>

              <div className="card-body">
                <div className="stat-row">
                  <span className="stat-label">Индекс стоимости</span>
                  <span className="stat-value highlight">{country.costOfLivingIndex?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Индекс аренды</span>
                  <span className="stat-value">{country.rentIndex?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Продукты (Индекс)</span>
                  <span className="stat-value">{country.groceriesIndex?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Качество Жизни</span>
                  <span className="stat-value">{country.qualityOfLifeValue?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Безопасность</span>
                  <span className="stat-value">{country.safetyValue?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </article>
          )
        })}
        {filteredCountries.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <h3>Стран с такими параметрами не найдено 🏜️</h3>
            <p>Попробуйте увеличить допустимый индекс стоимости или снизить требования к качеству жизни.</p>
          </div>
        )}
      </section>
    </div>
  )
}
