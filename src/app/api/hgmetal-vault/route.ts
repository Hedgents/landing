// Live read of the hgMETAL devnet vault.
//
// Reads the on-chain Vault account by raw JSON-RPC (no Solana SDK in the
// bundle), decodes the fields we display at fixed offsets, fetches the
// per-metal basket-token balances + USDC reserve, and pulls live Pyth
// prices from Hermes. Returns a compact JSON the terminal component
// polls. All data is public devnet state.

import { NextResponse } from "next/server";
import { HEDGED_CARRY_W, HEDGED_CARRY_FEES_PCT, HRS_PER_YEAR } from "@/lib/hedged-carry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RPC = "https://api.devnet.solana.com";
const HERMES = "https://hermes.pyth.network";
const VAULT = "51q5A3wx53UjoFco8Zwt3zesNn2ePpFd9TS2tW9gMYhP";

// AUDIT_v2 FE-6: short TTL response cache + AbortController-bounded fetches so
// the 8s dashboard poll (and multiple clients) doesn't hammer devnet RPC.
const READ_TTL_MS = 4_000;
const _readCache: { t: number; json: unknown } = ((globalThis as any).__hgVaultReadCacheLanding ??= { t: 0, json: null });
const FETCH_TIMEOUT_MS = 4_000;
async function fetchT(url: string, init?: RequestInit): Promise<Response> {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(id);
  }
}

const METALS = [
  { sym: "XAU", name: "Gold", feedId: "765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2" },
  { sym: "XAG", name: "Silver", feedId: "f2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e" },
  { sym: "XPT", name: "Platinum", feedId: "398e4bbc7cbf89d6648c21e08019d878967677753b3096799595c78f805a34e5" },
  { sym: "XPD", name: "Palladium", feedId: "80367e9664197f37d89a07a804dffd2101c479c7c4e8490501bc9d9e1e7f9021" },
];

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function b58encode(bytes: Buffer): string {
  const digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  let str = "1".repeat(zeros);
  for (let i = digits.length - 1; i >= 0; i--) str += B58[digits[i]];
  return str;
}

function readU128LE(buf: Buffer, off: number): bigint {
  const lo = buf.readBigUInt64LE(off);
  const hi = buf.readBigUInt64LE(off + 8);
  return lo + (hi << BigInt(64));
}
const toUsd = (uusdc: bigint) => Number(uusdc) / 1e6;

// Recent realized basket carry from gold/silver HL funding, net of fees.
// AUDIT_v2 FE-3: parity with the terminal route — cached 1h so the trailing
// 30d funding (which barely moves intra-hour) isn't re-pulled every poll.
let _carryCache: { t: number; val: number | null } = { t: 0, val: null };
async function realizedBasketCarryPct(): Promise<number | null> {
  const now = Date.now();
  if (_carryCache.val != null && now - _carryCache.t < 3_600_000) return _carryCache.val;
  try {
    const startTime = now - 30 * 24 * 3600 * 1000;
    const hist = async (coin: string) => {
      const r = await fetchT("https://api.hyperliquid.xyz/info", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "fundingHistory", coin, startTime, endTime: now }), cache: "no-store",
      });
      const h = await r.json();
      if (!Array.isArray(h) || !h.length) return null;
      const avg = h.reduce((a: number, x: any) => a + Number(x.fundingRate), 0) / h.length;
      return avg * 24 * 365 * 100; // annualized %
    };
    const [g, s] = await Promise.all([hist("xyz:GOLD"), hist("xyz:SILVER")]);
    if (g == null || s == null) return _carryCache.val;
    const net = HEDGED_CARRY_W.GOLD * g + HEDGED_CARRY_W.SILVER * s - HEDGED_CARRY_FEES_PCT;
    _carryCache = { t: now, val: net };
    return net;
  } catch {
    return _carryCache.val;
  }
}

async function rpc(method: string, params: unknown[]): Promise<any> {
  const res = await fetchT(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
  });
  const j = await res.json();
  if (j.error) throw new Error(`${method}: ${j.error.message}`);
  return j.result;
}

async function getAccount(addr: string): Promise<Buffer | null> {
  const r = await rpc("getAccountInfo", [addr, { encoding: "base64" }]);
  if (!r?.value?.data?.[0]) return null;
  return Buffer.from(r.value.data[0], "base64");
}

export async function GET() {
  try {
    // AUDIT_v2 FE-6: serve a fresh-enough cached payload to spare devnet RPC.
    if (_readCache.json && Date.now() - _readCache.t < READ_TTL_MS) {
      return NextResponse.json(_readCache.json);
    }

    const data = await getAccount(VAULT);
    if (!data) {
      return NextResponse.json({ ok: false, error: "vault account not found" }, { status: 404 });
    }

    // ── decode Vault (offsets fixed by the Anchor layout) ──────────
    // 8 disc + 6 pubkeys (192) = 200, then four u128 NAV fields.
    const usdcVaultAtaPk = b58encode(data.subarray(168, 200));
    const totalNav = toUsd(readU128LE(data, 200));
    const seniorNav = toUsd(readU128LE(data, 216));
    const juniorNav = toUsd(readU128LE(data, 232));
    const unallocNav = toUsd(readU128LE(data, 248));
    // 264 = perp_realized (i128, skipped), 280/288 = supplies (u64).
    const seniorSupply = Number(data.readBigUInt64LE(280)) / 1e6;
    const juniorSupply = Number(data.readBigUInt64LE(288)) / 1e6;

    const BASKET = 332;
    const SLOT = 160;
    const slots: {
      sym: string;
      name: string;
      weightPct: number;
      decimals: number;
      tokenAccount: string;
      cachedPriceUsd: number;
    }[] = [];
    for (let i = 0; i < 8; i++) {
      const base = BASKET + i * SLOT;
      const mint = data.subarray(base, base + 32);
      if (mint.every((b) => b === 0)) continue; // inactive slot
      const tokenAccount = b58encode(data.subarray(base + 32, base + 64));
      const feedId = data.subarray(base + 96, base + 128).toString("hex");
      const weightBps = data.readUInt16LE(base + 128);
      const decimals = data.readUInt8(base + 130);
      const cached = Number(readU128LE(data, base + 131)) / 1e6;
      const meta = METALS.find((m) => m.feedId === feedId);
      slots.push({
        sym: meta?.sym ?? "???",
        name: meta?.name ?? "unknown",
        weightPct: weightBps / 100,
        decimals,
        tokenAccount,
        cachedPriceUsd: cached,
      });
    }

    // ── balances: basket token accounts + USDC reserve in one call ──
    const accs = [...slots.map((s) => s.tokenAccount), usdcVaultAtaPk];
    const multi = await rpc("getMultipleAccounts", [accs, { encoding: "base64" }]);
    const balances: number[] = slots.map((s, i) => {
      const v = multi.value[i];
      if (!v?.data?.[0]) return 0;
      const b = Buffer.from(v.data[0], "base64");
      return Number(b.readBigUInt64LE(64)) / Math.pow(10, s.decimals);
    });
    const usdcAcc = multi.value[slots.length];
    const usdcReserve = usdcAcc?.data?.[0]
      ? Number(Buffer.from(usdcAcc.data[0], "base64").readBigUInt64LE(64)) / 1e6
      : 0;

    // ── live Pyth prices from Hermes ───────────────────────────────
    const ids = METALS.map((m) => `ids[]=${m.feedId}`).join("&");
    let live: Record<string, number> = {};
    try {
      const hr = await fetchT(`${HERMES}/v2/updates/price/latest?${ids}&parsed=true`, {
        cache: "no-store",
      });
      const hj = await hr.json();
      for (const p of hj.parsed ?? []) {
        const sym = METALS.find((m) => m.feedId === p.id)?.sym;
        const px = Number(p.price.price) * Math.pow(10, p.price.expo);
        // AUDIT_v2 FE-6: only a strictly-positive finite quote counts as live;
        // a 0/NaN quote falls through to the cached on-chain price below.
        if (sym && Number.isFinite(px) && px > 0) live[sym] = px;
      }
    } catch {
      // fall back to cached prices below
    }

    const metals = slots.map((s, i) => {
      const price = live[s.sym] ?? s.cachedPriceUsd;
      const balance = balances[i];
      return {
        sym: s.sym,
        name: s.name,
        weightPct: s.weightPct,
        balance,
        priceUsd: price,
        cachedPriceUsd: s.cachedPriceUsd,
        valueUsd: balance * price,
        live: live[s.sym] !== undefined,
      };
    });
    const basketLiveValue = metals.reduce((a, m) => a + m.valueUsd, 0);

    // ── paper short notional (delta hedge) + hedge ratio ─────────────
    // AUDIT_v2 FE-3: parity with the terminal route. PaperPerpState starts
    // right after the 8-slot basket (332 + 8*160 = 1612).
    const perpShortUsd = toUsd(readU128LE(data, 1612));
    const hedgeRatioPct = basketLiveValue > 0 ? (perpShortUsd / basketLiveValue) * 100 : 0;

    // ── junior-windfall reserve war-chest (4th NAV bucket) + config ──
    const reserveUsd = toUsd(readU128LE(data, 1765));
    const reserveFloorBps = data.readUInt16LE(1781);
    const reserveSkimThresholdBps = data.readUInt16LE(1783);
    const reserveSkimBps = data.readUInt16LE(1785);

    // ── live HL carry (for implied tranche APRs) + hgMETAL index 24h ──
    // AUDIT_v2 FE-2/FE-3: hedged carry uses the SHARED 75/25 gold/silver
    // weighting (the hedged book is gold/silver only; Pt/Pd are never shorted).
    const CARRY_W = HEDGED_CARRY_W;
    const FEES = HEDGED_CARRY_FEES_PCT, HRS_YR = HRS_PER_YEAR;
    // The hgMETAL 24h tile is a 4-metal INDEX move (gold/silver/platinum/
    // palladium), a SEPARATE concern from the gold/silver hedged carry. Use an
    // explicit 4-metal display weighting so the tile reflects the index, not
    // just the two hedged legs.
    const INDEX_24H_W: Record<string, number> = { GOLD: 0.45, SILVER: 0.2, PLATINUM: 0.15, PALLADIUM: 0.12 };
    let basketCarryPct = 0, metalIndex24hPct = 0;
    try {
      const hr = await fetchT("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs", dex: "xyz" }),
        cache: "no-store",
      });
      const hj = await hr.json();
      const uni = hj[0]?.universe ?? [], ctx = hj[1] ?? [];
      let idxWsum = 0;
      for (let i = 0; i < uni.length; i++) {
        const sym = String(uni[i].name).split(":").pop()!.toUpperCase();
        if (!ctx[i]) continue;
        // hedged carry: gold/silver only (75/25)
        const cw = CARRY_W[sym];
        if (cw) {
          const fundingAnn = Number(ctx[i].funding) * HRS_YR * 100;
          basketCarryPct += cw * fundingAnn;
        }
        // hgMETAL index 24h: all 4 metals, separate weighting
        const iw = INDEX_24H_W[sym];
        if (iw) {
          const mark = Number(ctx[i].markPx), prev = Number(ctx[i].prevDayPx);
          if (mark && prev) { metalIndex24hPct += iw * ((mark / prev - 1) * 100); idxWsum += iw; }
        }
      }
      basketCarryPct -= FEES;
      if (idxWsum) metalIndex24hPct /= idxWsum; else metalIndex24hPct = NaN;
    } catch {
      basketCarryPct = NaN;
      metalIndex24hPct = NaN;
    }
    const basketCarryRealizedPct = await realizedBasketCarryPct();

    // Implied tranche APRs: senior at its 5% target; junior = the residual.
    // AUDIT_v2 FE-3: carry is earned on the DEPLOYED hedged sleeve
    // (basketLiveValue == short notional), not on total NAV (which includes
    // idle USDC). Parity with the terminal route.
    const SENIOR_TARGET = 5;
    const grossCarryUsd = Number.isNaN(basketCarryPct) ? 0 : (basketCarryPct / 100) * basketLiveValue;
    const seniorCouponUsd = (SENIOR_TARGET / 100) * seniorNav;
    const juniorAprPct = juniorNav > 0 ? ((grossCarryUsd - seniorCouponUsd) / juniorNav) * 100 : 0;

    const tickers = {
      hgUSD: { label: "senior", priceUsd: seniorSupply ? seniorNav / seniorSupply : 1, aprPct: SENIOR_TARGET },
      hgYIELD: { label: "junior", priceUsd: juniorSupply ? juniorNav / juniorSupply : 1, aprPct: juniorAprPct },
      // change24hPct is the 4-metal index 24h move (NaN if HL ctx unavailable).
      hgMETAL: { label: "index", change24hPct: metalIndex24hPct, yieldPct: 0 },
    };

    // ── fleet role view (mirrors the orchestrator's roles) ──────────
    const LEVERAGE = 3, MM = 0.05, STRESS = 0.05;
    const liqBufferPct = (1 / LEVERAGE - MM) * 100;
    const riskOk = STRESS < 1 / LEVERAGE - MM;
    const seniorCoverable = grossCarryUsd >= seniorCouponUsd;
    const coverageX = seniorCouponUsd > 0 ? grossCarryUsd / seniorCouponUsd : 0;
    const carrySignal = Number.isNaN(basketCarryPct)
      ? "n/a"
      : basketCarryPct >= 6 ? "strong" : basketCarryPct >= 3 ? "ok" : basketCarryPct >= 0 ? "thin" : "negative";
    const decision = carrySignal === "negative"
      ? "HOLD — carry negative, do not add"
      : !riskOk ? "DE-RISK — raise reserve / lower leverage"
      : "MAINTAIN — hold delta-neutral hedge, accrue carry";
    const fleet = {
      researcher: { carryPct: basketCarryPct, signal: carrySignal },
      riskwatcher: { leverage: LEVERAGE, liqBufferPct: +liqBufferPct.toFixed(1), ok: riskOk },
      treasury: { coverageX: +coverageX.toFixed(1), seniorCoverable, juniorAprPct: +juniorAprPct.toFixed(1) },
      decision,
    };

    const payload = {
      fleet,
      ok: true,
      fetchedAt: Date.now(),
      vault: VAULT,
      program: "5kQGqqconKPFXYwqMwQ6ynqB1ZRBmbAb4W7Hvh3KQcKi",
      indexProgram: "6EQajY1dyrXGeZYD1EdcTUPPMSFFLyvDLnH544yq8QSG",
      mockUsdcMint: "6sgKwTvosM3UybKZbi1qEi5TNm8pi3nhbdg4PXaiHwzs",
      metals,
      basketLiveValue,
      // AUDIT_v2 FE-3: reserve + hedge fields, parity with the terminal route.
      perpShortUsd,
      hedgeRatioPct,
      reserveUsd,
      reserveFloorBps,
      reserveSkimThresholdBps,
      reserveSkimBps,
      usdcReserve,
      basketCarryPct,
      basketCarryRealizedPct,
      tickers,
      nav: {
        total: totalNav,
        senior: seniorNav,
        junior: juniorNav,
        unallocated: unallocNav,
        seniorSupply,
        juniorSupply,
        seniorPx: seniorSupply ? seniorNav / seniorSupply : 1,
        juniorPx: juniorSupply ? juniorNav / juniorSupply : 1,
      },
    };
    // AUDIT_v2 FE-6: cache the fresh payload for the short TTL window.
    _readCache.t = Date.now();
    _readCache.json = payload;
    return NextResponse.json(payload);
  } catch (err) {
    console.error("hgmetal-vault read failed", err);
    return NextResponse.json({ ok: false, error: "vault read failed" }, { status: 502 });
  }
}
