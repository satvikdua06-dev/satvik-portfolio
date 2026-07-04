import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Three registers: muscular DIN-rooted display for titles only, quiet
// geometric body for reading, monospace strictly for data and chrome.
const display = Barlow_Condensed({
  weight: ["500", "600", "700"],
  variable: "--font-display-face",
  subsets: ["latin"],
});

const body = Space_Grotesk({
  weight: ["400", "500"],
  variable: "--font-body-face",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-mono-face",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satvik Dua — SDE + AI",
  description:
    "I build robust computer vision systems, graph databases, and data infrastructure designed to run reliably under real-world constraints.",
  openGraph: {
    title: "Satvik Dua — SDE + AI",
    description:
      "I build robust computer vision systems, graph databases, and data infrastructure designed to run reliably under real-world constraints.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b08",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
