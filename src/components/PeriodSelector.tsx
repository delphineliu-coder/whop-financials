import type { PeriodType } from '../data/financials';
import { getPeriods } from '../data/financials';

interface Props {
  periodType: PeriodType;
  periodIndex: number;
  onTypeChange: (type: PeriodType) => void;
  onIndexChange: (index: number) => void;
}

const TYPES: { key: PeriodType; label: string }[] = [
  { key: 'month', label: 'Month' },
  { key: 'quarter', label: 'Quarter' },
  { key: 'year', label: 'Year' },
];

export default function PeriodSelector({ periodType, periodIndex, onTypeChange, onIndexChange }: Props) {
  const periods = getPeriods(periodType);

  return (
    <div className="period-selector">
      <div className="type-tabs">
        {TYPES.map(({ key, label }) => (
          <button
            key={key}
            className={`tab-btn ${periodType === key ? 'active' : ''}`}
            onClick={() => { onTypeChange(key); onIndexChange(0); }}
          >
            {label}
          </button>
        ))}
      </div>
      <select
        className="period-select"
        value={periodIndex}
        onChange={e => onIndexChange(Number(e.target.value))}
      >
        {periods.map((p, i) => (
          <option key={i} value={i}>{p.label}</option>
        ))}
      </select>
    </div>
  );
}
