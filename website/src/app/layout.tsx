import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import { MotionProvider } from "@/components/motion/provider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const candara = localFont({
  src: [
    { path: "../fonts/candaral.ttf", weight: "300", style: "normal" },
    { path: "../fonts/candara.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-candara",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Renaatus | Building foundations across borders",
    template: "%s | Renaatus",
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: "Renaatus",
    description: "Infrastructure, luxury realty, and Renacon AAC blocks.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${candara.variable} h-full`}>
      <body className="bg-ink text-cream flex min-h-full flex-col antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
