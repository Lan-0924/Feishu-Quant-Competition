const BASE = '/Feishu-Quant-Competition'

export default function Results() {
  return (
    <section id="results">
      <div className="content">
        <h2>Performance</h2>

        {/* IS Equity Curve */}
        <div className="figure-wrap" style={{ marginTop: '2rem' }}>
          <img
            src={`${BASE}/figures/fig1_is_equity.png`}
            alt="Final Alpha in-sample NAV and drawdown, D080–D484"
            loading="lazy"
          />
          <p className="figure-caption">
            <strong>Figure 2.</strong> Final Alpha in-sample NAV (top, RMB M) and portfolio drawdown
            in percentage points (bottom), D080–D484. Starting capital: RMB 50M.
            CAGR +17.3%, Sharpe 1.42, MDD −12.3%. Final NAV: RMB 67.88M.
          </p>
        </div>

        {/* Signal Decomposition */}
        <p style={{ marginTop: '2.5rem' }}>
          The identical portfolio simulator was run three times on the same IS period –
          once per signal – to isolate the contribution of each component.
          Only the signal changes; the portfolio engine, overlays, and execution rules
          are held constant.
        </p>
        <div className="figure-wrap" style={{ marginTop: '1.25rem' }}>
          <img
            src={`${BASE}/figures/fig2_signal_decomposition.png`}
            alt="IS backtest: BaseAlpha baseline vs ridge_5d vs combined Final Alpha"
            loading="lazy"
          />
          <p className="figure-caption">
            <strong>Figure 3.</strong> IS backtest (D080–D484): BaseAlpha baseline (blue,
            CAGR +12.4%, Sharpe 1.00, MDD −12.3%) vs.
            walk-forward ridge_5d alone (orange, CAGR +1.5%, Sharpe 0.18, MDD −24.5%) vs.
            combined Final Alpha at 0.8/0.2 blend (green, CAGR +17.3%, Sharpe 1.42, MDD −12.3%).
            Top: NAV. Bottom: drawdown. The Ridge sleeve is a poor standalone strategy;
            blended at 20%, it adds +4.9pp CAGR and +0.42 Sharpe while leaving MDD unchanged.
          </p>
        </div>

        {/* Signal comparison table */}
        <div className="results-table-wrap" style={{ marginTop: '1.25rem' }}>
          <table className="research-table" aria-label="Signal attribution table">
            <thead>
              <tr>
                <th>Signal</th>
                <th className="num">IC</th>
                <th className="num">ICIR</th>
                <th className="num">CAGR</th>
                <th className="num">Sharpe</th>
                <th className="num">MaxDD</th>
                <th className="num">Final NAV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BaseAlpha baseline</td>
                <td className="num">+0.0947</td>
                <td className="num">0.815</td>
                <td className="num">+12.41%</td>
                <td className="num">1.00</td>
                <td className="num">−12.26%</td>
                <td className="num">62.59M</td>
              </tr>
              <tr>
                <td>ridge_5d (walk-forward)</td>
                <td className="num">+0.0945</td>
                <td className="num">0.619</td>
                <td className="num">+1.49%</td>
                <td className="num">0.18</td>
                <td className="num">−24.53%</td>
                <td className="num">51.44M</td>
              </tr>
              <tr className="highlight">
                <td>Final Alpha (0.8 / 0.2)</td>
                <td className="num">+0.0980</td>
                <td className="num">0.795</td>
                <td className="num">+17.26%</td>
                <td className="num">1.42</td>
                <td className="num">−12.32%</td>
                <td className="num">67.88M</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            All three rows run through the identical portfolio simulator on IS data (D080–D484).
            NAV in RMB millions, from RMB 50M initial capital.
          </p>
        </div>

        {/* OOS Equity Curve */}
        <p style={{ marginTop: '2.5rem' }}>
          The strategy was applied to the OOS period using a fresh RMB 50M cold start.
          All fitted artifacts (factor weights, sector map, Ridge hyperparameters) remained
          exactly as estimated on IS data – no re-optimisation.
        </p>
        <div className="figure-wrap" style={{ marginTop: '1.25rem' }}>
          <img
            src={`${BASE}/figures/fig3_oos_equity.png`}
            alt="Final Alpha out-of-sample NAV and drawdown, D485–D726"
            loading="lazy"
          />
          <p className="figure-caption">
            <strong>Figure 4.</strong> Out-of-sample NAV (top) and drawdown (bottom),
            D485–D726. Fresh RMB 50M cold start. CAGR +17.6%, Sharpe 1.00, MDD −10.2%.
            Total PnL: +16.89%. Final NAV: RMB 58.44M.
            OOS CAGR closely tracks the IS figure; MDD is shallower than in-sample.
          </p>
        </div>

        {/* IS vs OOS comparison */}
        <div className="subsection" style={{ marginTop: '2.5rem' }}>
          <h3 className="subsection-title">In-Sample vs. Out-of-Sample Summary</h3>
          <div className="results-table-wrap">
            <table className="comparison-table" aria-label="IS vs OOS performance comparison">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>In-Sample<br /><span style={{ fontWeight: 400, fontSize: '0.65rem' }}>D080–D484</span></th>
                  <th>Out-of-Sample<br /><span style={{ fontWeight: 400, fontSize: '0.65rem' }}>D485–D726</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="metric-name">CAGR</td>
                  <td>+17.26%</td>
                  <td>+17.64%</td>
                </tr>
                <tr>
                  <td className="metric-name">Sharpe Ratio</td>
                  <td>1.42</td>
                  <td>1.00</td>
                </tr>
                <tr>
                  <td className="metric-name">Max Drawdown</td>
                  <td>−12.32%</td>
                  <td>−10.18%</td>
                </tr>
                <tr>
                  <td className="metric-name">Calmar Ratio</td>
                  <td>1.40</td>
                  <td>1.73</td>
                </tr>
                <tr>
                  <td className="metric-name">Annual Turnover</td>
                  <td>10.96×</td>
                  <td>11.20×</td>
                </tr>
                <tr>
                  <td className="metric-name">Avg Daily Turnover</td>
                  <td>4.35%</td>
                  <td>4.45%</td>
                </tr>
                <tr>
                  <td className="metric-name">Final NAV (from RMB 50M)</td>
                  <td>RMB 67.88M</td>
                  <td>RMB 58.44M</td>
                </tr>
                <tr>
                  <td className="metric-name">Total PnL</td>
                  <td>+35.8%</td>
                  <td>+16.89%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
