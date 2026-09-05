import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Background } from "@/components/background";

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
  metadataBase: new URL("https://hedgents.com"),
  title: "Hedgents · Trade metals onchain",
  description:
    "Discover, compare, and trade metal products across supported onchain markets through one self-custodial interface.",
  keywords: [
    "metals on Solana",
    "tokenized metals",
    "gold on Solana",
    "silver on Solana",
    "metal trading",
    "onchain metal trading",
    "Solana",
    "Hyperliquid",
  ],
  icons: {
    icon: [{ url: "/brand/hedgents-source-app-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Hedgents · Trade metals onchain",
    description:
      "One interface to discover, compare, and trade metal products across supported chains and venues.",
    url: "https://hedgents.com",
    type: "website",
    images: [
      {
        url: "/brand/hedgents-source-app-icon.png",
        width: 330,
        height: 330,
        alt: "Hedgents Hg mark",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Hedgents · Metal execution network",
    description: "One interface for onchain metal markets.",
    images: ["/brand/hedgents-source-app-icon.png"],
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
        <Background />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
