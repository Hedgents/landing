import { Hero } from "@/components/hero";
import { TwoProducts } from "@/components/two-products";
import { ProofStrip } from "@/components/proof-strip";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="bg-background">
        <TwoProducts />
        <ProofStrip />
      </div>
      <CTA />
    </div>
  );
}
