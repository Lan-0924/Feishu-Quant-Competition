// Utility helpers that convert NavRecord arrays into Plotly-ready arrays.
import type { NavRecord } from '../hooks/useNavData';

export function navRecordsToPlotly(records: NavRecord[]) {
  return {
    days:      records.map(r => `D${String(r.day).padStart(3, '0')}`),
    navsM:     records.map(r => r.nav / 1e6),
    drawdowns: records.map(r => r.dd),
  };
}

// Compute metrics from a NavRecord series on-the-fly
export function computeMetrics(records: NavRecord[], initialCapital: number) {
  const navs  = records.map(r => r.nav);
  const n     = navs.length;
  const yrs   = n / 252;
  const cagr  = ((navs[n-1] / initialCapital) ** (1/yrs) - 1) * 100;
  const rets  = navs.map((v, i) => i === 0 ? 0 : v/navs[i-1] - 1).slice(1);
  const mu    = rets.reduce((a, b) => a + b, 0) / rets.length;
  const sig   = Math.sqrt(rets.reduce((a, b) => a + (b-mu)**2, 0) / rets.length);
  const sr    = (mu / (sig + 1e-12)) * Math.sqrt(252);
  const maxDD = Math.min(...records.map(r => r.dd));
  const totalPnL = (navs[n-1] / initialCapital - 1) * 100;
  return { cagr, sharpe: sr, maxDD, totalPnL, finalNAV: navs[n-1] / 1e6 };
}
