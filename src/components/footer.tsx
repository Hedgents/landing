"use client";

import { motion } from "framer-motion";

const linkVariants = {
  rest: { opacity: 0.7 },
  hover: { opacity: 1, x: 2, transition: { duration: 0.2 } },
};

export function Footer() {
  return (
    <footer className="border-t border-border snap-start">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="Hedgents"
                className="h-5 w-auto"
              />
              <p className="font-mono text-sm font-semibold text-foreground">
                hedgents
              </p>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed font-serif italic">
              Institutional DeFi execution. Without surrendering custody.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            <motion.a
              href="mailto:contact@infinityteam.io"
              className="hover:text-foreground transition-colors font-mono"
              variants={linkVariants}
              initial="rest"
              whileHover="hover"
            >
              contact@infinityteam.io
            </motion.a>
            <motion.a
              href="https://github.com/Hedgents/fleet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors font-mono"
              variants={linkVariants}
              initial="rest"
              whileHover="hover"
            >
              GitHub →
            </motion.a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            Institutional preview · early access by request
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} Hedgents
          </p>
        </div>
      </div>
    </footer>
  );
}
