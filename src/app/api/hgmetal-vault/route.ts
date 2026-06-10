// Live read of the hgMETAL devnet vault.
//
// Reads the on-chain Vault account by raw JSON-RPC (no Solana SDK in the
// bundle), decodes the fields we display at fixed offsets, fetches the
// per-metal basket-token balances + USDC reserve, and pulls live Pyth
// prices from Hermes. Returns a compact JSON the terminal component
// polls. All data is public devnet state.

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RPC = "https://api.devnet.solana.com";
const HERMES = "https://hermes.pyth.network";
const VAULT = "F4jMjSpNviUHmKLtfgHRY9GDg1czYuey4XUsXs45c8T4";

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

async function rpc(method: string, params: unknown[]): Promise<any> {
  const res = await fetch(RPC, {
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
      const hr = await fetch(`${HERMES}/v2/updates/price/latest?${ids}&parsed=true`, {
        cache: "no-store",
      });
      const hj = await hr.json();
      for (const p of hj.parsed ?? []) {
        const sym = METALS.find((m) => m.feedId === p.id)?.sym;
        if (sym) live[sym] = Number(p.price.price) * Math.pow(10, p.price.expo);
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

    // ── live HL carry (for implied tranche APRs) + hgMETAL index 24h ──
    // Weighted: gold/silver-heavy, Pt/Pd small (thin OI caps).
    const CARRY_W: Record<string, number> = { GOLD: 0.45, SILVER: 0.35, PLATINUM: 0.1, PALLADIUM: 0.1 };
    const ORO = 3.5, FEES = 1.5, HRS_YR = 24 * 365;
    let basketCarryPct = 0, metalIndex24hPct = 0;
    try {
      const hr = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs", dex: "xyz" }),
        cache: "no-store",
      });
      const hj = await hr.json();
      const uni = hj[0]?.universe ?? [], ctx = hj[1] ?? [];
      let wsum = 0;
      for (let i = 0; i < uni.length; i++) {
        const sym = String(uni[i].name).split(":").pop()!.toUpperCase();
        const w = CARRY_W[sym];
        if (!w || !ctx[i]) continue;
        const fundingAnn = Number(ctx[i].funding) * HRS_YR * 100;
        basketCarryPct += w * (fundingAnn + (sym === "GOLD" ? ORO : 0));
        const mark = Number(ctx[i].markPx), prev = Number(ctx[i].prevDayPx);
        if (mark && prev) metalIndex24hPct += w * ((mark / prev - 1) * 100);
        wsum += w;
      }
      basketCarryPct -= FEES;
      if (wsum) metalIndex24hPct /= wsum;
    } catch {
      basketCarryPct = NaN;
    }

    // Implied tranche APRs: senior at its 5% target; junior = the residual
    // carry on its base (deployed ~ total NAV).
    const SENIOR_TARGET = 5;
    const grossCarryUsd = Number.isNaN(basketCarryPct) ? 0 : (basketCarryPct / 100) * totalNav;
    const seniorCouponUsd = (SENIOR_TARGET / 100) * seniorNav;
    const juniorAprPct = juniorNav > 0 ? ((grossCarryUsd - seniorCouponUsd) / juniorNav) * 100 : 0;

    const tickers = {
      hgUSD: { label: "senior", priceUsd: seniorSupply ? seniorNav / seniorSupply : 1, aprPct: SENIOR_TARGET },
      hgYIELD: { label: "junior", priceUsd: juniorSupply ? juniorNav / juniorSupply : 1, aprPct: juniorAprPct },
      hgMETAL: { label: "exposure", change24hPct: metalIndex24hPct, yieldPct: ORO },
    };

    return NextResponse.json({
      ok: true,
      fetchedAt: Date.now(),
      vault: VAULT,
      program: "5kQGqqconKPFXYwqMwQ6ynqB1ZRBmbAb4W7Hvh3KQcKi",
      metals,
      basketLiveValue,
      usdcReserve,
      basketCarryPct,
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
    });
  } catch (err) {
    console.error("hgmetal-vault read failed", err);
    return NextResponse.json({ ok: false, error: "vault read failed" }, { status: 502 });
  }
}
