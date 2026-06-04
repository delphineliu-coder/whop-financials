export interface PeriodData {
  label: string;
  gtv: number;            // Gross Transaction Value ($M)
  revenue: number;        // Net Revenue ($M)
  grossProfit: number;
  badDebt: number;
  sm: number;             // Sales & Marketing OpEx
  rd: number;             // R&D OpEx
  ga: number;             // G&A OpEx
  operatingIncome: number; // row 51: Gross Profit - Total OpEx
  otherIncome: number;     // row 53: Total other income/(expense)
  ebitda: number;
  netIncome: number;       // row 55
}

export const MONTHS: PeriodData[] = [
  { label: 'Jan 2026', gtv: 248, revenue: 14.9, grossProfit: 5.9,  badDebt: 2.0, sm: 2.5, rd: 2.3, ga: 1.1, operatingIncome: -2.2, otherIncome:  0.3, ebitda: -1.9, netIncome: -1.9 },
  { label: 'Feb 2026', gtv: 254, revenue: 14.1, grossProfit: 5.4,  badDebt: 1.7, sm: 3.0, rd: 2.0, ga: 1.7, operatingIncome: -3.0, otherIncome:  0.0, ebitda: -3.0, netIncome: -3.0 },
  { label: 'Mar 2026', gtv: 308, revenue: 16.8, grossProfit: 6.0,  badDebt: 2.1, sm: 3.6, rd: 3.0, ga: 2.7, operatingIncome: -5.3, otherIncome:  0.5, ebitda: -4.8, netIncome: -4.8 },
  { label: 'Apr 2026', gtv: 336, revenue: 18.0, grossProfit: 6.9,  badDebt: 2.8, sm: 3.3, rd: 2.7, ga: 2.3, operatingIncome: -4.4, otherIncome:  0.3, ebitda: -4.3, netIncome: -4.1 },
  { label: 'May 2026', gtv: 353, revenue: 19.0, grossProfit: 7.4,  badDebt: 2.7, sm: 3.3, rd: 2.8, ga: 1.9, operatingIncome: -3.5, otherIncome:  0.0, ebitda: -3.5, netIncome: -3.5 },
  { label: 'Jun 2026', gtv: 461, revenue: 24.4, grossProfit: 8.3,  badDebt: 3.3, sm: 3.7, rd: 3.2, ga: 2.6, operatingIncome: -4.6, otherIncome:  0.0, ebitda: -4.5, netIncome: -4.6 },
  { label: 'Jul 2026', gtv: 523, revenue: 27.6, grossProfit: 9.3,  badDebt: 3.7, sm: 4.0, rd: 3.6, ga: 2.3, operatingIncome: -4.4, otherIncome:  0.0, ebitda: -4.4, netIncome: -4.4 },
  { label: 'Aug 2026', gtv: 591, revenue: 32.1, grossProfit: 11.2, badDebt: 4.1, sm: 4.6, rd: 4.2, ga: 2.4, operatingIncome: -4.1, otherIncome:  0.0, ebitda: -4.1, netIncome: -4.1 },
  { label: 'Sep 2026', gtv: 664, revenue: 37.3, grossProfit: 13.6, badDebt: 4.5, sm: 5.0, rd: 4.7, ga: 2.4, operatingIncome: -3.1, otherIncome:  0.0, ebitda: -3.1, netIncome: -3.1 },
  { label: 'Oct 2026', gtv: 761, revenue: 44.0, grossProfit: 16.5, badDebt: 4.8, sm: 5.5, rd: 4.8, ga: 2.3, operatingIncome: -1.0, otherIncome:  0.0, ebitda: -1.0, netIncome: -1.0 },
  { label: 'Nov 2026', gtv: 864, revenue: 51.9, grossProfit: 20.4, badDebt: 5.4, sm: 6.1, rd: 5.0, ga: 2.4, operatingIncome:  1.4, otherIncome:  0.0, ebitda:  1.4, netIncome:  1.4 },
  { label: 'Dec 2026', gtv: 976, revenue: 61.0, grossProfit: 25.1, badDebt: 6.0, sm: 6.7, rd: 5.2, ga: 2.5, operatingIncome:  4.5, otherIncome:  0.0, ebitda:  4.5, netIncome:  4.5 },
];

const sumPeriods = (periods: PeriodData[], label: string): PeriodData => ({
  label,
  gtv: periods.reduce((s, p) => s + p.gtv, 0),
  revenue: periods.reduce((s, p) => s + p.revenue, 0),
  grossProfit: periods.reduce((s, p) => s + p.grossProfit, 0),
  badDebt: periods.reduce((s, p) => s + p.badDebt, 0),
  sm: periods.reduce((s, p) => s + p.sm, 0),
  rd: periods.reduce((s, p) => s + p.rd, 0),
  ga: periods.reduce((s, p) => s + p.ga, 0),
  ebitda: periods.reduce((s, p) => s + p.ebitda, 0),
  netIncome: periods.reduce((s, p) => s + p.netIncome, 0),
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

// Jan–May 2026 are closed actuals; Jun 2026 onward are forecast.
const ACTUAL_MONTH_LABELS = new Set(['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026']);

export const getPeriodStatus = (label: string): PeriodStatus => {
  if (label === 'Q1 2026') return 'actual';          // Jan–Mar all actual
  if (label === 'Q2 2026') return 'partial';          // Apr–May actual, Jun forecast
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
  value: number;       // Sankey flow value — determines band width
  actualValue: number; // Real $ amount — shown in label (differs from value when OpEx is scaled)
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

const GREEN  = '#00FF00';
const RED    = '#FF0000';
const ORANGE = '#ff6423';  // Whop brand orange

const NODE_COLORS: Record<string, string> = {
  revenue:         ORANGE,
  costOfRevenue:   RED,
  grossProfit:     GREEN,
  sm:              RED,
  rd:              RED,
  ga:              RED,
  badDebt:         RED,
  operatingIncome: GREEN,
  netIncome:       GREEN,
};

const n = (id: string, label: string, value: number, actualValue: number, colorKey: string, category: string): SankeyNode => ({
  id, label, value, actualValue, color: NODE_COLORS[colorKey], category,
});

export const buildSankeyData = (period: PeriodData): SankeyData => {
  const { revenue, grossProfit, badDebt, sm, rd, ga } = period;

  // Layer 1: Revenue → Cost of Revenue (splits off) + Gross Profit (continues)
  const costOfRevenue = revenue - grossProfit;

  // Layer 2: Gross Profit → S&M + R&D + G&A + Bad Debt + Operating Income
  // OpEx scaled proportionally when their sum exceeds GP (loss months).
  const totalOpex = sm + rd + ga + badDebt;
  const scale = totalOpex > grossProfit ? grossProfit / totalOpex : 1;
  const smFlow = sm * scale;
  const rdFlow = rd * scale;
  const gaFlow = ga * scale;
  const bdFlow = badDebt * scale;
  const opFlow = Math.max(0, grossProfit - smFlow - rdFlow - gaFlow - bdFlow);

  const nodes: SankeyNode[] = [
    n('revenue',       'Revenue',         revenue,       revenue,       'revenue',       'revenue'),
    n('costOfRevenue', 'Cost of Revenue', costOfRevenue, costOfRevenue, 'costOfRevenue', 'cost'),
    n('grossProfit',   'Gross Profit',    grossProfit,   grossProfit,   'grossProfit',   'profit'),
    n('sm',            'S&M',             smFlow,        sm,            'sm',            'cost'),
    n('rd',            'R&D',             rdFlow,        rd,            'rd',            'cost'),
    n('ga',            'G&A',             gaFlow,        ga,            'ga',            'cost'),
    n('badDebt',       'Bad Debt',        bdFlow,        badDebt,       'badDebt',       'cost'),
  ];

  const links: SankeyLink[] = [
    { source: 'revenue',     target: 'costOfRevenue', value: costOfRevenue },
    { source: 'revenue',     target: 'grossProfit',   value: grossProfit },
    { source: 'grossProfit', target: 'sm',            value: smFlow },
    { source: 'grossProfit', target: 'rd',            value: rdFlow },
    { source: 'grossProfit', target: 'ga',            value: gaFlow },
    { source: 'grossProfit', target: 'badDebt',       value: bdFlow },
  ];

  // When Operating Income is positive: add it and Net Income as forward Sankey nodes.
  // When negative: SankeyChart's DownstreamLayer renders custom backward nodes.
  if (opFlow > 0.01) {
    nodes.push(n('operatingIncome', 'Operating Income', opFlow, period.operatingIncome, 'operatingIncome', 'profit'));
    links.push({ source: 'grossProfit', target: 'operatingIncome', value: opFlow });

    if (period.netIncome > 0.01) {
      const niFlow = Math.min(opFlow, period.netIncome);
      nodes.push(n('netIncome', 'Net Income', niFlow, period.netIncome, 'netIncome', 'profit'));
      links.push({ source: 'operatingIncome', target: 'netIncome', value: niFlow });
    }
  }

  return { nodes, links };
};
