"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const READ_ONLY = [
  {
    name: "researcher-daemon",
    role: "Signal Publisher",
    emits: ["Kamino rates", "Pyth prices", "JLP yield", "peg drift"],
    signs: false,
  },
  {
    name: "riskwatcher-daemon",
    role: "Risk Officer",
    emits: ["EscalateRisk(Critical)", "LiquidationDistance"],
    signs: false,
  },
];

const SIGNING = [
  { name: "multiply-daemon",     venue: "Kamino LST + leverage" },
  { name: "stable-yield-daemon", venue: "Kamino USDC supply" },
  { name: "hedgedjlp-daemon",    venue: "JLP + Jupiter Perps" },
];

const MSG_TYPES = ["Assign", "Approve", "Report", "Escalate", "MarketSignal", "Beacon"];

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
            Five independent libp2p peers. Each role can run on a separate VPC.
            Every message is a signed CBOR envelope. No orchestrator holds custody.
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
              Read-Only Zone
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
            {/* Read-only daemons */}
            <div className="p-5 flex flex-col justify-center gap-4">
              {READ_ONLY.map((d) => (
                <div
                  key={d.name}
                  className="border border-border/50 rounded p-4 bg-background"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "oklch(0.60 0.06 262)" }}
                    />
                    <code className="font-mono text-[11px] text-foreground/80">{d.name}</code>
                    <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded border border-border/50 text-muted-foreground/50 uppercase">
                      read
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 mb-2">{d.role}</p>
                  <div className="flex flex-wrap gap-1">
                    {d.emits.map((e) => (
                      <span key={e} className="font-mono text-[9px] text-muted-foreground/50 border border-border/30 rounded px-1.5 py-0.5">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Center connector */}
            <div className="w-16 sm:w-24 border-x border-border/30 flex flex-col items-center justify-center gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-1 text-border/60"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{
                    duration: 2,
                    delay: i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="h-px w-3 sm:w-6" style={{ backgroundColor: "var(--gold)", opacity: 0.4 }} />
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--gold)", opacity: 0.6 }}
                  />
                  <div className="h-px w-3 sm:w-6" style={{ backgroundColor: "var(--gold)", opacity: 0.4 }} />
                </motion.div>
              ))}
            </div>

            {/* Signing daemons */}
            <div className="p-5 flex flex-col justify-center gap-4">
              {SIGNING.map((d) => (
                <div
                  key={d.name}
                  className="border rounded p-4 bg-background"
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
                </div>
              ))}
            </div>
          </div>

          {/* Message types footer */}
          <div className="border-t border-border/30 px-5 py-3 bg-muted/20 flex flex-wrap gap-2 items-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40 mr-1">
              Envelope types:
            </span>
            {MSG_TYPES.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] text-muted-foreground/60 border border-border/30 rounded px-2 py-0.5"
              >
                {t}
              </span>
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
