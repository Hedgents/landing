"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const PRODUCTS = [
  {
    badge: "Flagship",
    badgeColor: "var(--gold)",
    name: "hgMETAL",
    serif: true,
    tagline: "On-chain structured metals yield.",
    body:
      "A tokenized metals basket hedged into market-neutral carry, then tranched: hgUSD takes a stable senior coupon, hgYIELD takes the levered, first-loss residual. The carry is harvested from metals-perp funding and is venue-verified at roughly 10% on a 30-day realized basis.",
    points: ["hgUSD · senior · stable coupon", "hgYIELD · junior · variable, first-loss", "hgMETAL · unhedged metals exposure"],
    href: "/hgmetal",
    cta: "Explore hgMETAL →",
    primary: true,
  },
  {
    badge: "Infrastructure · also a subscription",
    badgeColor: "rgba(255,255,255,0.5)",
    name: "Hedgents Fleet",
    serif: false,
    tagline: "The autonomous engine that runs hgMETAL.",
    body:
      "A role-based agent fleet that runs vetted Solana yield strategies on your own hardware, your keys, no Hedgents server. Each agent has one fixed role: the one that watches risk cannot trade; the ones that trade cannot change their limits. Live on Solana mainnet today; offered as a subscription.",
    points: ["Self-custody · runs on your machines", "Six fixed-role agents · separated powers", "Stable-yield · hedged-JLP · ONyc strategies"],
    href: "/fleet",
    cta: "See the fleet →",
    primary: false,
  },
];

export function TwoProducts() {
  return (
    <section id="products" className="relative py-24 px-6" style={{ backgroundColor: "var(--navy)" }}>
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] mb-3"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          The product · and its engine
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
          className="font-serif text-3xl sm:text-4xl font-bold text-white mb-10"
        >
          A structured product, and the fleet that runs it.
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {PRODUCTS.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease }}
              className="group flex flex-col rounded-2xl border p-7 transition-colors"
              style={{
                borderColor: p.primary ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.1)",
                backgroundColor: p.primary ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.02)",
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: p.badgeColor }}>
                {p.badge}
              </span>
              <h3
                className={`${p.serif ? "font-serif" : "font-mono"} font-bold text-white text-2xl sm:text-3xl`}
              >
                {p.name}
              </h3>
              <p className="font-serif italic mt-2" style={{ color: "var(--gold)", fontSize: "18px" }}>
                {p.tagline}
              </p>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {p.body}
              </p>
              <ul className="mt-5 space-y-1.5">
                {p.points.map((pt) => (
                  <li key={pt} className="font-mono text-xs flex items-start gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ color: "var(--gold)" }}>·</span> {pt}
                  </li>
                ))}
              </ul>
              <span
                className="mt-auto pt-6 font-mono text-sm font-semibold group-hover:opacity-80 transition-opacity"
                style={{ color: "var(--gold)" }}
              >
                {p.cta}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-xs leading-relaxed"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Status: hgMETAL runs on devnet with a paper hedge and a venue-verified, backtested track record; live capital is the next milestone.
          All three tokens are live to buy and sell with test USDC at{" "}
          <a
            href="https://terminal.hedgents.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-white"
            style={{ color: "var(--gold)" }}
          >
            terminal.hedgents.com
          </a>
          . The fleet runs our own treasury live on mainnet and is being productized for subscribers. Both are early. We say so.
        </motion.p>
      </div>
    </section>
  );
}
