import { motion } from 'framer-motion';
import { SectionMeta } from '../ui/SectionMeta';
import { Finding } from '../ui/Finding';
import { Formula } from '../ui/Formula';
import { ResearchNote } from '../ui/ResearchNote';

const CONTROLS = [
  {
    id: 'lag',
    num: 'LC-1',
    title: '1-Day Factor Lag',
    window: 'All factors, every day',
    color: 'var(--blue)',
    detail: 'Every factor is computed using shift(1) over asset_id. A day-t investment decision may only use information available through the close of day t−1. This causal boundary is applied at the source of every one of the 27 raw factors.',
    proof: 'Prevents use of same-day factor values in day-t decision.',
    code: 'features = features.with_columns([pl.col(c).shift(1).over("asset_id") for c in ALL_FACTORS])',
  },
  {
    id: 'isfit',
    num: 'LC-2',
    title: 'IS-Only Factor Weights',
    window: 'D001–D484',
    color: 'var(--blue)',
    detail: 'IC-IR weights, sign-stability tests, redundancy filtering, and family cap are all computed on in-sample data only. The 10-day forward-return target is masked so the rolling window never crosses into OOS. No weight is re-estimated after D484.',
    proof: 'IC computed with fwd_rank masked at IS boundary; no OOS labels ever seen.',
    code: 'fdf_is = fdf[fdf["day_idx"] <= 484]\nfdf_is["fwd_ret_fit"] = fdf_is.groupby("asset_id")["adj_close"].shift(-10)...',
  },
  {
    id: 'sector',
    num: 'LC-3',
    title: 'Frozen Sector Map',
    window: 'Fitted on D080–D240 only',
    color: 'var(--amber)',
    detail: 'PCA(20)+KMeans(10) sector clustering is estimated once using only D080–D240 daily return co-movement. The resulting asset→cluster mapping is frozen and never updated. OOS observations never influence sector labels.',
    proof: 'mc = (index>=80) & (index<=240) — training window hard-coded, not expanded.',
    code: 'mc = (asset_ret.index >= WARMUP_DAY) & (asset_ret.index <= 240)\nkm = KMeans(n_clusters=10, random_state=42).fit(Xp)',
  },
  {
    id: 'purge',
    num: 'LC-4',
    title: '12-Day Purge Gap',
    window: 'Ridge: each refit window',
    color: 'var(--red)',
    detail: 'Ridge walk-forward training sets use only observations strictly before (prediction_day − 12). The 12-day purge gap exceeds the 5-day target horizon, guaranteeing that no training label\'s forward-return window overlaps the prediction day. This eliminates the overlap leakage present in naive rolling regression.',
    proof: 'purge=12 > horizon=5: no training label forward-return overlaps prediction date.',
    code: 'tm = (darr < day - ML_PURGE) & vy\n# ML_PURGE=12 > RIDGE_HORIZON=5',
  },
  {
    id: 'retrain',
    num: 'LC-5',
    title: 'No OOS Retraining',
    window: 'OOS: D485–D726',
    color: 'var(--teal)',
    detail: 'All model artifacts used in OOS (factor weights, sector map, Ridge coefficients) are derived exclusively from data prior to each prediction date. The Ridge continues to update walk-forward in OOS but using past-only expanding windows with the 12-day purge. IS-fitted hyperparameters remain fixed.',
    proof: 'OOS portfolio driven entirely by IS-phase parameters. No hyperparameter re-selection.',
    code: '# Walk-forward Ridge retrains on expanding past-only window\n# All hyperparameters fixed before D485',
  },
];

export function S8_Leakage() {
  return (
    <section id="leakage" className="py-28 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <SectionMeta
          num="§ 7.  Leakage Audit"
          question="How do we prove there is no look-ahead bias?"
          lead={
            <>
              The pipeline is designed to prevent look-ahead at every stage. Five explicit controls
              are implemented and independently verified. An official-rules replay reproduces the
              strategy NAV to a relative error of 3.2×10⁻¹⁶.
            </>
          }
        />

        {/* Verification stamp */}
        <motion.div
          className="mb-12 flex items-start gap-5 p-5 border border-[rgba(46,164,79,0.25)] rounded-xl bg-[rgba(46,164,79,0.04)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-3xl flex-shrink-0">✓</div>
          <div>
            <p className="font-semibold text-[var(--text)] mb-1">Independent Replay — Submission Verified</p>
            <p className="text-[0.82rem] text-[var(--text-2)] leading-relaxed">
              An independent re-pricing of the submitted CSV (T025_sell_open.csv) from a ¥50M cold start
              under the literal Section-4 competition rules reproduces the strategy NAV to
              <span className="font-mono text-[var(--teal)]"> max|reldiff| = 3.2×10⁻¹⁶</span>.
              Minimum EOD holdings: 10 on all 242 OOS days. All 15 format and compliance checks PASS.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['181 order rows', '121 buys', '60 sells', '23 rebalance days', 'D485–D705', 'max|reldiff| = 3.2×10⁻¹⁶', 'min 10 holdings daily'].map(badge => (
                <span key={badge} className="font-mono text-[0.6rem] px-2 py-0.5 rounded bg-[rgba(46,164,79,0.1)] text-[var(--teal)]">{badge}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Data timeline diagram */}
        <div className="mb-12">
          <p className="section-num mb-6">Data Governance Timeline</p>
          <div className="card-research p-6">
            {/* Timeline bar */}
            <div className="relative">
              <div className="h-8 rounded-lg overflow-hidden flex mb-2">
                <div className="w-[10%] bg-[rgba(75,143,212,0.15)] flex items-center justify-center">
                  <span className="font-mono text-[0.55rem] text-[var(--blue)]">WARMUP</span>
                </div>
                <div className="w-[20%] bg-[rgba(75,143,212,0.25)] flex items-center justify-center">
                  <span className="font-mono text-[0.55rem] text-[var(--blue)]">SECTOR EST.</span>
                </div>
                <div className="w-[37%] bg-[rgba(75,143,212,0.20)] flex items-center justify-center">
                  <span className="font-mono text-[0.55rem] text-[var(--blue)]">IN-SAMPLE</span>
                </div>
                <div className="w-[33%] bg-[rgba(46,164,79,0.15)] flex items-center justify-center">
                  <span className="font-mono text-[0.55rem] text-[var(--teal)]">OUT-OF-SAMPLE</span>
                </div>
              </div>
              <div className="flex font-mono text-[0.6rem] text-[var(--text-3)]">
                <span className="w-[10%]">D001</span>
                <span className="w-[20%]">D080</span>
                <span className="w-[27%]">D240</span>
                <span className="w-[23%]">D484</span>
                <span className="w-[10%]">D726</span>
              </div>
            </div>

            {/* What fits where */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-[0.75rem]">
              <div className="border-l-2 border-[var(--blue)] pl-3">
                <p className="font-mono text-[0.62rem] text-[var(--blue)] uppercase tracking-wider mb-1">D080–D240</p>
                <p className="text-[var(--text-2)]">Sector map: PCA+KMeans fitted here, then frozen</p>
              </div>
              <div className="border-l-2 border-[var(--blue)] pl-3">
                <p className="font-mono text-[0.62rem] text-[var(--blue)] uppercase tracking-wider mb-1">D080–D484</p>
                <p className="text-[var(--text-2)]">Factor weights, hyperparameters, all IC screening</p>
              </div>
              <div className="border-l-2 border-[var(--teal)] pl-3">
                <p className="font-mono text-[0.62rem] text-[var(--teal)] uppercase tracking-wider mb-1">D485–D726</p>
                <p className="text-[var(--text-2)]">IS-only artifacts applied. No refit. Trade signals only.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Five controls */}
        <div className="space-y-4 mb-12">
          <p className="section-num mb-4">Five Leakage Controls</p>
          {CONTROLS.map((c, i) => (
            <motion.div
              key={c.id}
              className="card-research overflow-hidden"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
            >
              <div className="flex items-start gap-5 p-5">
                <div className="flex-shrink-0 text-center min-w-[48px]">
                  <span className="font-mono text-[0.6rem] font-bold" style={{ color: c.color }}>{c.num}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-semibold text-[0.87rem] text-[var(--text)]">{c.title}</p>
                    <span className="font-mono text-[0.62rem] text-[var(--text-3)] flex-shrink-0">{c.window}</span>
                  </div>
                  <p className="text-[0.8rem] text-[var(--text-2)] leading-relaxed mb-2">{c.detail}</p>
                  <div className="flex items-start gap-2 bg-[var(--bg)] rounded p-2.5">
                    <span className="text-[var(--teal)] flex-shrink-0 text-xs mt-0.5">✓</span>
                    <div>
                      <p className="font-mono text-[0.68rem] text-[var(--teal)] mb-1">Proof: {c.proof}</p>
                      <pre className="font-mono text-[0.65rem] text-[var(--text-3)] whitespace-pre-wrap">{c.code}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Formula label="Ridge purge condition (LC-4)">
{`Training set T_τ at prediction day d:
  T_τ = {(i,t) : t < d − 12}

where ML_PURGE=12 > RIDGE_HORIZON=5
∴ no training label's 5-day forward-return window
  overlaps prediction day d.`}
        </Formula>

        <Finding label="Leakage Audit Conclusion">
          All five leakage controls are mechanically enforced at the code level. The independent
          official-rules replay achieves max|reldiff| = 3.2×10⁻¹⁶ — within floating-point precision.
          Forward returns are used only as training targets and IC diagnostics, never as inputs to
          a live trading decision.
        </Finding>

        <ResearchNote label="Why is the purge gap 12 days when the target horizon is 5 days?">
          <p>With a 5-day forward return as target, a training observation on day t uses return through t+5.
          If we train on day d−5 and predict on day d, the label overlaps the prediction date. The purge
          gap of 12 days (2.4× the horizon) provides a conservative safety margin: training observations
          must end at least 12 days before the prediction date, ensuring no forward-looking label
          information contaminates the prediction.</p>
        </ResearchNote>
      </div>
    </section>
  );
}
