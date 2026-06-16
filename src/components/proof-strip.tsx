"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

// hgMETAL-forward proof. The fleet is one credibility item (the proven engine),
// not the headline.
const STATS = [
  { label: "hgMETAL net carry", value: "~5-8%", sub: "venue-verified · recent realized", gold: true },
  { label: "Three-token product", value: "live on devnet", sub: "hgUSD · hgYIELD · hgMETAL · real Pyth" },
  { label: "Proven engine", value: "live on mainnet", sub: "the autonomous fleet · real capital" },
  { label: "Strategies auditable", value: "open source", sub: "github.com/Hedgents" },
  { label: "Status (honest)", value: "devnet + paper hedge", sub: "live capital is the next milestone" },
];

export function ProofStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="border-y border-border/40 bg-muted/20"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {STATS.map((c) => (
            <div key={c.label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                {c.label}
              </span>
              <span className="font-serif text-xl font-bold" style={c.gold ? { color: "var(--gold)" } : undefined}>
                {c.value}
              </span>
              <span className="text-[11px] text-muted-foreground/50">{c.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
