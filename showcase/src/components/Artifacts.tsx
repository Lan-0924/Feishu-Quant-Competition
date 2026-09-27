const BASE = '/Feishu-Quant-Competition'

const ARTIFACTS = [
  {
    href: `${BASE}/Research_report.pdf`,
    external: false,
    title: 'Research Report (PDF)',
    desc: 'Full 16-page paper: methodology, empirical results, tables, and discussion. ' +
          '"A Defensive Short-Horizon Reversal Strategy with Order-Book Microstructure for Long-Only A-Share Portfolios"',
    label: 'Download PDF',
  },
  {
    href: 'https://github.com/Lan-0924/Feishu-Quant-Competition',
    external: true,
    title: 'Source Code — GitHub',
    desc: 'Three Jupyter notebooks (strategy_final, signal_breakdown_IS, oos_submission), ' +
          'requirements.txt, and all figures. Python 3.12, Polars, scikit-learn. ' +
          'Proprietary competition data files are not included.',
    label: 'View on GitHub',
  },
]

export default function Artifacts() {
  return (
    <section id="artifacts">
      <div className="content">
        <h2>Report &amp; Code</h2>

        <div className="artifacts-grid" role="list">
          {ARTIFACTS.map((a, i) => (
            <a
              key={i}
              href={a.href}
              target={a.external ? '_blank' : undefined}
              rel={a.external ? 'noopener noreferrer' : undefined}
              className="artifact-row"
              role="listitem"
              aria-label={`${a.title} — ${a.label}`}
            >
              <div className="artifact-info">
                <div className="artifact-title">{a.title}</div>
                <div className="artifact-desc">{a.desc}</div>
              </div>
              <span className="artifact-arrow" aria-hidden="true">
                {a.external ? '↗' : '↓'}
              </span>
            </a>
          ))}
        </div>

        <p className="artifact-note">
          The four raw Parquet data files (~3 GB) are proprietary to the Feishu Quant Competition
          and are not included in this repository. The notebooks will not run without them.
          All figures and quantitative results shown here were generated from those files
          using the pinned package versions in <code>requirements.txt</code>.
        </p>
      </div>
    </section>
  )
}
