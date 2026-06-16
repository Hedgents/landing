"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HgMetalReplay } from "@/components/hgmetal-replay";

// Standalone hgMETAL fleet dashboard (full-screen, its own surface — not a
// landing-page widget). Polls the vault API and renders the vault, the
// three tickers, and the fleet role view (researcher / riskwatcher /
// treasury / orchestrator). Gated by passcode. Devnet, paper hedge.

const PASSCODE = "GOlD";
const KEY = "hgmetal-dash-unlocked";
const REFRESH_MS = 8000;

const GOLD = "#C9A84C", STEEL = "#7BA3C8", GREEN = "#86efac", RED = "#f0a39a";
const DIM = "rgba(255,255,255,0.45)";
const NAVY = "var(--navy)";
const money = (n: number, dp = 2) => "$" + (n ?? 0).toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

interface Data {
  ok: boolean; fetchedAt: number; vault: string; program: string;
  metals: { sym: string; name: string; weightPct: number; balance: number; priceUsd: number; valueUsd: number; live: boolean }[];
  basketLiveValue: number; usdcReserve: number; basketCarryPct: number;
  tickers: {
    hgUSD: { priceUsd: number; aprPct: number };
    hgYIELD: { priceUsd: number; aprPct: number };
    hgMETAL: { change24hPct: number; yieldPct: number };
  };
  fleet: {
    researcher: { carryPct: number; signal: string };
    riskwatcher: { leverage: number; liqBufferPct: number; ok: boolean };
    treasury: { coverageX: number; seniorCoverable: boolean; juniorAprPct: number };
    decision: string;
  };
  nav: { total: number; senior: number; junior: number; unallocated: number; seniorSupply: number; juniorSupply: number; seniorPx: number; juniorPx: number };
}

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-black/20 p-4 ${className}`}>
      <div style={{ color: DIM }} className="font-mono text-[11px] uppercase tracking-wider mb-3">{title}</div>
      {children}
    </div>
  );
}
function Row({ k, v, color }: { k: string; v: string; color?: string }) {
  return (
    <div className="flex justify-between py-1 font-mono text-xs sm:text-sm">
      <span style={{ color: DIM }}>{k}</span>
      <span style={{ color: color ?? "#fff" }}>{v}</span>
    </div>
  );
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [v, setV] = useState(""); const [err, setErr] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: NAVY }}>
      <form
        onSubmit={(e) => { e.preventDefault(); if (v === PASSCODE) { try { sessionStorage.setItem(KEY, "1"); } catch {} onUnlock(); } else { setErr(true); setV(""); } }}
        className="flex flex-col items-center gap-3 font-mono"
      >
        <span style={{ color: GOLD }} className="font-bold">hg<span className="text-white">METAL</span> dashboard</span>
        <input autoFocus type="password" value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} placeholder="passcode"
          className="rounded border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-white/50" />
        {err && <span className="text-xs" style={{ color: RED }}>incorrect</span>}
      </form>
    </div>
  );
}

function Dash() {
  const [d, setD] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);
  const prev = useRef<Record<string, number>>({});

  const poll = useCallback(async () => {
    try {
      const r = await fetch("/api/hgmetal-vault", { cache: "no-store" });
      const j = (await r.json()) as Data;
      if (!j.ok) throw new Error();
      setD((cur) => { if (cur) prev.current = Object.fromEntries(cur.metals.map((m) => [m.sym, m.priceUsd])); return j; });
      setErr(""); setTick((t) => t + 1);
    } catch { setErr("connection lost, retrying"); }
  }, []);
  useEffect(() => { poll(); const id = setInterval(poll, REFRESH_MS); return () => clearInterval(id); }, [poll]);

  if (!d) return <div className="fixed inset-0 flex items-center justify-center font-mono text-sm" style={{ background: NAVY, color: DIM }}>{err || "connecting to devnet…"}</div>;

  const f = d.fleet, t = d.tickers, nav = d.nav;
  const sigColor = f.researcher.signal === "negative" ? RED : f.researcher.signal === "thin" ? GOLD : GREEN;
  const decColor = f.decision.startsWith("MAINTAIN") ? GREEN : f.decision.startsWith("HOLD") ? GOLD : RED;

  return (
    <div className="fixed inset-0 z-50 overflow-auto" style={{ background: NAVY, color: "rgba(255,255,255,0.85)" }}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <span style={{ color: GOLD }} className="font-mono font-bold text-lg">hg<span className="text-white">METAL</span></span>
            <span style={{ color: DIM }} className="font-mono text-xs ml-2">fleet dashboard · devnet · paper hedge</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://terminal.hedgents.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded px-2 py-1 font-mono text-[11px] font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              buy / sell live on devnet →
            </a>
            <span style={{ color: DIM }} className="font-mono text-xs">
              <span style={{ color: GREEN }}>●</span> live · {new Date(d.fetchedAt).toISOString().slice(11, 19)} · #{tick} · vault {d.vault.slice(0, 6)}…{d.vault.slice(-4)}
            </span>
          </div>
        </div>

        {/* tickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div style={{ color: GOLD }} className="font-mono font-bold">hgMETAL</div>
            <div className="text-white font-mono text-xl mt-1">{t.hgMETAL.change24hPct >= 0 ? "+" : ""}{t.hgMETAL.change24hPct.toFixed(2)}% <span className="text-xs" style={{ color: DIM }}>24h idx</span></div>
            <div style={{ color: DIM }} className="font-mono text-xs mt-1">in-kind metals index · no yield overlay</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div style={{ color: STEEL }} className="font-mono font-bold">hgUSD</div>
            <div className="text-white font-mono text-xl mt-1">{money(t.hgUSD.priceUsd, 4)}</div>
            <div style={{ color: DIM }} className="font-mono text-xs mt-1">{t.hgUSD.aprPct.toFixed(1)}% APR · senior · stable floor</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div style={{ color: GREEN }} className="font-mono font-bold">hgYIELD</div>
            <div className="text-white font-mono text-xl mt-1">{money(t.hgYIELD.priceUsd, 4)}</div>
            <div style={{ color: DIM }} className="font-mono text-xs mt-1">{t.hgYIELD.aprPct >= 0 ? "+" : ""}{t.hgYIELD.aprPct.toFixed(1)}% APR · junior · first-loss NAV</div>
          </div>
        </div>

        {/* nav + fleet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Panel title="vault NAV">
            <Row k="total NAV" v={money(nav.total)} />
            <Row k="senior (hgUSD)" v={`${money(nav.senior)}  ·  ${money(nav.seniorPx, 4)}/sh`} color={STEEL} />
            <Row k="junior (hgYIELD)" v={`${money(nav.junior)}  ·  ${money(nav.juniorPx, 4)}/sh`} color={GREEN} />
            <Row k="unallocated" v={money(nav.unallocated)} />
            <Row k="basket (live)" v={money(d.basketLiveValue)} />
            <Row k="usdc reserve" v={money(d.usdcReserve)} />
          </Panel>
          <Panel title="fleet">
            <Row k="researcher · carry" v={`${f.researcher.carryPct >= 0 ? "+" : ""}${f.researcher.carryPct.toFixed(1)}%  (${f.researcher.signal})`} color={sigColor} />
            <Row k="riskwatcher" v={`${f.riskwatcher.leverage}x · ${f.riskwatcher.liqBufferPct.toFixed(0)}% buffer · ${f.riskwatcher.ok ? "ok" : "de-risk"}`} color={f.riskwatcher.ok ? GREEN : RED} />
            <Row k="treasury" v={`coverage ${f.treasury.coverageX.toFixed(1)}x · junior ~${f.treasury.juniorAprPct.toFixed(0)}%`} />
            <div className="mt-2 pt-2 border-t border-white/10">
              <div style={{ color: DIM }} className="font-mono text-[11px] mb-1">orchestrator decision</div>
              <div style={{ color: decColor }} className="font-mono text-sm">{f.decision}</div>
            </div>
          </Panel>
        </div>

        {/* downside — loss waterfall on the CURRENT NAV */}
        <Panel title="downside · if the book takes a loss (first-loss waterfall)" className="mb-3">
          <div className="grid grid-cols-[5rem_1fr_1fr_1fr] gap-2 font-mono text-[11px]" style={{ color: DIM }}>
            <span>book loss</span><span>hgUSD /sh</span><span>hgYIELD /sh</span><span>who absorbs</span>
          </div>
          {[0, 5, 10, 20, 30, 50].map((pct) => {
            const total = nav.total * (1 - pct / 100);
            const senior = Math.min(total, nav.senior);       // senior protected until exhausted
            const junior = Math.max(0, total - senior);
            const sPx = nav.seniorSupply ? senior / nav.seniorSupply : 1;
            const jPx = nav.juniorSupply ? junior / nav.juniorSupply : 1;
            const wiped = junior <= 0.0001 && nav.junior > 0;
            const who = pct === 0 ? "—" : junior > 0 ? "junior only" : wiped && senior >= nav.senior ? "junior WIPED" : "junior wiped + SENIOR hit";
            return (
              <div key={pct} className="grid grid-cols-[5rem_1fr_1fr_1fr] gap-2 font-mono text-xs py-0.5">
                <span style={{ color: pct === 0 ? DIM : RED }}>{pct === 0 ? "none" : `-${pct}%`}</span>
                <span style={{ color: senior < nav.senior ? RED : STEEL }}>{money(sPx, 4)}</span>
                <span style={{ color: junior < nav.junior ? RED : GREEN }}>{money(jPx, 4)}</span>
                <span style={{ color: DIM }} className="text-[11px]">{who}</span>
              </div>
            );
          })}
          <p style={{ color: DIM }} className="text-[11px] mt-2 leading-relaxed">
            hgYIELD absorbs losses first, its NAV falls to $0 before hgUSD loses a cent.
            hgUSD stays whole until junior is fully wiped (here, ~a {((nav.junior / nav.total) * 100).toFixed(0)}% book loss),
            then takes only the overflow. That protection is what hgYIELD is paid the higher APR for.
          </p>
        </Panel>

        {/* metals */}
        <Panel title="basket" className="mb-3">
          <div className="grid grid-cols-[3rem_6rem_3rem_5rem_1fr] gap-2 font-mono text-[11px]" style={{ color: DIM }}>
            <span>METAL</span><span>PRICE</span><span>WT</span><span>BAL</span><span className="text-right">VALUE</span>
          </div>
          {d.metals.map((m) => {
            const dlt = m.priceUsd - (prev.current[m.sym] ?? m.priceUsd);
            return (
              <div key={m.sym} className="grid grid-cols-[3rem_6rem_3rem_5rem_1fr] gap-2 font-mono text-xs py-0.5">
                <span className="text-white">{m.sym}</span>
                <span style={{ color: Math.abs(dlt) < 0.005 ? "#fff" : dlt > 0 ? GREEN : RED }}>{money(m.priceUsd)}</span>
                <span style={{ color: DIM }}>{m.weightPct}%</span>
                <span style={{ color: DIM }}>{m.balance.toFixed(2)}</span>
                <span className="text-right text-white">{money(m.valueUsd)}</span>
              </div>
            );
          })}
        </Panel>

        {/* replay */}
        <HgMetalReplay />

        <p style={{ color: DIM }} className="font-mono text-[11px] mt-4 leading-relaxed">
          Devnet vault driven by the hgMETAL fleet (researcher / riskwatcher / treasury / orchestrator / executor).
          Funding is live from Hyperliquid; the hedge is a paper short on devnet (real CCTP→Hyperliquid short on mainnet).
          hgUSD and hgYIELD are USD NAV tranches; hgMETAL is the metals price index. Not a live-capital track record.
        </p>
      </div>
    </div>
  );
}

export function HgMetalDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => { try { if (sessionStorage.getItem(KEY) === "1") setUnlocked(true); } catch {} }, []);
  return unlocked ? <Dash /> : <Gate onUnlock={() => setUnlocked(true)} />;
}
