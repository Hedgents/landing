"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const DAEMONS = [
  {
    id: "multiply",
    name: "multiply-daemon",
    displayName: "Multiply",
    avatar: "/avatar-multiply.png",
    role: "Leveraged Staking Trader",
    strategy: "Kamino LST farming · 2.5× leverage",
    status: "mainnet-ready",
    signs: true,
  },
  {
    id: "stable-yield",
    name: "stable-yield-daemon",
    displayName: "Stable Yield",
    avatar: "/avatar-stable-yield.png",
    role: "Passive Lender",
    strategy: "Kamino USDC supply",
    status: "mainnet-ready",
    signs: true,
  },
  {
    id: "hedgedjlp",
    name: "hedgedjlp-daemon",
    displayName: "Hedged JLP",
    avatar: "/avatar-hedgedjlp.png",
    role: "Delta-Neutral Basis Trader",
    strategy: "Long JLP · short SOL/ETH/BTC perps",
    status: "sim-only",
    signs: true,
  },
  {
    id: "riskwatcher",
    name: "riskwatcher-daemon",
    displayName: "Riskwatcher",
    avatar: "/avatar-riskwatcher.png",
    role: "Risk Officer",
    strategy: "Monitors LTV · emits Escalate signals",
    status: "active",
    signs: false,
  },
  {
    id: "researcher",
    name: "researcher-daemon",
    displayName: "Researcher",
    avatar: "/avatar-researcher.png",
    role: "Signal Publisher",
    strategy: "Kamino rates · Pyth prices · JLP yield",
    status: "active",
    signs: false,
  },
];

const STATUS_COLOR: Record<string, string> = {
  "mainnet-ready": "var(--gold)",
  "sim-only":      "oklch(0.78 0.18 70)",
  "active":        "oklch(0.60 0.06 262)",
};

export function Fleet() {
  return (
    <section
      id="fleet"
      className="relative min-h-screen snap-start scroll-mt-12 border-t border-border/40 flex flex-col justify-center"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full py-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            03 / Fleet
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Five daemons. Five roles.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
            Each agent has exactly one role and cannot exceed it.
            Three manage positions and sign transactions. Two monitor and publish signals —
            they have no authority to move funds, by design.
          </p>
        </motion.div>

        {/* Agent cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DAEMONS.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.06 * i, ease }}
              className="group relative flex flex-col rounded-xl border border-border/50 bg-card hover:border-border/80 transition-colors overflow-hidden"
            >
              {/* Avatar */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#0d0d1a]">
                <Image
                  src={d.avatar}
                  alt={d.displayName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {/* Auth badge overlaid on image */}
                <div className="absolute top-2 right-2">
                  <span
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded border backdrop-blur-sm"
                    style={
                      d.signs
                        ? {
                            borderColor: "color-mix(in oklch, var(--gold) 50%, transparent)",
                            color: "var(--gold)",
                            backgroundColor: "color-mix(in oklch, var(--gold) 12%, transparent)",
                          }
                        : {
                            borderColor: "rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.45)",
                            backgroundColor: "rgba(0,0,0,0.4)",
                          }
                    }
                  >
                    {d.signs ? "SIGNS" : "READ"}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-3 flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_COLOR[d.status] }}
                  />
                  <span className="font-mono text-[10px] text-muted-foreground/50 truncate">
                    {d.name}
                  </span>
                </div>
                <p className="font-serif font-bold text-sm text-foreground leading-snug">
                  {d.role}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
                  {d.strategy}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-6 font-mono text-[10px] text-muted-foreground/40">
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
