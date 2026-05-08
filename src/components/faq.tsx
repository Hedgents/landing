"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const appleEase = [0.25, 0.1, 0.25, 1.0] as const;

const FAQS = [
  {
    q: "What is Hedgents?",
    a: "Hedgents is a self-hosted treasury management product for institutional operators. It's five Rust binaries that run on your hardware, communicating over a peer-to-peer mesh, each owning one role and one cryptographic identity. It manages DeFi positions on Solana — currently Kamino LST, Kamino lending, and JLP delta-neutral strategies.",
  },
  {
    q: "Who is this for?",
    a: "Institutional treasury operators, family offices, and professional traders who want to run autonomous DeFi strategies on their own infrastructure. Not for retail — you need to understand key management, Solana, and how to run Rust binaries on a server.",
  },
  {
    q: "Where are my keys stored?",
    a: "Only on your machine. An Ed25519 role key and a Solana wallet keypair are generated into ~/01fi-soak/secrets/ on first run. The operator's keypair file IS the custody — no vault program, no multisig in v0. Treat it like a hot wallet.",
  },
  {
    q: "Can a compromised daemon steal funds?",
    a: "Two daemons (riskwatcher, researcher) are compile-time isolated — they literally cannot link to the signing code. For the three signing daemons, every transaction requires a per-instruction whitelist check (SigningWhitelist::verify_ixns). The riskwatcher can issue a soft-veto that pauses multiply. This is defense in depth, not a single gate.",
  },
  {
    q: "Why Rust and not a smart contract?",
    a: "Hedgents is not a protocol — it's a product that runs as binaries on your hardware. It uses smart contracts (Kamino, Jupiter Perps) as venues, but the orchestration, risk management, and signing logic lives off-chain. This gives you full control over execution, key management, and upgrade cadence.",
  },
  {
    q: "Is this mainnet-ready?",
    a: "multiply-daemon and stable-yield-daemon are mainnet-ready with $50 runbooks. hedgedjlp-daemon is simulation-only pending a live custody loader. riskwatcher and researcher are infrastructure daemons that don't take positions.",
  },
  {
    q: "How does the mesh communication work?",
    a: "Each daemon is an independent libp2p peer with a long-lived Ed25519 role key. Messages are signed CBOR envelopes (Assign, Approve, Report, Escalate, etc.) with monotonic per-sender nonces for replay protection. Targeted messages route point-to-point; broadcasts fan out via gossipsub.",
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
            href="https://github.com/Hedgents/fleet/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline font-mono"
          >
            GitHub Discussions →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
