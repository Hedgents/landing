"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const appleEase = [0.25, 0.1, 0.25, 1.0] as const;

const FAQS = [
  {
    q: "What is Hedgents?",
    a: "Hedgents builds structured on-chain yield over precious metals. The flagship is hgMETAL: a hedged-carry basket of gold, silver, platinum, and palladium, split into a senior tranche (hgUSD, a steady ~5% coupon protected by a reserve floor) and a levered junior tranche (hgYIELD, first-loss, designed for ~15%). Underneath it all is our autonomous agent fleet, the engine that runs the vetted Solana strategies, holds the hedge, and rebalances. We also offer that fleet on its own as a self-hosted treasury subscription, on your hardware, your keys.",
  },
  {
    q: "What is hgMETAL?",
    a: "hgMETAL is the family of tokens. The basket is four precious metals (gold, silver, platinum, palladium) carried with a hedge so the spread, not the price swing, drives the return. hgUSD is the senior tranche: a steady ~5% coupon at ~$1.00/share, defended by a 4.5% reserve floor. hgYIELD is the levered junior tranche: first-loss, ~$1.15/share, designed for ~15%. The hgMETAL index token itself is an oracle-free, in-kind metals index with no yield overlay, re-seeded to roughly $1,000,000 NAV across 10,000 units (~$100 each). Net basket carry runs around 5-8%, venue-verified on a recent realized basis and moving with funding.",
  },
  {
    q: "How does the senior tranche stay protected?",
    a: "Two distinct buffers. A junior-windfall reserve war-chest skims junior returns above ~30% APR into an accounting-only reserve that defends the senior 4.5% floor and is later released to junior holders pro-rata (it never leaves the vault). Separately, an ops/insurance treasury holds ~15% idle USDC for redemption liquidity and hedge margin. Mint and redeem are forward-priced (you request, a keeper strikes NAV, then it settles) to prevent dilution, with a redemption gate that caps each window and charges a swing fee.",
  },
  {
    q: "Can I try it?",
    a: "Yes. There is a live demo on Solana devnet at https://terminal.hedgents.com. You can connect Phantom and buy or sell all three tokens with mock USDC, and there is a Treasury & Transparency screen showing the reserve and ops buffers. Honest status: this is devnet with a paper hedge. There is no live-capital track record yet, so treat everything you see as exercised on devnet and backtested, not as audited performance.",
  },
  {
    q: "Who is this for?",
    a: "Crypto funds, family offices, and institutional treasuries that want autonomous DeFi yield without delegating custody to a third party. If your compliance team has blocked every existing DeFi automation tool because it requires handing over keys, Hedgents is built for that constraint.",
  },
  {
    q: "Where are my signing keys stored?",
    a: "Only on your machines, in a directory you control. Hedgents never touches them. There is no Hedgents cloud, no API key sent back to us, no telemetry leaving your infrastructure. Your team generates the keys on first run and they stay local.",
  },
  {
    q: "What if one of the agents is compromised?",
    a: "The three no-custody agents (risk officer, signal publisher, and allocator) are architecturally prevented from moving funds. The wallet crate is intentionally absent from their dependency graph; the binary cannot sign a Solana tx. For the three trading agents, a dedicated risk monitor watches every position and can pause trading if limits are breached. No single agent has unchecked authority.",
  },
  {
    q: "How is this different from a trading bot?",
    a: "A trading bot is a single process with a single set of keys. Hedgents separates execution, risk management, market research, and capital allocation into six independent agents with distinct roles. The risk agent can block a trade but cannot initiate one. The trading agents cannot change their own risk parameters. The allocator can decide WHICH strategy gets capital but has no signing keys to move it. That separation is what makes it auditable.",
  },
  {
    q: "Is this ready for live capital?",
    a: "The leveraged staking and USDC lending strategies are mainnet-ready and have been tested with live positions. The delta-neutral JLP strategy is currently in paper-trading mode. We recommend starting with a paper-trading period on your own infrastructure before deploying live capital. The dashboard shows real-time APY projections throughout.",
  },
  {
    q: "How do the agents communicate with each other?",
    a: "Agents communicate over an encrypted peer-to-peer network, with no central server routing messages. Every instruction is cryptographically signed by the sender and verified by the receiver. This means every action is attributable and the full history is auditable, which is what compliance teams typically require.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(3px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: appleEase,
    },
  }),
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative min-h-screen snap-start scroll-mt-12 border-t border-border/40 flex flex-col justify-center">
      {/* Gradient divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: appleEase }}
          className="max-w-3xl mb-16"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            06 / FAQ
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Questions you might have.
          </h2>
        </motion.div>

        <div className="max-w-2xl space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              className="rounded-2xl border border-border/30 bg-background/40 backdrop-blur-xl overflow-hidden"
              layout
            >
              <motion.button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-card/40 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <motion.span
                  className="text-muted-foreground/40 font-mono text-xs ml-2 shrink-0"
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: appleEase }}
                >
                  ▼
                </motion.span>
              </motion.button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: appleEase }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground/80 leading-relaxed font-light">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: appleEase }}
          className="mt-10 text-sm text-muted-foreground/70 font-light"
        >
          More questions?{" "}
          <a
            href="https://github.com/Hedgents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline font-mono"
          >
            GitHub →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
