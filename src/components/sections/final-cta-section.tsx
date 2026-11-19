import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCtaSection({
  title = "Be part of the beginning.",
  body = "We're looking for curious learners, problem-solvers, and aspiring builders who want to contribute to something meaningful.",
  ctaLabel = "Apply to The First 100",
  ctaHref = "/apply",
}: {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-[var(--color-canvas)] dark:bg-gray-900 text-[var(--color-ink)]">
      <Container>
        <div className="grid gap-8 py-16 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-24">
          <div>
            <p className="type-label flex items-center gap-3 text-[var(--color-emerald-500)]">
              <span aria-hidden className="h-px w-8 bg-emerald-500/50" />
              The First 100
            </p>
            <h2 className="type-h2 mt-5 max-w-[18ch] text-[var(--color-ink)]">{title}</h2>
            <p className="mt-5 max-w-[36rem] text-[0.9375rem] leading-relaxed text-[var(--color-ink]/65)">
              {body}
            </p>
          </div>
          <div className="lg:justify-self-end">
            <ButtonLink href={ctaHref} variant="inverse" size="lg">
              {ctaLabel}
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
            <p className="mt-4 max-w-[20rem] text-[0.75rem] leading-relaxed text-[var(--color-ink]/45) lg:text-right">
              Applications are open worldwide. Submitting an application does not
              guarantee acceptance.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
