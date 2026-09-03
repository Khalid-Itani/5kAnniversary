import type { Metadata } from "next";
import { Barlow_Condensed, Geist } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

const geist = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Coach Arena 5K | Five-Year Anniversary",
    template: "%s | Coach Arena 5K",
  },
  description:
    "Run, walk, remember, and help fund the Robert Arena Scholarship for Hudson County students.",
  openGraph: {
    title: "Coach Arena 5K — Five-Year Anniversary",
    description:
      "Join us October 18, 2026 at Lincoln Park in Jersey City to honor Coach Robert Arena.",
    images: ["/images/event-flyer.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${barlowCondensed.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
