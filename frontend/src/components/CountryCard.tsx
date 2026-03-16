import type { CountryData } from '../types/country';

interface CountryCardProps {
  country: CountryData;
  index: number;
  isCompared: boolean;
  onCardClick: (country: CountryData) => void;
  onCompareToggle: (country: CountryData) => void;
  compareDisabled: boolean;
}

export default function CountryCard({
  country, index, isCompared, onCardClick, onCompareToggle, compareDisabled,
}: CountryCardProps) {
  return (
    <article
      className={`city-card glass-panel fade-in${isCompared ? ' card-compared' : ''}`}
      style={{ animationDelay: `${(index % 20) * 0.05}s` }}
      onClick={() => onCardClick(country)}
    >
      <input
        type="checkbox"
        className="card-checkbox"
        checked={isCompared}
        disabled={compareDisabled && !isCompared}
        title={isCompared ? 'Убрать из сравнения' : 'Добавить в сравнение'}
        onChange={() => onCompareToggle(country)}
        onClick={(e) => e.stopPropagation()}
      />

      <div className="card-header">
        <h2 className="card-title">
          {country.countryName}
          <span style={{ fontSize: '1.2rem' }}>🏳️</span>
        </h2>
        <div className="card-subtitle">Статистика страны</div>
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
  );
}
