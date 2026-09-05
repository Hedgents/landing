import Link from "next/link";
import { HedgentsLogo } from "@/components/hedgents-logo";
import { WaitlistButton } from "@/components/waitlist-modal";

const LINKS = [
  { href: "/#how-it-works", label: "Passport" },
  { href: "/#metals", label: "Metals" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#171918] text-white">
      <nav className="mx-auto flex h-16 max-w-[1220px] items-center justify-between px-5 sm:px-7">
        <HedgentsLogo inverse />

        <div className="hidden items-center lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-l border-white/10 px-5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/blog"
            className="border-x border-white/10 px-5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-white"
          >
            Journal
          </Link>
        </div>

        <WaitlistButton
          source="navbar-metal-router"
          label="Request access"
          className="min-h-9 cursor-pointer border border-[#c79b47] bg-[#c79b47] px-3.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-[#171918] transition-colors hover:bg-transparent hover:text-[#c79b47] sm:px-4"
        />
      </nav>
    </header>
  );
}
