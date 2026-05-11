// Server-side rate fetcher — same sources and math as fleet_rates.rs.
// Runs on Next.js edge/node, no CORS issues, works from any deployment.
//
// Sources:
//   Kamino API  /reserves/metrics  → USDC supply, USDC borrow, SOL borrow
//   Solana RPC  getInflationRate   → native staking base for jitoSOL
//   DeFiLlama   /chart/<pool>      → JLP fee APY via Orca JLP-USDC pool
//
// Math (mirrors fleet_rates.rs exactly):
//   stable_yield  = usdc_supply_pct
//   multiply      = jitosol_apy × 2.5  −  usdc_borrow × 1.5
//   hedgedjlp     = jlp_fee_apy  −  sol_borrow × 0.75
//   portfolio     = equal-weight average of three strategies

import { NextResponse } from "next/server";

const KAMINO_MARKET =
  "https://api.kamino.finance/kamino-market/" +
  "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF/reserves/metrics";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const ORCA_JLP_USDC_POOL = "99306789-b083-4668-86da-4cedb1c9bfef";

const JITO_MEV_PREMIUM = 1.5;       // % added on top of native staking
const STAKE_PARTICIPATION = 0.66;   // fraction of SOL supply staked
const MULTIPLY_LTV = 0.60;          // target LTV → 2.5× leverage
const HEDGE_FRACTION = 0.75;        // fraction of JLP hedged

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

async function fetchJitosolApy(): Promise<number> {
  const body = { jsonrpc: "2.0", id: 1, method: "getInflationRate", params: [] };
  const res = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`RPC ${res.status}`);
  const data = await res.json() as { result: { validator: number } };
  const nativeApy = (data.result.validator / STAKE_PARTICIPATION) * 100;
  return nativeApy + JITO_MEV_PREMIUM;
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
    const [kamino, jitosolApy, jlpFeeApy] = await Promise.all([
      fetchKamino(),
      fetchJitosolApy(),
      fetchJlpFeeApy(),
    ]);

    const lev  = 1 / (1 - MULTIPLY_LTV);   // 2.5
    const debt = lev - 1;                   // 1.5

    const stableYieldApr = kamino.usdcSupply;
    const multiplyApr    = Math.max(0, jitosolApy * lev - kamino.usdcBorrow * debt);
    const hedgedjlpApr   = Math.max(0, jlpFeeApy - kamino.solBorrow * HEDGE_FRACTION);
    const portfolioApr   = (stableYieldApr + multiplyApr + hedgedjlpApr) / 3;

    return NextResponse.json({
      ok: true,
      fetchedAt: Date.now(),
      rates: {
        usdcSupplyPct:  kamino.usdcSupply,
        usdcBorrowPct:  kamino.usdcBorrow,
        solBorrowPct:   kamino.solBorrow,
        jitosolApyPct:  jitosolApy,
        jlpFeeApyPct:   jlpFeeApy,
      },
      strategies: {
        stableYieldAprPct:  stableYieldApr,
        multiplyAprPct:     multiplyApr,
        hedgedjlpAprPct:    hedgedjlpApr,
        portfolioAprPct:    portfolioApr,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 502 }
    );
  }
}
