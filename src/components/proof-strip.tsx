"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedPercent } from "@/components/animated-number";
import { useLiveRates } from "@/hooks/useLiveRates";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const CREDENTIALS = [
  {
    label: "Live paper soak",
    value: "7h+ running",
    sub: "uninterrupted on mainnet",
  },
  {
    label: "vs. BUIDL / FOBXX / USYC",
    value: "1.5–2× yield",
    sub: "same Solana infrastructure",
  },
  {
    label: "Strategies auditable",
    value: "open source",
    sub: "github.com/Hedgents/fleet",
  },
  {
    label: "Custody model",
    value: "zero transfer",
    sub: "keys never leave your machines",
  },
];

export function ProofStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { rates, live } = useLiveRates();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="border-y border-border/40 bg-muted/20"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Live APY — pulls from actual rates */}
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              Current blended APY
            </span>
            <span className="font-serif text-xl font-bold" style={{ color: "var(--gold)" }}>
              <AnimatedPercent value={rates.portfolioAprPct} active={inView} />
              {live && (
                <span className="inline-flex items-center ml-2 align-middle">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                </span>
              )}
            </span>
            <span className="text-[11px] text-muted-foreground/50">
              at current market rates · equal-weight
            </span>
          </div>

          {CREDENTIALS.map((c) => (
            <div key={c.label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                {c.label}
              </span>
              <span className="font-serif text-xl font-bold text-foreground">
                {c.value}
              </span>
              <span className="text-[11px] text-muted-foreground/50">
                {c.sub}
              </span>
            </div>
          ))}

        </div>
      </div>
    </motion.div>
  );
}
