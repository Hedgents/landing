// Server-side rate fetcher — mirrors the fleet's fleet_rates / onyc pnl
// math at a high level so the landing page numbers track the live
// dashboard.
//
// Sources:
//   Kamino API  /reserves/metrics  → USDC supply, USDC borrow
//   DeFiLlama   /chart/<pool>      → JLP fee APY via Orca JLP-USDC pool
//
// Math:
//   stable_yield  = usdc_supply_pct
//   onyc          = ONyc base NAV growth (~11%) − usdc_borrow × LTV
//                   (NAV growth is OnRe's monthly Apex Group attestation
//                    cadence; held as a constant on the landing page since
//                    a live Chainlink NAV feed is a future patch — same
//                    placeholder the dashboard uses)
//   hedgedjlp     = jlp_fee_apy − sol_borrow_proxy × HEDGE_FRACTION
//   portfolio     = equal-weight average of three strategies

import { NextResponse } from "next/server";

const KAMINO_MARKET =
  "https://api.kamino.finance/kamino-market/" +
  "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF/reserves/metrics";

const ORCA_JLP_USDC_POOL = "99306789-b083-4668-86da-4cedb1c9bfef";

// ONyc base NAV growth — placeholder pinned at 11% (matches the daemon's
// ONYC_BASE_NAV_GROWTH_BPS=1100 constant). A live Chainlink Data Streams
// read lands in a follow-up patch on both sides.
const ONYC_BASE_NAV_PCT = 11.0;
const ONYC_LTV = 0.40;              // target LTV (40%) for onyc leverage
const HEDGE_FRACTION = 0.75;        // fraction of JLP hedged

// Cap for the Kamino-SOL-borrow → Jupiter Perps funding proxy. Same cap
// applied in the dashboard (v0.4.24) so spikes during a SOL liquidity
// squeeze (Kamino's borrow rate can hit 20%+) don't poison hedgedjlp's
// net APR estimate.
const SOL_BORROW_PROXY_CAP_PCT = 8.0;

function parseRate(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v) || 0;
  return 0;
}

async function fetchKamino(): Promise<{ usdcSupply: number; usdcBorrow: number; solBorrow: number }> {
  const res = await fetch(KAMINO_MARKET, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Hedgents-Landing/1.0)",
      "Accept": "application/json",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Kamino ${res.status}`);
  const reserves: unknown[] = await res.json();

  let usdcSupply = 0, usdcBorrow = 0, solBorrow = 0;
  for (const r of reserves as Record<string, unknown>[]) {
    const sym = String(r.liquidityToken ?? "").toUpperCase();
    const s = parseRate(r.supplyApy) * 100;
    const b = parseRate(r.borrowApy) * 100;
    if (sym === "USDC") { usdcSupply = s; usdcBorrow = b; }
    if ((sym === "SOL" || sym === "WSOL") && b > solBorrow) solBorrow = b;
  }
  return { usdcSupply, usdcBorrow, solBorrow };
}

async function fetchJlpFeeApy(): Promise<number> {
  const res = await fetch(`https://yields.llama.fi/chart/${ORCA_JLP_USDC_POOL}`, {
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error(`DeFiLlama ${res.status}`);
  const data = await res.json() as { data: { apy: number; apyBase: number; apyBase7d?: number }[] };
  const last = data.data.at(-1);
  if (!last) throw new Error("DeFiLlama: empty data");
  // Prefer the 7-day rolling average to smooth out short-term volume spikes.
  if (last.apyBase7d && last.apyBase7d > 0) return last.apyBase7d;
  return last.apyBase > 0 ? last.apyBase : last.apy;
}

export async function GET() {
  try {
    const [kamino, jlpFeeApy] = await Promise.all([
      fetchKamino(),
      fetchJlpFeeApy(),
    ]);

    const stableYieldApr = kamino.usdcSupply;
    const onycApr        = Math.max(0, ONYC_BASE_NAV_PCT - kamino.usdcBorrow * ONYC_LTV);
    const solBorrowProxy = Math.min(kamino.solBorrow, SOL_BORROW_PROXY_CAP_PCT);
    const hedgedjlpApr   = Math.max(0, jlpFeeApy - solBorrowProxy * HEDGE_FRACTION);
    const portfolioApr   = (stableYieldApr + onycApr + hedgedjlpApr) / 3;

    return NextResponse.json({
      ok: true,
      fetchedAt: Date.now(),
      rates: {
        usdcSupplyPct:  kamino.usdcSupply,
        usdcBorrowPct:  kamino.usdcBorrow,
        solBorrowPct:   kamino.solBorrow,
        onycNavPct:     ONYC_BASE_NAV_PCT,
        jlpFeeApyPct:   jlpFeeApy,
      },
      strategies: {
        stableYieldAprPct:  stableYieldApr,
        onycAprPct:         onycApr,
        hedgedjlpAprPct:    hedgedjlpApr,
        portfolioAprPct:    portfolioApr,
      },
    });
  } catch (err) {
    // Log the real error server-side; return a generic message to the
    // client. Reqwest / fetch error strings can leak internal host names
    // or DNS failure detail that aren't useful to the caller.
    console.error("rates upstream failed", err);
    return NextResponse.json(
      { ok: false, error: "upstream rate source failed" },
      { status: 502 }
    );
  }
}
