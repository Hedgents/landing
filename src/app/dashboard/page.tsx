import type { Metadata } from "next";
import { HgMetalDashboard } from "@/components/hgmetal-dashboard";

export const metadata: Metadata = {
  title: "hgMETAL · fleet dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <HgMetalDashboard />;
}
