import Link from "next/link";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export function CohortIntroSection() {
  const points = [
    "A global cohort, assembled from open applications.",
    "Beginners are the core audience, not an exception.",
    "Asynchronous by design, so time zones do not decide who can take part.",
    "Honest about what exists today and what is still being planned.",
  ];

  return (
    <Section padded>
      <SectionInner>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="The First 100"
              title="The first hundred members of a community being built in the open."
              description={
                <>
                  The First 100 is the initial global founding community around
                  Code Yaar — a small group of learners and aspiring developers
                  who join before the platform is finished. Founding members
                  test early ideas, take part in practical activities as they
                  become available, give feedback, and set the culture for
                  everyone who joins later. They are participants, not an
                  audience.
                </>
              }
            />
            <p className="mt-4 type-body">
              <span className="font-semibold text-[#123d2b]">Early stage.</span>{" "}
              The community is being assembled now, and activities will grow
              with the people in it.
            </p>
            <ul className="mt-8 space-y-3 prose-body">
              {points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-[#087a52] font-medium">
                    &mdash;
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:block">
            <div className="card-hairline p-8 lg:p-10">
              <p className="type-caption mb-3">What to expect</p>
              <ul className="space-y-4 prose-body">
                <li>Early community participation</li>
                <li>Product feedback opportunities</li>
                <li>Learning discussions</li>
                <li>Collaborative activities as they become available</li>
                <li>Project showcases</li>
                <li className="type-small text-[#6b7a70]">
                  Founding recognition, subject to participation
                </li>
              </ul>
              <p className="mt-6 type-caption text-[#6b7a70]">
                We do not promise jobs, internships, scholarships, or
                certifications. Founding recognition is tied to participation.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 lg:mt-16 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/cohort"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#e8ece8] bg-[#ffffff] px-6 py-3 text-base font-medium text-[#19231d] transition-colors hover:bg-[#f2f5f3] hover:text-[#087a52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]"
          >
            Explore the Cohort
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#087a52] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#176b47] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]"
          >
            Apply for the Founding Cohort
          </Link>
        </div>
      </SectionInner>
    </Section>
  );
}
