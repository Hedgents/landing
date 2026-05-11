"use client";

import { motion } from "framer-motion";

const appleEase = [0.25, 0.1, 0.25, 1.0] as const;

export function PageEntrance({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className="flex-1"
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: appleEase }}
    >
      {children}
    </motion.main>
  );
}
