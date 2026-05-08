"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const FAILURE_MODES = [
  {
    quote: '"AI guardrails"',
    verdict: "Vague",
    desc: "No verifiable isolation. Runtime promises. Not auditable by an external firm.",
    examples: "Lomen · OVIRA · Edwin",
  },
  {
    quote: '"Trust the SaaS"',
    verdict: "Non-compliant",
    desc: "Chartered custodians can't legally delegate custody to a third-party server.",
    examples: "Drift CASH · Gauntlet",
  },
  {
    quote: '"Audit the contract"',
    verdict: "Off-chain gap",
    desc: "Agent logic and signing happen off-chain — the audit scope ends where risk begins.",
    examples: "Most DeFi protocols",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative min-h-screen snap-start scroll-mt-12 border-t border-border/40 flex flex-col justify-center"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full py-12">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-5"
        >
          02 / Problem
        </motion.p>

        {/* Two-column top */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              The institutional version is unsolved.
            </h2>
            <p className="mt-5 font-serif italic text-lg sm:text-xl text-foreground leading-snug">
              How do you let software trade your capital — without giving software your keys?
            </p>
          </motion.div>

          {/* a16z quote card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12, ease }}
            className="bg-card border border-border/60 rounded p-6 flex flex-col justify-between"
            style={{ borderLeft: "3px solid var(--gold)" }}
          >
            <p className="font-mono text-[10px] text-muted-foreground mb-3">a16z, December</p>
            <p className="font-serif italic text-base text-foreground leading-relaxed">
              &ldquo;The user is no longer an operator. They&apos;re an orchestrator.&rdquo;
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              CIO sets caps and intent — the system executes.
            </p>
          </motion.div>
        </div>

        {/* Failure mode cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/40 border border-border/40 rounded overflow-hidden">
          {FAILURE_MODES.map((mode, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * i, ease }}
              className="bg-card p-5"
            >
              <div className="flex items-start gap-2 mb-3">
                <span
                  className="shrink-0 mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center font-bold text-[9px] leading-none"
                  style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
                >
                  ✕
                </span>
                <span className="font-serif font-bold text-foreground text-sm">{mode.quote}</span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">{mode.verdict}</p>
              <p className="text-xs text-muted-foreground/80 leading-relaxed">{mode.desc}</p>
              <p className="font-mono text-[9px] text-muted-foreground/35 mt-3">{mode.examples}</p>
            </motion.div>
          ))}
        </div>

        {/* Pull quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35, ease }}
          className="mt-8 text-center text-sm text-foreground/70"
        >
          Institutional buyers need{" "}
          <strong className="text-foreground">structural</strong> safety —
          not{" "}
          <em className="font-serif" style={{ color: "var(--gold)" }}>promised</em>{" "}
          safety.
        </motion.p>
      </div>
    </section>
  );
}
