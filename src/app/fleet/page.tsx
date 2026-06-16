import type { Metadata } from "next";
import { Problem } from "@/components/problem";
import { ProofStrip } from "@/components/proof-strip";
import { Fleet } from "@/components/fleet";
import { Differentiators } from "@/components/differentiators";
import { Benchmarks } from "@/components/benchmarks";
import { Architecture } from "@/components/architecture";
import { FAQ } from "@/components/faq";
import { Risks } from "@/components/risks";
import { CTA } from "@/components/cta";

export const metadata: Metadata = {
  title: "Hedgents Fleet · autonomous USDC treasury management",
  description:
    "An autonomous role-based agent fleet that runs vetted Solana yield strategies on your own hardware, your keys. The engine behind hgMETAL. Offered as a subscription.",
};

export default function FleetPage() {
  return (
    <main>
      {/* Fleet product intro */}
      <section className="relative px-6 pt-20 pb-12" style={{ backgroundColor: "var(--navy)" }}>
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
            Infrastructure · the engine behind hgMETAL · also a subscription
          </p>
          <h1 className="font-serif font-bold text-white leading-tight" style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>
            Hedgents Fleet
          </h1>
          <p className="font-serif italic mt-4" style={{ color: "var(--gold)", fontSize: "clamp(16px, 2vw, 22px)", maxWidth: "560px" }}>
            Autonomous USDC treasury management. On your hardware, your keys.
          </p>
          <p className="mt-6 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", maxWidth: "620px" }}>
            A role-based fleet of agents that runs vetted Solana yield strategies for a USDC treasury, with separated powers so no single
            agent can both trade and change its own limits. It runs on your machines; there is no Hedgents server holding your keys. It
            powers our flagship hgMETAL product, and we offer it as a subscription for treasuries that want the same engine.
          </p>
          <p className="mt-4 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "620px" }}>
            Status, stated plainly: this is an early product. It runs our own treasury live on Solana mainnet today; the multi-tenant,
            self-serve subscription is in build. Talk to us if you want in early.
          </p>
        </div>
      </section>

      <Problem />
      <ProofStrip />
      <Fleet />
      <Differentiators />
      <Benchmarks />
      <Architecture />
      <FAQ />
      <Risks />
      <CTA />
    </main>
  );
}
