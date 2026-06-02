import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { ProofStrip } from "@/components/proof-strip";
import { Fleet } from "@/components/fleet";
import { Differentiators } from "@/components/differentiators";
import { Benchmarks } from "@/components/benchmarks";
import { Architecture } from "@/components/architecture";
import { FAQ } from "@/components/faq";
import { Risks } from "@/components/risks";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="bg-background">
        <Problem />
        <ProofStrip />
        <Fleet />
        <Differentiators />
        <Benchmarks />
        <Architecture />
        <FAQ />
        <Risks />
      </div>
      <CTA />
    </div>
  );
}
