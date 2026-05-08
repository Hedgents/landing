import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Fleet } from "@/components/fleet";
import { Differentiators } from "@/components/differentiators";
import { Architecture } from "@/components/architecture";
import { FAQ } from "@/components/faq";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="bg-background">
        <Problem />
        <Fleet />
        <Differentiators />
        <Architecture />
        <FAQ />
      </div>
    </div>
  );
}
