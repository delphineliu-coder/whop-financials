import { useNavigate, useLocation, useParams } from 'react-router-dom';
import type { PeriodData } from '../data/financials';

const NODE_LABELS: Record<string, string> = {
  gtv: 'Gross Transaction Value',
  merchantPayouts: 'Creator Payouts',
  revenue: 'Net Revenue',
  badDebt: 'Bad Debt',
  otherCogs: 'Other COGS',
  grossProfit: 'Gross Profit',
  sm: 'Sales & Marketing',
  rd: 'Research & Development',
  ga: 'General & Administrative',
  otherOpex: 'Other Operating Expenses',
  netIncome: 'Net Income',
  netLoss: 'Net Loss',
};

export default function NodeDetail() {
  const navigate = useNavigate();
  const { nodeId } = useParams<{ nodeId: string }>();
  const { state } = useLocation() as { state: { period: PeriodData; nodeId: string } };

  const label = NODE_LABELS[nodeId ?? ''] ?? nodeId;
  const period = state?.period;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Overview
      </button>
      <div className="detail-header">
        <h1>{label}</h1>
        <span className="detail-period">{period?.label}</span>
      </div>
      <div className="detail-placeholder">
        <div className="placeholder-icon">📊</div>
        <p>Detailed breakdown for <strong>{label}</strong> coming soon.</p>
        <p className="placeholder-sub">This page will show line-item GL detail, MoM trend, and team allocation.</p>
      </div>
    </div>
  );
}
