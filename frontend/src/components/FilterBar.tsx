interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  maxCostIndex: number;
  onMaxCostChange: (value: number) => void;
  minQoL: number;
  onMinQoLChange: (value: number) => void;
  onGlossaryOpen: () => void;
}

export default function FilterBar({
  search, onSearchChange,
  maxCostIndex, onMaxCostChange,
  minQoL, onMinQoLChange,
  onGlossaryOpen,
}: FilterBarProps) {
  return (
    <section className="filters-section glass-panel">
      <input
        type="text"
        className="search-input"
        placeholder="Поиск по стране..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
            onChange={(e) => onMaxCostChange(Number(e.target.value))}
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
            onChange={(e) => onMinQoLChange(Number(e.target.value))}
          />
        </div>
      </div>

      <button type="button" className="glossary-btn" onClick={onGlossaryOpen}>
        &#9432; Справочник показателей
      </button>
    </section>
  );
}
