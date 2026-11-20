import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section, SectionInner } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
  return (
    <Section className="py-home-section">
      <SectionInner>
        <div className="card-hairline px-5 py-8 text-center sm:px-10 sm:py-12">
          <p className="type-label mb-3">Be part of the beginning.</p>
          <h2>Apply to The First 100.</h2>
          <p className="type-body-muted mx-auto mt-4 max-w-xl">
            One hundred places, filled through open applications. Beginners are
            welcome. No prior experience required.
          </p>
          <Link href="/apply" className={cn(buttonVariants({ size: "lg" }), "mt-6 px-5")}>
            Apply to The First 100
          </Link>
        </div>
      </SectionInner>
    </Section>
  );
}
