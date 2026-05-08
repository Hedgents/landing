"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const ROWS = [
  { feature: "Runs on institution's own hardware", retail: false, saas: false, hedgents: true },
  { feature: "Institution holds signing keys", retail: false, saas: false, hedgents: true },
  { feature: "Compile-time authority isolation", retail: false, saas: false, hedgents: true },
  { feature: "Per-instruction tx whitelist", retail: false, saas: false, hedgents: true },
  { feature: "No central server to compromise", retail: false, saas: false, hedgents: true },
  { feature: "Multi-strategy execution", retail: true, saas: true, hedgents: true },
  { feature: "Auditable action log", retail: false, saas: "partial", hedgents: true },
  { feature: "Compliant for chartered custodians", retail: false, saas: false, hedgents: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return <span className="font-serif font-bold text-foreground text-base">✓</span>;
  if (value === "partial")
    return <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">partial</span>;
  return <span className="text-muted-foreground/30 font-mono">—</span>;
}

export function Competitive() {
  return (
    <section id="competitive" className="relative border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl mb-14"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            Differentiation
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Two ways to lose this market.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Retail UX doesn&apos;t survive institutional procurement.
            Hosted SaaS doesn&apos;t survive compliance review.
            Hedgents is the only structurally-isolated answer for custodians.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="border border-border/50 rounded overflow-hidden bg-card"
        >
          {/* Column headers */}
          <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr] border-b border-border/40 bg-muted/30">
            <div className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              Feature
            </div>
            <div className="px-4 py-3.5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              Retail UX
            </div>
            <div className="px-4 py-3.5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              Hosted SaaS
            </div>
            <div
              className="px-4 py-3.5 text-center font-mono text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: "var(--gold)" }}
            >
              Hedgents
            </div>
          </div>

          {/* Data rows */}
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[2.5fr_1fr_1fr_1fr] border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors"
            >
              <div className="px-5 py-3.5 text-sm text-foreground/80">{row.feature}</div>
              <div className="px-4 py-3.5 text-center"><Cell value={row.retail} /></div>
              <div className="px-4 py-3.5 text-center"><Cell value={row.saas} /></div>
              <div
                className="px-4 py-3.5 text-center"
                style={{ backgroundColor: "color-mix(in oklch, var(--gold) 5%, transparent)" }}
              >
                <Cell value={row.hedgents} />
              </div>
            </div>
          ))}
        </motion.div>

        <p className="mt-4 font-mono text-[10px] text-muted-foreground/40">
          Retail UX: Lomen · OVIRA · Edwin &nbsp;|&nbsp; Hosted SaaS: Drift CASH (Gauntlet)
        </p>

      </div>
    </section>
  );
}
