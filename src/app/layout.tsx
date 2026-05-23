import type { Metadata } from "next";
import { Barlow_Condensed, Rajdhani } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800"],
  variable: "--font-big-shoulders",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  weight: ["400", "500", "600"],
  variable: "--font-rajdhani",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satvik Dua — Software, Robotics, AI",
  description: "Portfolio of Satvik Dua. Full-stack engineering, embedded systems, and AI deployment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${rajdhani.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
