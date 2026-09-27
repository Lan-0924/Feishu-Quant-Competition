export default function Hero() {
  const BASE = '/Feishu-Quant-Competition'

  return (
    <section className="hero" id="hero">
      <div className="content">
        <h1>A Defensive Short-Horizon Reversal Strategy<br />with Order-Book Microstructure</h1>

        <p className="hero-meta">
          Dzung Nguyen &nbsp;·&nbsp; Team T025 &nbsp;·&nbsp; Top 10 Finalist, Feishu Quant Competition 2026
        </p>

        <p className="hero-desc">
          A concentrated long-only strategy for Shanghai A-share markets that combines
          an 8-factor ICIR-weighted alpha signal — blending price-based reversals with
          order-book microstructure — with a walk-forward Ridge ensemble and three
          risk overlays, evaluated under strict leakage controls across
          an in-sample and a blind out-of-sample period.
        </p>

        <p className="hero-key-stats">
          <span className="ks-label">IS</span>
          <span className="ks-val">+17.3%</span><span className="ks-metric">CAGR</span>
          <span className="ks-sep">·</span>
          <span className="ks-val">1.42</span><span className="ks-metric">Sharpe</span>
          <span className="ks-sep">·</span>
          <span className="ks-val">−12.3%</span><span className="ks-metric">MDD</span>
          <span className="ks-divider">/</span>
          <span className="ks-label">OOS</span>
          <span className="ks-val">+17.6%</span><span className="ks-metric">CAGR</span>
          <span className="ks-sep">·</span>
          <span className="ks-val">1.00</span><span className="ks-metric">Sharpe</span>
          <span className="ks-sep">·</span>
          <span className="ks-val">−10.2%</span><span className="ks-metric">MDD</span>
        </p>

        <div className="hero-links">
          <a
            href={`${BASE}/Research_report.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M10 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 9h4M6 11.5h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Research Report
          </a>
          <a
            href="https://github.com/Lan-0924/Feishu-Quant-Competition"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
                1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
                1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
                1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub Repository
          </a>
        </div>
      </div>
    </section>
  )
}
