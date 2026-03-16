import { useState, useMemo, useCallback } from 'react';
import './index.css';
import rawData from './assets/data/merged_db.json';
import type { CountryData } from './types/country';
import FilterBar from './components/FilterBar';
import CountryCard from './components/CountryCard';
import CountryModal from './components/CountryModal';
import ComparisonPanel from './components/ComparisonPanel';
import ComparisonTable from './components/ComparisonTable';

export default function App() {
  const [search, setSearch] = useState('');
  const [maxCostIndex, setMaxCostIndex] = useState<number>(80);
  const [minQoL, setMinQoL] = useState<number>(100);

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [comparedCountries, setComparedCountries] = useState<CountryData[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const filteredCountries = useMemo(() => {
    const data = rawData as CountryData[];

    return data.filter(country => {
      const matchesSearch = search === '' ||
        country.countryName.toLowerCase().includes(search.toLowerCase());

      const costIndex = country.costOfLivingIndex || 0;
      const matchesCost = costIndex > 0 && costIndex <= maxCostIndex;

      const qol = country.qualityOfLifeValue || 0;
      const matchesQol = qol >= minQoL;

      return matchesSearch && matchesCost && matchesQol;
    }).sort((a, b) => {
      const qolA = a.qualityOfLifeValue || 0;
      const qolB = b.qualityOfLifeValue || 0;
      return qolB - qolA;
    });
  }, [search, maxCostIndex, minQoL]);

  const handleCardClick = useCallback((country: CountryData) => {
    setSelectedCountry(country);
  }, []);

  const handleCompareToggle = useCallback((country: CountryData) => {
    setComparedCountries(prev => {
      const exists = prev.some(c => c.countryName === country.countryName);
      if (exists) return prev.filter(c => c.countryName !== country.countryName);
      if (prev.length >= 4) return prev;
      return [...prev, country];
    });
  }, []);

  const handleRemoveCompared = useCallback((countryName: string) => {
    setComparedCountries(prev => prev.filter(c => c.countryName !== countryName));
  }, []);

  const handleClearCompared = useCallback(() => {
    setComparedCountries([]);
  }, []);

  const handleCompare = useCallback(() => {
    setShowComparison(true);
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Nomad Destinations</h1>
        <p>Найти лучшую страну для жизни по вашему бюджету 🌍</p>
      </header>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        maxCostIndex={maxCostIndex}
        onMaxCostChange={setMaxCostIndex}
        minQoL={minQoL}
        onMinQoLChange={setMinQoL}
      />

      <section className="cities-grid">
        {filteredCountries.map((country, idx) => (
          <CountryCard
            key={country.countryName}
            country={country}
            index={idx}
            isCompared={comparedCountries.some(c => c.countryName === country.countryName)}
            onCardClick={handleCardClick}
            onCompareToggle={handleCompareToggle}
            compareDisabled={comparedCountries.length >= 4}
          />
        ))}
        {filteredCountries.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <h3>Стран с такими параметрами не найдено 🏜️</h3>
            <p>Попробуйте увеличить допустимый индекс стоимости или снизить требования к качеству жизни.</p>
          </div>
        )}
      </section>

      <ComparisonPanel
        countries={comparedCountries}
        onRemove={handleRemoveCompared}
        onCompare={handleCompare}
        onClear={handleClearCompared}
      />

      {selectedCountry && (
        <CountryModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}

      {showComparison && (
        <ComparisonTable
          countries={comparedCountries}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
