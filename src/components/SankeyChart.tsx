import { ResponsiveSankey } from '@nivo/sankey';
import type { PeriodData, PeriodType } from '../data/financials';
import { buildSankeyData, getPeriods } from '../data/financials';
import { useNavigate } from 'react-router-dom';

interface Props {
  period: PeriodData;
  periodType: PeriodType;
}

const fmt = (v: number) => {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}B`;
  return `$${v.toFixed(1)}M`;
};

const fmtPct = (v: number, base: number) => `${((v / base) * 100).toFixed(1)}%`;

// Three-line label: name · dollar value · % of revenue
const makeLabelsLayer = (
  nodeById: Record<string, { label: string; color: string; actualValue: number }>,
  revenue: number,
) =>
  function LabelsLayer({ nodes: sankeyNodes, width }: any) {
    const PAD = 16;
    return (
      <g>
        {(sankeyNodes as any[]).map((node: any) => {
          const isLeft = node.x < width / 2;
          const x = isLeft ? node.x - PAD : node.x + node.width + PAD;
          const cy = node.y + node.height / 2;
          const anchor = isLeft ? 'end' : 'start';
          const meta = nodeById[node.id];
          const color = meta?.color ?? '#cbd5e1';
          const actual = meta?.actualValue ?? node.value;
          const pct = revenue > 0 ? `${((actual / revenue) * 100).toFixed(1)}%` : '';
          const hasRoom = node.height >= 18;

          return (
            <g key={node.id}>
              {hasRoom && (
                <text x={x} y={cy - 13} textAnchor={anchor}
                  fill={color} fontSize={11} fontFamily="Inter, sans-serif" opacity={0.85}>
                  {meta?.label ?? node.id}
                </text>
              )}
              <text x={x} y={hasRoom ? cy + 3 : cy} textAnchor={anchor}
                fill="#111111" fontSize={12} fontWeight="700" fontFamily="Inter, sans-serif">
                {fmt(actual)}
              </text>
              <text x={x} y={hasRoom ? cy + 17 : cy + 13} textAnchor={anchor}
                fill="rgba(0,0,0,0.6)" fontSize={10} fontFamily="Inter, sans-serif">
                {pct}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

export default function SankeyChart({ period, periodType }: Props) {
  const navigate = useNavigate();
  // Scale layout height so the Revenue bar visibly reflects absolute magnitude.
  // Revenue fills the full layout height, so a taller chart = a taller bar.
  const maxRevenue = Math.max(...getPeriods(periodType).map(p => p.revenue));
  const LAYOUT_MIN = 540;
  const LAYOUT_MAX = 700;
  const layoutH = LAYOUT_MIN + (LAYOUT_MAX - LAYOUT_MIN) * (period.revenue / maxRevenue);
  const containerH = Math.round(layoutH) + 20 + 200; // + top margin + bottom margin

  const { nodes, links } = buildSankeyData(period);

  const nivoNodes = nodes.map(n => ({ id: n.id, nodeColor: n.color }));
  const nivoLinks = links.map(l => ({ source: l.source, target: l.target, value: Math.max(l.value, 0.001) }));
  const nodeById = Object.fromEntries(nodes.map(n => [n.id, { label: n.label, color: n.color, actualValue: n.actualValue }]));

  const LabelsLayer = makeLabelsLayer(nodeById, period.revenue);

  // For loss months: custom backward chain mirroring the GP structure.
  //   GP extension → Op Income node → Op Income extension → { Other Income, Net Income }
  // For profit months: Sankey handles the forward chain natively.
  const DownstreamLayer = ({ nodes: sankeyNodes }: any) => {
    if (period.operatingIncome >= 0) return null;

    const gp  = (sankeyNodes as any[]).find((n: any) => n.id === 'grossProfit');
    const rev = (sankeyNodes as any[]).find((n: any) => n.id === 'revenue');
    if (!gp) return null;
    const revFloor = rev ? rev.x + rev.width + 20 : 4;

    const NODE_W = 24;
    const PAD   = 12;
    const { operatingIncome, grossProfit, revenue } = period;
    const RED = '#FF0000';

    const scale   = gp.height / grossProfit;
    const opFlowH = Math.max(8, Math.abs(operatingIncome) * scale);
    const opNodeH = Math.max(NODE_W, opFlowH);

    const gpExtY  = gp.y + gp.height;
    const gpExtH  = opFlowH;

    const opNodeX = Math.max(gp.x - 80 - NODE_W, revFloor);
    const opNodeY = gpExtY;
    const opCY    = opNodeY + opNodeH / 2;
    const opRoom  = opNodeH >= 18;

    const dx1 = (gp.x - (opNodeX + NODE_W)) * 0.5;
    const opLinkPath = [
      `M ${gp.x},${gpExtY}`,
      `C ${gp.x - dx1},${gpExtY} ${opNodeX + NODE_W + dx1},${opNodeY + (opNodeH - opFlowH) / 2} ${opNodeX + NODE_W},${opNodeY + (opNodeH - opFlowH) / 2}`,
      `L ${opNodeX + NODE_W},${opNodeY + (opNodeH + opFlowH) / 2}`,
      `C ${opNodeX + NODE_W + dx1},${opNodeY + (opNodeH + opFlowH) / 2} ${gp.x - dx1},${gpExtY + gpExtH} ${gp.x},${gpExtY + gpExtH}`,
      'Z',
    ].join(' ');

    return (
      <g>
        <rect x={gp.x} y={gpExtY} width={NODE_W} height={gpExtH} fill={RED} />
        <path d={opLinkPath} fill={`${RED}55`} />
        <rect x={opNodeX} y={opNodeY} width={NODE_W} height={opNodeH} fill={RED} rx={3} />
        {opRoom && (
          <text x={opNodeX - PAD} y={opCY - 13} textAnchor="end"
            fill={RED} fontSize={11} fontFamily="Inter, sans-serif" opacity={0.85}>
            Operating Income
          </text>
        )}
        <text x={opNodeX - PAD} y={opRoom ? opCY + 3 : opCY} textAnchor="end"
          fill="#111111" fontSize={12} fontWeight="700" fontFamily="Inter, sans-serif">
          {fmt(operatingIncome)}
        </text>
        <text x={opNodeX - PAD} y={opRoom ? opCY + 17 : opCY + 13} textAnchor="end"
          fill="rgba(0,0,0,0.6)" fontSize={10} fontFamily="Inter, sans-serif">
          {revenue > 0 ? `${((operatingIncome / revenue) * 100).toFixed(1)}% of rev` : ''}
        </text>
      </g>
    );
  };

  return (
    <div style={{ height: containerH, width: '100%' }}>
      <ResponsiveSankey
        data={{ nodes: nivoNodes, links: nivoLinks }}
        margin={{ top: 20, right: 150, bottom: 200, left: 180 }}
        align="start"
        colors={node => nodeById[node.id]?.color ?? '#ff6423'}
        nodeOpacity={1}
        nodeHoverOpacity={1}
        nodeThickness={24}
        nodeSpacing={32}
        nodeBorderRadius={3}
        nodeBorderWidth={0}
        linkOpacity={0.45}
        linkHoverOpacity={0.75}
        linkBlendMode="normal"
        enableLinkGradient={true}
        enableLabels={false}
        layers={['links', 'nodes', LabelsLayer, DownstreamLayer, 'legends']}
        onClick={(node) => {
          if ('id' in node) {
            navigate(`/detail/${node.id}`, { state: { period, nodeId: node.id } });
          }
        }}
        nodeTooltip={({ node }) => {
          const meta = nodeById[String(node.id)];
          return (
            <div style={{
              background: '#ffffff',
              border: `1px solid ${node.color}40`,
              borderLeft: `3px solid ${node.color}`,
              borderRadius: 8,
              padding: '10px 14px',
              color: '#111111',
              fontSize: 13,
              minWidth: 200,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}>
              <div style={{ fontWeight: 700, color: node.color, marginBottom: 8, fontSize: 14 }}>
                {meta?.label ?? node.id}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 4 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>Value</span>
                <span style={{ fontWeight: 600 }}>{fmt(meta?.actualValue ?? node.value)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>% of Revenue</span>
                <span>{fmtPct(meta?.actualValue ?? node.value, period.revenue)}</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: '#ff6423', borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 8 }}>
                Click to drill down →
              </div>
            </div>
          );
        }}
        theme={{
          tooltip: { container: { background: 'transparent', boxShadow: 'none', padding: 0 } },
        }}
      />
    </div>
  );
}
