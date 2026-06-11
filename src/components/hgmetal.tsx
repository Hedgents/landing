"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { HgMetalTerminal } from "@/components/hgmetal-terminal";
import { HgMetalReplay } from "@/components/hgmetal-replay";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const GOLD = "var(--gold)";
const STEEL = "#7BA3C8";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
      {children}
    </p>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative border-t border-border/40 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full py-20">{children}</div>
    </section>
  );
}

// ── Hero ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative flex flex-col justify-center min-h-[88vh] overflow-hidden"
      style={{ backgroundColor: "var(--navy)" }}
    >
      {/* faint metal-bar accent lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute h-px w-full"
            style={{
              top: `${28 + i * 14}%`,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45 mb-5">
            Hedgents · Real-World Assets
          </p>
          <h1 className="font-serif text-6xl sm:text-7xl font-extrabold text-white leading-[0.95]">
            hg<span style={{ color: GOLD }}>METAL</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70 leading-relaxed">
            Metals-focused structured products on Solana, spanning gold, silver,
            platinum, palladium and copper. Run by an autonomous, role-isolated
            agent fleet that actively rebalances across cross-metal strategies,
            then tranches the output into senior and junior products.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded px-3 py-1.5 font-mono text-xs"
              style={{
                backgroundColor: "color-mix(in oklch, var(--gold) 14%, transparent)",
                color: GOLD,
                border: "1px solid color-mix(in oklch, var(--gold) 45%, transparent)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
              Live on devnet
            </span>
            <span className="inline-flex items-center rounded px-3 py-1.5 font-mono text-xs text-white/55 border border-white/15">
              4-metal NAV proven on-chain
            </span>
            <span className="inline-flex items-center rounded px-3 py-1.5 font-mono text-xs text-white/55 border border-white/15">
              Audited · 4 critical findings closed
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Proof → scale-up ──────────────────────────────────────────────

const MAPPING: { primitive: string; v0: string; metals: string }[] = [
  { primitive: "Execution roles (sign)", v0: "stable-yield · hedgedjlp · onyc", metals: "gold-basis · cross-metal-pair · funding-capture" },
  { primitive: "Researcher (read-only)", v0: "Kamino rates · Pyth · JLP yield", metals: "5 metal feeds · Flash funding · GLD/SLV + GLD/PT ratios" },
  { primitive: "Riskwatcher (read-only)", v0: "LTV · liquidation distance", metals: "basket tracking error · hedge delta · concentration" },
  { primitive: "Orchestrator (route)", v0: "regime-aware USDC allocator", metals: "regime-aware allocator across metal strategies" },
  { primitive: "Active rebalance", v0: "USDC between 3 DeFi slots", metals: "capital between metal strategies as regimes shift" },
  { primitive: "Product wrapper", v0: "none (raw vault)", metals: "hgMETAL / hgUSD / hgYIELD tranches" },
];

function ProofScaleUp() {
  return (
    <Section id="proof">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-10"
      >
        <Eyebrow>01 / The thesis</Eyebrow>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          v0 proved it. hgMETAL scales it.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
          The Hedgents v0 fleet ran real capital across three DeFi strategies on
          Solana mainnet with an autonomous, role-isolated agent fleet and active
          cross-strategy rebalancing. The point was never the yield. It was proving
          the architecture works on-chain, with real money. hgMETAL re-applies that
          proven architecture to a domain that genuinely demands it: a multi-metal
          product where the strategies being rebalanced are metal strategies.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
        className="overflow-hidden rounded-lg border border-border/60"
      >
        <div className="grid grid-cols-[1.1fr_1fr_1.3fr] bg-foreground/[0.03] font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <div className="px-4 py-3">Fleet primitive</div>
          <div className="px-4 py-3 border-l border-border/40">v0: proof (mainnet)</div>
          <div className="px-4 py-3 border-l border-border/40" style={{ color: GOLD }}>
            hgMETAL: scale-up
          </div>
        </div>
        {MAPPING.map((row, i) => (
          <div
            key={row.primitive}
            className={`grid grid-cols-[1.1fr_1fr_1.3fr] text-sm ${
              i % 2 ? "bg-foreground/[0.015]" : ""
            } border-t border-border/30`}
          >
            <div className="px-4 py-3 font-medium text-foreground">{row.primitive}</div>
            <div className="px-4 py-3 border-l border-border/30 text-muted-foreground">{row.v0}</div>
            <div className="px-4 py-3 border-l border-border/30 text-foreground/90">{row.metals}</div>
          </div>
        ))}
      </motion.div>

      <p className="mt-6 font-serif italic text-lg text-foreground/70 max-w-3xl">
        “v0 proved an autonomous role-based fleet can actively rebalance on-chain
        capital. hgMETAL applies that same architecture to a multi-metal product:
        a fleet of metal-strategy agents rebalancing across precious and industrial
        metals, tranched into senior and junior products.”
      </p>
    </Section>
  );
}

// ── Product family ────────────────────────────────────────────────

const PRODUCTS: {
  ticker: string;
  name: string;
  accent: string;
  tagline: string;
  body: string;
  who: string;
}[] = [
  {
    ticker: "hgMETAL",
    name: "Exposure",
    accent: GOLD,
    tagline: "Diversified metals, native yield",
    body: "An unhedged, multi-issuer metals basket with Oro Earn yield on the gold leg. One token instead of choosing between five tokenized gold issuers.",
    who: "Long-term metals believers",
  },
  {
    ticker: "hgUSD",
    name: "Senior",
    accent: STEEL,
    tagline: "Gold-backed structured income",
    body: "Delta-hedged carry with a defined yield target. First claim on the fleet's P&L, protected by the junior buffer. The income product: yield comes from carry, not gold price.",
    who: "Family offices · DAO treasuries",
  },
  {
    ticker: "hgYIELD",
    name: "Junior",
    accent: "oklch(0.62 0.17 28)",
    tagline: "Leveraged metals + residual",
    body: "Takes the residual after senior is paid, and first loss. Captures cross-metal alpha and amplified upside in exchange for absorbing drawdowns. The alignment vehicle.",
    who: "Yield maxis · team",
  },
];

function ProductFamily() {
  return (
    <Section id="products">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-10"
      >
        <Eyebrow>02 / Product family</Eyebrow>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          One engine. Three tranches.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
          The fleet produces one stream of metals P&L. A senior/junior waterfall
          splits it into products with distinct risk profiles, so each depositor
          self-selects by conviction.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.ticker}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease }}
            className="rounded-lg border border-border/60 bg-background p-6 flex flex-col"
            style={{ borderTop: `2px solid ${p.accent}` }}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-2xl font-bold text-foreground">{p.ticker}</span>
              <span
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  color: p.accent,
                  backgroundColor: `color-mix(in oklch, ${p.accent} 12%, transparent)`,
                }}
              >
                {p.name}
              </span>
            </div>
            <p className="mt-2 font-medium text-foreground/90">{p.tagline}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{p.body}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              {p.who}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ── The metals fleet ──────────────────────────────────────────────

type Auth = "signs" | "routes" | "read";
const AUTH: Record<Auth, { label: string; color: string }> = {
  signs: { label: "SIGNS", color: GOLD },
  routes: { label: "ROUTES", color: STEEL },
  read: { label: "READ", color: "rgba(120,130,150,0.8)" },
};

const ROLES: { name: string; auth: Auth; role: string }[] = [
  { name: "gold-basis", auth: "signs", role: "Long basket, short XAU perp for delta-neutral carry" },
  { name: "cross-metal-pair", auth: "signs", role: "GLD/SLV + GLD/PT ratio mean-reversion" },
  { name: "funding-capture", auth: "signs", role: "Sizes into extreme Flash v2 funding windows" },
  { name: "orchestrator", auth: "routes", role: "Regime-aware allocator across metal strategies" },
  { name: "researcher", auth: "read", role: "5 metal feeds, funding rates, cross-metal ratios" },
  { name: "riskwatcher", auth: "read", role: "Tracking error, hedge delta, concentration" },
];

function MetalsFleet() {
  return (
    <Section id="fleet" className="bg-foreground/[0.015]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-10"
      >
        <Eyebrow>03 / The metals fleet</Eyebrow>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          Cross-metal strategy, role-isolated.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
          Five metal price feeds and multiple cross-metal strategy types make this a
          real allocation problem, which is exactly what the fleet pattern is for. Each agent
          has one role and cannot exceed it. Execution daemons sign; observers can
          never move funds; the orchestrator routes but its binary cannot sign a
          Solana transaction at all.
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r, i) => {
          const a = AUTH[r.auth];
          return (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06, ease }}
              className="rounded-lg border border-border/60 bg-background p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-foreground">{r.name}</span>
                <span
                  className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    color: a.color,
                    backgroundColor: `color-mix(in oklch, ${a.color} 14%, transparent)`,
                  }}
                >
                  {a.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">{r.role}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

// ── Live on devnet ────────────────────────────────────────────────

const PROGRAM_ID = "5kQGqqconKPFXYwqMwQ6ynqB1ZRBmbAb4W7Hvh3KQcKi";

const PROOF_STATS: { label: string; value: string }[] = [
  { label: "Tranching program", value: "live on devnet" },
  { label: "Metals priced on-chain", value: "XAU · XAG · XPT · XPD" },
  { label: "NAV proven in one cycle", value: "$39,924" },
  { label: "Oracle", value: "Pyth pull feeds" },
  { label: "Hedge venue", value: "Flash v2 perps" },
  { label: "Audit", value: "4 critical closed · 31 tests" },
];

function LiveOnDevnet() {
  return (
    <Section id="devnet">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-10"
      >
        <Eyebrow>04 / Built, not promised</Eyebrow>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          The settlement layer is live on devnet.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
          The senior/junior tranching contract is deployed and exercised end-to-end:
          a four-metal basket valued against live Pyth feeds, deposits and redemptions
          through the waterfall, and an independent audit whose four critical findings
          are all closed. The on-chain foundation is real today; the multi-strategy
          metals fleet on top of it is the scale-up in progress.
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROOF_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05, ease }}
            className="rounded-lg border border-border/60 bg-background px-5 py-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              {s.label}
            </p>
            <p className="mt-1 font-serif text-xl font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.a
        href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
        className="mt-6 inline-flex items-center gap-2 rounded border border-border/60 bg-background px-4 py-2.5 font-mono text-xs text-foreground/80 hover:border-border transition-colors break-all"
      >
        <span className="text-muted-foreground/60">program</span>
        {PROGRAM_ID}
        <span style={{ color: GOLD }}>↗</span>
      </motion.a>
    </Section>
  );
}

// ── Replay (historical slider) ────────────────────────────────────

function ReplaySection() {
  return (
    <Section id="replay">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-8"
      >
        <Eyebrow>05 / Replay</Eyebrow>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          Drag through the history.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
          Real Hyperliquid funding, replayed day by day through the on-chain
          waterfall, with real metal prices for the basket. Watch the three
          tokens diverge: the metal index swings with metals, while the hedged
          senior and junior keep earning the carry.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
        className="max-w-3xl"
      >
        <HgMetalReplay />
      </motion.div>
    </Section>
  );
}

// ── Live terminal (gated) ─────────────────────────────────────────

function LiveTerminal() {
  return (
    <Section id="terminal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-8"
      >
        <Eyebrow>06 / Live terminal</Eyebrow>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          Watch the vault, live.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
          A direct read of the devnet vault: live Pyth metal prices, the basket
          marked to those prices, and the senior / junior / unallocated NAV split,
          refreshing every few seconds.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
        className="max-w-2xl"
      >
        <HgMetalTerminal />
      </motion.div>
    </Section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────

function Cta() {
  return (
    <section
      className="relative border-t border-white/10"
      style={{ backgroundColor: "var(--navy)" }}
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">
            Metals, the way a fleet would run them.
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto leading-relaxed">
            hgMETAL is in private beta. The proof shipped on v0; the scale-up is
            building now.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="mailto:contact@hedgents.com?subject=hgMETAL access"
              className="inline-flex items-center justify-center rounded px-5 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: GOLD, color: "var(--navy)" }}
            >
              Request access →
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded px-5 py-2.5 font-mono text-sm text-white/60 hover:text-white/90 border border-white/15 transition-colors"
            >
              ← The v0 fleet
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function HgMetal() {
  // The site sets `scroll-snap-type: y mandatory` globally on <html> for
  // the home page's full-height snap deck. This route is a normal
  // variable-height scroll page; mandatory snapping with no aligned
  // snap children traps the scroll position ("stuck at the bottom").
  // Disable it for this route and restore on unmount.
  useEffect(() => {
    const html = document.documentElement;
    const prevSnap = html.style.scrollSnapType;
    const prevBehavior = html.style.scrollBehavior;
    const prevRestore =
      "scrollRestoration" in history ? history.scrollRestoration : undefined;

    // The home page uses mandatory scroll-snap + smooth scrolling on
    // <html>. On this route the browser was restoring the previous
    // scroll position (the bottom) and `scroll-smooth` made it visibly
    // animate down. Turn off snap + smooth + restoration, jump to the
    // top instantly, and re-assert after layout settles so a late
    // restoration can't win.
    html.style.scrollSnapType = "none";
    html.style.scrollBehavior = "auto";
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));

    return () => {
      html.style.scrollSnapType = prevSnap;
      html.style.scrollBehavior = prevBehavior;
      if ("scrollRestoration" in history && prevRestore) {
        history.scrollRestoration = prevRestore;
      }
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />
      <div className="bg-background">
        <ProofScaleUp />
        <ProductFamily />
        <MetalsFleet />
        <LiveOnDevnet />
        <ReplaySection />
        <LiveTerminal />
      </div>
      <Cta />
    </div>
  );
}
