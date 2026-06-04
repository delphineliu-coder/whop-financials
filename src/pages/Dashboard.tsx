import { useState } from 'react';
import PeriodSelector from '../components/PeriodSelector';
import SankeyChart from '../components/SankeyChart';
import MetricCards from '../components/MetricCards';
import type { PeriodType } from '../data/financials';
import { getPeriods, getPeriodStatus } from '../data/financials';

const STATUS_CONFIG = {
  actual:   { label: 'ACTUAL',   color: '#00A800', bg: 'rgba(0,168,0,0.1)',   border: 'rgba(0,168,0,0.3)'   },
  forecast: { label: 'FORECAST', color: '#ff6423', bg: 'rgba(255,100,35,0.1)', border: 'rgba(255,100,35,0.3)' },
  partial:  { label: 'PARTIAL',  color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
};

export default function Dashboard() {
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [periodIndex, setPeriodIndex] = useState(0);

  const period = getPeriods(periodType)[periodIndex];
  const status = getPeriodStatus(period.label);
  const sc = STATUS_CONFIG[status];

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <div className="logo">⬡ Whop Financials</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 16px',
            background: sc.bg,
            border: `1px solid ${sc.border}`,
            borderRadius: 999,
            color: sc.color,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '1px',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.color, flexShrink: 0 }} />
            {sc.label}
          </div>
          <PeriodSelector
            periodType={periodType}
            periodIndex={periodIndex}
            onTypeChange={setPeriodType}
            onIndexChange={setPeriodIndex}
          />
        </div>
      </header>

      <main className="main">
        <MetricCards period={period} periodType={periodType} />
        <div className="chart-container">
          <div className="chart-hint">Click any node to drill into line-item detail</div>
          <SankeyChart period={period} periodType={periodType} />
        </div>
      </main>
    </div>
  );
}
