import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MONTHS } from '../data/financials';

const ORANGE = '#ff6423';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';

const fmtM = (v: number) => v >= 0 ? `$${v.toFixed(1)}M` : `-$${Math.abs(v).toFixed(1)}M`;
const fmtX = (v: number) => `${v.toFixed(2)}x`;

export default function OperatingIncomeDetail() {
  const navigate = useNavigate();
  const [hover, setHover] = useState<number | null>(null);

  const rev  = MONTHS.map(m => m.revenue);
  const ebit = MONTHS.map(m => m.ebitda);
  const burn = MONTHS.map(m => m.burnMultiple ?? 0);

  const W = 880, H = 300;
  const MT = 20, MB = 36, ML = 60, MR = 64;
  const CW = W - ML - MR, CH = H - MT - MB;
  const N  = MONTHS.length;
  const xAt = (i: number) => ML + (i / (N - 1)) * CW;

  // Left axis: Revenue + EBITDA
  const lMin = -10, lMax = 60, lRange = lMax - lMin;
  const yL = (v: number) => MT + CH * (1 - (v - lMin) / lRange);

  // Right axis: Burn Multiple — symmetric around zero
  const bAbs = Math.max(...burn.map(Math.abs));
  const bCeil = Math.ceil(bAbs / 0.5) * 0.5;
  const bMin = -bCeil, bMax = bCeil, bRange = bMax - bMin;
  const yR = (v: number) => MT + CH * (1 - (v - bMin) / bRange);

  const mkPath = (vals: number[], fn: (v: number) => number) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${fn(v).toFixed(1)}`).join(' ');

  const lTicks = [-10, 0, 20, 40, 60];
  const bStep  = bCeil / 2;
  const bTicks = [-bCeil, -bStep, 0, bStep, bCeil];

  const isActual = (i: number) => i < 5;
  const slotW = CW / (N - 1);

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Overview</button>
      <div className="detail-header">
        <h1>Operating Performance</h1>
        <span className="detail-period">FY 2026 · Monthly</span>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.07)',
        padding: '20px 8px 8px',
      }}>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, paddingLeft: ML + 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {([
            { c: ORANGE, label: 'Revenue ($M)',              dashed: false },
            { c: BLUE,   label: 'EBITDA ($M)',               dashed: false },
            { c: PURPLE, label: 'Burn Multiple ×  (right →)', dashed: true  },
          ] as const).map(({ c, label, dashed }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>
              <svg width={28} height={14} style={{ flexShrink: 0 }}>
                <line x1={0} y1={7} x2={28} y2={7} stroke={c} strokeWidth={2.5}
                  strokeDasharray={dashed ? '5 3' : undefined} />
                <circle cx={14} cy={7} r={3.5}
                  fill={dashed ? '#fff' : c} stroke={c} strokeWidth={dashed ? 1.5 : 0} />
              </svg>
              {label}
            </div>
          ))}
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseLeave={() => setHover(null)}>

          {/* Forecast shading */}
          <rect x={xAt(4) + slotW * 0.5} y={MT} width={ML + CW - (xAt(4) + slotW * 0.5)} height={CH}
            fill="rgba(59,130,246,0.07)" />
          <text x={ML + 5} y={MT + 14} fontSize={9} fill="rgba(0,0,0,0.3)"
            fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.5">ACTUAL</text>
          <text x={xAt(5) + 5} y={MT + 14} fontSize={9} fill="rgba(59,130,246,0.5)"
            fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.5">FORECAST</text>

          {/* Zero line */}
          <line x1={ML} x2={ML + CW} y1={yL(0)} y2={yL(0)}
            stroke="rgba(0,0,0,0.15)" strokeWidth={1} />

          {/* Background grid */}
          {lTicks.filter(v => v !== 0).map(v => (
            <line key={v} x1={ML} x2={ML + CW} y1={yL(v)} y2={yL(v)}
              stroke="rgba(0,0,0,0.05)" strokeWidth={0.5} />
          ))}

          {/* Revenue line + dots */}
          <path d={mkPath(rev, yL)} fill="none" stroke={ORANGE} strokeWidth={2.5} strokeLinejoin="round" />
          {rev.map((v, i) => (
            isActual(i)
              ? <circle key={i} cx={xAt(i)} cy={yL(v)} r={4} fill={ORANGE} />
              : <circle key={i} cx={xAt(i)} cy={yL(v)} r={3.5} fill="#fff" stroke={ORANGE} strokeWidth={2} />
          ))}

          {/* EBITDA line + dots */}
          <path d={mkPath(ebit, yL)} fill="none" stroke={BLUE} strokeWidth={2.5} strokeLinejoin="round" />
          {ebit.map((v, i) => (
            isActual(i)
              ? <circle key={i} cx={xAt(i)} cy={yL(v)} r={4} fill={BLUE} />
              : <circle key={i} cx={xAt(i)} cy={yL(v)} r={3.5} fill="#fff" stroke={BLUE} strokeWidth={2} />
          ))}

          {/* Burn Multiple line + dots */}
          <path d={mkPath(burn, yR)} fill="none" stroke={PURPLE} strokeWidth={2} strokeLinejoin="round" strokeDasharray="6 3" />
          {burn.map((v, i) => (
            isActual(i)
              ? <circle key={i} cx={xAt(i)} cy={yR(v)} r={3.5} fill={PURPLE} />
              : <circle key={i} cx={xAt(i)} cy={yR(v)} r={3} fill="#fff" stroke={PURPLE} strokeWidth={1.5} />
          ))}

          {/* Hover hit areas */}
          {MONTHS.map((_, i) => (
            <rect key={i} x={xAt(i) - slotW / 2} y={MT} width={slotW} height={CH}
              fill="transparent" onMouseEnter={() => setHover(i)}
              style={{ cursor: 'crosshair' }} />
          ))}

          {/* Hover indicator + tooltip */}
          {hover !== null && (() => {
            const xi = xAt(hover);
            const m  = MONTHS[hover];
            const TW = 156, TH = 82, PAD = 10;
            const toRight = hover <= N / 2;
            const tx = toRight ? xi + PAD : xi - PAD - TW;
            const ty = MT + 4;
            return (
              <g>
                <line x1={xi} x2={xi} y1={MT} y2={MT + CH}
                  stroke="rgba(0,0,0,0.18)" strokeWidth={1} strokeDasharray="4 3" />
                <rect x={tx} y={ty} width={TW} height={TH} rx={7}
                  fill="#fff" stroke="rgba(0,0,0,0.08)"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }} />
                <text x={tx + 10} y={ty + 17} fontSize={11} fontWeight="700"
                  fill="#111" fontFamily="Inter,sans-serif">{m.label}</text>
                <text x={tx + 10} y={ty + 34} fontSize={10} fontWeight="600"
                  fill={ORANGE} fontFamily="Inter,sans-serif">Revenue: {fmtM(rev[hover])}</text>
                <text x={tx + 10} y={ty + 50} fontSize={10} fontWeight="600"
                  fill={BLUE} fontFamily="Inter,sans-serif">EBITDA: {fmtM(ebit[hover])}</text>
                <text x={tx + 10} y={ty + 66} fontSize={10} fontWeight="600"
                  fill={PURPLE} fontFamily="Inter,sans-serif">Burn Multiple: {fmtX(burn[hover])}</text>
              </g>
            );
          })()}

          {/* Left Y-axis labels */}
          {lTicks.map(v => (
            <text key={v} x={ML - 6} y={yL(v) + 4} textAnchor="end"
              fontSize={10} fill="rgba(0,0,0,0.45)" fontFamily="Inter,sans-serif" fontWeight="600">
              {v >= 0 ? `$${v}M` : `-$${Math.abs(v)}M`}
            </text>
          ))}

          {/* Right Y-axis labels */}
          {bTicks.map(v => (
            <text key={v} x={ML + CW + 7} y={yR(v) + 4} textAnchor="start"
              fontSize={10} fill={PURPLE} opacity={0.8} fontFamily="Inter,sans-serif" fontWeight="600">
              {v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}x
            </text>
          ))}

          {/* X-axis labels */}
          {MONTHS.map((m, i) => (
            <text key={i} x={xAt(i)} y={H - 6} textAnchor="middle"
              fontSize={10} fill="rgba(0,0,0,0.4)" fontFamily="Inter,sans-serif">
              {m.label.replace(' 2026', '')}
            </text>
          ))}

          {/* Axis borders */}
          <line x1={ML} y1={MT} x2={ML} y2={MT + CH} stroke="rgba(0,0,0,0.08)" />
          <line x1={ML + CW} y1={MT} x2={ML + CW} y2={MT + CH} stroke={PURPLE} opacity={0.3} />
          <line x1={ML} y1={MT + CH} x2={ML + CW} y2={MT + CH} stroke="rgba(0,0,0,0.08)" />
        </svg>
      </div>
    </div>
  );
}
