import { useEffect, useState } from 'react';

export interface NavRecord {
  day: number;
  nav: number; // absolute RMB
  dd: number;  // drawdown % (negative)
}

export interface NavSeries {
  is_final:  NavRecord[];
  is_base:   NavRecord[];
  is_ridge:  NavRecord[];
  oos_final: NavRecord[];
}

type Status = 'loading' | 'ready' | 'error';

let _cache: NavSeries | null = null;
let _promise: Promise<NavSeries> | null = null;

async function loadNavSeries(): Promise<NavSeries> {
  if (_cache) return _cache;
  if (_promise) return _promise;
  const base = import.meta.env.BASE_URL ?? '/';
  const url = `${base}data/nav_series.json`;
  _promise = fetch(url)
    .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() as Promise<NavSeries>; })
    .then(d => { _cache = d; return d; });
  return _promise;
}

export function useNavData(): { data: NavSeries | null; status: Status } {
  const [data, setData] = useState<NavSeries | null>(_cache);
  const [status, setStatus] = useState<Status>(_cache ? 'ready' : 'loading');

  useEffect(() => {
    if (_cache) { setData(_cache); setStatus('ready'); return; }
    loadNavSeries()
      .then(d => { setData(d); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  return { data, status };
}
