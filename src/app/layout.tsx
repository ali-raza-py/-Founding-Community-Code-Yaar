import type { Metadata, Viewport } from "next";
import { Inter_Tight, Newsreader } from "next/font/google";

import { ThemeProvider } from "@/lib/theme";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE_URL } from "@/lib/constants";

import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const title = "Code Yaar | The First 100 — Global Founding Cohort";
const description =
  "Join Code Yaar's Global Founding Cohort 2026–27. Connect with aspiring developers worldwide, participate in practical learning activities, and help shape a growing programming community.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s — Code Yaar",
  },
  description,
  applicationName: "Code Yaar",
  authors: [{ name: "Code Yaar" }],
  openGraph: {
    type: "website",
    siteName: "Code Yaar",
    title,
    description,
    url: "/",
    locale: "en",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1f17",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <html
        lang="en"
        className={`${interTight.variable} ${newsreader.variable}`}
      >
        <body className="flex min-h-screen flex-col antialiased">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[6px] focus:bg-[var(--color-emerald-950)] focus:px-4 focus:py-2 focus:text-[0.875rem] focus:text-ink"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </body>
      </html>
    </ThemeProvider>
  );
}