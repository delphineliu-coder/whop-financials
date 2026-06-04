export interface PeriodData {
  label: string;
  gtv: number;            // Gross Transaction Value ($M)
  revenue: number;        // Net Revenue ($M)
  grossProfit: number;
  badDebt: number;
  sm: number;             // Sales & Marketing OpEx
  rd: number;             // R&D OpEx
  ga: number;             // G&A OpEx
  operatingIncome: number;
  otherIncome: number;
  ebitda: number;
  netIncome: number;
  cashBalance: number;    // End-of-period cash balance ($M)
  // Revenue breakdown (rows 19-25 of spreadsheet)
  payins: number;
  payouts: number;
  platformFees: number;
  ads: number;
  wallet: number;
  ai: number;
  affiliate: number;
}

export const MONTHS: PeriodData[] = [
  { label: 'Jan 2026', gtv: 248, revenue: 14.9, grossProfit: 5.9,  badDebt: 2.0, sm: 2.5, rd: 2.3, ga: 1.1, operatingIncome: -2.2, otherIncome:  0.3, ebitda: -1.9, netIncome: -1.9, cashBalance:  23.3, payins: 14.0, payouts: 0.7, platformFees: 0.2, ads: 0.1, wallet: 0.0, ai: 0.0, affiliate: 0.0 },
  { label: 'Feb 2026', gtv: 254, revenue: 14.1, grossProfit: 5.4,  badDebt: 1.7, sm: 3.0, rd: 2.0, ga: 1.7, operatingIncome: -3.0, otherIncome:  0.0, ebitda: -3.0, netIncome: -3.0, cashBalance: 121.7, payins: 13.2, payouts: 0.7, platformFees: 0.1, ads: 0.0, wallet: 0.0, ai: 0.0, affiliate: 0.0 },
  { label: 'Mar 2026', gtv: 308, revenue: 16.8, grossProfit: 6.0,  badDebt: 2.1, sm: 3.6, rd: 3.0, ga: 2.7, operatingIncome: -5.3, otherIncome:  0.5, ebitda: -4.8, netIncome: -4.8, cashBalance: 121.2, payins: 15.9, payouts: 0.8, platformFees: 0.1, ads: 0.0, wallet: 0.0, ai: 0.0, affiliate: 0.0 },
  { label: 'Apr 2026', gtv: 336, revenue: 18.0, grossProfit: 6.9,  badDebt: 2.8, sm: 3.3, rd: 2.7, ga: 2.3, operatingIncome: -4.4, otherIncome:  0.3, ebitda: -4.3, netIncome: -4.1, cashBalance: 114.8, payins: 16.9, payouts: 0.8, platformFees: 0.1, ads: 0.0, wallet: 0.0, ai: 0.0, affiliate: 0.1 },
  { label: 'May 2026', gtv: 353, revenue: 19.0, grossProfit: 7.3,  badDebt: 2.7, sm: 3.3, rd: 2.8, ga: 1.9, operatingIncome: -3.5, otherIncome:  0.0, ebitda: -3.5, netIncome: -3.5, cashBalance: 111.3, payins: 17.9, payouts: 0.9, platformFees: 0.1, ads: 0.1, wallet: 0.1, ai: 0.0, affiliate: 0.0 },
  { label: 'Jun 2026', gtv: 461, revenue: 24.4, grossProfit: 8.3,  badDebt: 3.3, sm: 3.7, rd: 3.2, ga: 2.6, operatingIncome: -4.6, otherIncome:  0.0, ebitda: -4.5, netIncome: -4.6, cashBalance: 106.8, payins: 20.3, payouts: 0.9, platformFees: 0.1, ads: 2.7, wallet: 0.4, ai: 0.0, affiliate: 0.0 },
  { label: 'Jul 2026', gtv: 523, revenue: 27.6, grossProfit: 9.3,  badDebt: 3.7, sm: 4.0, rd: 3.6, ga: 2.3, operatingIncome: -4.4, otherIncome:  0.0, ebitda: -4.4, netIncome: -4.4, cashBalance: 102.4, payins: 21.6, payouts: 1.0, platformFees: 0.1, ads: 4.4, wallet: 0.5, ai: 0.0, affiliate: 0.0 },
  { label: 'Aug 2026', gtv: 591, revenue: 32.1, grossProfit: 11.2, badDebt: 4.1, sm: 4.6, rd: 4.2, ga: 2.4, operatingIncome: -4.1, otherIncome:  0.0, ebitda: -4.1, netIncome: -4.1, cashBalance:  98.3, payins: 24.1, payouts: 1.1, platformFees: 0.1, ads: 6.3, wallet: 0.6, ai: 0.0, affiliate: 0.0 },
  { label: 'Sep 2026', gtv: 664, revenue: 37.3, grossProfit: 13.6, badDebt: 4.5, sm: 5.0, rd: 4.7, ga: 2.4, operatingIncome: -3.1, otherIncome:  0.0, ebitda: -3.1, netIncome: -3.1, cashBalance:  95.2, payins: 26.8, payouts: 1.2, platformFees: 0.1, ads: 8.7, wallet: 0.6, ai: 0.0, affiliate: 0.0 },
  { label: 'Oct 2026', gtv: 761, revenue: 44.0, grossProfit: 16.5, badDebt: 4.8, sm: 5.5, rd: 4.8, ga: 2.3, operatingIncome: -1.0, otherIncome:  0.0, ebitda: -1.0, netIncome: -1.0, cashBalance:  94.2, payins: 29.4, payouts: 1.3, platformFees: 0.1, ads: 12.4, wallet: 0.7, ai: 0.0, affiliate: 0.0 },
  { label: 'Nov 2026', gtv: 864, revenue: 51.9, grossProfit: 20.4, badDebt: 5.4, sm: 6.1, rd: 5.0, ga: 2.4, operatingIncome:  1.4, otherIncome:  0.0, ebitda:  1.4, netIncome:  1.4, cashBalance:  95.6, payins: 33.1, payouts: 1.5, platformFees: 0.1, ads: 16.5, wallet: 0.8, ai: 0.0, affiliate: 0.0 },
  { label: 'Dec 2026', gtv: 976, revenue: 61.0, grossProfit: 25.1, badDebt: 6.0, sm: 6.7, rd: 5.2, ga: 2.5, operatingIncome:  4.5, otherIncome:  0.0, ebitda:  4.5, netIncome:  4.5, cashBalance: 100.1, payins: 36.9, payouts: 1.6, platformFees: 0.2, ads: 21.4, wallet: 0.8, ai: 0.0, affiliate: 0.0 },
];

const sumPeriods = (periods: PeriodData[], label: string): PeriodData => ({
  label,
  gtv:             periods.reduce((s, p) => s + p.gtv, 0),
  revenue:         periods.reduce((s, p) => s + p.revenue, 0),
  grossProfit:     periods.reduce((s, p) => s + p.grossProfit, 0),
  badDebt:         periods.reduce((s, p) => s + p.badDebt, 0),
  sm:              periods.reduce((s, p) => s + p.sm, 0),
  rd:              periods.reduce((s, p) => s + p.rd, 0),
  ga:              periods.reduce((s, p) => s + p.ga, 0),
  operatingIncome: periods.reduce((s, p) => s + p.operatingIncome, 0),
  otherIncome:     periods.reduce((s, p) => s + p.otherIncome, 0),
  ebitda:          periods.reduce((s, p) => s + p.ebitda, 0),
  netIncome:       periods.reduce((s, p) => s + p.netIncome, 0),
  cashBalance:     periods[periods.length - 1].cashBalance,  // end-of-period balance
  payins:          periods.reduce((s, p) => s + p.payins, 0),
  payouts:         periods.reduce((s, p) => s + p.payouts, 0),
  platformFees:    periods.reduce((s, p) => s + p.platformFees, 0),
  ads:             periods.reduce((s, p) => s + p.ads, 0),
  wallet:          periods.reduce((s, p) => s + p.wallet, 0),
  ai:              periods.reduce((s, p) => s + p.ai, 0),
  affiliate:       periods.reduce((s, p) => s + p.affiliate, 0),
});

export const QUARTERS: PeriodData[] = [
  sumPeriods(MONTHS.slice(0, 3), 'Q1 2026'),
  sumPeriods(MONTHS.slice(3, 6), 'Q2 2026'),
  sumPeriods(MONTHS.slice(6, 9), 'Q3 2026'),
  sumPeriods(MONTHS.slice(9, 12), 'Q4 2026'),
];

export const YEARLY: PeriodData[] = [
  sumPeriods(MONTHS, 'FY 2026'),
];

export type PeriodType = 'month' | 'quarter' | 'year';
export type PeriodStatus = 'actual' | 'forecast' | 'partial';

const ACTUAL_MONTH_LABELS = new Set(['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026']);

export const getPeriodStatus = (label: string): PeriodStatus => {
  if (label === 'Q1 2026') return 'actual';
  if (label === 'Q2 2026') return 'partial';
  if (label.startsWith('Q')) return 'forecast';
  if (label.startsWith('FY')) return 'partial';
  return ACTUAL_MONTH_LABELS.has(label) ? 'actual' : 'forecast';
};

export const getPeriods = (type: PeriodType): PeriodData[] => {
  if (type === 'month') return MONTHS;
  if (type === 'quarter') return QUARTERS;
  return YEARLY;
};

export interface SankeyNode {
  id: string;
  label: string;
  value: number;
  actualValue: number;
  color: string;
  category: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

const GREEN  = '#00A800';
const RED    = '#FF0000';
const ORANGE = '#ff6423';

const NODE_COLORS: Record<string, string> = {
  revenue:         ORANGE,
  costOfRevenue:   RED,
  grossProfit:     GREEN,
  sm:              RED,
  rd:              RED,
  ga:              RED,
  badDebt:         RED,
  operatingIncome: GREEN,
  // Revenue sources
  payins:          '#FF6423',
  payouts:         '#F59E0B',
  platformFees:    '#8B5CF6',
  ads:             '#EC4899',
  wallet:          '#06B6D4',
  ai:              '#3B82F6',
  affiliate:       '#D946EF',
};

const n = (id: string, label: string, value: number, actualValue: number, colorKey: string, category: string): SankeyNode => ({
  id, label, value, actualValue, color: NODE_COLORS[colorKey] ?? ORANGE, category,
});

export const buildSankeyData = (period: PeriodData): SankeyData => {
  const { revenue, grossProfit, badDebt, sm, rd, ga } = period;

  const costOfRevenue = revenue - grossProfit;
  const totalOpex = sm + rd + ga + badDebt;
  const scale = totalOpex > grossProfit ? grossProfit / totalOpex : 1;
  const smFlow = sm * scale;
  const rdFlow = rd * scale;
  const gaFlow = ga * scale;
  const bdFlow = badDebt * scale;
  const opFlow = Math.max(0, grossProfit - smFlow - rdFlow - gaFlow - bdFlow);

  const revSources = [
    { id: 'payins',       label: 'Payins',        value: period.payins },
    { id: 'payouts',      label: 'Payouts',       value: period.payouts },
    { id: 'platformFees', label: 'Platform Fees', value: period.platformFees },
    { id: 'ads',          label: 'Ads',           value: period.ads },
    { id: 'wallet',       label: 'Wallet',        value: period.wallet },
    { id: 'ai',           label: 'AI',            value: period.ai },
    { id: 'affiliate',    label: 'Affiliate',     value: period.affiliate },
  ].filter(s => s.value > 0.005);

  const nodes: SankeyNode[] = [
    ...revSources.map(s => n(s.id, s.label, s.value, s.value, s.id, 'revenueSource')),
    n('revenue',       'Revenue',         revenue,       revenue,       'revenue',       'revenue'),
    n('costOfRevenue', 'Cost of Revenue', costOfRevenue, costOfRevenue, 'costOfRevenue', 'cost'),
    n('grossProfit',   'Gross Profit',    grossProfit,   grossProfit,   'grossProfit',   'profit'),
    n('sm',            'S&M',             smFlow,        sm,            'sm',            'cost'),
    n('rd',            'R&D',             rdFlow,        rd,            'rd',            'cost'),
    n('ga',            'G&A',             gaFlow,        ga,            'ga',            'cost'),
    n('badDebt',       'Bad Debt',        bdFlow,        badDebt,       'badDebt',       'cost'),
  ];

  const links: SankeyLink[] = [
    ...revSources.map(s => ({ source: s.id, target: 'revenue', value: s.value })),
    { source: 'revenue',     target: 'costOfRevenue', value: costOfRevenue },
    { source: 'revenue',     target: 'grossProfit',   value: grossProfit },
    { source: 'grossProfit', target: 'sm',            value: smFlow },
    { source: 'grossProfit', target: 'rd',            value: rdFlow },
    { source: 'grossProfit', target: 'ga',            value: gaFlow },
    { source: 'grossProfit', target: 'badDebt',       value: bdFlow },
  ];

  if (opFlow > 0.01) {
    nodes.push(n('operatingIncome', 'Operating Income', opFlow, period.operatingIncome, 'operatingIncome', 'profit'));
    links.push({ source: 'grossProfit', target: 'operatingIncome', value: opFlow });
  }

  return { nodes, links };
};
