import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Background } from "@/components/background";
import { LoadingScreen } from "@/components/loading-screen";
import { PageEntrance } from "@/components/page-entrance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Hedgents · Institutional DeFi, Autonomous",
  description:
    "A self-hosted treasury management fleet of role-isolated autonomous agents on Solana. On-premise. Your hardware. Your keys.",
  keywords: [
    "DeFi",
    "Solana",
    "institutional",
    "treasury",
    "autonomous agents",
    "on-premise",
    "self-hosted",
  ],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Hedgents · Institutional DeFi, Autonomous",
    description:
      "A self-hosted treasury management fleet of role-isolated autonomous agents on Solana.",
    url: "https://hedgents.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LoadingScreen />
        <Background />
        <Navbar />
        <PageEntrance>{children}</PageEntrance>
        <Footer />
      </body>
    </html>
  );
}
