import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

// Super Funky font
const funkyFont = localFont({
  src: [
    {
      path: "../fonts/SuperFunky-lgmWw.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-funky",
  fallback: ["Arial", "sans-serif"],
});

// Bitblast fonts
const bitblastSans = localFont({
  src: [
    {
      path: "../fonts/BitblastSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bitblast-sans",
  fallback: ["Arial", "sans-serif"],
});

const bitblastSansTextured = localFont({
  src: [
    {
      path: "../fonts/BitblastSans-Textured.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bitblast-sans-textured",
  fallback: ["Arial", "sans-serif"],
});

const bitblastSerif = localFont({
  src: [
    {
      path: "../fonts/BitblastSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bitblast-serif",
  fallback: ["Arial", "sans-serif"],
});

const bitblastSerifTextured = localFont({
  src: [
    {
      path: "../fonts/BitblastSerif-Textured.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bitblast-serif-textured",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Ferment Buddy - Your Fermentation Companion",
  description: "Upload and track your fermentation progress with Ferment Buddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable} ${funkyFont.variable} ${bitblastSans.variable} ${bitblastSansTextured.variable} ${bitblastSerif.variable} ${bitblastSerifTextured.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
