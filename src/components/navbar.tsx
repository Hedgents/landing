"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { WaitlistButton } from "@/components/waitlist-modal";

// Two-product structure: hgMETAL (flagship) + the treasury fleet, plus
// the live dashboard. Routes, not homepage anchors.
const LINKS = [
  { href: "/fleet", label: "Treasury fleet", gold: false },
  { href: "/dashboard", label: "Dashboard", gold: false },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled ? "border-b border-white/10 backdrop-blur-xl" : ""
      )}
      style={{ backgroundColor: "var(--navy)" }}
    >
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
        {/* Logo — always returns to home */}
        <a href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.jpg" alt="Hedgents" className="h-5 w-auto" />
          <span className="font-serif text-sm font-bold text-white group-hover:opacity-80 transition-opacity">
            hedgents
          </span>
        </a>

        {/* Nav links — product routes */}
        <div className="hidden md:flex items-center gap-0.5">
          <a
            href="/hgmetal"
            className="px-3 py-1.5 text-xs transition-colors font-mono"
            style={{ color: "var(--gold)" }}
          >
            hgMETAL
          </a>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-xs text-white/50 hover:text-white/90 transition-colors font-mono"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Hedgents/fleet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors font-mono"
          >
            GitHub
          </a>
          <WaitlistButton
            source="navbar"
            label="Join waitlist"
            className="inline-flex items-center justify-center rounded px-3 py-1 font-mono text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
          />
        </div>
      </nav>
    </motion.header>
  );
}
