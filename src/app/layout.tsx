import type { Metadata, Viewport } from "next";
import { Archivo, Big_Shoulders, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({
  weight: ["500", "600", "700", "800"],
  variable: "--font-big-shoulders",
  subsets: ["latin"],
});

const body = Archivo({
  weight: ["400", "500"],
  variable: "--font-archivo",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satvik Dua — Field Systems Engineer",
  description:
    "Computer vision on live drilling rigs, data pipelines, and full-stack systems in production. RigVision, WellAnalysis, Notarium, STI Portal.",
  openGraph: {
    title: "Satvik Dua — Field Systems Engineer",
    description:
      "Vision systems that watch live drilling rigs — and the software that ships around them.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0a",
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
