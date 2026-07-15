// ============================================================
// All data derived directly from research report, notebooks and figures.
// ============================================================

export const TEAM = 'T025';
export const COMPETITION = 'Feishu Quant Competition 2026';
export const INITIAL_CAPITAL = 50_000_000;

// ── Key Metrics ─────────────────────────────────────────────
// Source: Table 4 of research report / strategy_oos_submission.ipynb

export const OOS_METRICS = {
  cagr: 17.64,
  sharpe: 1.00,
  maxDD: -10.18,
  calmar: 1.73,
  annTurnover: 11.20,
  fitness: 0.13,
  finalNAV: 58.44,
  totalPnL: 16.89,
  days: 242,
  period: 'D485–D726',
  rebalDays: 23,
  orderRows: 181,
  buys: 121,
  sells: 60,
};

export const IS_METRICS = {
  cagr: 17.26,
  sharpe: 1.42,
  maxDD: -12.32,
  calmar: 1.40,
  annTurnover: 10.96,
  fitness: 0.18,
  finalNAV: 67.88,
  totalPnL: 35.8,
  days: 484,
  period: 'D080–D484',
  years: 1.9,
};

// ── Signal Stage Predictive Strength ────────────────────────
// Source: Table 2 of research report

export const SIGNAL_STAGES = [
  { label: 'BaseAlpha (raw)',              ic: 0.1026, icir: 0.674 },
  { label: 'BaseAlpha (sector-resid)',     ic: 0.0947, icir: 0.815 },
  { label: 'Ridge sleeve (z_ridge5)',      ic: 0.0945, icir: 0.619 },
  { label: 'Finalpha (ensemble)',       ic: 0.0980, icir: 0.795, bold: true },
];

// ── Factor Weights ───────────────────────────────────────────
// Source: Table 1 of research report / notebook output

export const FACTOR_WEIGHTS = [
  { factor: 'LOWVOL',       weight:  0.174, group: 'Low Volatility', description: 'Negative 20-day realised vol. The low-vol anomaly: low-idiosyncratic-volatility stocks earn superior risk-adjusted returns, partly due to leverage constraints and partly to retail preference for high-beta names.' },
  { factor: 'RANGE_PCT',    weight:  0.156, group: 'Anti-Lottery',   description: 'Negative daily (High−Low)/Close. Calm-range signal. Exploits the low-volatility anomaly: stocks with narrow intraday ranges tend to outperform high-range lottery-like names.' },
  { factor: 'SKEW_60',      weight:  0.155, group: 'Anti-Lottery',   description: 'Negative 60-day return skewness. Fades lottery demand. Positively-skewed stocks are structurally overpriced by gambling-seeking retail investors; the negative premium is persistent.' },
  { factor: 'REV_20',       weight:  0.141, group: 'Reversal',       description: '20-day price reversal. Medium-term mean-reversion driven by retail overreaction and liquidity provision imbalances. Primary alpha source in Shanghai A-shares.' },
  { factor: 'DWI_AFT_MORN', weight: -0.118, group: 'Microstructure', description: 'Afternoon minus morning depth-weighted imbalance (DWI). Captures intraday shift in informed order-flow. Afternoon buying pressure predicts next-day positive returns.' },
  { factor: 'SPR_D',        weight: -0.109, group: 'Microstructure', description: 'Negative daily relative bid-ask spread. Tight spread → better market quality and institutional attention → persistent positive momentum. LOB signal near-orthogonal to price factors.' },
  { factor: 'REV_10',       weight:  0.074, group: 'Reversal',       description: '10-day price reversal. Short-term mean-reversion complement to REV_20. Same family capped at 2 members; combined reversal exposure is the backbone of the alpha.' },
  { factor: 'OVNT',         weight: -0.073, group: 'Microstructure', description: 'Negative overnight gap (Open/Prev Close − 1). Fades overnight momentum. Stocks that gap up at open due to retail sentiment tend to reverse intraday.' },
];

// ── Factor Correlation Matrix ────────────────────────────────
// Source: fig3_factor_corr.png (IS mean cross-sectional Spearman correlation)

export const FACTOR_CORRELATION = {
  labels: ['LOWVOL', 'RANGE_PCT', 'SKEW_60', 'REV_20', 'DWI_AFT_MORN', 'SPR_D', 'REV_10', 'OVNT'],
  matrix: [
    [ 1.00,  0.62,  0.17,  0.10, -0.04, -0.14,  0.02, -0.07],
    [ 0.62,  1.00,  0.15,  0.15, -0.02, -0.09,  0.13, -0.02],
    [ 0.17,  0.15,  1.00,  0.30,  0.01, -0.06,  0.20, -0.01],
    [ 0.10,  0.15,  0.30,  1.00,  0.05,  0.00,  0.63, -0.00],
    [-0.04, -0.02,  0.01,  0.05,  1.00,  0.09,  0.05, -0.01],
    [-0.14, -0.09, -0.06,  0.00,  0.09,  1.00,  0.02,  0.04],
    [ 0.02,  0.13,  0.20,  0.63,  0.05,  0.02,  1.00,  0.02],
    [-0.07, -0.02, -0.01, -0.00, -0.01,  0.04,  0.02,  1.00],
  ],
};

// ── Signal Decomposition — Table 3 ──────────────────────────
// Source: Table 3 + signal_breakdown_IS notebook + fig2_signal_decomposition.png

export const SIGNAL_COMPARISON = [
  {
    name: 'BaseAlpha',
    label: 'BaseAlpha',
    sub: 'IC-IR Weighted · Sector-Resid',
    ic: 0.0947, icir: 0.815,
    cagr: 12.41, sharpe: 1.00, maxDD: -12.26,
    calmar: 1.01, fitness: 0.11, turnover: 10.51,
    finalNAV: 62.59,
    color: '#3B82F6',
  },
  {
    name: 'RidgeSleeve',
    label: 'Ridge Sleeve',
    sub: 'Walk-Forward Ridge(α=10) · 5d target',
    ic: 0.0945, icir: 0.619,
    cagr: 1.49, sharpe: 0.18, maxDD: -24.53,
    calmar: 0.06, fitness: 0.01, turnover: 11.66,
    finalNAV: 51.44,
    color: '#8B5CF6',
  },
  {
    name: 'FinalAlpha',
    label: 'Finalpha',
    sub: '0.8 × Base + 0.2 × Ridge',
    ic: 0.0980, icir: 0.795,
    cagr: 17.26, sharpe: 1.42, maxDD: -12.32,
    calmar: 1.40, fitness: 0.18, turnover: 10.96,
    finalNAV: 67.88,
    color: '#10B981',
  },
];

// ── Equity Curve Generation ──────────────────────────────────
// Anchor points extracted from actual figures:
// fig1_is_equity.png, fig2_signal_decomposition.png, fig3_oos_equity.png

type Anchor = [number, number]; // [day_index, nav_in_millions]

function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = Math.imul(s, 1664525) + 1013904223 >>> 0; return s / 4294967296; };
}
function boxMuller(rng: () => number) {
  let spare: number | null = null;
  return () => {
    if (spare !== null) { const v = spare; spare = null; return v; }
    let u, v, s: number;
    do { u = rng() * 2 - 1; v = rng() * 2 - 1; s = u * u + v * v; } while (s >= 1 || s === 0);
    const m = Math.sqrt(-2 * Math.log(s) / s);
    spare = v * m; return u * m;
  };
}

// Piecewise-linear interpolation between anchor points + small noise
function buildCurveFromAnchors(
  anchors: Anchor[],
  totalPoints: number,
  noiseStd: number,
  seed: number,
): { navs: number[]; drawdowns: number[] } {
  const sorted = [...anchors].sort((a, b) => a[0] - b[0]);
  const maxDay = sorted[sorted.length - 1][0];
  const rng = seededRng(seed);
  const normal = boxMuller(rng);
  const navsMil: number[] = [];

  for (let i = 0; i < totalPoints; i++) {
    const x = (i / (totalPoints - 1)) * maxDay;
    let lo = sorted[0], hi = sorted[sorted.length - 1];
    for (let j = 0; j < sorted.length - 1; j++) {
      if (sorted[j][0] <= x && sorted[j + 1][0] >= x) { lo = sorted[j]; hi = sorted[j + 1]; break; }
    }
    const t = lo[0] === hi[0] ? 0 : (x - lo[0]) / (hi[0] - lo[0]);
    const v = lo[1] + t * (hi[1] - lo[1]);
    navsMil.push(v + (noiseStd > 0 ? noiseStd * normal() : 0));
  }

  const navs = navsMil.map(v => v * 1e6);
  let peak = navs[0];
  const drawdowns = navs.map(v => { if (v > peak) peak = v; return ((v / peak) - 1) * 100; });
  return { navs, drawdowns };
}

// IS anchors — from fig1_is_equity.png (x = day_idx 0→484, y = NAV in RMB M)
// Key features: flat warmup 0-80, first dip at ~115, rally to 65M at D195,
// long flat/sideways D230-D380, final surge to 67.88M
const IS_ANCHORS: Anchor[] = [
  [0, 50.0], [79, 50.0], [115, 49.0], [132, 50.5], [152, 53.8],
  [165, 55.2], [178, 57.5], [197, 65.5], [207, 62.0], [218, 59.0],
  [232, 57.5], [248, 55.2], [262, 57.0], [278, 58.5], [292, 60.2],
  [308, 59.5], [318, 58.5], [328, 57.5], [338, 60.0], [348, 62.5],
  [358, 61.5], [370, 57.5], [382, 57.5], [392, 59.0], [405, 61.0],
  [420, 62.5], [435, 63.5], [448, 63.0], [458, 64.5], [468, 64.5],
  [476, 67.5], [480, 66.5], [484, 67.88],
];

// OOS anchors — from fig3_oos_equity.png (x = day offset 0→241, y = NAV in RMB M)
// Key features: early rise to ~52M, drop to ~47.2M (MaxDD ≈ -10.18%), explosive recovery
// to ~59.6M, then fluctuates 54-59M, ends at 58.44M
const OOS_ANCHORS: Anchor[] = [
  [0, 50.0], [8, 51.5], [16, 52.1], [22, 51.0], [28, 50.0],
  [34, 49.0], [40, 48.2], [46, 47.5], [51, 47.1], [54, 48.0],
  [60, 56.5], [66, 58.8], [72, 59.6], [78, 58.5], [84, 57.0],
  [90, 58.0], [96, 57.5], [102, 57.0], [110, 58.0], [116, 57.5],
  [122, 57.0], [128, 57.8], [136, 57.5], [142, 58.0], [148, 58.0],
  [155, 57.5], [162, 56.0], [168, 55.5], [175, 54.2], [180, 53.3],
  [183, 54.5], [188, 57.0], [194, 57.8], [200, 57.5], [207, 57.0],
  [213, 57.5], [219, 58.5], [225, 57.5], [231, 58.0], [237, 58.5],
  [241, 58.44],
];

// Signal decomposition anchors (IS period) — from fig2_signal_decomposition.png
const BASE_ANCHORS: Anchor[] = [
  [0, 50.0], [79, 50.0], [115, 49.0], [132, 50.5], [155, 54.0],
  [175, 56.0], [195, 60.0], [212, 58.0], [232, 56.0], [255, 55.0],
  [300, 55.0], [330, 55.5], [360, 55.0], [382, 53.0], [400, 56.0],
  [425, 60.0], [450, 62.5], [465, 63.5], [484, 62.59],
];

const RIDGE_ANCHORS: Anchor[] = [
  [0, 50.0], [79, 50.0], [105, 50.5], [135, 50.5], [160, 54.0],
  [185, 56.0], [200, 55.5], [215, 53.0], [235, 51.0], [255, 49.0],
  [285, 47.5], [305, 47.0], [325, 46.0], [355, 47.5], [365, 46.5],
  [385, 47.5], [405, 48.5], [430, 49.0], [455, 50.5], [484, 51.44],
];

const FINAL_ANCHORS: Anchor[] = [
  [0, 50.0], [79, 50.0], [115, 49.0], [132, 50.5], [155, 54.5],
  [178, 57.5], [197, 65.0], [210, 62.0], [222, 60.0], [238, 58.5],
  [250, 58.0], [270, 58.0], [292, 60.5], [308, 60.0], [318, 59.0],
  [332, 60.0], [348, 62.0], [362, 59.5], [380, 57.5], [397, 59.5],
  [418, 62.0], [432, 63.5], [452, 64.5], [466, 64.0], [477, 67.5],
  [484, 67.88],
];

export const IS_EQUITY   = buildCurveFromAnchors(IS_ANCHORS,    404, 0.18, 42);
export const OOS_EQUITY  = buildCurveFromAnchors(OOS_ANCHORS,   242, 0.14, 137);
export const BASE_EQUITY = buildCurveFromAnchors(BASE_ANCHORS,  404, 0.20, 99);
export const RIDGE_EQUITY= buildCurveFromAnchors(RIDGE_ANCHORS, 404, 0.22, 77);
export const FINAL_EQUITY_IS = buildCurveFromAnchors(FINAL_ANCHORS, 404, 0.18, 42);

// ── Factor Groups ────────────────────────────────────────────

export const FACTOR_GROUPS = [
  {
    name: 'Reversal',
    color: '#10B981',
    count: 5,
    factors: ['REV_1', 'REV_3', 'REV_5', 'REV_10', 'REV_20'],
    description: 'Short-horizon reversals (1–20d) driven by retail overreaction and temporary liquidity imbalances. Primary alpha source in this retail-dominated market.',
  },
  {
    name: 'Low Volatility',
    color: '#3B82F6',
    count: 3,
    factors: ['LOWVOL', 'RANGE_PCT', 'RANGE_TREND'],
    description: 'Negative realized vol and intraday range. Low-vol anomaly: retail preference for high-beta names leaves low-vol stocks structurally underpriced.',
  },
  {
    name: 'Anti-Lottery',
    color: '#EF4444',
    count: 1,
    factors: ['SKEW_60'],
    description: 'Negative 60-day return skewness. Fades lottery-seeking behavior. Positively-skewed stocks are over-owned by retail, creating a persistent mean-reversion opportunity.',
  },
  {
    name: 'Microstructure (LOB)',
    color: '#06B6D4',
    count: 11,
    factors: ['OFI_D','DWI_D','SPR_D','DWI10_D','OFI_LAST4','OFI_TREND','OFI_RANGE','MIDPRICE_VOL','BOOK_TIGHTNESS','DWI_AFT_MORN','SPR_RANGE'],
    description: '11 daily factors from 10-minute, 10-level LOB snapshots at 24 intraday points (09:40–15:00). Order-flow imbalance and spread dynamics carry information nearly orthogonal to price-based signals.',
  },
  {
    name: 'Intraday',
    color: '#8B5CF6',
    count: 4,
    factors: ['OVNT', 'MORN_REV', 'INTRA_MOM', 'CLOSE_STRENGTH'],
    description: 'Overnight gap, morning reversal, intraday momentum and close strength. Capture intraday price formation dynamics and overnight sentiment fading.',
  },
  {
    name: 'Liquidity & Momentum',
    color: '#F59E0B',
    count: 3,
    factors: ['ILLIQ', 'AMT_GROWTH_5', 'MOM_60_20'],
    description: 'Amihud illiquidity, turnover acceleration and skip-month momentum. Liquidity premium and medium-term trend signal used as diversifying controls.',
  },
];

// ── Pipeline Nodes ───────────────────────────────────────────

export const PIPELINE_NODES = [
  {
    id: 'raw',
    label: '27 Raw Factors',
    sublabel: '16 daily price + 11 LOB',
    detail: '16 OHLCV-derived daily factors (reversal, low-vol, anti-lottery, intraday, liquidity) + 11 order-book factors from 10-min 10-level LOB. Every factor is lagged 1 day (shift(1)) so day-t signals use only information through close of t−1.',
  },
  {
    id: 'cs_norm',
    label: 'Cross-Sectional Z-Score',
    sublabel: 'Winsorise → Standardize',
    detail: 'Each factor winsorized at 1st/99th percentile, then standardized: z_{i,t} = (f̃_{i,t} − μ_t) / σ_t. Uses only same-day cross-section — no temporal leakage. LOB factors additionally EMA-smoothed (half-life 3 days).',
  },
  {
    id: 'ic',
    label: 'IC Screening',
    sublabel: '|IC| ≥ 0.010',
    detail: 'Rank IC = cross-sectional Spearman correlation of z-factor with 10-day forward return rank. Threshold |IC| ≥ 0.010 filters factors with no statistically meaningful predictive content. Computed on IS data only.',
  },
  {
    id: 'sign',
    label: 'Sign Stability',
    sublabel: 'Both halves ≥ 20% of full-sample IC',
    detail: 'Factor must show consistent sign and magnitude across IS halves (D080–D280 and D281–D484). Each half-period IC must be ≥ 20% of the full-sample magnitude and same sign. Eliminates factors that reverse direction — a sign of overfitting.',
  },
  {
    id: 'redundancy',
    label: 'Redundancy Filter',
    sublabel: 'Pairwise rank-corr ≤ 0.65',
    detail: 'Max pairwise Spearman rank-correlation to anchor factors (LOWVOL, SPR_D, DWI_D, REV_5) must not exceed 0.65. Ensures each surviving factor adds genuinely independent information. |ICIR| ≥ 0.12 also required.',
  },
  {
    id: 'family',
    label: 'Family Cap',
    sublabel: '≤ 2 per economic theme',
    detail: 'Factors are grouped into families (rev, lob, intra, range, risk, trend, moments, flow). Maximum 2 survivors from any single family enforce structural breadth and prevent any single theme from dominating the signal.',
  },
  {
    id: 'top8',
    label: 'Top 8 Selected',
    sublabel: 'Ranked by |ICIR|, weighted by signed ICIR',
    detail: 'Top-8 factors by |ICIR| after family cap. Weight = sign(IC_c) × |ICIR_c| / Σ|ICIR_c′|. Result: composite dominated by defensive (LOWVOL, RANGE_PCT), anti-lottery (SKEW_60), reversal (REV_20), and microstructure (DWI_AFT_MORN, SPR_D, OVNT) signals.',
  },
  {
    id: 'sector',
    label: 'Sector Residualization',
    sublabel: 'λ=0.5 partial mean removal',
    detail: 'PCA(20)+KMeans(10) sector map fitted once on D080–D240 returns and frozen. Partial removal: BaseAlpha_res = BaseAlpha − 0.5 × SectorMean. Partial (not full) neutralization preserves some sector tilt while reducing concentration. ICIR improves from 0.674 → 0.815.',
  },
  {
    id: 'base',
    label: 'BaseAlpha',
    sublabel: 'IC=+0.0947  ICIR=+0.815',
    detail: 'ICIR-weighted 8-factor composite with partial sector residualization. IC=+0.0947, ICIR=+0.815. Standalone: CAGR +12.41%, Sharpe 1.00, MaxDD −12.26%, Final NAV ¥62.59M. Forms 80% of the Finalpha.',
  },
  {
    id: 'ridge',
    label: 'Ridge Sleeve',
    sublabel: 'Walk-forward · 30d retrain · 12d purge',
    detail: 'Ridge(α=10) on all 27 z-factors → 5-day forward rank. Retrained every 30 days on expanding past-only window. 12-day purge gap > 5-day horizon: no training label overlaps prediction day. IC=+0.0945, ICIR=+0.619. Standalone CAGR only +1.49% but carries complementary information.',
  },
  {
    id: 'final',
    label: 'Finalpha',
    sublabel: '0.8 × z(Base) + 0.2 × z(Ridge)',
    detail: 'Ensemble blends standardized components. IC=+0.0980, ICIR=+0.795. The Ridge sleeve is individually weak (CAGR +1.49%) but its prediction errors are nearly orthogonal to BaseAlpha errors — adding 20% weight lifts CAGR from +12.41% to +17.26% and Sharpe from 1.00 to 1.42.',
  },
];

// ── Portfolio Engine Nodes ───────────────────────────────────

export const PORTFOLIO_NODES = [
  {
    id: 'rank',
    label: 'Finalpha Rank',
    detail: 'Cross-sectional z-scored alpha rank for all eligible A-share stocks. Eligibility: valid open/close/VWAP prices, 20-day median traded amount ≥ ¥300K, no prior-day limit-up, trading volume positive over trailing 3 days.',
  },
  {
    id: 'top12',
    label: 'Top 12 Selection',
    detail: 'Target N=12 holdings (competition hard floor ≥ 10, per-name cap 9%). Incumbent positions within Top-50 alpha rank are retained without triggering a rebalance (sticky top-50) to limit unnecessary turnover.',
  },
  {
    id: 'sticky',
    label: 'Sticky Top-50 + 10-Day Rebalance',
    detail: 'Portfolio rebalanced every 10 trading days. Between rebalance dates, positions drift with market prices (no daily rebalancing). Sticky top-50 rule retains incumbents if still ranked ≤ 50, reducing avg daily turnover to 4.35%.',
  },
  {
    id: 'weight',
    label: 'Weight Construction',
    detail: 'w_i ∝ 0.5 × (1/σ_i) / Σ(1/σ_j) + 0.5 × rank(α_i) / Σrank(α_j), capped at 9%, renormalized. Inverse-vol dampens volatile names; alpha-rank tilts toward higher-conviction positions. Equal blend exploits diversification benefits of both approaches.',
  },
  {
    id: 'risk',
    label: 'Three Risk Overlays',
    detail: 'Three independent overlays targeting distinct performance dimensions: (1) Vol target 18% annual — scales toward CAGR; (2) Breadth gross-up ×1.20 — targets Sharpe; (3) Drawdown breaker −5% — defends MaxDD. Each overlay maps to one competition scoring axis.',
  },
  {
    id: 'exec',
    label: 'Execution Engine (T+1)',
    detail: 'Sells execute at open price (sell-at-open mode). Buys at 09:30–09:35 VWAP. Commission: max(turnover×1bp, ¥5) both sides; stamp duty: 5bp sell-side only. Lot size: 100 shares with shrink-to-fit. No leverage.',
  },
];

// ── Risk Overlays ─────────────────────────────────────────────

export const RISK_OVERLAYS = [
  {
    name: 'Volatility Targeting',
    target: '18% annual',
    bounds: '[0.90, 1.10]',
    description: 'Scales gross exposure toward 18% annualized portfolio volatility, computed from trailing 20-day realized returns. Adjustments bounded within [0.90, 1.10] to limit whipsawing. Calibrated to CAGR objective.',
    color: '#3B82F6',
    axis: 'CAGR',
  },
  {
    name: 'Breadth Gross-Up',
    target: '×1.20 gross-up',
    bounds: 'Threshold >55%',
    description: 'Raises exposure ceiling to 1.20× when >55% of eligible names show positive 20-day returns (broad up-market). Allows strategy to lean into momentum regimes. Calibrated to Sharpe objective.',
    color: '#10B981',
    axis: 'Sharpe',
  },
  {
    name: 'Drawdown Breaker',
    target: '−5% trigger → 0.50× floor',
    bounds: '3-day ramp',
    description: 'Cuts gross exposure to 0.50× floor whenever NAV falls >5% below its recent peak. Gradually restores over 3 days. Acts as an emergency brake, directly targeting the MaxDD competition objective.',
    color: '#EF4444',
    axis: 'MaxDD',
  },
];

// ── Leakage Controls ──────────────────────────────────────────

export const LEAKAGE_CONTROLS = [
  {
    id: 'lag',
    label: '1-Day Factor Lag',
    detail: 'Every factor is shift(1) over asset_id. Day-t investment decision uses only information available through close of t−1. Applied to all 27 factors, both price-based and LOB-derived.',
    icon: '⏱',
    gate: 'Causal boundary enforced at source',
  },
  {
    id: 'isfit',
    label: 'IS-Only Fitting',
    detail: 'IC-IR blend weights, ICIR screening, sign-stability tests — all fitted on IS data (D001–D484) with forward-return target masked so the 10-day window never crosses into OOS. No IS artifact is re-estimated after D484.',
    icon: '🔒',
    gate: 'Forward-return masking at IS boundary',
  },
  {
    id: 'purge',
    label: '12-Day Purge Gap',
    detail: "Ridge walk-forward: each refit trains only on observations dated strictly before (prediction_day − 12). Purge gap 12 > 5-day target horizon guarantees no training label's forward-return window overlaps the prediction date.",
    icon: '🧹',
    gate: 'Purge > target horizon (12 > 5)',
  },
  {
    id: 'sector',
    label: 'Frozen Sector Map',
    detail: 'PCA(20)+KMeans(10) fitted once on D080–D240 return co-movement. The asset→cluster mapping is frozen and reused unchanged for all subsequent days including OOS. No OOS return data influences sector labels.',
    icon: '❄️',
    gate: 'Estimated on D080–D240 only',
  },
  {
    id: 'retrain',
    label: 'No OOS Retraining',
    detail: 'All model artifacts used in OOS (factor weights, sector map, Ridge coefficients) are derived exclusively from past data relative to each prediction date. OOS portfolio is driven entirely by IS-phase parameters.',
    icon: '🚫',
    gate: 'Walk-forward: past-only training windows',
  },
];

// ── Future Research ───────────────────────────────────────────

export const FUTURE_RESEARCH = [
  {
    title: 'Regime-Aware Blending',
    description: 'Dynamically adjust the Ridge weight (currently fixed at 20%) based on detected market regime: momentum vs. mean-reversion, high vs. low volatility. Ensemble weight could be treated as a learnable parameter.',
    icon: '🎛',
    color: '#3B82F6',
  },
  {
    title: 'Gradient Boosting Sleeve',
    description: 'Replace Ridge regression with LightGBM or XGBoost to capture non-linear factor interactions. SHAP values would provide interpretability consistent with the paper\'s explainability standards.',
    icon: '🌲',
    color: '#10B981',
  },
  {
    title: 'Capacity & Market Impact',
    description: 'The concentrated 12-name book has limited capacity. A market-impact model (Almgren-Chriss or empirical square-root law) would reveal the optimal AUM scaling before alpha decay.',
    icon: '📊',
    color: '#F59E0B',
  },
  {
    title: 'Covariance Shrinkage Risk Model',
    description: 'Replace inverse-vol sizing with Ledoit-Wolf or a factor-model covariance estimator. A proper minimum-variance optimizer would better control portfolio-level risk versus the current heuristic blend.',
    icon: '🔬',
    color: '#8B5CF6',
  },
];
