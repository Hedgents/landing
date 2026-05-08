"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const DAEMONS = [
  {
    name: "multiply-daemon",
    role: "Leveraged Staking Trader",
    strategy: "Kamino LST farming with leverage",
    status: "mainnet-ready",
    signs: true,
  },
  {
    name: "stable-yield-daemon",
    role: "Passive Lender",
    strategy: "Kamino USDC supply",
    status: "mainnet-ready",
    signs: true,
  },
  {
    name: "hedgedjlp-daemon",
    role: "Delta-Neutral Basis Trader",
    strategy: "Long JLP, short SOL / ETH / BTC perps",
    status: "sim-only",
    signs: true,
  },
  {
    name: "riskwatcher-daemon",
    role: "Risk Officer",
    strategy: "Observes positions, emits soft-veto Escalates",
    status: "active",
    signs: false,
  },
  {
    name: "researcher-daemon",
    role: "Signal Publisher",
    strategy: "Kamino rates · Pyth prices · JLP yield · peg drift",
    status: "active",
    signs: false,
  },
];

export function Fleet() {
  return (
    <section id="fleet" className="relative min-h-screen snap-start scroll-mt-12 border-t border-border/40 flex flex-col justify-center">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl mb-14"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            03 / Fleet
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Five daemons. Five roles.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Each daemon is a Rust binary with one cryptographic identity and one role.
            Three sign transactions. Two are compile-time isolated — they cannot sign, ever.
          </p>
        </motion.div>

        {/* Fleet table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="border border-border/50 rounded overflow-hidden bg-card"
        >
          {/* Table header */}
          <div className="grid grid-cols-[2.2fr_1.6fr_2fr_auto] gap-4 px-5 py-3 border-b border-border/40 bg-muted/40">
            {["Daemon", "Role", "Strategy", "Auth"].map((h) => (
              <span key={h} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {DAEMONS.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 * i, ease }}
              className="grid grid-cols-[2.2fr_1.6fr_2fr_auto] gap-4 items-center px-5 py-4 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
            >
              {/* Daemon name + status dot */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      d.status === "mainnet-ready"
                        ? "var(--gold)"
                        : d.status === "sim-only"
                        ? "oklch(0.78 0.18 70)"
                        : "oklch(0.60 0.06 262)",
                  }}
                />
                <code className="font-mono text-sm text-foreground/90 truncate">{d.name}</code>
              </div>

              {/* Role */}
              <span className="text-sm text-muted-foreground">{d.role}</span>

              {/* Strategy */}
              <span className="text-xs text-muted-foreground/70 font-mono leading-relaxed">
                {d.strategy}
              </span>

              {/* Auth badge */}
              <span
                className="font-mono text-[10px] px-2 py-0.5 rounded border whitespace-nowrap"
                style={
                  d.signs
                    ? {
                        borderColor: "color-mix(in oklch, var(--gold) 40%, transparent)",
                        color: "var(--gold)",
                        backgroundColor: "color-mix(in oklch, var(--gold) 8%, transparent)",
                      }
                    : {
                        borderColor: "var(--border)",
                        color: "var(--muted-foreground)",
                      }
                }
              >
                {d.signs ? "SIGNS" : "READ"}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-6 font-mono text-[10px] text-muted-foreground/50">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
            mainnet-ready
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            sim-only
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
            infrastructure
          </span>
        </div>

      </div>
    </section>
  );
}
