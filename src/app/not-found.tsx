import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container>
      <div className="max-w-[36rem] py-24 md:py-32">
        <p className="type-label text-[#087a52]">404</p>
        <h1 className="type-h2 mt-4">This page does not exist.</h1>
        <p className="mt-4 type-body-muted">
          The link may be out of date, or the page may have moved. The cohort
          details and the application are both a click away.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#e8ece8] bg-[#ffffff] px-6 py-3 text-sm font-medium text-[#19231d] transition-colors hover:bg-[#f2f5f3] hover:text-[#087a52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]"
          >
            Back to home
          </Link>
          <Link
            href="/cohort"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#087a52] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#176b47] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]"
          >
            Explore the Cohort
          </Link>
        </div>
      </div>
    </Container>
  );
}
