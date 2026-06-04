import type { PeriodData, PeriodType } from '../data/financials';

interface Props {
  period: PeriodData;
  periodType: PeriodType;
}

const fmt = (v: number) => {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}B`;
  return `$${v.toFixed(1)}M`;
};

const fmtB = (v: number) => `$${(v / 1000).toFixed(1)}B`;
const fmtM = (v: number) => `$${v.toFixed(0)}M`;

const pct = (v: number, base: number) => `${((v / base) * 100).toFixed(1)}%`;

const annualMultiplier = (type: PeriodType) => type === 'month' ? 12 : type === 'quarter' ? 4 : 1;

export default function MetricCards({ period, periodType }: Props) {
  const gpMargin = period.grossProfit / period.revenue;
  const mult = annualMultiplier(periodType);
  const gtvRR = period.gtv * mult;
  const revRR = period.revenue * mult;

  const cards = [
    { label: 'GTV', value: fmt(period.gtv), sub: `Run rate: ${fmtB(gtvRR)}`, positive: true },
    { label: 'Revenue', value: fmt(period.revenue), sub: `Run rate: ${fmtM(revRR)} · Take rate: ${pct(period.revenue, period.gtv)}`, positive: true },
    { label: 'Gross Profit', value: fmt(period.grossProfit), sub: `Margin: ${pct(period.grossProfit, period.revenue)}`, positive: gpMargin > 0 },
    { label: 'EBITDA', value: fmt(period.ebitda), sub: `Margin: ${pct(period.ebitda, period.revenue)}`, positive: period.ebitda >= 0 },
    { label: 'Cash Balance (Pending reconciliation)', value: fmt(period.cashBalance), sub: null, positive: true },
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
