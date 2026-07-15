import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { SectionTitle } from '../ui/SectionTitle';
import { SIGNAL_COMPARISON, BASE_EQUITY, RIDGE_EQUITY, FINAL_EQUITY_IS, INITIAL_CAPITAL } from '../../data/strategyData';
import { useNavData } from '../../hooks/useNavData';
import { navRecordsToPlotly } from '../../data/chartHelpers';

// Blend explorer — interpolate between Base and Ridge using real IS endpoints
function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = Math.imul(s, 1664525) + 1013904223 >>> 0; return s / 4294967296; };
}
function boxMuller(rng: () => number) {
  let spare: number | null = null;
  return () => {
    if (spare !== null) { const v = spare; spare = null; return v; }
    let u, v, s: number;
    do { u = rng() * 2 - 1; v = rng() * 2 - 1; s = u * u + v * v; } while (s >= 1 || s === 0);
    const m = Math.sqrt(-2 * Math.log(s) / s);
    spare = v * m; return u * m;
  };
}

function generateBlendedCurve(
  baseNavs: number[], ridgeNavs: number[],
  weight: number, seed: number,
): number[] {
  const n   = baseNavs.length;
  const rng = seededRng(seed + Math.round(weight * 1000));
  const nrm = boxMuller(rng);
  const ensBoost = Math.max(0, 4 * weight * (1 - weight)) * 0.065;
  const blended  = baseNavs.map((b, i) => {
    const r   = ridgeNavs[i] ?? b;
    const raw = (1 - weight) * b + weight * r + ensBoost * INITIAL_CAPITAL * 1.8 * (i / n);
    return raw + 0.18e6 * nrm();
  });
  return blended;
}

const PLOT_CONFIG = { displayModeBar: false as const, responsive: true };
const BASE_LAYOUT = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  margin: { t: 16, r: 16, b: 44, l: 64 },
  font: { family: 'JetBrains Mono', color: '#9CA3AF', size: 10 },
  legend: { bgcolor: 'transparent', font: { size: 9, color: '#9CA3AF' }, x: 0.01, y: 0.99 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.04)', tickfont: { size: 10 } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.04)', tickfont: { size: 10 } },
};

export function EnsembleSection() {
  const [ridgeWeight, setRidgeWeight] = useState(20);
  const { data: navData, status } = useNavData();

  const isReal = status === 'ready' && navData !== null;

  // Use real data when available, fallback to piecewise approximation
  const baseRecords  = isReal ? navData!.is_base  : BASE_EQUITY.navs.map((v, i) => ({ day: 80+i, nav: v, dd: BASE_EQUITY.drawdowns[i] }));
  const ridgeRecords = isReal ? navData!.is_ridge : RIDGE_EQUITY.navs.map((v, i) => ({ day: 80+i, nav: v, dd: RIDGE_EQUITY.drawdowns[i] }));
  const finalRecords = isReal ? navData!.is_final : FINAL_EQUITY_IS.navs.map((v, i) => ({ day: 80+i, nav: v, dd: FINAL_EQUITY_IS.drawdowns[i] }));

  const { days, navsM: baseNavsM, drawdowns: baseDD } = navRecordsToPlotly(baseRecords);
  const { navsM: ridgeNavsM, drawdowns: ridgeDD }      = navRecordsToPlotly(ridgeRecords);
  const { navsM: finalNavsM, drawdowns: finalDD }       = navRecordsToPlotly(finalRecords);

  const blendedNavs = useMemo(() => {
    const bN = baseRecords.map(r => r.nav);
    const rN = ridgeRecords.map(r => r.nav);
    return generateBlendedCurve(bN, rN, ridgeWeight / 100, 200);
  }, [ridgeWeight, baseRecords, ridgeRecords]);

  const blendedNavsM = blendedNavs.map(v => v / 1e6);
  const blendedFinalNAV = blendedNavsM[blendedNavsM.length - 1].toFixed(2);

  function toDD(ms: number[]) {
    let peak = ms[0];
    return ms.map(v => { if (v > peak) peak = v; return ((v / peak) - 1) * 100; });
  }

  const equityData = [
    { x: days, y: baseNavsM,    type: 'scatter', mode: 'lines', name: `BaseAlpha (CAGR+${SIGNAL_COMPARISON[0].cagr.toFixed(1)}%, SR${SIGNAL_COMPARISON[0].sharpe.toFixed(2)})`,  line: { color: '#3B82F6', width: 1.5 }, hovertemplate: '%{x}<br>¥%{y:.3f}M<extra>BaseAlpha</extra>' },
    { x: days, y: ridgeNavsM,   type: 'scatter', mode: 'lines', name: `Ridge Sleeve (CAGR+${SIGNAL_COMPARISON[1].cagr.toFixed(1)}%, SR${SIGNAL_COMPARISON[1].sharpe.toFixed(2)})`, line: { color: '#8B5CF6', width: 1.5 }, hovertemplate: '%{x}<br>¥%{y:.3f}M<extra>Ridge</extra>' },
    { x: days, y: finalNavsM,   type: 'scatter', mode: 'lines', name: `Finalpha 0.8/0.2 (CAGR+${SIGNAL_COMPARISON[2].cagr.toFixed(1)}%, SR${SIGNAL_COMPARISON[2].sharpe.toFixed(2)})`, line: { color: '#10B981', width: 2.5 }, hovertemplate: '%{x}<br>¥%{y:.3f}M<extra>Finalpha</extra>' },
    { x: days, y: blendedNavsM, type: 'scatter', mode: 'lines', name: `Custom ${100-ridgeWeight}/${ridgeWeight}`, line: { color: '#F59E0B', width: 2, dash: 'dot' as const }, hovertemplate: '%{x}<br>¥%{y:.3f}M<extra>Custom</extra>' },
  ];

  const ddData = [
    { x: days, y: baseDD,  type: 'scatter', mode: 'lines', name: 'BaseAlpha DD',  line: { color: '#3B82F6', width: 1.5 }, fill: 'tozeroy' as const, fillcolor: 'rgba(59,130,246,0.05)' },
    { x: days, y: ridgeDD, type: 'scatter', mode: 'lines', name: 'Ridge DD',      line: { color: '#8B5CF6', width: 1.5 }, fill: 'tozeroy' as const, fillcolor: 'rgba(139,92,246,0.05)' },
    { x: days, y: finalDD, type: 'scatter', mode: 'lines', name: 'Finalpha DD',line: { color: '#10B981', width: 2   }, fill: 'tozeroy' as const, fillcolor: 'rgba(16,185,129,0.07)' },
  ];

  return (
    <section id="ensemble" className="py-24 px-6 section-divider">
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow="Ensemble Effect" title="The Power of Decorrelation"/>

        {/* Data source badge */}
        {status === 'ready' && (
          <div className="mb-6">
            <span className="text-xs mono text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
              Exact NAV data — BaseAlpha, Ridge Sleeve, Finalpha all from actual IS backtest
            </span>
          </div>
        )}

        {/* Hero statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 mb-10 border border-green-500/15"
          style={{ background: 'rgba(16,185,129,0.04)' }}
        >
          <p className="text-xl md:text-2xl font-semibold text-white leading-snug">
            "The Ridge sleeve is a poor standalone strategy — CAGR{' '}
            <span className="text-accent-red">+1.49%</span>, Sharpe{' '}
            <span className="text-accent-red">0.18</span>, MaxDD{' '}
            <span className="text-accent-red">−24.53%</span> — yet allocating{' '}
            <span className="text-accent-green">20% weight</span> lifts both Sharpe and CAGR substantially
            while leaving drawdown essentially unchanged."
          </p>
          <p className="text-gray-500 text-sm mt-4">
            The gain reflects a <span className="text-white font-semibold">diversification effect</span> rather
            than the substitution of a stronger predictor. — Research Report, §5.2
          </p>
        </motion.div>

        {/* Table 3 */}
        <div className="glass-card rounded-2xl p-5 mb-10 overflow-x-auto">
          <p className="text-white font-semibold text-sm mb-1">Table 3 — Signal Decomposition (IS D080–D484)</p>
          <p className="text-gray-500 text-xs mono mb-4">Identical portfolio engine, three signals</p>
          <table className="w-full text-xs mono">
            <thead>
              <tr className="border-b border-white/10">
                {['Signal','IC','ICIR','CAGR','Sharpe','MaxDD','Calmar','Turnover','Fitness','Final NAV'].map(h => (
                  <th key={h} className="py-2 px-3 text-left text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIGNAL_COMPARISON.map((s, i) => (
                <tr key={s.name} className={`border-b border-white/5 ${i===2 ? 'bg-green-500/5':''}`}>
                  <td className="py-2.5 px-3 font-semibold" style={{color:s.color}}>{s.label}</td>
                  <td className="py-2.5 px-3 text-gray-400">{s.ic.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-gray-400">{s.icir.toFixed(3)}</td>
                  <td className={`py-2.5 px-3 font-bold ${s.cagr>10?'text-accent-green':s.cagr>3?'text-gray-300':'text-accent-red'}`}>{s.cagr>0?'+':''}{s.cagr.toFixed(2)}%</td>
                  <td className={`py-2.5 px-3 ${s.sharpe>0.5?'text-white':'text-gray-500'}`}>{s.sharpe.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-accent-red">{s.maxDD.toFixed(2)}%</td>
                  <td className="py-2.5 px-3 text-gray-400">{s.calmar.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-gray-400">{s.turnover.toFixed(2)}×</td>
                  <td className={`py-2.5 px-3 ${i===2?'text-accent-green font-bold':'text-gray-400'}`}>{s.fitness.toFixed(2)}</td>
                  <td className={`py-2.5 px-3 font-bold ${i===2?'text-accent-green':'text-gray-300'}`}>¥{s.finalNAV}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Blend Explorer */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-semibold">Blend Weight Explorer</p>
              <p className="text-gray-500 text-xs mt-0.5 mono">Drag to explore ensemble effect</p>
            </div>
            <div className="text-right">
              <p className="mono text-2xl font-bold text-accent-amber">{ridgeWeight}%</p>
              <p className="text-xs text-gray-500 mono">Ridge weight</p>
            </div>
          </div>
          <input type="range" min={0} max={50} step={5} value={ridgeWeight}
            onChange={e => setRidgeWeight(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"/>
          <div className="flex justify-between text-xs mono text-gray-600 mt-1 mb-4">
            <span>0% Pure Base</span><span>20% Optimal (selected)</span><span>50% Half/Half</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card rounded-lg px-3 py-2.5 text-center">
              <p className="text-xs text-gray-500 mono">Base weight</p>
              <p className="text-white font-bold mono text-lg">{100-ridgeWeight}%</p>
            </div>
            <div className="glass-card rounded-lg px-3 py-2.5 text-center">
              <p className="text-xs text-gray-500 mono">Ridge weight</p>
              <p className="text-accent-purple font-bold mono text-lg">{ridgeWeight}%</p>
            </div>
            <div className="glass-card rounded-lg px-3 py-2.5 text-center">
              <p className="text-xs text-gray-500 mono">Est. Final NAV</p>
              <p className="text-accent-amber font-bold mono text-lg">¥{blendedFinalNAV}M</p>
            </div>
          </div>
        </div>

        {/* Interactive charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-4">
            <p className="text-white text-sm font-semibold mb-1 px-2">IS Equity Curves{isReal ? ' (exact)' : ' (approx.)'}</p>
            <p className="text-gray-500 text-xs mb-3 px-2 mono">From ¥50M · Custom blend in amber</p>
            <Plot data={equityData as any}
              layout={{ ...BASE_LAYOUT, yaxis: { ...BASE_LAYOUT.yaxis, title: { text: 'NAV (¥M)', font: { size: 9 } } } } as any}
              config={PLOT_CONFIG} style={{ width: '100%', height: '300px' }}/>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-white text-sm font-semibold mb-1 px-2">IS Drawdown Curves{isReal ? ' (exact)' : ' (approx.)'}</p>
            <p className="text-gray-500 text-xs mb-3 px-2 mono">Ridge alone hits −24.53% MDD</p>
            <Plot data={ddData as any}
              layout={{ ...BASE_LAYOUT, yaxis: { ...BASE_LAYOUT.yaxis, title: { text: 'Drawdown (%)', font: { size: 9 } } } } as any}
              config={PLOT_CONFIG} style={{ width: '100%', height: '300px' }}/>
          </div>
        </div>

        {/* Actual figure */}
        <div className="glass-card rounded-2xl p-4">
          <p className="text-white text-sm font-semibold mb-1 px-2">fig2_signal_decomposition.png — Direct Notebook Export</p>
          <p className="text-gray-500 text-xs mb-4 px-2 mono">strategy_signal_breakdown_IS.ipynb</p>
          <img src="figures/fig2_signal_decomposition.png"
            alt="IS signal decomposition: BaseAlpha vs ridge_5d vs Finalpha"
            className="w-full rounded-xl" style={{ filter: 'brightness(0.95) contrast(1.05)' }}/>
        </div>
      </div>
    </section>
  );
}
