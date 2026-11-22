import type { Metadata } from "next";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const description =
  "Code Yaar programmes: The First 100 Global Founding Cohort 2026&ndash;27 and the Code Yaar Global Ambassador Programme 2026&ndash;27. Choose how you want to take part.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Opportunities — Code Yaar Founding Community",
    template: "%s — Code Yaar",
  },
  description,
  openGraph: {
    title: "Opportunities — Code Yaar Founding Community",
    description,
    url: "/opportunities",
  },
};

interface ProgrammeCard {
  label: string;
  title: string;
  subtitle: string;
  description: string;
  who: string[];
  expectations: string[];
  cta: string;
  href: string;
}

const programmes: ProgrammeCard[] = [
  {
    label: "GLOBAL FOUNDING COHORT",
    title: "The First 100",
    subtitle: "Global Founding Cohort 2026&ndash;27",
    description:
      "A selected global group of learners and aspiring builders helping shape the early Code Yaar community. One hundred places, filled through open applications.",
    who: [
      "Students interested in programming and computer science",
      "Beginners who want practical skills rather than collected certificates",
      "Self-taught learners working alone who want community",
      "Aspiring developers preparing for a first role or project",
    ],
    expectations: [
      "No programming experience required",
      "Applications reviewed individually by people",
      "Asynchronous-first participation worldwide",
      "Contribute at your own realistic pace",
    ],
    cta: "Apply for The First 100",
    href: "/apply",
  },
  {
    label: "GLOBAL COMMUNITY LEADERSHIP",
    title: "Code Yaar Global Ambassador Programme",
    subtitle: "Global Ambassador Programme 2026&ndash;27",
    description:
      "Represent Code Yaar, connect with student and developer communities, and help bring learners and builders together worldwide. Campus, Community and Regional ambassador categories.",
    who: [
      "People interested in technology, education or community building",
      "Those who can communicate responsibly and contribute consistently",
      "Applicants with access to a relevant community or willingness to build one",
      "People able to dedicate approximately 3&ndash;5 hours per week",
    ],
    expectations: [
      "Introduce Code Yaar to relevant communities",
      "Share approved announcements and campaign materials",
      "Promote The First 100 when applications are open",
      "Submit regular activity reports",
    ],
    cta: "Apply for Global Ambassador Programme",
    href: "/ambassadors/apply",
  },
] as const;

export default function OpportunitiesPage() {
  return (
    <>
      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="Opportunities"
            title="Two programmes. One community."
            description={
              <>
                Code Yaar runs two independent programmes with separate
                applications and selection processes. Choose the path that fits
                how you want to contribute.
              </>
            }
          />
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {programmes.map((programme) => (
              <section
                key={programme.title}
                className="flex flex-col rounded-xl border border-line bg-surface p-6 sm:p-8 lg:p-10"
              >
                <div className="mb-4">
                  <p className="type-label text-emerald">{programme.label}</p>
                  <h2 className="mb-1 text-2xl font-semibold text-ink tracking-tight">
                    {programme.title}
                  </h2>
                  <p className="type-caption text-ink-subtle">
                    {programme.subtitle}
                  </p>
                </div>
                <p className="type-body text-ink-muted mb-6 leading-relaxed">
                  {programme.description}
                </p>

                <div className="mb-6 flex-grow">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
                    Who should apply
                  </h3>
                  <ul className="space-y-3 prose-body">
                    {programme.who.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-emerald font-medium text-sm">
                          &mdash;
                        </span>
                        <p className="type-body text-ink m-0 leading-relaxed">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 flex-grow">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
                    Key expectations
                  </h3>
                  <ul className="space-y-3 prose-body">
                    {programme.expectations.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-emerald font-medium text-sm">
                          &mdash;
                        </span>
                        <p className="type-body text-ink m-0 leading-relaxed">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={programme.href}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                >
                  {programme.cta}
                  <svg
                    aria-hidden
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-line bg-surface p-6 sm:p-8">
            <h3 className="mb-4 text-xl font-semibold text-ink">
              How the programmes differ
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-ink">The First 100</h4>
                <p className="type-body text-ink-muted sm:text-sm">
                  Founding cohort for learners and builders. Selection based on
                  motivation, learning mindset, consistency, initiative and
                  contribution potential. No coding experience required.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-ink">
                  Global Ambassador Programme
                </h4>
                <p className="type-body text-ink-muted sm:text-sm">
                  Community leadership role. Separate application and selection.
                  Ambassadors represent Code Yaar and promote the founding
                  cohort. 3&ndash;5 hours per week suggested.
                </p>
              </div>
            </div>
            <p className="mt-6 type-caption text-ink-subtle">
              Being selected as an ambassador does not guarantee admission into
              The First 100, and vice versa. Each programme has its own
              application form and review process.
            </p>
          </div>
        </SectionInner>
      </Section>
    </>
  );
}
