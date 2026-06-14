// Live read of the hgMETAL static INDEX (separate program hgmetal-index).
// Oracle-free in-kind vault; DISPLAY NAV is computed here OFF-CHAIN as
// Σ(held basket balance × Pyth price). Also surfaces the smart-beta
// rebalancer: current weight vs the on-chain target_weight_bps per leg.
// Public devnet state.

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RPC = "https://api.devnet.solana.com";
const HERMES = "https://hermes.pyth.network";
const PROGRAM = "6EQajY1dyrXGeZYD1EdcTUPPMSFFLyvDLnH544yq8QSG";
const INDEX_VAULT = "GJpA3ft3X71Zpu54hKyVBezQGsCQgypYRk8mHke4A4ih";
const HGMETAL_MINT = "3SSaDecNg66FMQmgVFSfkxAA6TaYo4gcgZCFPVYACk4R";

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
    for (let j = 0; j < digits.length; j++) { carry += digits[j] << 8; digits[j] = carry % 58; carry = (carry / 58) | 0; }
    while (carry) { digits.push(carry % 58); carry = (carry / 58) | 0; }
  }
  let zeros = 0; while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  let str = "1".repeat(zeros);
  for (let i = digits.length - 1; i >= 0; i--) str += B58[digits[i]];
  return str;
}
async function rpc(method: string, params: unknown[]): Promise<any> {
  const res = await fetch(RPC, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }), cache: "no-store" });
  const j = await res.json();
  if (j.error) throw new Error(`${method}: ${j.error.message}`);
  return j.result;
}

export async function GET() {
  try {
    const acc = await rpc("getAccountInfo", [INDEX_VAULT, { encoding: "base64" }]);
    if (!acc?.value?.data?.[0]) return NextResponse.json({ ok: false, error: "index vault not found" }, { status: 404 });
    const data = Buffer.from(acc.value.data[0], "base64");

    // IndexVault: 8 disc + authority(32)+manager(32)+hgmetal_mint(32) = 104, then slots[8 × 160].
    const SLOTS_BASE = 104, SLOT = 160;
    const slots: { sym: string; name: string; targetPct: number; decimals: number; tokenAccount: string }[] = [];
    for (let i = 0; i < 8; i++) {
      const base = SLOTS_BASE + i * SLOT;
      const mint = data.subarray(base, base + 32);
      if (mint.every((b) => b === 0)) continue;
      const tokenAccount = b58encode(data.subarray(base + 32, base + 64));
      const feedId = data.subarray(base + 96, base + 128).toString("hex");
      const targetBps = data.readUInt16LE(base + 128);
      const decimals = data.readUInt8(base + 130);
      const meta = METALS.find((m) => m.feedId === feedId);
      slots.push({ sym: meta?.sym ?? "???", name: meta?.name ?? "unknown", targetPct: targetBps / 100, decimals, tokenAccount });
    }

    const multi = await rpc("getMultipleAccounts", [slots.map((s) => s.tokenAccount), { encoding: "base64" }]);
    const balances = slots.map((s, i) => {
      const v = multi.value[i];
      if (!v?.data?.[0]) return 0;
      return Number(Buffer.from(v.data[0], "base64").readBigUInt64LE(64)) / Math.pow(10, s.decimals);
    });

    const ids = METALS.map((m) => `ids[]=${m.feedId}`).join("&");
    const live: Record<string, number> = {};
    let anyStale = false;
    try {
      const hj = await (await fetch(`${HERMES}/v2/updates/price/latest?${ids}&parsed=true`, { cache: "no-store" })).json();
      const now = Date.now() / 1000;
      for (const p of hj.parsed ?? []) {
        const sym = METALS.find((m) => m.feedId === p.id)?.sym;
        if (sym) { live[sym] = Number(p.price.price) * Math.pow(10, p.price.expo); if (now - p.price.publish_time > 3600) anyStale = true; }
      }
    } catch { /* ignore */ }

    let nav = 0;
    const legs = slots.map((s, i) => {
      const price = live[s.sym] ?? 0;
      const valueUsd = balances[i] * price;
      nav += valueUsd;
      return { sym: s.sym, name: s.name, balance: balances[i], priceUsd: price, valueUsd, targetPct: s.targetPct, weightPct: 0 };
    });
    legs.forEach((l) => { l.weightPct = nav > 0 ? (l.valueUsd / nav) * 100 : 0; });
    const maxDriftBps = Math.max(0, ...legs.map((l) => Math.abs(l.weightPct - l.targetPct) * 100));

    let supply = 0;
    try { supply = Number((await rpc("getTokenSupply", [HGMETAL_MINT]))?.value?.uiAmount) || 0; } catch { /* */ }
    const sharePriceUsd = supply > 0 ? nav / supply : 0;

    return NextResponse.json({
      ok: true, fetchedAt: Date.now(), program: PROGRAM, vault: INDEX_VAULT, hgmetalMint: HGMETAL_MINT,
      navUsd: nav, supply, sharePriceUsd, anyStale, maxDriftBps, legs,
    });
  } catch (err) {
    console.error("index-vault read failed", err);
    return NextResponse.json({ ok: false, error: "index read failed" }, { status: 502 });
  }
}
