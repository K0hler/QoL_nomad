import type { CountryData } from '../types/country';

interface ComparisonPanelProps {
  countries: CountryData[];
  onRemove: (countryName: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export default function ComparisonPanel({ countries, onRemove, onCompare, onClear }: ComparisonPanelProps) {
  if (countries.length === 0) return null;

  return (
    <div className="comparison-panel glass-panel">
      <div className="comparison-panel-info">
        <span className="comparison-panel-count">Выбрано: {countries.length} из 4</span>
        <div className="comparison-panel-chips">
          {countries.map(c => (
            <span key={c.countryName} className="country-chip">
              {c.countryName}
              <button className="chip-remove" onClick={() => onRemove(c.countryName)}>&times;</button>
            </span>
          ))}
        </div>
      </div>
      <div className="comparison-panel-actions">
        <button
          className="btn-compare"
          disabled={countries.length < 2}
          onClick={onCompare}
        >
          Сравнить →
        </button>
        <button className="btn-clear" onClick={onClear}>Очистить</button>
      </div>
    </div>
  );
}
