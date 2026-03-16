import { useEffect } from 'react';
import type { CountryData } from '../types/country';
import { METRICS, SECTION_LABELS, SECTION_ORDER, formatValue } from '../types/country';

interface CountryModalProps {
  country: CountryData;
  onClose: () => void;
}

export default function CountryModal({ country, onClose }: CountryModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const metricsBySection = SECTION_ORDER.map(section => ({
    section,
    label: SECTION_LABELS[section],
    metrics: METRICS.filter(m => m.section === section),
  }));

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={country.countryName}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">&times;</button>

        <h2 className="modal-title">{country.countryName}</h2>
        {country.qualityOfLifeCategory && (
          <span className="modal-badge">QoL: {country.qualityOfLifeCategory}</span>
        )}

        {metricsBySection.map(({ section, label, metrics }) => {
          const hasData = metrics.some(m => country[m.key] !== null && country[m.key] !== undefined);
          if (!hasData) return null;

          return (
            <div key={section} className={`modal-section section-${section}`}>
              <h3>{label}</h3>
              <div className="modal-grid">
                {metrics.map(m => {
                  const val = country[m.key];
                  return (
                    <div key={m.key} className="mini-card">
                      <span className="stat-label">{m.label}</span>
                      <span className="stat-value">{formatValue(val, m.format)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
