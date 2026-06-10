"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const PILLARS = [
  {
    number: "01",
    label: "Code-Level",
    title: "Authority bound at compile time.",
    body: "riskwatcher and researcher deliberately omit the wallet crate. cargo tree returns empty. A compromised binary cannot sign, because the code isn't linked.",
    detail: "Per-instruction whitelist on all signing daemons adds a second layer.",
    compare: {
      left:  ["✓ Read chain", "✓ Publish signals", "✓ Sign txs", "✓ Hold keys"],
      right: ["✓ Read chain", "✓ Publish signals", "✕ Sign txs", "✕ Hold keys"],
    },
  },
  {
    number: "02",
    label: "Network-Level",
    title: "Multi-machine P2P mesh.",
    body: "Each daemon is an independent libp2p peer. Each role can run on a separate VPC. The allocator routes envelopes between peers but holds no Solana keys; custody stays with each signing daemon, each in its own compile-time-isolated binary.",
    detail: "Long-lived Ed25519 role key per daemon. Ephemeral peer-id survives host migration.",
    compare: null,
  },
  {
    number: "03",
    label: "Protocol-Level",
    title: "Signed envelopes, replay-protected.",
    body: "Every message is a signed CBOR envelope with monotonic per-sender nonces. Verifiable at audit time, not on trust.",
    detail: "Assign · Withdraw · Approve · Report · Escalate · MarketSignal · Beacon",
    compare: null,
  },
];

export function Differentiators() {
  return (
    <section
      id="differentiators"
      className="relative min-h-screen snap-start scroll-mt-12 border-t border-border/40 flex flex-col justify-center"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full py-12">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            04 / How it&apos;s built
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Three layers of verifiable isolation.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Code, network, and protocol: verifiable properties of the deployment, not runtime trust.
          </p>
        </motion.div>

        {/* Three-column pillar grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i, ease }}
              className="border border-border/50 rounded overflow-hidden bg-card flex flex-col"
            >
              {/* Pillar header */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40 bg-muted/30">
                <span className="font-mono text-sm font-bold" style={{ color: "var(--gold)" }}>
                  {p.number}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  {p.label}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="font-serif text-base font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>

                <p
                  className="text-xs text-muted-foreground/65 font-mono leading-relaxed border-l-2 pl-3"
                  style={{ borderColor: "color-mix(in oklch, var(--gold) 45%, transparent)" }}
                >
                  {p.detail}
                </p>

                {/* Code comparison for pillar 01 */}
                {p.compare && (
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {[
                      { label: "Standard Agent", items: p.compare.left },
                      { label: "Hedgents RW",    items: p.compare.right },
                    ].map((col, ci) => (
                      <div
                        key={ci}
                        className="rounded border p-3"
                        style={
                          ci === 1
                            ? {
                                borderColor: "color-mix(in oklch, var(--gold) 35%, transparent)",
                                backgroundColor: "color-mix(in oklch, var(--gold) 5%, transparent)",
                              }
                            : { borderColor: "var(--border)" }
                        }
                      >
                        <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/50 mb-2">
                          {col.label}
                        </p>
                        {col.items.map((item, j) => (
                          <p
                            key={j}
                            className="font-mono text-[10px] py-0.5"
                            style={{
                              color: item.startsWith("✕")
                                ? "var(--destructive)"
                                : "var(--foreground)",
                              opacity: item.startsWith("✕") ? 0.8 : 1,
                            }}
                          >
                            {item}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
