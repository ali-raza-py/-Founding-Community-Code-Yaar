import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const points = [
  "A global cohort, assembled from open applications.",
  "Beginners are the core audience, not an exception.",
  "Asynchronous by design, so time zones do not decide who can take part.",
  "Honest about what exists today and what is still being planned.",
];

export function CohortIntroSection() {
  return (
    <Section className="py-home-section">
      <SectionInner>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
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
            <p className="type-body-muted mt-4">
              <span className="font-semibold text-forest">Early stage.</span>{" "}
              The community is being assembled now, and activities will grow
              with the people in it.
            </p>
            <ul className="type-body-muted mt-6 list-disc space-y-2 pl-5 marker:text-emerald">
              {points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
<<<<<<< HEAD
          <div className="card-hairline self-start p-5 sm:p-7">
            <h3 className="text-base">What to expect</h3>
            <ul className="type-body-muted mt-4 list-disc space-y-2 pl-5 marker:text-emerald">
              <li>Early community participation</li>
              <li>Product feedback opportunities</li>
              <li>Learning discussions</li>
              <li>Collaborative activities as they become available</li>
              <li>Project showcases</li>
              <li>Founding recognition, subject to participation</li>
            </ul>
            <p className="type-caption mt-5 border-t border-line pt-4 text-ink-muted">
              We do not promise jobs, internships, scholarships, or
              certifications. Founding recognition is tied to participation.
            </p>
=======
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
                Founding recognition is tied to your participation in The
                First 100.
              </p>
            </div>
>>>>>>> 016fcdc069fd3796364ea519784a533d0f235f8a
          </div>
        </div>
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
