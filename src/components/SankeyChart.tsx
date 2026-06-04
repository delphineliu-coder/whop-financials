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
                fill="rgba(0,0,0,0.45)" fontSize={10} fontFamily="Inter, sans-serif">
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
  const LAYOUT_MIN = 220;
  const LAYOUT_MAX = 480;
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

    const gp = (sankeyNodes as any[]).find((n: any) => n.id === 'grossProfit');
    if (!gp) return null;

    const NODE_W = 24;
    const PAD   = 12;
    const { operatingIncome, otherIncome, netIncome, grossProfit, revenue } = period;
    const GREEN = '#00FF00';
    const RED   = '#FF0000';

    // Flow heights proportional to GP node height
    const scale     = gp.height / grossProfit;
    const opFlowH   = Math.max(8,  Math.abs(operatingIncome) * scale);
    const netFlowH  = Math.max(8,  Math.abs(netIncome)       * scale);
    const othrFlowH = Math.max(4,  Math.abs(otherIncome)     * scale);
    const showOther = Math.abs(otherIncome) > 0.01;

    const opNodeH  = Math.max(NODE_W, opFlowH);
    const netNodeH = Math.max(NODE_W, netFlowH);
    const othrNodeH = Math.max(NODE_W, othrFlowH);

    // ── GP extension (green) — elongates GP bar, Op Income exits from its bottom-left ──
    const gpExtY = gp.y + gp.height;
    const gpExtH = opFlowH;

    // Op Income node: left of GP, flushed to top of GP extension
    const opNodeX = Math.max(gp.x - 80 - NODE_W, 4);
    const opNodeY = gpExtY;

    // bezier: GP extension left edge → Op Income right edge
    const dx1 = (gp.x - (opNodeX + NODE_W)) * 0.5;
    const opLinkPath = [
      `M ${gp.x},${gpExtY}`,
      `C ${gp.x - dx1},${gpExtY} ${opNodeX + NODE_W + dx1},${opNodeY + (opNodeH - opFlowH) / 2} ${opNodeX + NODE_W},${opNodeY + (opNodeH - opFlowH) / 2}`,
      `L ${opNodeX + NODE_W},${opNodeY + (opNodeH + opFlowH) / 2}`,
      `C ${opNodeX + NODE_W + dx1},${opNodeY + (opNodeH + opFlowH) / 2} ${gp.x - dx1},${gpExtY + gpExtH} ${gp.x},${gpExtY + gpExtH}`,
      'Z',
    ].join(' ');

    // ── Op Income extension (red) — elongates Op Income, branches exit from here ──
    const opExtY = opNodeY + opNodeH;
    const opExtH = Math.max(netFlowH, showOther ? othrFlowH + 4 : 0);

    // Net Income: exits left from Op Income extension (negative = further left)
    const netColor  = netIncome >= 0 ? GREEN : RED;
    const netNodeX  = Math.max(opNodeX - 64 - NODE_W, 4);
    const netNodeY  = opExtY;
    const dx2 = (opNodeX - (netNodeX + NODE_W)) * 0.5;
    const netLinkPath = [
      `M ${opNodeX},${opExtY}`,
      `C ${opNodeX - dx2},${opExtY} ${netNodeX + NODE_W + dx2},${netNodeY + (netNodeH - netFlowH) / 2} ${netNodeX + NODE_W},${netNodeY + (netNodeH - netFlowH) / 2}`,
      `L ${netNodeX + NODE_W},${netNodeY + (netNodeH + netFlowH) / 2}`,
      `C ${netNodeX + NODE_W + dx2},${netNodeY + (netNodeH + netFlowH) / 2} ${opNodeX - dx2},${opExtY + netFlowH} ${opNodeX},${opExtY + netFlowH}`,
      'Z',
    ].join(' ');

    // Other Income: exits right from Op Income extension (positive → right, negative → left)
    const othrNodeX = opNodeX + NODE_W + 40;
    const othrNodeY = opExtY;
    const othrColor = otherIncome >= 0 ? GREEN : RED;
    const dx3 = (othrNodeX - (opNodeX + NODE_W)) * 0.5;
    const othrLinkPath = showOther ? [
      `M ${opNodeX + NODE_W},${opExtY}`,
      `C ${opNodeX + NODE_W + dx3},${opExtY} ${othrNodeX - dx3},${othrNodeY + (othrNodeH - othrFlowH) / 2} ${othrNodeX},${othrNodeY + (othrNodeH - othrFlowH) / 2}`,
      `L ${othrNodeX},${othrNodeY + (othrNodeH + othrFlowH) / 2}`,
      `C ${othrNodeX - dx3},${othrNodeY + (othrNodeH + othrFlowH) / 2} ${opNodeX + NODE_W + dx3},${opExtY + othrFlowH} ${opNodeX + NODE_W},${opExtY + othrFlowH}`,
      'Z',
    ].join(' ') : '';

    const opCY   = opNodeY + opNodeH / 2;
    const netCY  = netNodeY + netNodeH / 2;
    const othrCY = othrNodeY + othrNodeH / 2;
    const opRoom   = opNodeH   >= 18;
    const netRoom  = netNodeH  >= 18;
    const othrRoom = othrNodeH >= 18;

    return (
      <g>
        {/* GP extension — red for loss months, elongates GP bar downward */}
        <rect x={gp.x} y={gpExtY} width={NODE_W} height={gpExtH} fill={RED} />

        {/* GP extension → Op Income */}
        <path d={opLinkPath} fill={`${RED}55`} />

        {/* Op Income node */}
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
          fill="rgba(0,0,0,0.45)" fontSize={10} fontFamily="Inter, sans-serif">
          {revenue > 0 ? `${((operatingIncome / revenue) * 100).toFixed(1)}% of rev` : ''}
        </text>

        {/* Op Income extension — same red, elongates Op Income bar */}
        <rect x={opNodeX} y={opExtY} width={NODE_W} height={opExtH} fill={RED} />

        {/* Op Income extension → Net Income (leftward) */}
        <path d={netLinkPath} fill={`${netColor}55`} />
        <rect x={netNodeX} y={netNodeY} width={NODE_W} height={netNodeH} fill={netColor} rx={3} />
        {netRoom && (
          <text x={netNodeX - PAD} y={netCY - 13} textAnchor="end"
            fill={netColor} fontSize={11} fontFamily="Inter, sans-serif" opacity={0.85}>
            Net Income
          </text>
        )}
        <text x={netNodeX - PAD} y={netRoom ? netCY + 3 : netCY} textAnchor="end"
          fill="#111111" fontSize={12} fontWeight="700" fontFamily="Inter, sans-serif">
          {fmt(netIncome)}
        </text>
        <text x={netNodeX - PAD} y={netRoom ? netCY + 17 : netCY + 13} textAnchor="end"
          fill="rgba(0,0,0,0.45)" fontSize={10} fontFamily="Inter, sans-serif">
          {revenue > 0 ? `${((netIncome / revenue) * 100).toFixed(1)}% of rev` : ''}
        </text>

        {/* Op Income extension → Other Income (rightward, only when non-zero) */}
        {showOther && (
          <>
            <path d={othrLinkPath} fill={`${othrColor}55`} />
            <rect x={othrNodeX} y={othrNodeY} width={NODE_W} height={othrNodeH} fill={othrColor} rx={3} />
            {othrRoom && (
              <text x={othrNodeX + NODE_W + PAD} y={othrCY - 13} textAnchor="start"
                fill={othrColor} fontSize={11} fontFamily="Inter, sans-serif" opacity={0.85}>
                Other Income
              </text>
            )}
            <text x={othrNodeX + NODE_W + PAD} y={othrRoom ? othrCY + 3 : othrCY} textAnchor="start"
              fill="#111111" fontSize={12} fontWeight="700" fontFamily="Inter, sans-serif">
              {otherIncome > 0 ? '+' : ''}{fmt(otherIncome)}
            </text>
            <text x={othrNodeX + NODE_W + PAD} y={othrRoom ? othrCY + 17 : othrCY + 13} textAnchor="start"
              fill="rgba(0,0,0,0.45)" fontSize={10} fontFamily="Inter, sans-serif">
              {revenue > 0 ? `${((otherIncome / revenue) * 100).toFixed(1)}% of rev` : ''}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div style={{ height: containerH, width: '100%' }}>
      <ResponsiveSankey
        data={{ nodes: nivoNodes, links: nivoLinks }}
        margin={{ top: 20, right: 150, bottom: 200, left: 150 }}
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
