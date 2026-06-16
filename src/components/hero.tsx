"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardMock } from "@/components/dashboard-mock";
import { VaultInviteModal } from "@/components/vault-invite-modal";
import { useLiveRates } from "@/hooks/useLiveRates";

const AGENTS = [
  { id: "onyc",          label: "ONyc",          avatar: "/avatar-onyc.png" },
  { id: "stable-yield",  label: "Stable Yield",  avatar: "/avatar-stable-yield.png" },
  { id: "hedgedjlp",     label: "Hedged JLP",    avatar: "/avatar-hedgedjlp.png" },
  { id: "orchestrator",  label: "Orchestrator",  avatar: "/avatar-orchestrator.png" },
  { id: "riskwatcher",   label: "Riskwatcher",   avatar: "/avatar-riskwatcher.png" },
  { id: "researcher",    label: "Researcher",    avatar: "/avatar-researcher.png" },
];

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
});

export function Hero() {
  const { rates, live } = useLiveRates();
  const apy = rates.portfolioAprPct.toFixed(2);
  const [vaultOpen, setVaultOpen] = useState(false);

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
          Structured on-chain yield · Solana
        </motion.p>

        {/* Brand name — large serif, left-aligned */}
        <motion.h1
          {...fade(0.1)}
          className="font-serif font-bold leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(64px, 10vw, 120px)" }}
        >
          Hedgents
        </motion.h1>

        {/* Gold italic tagline — flagship is hgMETAL */}
        <motion.p
          {...fade(0.22)}
          className="font-serif italic leading-snug mt-5"
          style={{
            color: "var(--gold)",
            fontSize: "clamp(16px, 2vw, 22px)",
            maxWidth: "480px",
          }}
        >
          Structured metals yield, on-chain.
          <br />
          Hedged. Tranched. Verifiable.
        </motion.p>

        {/* Hook — flagship hgMETAL, then the fleet as a treasury product */}
        <motion.p
          {...fade(0.35)}
          className="mt-7 text-sm sm:text-base leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", maxWidth: "470px" }}
        >
          Our flagship,{" "}
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>hgMETAL</span>,
          turns a delta-neutral metals trade into a structured product: a metals
          basket hedged into market-neutral carry, split into a{" "}
          <span style={{ color: "rgba(255,255,255,0.85)" }}>stable senior coupon</span>{" "}
          and a{" "}
          <span style={{ color: "rgba(255,255,255,0.85)" }}>levered junior</span>.
          The carry is venue-verified, roughly 10% on a 30-day realized basis.
        </motion.p>
        <motion.p
          {...fade(0.45)}
          className="mt-4 text-xs sm:text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)", maxWidth: "470px" }}
        >
          Under the hood, an autonomous, role-isolated fleet runs it — the same engine
          has been live on Solana mainnet for months
          {live && (
            <span className="inline-flex items-center gap-1 ml-1.5 align-middle">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>live</span>
            </span>
          )}{" "}
          managing real treasury capital ({apy}% blended). Proven infrastructure, also
          offered as a standalone subscription.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fade(0.48)}
          className="mt-10 flex flex-col sm:flex-row gap-3"
        >
          <a
            href="/hgmetal"
            className="inline-flex items-center justify-center rounded px-6 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
          >
            Explore hgMETAL →
          </a>
          <button
            type="button"
            onClick={() => setVaultOpen(true)}
            className="inline-flex items-center justify-center rounded border px-6 py-2.5 font-mono text-sm transition-colors hover:border-white/50 hover:text-white"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Treasury fleet →
          </button>
          <a
            href="https://terminal.hedgents.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded border px-6 py-2.5 font-mono text-sm transition-colors hover:border-white/50 hover:text-white"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Try the live terminal →
          </a>
        </motion.div>
        <VaultInviteModal open={vaultOpen} onClose={() => setVaultOpen(false)} />

        {/* Agent avatar strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 flex items-center gap-3"
        >
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.id}
              className="group relative"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.07, duration: 0.4 }}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden opacity-55 group-hover:opacity-100 transition-opacity duration-200 ring-1 ring-white/10 group-hover:ring-white/30">
                <Image
                  src={a.avatar}
                  alt={a.label}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Tooltip */}
              <div
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.8)" }}
              >
                {a.label}
              </div>
            </motion.div>
          ))}
          <span
            className="ml-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            the autonomous fleet behind it
          </span>
        </motion.div>
      </div>

      {/* ── Right column — Dashboard mock ── */}
      <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[50%] items-center justify-center px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="w-full"
        >
          <DashboardMock />
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
