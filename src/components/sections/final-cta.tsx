import Link from "next/link";

import { Section, SectionInner } from "@/components/ui/section";

export function FinalCtaSection() {
  return (
    <Section padded>
      <SectionInner className="card-hairline p-10 sm:p-14 lg:p-16 text-center">
        <div className="mx-auto max-w-[46rem]">
          <p className="type-label mb-3">Be part of the beginning.</p>
          <h2 className="mb-6">Apply to The First 100.</h2>
          <p className="type-body-muted mb-10">
            One hundred places, filled through open applications. Beginners are
            welcome. No prior experience required.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#087a52] px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#176b47] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]"
          >
            Apply to The First 100
          </Link>
        </div>
      </SectionInner>
    </Section>
  );
}
