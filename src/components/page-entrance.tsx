"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const appleEase = [0.25, 0.1, 0.25, 1.0] as const;

export function PageEntrance({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // If loading screen was already dismissed in this session, show immediately
    if (sessionStorage.getItem("hedgents-loaded")) {
      setShow(true);
      return;
    }

    // Otherwise, wait for the loading screen to finish
    const check = setInterval(() => {
      if (sessionStorage.getItem("hedgents-loaded")) {
        setShow(true);
        clearInterval(check);
      }
    }, 100);

    // Safety timeout — show after 5s regardless
    const safety = setTimeout(() => setShow(true), 5000);

    return () => {
      clearInterval(check);
      clearTimeout(safety);
    };
  }, []);

  return (
    <motion.main
      className="flex-1"
      initial={false}
      animate={
        show
          ? { opacity: 1, filter: "blur(0px)" }
          : { opacity: 0, filter: "blur(4px)" }
      }
      transition={{ duration: 0.6, ease: appleEase }}
    >
      {children}
    </motion.main>
  );
}
