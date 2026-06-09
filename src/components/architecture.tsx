"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

// "No-custody zone" — daemons with no Solana keys. The wallet crate
// is intentionally absent from each binary's dependency graph;
// compile-time guarantee that none of these can move funds. Some
// emit mesh envelopes (orchestrator routes Assigns); some are
// observer-only (researcher, riskwatcher).
const NO_CUSTODY = [
  {
    name: "researcher-daemon",
    role: "Signal Publisher",
    emits: ["Kamino rates", "Pyth prices", "JLP yield", "peg drift"],
    badge: "READ",
  },
  {
    name: "riskwatcher-daemon",
    role: "Risk Officer",
    emits: ["EscalateRisk(Critical)", "LiquidationDistance"],
    badge: "READ",
  },
  {
    name: "orchestrator-daemon",
    role: "Allocator (v0.4.0+)",
    emits: ["Assign", "Withdraw", "Approve"],
    badge: "ROUTES",
  },
];

const SIGNING = [
  { name: "onyc-daemon",         venue: "Kamino isolated ONyc + USDC borrow" },
  { name: "stable-yield-daemon", venue: "Kamino USDC supply" },
  { name: "hedgedjlp-daemon",    venue: "JLP + Jupiter Perps" },
];

const MSG_TYPES = ["Assign", "Withdraw", "Approve", "Report", "Escalate", "MarketSignal", "Beacon"];

const zoneCardVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(3px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, delay: 0.18 + i * 0.08, ease },
  }),
};

function MeshPacketColumn() {
  return (
    <div className="relative flex h-full w-16 sm:w-24 items-center justify-center overflow-hidden border-x border-border/30">
      <svg aria-hidden="true" viewBox="0 0 96 260" className="absolute inset-0 h-full w-full" fill="none">
        <defs>
          <linearGradient id="arch-packet-line" x1="48" y1="18" x2="48" y2="242">
            <stop stopColor="#C9A84C" stopOpacity="0" />
            <stop offset="0.5" stopColor="#C9A84C" stopOpacity="0.45" />
            <stop offset="1" stopColor="#7BA3C8" stopOpacity="0" />
          </linearGradient>
          <path id="arch-packet-path-a" d="M16 36C56 72 56 100 28 130C4 156 20 202 76 224" />
          <path id="arch-packet-path-b" d="M80 38C36 70 38 105 68 132C92 154 78 197 22 226" />
        </defs>
        <path d="M48 18V242" stroke="url(#arch-packet-line)" strokeWidth="1" />
        <use href="#arch-packet-path-a" stroke="rgba(201,168,76,0.18)" strokeDasharray="5 9" />
        <use href="#arch-packet-path-b" stroke="rgba(123,163,200,0.14)" strokeDasharray="5 9" />
        <circle r="3.5" fill="#C9A84C" opacity="0.78">
          <animateMotion dur="3.8s" repeatCount="indefinite">
            <mpath href="#arch-packet-path-a" />
          </animateMotion>
        </circle>
        <circle r="3" fill="#7BA3C8" opacity="0.52">
          <animateMotion dur="4.4s" begin="0.9s" repeatCount="indefinite">
            <mpath href="#arch-packet-path-b" />
          </animateMotion>
        </circle>
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1 text-border/60"
            animate={{ opacity: [0.28, 0.86, 0.28], scale: [1, 1.06, 1] }}
            transition={{
              duration: 2,
              delay: i * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="h-px w-3 sm:w-6" style={{ backgroundColor: "var(--gold)", opacity: 0.4 }} />
            <div
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: "var(--gold)", opacity: 0.6 }}
            />
            <div className="h-px w-3 sm:w-6" style={{ backgroundColor: "var(--gold)", opacity: 0.4 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Architecture() {
  return (
    <section id="architecture" className="relative min-h-screen snap-start scroll-mt-12 border-t border-border/40 flex flex-col justify-center">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl mb-14"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            05 / Architecture
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Peer-to-peer mesh. No central server.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Six independent libp2p peers. Each role can run on a separate VPC.
            Every message is a signed CBOR envelope. The allocator orchestrates
            the others but holds no Solana keys — custody stays with each
            signing daemon, each in its own dependency-isolated binary.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="border border-border/50 rounded overflow-hidden bg-card"
        >
          {/* Zone headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] border-b border-border/40 bg-muted/30">
            <div className="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
              No-Custody Zone
            </div>
            <div className="px-4 py-3 border-x border-border/30 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/30 text-center">
              libp2p mesh
            </div>
            <div className="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
              Signing Zone
            </div>
          </div>

          {/* Mesh diagram */}
          <div className="grid grid-cols-[1fr_auto_1fr] min-h-[260px]">
            {/* No-custody daemons (read-only + orchestrator) */}
            <div className="p-5 flex flex-col justify-center gap-4">
              {NO_CUSTODY.map((d, i) => (
                <motion.div
                  key={d.name}
                  custom={i}
                  variants={zoneCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-border/50 rounded p-4 bg-background transition-colors hover:border-foreground/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        // Orchestrator gets a slightly brighter dot —
                        // it's "active" in the routing sense, while
                        // researcher/riskwatcher are pure observers.
                        backgroundColor:
                          d.badge === "ROUTES"
                            ? "#7BA3C8"
                            : "oklch(0.60 0.06 262)",
                      }}
                    />
                    <code className="font-mono text-[11px] text-foreground/80">{d.name}</code>
                    <span
                      className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase"
                      style={
                        d.badge === "ROUTES"
                          ? {
                              borderColor: "color-mix(in oklch, #7BA3C8 45%, transparent)",
                              color: "#A8C4DD",
                              backgroundColor: "color-mix(in oklch, #7BA3C8 10%, transparent)",
                            }
                          : {
                              borderColor: "color-mix(in oklch, var(--border) 100%, transparent)",
                              color: "color-mix(in oklch, var(--muted-foreground) 70%, transparent)",
                              backgroundColor: "transparent",
                            }
                      }
                    >
                      {d.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 mb-2">{d.role}</p>
                  <div className="flex flex-wrap gap-1">
                    {d.emits.map((e, j) => (
                      <motion.span
                        key={e}
                        initial={{ opacity: 0, y: 4 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.28, delay: 0.34 + i * 0.08 + j * 0.04, ease }}
                        className="font-mono text-[9px] text-muted-foreground/50 border border-border/30 rounded px-1.5 py-0.5"
                      >
                        {e}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center connector */}
            <MeshPacketColumn />

            {/* Signing daemons */}
            <div className="p-5 flex flex-col justify-center gap-4">
              {SIGNING.map((d, i) => (
                <motion.div
                  key={d.name}
                  custom={i + NO_CUSTODY.length}
                  variants={zoneCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border rounded p-4 bg-background transition-colors hover:bg-card"
                  style={{
                    borderColor: "color-mix(in oklch, var(--gold) 30%, var(--border))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--gold)" }}
                    />
                    <code className="font-mono text-[11px] text-foreground/80">{d.name}</code>
                    <span
                      className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase"
                      style={{
                        borderColor: "color-mix(in oklch, var(--gold) 40%, transparent)",
                        color: "var(--gold)",
                      }}
                    >
                      signs
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70">{d.venue}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message types footer */}
          <div className="border-t border-border/30 px-5 py-3 bg-muted/20 flex flex-wrap gap-2 items-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40 mr-1">
              Envelope types:
            </span>
            {MSG_TYPES.map((t) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: 0.18 + MSG_TYPES.indexOf(t) * 0.04, ease }}
                className="font-mono text-[10px] text-muted-foreground/60 border border-border/30 rounded px-2 py-0.5"
              >
                {t}
              </motion.span>
            ))}
            <span className="ml-auto font-mono text-[9px] text-muted-foreground/35">
              Ed25519 signed · monotonic nonces · CBOR
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
