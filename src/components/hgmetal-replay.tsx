"use client";

import { useMemo, useState } from "react";
import replay from "@/data/hgmetal-replay.json";

// Historical replay: real Hyperliquid funding run through the on-chain
// waterfall, plus real HL metal prices for the hgMETAL index. Drag the
// slider to see all three tickers' price + APR evolve over the window.
// This is a backtest of public data, not a live track record.

interface Day {
  date: string;
  metalIndex: number;
  hgMetalYield: number;
  hgUsdPx: number;
  hgUsdApr: number;
  hgYieldPx: number;
  hgYieldApr: number;
  dayCarry: number;
}
const SERIES = (replay as { series: Day[] }).series;

const GOLD = "#C9A84C";
const STEEL = "#7BA3C8";
const GREEN = "#86efac";
const DIM = "rgba(255,255,255,0.45)";

// normalized series (all start ~1.0): metalIndex/100, hgUSD px, hgYIELD px
function norm(d: Day) {
  return { metal: d.metalIndex / 100, usd: d.hgUsdPx, yld: d.hgYieldPx };
}

function Chart({ idx }: { idx: number }) {
  const W = 640, H = 150, pad = 6;
  const pts = SERIES.map(norm);
  const all = pts.flatMap((p) => [p.metal, p.usd, p.yld]);
  const lo = Math.min(...all), hi = Math.max(...all);
  const x = (i: number) => pad + (i / (SERIES.length - 1)) * (W - 2 * pad);
  const y = (v: number) => H - pad - ((v - lo) / (hi - lo || 1)) * (H - 2 * pad);
  const pathOf = (sel: (p: ReturnType<typeof norm>) => number) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(sel(p)).toFixed(1)}`).join(" ");
  const mx = x(idx);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto" }}>
      <line x1={x(0)} y1={y(1)} x2={x(SERIES.length - 1)} y2={y(1)} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
      <path d={pathOf((p) => p.metal)} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.9} />
      <path d={pathOf((p) => p.usd)} fill="none" stroke={STEEL} strokeWidth={1.5} />
      <path d={pathOf((p) => p.yld)} fill="none" stroke={GREEN} strokeWidth={1.5} />
      <line x1={mx} y1={pad} x2={mx} y2={H - pad} stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
      {(["metal", "usd", "yld"] as const).map((k) => {
        const c = k === "metal" ? GOLD : k === "usd" ? STEEL : GREEN;
        return <circle key={k} cx={mx} cy={y(norm(SERIES[idx])[k])} r={3} fill={c} />;
      })}
    </svg>
  );
}

export function HgMetalReplay() {
  const [idx, setIdx] = useState(SERIES.length - 1);
  const d = SERIES[idx];
  const metalChg = useMemo(() => (d.metalIndex / SERIES[0].metalIndex - 1) * 100, [d]);

  const Card = ({ name, color, line1, line2, sub }: { name: string; color: string; line1: string; line2: string; sub: string }) => (
    <div className="rounded-lg border border-white/10 bg-[var(--navy)] px-3 py-2.5">
      <div style={{ color }} className="font-mono font-bold text-xs sm:text-sm">{name}</div>
      <div className="text-white font-mono text-sm sm:text-base mt-0.5">{line1}</div>
      <div style={{ color: DIM }} className="font-mono text-xs">{line2}</div>
      <div style={{ color: DIM }} className="text-[10px] mt-1 leading-tight">{sub}</div>
    </div>
  );

  return (
    <div className="rounded-xl border border-white/10 bg-[var(--navy)] p-4 sm:p-6">
      <div className="flex items-baseline justify-between mb-3">
        <span style={{ color: GOLD }} className="font-mono font-bold text-sm">hgMETAL replay</span>
        <span style={{ color: DIM }} className="font-mono text-xs">{d.date}</span>
      </div>

      <Chart idx={idx} />

      <input
        type="range"
        min={0}
        max={SERIES.length - 1}
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        className="w-full mt-2 accent-[#C9A84C]"
        aria-label="scrub date"
      />
      <div className="flex justify-between font-mono text-[10px]" style={{ color: DIM }}>
        <span>{SERIES[0].date}</span>
        <span>drag to scrub · {SERIES.length} days</span>
        <span>{SERIES[SERIES.length - 1].date}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
        <Card
          name="hgMETAL"
          color={GOLD}
          line1={`idx ${d.metalIndex.toFixed(1)}`}
          line2={`${metalChg >= 0 ? "+" : ""}${metalChg.toFixed(1)}% since start`}
          sub="unhedged metals · price moves with metals + ~3.5% yield"
        />
        <Card
          name="hgUSD"
          color={STEEL}
          line1={`$${d.hgUsdPx.toFixed(4)}`}
          line2={`${d.hgUsdApr.toFixed(1)}% APR`}
          sub="senior · defined coupon · price-stable floor"
        />
        <Card
          name="hgYIELD"
          color={GREEN}
          line1={`$${d.hgYieldPx.toFixed(4)}`}
          line2={`${d.hgYieldApr >= 0 ? "+" : ""}${d.hgYieldApr.toFixed(1)}% APR`}
          sub="junior · carry residual · first-loss NAV"
        />
      </div>

      <p style={{ color: DIM }} className="text-[11px] leading-relaxed mt-3">
        Real Hyperliquid funding replayed through the on-chain waterfall, with
        real HL metal prices for the index. Note how hgUSD and hgYIELD keep
        earning the carry while the metal index falls, they are delta-hedged, so
        they don&apos;t track metal direction. Backtest of public data, not a live
        track record.
      </p>
    </div>
  );
}
