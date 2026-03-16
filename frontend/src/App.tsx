import { useState, useMemo } from 'react';
import './index.css';
// Импортируем нашу пред-собранную БД. 
// Vite соберет этот JSON прямо в JS бандл, что даст нам моментальную скорость без fetch.
import rawData from './assets/data/merged_db.json';

// Types (для автокомплита и безопасности)
interface City {
  name: string;
  rentUSD: number | null;
  salaryUSD: number | null;
  internetCostUSD: number | null;
  foodCostIndex: number | null;
  qolIndex: number | null;
}

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
  cities: City[];
}

// Flat structure для отрисовки карточек
interface FlatCityCard extends City {
  countryName: string;
  countryQualityOfLife: number | null;
  countrySafety: number | null;
}

export default function App() {
  const [search, setSearch] = useState('');
  const [maxRent, setMaxRent] = useState<number>(3000);
  const [minQoL, setMinQoL] = useState<number>(50);

  // Используем useMemo для мгновенной фильтрации на клиенте
  const filteredCities = useMemo(() => {
    const flatCities: FlatCityCard[] = [];

    // Раскатываем страны в плоский массив городов
    (rawData as CountryData[]).forEach(country => {
      country.cities.forEach(city => {
        flatCities.push({
          ...city,
          countryName: country.countryName,
          countryQualityOfLife: country.qualityOfLifeValue,
          countrySafety: country.safetyValue,
        });
      });
    });

    return flatCities.filter(city => {
      // 1. Поиск по тексту (город или страна)
      const matchesSearch = search === '' ||
        city.name.toLowerCase().includes(search.toLowerCase()) ||
        city.countryName.toLowerCase().includes(search.toLowerCase());

      // 2. Фильтр по аренде
      const matchesRent = city.rentUSD === null || city.rentUSD <= maxRent;

      // 3. Фильтр по качеству жизни (учитываем индекс города, если нет - страны)
      const qol = city.qolIndex || city.countryQualityOfLife || 0;
      const matchesQol = qol >= minQoL;

      return matchesSearch && matchesRent && matchesQol;
    }).sort((a, b) => {
      // Сортировка по QoL по умолчанию
      const qolA = a.qolIndex || a.countryQualityOfLife || 0;
      const qolB = b.qolIndex || b.countryQualityOfLife || 0;
      return qolB - qolA;
    });
  }, [search, maxRent, minQoL]);

  return (
    <div className="container">
      <header className="header">
        <h1>Nomad Destinations</h1>
        <p>Найти лучший город для жизни и работы по вашему бюджету 🌍</p>
      </header>

      <section className="filters-section glass-panel">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по городу или стране..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="sliders-grid">
          <div className="filter-group">
            <label>
              <span>Макс. Аренда (USD)</span>
              <span>${maxRent}</span>
            </label>
            <input
              type="range"
              min="200" max="5000" step="50"
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
            />
          </div>

          <div className="filter-group">
            <label>
              <span>Мин. Качество жизни (Индекс)</span>
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
        {filteredCities.map((city, idx) => {
          const qol = city.qolIndex || city.countryQualityOfLife;
          return (
            <article key={`${city.name}-${idx}`} className="city-card glass-panel fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="card-header">
                <h2 className="card-title">
                  {city.name}
                  <span style={{ fontSize: '1.2rem' }}>{city.qolIndex ? '🏙️' : '🏳️'}</span>
                </h2>
                <div className="card-subtitle">{city.countryName}</div>
              </div>

              <div className="card-body">
                <div className="stat-row">
                  <span className="stat-label">Аренда (1к)</span>
                  <span className="stat-value highlight">${city.rentUSD || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Зарплата (Сред.)</span>
                  <span className="stat-value">${city.salaryUSD || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Интернет (Мес.)</span>
                  <span className="stat-value">${city.internetCostUSD || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Качество Жизни</span>
                  <span className="stat-value">{qol?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Безопасность</span>
                  <span className="stat-value">{city.countrySafety?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </article>
          )
        })}
        {filteredCities.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <h3>Городов с такими параметрами не найдено 🏜️</h3>
            <p>Попробуйте увеличить бюджет на аренду или снизить требования к качеству жизни.</p>
          </div>
        )}
      </section>
    </div>
  )
}
