import { useEffect } from 'react';
import type { CountryData } from '../types/country';
import { METRICS, SECTION_LABELS, SECTION_ORDER, formatValue } from '../types/country';

interface ComparisonTableProps {
  countries: CountryData[];
  onClose: () => void;
}

function getBestIndex(values: (number | null)[], higherIsBetter: boolean): number {
  let bestIdx = -1;
  let bestVal: number | null = null;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v === null) continue;
    if (bestVal === null || (higherIsBetter ? v > bestVal : v < bestVal)) {
      bestVal = v;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export default function ComparisonTable({ countries, onClose }: ComparisonTableProps) {
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
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Сравнение стран">
      <div className="comparison-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">&times;</button>
        <h2 className="modal-title">Сравнение стран</h2>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Показатель</th>
                {countries.map(c => (
                  <th key={c.countryName}>{c.countryName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metricsBySection.map(({ section, label, metrics }) => {
                const sectionMetrics = metrics.filter(m =>
                  countries.some(c => c[m.key] !== null && c[m.key] !== undefined)
                );
                if (sectionMetrics.length === 0) return null;

                return [
                  <tr key={`section-${section}`} className={`section-header-row section-${section}`}>
                    <td colSpan={countries.length + 1}>{label}</td>
                  </tr>,
                  ...sectionMetrics.map(m => {
                    const values = countries.map(c => {
                      const v = c[m.key];
                      return typeof v === 'number' ? v : null;
                    });
                    const bestIdx = (m.format !== 'string' && m.format !== 'boolean')
                      ? getBestIndex(values, m.higherIsBetter)
                      : -1;

                    return (
                      <tr key={m.key}>
                        <td className="metric-label">{m.label}</td>
                        {countries.map((c, i) => (
                          <td
                            key={c.countryName}
                            className={i === bestIdx ? 'best-value' : ''}
                          >
                            {formatValue(c[m.key], m.format)}
                          </td>
                        ))}
                      </tr>
                    );
                  }),
                ];
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
