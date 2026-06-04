import type { PeriodData } from '../data/financials';

interface Props {
  period: PeriodData;
}

const fmt = (v: number) => {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}B`;
  return `$${v.toFixed(1)}M`;
};

const pct = (v: number, base: number) => `${((v / base) * 100).toFixed(1)}%`;

export default function MetricCards({ period }: Props) {
  const gpMargin = period.grossProfit / period.revenue;

  const cards = [
    { label: 'GTV', value: fmt(period.gtv), sub: null, positive: true },
    { label: 'Revenue', value: fmt(period.revenue), sub: `Take rate: ${pct(period.revenue, period.gtv)}`, positive: true },
    { label: 'Gross Profit', value: fmt(period.grossProfit), sub: `Margin: ${pct(period.grossProfit, period.revenue)}`, positive: gpMargin > 0 },
    { label: 'EBITDA', value: fmt(period.ebitda), sub: `Margin: ${pct(period.ebitda, period.revenue)}`, positive: period.ebitda >= 0 },
  ];

  return (
    <div className="metric-cards">
      {cards.map(c => (
        <div key={c.label} className="metric-card">
          <div className="metric-label">{c.label}</div>
          <div className={`metric-value ${c.positive ? 'positive' : 'negative'}`}>{c.value}</div>
          {c.sub && <div className="metric-sub">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}
