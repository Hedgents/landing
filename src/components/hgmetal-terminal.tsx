"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const PASSCODE = "GOlD";
const STORAGE_KEY = "hgmetal-terminal-unlocked";
const REFRESH_MS = 6000;

interface Metal {
  sym: string;
  name: string;
  weightPct: number;
  balance: number;
  priceUsd: number;
  cachedPriceUsd: number;
  valueUsd: number;
  live: boolean;
}
interface VaultData {
  ok: boolean;
  fetchedAt: number;
  vault: string;
  program: string;
  metals: Metal[];
  basketLiveValue: number;
  usdcReserve: number;
  nav: {
    total: number;
    senior: number;
    junior: number;
    unallocated: number;
    seniorSupply: number;
    juniorSupply: number;
    seniorPx: number;
    juniorPx: number;
  };
}

const GOLD = "#C9A84C";
const STEEL = "#7BA3C8";
const GREEN = "#86efac";
const RED = "#f0a39a";
const DIM = "rgba(255,255,255,0.4)";

function money(n: number, dp = 2): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

function Delta({ d }: { d: number }) {
  if (Math.abs(d) < 0.005) return <span style={{ color: DIM }}>▬ 0.00</span>;
  const up = d > 0;
  return (
    <span style={{ color: up ? GREEN : RED }}>
      {up ? "▲" : "▼"} {up ? "+" : ""}
      {d.toFixed(2)}
    </span>
  );
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val === PASSCODE) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      onUnlock();
    } else {
      setErr(true);
      setVal("");
    }
  };
  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-border/60 bg-background p-8 flex flex-col items-center gap-4 font-mono"
    >
      <p className="text-sm text-muted-foreground">
        Live devnet terminal. Enter passcode to view.
      </p>
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="password"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setErr(false);
          }}
          placeholder="passcode"
          className="rounded border border-border/60 bg-foreground/[0.03] px-3 py-1.5 text-sm font-mono outline-none focus:border-foreground/40"
        />
        <button
          type="submit"
          className="rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: GOLD, color: "var(--navy)" }}
        >
          unlock →
        </button>
      </div>
      {err && <p className="text-xs" style={{ color: RED }}>incorrect passcode</p>}
    </form>
  );
}

function Terminal() {
  const [data, setData] = useState<VaultData | null>(null);
  const [err, setErr] = useState<string>("");
  const [tick, setTick] = useState(0);
  const prevPrices = useRef<Record<string, number>>({});
  const prevTotal = useRef<number | null>(null);

  const poll = useCallback(async () => {
    try {
      const r = await fetch("/api/hgmetal-vault", { cache: "no-store" });
      const j = (await r.json()) as VaultData;
      if (!j.ok) throw new Error("vault read failed");
      setData((cur) => {
        if (cur) {
          prevPrices.current = Object.fromEntries(cur.metals.map((m) => [m.sym, m.priceUsd]));
          prevTotal.current = cur.nav.total;
        }
        return j;
      });
      setErr("");
      setTick((t) => t + 1);
    } catch {
      setErr("connection lost, retrying");
    }
  }, []);

  useEffect(() => {
    poll();
    const id = setInterval(poll, REFRESH_MS);
    return () => clearInterval(id);
  }, [poll]);

  if (!data) {
    return (
      <div className="rounded-lg border border-border/60 bg-[var(--navy)] p-6 font-mono text-sm" style={{ color: DIM }}>
        {err || "connecting to devnet…"}
      </div>
    );
  }

  const navDelta = prevTotal.current === null ? 0 : data.nav.total - prevTotal.current;
  const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-[3rem_7rem_6rem_3rem_6rem_1fr] gap-2 items-center py-0.5">{children}</div>
  );

  return (
    <div
      className="rounded-lg border border-white/10 bg-[var(--navy)] p-5 sm:p-6 font-mono text-xs sm:text-[13px] overflow-x-auto"
      style={{ color: "rgba(255,255,255,0.82)" }}
    >
      {/* header */}
      <div className="flex items-center justify-between mb-3 whitespace-nowrap">
        <span style={{ color: GOLD }} className="font-bold">
          hg<span className="text-white">METAL</span> · devnet vault
        </span>
        <span style={{ color: DIM }}>
          <span style={{ color: GREEN }}>●</span> live · {new Date(data.fetchedAt).toISOString().slice(11, 19)} · #{tick}
        </span>
      </div>
      <div style={{ color: DIM }} className="mb-3 truncate">
        vault {data.vault.slice(0, 6)}…{data.vault.slice(-4)} · program {data.program.slice(0, 6)}…{data.program.slice(-4)}
      </div>
      <div className="border-t border-white/10 my-2" />

      {/* metals */}
      <Row>
        <span style={{ color: DIM }}>METAL</span>
        <span style={{ color: DIM }}>PRICE</span>
        <span style={{ color: DIM }}>Δ</span>
        <span style={{ color: DIM }}>WT</span>
        <span style={{ color: DIM }}>BAL</span>
        <span style={{ color: DIM }} className="text-right">VALUE</span>
      </Row>
      {data.metals.map((m) => {
        const d = m.priceUsd - (prevPrices.current[m.sym] ?? m.priceUsd);
        return (
          <Row key={m.sym}>
            <span className="text-white">{m.sym}</span>
            <span>{money(m.priceUsd)}</span>
            <Delta d={d} />
            <span style={{ color: DIM }}>{m.weightPct}%</span>
            <span style={{ color: DIM }}>{m.balance.toFixed(2)}</span>
            <span className="text-right text-white">{money(m.valueUsd)}</span>
          </Row>
        );
      })}

      <div className="border-t border-white/10 my-2" />
      <div className="flex justify-between py-0.5">
        <span style={{ color: DIM }}>basket (live marks)</span>
        <span className="text-white">{money(data.basketLiveValue)}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span style={{ color: DIM }}>usdc reserve</span>
        <span className="text-white">{money(data.usdcReserve)}</span>
      </div>

      <div className="border-t border-white/10 my-2" />
      {/* tranches */}
      <div className="grid grid-cols-[8rem_1fr_6rem] gap-2 py-0.5" style={{ color: DIM }}>
        <span>TRANCHE</span>
        <span>NAV</span>
        <span className="text-right">SHARE PX</span>
      </div>
      <div className="grid grid-cols-[8rem_1fr_6rem] gap-2 py-0.5">
        <span style={{ color: STEEL }}>hgUSD · senior</span>
        <span className="text-white">{money(data.nav.senior)}</span>
        <span className="text-right" style={{ color: DIM }}>{data.nav.seniorPx.toFixed(4)}</span>
      </div>
      <div className="grid grid-cols-[8rem_1fr_6rem] gap-2 py-0.5">
        <span style={{ color: GOLD }}>hgYIELD · junior</span>
        <span className="text-white">{money(data.nav.junior)}</span>
        <span className="text-right" style={{ color: DIM }}>{data.nav.juniorPx.toFixed(2)}</span>
      </div>
      <div className="grid grid-cols-[8rem_1fr_6rem] gap-2 py-0.5">
        <span style={{ color: DIM }}>unallocated</span>
        <span style={{ color: DIM }}>{money(data.nav.unallocated)}</span>
        <span />
      </div>

      <div className="border-t border-white/10 my-2" />
      <div className="flex justify-between items-center py-0.5">
        <span className="text-white font-bold">TOTAL NAV (on-chain)</span>
        <span className="text-white font-bold">
          {money(data.nav.total)} <Delta d={navDelta} />
        </span>
      </div>
      <p style={{ color: DIM }} className="mt-3 text-[11px] leading-relaxed">
        Prices stream live from Pyth. The on-chain NAV is the vault&apos;s last cached
        value; it advances when the keeper writes an update. Basket tokens are devnet
        mocks priced at real feeds. Public devnet data.
      </p>
      {err && <p style={{ color: RED }} className="mt-1 text-[11px]">{err}</p>}
    </div>
  );
}

export function HgMetalTerminal() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {}
  }, []);
  return unlocked ? <Terminal /> : <Gate onUnlock={() => setUnlocked(true)} />;
}
