import type { Metadata, Viewport } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/lib/theme";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE_URL } from "@/lib/constants";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb-mono",
  weight: ["400", "500"],
  display: "swap",
});

const title = "Code Yaar | The First 100 — Global Founding Cohort";
const description =
  "Join Code Yaar's Global Founding Community — The First 100. A founding cohort of learners and aspiring developers worldwide, building practical skills together from day one.";

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
  themeColor: "#07110f",
};

const themeScript = `
  (function () {
    try {
      var stored = localStorage.getItem("codeyaar-theme");
      var osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var theme = (stored === "light" || stored === "dark") ? stored : (osDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {
      // Storage unavailable; leave attribute to CSS/default.
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${jbMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[6px] focus:bg-[var(--color-emerald-900)] focus:px-4 focus:py-2 focus:text-[0.875rem] focus:text-ink"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
