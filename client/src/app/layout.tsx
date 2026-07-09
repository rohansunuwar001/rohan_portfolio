import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import SmoothScrollProvider from "../components/effects/SmoothScrollProvider";
import QueryProvider from "../components/effects/QueryProvider";
import SecurityDeterrent from "../components/effects/SecurityDeterrent";
import Preloader from "../components/effects/Preloader";

export const metadata: Metadata = {
  title: "Rohan | Creative Web Developer & Designer",
  description: "A premium portfolio showcasing high-end interactive websites using Next.js, Three.js, and GSAP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-[#e2e8f0]" suppressHydrationWarning>
        <QueryProvider>
          <Preloader />
          <SmoothScrollProvider>
            <SecurityDeterrent />
            {children}
          </SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
