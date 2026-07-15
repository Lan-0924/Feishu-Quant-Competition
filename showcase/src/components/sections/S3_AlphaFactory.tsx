import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionMeta } from '../ui/SectionMeta';
import { Formula } from '../ui/Formula';
import { Finding } from '../ui/Finding';
import { ResearchNote } from '../ui/ResearchNote';

const STAGES = [
  {
    id: 'raw',
    label: '27 Raw Factors',
    tag: 'INPUT',
    count: '27 → 27',
    color: 'var(--text-3)',
    summary: '16 daily price factors + 11 LOB factors. All lagged 1 day (shift(1)) before use.',
    detail: {
      what: 'The factor library spans five economic themes: short-horizon reversal (REV_h, h ∈ {1,3,5,10,20}), low-volatility/calm-range (LOWVOL, RANGE_PCT, RANGE_TREND), intraday microstructure (OVNT, MORN_REV, INTRA_MOM, CLOSE_STRENGTH), anti-lottery (SKEW_60), and liquidity/momentum (ILLIQ, AMT_GROWTH_5, MOM_60_20). The 11 LOB factors are derived from 10-minute, 10-level order book snapshots at 24 intraday time points (09:40–15:00).',
      formula: `Daily factors: REV_h = −(P_t / P_{t−h} − 1)\nLOB: OFI = (bidvol₁ − askvol₁) / (bidvol₁ + askvol₁)\n     DWI_L = Σₖ (1/k)(bidvolk − askvolk)/(bidvolk + askvolk)`,
      note: 'LOB factors are exponentially smoothed (EMA half-life 3 days) before z-scoring to reduce single-snapshot noise.',
    },
  },
  {
    id: 'zscore',
    label: 'Cross-Sectional Z-Score',
    tag: 'TRANSFORM',
    count: '27 → 27',
    color: 'var(--text-3)',
    summary: 'Each factor winsorized at [1st, 99th] pct, then standardized cross-sectionally.',
    detail: {
      what: 'On each trading day, each factor is first winsorized at the 1st and 99th cross-sectional percentiles, then standardized to zero mean and unit variance. This uses only same-day information — no temporal leakage is introduced.',
      formula: `z_{i,t} = (f̃_{i,t} − μ_t(f̃)) / σ_t(f̃)\nwhere f̃ is the winsorized factor value`,
      note: 'Winsorizing controls for extreme outliers (e.g., stocks at limit-up) that could distort the standardization.',
    },
  },
  {
    id: 'ic',
    label: 'IC Threshold Gate',
    tag: 'GATE 1 / 4',
    count: '27 → ~19',
    color: 'var(--blue)',
    summary: 'Rank IC = Spearman(z_factor, fwd_rank_10d). Threshold: |IC| ≥ 0.010.',
    detail: {
      what: 'The Rank Information Coefficient (IC) is the cross-sectional Spearman rank correlation between the factor and the 10-day forward return rank. Computed daily, then averaged over D080–D484. Only factors with mean |IC| ≥ 0.010 survive.',
      formula: `IC_t = Spearman(z_{i,t}, rank(r_{i,t→t+10}))\nIC = mean(IC_t),  ICIR = mean(IC_t) / std(IC_t)`,
      note: 'The 10-day forward rank is used as the target (not raw return) to reduce the impact of outlier return days.',
    },
  },
  {
    id: 'sign',
    label: 'Sign Stability Gate',
    tag: 'GATE 2 / 4',
    count: '~19 → ~14',
    color: 'var(--blue)',
    summary: 'IC must be consistent in sign across both IS halves (D080–D280 and D281–D484).',
    detail: {
      what: 'The IS period is split at D280. A factor must show the same IC sign in both halves, and each half-period IC must be at least 20% of the full-sample IC magnitude. This eliminates factors that work in one subperiod but reverse in another — the primary sign of spurious correlation.',
      formula: `sign(IC_half1) == sign(IC_half2)\nmin(|IC_half1|, |IC_half2|) ≥ 0.20 × |IC_full|`,
      note: 'This stability check is more stringent than a simple sign test — it also requires economic magnitude in each sub-period.',
    },
  },
  {
    id: 'redundancy',
    label: 'Redundancy Filter',
    tag: 'GATE 3 / 4',
    count: '~14 → ~11',
    color: 'var(--blue)',
    summary: 'Max pairwise Spearman rank-corr to anchor factors ≤ 0.65. |ICIR| ≥ 0.12.',
    detail: {
      what: 'Each candidate is checked against four anchor factors (LOWVOL, SPR_D, DWI_D, REV_5). The maximum absolute Spearman rank-correlation must not exceed 0.65. Additionally, the ICIR must meet a minimum threshold of 0.12. Factors that are too similar to existing anchors are dropped — they add concentration risk, not information.',
      formula: `max_anchor |Spearman(f_cand, f_anchor)| ≤ 0.65\n|ICIR| ≥ 0.12`,
      note: 'The 0.65 threshold was chosen to allow moderate correlation (e.g., REV_10 and REV_20 at ρ≈0.63) while excluding near-duplicates.',
    },
  },
  {
    id: 'family',
    label: 'Family Diversification Cap',
    tag: 'GATE 4 / 4',
    count: '~11 → 8',
    color: 'var(--blue)',
    summary: 'Each factor family (rev, lob, intra, range, risk, etc.) contributes ≤ 2 factors.',
    detail: {
      what: 'Factors are grouped into economic families. At most 2 factors from any single family are retained, regardless of their ICIR ranking. This prevents, e.g., 4 reversal signals from dominating the composite and enforces structural breadth across themes.',
      formula: `count(family_f) ≤ 2  ∀ family f\nSurvivors ranked by |ICIR|, top-8 selected`,
      note: 'The final 8 span: risk (LOWVOL), range/anti-lottery (RANGE_PCT, SKEW_60), reversal (REV_20, REV_10), LOB (DWI_AFT_MORN, SPR_D), intraday (OVNT).',
    },
  },
  {
    id: 'weights',
    label: 'ICIR Weighting',
    tag: 'COMPOSITE',
    count: '8 factors',
    color: 'var(--blue)',
    summary: 'Weight = sign(IC) × |ICIR| / Σ|ICIR|. Higher ICIR → larger weight.',
    detail: {
      what: 'Each selected factor receives a weight proportional to its signed IC-IR. The sign reflects the direction (positive IC → long high-z stocks), and the magnitude reflects signal consistency over time.',
      formula: `w_c = sign(IC_c) × |ICIR_c| / Σ_{c′} |ICIR_{c′}|\nBaseAlpha_{i,t} = Σ_c w_c × z_{c,i,t}`,
      note: 'LOWVOL has the largest weight (+0.174) because it has the highest absolute ICIR and is most consistent across sub-periods.',
    },
  },
  {
    id: 'sector',
    label: 'Sector Residualization',
    tag: 'NEUTRALIZE',
    count: 'IC −0.008, ICIR +0.141',
    color: 'var(--amber)',
    summary: 'Partial sector-mean removal (λ=0.5). Sector map frozen at D080–D240.',
    detail: {
      what: 'Statistical sectors are estimated by PCA(20)+KMeans(10) clustering of D080–D240 daily return co-movement. The within-sector mean alpha is then partially removed with weight λ=0.5. Partial (not full) neutralization preserves some sector tilt while reducing concentration risk.',
      formula: `BaseAlpha_res_{i,t} = BaseAlpha_{i,t} − 0.5 × mean_{j∈sector(i)}(BaseAlpha_{j,t})\nResult: IC 0.1026→0.0947 (−0.008) but ICIR 0.674→0.815 (+0.141)`,
      note: 'The sector map is frozen after estimation and never refit on OOS data — this is a critical leakage control.',
    },
  },
  {
    id: 'ridge',
    label: 'Ridge Sleeve',
    tag: 'ML COMPONENT',
    count: 'IC +0.094, ICIR +0.619',
    color: 'var(--purple)',
    summary: 'Walk-forward Ridge(α=10) on all 27 z-factors → 5-day forward rank. Purge: 12 days.',
    detail: {
      what: 'In parallel to BaseAlpha, a walk-forward Ridge regression is estimated on all 27 standardized factors to predict the 5-day forward return rank. It retrains every 30 days on an expanding past-only window with a 12-day purge gap (exceeding the 5-day target horizon — no label overlap).',
      formula: `β̂_τ = argmin_β Σ_{(i,t)∈T_τ} (rank⁽⁵⁾_{i,t} − z^T_{i,t} β)² + 10‖β‖²\nPurge gap: 12 days > 5-day horizon (no leakage)`,
      note: 'Standalone performance: CAGR +1.49%, Sharpe 0.18, MaxDD −24.53%. A very poor standalone signal — but the key is its decorrelation from BaseAlpha.',
    },
  },
  {
    id: 'final',
    label: 'Finalpha',
    tag: 'OUTPUT',
    count: 'IC +0.098, ICIR +0.795',
    color: 'var(--teal)',
    summary: '0.8 × z(BaseAlpha_res) + 0.2 × z(ridge5d). Both components z-scored first.',
    detail: {
      what: 'The traded signal blends two cross-sectionally standardized components. The 20% Ridge weight was chosen in-sample: enough to contribute decorrelated ML signal without destabilizing the base composite. The ensemble achieves higher IC than either component alone (0.0980 vs 0.0947 and 0.0945), confirming complementary information content.',
      formula: `Finalpha_{i,t} = 0.8 × z(BaseAlpha_res)_{i,t} + 0.2 × z(ridge5d)_{i,t}\nEnsemble IC = 0.0980 > max(0.0947, 0.0945)`,
      note: 'The IC improvement from ensembling (+0.003) is modest. The portfolio improvement (+4.85pp CAGR, +0.42 Sharpe) is much larger — indicating the benefit is portfolio-level diversification, not raw prediction quality.',
    },
  },
];

const TAG_COLORS: Record<string, string> = {
  'INPUT':       'rgba(255,255,255,0.06)',
  'TRANSFORM':   'rgba(255,255,255,0.06)',
  'GATE 1 / 4': 'rgba(75,143,212,0.10)',
  'GATE 2 / 4': 'rgba(75,143,212,0.13)',
  'GATE 3 / 4': 'rgba(75,143,212,0.16)',
  'GATE 4 / 4': 'rgba(75,143,212,0.20)',
  'COMPOSITE':   'rgba(75,143,212,0.24)',
  'NEUTRALIZE':  'rgba(181,132,26,0.12)',
  'ML COMPONENT':'rgba(138,114,204,0.12)',
  'OUTPUT':      'rgba(46,164,79,0.12)',
};

export function S3_AlphaFactory() {
  const [active, setActive] = useState<string>('final');

  const activeStage = STAGES.find(s => s.id === active)!;

  return (
    <section id="alpha-factory" className="py-28 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <SectionMeta
          num="§ 2.  Methodology"
          question="How do we extract a signal from 27 noisy inputs?"
          lead={
            <>
              A deterministic 4-gate screening pipeline reduces the raw factor universe to 8
              structurally diverse, IC-IR-weighted factors. Two parallel components are then combined
              into the traded signal.
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-14">
          {/* Pipeline column */}
          <div className="lg:col-span-2 flex flex-col gap-0">
            {STAGES.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center">
                <button
                  onClick={() => setActive(s.id)}
                  className={`pipeline-node w-full px-4 py-2.5 text-left ${active === s.id ? 'active' : ''}`}
                  style={{ background: active === s.id ? TAG_COLORS[s.tag] : undefined }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.8rem] font-medium text-[var(--text)]">{s.label}</p>
                      <p className="font-mono text-[0.62rem] text-[var(--text-3)] mt-0.5">{s.count}</p>
                    </div>
                    <span
                      className="font-mono text-[0.55rem] px-1.5 py-0.5 rounded tracking-wide"
                      style={{ background: TAG_COLORS[s.tag], color: s.color }}
                    >
                      {s.tag}
                    </span>
                  </div>
                </button>
                {i < STAGES.length - 1 && (
                  <div className="flex flex-col items-center my-0.5">
                    <div className="w-px h-3 bg-[var(--border)]" />
                    <svg width="6" height="4"><path d="M3 4L0 0h6z" fill="var(--border)" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="card-research p-6 sticky top-16 h-full"
                style={{ borderColor: `${activeStage.color}30` }}
              >
                <span
                  className="font-mono text-[0.62rem] tracking-wider mb-2 inline-block"
                  style={{ color: activeStage.color }}
                >
                  {activeStage.tag}
                </span>
                <h3 className="text-base font-semibold text-[var(--text)] mb-3">{activeStage.label}</h3>
                <p className="text-[0.82rem] text-[var(--text-2)] leading-relaxed mb-4">{activeStage.detail.what}</p>
                <Formula>{activeStage.detail.formula}</Formula>
                {activeStage.detail.note && (
                  <p className="text-[0.75rem] text-[var(--text-3)] leading-relaxed mt-3 italic">
                    Note: {activeStage.detail.note}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Finding label="Pipeline Result">
          Sector residualization improves ICIR by +0.141 at a cost of only −0.008 in raw IC —
          a highly favorable trade-off. The ensemble further raises IC to 0.0980 (higher than
          either component alone), confirming complementary information content between
          the IC-IR composite and the Ridge sleeve.
        </Finding>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResearchNote label="Why 4 gates and not just ICIR?">
            <p>The ICIR alone does not prevent two near-identical factors from entering the composite —
            it only measures information content per unit of consistency. Gates 3 and 4 add structural
            diversity: they ensure the 8 selected factors span multiple economic mechanisms
            (reversal, risk, microstructure, anti-lottery, intraday) rather than concentrating in
            whichever theme happens to have highest ICIR in-sample.</p>
          </ResearchNote>
          <ResearchNote label="Why partial sector residualization (λ=0.5)?">
            <p>Full neutralization (λ=1.0) would remove all sector exposure, which risks eliminating
            genuine cross-sector alpha embedded in the composite. Partial removal (λ=0.5) reduces
            systematic sector concentration while preserving the alpha signal. The PCA+KMeans sector
            map is estimated on D080–D240 returns and frozen — never updated on OOS data.</p>
          </ResearchNote>
        </div>
      </div>
    </section>
  );
}
