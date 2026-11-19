import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lead,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-line", className)}>
      <Container>
        <div className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16 lg:py-20">
          <div>
            <p className="type-label flex items-center gap-3 text-emerald-600">
              <span aria-hidden className="h-px w-8 bg-emerald-600/50" />
              {eyebrow}
            </p>
            <h1 className="type-display mt-5 max-w-[22ch] text-ink">{title}</h1>
            <p className="type-lead mt-6 max-w-[42rem]">{lead}</p>
          </div>
          {aside && <div className="lg:pb-2">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
