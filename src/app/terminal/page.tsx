import type { Metadata } from "next";
import { HgMetalTerminal } from "@/components/hgmetal-terminal";

export const metadata: Metadata = {
  title: "hgMETAL · terminal",
  robots: { index: false, follow: false },
};

export default function TerminalPage() {
  return <HgMetalTerminal />;
}
