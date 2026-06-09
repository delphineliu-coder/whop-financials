import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MONTHS } from '../data/financials';

const ORANGE = '#ff6423';
const GREEN  = '#10B981';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';

const fmtM  = (v: number) => v >= 0 ? `$${v.toFixed(1)}M` : `-$${Math.abs(v).toFixed(1)}M`;
const fmtBM = (v: number) => v >= 0 ? `+${v.toFixed(2)}x` : `${v.toFixed(2)}x`;

// Shared chart geometry
const W = 880, H = 260;
const MT = 20, MB = 36, ML = 62, MR = 66;
const CW = W - ML - MR, CH = H - MT - MB;
const N  = MONTHS.length;
const xAt   = (i: number) => ML + (i / (N - 1)) * CW;
const slotW = CW / (N - 1);
const isActual = (i: number) => i < 5;

const mkPath = (vals: number[], fn: (v: number) => number) =>
  vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${fn(v).toFixed(1)}`).join(' ');

function Legend({ items }: { items: { c: string; label: string; dashed?: boolean }[] }) {
  return (
    <div style={{ display: 'flex', gap: 20, paddingLeft: ML + 8, marginBottom: 10, flexWrap: 'wrap' }}>
      {items.map(({ c, label, dashed }) => (
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
  );
}

function Shading({ xAt4 }: { xAt4: number }) {
  return (
    <>
      <rect x={xAt4 + slotW * 0.5} y={MT} width={ML + CW - (xAt4 + slotW * 0.5)} height={CH}
        fill="rgba(59,130,246,0.07)" />
      <text x={ML + 5} y={MT + 14} fontSize={9} fill="rgba(0,0,0,0.3)"
        fontFamily="Inter,sans-serif" fontWeight="700">ACTUAL</text>
      <text x={xAt(5) + 5} y={MT + 14} fontSize={9} fill="rgba(59,130,246,0.5)"
        fontFamily="Inter,sans-serif" fontWeight="700">FORECAST</text>
    </>
  );
}

function AxisBorders({ rightColor }: { rightColor: string }) {
  return (
    <>
      <line x1={ML} y1={MT} x2={ML} y2={MT + CH} stroke="rgba(0,0,0,0.08)" />
      <line x1={ML + CW} y1={MT} x2={ML + CW} y2={MT + CH} stroke={rightColor} opacity={0.3} />
      <line x1={ML} y1={MT + CH} x2={ML + CW} y2={MT + CH} stroke="rgba(0,0,0,0.08)" />
    </>
  );
}

export default function OperatingIncomeDetail() {
  const navigate = useNavigate();
  const [hover1, setHover1] = useState<number | null>(null);
  const [hover2, setHover2] = useState<number | null>(null);

  const rev  = MONTHS.map(m => m.revenue);
  const gtv  = MONTHS.map(m => m.gtv);
  const ebit = MONTHS.map(m => m.ebitda);
  const burn = MONTHS.map(m => m.burnMultiple ?? 0);

  // Chart 1 axes: Revenue (left) + GTV (right)
  const yRev = (v: number) => MT + CH * (1 - v / 60);
  const yGtv = (v: number) => MT + CH * (1 - v / 1000);
  const revTicks = [0, 15, 30, 45, 60];
  const gtvTicks = [0, 250, 500, 750, 1000];

  // Chart 2 axes: EBITDA (left, fixed -6 to +6) + Burn Multiple (right, symmetric)
  const ebitMin = -6, ebitRange = 12;
  const yEbit = (v: number) => MT + CH * (1 - (v - ebitMin) / ebitRange);
  const ebitTicks = [-6, -3, 0, 3, 6];

  const bAbs  = Math.max(...burn.map(Math.abs));
  const bCeil = Math.ceil(bAbs / 0.5) * 0.5;
  const bMin  = -bCeil, bRange = bCeil * 2;
  const yBurn = (v: number) => MT + CH * (1 - (v - bMin) / bRange);
  const bStep = bCeil / 2;
  const bTicks = [-bCeil, -bStep, 0, bStep, bCeil];

  const xAt4 = xAt(4);

  function HoverLine({ xi }: { xi: number }) {
    return <line x1={xi} x2={xi} y1={MT} y2={MT + CH}
      stroke="rgba(0,0,0,0.18)" strokeWidth={1} strokeDasharray="4 3" />;
  }

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Overview</button>
      <div className="detail-header">
        <h1>Burn Multiple</h1>
        <span className="detail-period">FY 2026 · Monthly</span>
      </div>

      {/* ── Chart 1: Revenue + GTV ── */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)', padding: '20px 8px 8px', marginBottom: 16 }}>
        <Legend items={[
          { c: ORANGE, label: 'Revenue ($M)' },
          { c: GREEN,  label: 'GTV ($M, right →)', dashed: true },
        ]} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseLeave={() => setHover1(null)}>

          <Shading xAt4={xAt4} />

          {[0, 15, 30, 45, 60].map(v => (
            <line key={v} x1={ML} x2={ML + CW} y1={yRev(v)} y2={yRev(v)}
              stroke={v === 0 ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.05)'} strokeWidth={v === 0 ? 1 : 0.5} />
          ))}

          {/* Revenue */}
          <path d={mkPath(rev, yRev)} fill="none" stroke={ORANGE} strokeWidth={2.5} strokeLinejoin="round" />
          {rev.map((v, i) => isActual(i)
            ? <circle key={i} cx={xAt(i)} cy={yRev(v)} r={4} fill={ORANGE} />
            : <circle key={i} cx={xAt(i)} cy={yRev(v)} r={3.5} fill="#fff" stroke={ORANGE} strokeWidth={2} />
          )}

          {/* GTV */}
          <path d={mkPath(gtv, yGtv)} fill="none" stroke={GREEN} strokeWidth={2} strokeLinejoin="round" strokeDasharray="6 3" />
          {gtv.map((v, i) => isActual(i)
            ? <circle key={i} cx={xAt(i)} cy={yGtv(v)} r={3.5} fill={GREEN} />
            : <circle key={i} cx={xAt(i)} cy={yGtv(v)} r={3} fill="#fff" stroke={GREEN} strokeWidth={1.5} />
          )}

          {/* Hover hit areas */}
          {MONTHS.map((_, i) => (
            <rect key={i} x={xAt(i) - slotW / 2} y={MT} width={slotW} height={CH}
              fill="transparent" onMouseEnter={() => setHover1(i)} style={{ cursor: 'crosshair' }} />
          ))}

          {hover1 !== null && (() => {
            const xi = xAt(hover1);
            const m  = MONTHS[hover1];
            const TW = 148, TH = 68, PAD = 10;
            const toRight = hover1 <= N / 2;
            const tx = toRight ? xi + PAD : xi - PAD - TW;
            return (
              <g>
                <HoverLine xi={xi} />
                <rect x={tx} y={MT + 4} width={TW} height={TH} rx={7}
                  fill="#fff" stroke="rgba(0,0,0,0.08)"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }} />
                <text x={tx + 10} y={MT + 20} fontSize={11} fontWeight="700" fill="#111" fontFamily="Inter,sans-serif">{m.label}</text>
                <text x={tx + 10} y={MT + 37} fontSize={10} fontWeight="600" fill={ORANGE} fontFamily="Inter,sans-serif">Revenue: {fmtM(rev[hover1])}</text>
                <text x={tx + 10} y={MT + 53} fontSize={10} fontWeight="600" fill={GREEN} fontFamily="Inter,sans-serif">GTV: ${gtv[hover1]}M</text>
              </g>
            );
          })()}

          {/* Left: Revenue */}
          {revTicks.map(v => (
            <text key={v} x={ML - 6} y={yRev(v) + 4} textAnchor="end"
              fontSize={10} fill="rgba(0,0,0,0.45)" fontFamily="Inter,sans-serif" fontWeight="600">
              ${v}M
            </text>
          ))}

          {/* Right: GTV */}
          {gtvTicks.map(v => (
            <text key={v} x={ML + CW + 7} y={yGtv(v) + 4} textAnchor="start"
              fontSize={10} fill={GREEN} opacity={0.8} fontFamily="Inter,sans-serif" fontWeight="600">
              ${v === 1000 ? '1B' : `${v}M`}
            </text>
          ))}

          {/* X-axis */}
          {MONTHS.map((m, i) => (
            <text key={i} x={xAt(i)} y={H - 6} textAnchor="middle"
              fontSize={10} fill="rgba(0,0,0,0.4)" fontFamily="Inter,sans-serif">
              {m.label.replace(' 2026', '')}
            </text>
          ))}

          <AxisBorders rightColor={GREEN} />
        </svg>
      </div>

      {/* ── Chart 2: EBITDA + Burn Multiple ── */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)', padding: '20px 8px 8px' }}>
        <Legend items={[
          { c: BLUE,   label: 'EBITDA ($M)' },
          { c: PURPLE, label: 'Burn Multiple × (right →)', dashed: true },
        ]} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseLeave={() => setHover2(null)}>

          <Shading xAt4={xAt4} />

          {ebitTicks.map(v => (
            <line key={v} x1={ML} x2={ML + CW} y1={yEbit(v)} y2={yEbit(v)}
              stroke={v === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)'} strokeWidth={v === 0 ? 1 : 0.5} />
          ))}

          {/* EBITDA */}
          <path d={mkPath(ebit, yEbit)} fill="none" stroke={BLUE} strokeWidth={2.5} strokeLinejoin="round" />
          {ebit.map((v, i) => isActual(i)
            ? <circle key={i} cx={xAt(i)} cy={yEbit(v)} r={4} fill={BLUE} />
            : <circle key={i} cx={xAt(i)} cy={yEbit(v)} r={3.5} fill="#fff" stroke={BLUE} strokeWidth={2} />
          )}

          {/* Burn Multiple */}
          <path d={mkPath(burn, yBurn)} fill="none" stroke={PURPLE} strokeWidth={2} strokeLinejoin="round" strokeDasharray="6 3" />
          {burn.map((v, i) => isActual(i)
            ? <circle key={i} cx={xAt(i)} cy={yBurn(v)} r={3.5} fill={PURPLE} />
            : <circle key={i} cx={xAt(i)} cy={yBurn(v)} r={3} fill="#fff" stroke={PURPLE} strokeWidth={1.5} />
          )}

          {/* Hover hit areas */}
          {MONTHS.map((_, i) => (
            <rect key={i} x={xAt(i) - slotW / 2} y={MT} width={slotW} height={CH}
              fill="transparent" onMouseEnter={() => setHover2(i)} style={{ cursor: 'crosshair' }} />
          ))}

          {hover2 !== null && (() => {
            const xi = xAt(hover2);
            const m  = MONTHS[hover2];
            const TW = 162, TH = 68, PAD = 10;
            const toRight = hover2 <= N / 2;
            const tx = toRight ? xi + PAD : xi - PAD - TW;
            return (
              <g>
                <HoverLine xi={xi} />
                <rect x={tx} y={MT + 4} width={TW} height={TH} rx={7}
                  fill="#fff" stroke="rgba(0,0,0,0.08)"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }} />
                <text x={tx + 10} y={MT + 20} fontSize={11} fontWeight="700" fill="#111" fontFamily="Inter,sans-serif">{m.label}</text>
                <text x={tx + 10} y={MT + 37} fontSize={10} fontWeight="600" fill={BLUE} fontFamily="Inter,sans-serif">EBITDA: {fmtM(ebit[hover2])}</text>
                <text x={tx + 10} y={MT + 53} fontSize={10} fontWeight="600" fill={PURPLE} fontFamily="Inter,sans-serif">Burn Multiple: {fmtBM(burn[hover2])}</text>
              </g>
            );
          })()}

          {/* Left: EBITDA */}
          {ebitTicks.map(v => (
            <text key={v} x={ML - 6} y={yEbit(v) + 4} textAnchor="end"
              fontSize={10} fill="rgba(0,0,0,0.45)" fontFamily="Inter,sans-serif" fontWeight="600">
              {v >= 0 ? `$${v}M` : `-$${Math.abs(v)}M`}
            </text>
          ))}

          {/* Right: Burn Multiple */}
          {bTicks.map(v => (
            <text key={v} x={ML + CW + 7} y={yBurn(v) + 4} textAnchor="start"
              fontSize={10} fill={PURPLE} opacity={0.8} fontFamily="Inter,sans-serif" fontWeight="600">
              {v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}x
            </text>
          ))}

          {/* X-axis */}
          {MONTHS.map((m, i) => (
            <text key={i} x={xAt(i)} y={H - 6} textAnchor="middle"
              fontSize={10} fill="rgba(0,0,0,0.4)" fontFamily="Inter,sans-serif">
              {m.label.replace(' 2026', '')}
            </text>
          ))}

          <AxisBorders rightColor={PURPLE} />
        </svg>
      </div>
    </div>
  );
}
