"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

const BOOT_LINES = [
  { text: "Hedgents Fleet v0.1.0", color: "#93c5fd", delay: 0 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "#52525b", delay: 200 },
  { text: "  initializing p2p stack...", color: "#a1a1aa", delay: 400 },
  { text: "  loading Ed25519 role keys...", color: "#a1a1aa", delay: 700 },
  { text: "  verifying compile-time isolation...", color: "#a1a1aa", delay: 1000 },
  { text: "  spawning daemons:", color: "#a1a1aa", delay: 1300 },
  { text: "    [ok] multiply-daemon", color: "#86efac", delay: 1600 },
  { text: "    [ok] stable-yield-daemon", color: "#86efac", delay: 1800 },
  { text: "    [ok] hedgedjlp-daemon", color: "#86efac", delay: 2000 },
  { text: "    [ok] riskwatcher-daemon (read-only)", color: "#86efac", delay: 2200 },
  { text: "    [ok] researcher-daemon (read-only)", color: "#86efac", delay: 2400 },
  { text: "  mesh established :: 5 peers", color: "#a1a1aa", delay: 2700 },
  { text: "  dashboard listening on 127.0.0.1:7700", color: "#a1a1aa", delay: 2900 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "#52525b", delay: 3100 },
];

const TOTAL_DURATION = 2200; // ms before fade out starts
const FADE_DURATION = 800; // ms for the fade out — sync with PageEntrance

export function LoadingScreen() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [shouldShow, setShouldShow] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("hedgents-loaded") !== "1";
  });

  const handleExit = useCallback(() => {
    sessionStorage.setItem("hedgents-loaded", "1");
    setExiting(true);
    setTimeout(() => setShouldShow(false), FADE_DURATION);
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    const timers: NodeJS.Timeout[] = [];
    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay);
      timers.push(t);
    });

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100));
      setProgress(pct);
    }, 40);

    const t = setTimeout(handleExit, TOTAL_DURATION);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
      clearTimeout(t);
    };
  }, [shouldShow, handleExit]);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: FADE_DURATION / 1000, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/4 blur-[120px] pointer-events-none" />

          <div className="relative w-full max-w-lg px-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <img
                src="/logo.jpg"
                alt="Hedgents"
                className="h-14 w-auto"
              />
            </motion.div>

            {/* Terminal */}
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/80 overflow-hidden shadow-2xl shadow-black/40">
              {/* Header bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <span className="ml-2 font-mono text-[11px] text-zinc-600">
                  hedgents@on-premise
                </span>
              </div>

              {/* Boot output */}
              <div className="px-4 py-4 font-mono text-[11px] sm:text-xs leading-relaxed min-h-[260px]">
                {BOOT_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: visibleLines.includes(i) ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ color: line.color }}
                  >
                    {line.text}
                  </motion.div>
                ))}

                {/* Blinking cursor on last line during boot */}
                {visibleLines.length >= BOOT_LINES.length && (
                  <span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse ml-0.5" />
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 flex items-center gap-3 font-mono text-xs text-zinc-500">
              <span>initializing</span>
              <div className="flex-1 h-px bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
              <span className="tabular-nums w-8 text-right">{progress}%</span>
            </div>

            {/* Skip hint */}
            {progress > 50 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center text-[10px] text-zinc-600 font-mono"
              >
                your hardware. your keys.
              </motion.p>
            )}

            <button
              type="button"
              onClick={handleExit}
              className="mt-4 w-full text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600 transition-colors hover:text-zinc-300"
            >
              Skip boot
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
