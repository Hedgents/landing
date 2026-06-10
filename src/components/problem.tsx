"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

// Stripped down — no failure cards (hero already covers the gap),
// no snap-start (lets it breathe as a transition between hero and fleet).
export function Problem() {
  return (
    <section
      id="problem"
      className="relative snap-start scroll-mt-12 border-t border-border/40"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full py-16 sm:py-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-5">
              02 / The gap
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Autonomous DeFi needs a custody model.
            </h2>
            <p className="mt-5 font-serif italic text-lg text-foreground/70 leading-snug">
              How do you let software trade your capital without giving software your keys?
            </p>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-md">
              Every existing solution answers this with a promise. Hedgents answers it
              with an architecture your compliance team can verify, not just read about.
            </p>
          </motion.div>

          {/* a16z quote — the market validation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12, ease }}
            className="bg-card border border-border/60 rounded-lg p-6 flex flex-col justify-between"
            style={{ borderLeft: "3px solid var(--gold)" }}
          >
            <p className="font-mono text-[10px] text-muted-foreground mb-3">a16z crypto, 2025</p>
            <p className="font-serif italic text-lg text-foreground leading-relaxed">
              &ldquo;The user is no longer an operator. They&apos;re an orchestrator.&rdquo;
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              The CIO sets the mandate: risk caps, strategy mix, target yield.
              The fleet executes continuously, without requiring human sign-off on every transaction.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
