"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export function CTA() {
  return (
    <section
      className="relative snap-start border-t border-border/40"
      style={{ backgroundColor: "var(--navy)" }}
    >
      <div className="mx-auto max-w-4xl px-8 sm:px-12 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Early access
          </p>
          <h2
            className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-5"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            Ready to deploy on your infrastructure?
          </h2>
          <p
            className="text-base leading-relaxed mb-10 mx-auto max-w-xl"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Hedgents is in institutional preview. We work directly with each
            operator to configure the fleet for their infrastructure and
            risk parameters.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:contact@hedgents.com"
              className="inline-flex items-center justify-center rounded px-8 py-3 font-mono text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
            >
              Request access →
            </a>
            <a
              href="https://github.com/Hedgents/fleet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded border px-8 py-3 font-mono text-sm transition-colors hover:border-white/50"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              View source on GitHub →
            </a>
          </div>

          <p
            className="mt-10 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            Paper-trading live · ~8.4% blended APY · $150k notional
          </p>
        </motion.div>
      </div>
    </section>
  );
}
