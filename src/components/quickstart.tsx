"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const appleEase = [0.25, 0.1, 0.25, 1.0] as const;

const COMMANDS = [
  {
    label: "1. Clone + Build",
    cmd: `git clone https://github.com/Hedgents/fleet.git
cd fleet
cargo build --workspace --release`,
  },
  {
    label: "2. Boot the fleet (devnet)",
    cmd: `./scripts/run-fleet-with-dashboard.sh devnet`,
  },
  {
    label: "3. Issue an Assign",
    cmd: `./target/release/fleet-pm-stub \\
  --secrets-dir ~/01fi-soak/secrets \\
  --recipient-agent-id <agent-id> \\
  assign-stable-lend --usdc-lamports 10000000`,
  },
];

const blockVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(3px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: appleEase,
    },
  }),
};

export function QuickStart() {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = async (cmd: string, idx: number) => {
    await navigator.clipboard.writeText(cmd);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="quickstart" className="relative bg-muted/30">
      {/* Gradient divider top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      {/* Gradient divider bottom */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: appleEase }}
          className="max-w-3xl mb-16"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            Quick Start
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Run your own fleet.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Five daemons. Three commands. Your hardware.
          </p>
        </motion.div>

        <div className="space-y-6 max-w-3xl">
          {COMMANDS.map((block, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={blockVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
            >
              <p className="text-sm font-semibold text-foreground mb-2 font-mono">
                {block.label}
              </p>
              <div className="relative group rounded-2xl border border-border/30 bg-zinc-950/60 backdrop-blur-lg overflow-hidden shadow-lg shadow-black/10">
                <pre className="px-5 py-4 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed overflow-x-auto">
                  <code>{block.cmd}</code>
                </pre>
                <motion.button
                  className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-zinc-200 font-mono text-[11px] bg-zinc-900/70 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-zinc-800/50"
                  onClick={() => handleCopy(block.cmd, idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied === idx ? "copied" : "copy"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6, ease: appleEase }}
          className="mt-10 text-sm text-muted-foreground/70 font-mono font-light"
        >
          Requires Rust toolchain + Solana CLI. First run generates per-role
          Ed25519 keys and a Solana keypair.{" "}
          <a
            href="https://github.com/Hedgents/fleet#quick-start-devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Full docs →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
