import { useState } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { SectionTitle } from '../ui/SectionTitle';
import { IS_METRICS, OOS_METRICS, IS_EQUITY, OOS_EQUITY, INITIAL_CAPITAL, SIGNAL_STAGES } from '../../data/strategyData';
import { useNavData } from '../../hooks/useNavData';
import { navRecordsToPlotly, computeMetrics } from '../../data/chartHelpers';

const PLOT_CONFIG = { displayModeBar: false as const, responsive: true };
const BASE_LAYOUT = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  margin: { t: 20, r: 20, b: 44, l: 72 },
  font: { family: 'JetBrains Mono', color: '#9CA3AF', size: 10 },
  legend: { bgcolor: 'transparent', font: { size: 9, color: '#9CA3AF' }, x: 0.02, y: 0.98 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.04)', zerolinecolor: 'rgba(255,255,255,0.06)', tickfont: { size: 10 } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.04)', zerolinecolor: 'rgba(255,255,255,0.06)', tickfont: { size: 10 } },
};

type TabKey = 'oos' | 'is';
type ViewKey = 'plotly' | 'actual';

export function PerformanceDashboard() {
  const [tab, setTab]   = useState<TabKey>('oos');
  const [view, setView] = useState<ViewKey>('plotly');
  const { data: navData, status } = useNavData();

  // Pick source: real data if loaded, fallback to piecewise approximation
  const isReal = status === 'ready' && navData !== null;

  const isRecords  = isReal ? navData!.is_final  : IS_EQUITY.navs.map((v, i) => ({ day: 80 + i, nav: v, dd: IS_EQUITY.drawdowns[i] }));
  const oosRecords = isReal ? navData!.oos_final : OOS_EQUITY.navs.map((v, i) => ({ day: 485 + i, nav: v, dd: OOS_EQUITY.drawdowns[i] }));

  const records   = tab === 'is' ? isRecords  : oosRecords;
  const { days, navsM, drawdowns } = navRecordsToPlotly(records);
  const live  = isReal ? computeMetrics(records, INITIAL_CAPITAL) : null;
  const fixed = tab === 'is' ? IS_METRICS : OOS_METRICS;

  const cagr      = live?.cagr.toFixed(2)    ?? fixed.cagr.toFixed(2);
  const sharpe    = live?.sharpe.toFixed(2)  ?? fixed.sharpe.toFixed(2);
  const maxDD     = live?.maxDD.toFixed(2)   ?? fixed.maxDD.toFixed(2);
  const totalPnL  = live?.totalPnL.toFixed(2) ?? fixed.totalPnL.toFixed(2);
  const finalNAV  = live?.finalNAV.toFixed(2) ?? String(fixed.finalNAV);

  const benchNavs = records.map(() => INITIAL_CAPITAL / 1e6);

  const equityData = [
    {
      x: days, y: navsM,
      type: 'scatter', mode: 'lines',
      name: `Finalpha  CAGR=+${cagr}%  SR=${sharpe}`,
      line: { color: '#10B981', width: 2 },
      fill: 'tozeroy' as const, fillcolor: 'rgba(16,185,129,0.04)',
      hovertemplate: '%{x}<br>¥%{y:.3f}M<extra>Finalpha</extra>',
    },
    {
      x: days, y: benchNavs,
      type: 'scatter', mode: 'lines', name: 'Initial ¥50M',
      line: { color: '#374151', width: 1, dash: 'dot' as const },
      hoverinfo: 'skip' as const,
    },
  ];

  const ddData = [
    {
      x: days, y: drawdowns,
      type: 'scatter', mode: 'lines', name: `MaxDD ${maxDD}%`,
      line: { color: '#EF4444', width: 1.5 },
      fill: 'tozeroy' as const, fillcolor: 'rgba(239,68,68,0.06)',
      hovertemplate: '%{x}<br>%{y:.3f}%<extra>Drawdown</extra>',
    },
    {
      x: days, y: records.map(() => parseFloat(maxDD)),
      type: 'scatter', mode: 'lines', name: `MaxDD limit`,
      line: { color: '#EF4444', width: 1, dash: 'dot' as const },
      hoverinfo: 'skip' as const,
    },
  ];

  const metricsData = [
    { label: 'CAGR',         value: `+${cagr}%`,     positive: true  },
    { label: 'Sharpe',       value: sharpe,            positive: true  },
    { label: 'Max DD',       value: `${maxDD}%`,       negative: true  },
    { label: 'Calmar',       value: fixed.calmar.toFixed(2), positive: true },
    { label: 'Ann. Turnover',value: `${fixed.annTurnover.toFixed(1)}×`, neutral: true },
    { label: 'Fitness',      value: fixed.fitness.toFixed(2), positive: true },
    { label: 'Total PnL',    value: `+${totalPnL}%`,  positive: true  },
    { label: 'Final NAV',    value: `¥${finalNAV}M`,  positive: true  },
  ];

  const actualFigSrc = tab === 'oos' ? 'figures/fig3_oos_equity.png' : 'figures/fig1_is_equity.png';
  const actualFigAlt = tab === 'oos'
    ? 'OOS equity curve (D485–D726, fresh ¥50M, total PnL +16.89%)'
    : 'IS equity curve (D080–D484, ¥50M start, CAGR +17.3%)';

  return (
    <section id="performance" className="py-24 px-6 section-divider">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Performance Dashboard"
          title="Backtest Results"
          subtitle="Full performance attribution across in-sample (≈1.9y) and out-of-sample (≈1y) periods."
        />

        {/* Data source badge */}
        <div className="mb-6 flex items-center gap-2">
          {status === 'loading' && (
            <span className="text-xs mono text-amber-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block"/>
              Loading exact backtest data…
            </span>
          )}
          {status === 'ready' && (
            <span className="text-xs mono text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
              Exact NAV data loaded — charts reflect actual backtest output
            </span>
          )}
          {status === 'error' && (
            <span className="text-xs mono text-orange-400">
              ⚠ NAV data unavailable — showing chart approximation
            </span>
          )}
        </div>

        {/* Tab + view switcher */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['oos', 'is'] as TabKey[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm mono font-medium transition-all duration-200 ${tab === t ? 'bg-blue-600 text-white' : 'glass-card text-gray-400 hover:text-white'}`}
            >
              {t === 'oos' ? 'Out-of-Sample (D485–D726)' : 'In-Sample (D080–D484)'}
            </button>
          ))}
          <div className="flex-1"/>
          <div className="flex gap-2">
            {(['plotly', 'actual'] as ViewKey[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-xs mono transition-all duration-200 ${view === v ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {v === 'plotly' ? '📊 Interactive' : '🖼 Actual Figure'}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-8"
        >
          {metricsData.map(m => (
            <div key={m.label} className="glass-card rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mono leading-tight mb-1">{m.label}</p>
              <p className={`text-sm mono font-bold ${m.positive ? 'text-accent-green' : m.negative ? 'text-accent-red' : 'text-white'}`}>
                {m.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Signal stage table (Table 2) */}
        <div className="glass-card rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mono mb-3 uppercase tracking-wider">Table 2 — Signal Stage Predictive Strength (IS)</p>
          <div className="flex gap-0 overflow-hidden rounded-lg">
            {SIGNAL_STAGES.map((s, i) => (
              <div key={s.label} className={`flex-1 px-3 py-3 text-center border-r border-white/5 last:border-r-0 ${s.bold ? 'bg-green-500/5' : ''}`}>
                <p className={`mono font-medium mb-2 ${s.bold ? 'text-white' : 'text-gray-400'}`} style={{ fontSize: '0.65rem' }}>{s.label}</p>
                <p className="text-blue-400 font-bold mono text-sm">IC {s.ic.toFixed(4)}</p>
                <p className={`mono font-bold text-sm ${s.bold ? 'text-green-400' : 'text-gray-300'}`}>ICIR {s.icir.toFixed(3)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mono mt-2">
            Sector residualization trades small IC reduction (0.1026→0.0947) for large ICIR gain (0.674→0.815).
            Ensemble achieves highest IC (0.0980).
          </p>
        </div>

        {/* Charts */}
        <motion.div
          key={tab + '-' + view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {view === 'actual' ? (
            <div className="glass-card rounded-2xl p-5">
              <p className="text-white text-sm font-semibold mb-1 px-1">
                {tab === 'oos' ? 'fig3_oos_equity.png' : 'fig1_is_equity.png'} — Direct Notebook Export
              </p>
              <p className="text-gray-500 text-xs mb-4 px-1 mono">{actualFigAlt}</p>
              <img src={actualFigSrc} alt={actualFigAlt} className="w-full rounded-xl"
                style={{ filter: 'brightness(0.95) contrast(1.05)' }}/>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-white text-sm font-semibold mb-1 px-2">Equity Curve</p>
                <p className="text-gray-500 text-xs mb-3 px-2 mono">
                  {tab === 'oos'
                    ? `D485–D726 · From ¥50M · Total PnL +${totalPnL}% · ${isReal ? 'exact data' : 'approx.'}`
                    : `D080–D484 (≈1.9y) · From ¥50M · Total PnL +${totalPnL}% · ${isReal ? 'exact data' : 'approx.'}`}
                </p>
                <Plot
                  data={equityData as any}
                  layout={{ ...BASE_LAYOUT, yaxis: { ...BASE_LAYOUT.yaxis, title: { text: 'NAV (¥M)', font: { size: 10 } } } } as any}
                  config={PLOT_CONFIG}
                  style={{ width: '100%', height: '320px' }}
                />
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-white text-sm font-semibold mb-1 px-2">Drawdown Curve</p>
                <p className="text-gray-500 text-xs mb-3 px-2 mono">
                  {tab === 'oos'
                    ? `OOS MaxDD ${maxDD}% — shallower than IS (−12.32%)`
                    : `IS MaxDD ${maxDD}% — within design target (≤ −15%)`}
                </p>
                <Plot
                  data={ddData as any}
                  layout={{ ...BASE_LAYOUT, yaxis: { ...BASE_LAYOUT.yaxis, title: { text: 'Drawdown (%)', font: { size: 10 } } } } as any}
                  config={PLOT_CONFIG}
                  style={{ width: '100%', height: '320px' }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
