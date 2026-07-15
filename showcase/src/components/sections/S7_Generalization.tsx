import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { SectionMeta } from '../ui/SectionMeta';
import { Finding } from '../ui/Finding';
import { ResearchNote } from '../ui/ResearchNote';
import { useNavData } from '../../hooks/useNavData';
import { navRecordsToPlotly } from '../../data/chartHelpers';
import { IS_EQUITY, OOS_EQUITY, IS_METRICS, OOS_METRICS } from '../../data/strategyData';

const PLOT_CFG = { displayModeBar: false as const, responsive: true };
const LAYOUT = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  margin: { t: 8, r: 12, b: 36, l: 60 },
  font: { family: 'JetBrains Mono', color: '#8895A7', size: 9 },
  legend: { bgcolor: 'transparent', font: { size: 8.5, color: '#8895A7' }, x: 0.01, y: 0.99 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.05)', tickfont: { size: 9 } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.05)', tickfont: { size: 9 } },
};

const TABLE4 = [
  { w: 'In-sample',     period: 'D080–D484', days: '≈484', cagr: '+17.26%', sr: '1.42', mdd: '−12.32%', calmar: '1.40', to: '10.96×', fit: '0.18', nav: '¥67.88M' },
  { w: 'Out-of-sample', period: 'D485–D726', days: '242',  cagr: '+17.64%', sr: '1.00', mdd: '−10.18%', calmar: '1.73', to: '11.20×', fit: '0.13', nav: '¥58.44M', bold: true },
];

export function S7_Generalization() {
  const { data: navData, status } = useNavData();
  const isReal = status === 'ready' && navData !== null;

  const isRec  = isReal ? navData!.is_final  : IS_EQUITY.navs.map((v, i)  => ({ day: 80+i,  nav: v, dd: IS_EQUITY.drawdowns[i]  }));
  const oosRec = isReal ? navData!.oos_final : OOS_EQUITY.navs.map((v, i) => ({ day: 485+i, nav: v, dd: OOS_EQUITY.drawdowns[i] }));

  const iDays  = isRec.map((_, i) => i);
  const oDays  = oosRec.map((_, i) => i);
  const { navsM: isM, drawdowns: iDD }  = navRecordsToPlotly(isRec);
  const { navsM: oosM, drawdowns: oDD } = navRecordsToPlotly(oosRec);

  const equityData = [
    { x: iDays, y: isM,  type: 'scatter', mode: 'lines', name: `IS: CAGR +${IS_METRICS.cagr}% SR ${IS_METRICS.sharpe}`,    line: { color: '#4B8FD4', width: 2 } },
    { x: oDays, y: oosM, type: 'scatter', mode: 'lines', name: `OOS: CAGR +${OOS_METRICS.cagr}% SR ${OOS_METRICS.sharpe}`, line: { color: '#2EA44F', width: 2 } },
  ];

  const ddData = [
    { x: iDays, y: iDD, type: 'scatter', mode: 'lines', name: `IS MaxDD ${IS_METRICS.maxDD}%`,   line: { color: '#4B8FD4', width: 1.5 }, fill: 'tozeroy' as const, fillcolor: 'rgba(75,143,212,0.06)' },
    { x: oDays, y: oDD, type: 'scatter', mode: 'lines', name: `OOS MaxDD ${OOS_METRICS.maxDD}%`, line: { color: '#2EA44F', width: 1.5 }, fill: 'tozeroy' as const, fillcolor: 'rgba(46,164,79,0.06)' },
  ];

  const COMPARE = [
    { m: 'CAGR',     is: IS_METRICS.cagr,       oos: OOS_METRICS.cagr,       unit: '%',  fmt: (v: number) => `+${v.toFixed(2)}%`, verdict: 'OOS exceeds IS', good: true },
    { m: 'Sharpe',   is: IS_METRICS.sharpe,      oos: OOS_METRICS.sharpe,     unit: '',   fmt: (v: number) => v.toFixed(2),         verdict: 'Expected reduction', good: false },
    { m: 'MaxDD',    is: IS_METRICS.maxDD,        oos: OOS_METRICS.maxDD,      unit: '%',  fmt: (v: number) => `${v.toFixed(2)}%`,   verdict: 'OOS shallower ✓', good: true },
    { m: 'Calmar',   is: IS_METRICS.calmar,       oos: OOS_METRICS.calmar,     unit: '',   fmt: (v: number) => v.toFixed(2),         verdict: 'OOS improves', good: true },
    { m: 'Total PnL',is: IS_METRICS.totalPnL,     oos: OOS_METRICS.totalPnL,   unit: '%',  fmt: (v: number) => `+${v.toFixed(2)}%`, verdict: 'Shorter OOS period', good: false },
    { m: 'Fitness',  is: IS_METRICS.fitness,      oos: OOS_METRICS.fitness,    unit: '',   fmt: (v: number) => v.toFixed(2),         verdict: 'Consistent efficiency', good: false },
  ];

  return (
    <section id="generalization" className="py-28 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <SectionMeta
          num="§ 6.  Out-of-Sample Evaluation"
          question="Does the strategy generalize to unseen data?"
          lead={
            <>
              The OOS portfolio begins with a fresh ¥50M on D485 and trades through D726 using
              exclusively IS-fitted artifacts. Table 4 summarizes performance across both evaluation windows.
            </>
          }
        />

        {/* Verdict block */}
        <motion.div
          className="mb-12 rounded-xl overflow-hidden border border-[rgba(46,164,79,0.25)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="px-6 py-4 bg-[rgba(46,164,79,0.06)] border-b border-[rgba(46,164,79,0.15)]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
              <p className="font-mono text-[0.68rem] text-[var(--teal)] tracking-wider uppercase">Generalization Confirmed</p>
            </div>
          </div>
          <div className="px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'OOS CAGR', value: `+${OOS_METRICS.cagr.toFixed(2)}%`, note: 'vs IS +17.26% — exceeds', ok: true },
              { label: 'OOS Sharpe', value: OOS_METRICS.sharpe.toFixed(2), note: 'vs IS 1.42 — shorter window', ok: false },
              { label: 'OOS MaxDD', value: `${OOS_METRICS.maxDD.toFixed(2)}%`, note: 'vs IS −12.32% — shallower', ok: true },
              { label: 'OOS Calmar', value: OOS_METRICS.calmar.toFixed(2), note: 'vs IS 1.40 — improves', ok: true },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className="font-mono text-[0.6rem] text-[var(--text-3)] tracking-widest uppercase mb-1">{m.label}</p>
                <p className={`font-mono text-2xl font-semibold ${m.ok ? 'text-[var(--teal)]' : 'text-[var(--text)]'}`}>{m.value}</p>
                <p className="font-mono text-[0.62rem] text-[var(--text-3)] mt-1">{m.note}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Table 4 */}
        <div className="mb-12">
          <p className="section-num mb-4">Table 4 — IS vs OOS Performance Summary</p>
          <div className="card-research overflow-hidden">
            <table className="table-research">
              <thead>
                <tr>
                  <th>Window</th><th>Period</th><th>Days</th><th>CAGR</th>
                  <th>Sharpe</th><th>MaxDD</th><th>Calmar</th><th>Turnover</th><th>Fitness</th><th>Final NAV</th>
                </tr>
              </thead>
              <tbody>
                {TABLE4.map(row => (
                  <tr key={row.w} className={row.bold ? 'row-highlight' : ''}>
                    <td className={row.bold ? 'font-semibold' : 'text-[var(--text-3)]'}>{row.w}</td>
                    <td>{row.period}</td>
                    <td>{row.days}</td>
                    <td className="pos font-semibold">{row.cagr}</td>
                    <td>{row.sr}</td>
                    <td className="neg">{row.mdd}</td>
                    <td>{row.calmar}</td>
                    <td>{row.to}</td>
                    <td>{row.fit}</td>
                    <td className="pos font-semibold">{row.nav}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          <div className="card-research p-4">
            <p className="font-mono text-[0.65rem] text-[var(--text-3)] mb-3 uppercase tracking-wider">
              IS vs OOS Equity{isReal ? ' — exact backtest' : ' — approx.'}
            </p>
            <Plot data={equityData as any}
              layout={{ ...LAYOUT, yaxis: { ...LAYOUT.yaxis, title: { text: 'NAV (¥M)', font: { size: 9 } } } } as any}
              config={PLOT_CFG} style={{ width: '100%', height: '250px' }}/>
            <p className="font-mono text-[0.6rem] text-[var(--text-3)] mt-2">Both start from ¥50M cold start · day index within each period</p>
          </div>
          <div className="card-research p-4">
            <p className="font-mono text-[0.65rem] text-[var(--text-3)] mb-3 uppercase tracking-wider">
              IS vs OOS Drawdown{isReal ? ' — exact backtest' : ' — approx.'}
            </p>
            <Plot data={ddData as any}
              layout={{ ...LAYOUT, yaxis: { ...LAYOUT.yaxis, title: { text: 'Drawdown (%)', font: { size: 9 } } } } as any}
              config={PLOT_CFG} style={{ width: '100%', height: '250px' }}/>
            <p className="font-mono text-[0.6rem] text-[var(--text-3)] mt-2">OOS MaxDD {OOS_METRICS.maxDD.toFixed(2)}% is shallower — risk overlays generalized</p>
          </div>
        </div>

        {/* Metric comparison */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
          {COMPARE.map((c, i) => (
            <motion.div key={c.m} className="card-research p-4"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <p className="font-mono text-[0.6rem] text-[var(--text-3)] uppercase tracking-widest mb-2">{c.m}</p>
              <div className="flex justify-between items-end mb-1.5">
                <div><p className="font-mono text-[0.6rem] text-[var(--blue)] mb-0.5">IS</p><p className="font-mono text-sm text-[var(--blue)]">{c.fmt(c.is)}</p></div>
                <div className="text-right"><p className="font-mono text-[0.6rem] text-[var(--teal)] mb-0.5">OOS</p><p className="font-mono text-sm text-[var(--teal)]">{c.fmt(c.oos)}</p></div>
              </div>
              <p className={`font-mono text-[0.62rem] border-t border-[var(--border-dim)] pt-1.5 ${c.good ? 'text-[var(--teal)]' : 'text-[var(--text-3)]'}`}>{c.verdict}</p>
            </motion.div>
          ))}
        </div>

        {/* Actual OOS figure */}
        <div className="card-research p-4 mb-10">
          <p className="font-mono text-[0.65rem] text-[var(--text-3)] mb-3 uppercase tracking-wider">
            Figure 4 (original) — OOS equity curve from strategy_oos_submission.ipynb
          </p>
          <img src="figures/fig3_oos_equity.png" alt="OOS equity curve D485–D726"
            className="w-full rounded" style={{ filter: 'brightness(0.97) contrast(1.05)' }}/>
        </div>

        <Finding label="§5.4 — Three Noteworthy OOS Patterns">
          (1) OOS CAGR +17.64% modestly exceeds IS +17.26% — the growth signal is not overfitted.
          (2) OOS MaxDD −10.18% is shallower than IS −12.32% — risk overlays continue to function as designed.
          (3) OOS Sharpe 1.00 vs IS 1.42 — a reduction consistent with the shorter evaluation window (~1 year)
          and greater uncertainty inherent in unseen market conditions.
        </Finding>

        <ResearchNote label="Is the Sharpe decline evidence of decay?">
          <p>The paper attributes the Sharpe decline to the shorter OOS window (≈1 year vs ≈1.9 years IS).
          With fewer observations, the standard error of the Sharpe ratio estimate is larger, and the
          realized Sharpe will naturally exhibit more variance. The CAGR and MaxDD metrics — which
          are less sensitive to window length — both improve OOS, providing stronger evidence of generalization.</p>
        </ResearchNote>
      </div>
    </section>
  );
}
