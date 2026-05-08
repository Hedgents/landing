"use client";

import { motion } from "framer-motion";
import { TradingMesh3D } from "@/components/trading-mesh-3d";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
});

export function Hero() {
  return (
    <section
      className="relative flex min-h-screen snap-start scroll-mt-12 overflow-hidden"
      style={{ backgroundColor: "var(--navy)" }}
    >
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_60%_50%,transparent_50%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />

      {/* ── Left column ── */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-[52%] px-8 sm:px-12 lg:px-16 xl:px-24 py-24">

        <motion.p
          {...fade(0)}
          className="font-mono text-[10px] uppercase tracking-[0.3em] mb-10"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Institutional DeFi · Solana · On-Premise
        </motion.p>

        {/* Brand name — large serif, left-aligned */}
        <motion.h1
          {...fade(0.1)}
          className="font-serif font-bold leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(64px, 10vw, 120px)" }}
        >
          Hedgents
        </motion.h1>

        {/* Gold italic tagline */}
        <motion.p
          {...fade(0.22)}
          className="font-serif italic leading-snug mt-5"
          style={{
            color: "var(--gold)",
            fontSize: "clamp(16px, 2vw, 22px)",
            maxWidth: "480px",
          }}
        >
          Institutional DeFi execution.
          <br />
          Without surrendering custody.
        </motion.p>

        {/* Hook */}
        <motion.p
          {...fade(0.35)}
          className="mt-7 text-sm sm:text-base leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", maxWidth: "440px" }}
        >
          25 AI-DeFi agent projects on Solana. Every one requires handing over
          keys. Anchorage Digital can&apos;t legally use any of them.{" "}
          <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
            We solve that.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fade(0.48)}
          className="mt-10 flex flex-col sm:flex-row gap-3"
        >
          <a
            href="https://github.com/Hedgents/fleet#quick-start-devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded px-6 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
          >
            ./run-fleet.sh devnet
          </a>
          <a
            href="https://github.com/Hedgents/fleet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded border px-6 py-2.5 font-mono text-sm transition-colors hover:border-white/50 hover:text-white"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            View on GitHub →
          </a>
        </motion.div>

        {/* Bottom meta */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-16 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Five-role agent fleet · On-prem · Solana
        </motion.p>
      </div>

      {/* ── Right column — Trading Mesh ── */}
      <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[50%] items-center justify-center px-6 xl:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="w-full py-10"
        >
          <TradingMesh3D />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          className="w-5 h-8 rounded-full flex items-start justify-center p-1"
          style={{ border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: "var(--gold)", opacity: 0.6 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
