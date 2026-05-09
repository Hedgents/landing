"use client";

import { useEffect, useState } from "react";

export interface LiveRates {
  stableYieldAprPct: number;
  multiplyAprPct: number;
  hedgedjlpAprPct: number;
  portfolioAprPct: number;
  fetchedAt: number;
}

// Fallbacks match current soak readings (May 2026).
export const FALLBACK: LiveRates = {
  stableYieldAprPct: 4.00,
  multiplyAprPct:    10.50,
  hedgedjlpAprPct:   8.22,
  portfolioAprPct:   7.57,
  fetchedAt: 0,
};

export function useLiveRates(intervalMs = 60_000): { rates: LiveRates; live: boolean } {
  const [rates, setRates] = useState<LiveRates>(FALLBACK);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetch_ = async () => {
      try {
        const res = await fetch("/api/rates");
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        if (!cancelled && data.ok) {
          setRates({ ...data.strategies, fetchedAt: data.fetchedAt });
          setLive(true);
        }
      } catch {
        // keep previous state; live stays false until a successful fetch
      }
    };

    fetch_();
    const id = setInterval(fetch_, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [intervalMs]);

  return { rates, live };
}
