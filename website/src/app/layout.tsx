import type { Metadata } from "next";
import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  description:
    "Renaatus Projects is a premier EPC, luxury realty, and AAC manufacturing group with a 50-year construction legacy across India, Maldives, and Mauritius.",
  metadataBase: new URL("https://www.renaatus.com"),
  openGraph: {
    title: "Renaatus",
    description: "Infrastructure, luxury realty, and Renacon AAC blocks.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${candara.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-ink text-cream">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
