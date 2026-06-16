"use client";

import { useMemo } from "react";

// Deterministic sparkline so it doesn't jump on re-render — illustrative.
function makeSparkline(base: number, points = 28): number[] {
  const out: number[] = [];
  let v = base * 0.9;
  for (let i = 0; i < points; i++) {
    const noise = Math.sin(i * 1.7) * 0.6 + Math.cos(i * 0.9) * 0.4;
    v = v + (base - v) * 0.18 + noise * (base * 0.02);
    out.push(Math.max(0, v));
  }
  return out;
}

function Sparkline({ values, color, height = 24 }: { values: number[]; color: string; height?: number }) {
  const w = 80;
  const min = Math.min(...values);
  const max = Math.max(...values) || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `0,${height} ${polyline} ${w},${height}`;
  return (
    <svg width={w} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const TOKENS = [
  { label: "hgUSD · senior", value: "5.00%", color: "#aeb8c4", base: 5 },
  { label: "hgYIELD · junior", value: "15.2%", color: "#ff7a2e", base: 15 },
  { label: "hgMETAL · index", value: "$100.0", color: "#C9A84C", base: 100 },
];
const METALS = ["gold", "silver", "platinum", "palladium"];

// hgMETAL product mock for the hero — illustrative; the live numbers are at
// terminal.hedgents.com. The fleet is the engine, not the headline.
export function DashboardMock() {
  const carryLine = useMemo(() => makeSparkline(6.5, 28), []);
  return (
    <div className="w-full max-w-lg select-none">
      {/* Browser chrome */}
      <div className="rounded-t-xl px-3 py-2 flex items-center gap-2" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <a
          href="https://terminal.hedgents.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 flex-1 rounded px-3 py-0.5 font-mono text-[10px] text-center transition-colors hover:text-white/60"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)" }}
        >
          terminal.hedgents.com / hgMETAL
        </a>
      </div>
      {/* Body */}
      <div className="rounded-b-xl overflow-hidden" style={{ backgroundColor: "rgba(8, 8, 20, 0.97)", border: "1px solid rgba(201,168,76,0.15)", borderTop: "none" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="font-serif text-[14px] font-bold" style={{ color: "#C9A84C" }}>hgMETAL</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>devnet</span>
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(201,168,76,0.12)", color: "#C9A84C" }}>3 tokens</span>
          </div>
        </div>
        {/* Net carry headline + chart */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Net basket carry</div>
              <div className="font-mono text-2xl font-bold" style={{ color: "#C9A84C" }}>~5-8%</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>delta-neutral</div>
              <div className="font-mono text-xs" style={{ color: "#10b981" }}>hedge 100%</div>
            </div>
          </div>
          <div className="w-full h-12 relative">
            <svg viewBox="0 0 200 48" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="main-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const vals = carryLine;
                const min = Math.min(...vals);
                const max = Math.max(...vals) || 1;
                const pts = vals.map((v, i) => {
                  const x = (i / (vals.length - 1)) * 200;
                  const y = 44 - ((v - min) / (max - min || 1)) * 38 - 2;
                  return `${x},${y}`;
                });
                const poly = pts.join(" ");
                const area = `0,48 ${poly} 200,48`;
                return (
                  <>
                    <polygon points={area} fill="url(#main-grad)" />
                    <polyline points={poly} fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round" />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
        {/* Three token cards */}
        <div className="grid grid-cols-3 gap-px mx-4 mb-3 rounded-lg overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
          {TOKENS.map((t) => (
            <div key={t.label} className="px-3 py-2.5" style={{ backgroundColor: "rgba(8,8,20,0.9)" }}>
              <div className="font-mono text-[9px] mb-1 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{t.label}</div>
              <div className="font-mono text-sm font-semibold mb-1.5" style={{ color: t.color }}>{t.value}</div>
              <Sparkline values={makeSparkline(t.base, 16)} color={t.color} height={24} />
            </div>
          ))}
        </div>
        {/* Metals basket strip */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {METALS.map((m) => (
            <div key={m} className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
