"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "problem",          label: "The gap" },
  { id: "fleet",            label: "Fleet" },
  { id: "differentiators",  label: "Safety" },
  { id: "benchmarks",       label: "Benchmarks" },
  { id: "architecture",     label: "Architecture" },
  { id: "faq",              label: "FAQ" },
  { id: "risks",            label: "Risks" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled ? "border-b border-white/10 backdrop-blur-xl" : ""
      )}
      style={{ backgroundColor: "var(--navy)" }}
    >
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 group"
        >
          <img src="/logo.jpg" alt="Hedgents" className="h-5 w-auto" />
          <span className="font-serif text-sm font-bold text-white group-hover:opacity-80 transition-opacity">
            hedgents
          </span>
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="px-3 py-1.5 text-xs text-white/50 hover:text-white/90 transition-colors font-mono"
            >
              {s.label}
            </button>
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
          <a
            href="mailto:contact@hedgents.com"
            className="inline-flex items-center justify-center rounded px-3 py-1 font-mono text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
          >
            Request access →
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
