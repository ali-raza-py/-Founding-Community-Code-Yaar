import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const practice = [
  "Learning through practice — building real things, not just consuming tutorials.",
  "Building meaningful projects and showing unfinished work.",
  "Sharing knowledge so the group learns faster than any individual.",
  "Collaborating across countries and time zones.",
  "Contributing honest feedback that shapes the community and the platform.",
];

export function MissionSection() {
  return (
    <Section className="bg-canvas pt-8 pb-home-section sm:pt-10 lg:pt-12">
      <SectionInner>
        <SectionHeading
          className="max-w-3xl"
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
        <ul className="type-body-muted mt-6 max-w-3xl list-disc space-y-2 pl-5 marker:text-emerald">
          {practice.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/cohort"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "bg-surface px-5")}
          >
            Explore the Cohort
          </Link>
          <Link href="/apply" className={cn(buttonVariants({ size: "lg" }), "px-5")}>
            Apply for the Founding Cohort
          </Link>
        </div>
      </SectionInner>
    </Section>
  );
}
