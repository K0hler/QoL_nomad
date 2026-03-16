import { useEffect } from 'react';
import { METRICS, SECTION_LABELS, SECTION_ORDER } from '../types/country';

interface GlossaryModalProps {
  onClose: () => void;
}

export default function GlossaryModal({ onClose }: GlossaryModalProps) {
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
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Справочник показателей">
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">&times;</button>

        <h2 className="modal-title">Справочник показателей</h2>

        {metricsBySection.map(({ section, label, metrics }) => (
          <div key={section} className={`modal-section section-${section}`}>
            <h3>{label}</h3>
            <div className="glossary-list">
              {metrics.map(m => (
                <div key={m.key} className="glossary-item">
                  <div className="glossary-term">{m.label}</div>
                  <div className="glossary-def">{m.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
