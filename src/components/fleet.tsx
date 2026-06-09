"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FleetRoleRail } from "@/components/svg-accents";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

type AuthClass = "signs" | "read" | "routes";

const DAEMONS: Array<{
  id: string;
  name: string;
  displayName: string;
  avatar: string | null;
  role: string;
  strategy: string;
  status: string;
  auth: AuthClass;
}> = [
  {
    id: "orchestrator",
    name: "orchestrator-daemon",
    displayName: "Orchestrator",
    avatar: "/avatar-orchestrator.png",
    role: "Allocator",
    strategy: "Cross-strategy rebalancer · routes Assign/Withdraw envelopes",
    status: "mainnet-ready",
    // ROUTES, not SIGNS: signs mesh envelopes but the wallet crate is
    // intentionally absent from this daemon's dependency graph, so it
    // can never sign a Solana tx. This is the same compile-time
    // authority isolation the read-only daemons get.
    auth: "routes",
  },
  {
    id: "onyc",
    name: "onyc-daemon",
    displayName: "ONyc",
    avatar: "/avatar-onyc.png",
    role: "Leveraged RWA Trader",
    strategy: "Kamino isolated ONyc market · 40% LTV against USDC",
    status: "mainnet-live",
    auth: "signs",
  },
  {
    id: "stable-yield",
    name: "stable-yield-daemon",
    displayName: "Stable Yield",
    avatar: "/avatar-stable-yield.png",
    role: "Passive Lender",
    strategy: "Kamino USDC supply",
    status: "mainnet-ready",
    auth: "signs",
  },
  {
    id: "hedgedjlp",
    name: "hedgedjlp-daemon",
    displayName: "Hedged JLP",
    avatar: "/avatar-hedgedjlp.png",
    role: "Delta-Neutral Basis Trader",
    strategy: "Long JLP · short SOL/ETH/BTC perps",
    status: "mainnet-ready",
    auth: "signs",
  },
  {
    id: "riskwatcher",
    name: "riskwatcher-daemon",
    displayName: "Riskwatcher",
    avatar: "/avatar-riskwatcher.png",
    role: "Risk Officer",
    strategy: "Monitors LTV · emits Escalate signals",
    status: "active",
    auth: "read",
  },
  {
    id: "researcher",
    name: "researcher-daemon",
    displayName: "Researcher",
    avatar: "/avatar-researcher.png",
    role: "Signal Publisher",
    strategy: "Kamino rates · Pyth prices · JLP yield",
    status: "active",
    auth: "read",
  },
];

const STATUS_COLOR: Record<string, string> = {
  "mainnet-ready": "var(--gold)",
  "sim-only":      "oklch(0.78 0.18 70)",
  "active":        "oklch(0.60 0.06 262)",
};

const AUTH_BADGE: Record<AuthClass, { label: string; bg: string; border: string; color: string }> = {
  signs: {
    label: "SIGNS",
    bg: "color-mix(in oklch, var(--gold) 12%, transparent)",
    border: "color-mix(in oklch, var(--gold) 50%, transparent)",
    color: "var(--gold)",
  },
  routes: {
    label: "ROUTES",
    bg: "color-mix(in oklch, #7BA3C8 14%, transparent)",
    border: "color-mix(in oklch, #7BA3C8 50%, transparent)",
    color: "#A8C4DD",
  },
  read: {
    label: "READ",
    bg: "rgba(0,0,0,0.4)",
    border: "rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.45)",
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: -22, scale: 0.96, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, delay: 0.16 + i * 0.08, ease },
  }),
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
            Six daemons. Three authority classes.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
            Each agent has exactly one role and cannot exceed it.
            Three sign Solana transactions and manage positions. Two observe and publish
            signals — they have no authority to move funds, by design.
            One orchestrates: routes Assign/Withdraw envelopes between the others, but
            its binary cannot sign a Solana tx either — the wallet crate is intentionally
            absent from its dependency graph.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="-mt-3 mb-2"
        >
          <FleetRoleRail />
        </motion.div>

        {/* Agent cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DAEMONS.map((d, i) => {
            const badge = AUTH_BADGE[d.auth];
            // Hover glow per authority class — gold for signers, blue
            // for orchestrator (routes), neutral for read-only.
            const hoverShadow =
              d.auth === "signs"
                ? "0 22px 45px rgba(201,168,76,0.16)"
                : d.auth === "routes"
                ? "0 22px 45px rgba(123,163,200,0.18)"
                : "0 22px 45px rgba(255,255,255,0.06)";
            const topLineGradient =
              d.auth === "signs"
                ? "linear-gradient(90deg, transparent, var(--gold), transparent)"
                : d.auth === "routes"
                ? "linear-gradient(90deg, transparent, #7BA3C8, transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)";
            return (
            <motion.div
              key={d.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, boxShadow: hoverShadow }}
              transition={{ duration: 0.25, ease }}
              className="group relative flex flex-col rounded-xl border border-border/50 bg-card hover:border-border/80 transition-colors overflow-hidden"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: topLineGradient }}
              />
              {/* Avatar (or placeholder until the PNG is commissioned) */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#0d0d1a]">
                {d.avatar ? (
                  <Image
                    src={d.avatar}
                    alt={d.displayName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  />
                ) : (
                  // Placeholder for daemons without a commissioned PNG.
                  // Renders a centred glyph over the avatar background so
                  // the card still has visual weight; replace with a real
                  // PNG by dropping it into /public/avatar-<id>.png and
                  // setting the `avatar` field above.
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(123,163,200,0.18), rgba(13,13,26,0.95) 65%)",
                    }}
                  >
                    <span
                      className="font-serif text-5xl"
                      style={{ color: "rgba(168,196,221,0.55)" }}
                      aria-hidden
                    >
                      ◆
                    </span>
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0 translate-y-[-110%] bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-y-[110%] group-hover:opacity-100"
                />
                {/* Auth badge overlaid on image */}
                <div className="absolute top-2 right-2">
                  <span
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded border backdrop-blur-sm"
                    style={{
                      borderColor: badge.border,
                      color: badge.color,
                      backgroundColor: badge.bg,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-3 flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: STATUS_COLOR[d.status],
                      boxShadow:
                        d.auth === "signs"
                          ? "0 0 10px color-mix(in oklch, var(--gold) 55%, transparent)"
                          : d.auth === "routes"
                          ? "0 0 10px color-mix(in oklch, #7BA3C8 55%, transparent)"
                          : "none",
                    }}
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
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-6 font-mono text-[10px] text-muted-foreground/40">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
            signs Solana tx
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#7BA3C8" }} />
            routes envelopes (no Solana keys)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
            read-only · no signing authority
          </span>
        </div>

      </div>
    </section>
  );
}
