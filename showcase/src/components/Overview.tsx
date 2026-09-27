export default function Overview() {
  return (
    <section id="overview">
      <div className="content">
        <h2>Problem and Context</h2>

        <div className="subsection">
          <h3 className="subsection-title">The Problem</h3>
          <p>
            Chinese A-share markets present a distinctive research environment: the long-only constraint
            is binding (limited short-selling, T+1 settlement), and retail-dominated order flow
            creates pronounced short-horizon reversals and intraday microstructure signals that
            institutional strategies rarely exploit systematically.
          </p>
          <p style={{ marginTop: '0.85rem' }}>
            The central challenge is not maximising raw predictive IC in isolation, but rather
            building a portfolio that generates positive net-of-cost returns across a concentrated,
            12-name long-only mandate — where turnover costs, lot-size constraints, and intraday
            execution friction matter substantially.
          </p>
        </div>

        <div className="subsection">
          <h3 className="subsection-title">Competition Structure</h3>
          <p>
            The Feishu Quant Competition (March–June 2026, Shanghai) provided official Shanghai Stock
            Exchange data and evaluated submissions on a composite score:
          </p>
          <code className="inline-formula">
            Score = 0.45 × CAGR<sub>pct</sub> + 0.30 × Sharpe<sub>pct</sub> + 0.25 × (1 − MaxDD)<sub>pct</sub>
          </code>
          <p style={{ marginTop: '0.75rem' }}>
            Each term is a cross-team percentile rank. This structure directly motivated the
            three portfolio risk overlays — one for each score component — and informed the
            ensemble blending decision. Academic partners included the University of Toronto
            Mathematical Finance &amp; RiskLab, TU Munich, and ETH/University of Zurich.
          </p>
        </div>

        <div className="subsection">
          <h3 className="subsection-title">Dataset</h3>
          <table className="research-table" aria-label="Dataset description">
            <thead>
              <tr>
                <th>Source</th>
                <th>Description</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>daily_data</code></td>
                <td>
                  Daily OHLCV, 09:30–09:35 VWAP, adjusted close prices
                </td>
                <td>726 trading days · 2,306 assets</td>
              </tr>
              <tr>
                <td><code>lob_data</code></td>
                <td>
                  10-minute, 10-level limit order book snapshots
                  (24 intraday points, 09:40–15:00;
                  10 bid/ask price &amp; volume levels per snapshot)
                </td>
                <td>Same panel</td>
              </tr>
              <tr>
                <td>In-sample (IS)</td>
                <td>
                  D080–D484 (~2 years of active positioning;
                  D001–D079 used as factor warm-up window)
                </td>
                <td>~2,270 unique assets · ~1.06M asset-days</td>
              </tr>
              <tr>
                <td>Out-of-sample (OOS)</td>
                <td>D485–D726, blind evaluation period</td>
                <td>242 trading days (~1 year)</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Data is proprietary to the competition and not included in the repository.
            ~11–13% of assets pass the daily eligibility screen.
          </p>
        </div>
      </div>
    </section>
  )
}
