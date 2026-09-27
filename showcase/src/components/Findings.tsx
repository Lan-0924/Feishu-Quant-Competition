const FINDINGS = [
  {
    title: 'IS/OOS consistency confirms no significant overfitting',
    body: (
      <>
        OOS CAGR (+17.64%) modestly exceeds in-sample (+17.26%), and OOS MaxDD (−10.18%)
        is shallower than IS (−12.32%). The strategy's strict look-ahead controls –
        1-day factor lag, IS-only fitted weights, frozen sector map, and purged walk-forward
        Ridge – appear sufficient to prevent the IS performance from being inflated
        by data snooping.
      </>
    ),
  },
  {
    title: 'OOS Sharpe declining is expected and informative',
    body: (
      <>
        Sharpe falls from 1.42 (IS) to 1.00 (OOS). This is expected: the IS window
        spans ~2 years while OOS spans ~1 year, yielding wider estimation noise; the
        OOS period also represents genuinely unseen market conditions. The OOS Calmar
        ratio (1.73) exceeds IS (1.40), suggesting the drawdown profile improved
        even as annualised return-to-risk compressed.
      </>
    ),
  },
  {
    title: 'The Ridge sleeve gains come from diversification, not substitution',
    body: (
      <>
        The Ridge sleeve alone achieves CAGR +1.5%, Sharpe 0.18, MDD −24.5% –
        a poor strategy by any measure. Blended at 20% weight, it lifts CAGR by
        +4.9pp and Sharpe by +0.42 while leaving MDD practically unchanged.
        The improvement is attributed to signal breadth: the Ridge's predictions
        are decorrelated from the ICIR-weighted baseline, adding information
        without amplifying drawdown risk.
      </>
    ),
  },
  {
    title: 'LOB microstructure factors carry genuinely orthogonal information',
    body: (
      <>
        The two LOB factors selected into BaseAlpha – <code>DWI_AFT_MORN</code>{' '}
        (afternoon vs. morning depth-weighted imbalance) and <code>SPR_D</code>{' '}
        (daily average bid-ask spread) – show near-zero cross-sectional rank
        correlation to price-based factors. This validates the family-diversification
        constraint: without the family cap, these signals would likely have been
        crowded out by the stronger in-sample reversal factors.
      </>
    ),
  },
  {
    title: 'Sector residualisation improves signal quality at modest IC cost',
    body: (
      <>
        Partial sector-mean removal (λ = 0.5) reduces BaseAlpha's ICIR from
        0.674 → 0.815, a +21% improvement, at the cost of a modest IC decline
        (0.1026 → 0.0947). The improvement confirms that raw sector co-movement was
        inflating apparent IC without adding genuine cross-sectional predictive content.
        The frozen statistical sector map transfers cleanly to OOS without refitting.
      </>
    ),
  },
]

export default function Findings() {
  return (
    <section id="findings">
      <div className="content">
        <h2>Key Findings</h2>

        <ol className="findings-list" role="list">
          {FINDINGS.map((f, i) => (
            <li key={i} className="finding-item" role="listitem">
              <span className="finding-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="finding-text">
                <strong>{f.title}.</strong>{' '}
                {f.body}
              </div>
            </li>
          ))}
        </ol>

        {/* Limitations */}
        <div className="subsection" style={{ marginTop: '3rem' }}>
          <h3 className="subsection-title">Limitations</h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: '1.9', color: 'var(--text)' }}>
            <li>
              The statistical sector model is estimated on an early IS window (D080–D240) and
              frozen; it may drift over longer horizons or across structural market shifts.
            </li>
            <li>
              A 12-name concentrated portfolio carries meaningful idiosyncratic risk.
              Position caps and the minimum-holdings floor reduce but do not eliminate this.
            </li>
            <li>
              The execution model assumes fills at official reference prices (open, VWAP)
              without market impact. At scales meaningfully larger than RMB 50M,
              realized execution would likely diverge.
            </li>
            <li>
              The OOS Sharpe estimate (1.00 over ~242 days) carries wide confidence bounds.
              A longer evaluation window would be needed for precise inference.
            </li>
            <li>
              The ~1-year OOS window covers a single market regime. Strategy behaviour
              during a sustained bear market or liquidity crisis beyond the drawdown
              breaker's design parameters is untested.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
