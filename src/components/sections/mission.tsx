import Link from "next/link";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";

export function MissionSection() {
  const items = [
    "Learning through practice — building real things, not just consuming tutorials.",
    "Building meaningful projects and showing unfinished work.",
    "Sharing knowledge so the group learns faster than any individual.",
    "Collaborating across countries and time zones.",
    "Contributing honest feedback that shapes the community and the platform.",
  ];

  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Why this exists"
          title="More than a learning platform. A community of builders."
          description={
            <>
              Programming education rarely fails because there isn&rsquo;t enough
              material. It fails because watching, reading, and collecting
              tutorials is not the same as understanding something well enough
              to use it. Code Yaar is being built as a practical learning
              platform — and the founding community is where that belief is
              tested with real learners, from the beginning.
            </>
          }
        />
        <ul className="mt-10 prose-body">
          {items.map((item, index) => (
            <li key={index} className="relative pl-5">
              <span className="absolute -top-0.5 left-0 hidden sm:block">
                <Badge variant="outline">{index + 1}</Badge>
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center">
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
