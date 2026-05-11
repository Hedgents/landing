"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type AnimatedPercentProps = {
  value: number;
  active?: boolean;
  decimals?: number;
  durationMs?: number;
  suffix?: string;
};

export function AnimatedPercent({
  value,
  active = true,
  decimals = 2,
  durationMs = 900,
  suffix = "%",
}: AnimatedPercentProps) {
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      const raf = requestAnimationFrame(() => {
        displayRef.current = value;
        setDisplay(value);
      });
      return () => cancelAnimationFrame(raf);
    }

    let raf = 0;
    const start = performance.now();
    const from = displayRef.current;
    const delta = value - from;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + delta * eased;
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, durationMs, reduceMotion, value]);

  return (
    <>
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
}
