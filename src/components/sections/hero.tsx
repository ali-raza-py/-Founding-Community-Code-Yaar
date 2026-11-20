import Link from "next/link";

import { SectionInner } from "@/components/ui/section";

export function FoundingHero() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-36">
      <SectionInner className="text-center">
        <p className="type-label mx-auto mb-4 max-w-[42rem]">
          The First 100 &middot; Global Founding Cohort 2026–27
        </p>
        <h1 className="type-display mx-auto mb-6 max-w-[56rem]">
          A community built for the{" "}
          <span className="relative inline-block">
            <span className="text-[#087a52]">next generation</span> of builders.
          </span>
        </h1>
        <p className="type-lead mx-auto mb-10 max-w-[42rem] lg:mb-12">
          We&rsquo;re bringing together motivated learners and aspiring
          developers from around the world to learn, build, exchange ideas, and
          help shape the future of Code Yaar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/apply"
            className={`
              inline-flex items-center justify-center gap-2 rounded-md bg-[#087a52] px-6 py-3 text-base font-medium text-white
              transition-colors hover:bg-[#176b47] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]
            `}
          >
            Apply for the Founding Cohort
          </Link>
          <Link
            href="/cohort"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#e8ece8] bg-[#ffffff] px-6 py-3 text-base font-medium text-[#19231d] transition-colors hover:bg-[#f2f5f3] hover:text-[#087a52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]"
          >
            Explore the Cohort
          </Link>
        </div>
        <p className="mt-12 type-caption max-w-[42rem] mx-auto">
          An early-stage, independent community initiative by Code Yaar.
          Applications open worldwide.
        </p>
      </SectionInner>
    </section>
  );
}
