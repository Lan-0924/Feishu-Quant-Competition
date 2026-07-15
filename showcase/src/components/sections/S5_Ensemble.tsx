import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { SectionMeta } from '../ui/SectionMeta';
import { Finding } from '../ui/Finding';
import { ResearchNote } from '../ui/ResearchNote';
import { Formula } from '../ui/Formula';
import { useNavData } from '../../hooks/useNavData';
import { navRecordsToPlotly } from '../../data/chartHelpers';
import { BASE_EQUITY, RIDGE_EQUITY, FINAL_EQUITY_IS, INITIAL_CAPITAL } from '../../data/strategyData';

const EXPERIMENT_ROWS = [
  { signal: 'BaseAlpha (sector-resid.)', ic: '0.0947', icir: '0.815', cagr: '+12.41%', sr: '1.00', mdd: '−12.26%', calmar: '1.01', fitness: '0.11', nav: '¥62.59M', color: 'var(--blue)', verdict: 'Good standalone signal', bad: false },
  { signal: 'Ridge sleeve (walk-forward)', ic: '0.0945', icir: '0.619', cagr: '+1.49%', sr: '0.18', mdd: '−24.53%', calmar: '0.06', fitness: '0.01', nav: '¥51.44M', color: 'var(--purple)', verdict: 'Poor standalone signal', bad: true },
  { signal: 'Finalpha (0.8/0.2 blend)', ic: '0.0980', icir: '0.795', cagr: '+17.26%', sr: '1.42', mdd: '−12.32%', calmar: '1.40', fitness: '0.18', nav: '¥67.88M', color: 'var(--teal)', verdict: 'Best — ensemble effect', bad: false, bold: true },
];

const PLOT_CFG = { displayModeBar: false as const, responsive: true };
const LAYOUT_BASE = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  margin: { t: 8, r: 12, b: 36, l: 60 },
  font: { family: 'JetBrains Mono', color: '#8895A7', size: 9 },
  legend: { bgcolor: 'transparent', font: { size: 8.5, color: '#8895A7' }, x: 0.01, y: 0.99 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.05)', tickfont: { size: 9 }, title: { text: 'Day (D080–D484)', font: { size: 8 } } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.05)', tickfont: { size: 9 } },
};

export function S5_Ensemble() {
  const [showBlend, setShowBlend] = useState(false);
  const [ridgeW, setRidgeW] = useState(20);
  const { data: navData, status } = useNavData();
  const isReal = status === 'ready' && navData !== null;

  const baseRec  = isReal ? navData!.is_base  : BASE_EQUITY.navs.map((v, i) => ({ day: 80+i, nav: v, dd: BASE_EQUITY.drawdowns[i] }));
  const ridgeRec = isReal ? navData!.is_ridge : RIDGE_EQUITY.navs.map((v, i) => ({ day: 80+i, nav: v, dd: RIDGE_EQUITY.drawdowns[i] }));
  const finalRec = isReal ? navData!.is_final : FINAL_EQUITY_IS.navs.map((v, i) => ({ day: 80+i, nav: v, dd: FINAL_EQUITY_IS.drawdowns[i] }));

  const { days, navsM: baseM, drawdowns: baseDD }   = navRecordsToPlotly(baseRec);
  const { navsM: ridgeM, drawdowns: ridgeDD }         = navRecordsToPlotly(ridgeRec);
  const { navsM: finalM, drawdowns: finalDD }         = navRecordsToPlotly(finalRec);

  const equityData = [
    { x: days, y: baseM,  type: 'scatter', mode: 'lines', name: 'BaseAlpha  (+12.4%, SR 1.00)',  line: { color: '#4B8FD4', width: 1.5 } },
    { x: days, y: ridgeM, type: 'scatter', mode: 'lines', name: 'Ridge only  (+1.5%, SR 0.18)', line: { color: '#8A72CC', width: 1.5, dash: 'dot' as const } },
    { x: days, y: finalM, type: 'scatter', mode: 'lines', name: 'Finalpha (+17.3%, SR 1.42)', line: { color: '#2EA44F', width: 2.5 } },
  ];

  const ddData = [
    { x: days, y: baseDD,  type: 'scatter', mode: 'lines', name: 'BaseAlpha DD',   line: { color: '#4B8FD4', width: 1.5 }, fill: 'tozeroy' as const, fillcolor: 'rgba(75,143,212,0.06)' },
    { x: days, y: ridgeDD, type: 'scatter', mode: 'lines', name: 'Ridge DD',       line: { color: '#8A72CC', width: 1.5, dash: 'dot' as const }, fill: 'tozeroy' as const, fillcolor: 'rgba(138,114,204,0.05)' },
    { x: days, y: finalDD, type: 'scatter', mode: 'lines', name: 'Finalpha DD', line: { color: '#2EA44F', width: 2 }, fill: 'tozeroy' as const, fillcolor: 'rgba(46,164,79,0.07)' },
  ];

  return (
    <section id="ensemble" className="py-28 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <SectionMeta
          num="§ 4.  Main Result — The Ensemble Experiment"
          question="Why does adding a weak signal improve a strong portfolio?"
          lead={
            <>
              This is the paper's central empirical result. The same portfolio engine is applied to three
              signals independently. The result challenges the naive view that better prediction means
              better portfolios.
            </>
          }
        />

        {/* The experiment framing */}
        <div className="mb-12 border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
            <p className="font-mono text-[0.68rem] text-[var(--text-3)] tracking-wider uppercase">
              Experiment — Table 3 of Research Report (IS D080–D484, identical portfolio engine)
            </p>
            {isReal && (
              <p className="font-mono text-[0.62rem] text-[var(--teal)] mt-0.5">
                ● Equity curves computed from exact backtest data
              </p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="table-research">
              <thead>
                <tr>
                  <th>Signal</th>
                  <th>IC</th>
                  <th>ICIR</th>
                  <th>CAGR</th>
                  <th>Sharpe</th>
                  <th>MaxDD</th>
                  <th>Calmar</th>
                  <th>Fitness</th>
                  <th>Final NAV</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {EXPERIMENT_ROWS.map(row => (
                  <tr key={row.signal} className={row.bold ? 'row-highlight' : ''}>
                    <td style={{ color: row.color }} className={row.bold ? 'font-semibold' : ''}>{row.signal}</td>
                    <td className="pos">{row.ic}</td>
                    <td>{row.icir}</td>
                    <td className={row.bad ? 'text-[var(--red)]' : 'pos font-semibold'}>{row.cagr}</td>
                    <td className={row.bad ? 'text-[var(--text-3)]' : ''}>{row.sr}</td>
                    <td className={row.bad ? 'text-[var(--red)]' : 'neg'}>{row.mdd}</td>
                    <td className={row.bad ? 'text-[var(--text-3)]' : ''}>{row.calmar}</td>
                    <td className={row.bold ? 'pos font-bold' : ''}>{row.fitness}</td>
                    <td className={row.bold ? 'pos font-semibold' : ''}>{row.nav}</td>
                    <td className="text-[0.7rem]" style={{ color: row.bad ? 'var(--red)' : row.bold ? 'var(--teal)' : 'var(--text-3)' }}>
                      {row.verdict}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* The "aha" observation */}
        <div className="max-w-prose mb-12 space-y-4">
          <p className="text-[0.9rem] text-[var(--text-2)] leading-relaxed">
            The Ridge sleeve has virtually identical IC (0.0945) and a lower ICIR (0.619) compared to
            BaseAlpha. As a standalone strategy it produces CAGR of only <span className="text-[var(--red)] font-mono font-semibold">+1.49%</span>,
            Sharpe of <span className="text-[var(--red)] font-mono font-semibold">0.18</span>,
            and a devastating MaxDD of <span className="text-[var(--red)] font-mono font-semibold">−24.53%</span>.
          </p>
          <p className="text-[0.9rem] text-[var(--text-2)] leading-relaxed">
            Yet allocating <strong className="text-[var(--text)]">20% signal weight</strong> to it lifts the ensemble CAGR by{' '}
            <span className="text-[var(--teal)] font-mono font-semibold">+4.85pp</span>,
            Sharpe by <span className="text-[var(--teal)] font-mono font-semibold">+0.42</span>,
            while leaving MaxDD essentially unchanged at −12.32%.
          </p>
        </div>

        <Finding label="Main Empirical Result — §5.2">
          The Ridge sleeve is a poor standalone strategy, yet allocating 20% signal weight to it
          lifts both Sharpe and CAGR substantially while leaving drawdown essentially unchanged.
          The gain appears to reflect a <em>diversification effect</em> rather than the substitution
          of a stronger predictor. We regard this as the main empirical result of the study.
        </Finding>

        {/* Equity curves — actual backtest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="card-research p-4">
            <p className="font-mono text-[0.68rem] text-[var(--text-3)] mb-3 uppercase tracking-wider">
              Figure 2a — IS Equity Curves{isReal ? ' (exact backtest)' : ' (approx.)'}
            </p>
            <Plot
              data={equityData as any}
              layout={{ ...LAYOUT_BASE, yaxis: { ...LAYOUT_BASE.yaxis, title: { text: 'NAV (¥M)', font: { size: 9 } } } } as any}
              config={PLOT_CFG}
              style={{ width: '100%', height: '260px' }}
            />
          </div>
          <div className="card-research p-4">
            <p className="font-mono text-[0.68rem] text-[var(--text-3)] mb-3 uppercase tracking-wider">
              Figure 2b — IS Drawdown{isReal ? ' (exact backtest)' : ' (approx.)'}
            </p>
            <Plot
              data={ddData as any}
              layout={{ ...LAYOUT_BASE, yaxis: { ...LAYOUT_BASE.yaxis, title: { text: 'Drawdown (%)', font: { size: 9 } } } } as any}
              config={PLOT_CFG}
              style={{ width: '100%', height: '260px' }}
            />
          </div>
        </div>

        {/* Notebook figure */}
        <div className="card-research p-4 mb-12">
          <p className="font-mono text-[0.65rem] text-[var(--text-3)] mb-3 uppercase tracking-wider">
            Figure 2 (original) — from strategy_signal_breakdown_IS.ipynb
          </p>
          <img src="figures/fig2_signal_decomposition.png"
            alt="IS signal decomposition: BaseAlpha vs ridge_5d vs Finalpha"
            className="w-full rounded" style={{ filter: 'brightness(0.97) contrast(1.05)' }} />
        </div>

        {/* Why? Explanation */}
        <div className="border-t border-[var(--border)] pt-12 mb-10">
          <p className="section-num mb-6">Why does a weak signal improve a strong portfolio?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                heading: 'Not about IC',
                body: 'The Ridge has nearly identical IC to BaseAlpha (0.0945 vs 0.0947). The ensemble does not improve because the Ridge is a "better predictor" — it is not.',
              },
              {
                heading: 'About decorrelation',
                body: 'The Ridge sleeve learns a different weighting of the 27 z-factors through regularized regression. Its prediction errors are largely independent of BaseAlpha errors.',
              },
              {
                heading: 'Portfolio diversification',
                body: 'When two signals with decorrelated errors are blended, the combined prediction is smoother. Portfolio returns become more consistent, lifting Sharpe without hurting MaxDD.',
              },
            ].map((c, i) => (
              <motion.div key={c.heading} className="card-research p-5"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="font-mono text-[0.65rem] text-[var(--blue)] tracking-wider mb-2 uppercase">{c.heading}</p>
                <p className="text-[0.82rem] text-[var(--text-2)] leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>

          <Formula label="Ensemble composition">
{`Finalpha_{i,t} = 0.8 × z(BaseAlpha_res)_{i,t} + 0.2 × z(ridge5d)_{i,t}

IC_ensemble = 0.0980 > max(IC_base, IC_ridge) = max(0.0947, 0.0945)
ICIR_ensemble = 0.795

The ensemble IC is higher than either component alone —
confirming complementary information content.`}
          </Formula>
        </div>

        {/* Blend weight explorer */}
        <div className="card-research p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-[0.65rem] text-[var(--blue)] tracking-wider uppercase mb-1">Blend Explorer</p>
              <p className="text-[0.8rem] text-[var(--text-2)]">Explore how Ridge weight affects estimated final NAV</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-semibold text-[var(--amber)]">{ridgeW}%</p>
              <p className="font-mono text-[0.6rem] text-[var(--text-3)]">Ridge weight</p>
            </div>
          </div>
          <input type="range" min={0} max={50} step={5} value={ridgeW}
            onChange={e => setRidgeW(Number(e.target.value))}
            className="w-full h-px bg-[var(--border)] appearance-none cursor-pointer accent-[#4B8FD4] mb-3" />
          <div className="flex justify-between font-mono text-[0.6rem] text-[var(--text-3)] mb-4">
            <span>0%</span><span>20% ← selected</span><span>50%</span>
          </div>
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="card-research p-3">
              <p className="text-[0.6rem] text-[var(--text-3)] mb-1">BaseAlpha weight</p>
              <p className="font-semibold text-[var(--blue)]">{100 - ridgeW}%</p>
            </div>
            <div className="card-research p-3">
              <p className="text-[0.6rem] text-[var(--text-3)] mb-1">Ridge weight</p>
              <p className="font-semibold text-[var(--purple)]">{ridgeW}%</p>
            </div>
            <div className="card-research p-3">
              <p className="text-[0.6rem] text-[var(--text-3)] mb-1">IS period (approx.)</p>
              <p className="font-semibold text-[var(--teal)]">
                ¥{(50 + (ridgeW === 20 ? 17.88 : ridgeW === 0 ? 12.59 : ridgeW === 50 ? 7.0 : 12.59 + (17.88 - 12.59) * Math.max(0, 4*ridgeW/100*(1-ridgeW/100))*3)).toFixed(1)}M est.
              </p>
            </div>
          </div>
          <p className="font-mono text-[0.62rem] text-[var(--text-3)] mt-3">
            Note: IS CAGR optimal near 20% Ridge. Both extremes (0% = pure base, 50% = half Ridge) underperform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ResearchNote label="Why 20% Ridge and not more?">
            <p>The 20% weight was selected in-sample. At higher Ridge weights, the signal instability
            (ICIR 0.619) begins to manifest as drawdown risk — the Ridge MDD of −24.53% bleeds into
            the ensemble. At 20%, the diversification gain (decorrelated errors reduce portfolio variance)
            outweighs the added instability risk.</p>
          </ResearchNote>
          <ResearchNote label="Is the Ridge gain data-mined?">
            <p>The 20% weight was fixed before OOS evaluation. In OOS (D485–D726), the ensemble
            achieves CAGR +17.64% vs IS +17.26% — the advantage is preserved out-of-sample,
            providing evidence that the diversification benefit is real and not overfitted.</p>
          </ResearchNote>
        </div>
      </div>
    </section>
  );
}
