"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createChart, ColorType, type IChartApi, type ISeriesApi } from "lightweight-charts";

const PASSCODE = "GOlD";
const STORAGE_KEY = "hgmetal-terminal-unlocked";
const REFRESH_MS = 8000;

type SeriesPoint = {
  date: string; metalIndex: number; hgUsdPx: number; hgYieldPx: number;
  hgUsdApr: number; hgYieldApr: number; dayCarry: number;
};
type TickerKey = "hgUSD" | "hgYIELD" | "hgMETAL";

// metallic palette — gold / silver / platinum foils + gunmetal surfaces
const GOLD_FOIL = "linear-gradient(135deg,#7a5d18 0%,#d9b24a 22%,#fff0bf 46%,#caa23a 60%,#8a6d1f 80%,#e8c45a 100%)";
const SILVER_FOIL = "linear-gradient(135deg,#6f727a 0%,#c8ccd4 26%,#ffffff 48%,#aeb2bb 64%,#7e828b 82%,#d8dce3 100%)";
const PLAT_FOIL = "linear-gradient(135deg,#7f858c 0%,#cfd6dd 30%,#ffffff 50%,#bcc4cd 66%,#8a9099 84%,#e3e8ee 100%)";
const foilStyle = (img: string) => ({ backgroundImage: img, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const);
// brushed-metal panel surface (subtle top bevel highlight)
const PLATE = "linear-gradient(180deg,#15151b 0%,#0e0e13 100%)";
const PLATE_ACTIVE = "linear-gradient(180deg,#20202a 0%,#15151c 100%)";
const METAL_TINT: Record<string, string> = { Gold: "#e6c15a", Silver: "#c8ccd4", Platinum: "#dfe4ea", Palladium: "#b9b3a6" };

const TICKERS: { key: TickerKey; role: string; seriesKey: keyof SeriesPoint; color: string; foil: string; unit: "usd" | "level" }[] = [
  { key: "hgUSD", role: "senior · stable coupon", seriesKey: "hgUsdPx", color: "#aeb8c4", foil: SILVER_FOIL, unit: "usd" },
  { key: "hgYIELD", role: "junior · levered carry", seriesKey: "hgYieldPx", color: "#e6c15a", foil: GOLD_FOIL, unit: "usd" },
  { key: "hgMETAL", role: "exposure · managed index", seriesKey: "metalIndex", color: "#e7edf3", foil: PLAT_FOIL, unit: "level" },
];

const fmtUsd = (n: number, d = 4) => `$${n.toFixed(d)}`;
const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
const cls = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

// ─────────────────────────── passcode gate ───────────────────────────
function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [v, setV] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07070a] font-mono text-neutral-300">
      <form
        onSubmit={(e) => { e.preventDefault(); if (v === PASSCODE) { localStorage.setItem(STORAGE_KEY, "1"); onUnlock(); } else setErr(true); }}
        className="w-80 rounded-lg border border-white/10 bg-[#0d0d11] p-6"
      >
        <div className="mb-1 text-xs uppercase tracking-[0.2em] text-neutral-500">hgMETAL terminal</div>
        <div className="mb-4 text-sm text-neutral-400">restricted · enter passcode</div>
        <input
          autoFocus value={v} onChange={(e) => { setV(e.target.value); setErr(false); }}
          type="password" placeholder="passcode"
          className={cls("w-full rounded border bg-black px-3 py-2 text-sm outline-none", err ? "border-red-500" : "border-neutral-700 focus:border-neutral-500")}
        />
        {err && <div className="mt-2 text-xs text-red-400">incorrect</div>}
        <button className="mt-4 w-full rounded bg-neutral-200 py-2 text-sm font-medium text-black hover:bg-white">unlock</button>
      </form>
    </div>
  );
}

// ─────────────────────────── chart ───────────────────────────
function PriceChart({ data, color }: { data: { time: string; value: number }[]; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#6b7280", fontFamily: "ui-monospace, monospace", fontSize: 11 },
      grid: { vertLines: { color: "#16161c" }, horzLines: { color: "#16161c" } },
      rightPriceScale: { borderColor: "#23232b" },
      timeScale: { borderColor: "#23232b", timeVisible: false },
      crosshair: { vertLine: { color: "#3f3f46", labelBackgroundColor: "#27272a" }, horzLine: { color: "#3f3f46", labelBackgroundColor: "#27272a" } },
      width: ref.current.clientWidth, height: ref.current.clientHeight,
    });
    chartRef.current = chart;
    const series = chart.addAreaSeries({ lineColor: color, topColor: color + "44", bottomColor: color + "05", lineWidth: 2, priceLineVisible: false });
    seriesRef.current = series;
    series.setData(data);
    chart.timeScale().fitContent();
    const ro = new ResizeObserver(() => { if (ref.current) chart.applyOptions({ width: ref.current.clientWidth, height: ref.current.clientHeight }); });
    ro.observe(ref.current);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; seriesRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.applyOptions({ lineColor: color, topColor: color + "44", bottomColor: color + "05" });
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();
    }
  }, [data, color]);

  return <div ref={ref} className="h-full w-full" />;
}

// ─────────────────────────── terminal ───────────────────────────
export function HgMetalTerminal() {
  const [unlocked, setUnlocked] = useState(false);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [hedged, setHedged] = useState<any>(null);
  const [index, setIndex] = useState<any>(null);
  const [sel, setSel] = useState<TickerKey>("hgMETAL");
  const [now, setNow] = useState("");

  useEffect(() => { setUnlocked(localStorage.getItem(STORAGE_KEY) === "1"); }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date().toUTCString().slice(17, 25) + " UTC"), 1000); return () => clearInterval(t); }, []);

  useEffect(() => { fetch("/replay_series.json").then((r) => r.json()).then((j) => setSeries(j.series ?? [])).catch(() => {}); }, []);
  const pull = useCallback(() => {
    fetch("/api/hgmetal-vault").then((r) => r.json()).then(setHedged).catch(() => {});
    fetch("/api/index-vault").then((r) => r.json()).then(setIndex).catch(() => {});
  }, []);
  useEffect(() => { if (!unlocked) return; pull(); const t = setInterval(pull, REFRESH_MS); return () => clearInterval(t); }, [unlocked, pull]);

  const chartData = useMemo(() => {
    const def = TICKERS.find((t) => t.key === sel)!;
    return series.map((p) => ({ time: p.date, value: Number(p[def.seriesKey]) }));
  }, [series, sel]);

  const quote = useCallback((key: TickerKey) => {
    const def = TICKERS.find((t) => t.key === key)!;
    const n = series.length;
    const last = n ? Number(series[n - 1][def.seriesKey]) : 0;
    const prev = n > 1 ? Number(series[n - 2][def.seriesKey]) : last;
    let px = last, chg = prev ? (last / prev - 1) * 100 : 0, apr = 0;
    if (key === "hgUSD") { px = hedged?.tickers?.hgUSD?.priceUsd ?? last; apr = hedged?.tickers?.hgUSD?.aprPct ?? series[n - 1]?.hgUsdApr ?? 5; }
    if (key === "hgYIELD") { px = hedged?.tickers?.hgYIELD?.priceUsd ?? last; apr = hedged?.tickers?.hgYIELD?.aprPct ?? series[n - 1]?.hgYieldApr ?? 0; }
    if (key === "hgMETAL") { px = index?.sharePriceUsd || last; chg = hedged?.tickers?.hgMETAL?.change24hPct ?? chg; apr = hedged?.tickers?.hgMETAL?.yieldPct ?? 3.5; }
    return { px, chg, apr, color: def.color, foil: def.foil, role: def.role, unit: def.unit };
  }, [series, hedged, index]);

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />;

  const selQ = quote(sel);
  const fleet = hedged?.fleet;

  return (
    <div
      className="flex min-h-screen flex-col font-mono text-[13px] text-neutral-300"
      style={{ backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.014) 0 1px,transparent 1px 3px), radial-gradient(120% 90% at 50% -10%,#16161d 0%,#0b0b0f 55%,#060608 100%)" }}
    >
      <header
        className="flex items-center justify-between border-b border-white/10 px-4 py-2"
        style={{ backgroundImage: PLATE, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-[0.12em]" style={foilStyle(GOLD_FOIL)}>hgMETAL</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">terminal · devnet</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-neutral-500">
          <span className={cls("flex items-center gap-1", hedged?.ok ? "text-emerald-400" : "text-amber-400")}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" /> {hedged?.ok ? "live" : "connecting"}
          </span>
          <span>{now}</span>
        </div>
      </header>

      <div className="flex border-b border-white/10">
        {TICKERS.map((t) => {
          const q = quote(t.key);
          const active = sel === t.key;
          return (
            <button key={t.key} onClick={() => setSel(t.key)}
              className={cls("flex-1 border-r border-white/5 px-4 py-2 text-left transition-colors", !active && "hover:bg-white/[0.02]")}
              style={active ? { backgroundImage: PLATE_ACTIVE, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -2px 0 0 ${q.color}` } : undefined}>
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-wide" style={foilStyle(q.foil)}>{t.key}</span>
                <span className={cls("text-xs", q.chg >= 0 ? "text-emerald-400" : "text-red-400")}>{fmtPct(q.chg)}</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between text-xs text-neutral-400">
                <span>{q.unit === "usd" ? fmtUsd(q.px) : q.px.toFixed(2)}</span>
                <span className="text-neutral-600">{t.role.split(" · ")[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-1 flex-col border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex items-baseline justify-between px-4 py-2">
            <div>
              <span className="text-base font-bold tracking-wide" style={foilStyle(selQ.foil)}>{sel}</span>
              <span className="ml-2 text-[11px] uppercase tracking-wider text-neutral-500">{selQ.role}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-semibold tracking-wide" style={foilStyle(selQ.foil)}>{selQ.unit === "usd" ? fmtUsd(selQ.px) : selQ.px.toFixed(2)}</span>
              <span className={cls("text-sm", selQ.chg >= 0 ? "text-emerald-400" : "text-red-400")}>{fmtPct(selQ.chg)}</span>
            </div>
          </div>
          <div className="min-h-[300px] flex-1 px-2 pb-2">
            {chartData.length ? <PriceChart data={chartData} color={selQ.color} /> : <div className="flex h-full items-center justify-center text-neutral-600">loading series…</div>}
          </div>
          <div className="border-t border-white/10 px-4 py-1.5 text-[11px] text-neutral-500">
            {series.length}d history · {sel === "hgMETAL" ? "base-100 metal index" : "share NAV"} · live overlay {REFRESH_MS / 1000}s
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-[360px]" style={{ backgroundImage: PLATE, boxShadow: "inset 1px 0 0 rgba(255,255,255,0.05)" }}>
          <DetailPanel sel={sel} q={selQ} hedged={hedged} index={index} />
        </aside>
      </div>

      <footer className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 text-[11px] md:grid-cols-4">
        <Cell label="researcher · carry" value={fleet ? `${(fleet.researcher.carryPct ?? 0).toFixed(1)}%` : "—"} tone={fleet?.researcher?.signal === "negative" ? "bad" : fleet?.researcher?.signal === "thin" ? "warn" : "good"} sub={fleet?.researcher?.signal} />
        <Cell label="riskwatcher · liq buffer" value={fleet ? `${fleet.riskwatcher.liqBufferPct}%` : "—"} tone={fleet?.riskwatcher?.ok ? "good" : "bad"} sub={`${fleet?.riskwatcher?.leverage ?? "—"}x`} />
        <Cell label="treasury · senior cover" value={fleet ? `${fleet.treasury.coverageX}x` : "—"} tone={fleet?.treasury?.seniorCoverable ? "good" : "warn"} sub={`jr ${fleet?.treasury?.juniorAprPct ?? "—"}%`} />
        <Cell label="orchestrator" value={fleet ? fleet.decision.split(" — ")[0] : "—"} tone={fleet?.decision?.startsWith("MAINTAIN") ? "good" : fleet?.decision?.startsWith("HOLD") ? "bad" : "warn"} sub={fleet?.decision?.split(" — ")[1]} />
      </footer>
    </div>
  );
}

function Cell({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone: "good" | "warn" | "bad" }) {
  const c = tone === "good" ? "text-emerald-400" : tone === "warn" ? "text-amber-400" : "text-red-400";
  return (
    <div className="px-4 py-2" style={{ backgroundImage: PLATE, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="text-[10px] uppercase tracking-wider text-neutral-600">{label}</div>
      <div className={cls("text-sm", c)}>{value}</div>
      {sub && <div className="truncate text-[10px] text-neutral-500">{sub}</div>}
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-1.5">
      <span className="text-neutral-500">{k}</span>
      <span className={accent ?? "text-neutral-200"}>{v}</span>
    </div>
  );
}

function DetailPanel({ sel, q, hedged, index }: { sel: TickerKey; q: any; hedged: any; index: any }) {
  return (
    <div className="px-4 py-3">
      <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">{sel} · detail</div>
      {sel === "hgUSD" && (
        <div>
          <Row k="share price" v={fmtUsd(q.px)} accent="text-emerald-400" />
          <Row k="coupon (target APR)" v={`${q.apr.toFixed(1)}%`} />
          <Row k="tranche NAV" v={hedged ? fmtUsd(hedged.nav.senior, 2) : "—"} />
          <Row k="supply" v={hedged ? hedged.nav.seniorSupply.toLocaleString() : "—"} />
          <Row k="loss waterfall" v="last to lose" accent="text-emerald-400" />
          <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">Senior tranche of the hedged metals-carry book. Stable coupon, paid first; the junior absorbs losses before it.</p>
        </div>
      )}
      {sel === "hgYIELD" && (
        <div>
          <Row k="share price" v={fmtUsd(q.px)} accent="text-amber-400" />
          <Row k="realized APR" v={`${q.apr.toFixed(1)}%`} accent={q.apr >= 0 ? "text-amber-400" : "text-red-400"} />
          <Row k="tranche NAV" v={hedged ? fmtUsd(hedged.nav.junior, 2) : "—"} />
          <Row k="supply" v={hedged ? hedged.nav.juniorSupply.toLocaleString() : "—"} />
          <Row k="loss waterfall" v="first loss" accent="text-amber-400" />
          <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">Junior tranche · levered residual of the carry. Absorbs NAV and APR variance first; higher target return for the risk.</p>
        </div>
      )}
      {sel === "hgMETAL" && (
        <div>
          <Row k="share price (off-chain NAV)" v={index ? fmtUsd(index.sharePriceUsd) : "—"} accent="text-sky-400" />
          <Row k="index NAV" v={index ? fmtUsd(index.navUsd, 2) : "—"} />
          <Row k="supply" v={index ? `${index.supply} hgMETAL` : "—"} />
          <Row k="24h" v={fmtPct(q.chg)} accent={q.chg >= 0 ? "text-emerald-400" : "text-red-400"} />
          {index?.anyStale && <div className="py-1 text-[11px] text-amber-400">⚠ prices weekend-stale (display only)</div>}
          <div className="mt-3 mb-1 text-[10px] uppercase tracking-wider text-neutral-600">basket · current vs rebalancer target</div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 text-[11px]">
            <span className="text-neutral-600">metal</span><span className="text-right text-neutral-600">now</span><span className="text-right text-neutral-600">target</span>
            {(index?.legs ?? []).map((l: any) => {
              const drift = l.weightPct - l.targetPct;
              return (
                <div key={l.sym} className="contents">
                  <span className="border-t border-white/5 py-1 font-medium" style={{ color: METAL_TINT[l.name] ?? "#d4d4d8" }}>{l.name}</span>
                  <span className="border-t border-white/5 py-1 text-right text-neutral-200">{l.weightPct.toFixed(1)}%</span>
                  <span className={cls("border-t border-white/5 py-1 text-right", Math.abs(drift) > 3 ? "text-amber-400" : "text-neutral-400")}>{l.targetPct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
          {index && <div className="mt-2 text-[11px] text-neutral-500">max drift {index.maxDriftBps?.toFixed(0)} bps · fleet posts smart-beta targets on-chain</div>}
          <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">Managed metals index · oracle-free in-kind. Weights are risk-weighted (inverse-vol) with a gold/silver tilt, rebalanced by the autonomous fleet.</p>
        </div>
      )}
    </div>
  );
}
