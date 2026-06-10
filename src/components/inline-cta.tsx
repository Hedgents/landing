"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export function InlineCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="border-t border-border/40 bg-muted/10"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Seen enough to have a conversation?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            We work directly with each operator on infrastructure requirements, risk parameters, and deployment timeline.
          </p>
        </div>
        <a
          href="mailto:contact@hedgents.com"
          className="shrink-0 inline-flex items-center justify-center rounded px-6 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
        >
          Request access →
        </a>
      </div>
    </motion.div>
  );
}
