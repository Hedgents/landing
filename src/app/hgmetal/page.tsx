import type { Metadata } from "next";
import { HgMetal } from "@/components/hgmetal";

export const metadata: Metadata = {
  title: "hgMETAL — Metals structured products, autonomously run | Hedgents",
  description:
    "Metals-focused structured products on Solana — gold, silver, platinum, palladium — operated by an autonomous role-isolated agent fleet and tranched into senior (hgUSD) and junior (hgYIELD) products. The v0 fleet proved the architecture; hgMETAL scales it to metals.",
  openGraph: {
    title: "hgMETAL — Metals structured products, autonomously run",
    description:
      "An autonomous, role-isolated fleet rebalancing across cross-metal strategies, tranched into senior/junior products. Settlement layer live on devnet.",
    url: "https://hedgents.com/hgmetal",
    type: "website",
  },
};

export default function HgMetalPage() {
  return <HgMetal />;
}
