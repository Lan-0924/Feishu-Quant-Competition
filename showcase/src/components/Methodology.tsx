const BASE = '/Feishu-Quant-Competition'

// Factor weights from IS notebook output (verbatim)
const FACTOR_WEIGHTS = [
  { name: 'z_LOWVOL',       weight: +0.174, desc: 'Prefer low realized-volatility stocks (20d)' },
  { name: 'z_RANGE_PCT',    weight: +0.156, desc: 'Prefer calm intraday HL range' },
  { name: 'z_SKEW_60',      weight: +0.155, desc: 'Anti-lottery: negative 60d skew preferred' },
  { name: 'z_REV_20',       weight: +0.141, desc: '20-day price reversal' },
  { name: 'z_DWI_AFT_MORN', weight: -0.118, desc: 'LOB: afternoon sell pressure exceeds morning' },
  { name: 'z_SPR_D',        weight: -0.109, desc: 'LOB: avoid wide bid-ask spreads (daily avg)' },
  { name: 'z_REV_10',       weight: +0.074, desc: '10-day price reversal' },
  { name: 'z_OVNT',         weight: -0.073, desc: 'Avoid overnight gap-up stocks' },
]

export default function Methodology() {
  return (
    <section id="methodology">
      <div className="content">
        <h2>Strategy Architecture</h2>
        <p style={{ marginBottom: '2.5rem', maxWidth: '60ch', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          A four-stage pipeline: factor construction → alpha blending →
          sector residualisation → portfolio construction with risk overlays.
          Look-ahead is controlled at every layer.
        </p>

        {/* 1 — Factor Library */}
        <div className="subsection">
          <h3 className="subsection-title">Factor Library — 27 Candidates across 9 Families</h3>
          <p>
            All 27 factors are computed from daily OHLCV data or from the 10-minute,
            10-level LOB snapshots. Each factor is signed so that a higher value predicts
            higher expected return, 1-day lagged to eliminate look-ahead bias,
            and daily cross-sectional winsorised (1st/99th percentile) and
            z-scored.
          </p>

          <table className="research-table" style={{ marginTop: '1.25rem' }} aria-label="Factor library">
            <thead>
              <tr>
                <th>Family</th>
                <th>Key Factors</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Short-horizon reversal</td>
                <td><code>REV_1</code> <code>REV_3</code> <code>REV_5</code> <code>REV_10</code> <code>REV_20</code></td>
                <td>Daily</td>
              </tr>
              <tr>
                <td>Volatility / risk</td>
                <td><code>LOWVOL</code> (20d vol) &nbsp; <code>RANGE_PCT</code> (daily HL range)</td>
                <td>Daily</td>
              </tr>
              <tr>
                <td>Skewness</td>
                <td><code>SKEW_60</code> (60d return skewness)</td>
                <td>Daily</td>
              </tr>
              <tr>
                <td>Intraday</td>
                <td><code>OVNT</code> (overnight rev.) &nbsp; <code>MORN_REV</code> &nbsp; <code>INTRA_MOM</code></td>
                <td>Daily + LOB</td>
              </tr>
              <tr>
                <td>Order-flow imbalance</td>
                <td>
                  <code>OFI_D</code> &nbsp; <code>DWI_D</code> &nbsp; <code>DWI10_D</code> &nbsp;
                  <code>OFI_LAST4</code> &nbsp; <code>OFI_TREND</code> &nbsp; <code>OFI_RANGE</code>
                </td>
                <td>LOB (10-min)</td>
              </tr>
              <tr>
                <td>Microstructure</td>
                <td>
                  <code>SPR_D</code> &nbsp; <code>DWI_AFT_MORN</code> &nbsp;
                  <code>MIDPRICE_VOL</code> &nbsp; <code>BOOK_TIGHTNESS</code> &nbsp; <code>SPR_RANGE</code>
                </td>
                <td>LOB (10-min)</td>
              </tr>
              <tr>
                <td>Momentum / trend</td>
                <td><code>MOM_60_20</code> &nbsp; <code>RANGE_TREND</code></td>
                <td>Daily</td>
              </tr>
              <tr>
                <td>Illiquidity</td>
                <td><code>ILLIQ</code> (Amihud) &nbsp; <code>AMT_GROWTH_5</code></td>
                <td>Daily</td>
              </tr>
            </tbody>
          </table>

          {/* Factor correlation heatmap */}
          <div className="figure-wrap" style={{ marginTop: '1.75rem' }}>
            <img
              src={`${BASE}/figures/fig3_factor_corr.png`}
              alt="Cross-sectional Spearman rank-correlation matrix of the 8 selected BaseAlpha factors"
              loading="lazy"
            />
            <p className="figure-caption">
              <strong>Figure 1.</strong> Cross-sectional Spearman rank-correlation matrix of the 8 selected
              BaseAlpha factors (IS mean, ordered by absolute ICIR weight descending).
              The strongest off-diagonal correlation (REV_10 / REV_20 ≈ 0.63) motivates the family-cap
              constraint. LOB factors (<code>DWI_AFT_MORN</code>, <code>SPR_D</code>) show near-zero
              correlation to price-based factors, confirming genuine information breadth.
            </p>
          </div>
        </div>

        {/* 2 — BaseAlpha */}
        <div className="subsection">
          <h3 className="subsection-title">BaseAlpha — ICIR-Weighted Composite</h3>
          <p>
            From the 27 candidates, factors are screened through four gates applied
            on in-sample data only: |IC|&nbsp;≥&nbsp;0.010, |ICIR|&nbsp;≥&nbsp;0.12,
            sign-stable across both IS sub-periods, and pairwise correlation to any
            anchor ≤&nbsp;0.65. A family cap (maximum 2 per theme) prevents cluster
            concentration. The top 8 survivors are assigned weights:
          </p>
          <code className="inline-formula">w_c = sign(IC_c) × |ICIR_c| / Σ|ICIR_c'|</code>
          <p>The 8 selected factors and their IS weights:</p>

          <div className="factor-list" role="list" aria-label="Factor weights">
            {FACTOR_WEIGHTS.map(f => (
              <div className="factor-row" key={f.name} role="listitem" title={f.desc}>
                <span className="factor-name">{f.name}</span>
                <span className="factor-weight">{f.weight > 0 ? '+' : ''}{f.weight.toFixed(3)}</span>
                <span className="factor-desc">{f.desc}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            BaseAlpha achieves IC&nbsp;=&nbsp;+0.1026, ICIR&nbsp;=&nbsp;+0.674 in-sample.
            Positive weights favour defensive, low-risk stocks (LOWVOL, RANGE_PCT) and anti-lottery
            characteristics (SKEW_60); negative weights avoid LOB selling pressure
            and wide spreads.
          </p>
        </div>

        {/* 3 — Sector Residualisation */}
        <div className="subsection">
          <h3 className="subsection-title">Sector Residualisation</h3>
          <p>
            No official GICS labels are available, so statistical sectors are estimated
            from return co-movement: PCA (20 components) applied to the D080–D240 return
            panel, followed by k-means clustering into 10 groups. The sector map is
            fitted once and <strong>frozen</strong> — it is never refit on OOS data.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            Partial sector-mean removal (λ&nbsp;=&nbsp;0.5) reduces cross-sectional sector
            exposure without fully neutralising it:
          </p>
          <code className="inline-formula">
            BaseAlpha_res = BaseAlpha − 0.5 × BaseAlpha_sector_mean
          </code>
          <p>
            This improves ICIR from 0.674 → 0.815 while accepting a modest IC decline
            (0.1026 → 0.0947), confirming that raw sector co-movement was diluting
            signal quality.
          </p>
        </div>

        {/* 4 — ML Sleeve */}
        <div className="subsection">
          <h3 className="subsection-title">Walk-Forward Ridge Ensemble Sleeve</h3>
          <p>
            A Ridge regression (regularisation α&nbsp;=&nbsp;10) is trained to predict the
            5-day forward cross-sectional return rank from all 27 z-scored factors.
            Training is strictly walk-forward:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
            <li><strong>Expanding window, past-only:</strong> each refit uses only observations dated before the prediction day.</li>
            <li><strong>12-day purge gap</strong> (≥ 5-day target horizon): no training label's return window overlaps any prediction, eliminating overlapping-return leakage.</li>
            <li><strong>Retrained every 30 days.</strong></li>
          </ul>
          <p style={{ marginTop: '0.85rem' }}>
            The Ridge sleeve alone achieves IC&nbsp;=&nbsp;+0.0945, ICIR&nbsp;=&nbsp;+0.619, but
            is a poor standalone strategy (CAGR +1.5%, Sharpe 0.18, MDD −24.5%).
            Its value is as a <em>decorrelated ensemble component</em>. The final signal
            blends it at 20%:
          </p>
          <code className="inline-formula">alpha_final = 0.8 × z(BaseAlpha_res) + 0.2 × z(ridge_5d)</code>
          <p>
            The combined signal achieves IC&nbsp;=&nbsp;+0.0980, ICIR&nbsp;=&nbsp;+0.795 — higher IC
            than either component alone, with the ICIR intermediate between them.
          </p>
        </div>

        {/* 5 — Portfolio Construction */}
        <div className="subsection">
          <h3 className="subsection-title">Portfolio Construction and Risk Overlays</h3>
          <p>
            The top <strong>N&nbsp;=&nbsp;12</strong> eligible stocks by alpha rank
            are selected each rebalance (minimum 10 holdings floor, 9% per-name cap).
            Incumbents in the top-50 ranked names are retained without rebalancing to
            limit unnecessary turnover. Rebalance frequency: every 10 trading days.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            Position sizing is a 50/50 blend of inverse-volatility and alpha-rank weights,
            capped and renormalised. Three exposure overlays are then applied — each
            targeting one term of the competition score function:
          </p>

          <table className="research-table" style={{ marginTop: '1rem' }} aria-label="Risk overlays">
            <thead>
              <tr>
                <th>Overlay</th>
                <th>Rule</th>
                <th>Score term</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Volatility target</strong></td>
                <td>Scale gross exposure toward 18% annualised vol; adjustments bounded [0.90, 1.10]</td>
                <td>CAGR</td>
              </tr>
              <tr>
                <td><strong>Breadth gross-up</strong></td>
                <td>Raise exposure ceiling to 1.20× when &gt;55% of eligible names show positive 20d return</td>
                <td>Sharpe</td>
              </tr>
              <tr>
                <td><strong>Drawdown breaker</strong></td>
                <td>Cut exposure to 0.50× floor if portfolio falls &gt;5% below recent peak; restore over 3 days</td>
                <td>MaxDD</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Execution: sells at open price (T+1), buys at 09:30–09:35 VWAP.
            Fees: 1bp (min RMB 5) both sides + 5bp stamp on sells. Lot size: 100 shares.
            No leverage. Initial capital: RMB 50M.
          </p>
        </div>
      </div>
    </section>
  )
}
