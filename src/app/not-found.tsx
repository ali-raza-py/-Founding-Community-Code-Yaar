import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container>
      <div className="max-w-[36rem] py-24 md:py-32">
        <p className="type-label text-emerald-600">404</p>
        <h1 className="type-h2 mt-4 text-ink">This page does not exist.</h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
          The link may be out of date, or the page may have moved. The cohort
          details and the application are both a click away.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/cohort" variant="secondary">
            Explore the Cohort
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
