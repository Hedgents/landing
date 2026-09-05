import Link from "next/link";
import { HedgentsLogo } from "@/components/hedgents-logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#111312] text-white">
      <div className="mx-auto max-w-[1220px] px-5 py-12 sm:px-7 sm:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <HedgentsLogo inverse />
            <p className="mt-6 max-w-md font-serif text-xl italic leading-snug text-white/55">
              One interface for onchain metal markets.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40 sm:grid-cols-3">
            <Link href="/#how-it-works" className="transition-colors hover:text-white">
              Passport
            </Link>
            <Link href="/#metals" className="transition-colors hover:text-white">
              Metal map
            </Link>
            <Link href="/blog" className="transition-colors hover:text-white">
              Journal
            </Link>
            <a href="mailto:contact@hedgents.com" className="transition-colors hover:text-white">
              Contact
            </a>
            <a
              href="https://github.com/Hedgents"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 font-mono text-[8px] uppercase tracking-[0.1em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <p>Route verification in progress · early access by request</p>
          <p>© {new Date().getFullYear()} Hedgents</p>
        </div>
      </div>
    </footer>
  );
}
