"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedPercent } from "@/components/animated-number";
import { useLiveRates } from "@/hooks/useLiveRates";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const INSTITUTIONAL = [
  { label: "EFFR",  issuer: "US Federal Reserve",    apy: 4.33, note: "risk-free baseline",   custodian: "N/A" },
  { label: "BUIDL", issuer: "BlackRock / Securitize", apy: 4.30, note: "$5M min · on Solana",  custodian: "BNY Mellon" },
  { label: "FOBXX", issuer: "Franklin Templeton",     apy: 4.25, note: "SEC fund · on Solana", custodian: "Franklin" },
  { label: "USYC",  issuer: "Circle / Hashnote",      apy: 4.00, note: "inst. KYC · on Solana",custodian: "Hashnote" },
];

const MAX_APY = 14;

function Bar({ apy, highlight, delay }: { apy: number; highlight: boolean; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const pct = Math.min((apy / MAX_APY) * 100, 100);
  return (
    <div ref={ref} className="h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${highlight ? "bg-[#C9A84C]" : "bg-foreground/25"}`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.65, delay, ease }}
      />
    </div>
  );
}

export function Benchmarks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { rates, live } = useLiveRates();

  const hedgents = [
    { label: "Stable Yield",    sublabel: "Kamino USDC supply",          apy: rates.stableYieldAprPct, risk: "Low",     highlight: false },
    { label: "Portfolio Blend", sublabel: "Equal-weight · three strats", apy: rates.portfolioAprPct,   risk: "Low–Med", highlight: true  },
    { label: "ONyc",            sublabel: "Leveraged tokenized reinsurance NAV", apy: rates.onycAprPct,        risk: "Medium",  highlight: false },
    { label: "Hedged JLP",      sublabel: "Delta-neutral Jupiter LP",     apy: rates.hedgedjlpAprPct,  risk: "Low–Med", highlight: false },
  ];

  return (
    <section
      id="benchmarks"
      className="relative min-h-screen snap-start scroll-mt-12 border-t border-border/40 flex flex-col justify-center"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full py-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
                05 / Benchmarks
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                What institutions earn on-chain today.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                BlackRock, Franklin Templeton, and Circle all yield ~4% on Solana, and all require custody transfer.
              </p>
            </div>

            {/* Portfolio callout */}
            <div
              className="shrink-0 rounded-lg border px-5 py-3 text-right"
              style={{
                borderColor: "color-mix(in oklch, var(--gold) 40%, transparent)",
                backgroundColor: "color-mix(in oklch, var(--gold) 6%, transparent)",
              }}
            >
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
                  Hedgents portfolio · current rates
                </span>
                {live && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold tabular-nums" style={{ color: "var(--gold)" }}>
                <AnimatedPercent value={rates.portfolioAprPct} active={inView} />
              </div>
              <div className="text-[10px] opacity-50 mt-0.5">
                {live ? "live · mainnet rates" : "1.5–2× the institutional floor"}
              </div>
            </div>
          </div>

          {/* Two-column comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Left — institutional */}
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest opacity-40">
                Institutional on-chain yield
              </div>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                {INSTITUTIONAL.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.05 + i * 0.07, ease }}
                    className={`grid grid-cols-[5rem_1fr_4rem] gap-3 items-center px-4 py-3 ${
                      i < INSTITUTIONAL.length - 1 ? "border-b border-border/30" : ""
                    }`}
                  >
                    <div>
                      <div className="font-mono text-sm font-semibold">{row.label}</div>
                      <div className="text-[10px] opacity-45 leading-tight">{row.issuer}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Bar apy={row.apy} highlight={false} delay={0.1 + i * 0.07} />
                      <div className="text-[10px] opacity-35">{row.note}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold tabular-nums text-sm opacity-60">
                        <AnimatedPercent value={row.apy} active={inView} />
                      </div>
                      <div className="text-[9px] opacity-35">{row.custodian}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — Hedgents (live) */}
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest opacity-40 flex items-center gap-2">
                Hedgents · your keys · your hardware
                {live && (
                  <span className="text-emerald-500 normal-case tracking-normal font-sans" style={{ fontSize: "9px" }}>
                    · live mainnet rates
                  </span>
                )}
              </div>
              <div
                className="rounded-lg overflow-hidden border"
                style={{ borderColor: "color-mix(in oklch, var(--gold) 30%, transparent)" }}
              >
                {hedgents.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease }}
                    className={`grid grid-cols-[1fr_4.5rem] gap-3 items-center px-4 py-3 ${
                      i < hedgents.length - 1 ? "border-b" : ""
                    } ${row.highlight ? "bg-[#C9A84C]/6" : ""}`}
                    style={
                      i < hedgents.length - 1
                        ? { borderColor: "color-mix(in oklch, var(--gold) 15%, transparent)" }
                        : {}
                    }
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="font-semibold text-sm"
                          style={row.highlight ? { color: "var(--gold)" } : {}}
                        >
                          {row.label}
                        </span>
                        <span className="text-[10px] opacity-45">{row.sublabel}</span>
                        <span className="ml-auto text-[9px] opacity-50 font-mono">{row.risk}</span>
                      </div>
                      <Bar apy={row.apy} highlight={row.highlight} delay={0.15 + i * 0.07} />
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className="text-lg font-bold tabular-nums"
                        style={row.highlight ? { color: "var(--gold)" } : {}}
                      >
                        <AnimatedPercent value={row.apy} active={inView} />
                      </div>
                      <div className="text-[9px] opacity-35">APR</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-5 text-[10px] opacity-25">
            Institutional rates: securitize.io · franklintempleton.com · circle.com/usyc, June 2026.
            Hedgents: {live ? "fetched live from Kamino API, Solana RPC, and DeFiLlama." : "rates from Kamino API, Solana RPC, and DeFiLlama (loading…)."}
            {" "}Past performance of paper trading does not guarantee live deployment returns.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
