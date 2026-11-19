import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  dataCategories,
  privacyChanges,
  privacySections,
  privacyStatus,
} from "@/lib/content/privacy";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What the Code Yaar founding cohort application collects, why it is collected, who can access it, and how to ask for correction or deletion.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy — Code Yaar founding cohort",
    description:
      "How application information is collected, used and handled for The First 100.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="What we collect, and what we deliberately do not."
        lead="This page describes the application for the founding cohort. It is written to be read, not to be survived."
        aside={
          <div className="rounded-[6px] border border-line-strong bg-surface p-5">
            <p className="type-label text-ink-subtle">Status</p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
              {privacyStatus}
            </p>
          </div>
        }
      />

      <Section bordered={false}>
        <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              eyebrow="Summary"
              title="Short version"
              titleClassName="text-[1.75rem]"
            />
          </div>

          <div className="max-w-[62ch] space-y-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            <p>
              The application asks for what is needed to review your application
              and run the cohort. It does not ask for a date of birth, address,
              phone number, identity documents, or sensitive personal details.
            </p>
            <p>
              This website has no database and no analytics. Your answers are
              sent to an external submission service and nothing is stored here.
              Optional answers can be left empty without affecting your
              application.
            </p>
            <p>
              GitHub, LinkedIn and portfolio links are optional. Applicants
              without them are not disadvantaged.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Data categories"
          title="What the application collects"
          intro="Each field is listed with the reason it exists. If a field has no clear purpose, it should not be in the form."
        />

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">
              Application fields, their purpose, and whether they are required
            </caption>
            <thead>
              <tr className="border-y border-line-strong">
                <th scope="col" className="py-3 pr-4 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-ink-subtle">
                  Category
                </th>
                <th scope="col" className="py-3 pr-4 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-ink-subtle">
                  Fields
                </th>
                <th scope="col" className="py-3 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-ink-subtle">
                  Why
                </th>
              </tr>
            </thead>
            <tbody>
              {dataCategories.map((row) => (
                <tr key={row.category} className="border-b border-line align-top">
                  <th
                    scope="row"
                    className="py-4 pr-4 text-[0.875rem] font-medium text-ink"
                  >
                    {row.category}
                  </th>
                  <td className="py-4 pr-4 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {row.fields}
                  </td>
                  <td className="py-4 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {row.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.5fr_1.5fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Details"
              title="How it is handled"
              titleClassName="text-[1.75rem]"
            />
          </div>

          <div className="max-w-[62ch]">
            {privacySections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="border-t border-line py-8 first:border-t-0 first:pt-0"
              >
                <h2 className="text-[1.125rem] font-semibold text-ink">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[0.9375rem] leading-relaxed text-ink-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-2 border-t border-line pt-6">
              <h2 className="text-[1.125rem] font-semibold text-ink">
                Contact
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                A dedicated privacy contact has not been confirmed yet, so no
                address is listed here. This is a known gap and a launch
                requirement, not an oversight. Until an address is published,
                no live applications should be collected through this site.
              </p>
            </div>

            <p className="mt-8 border-l-2 border-line-strong pl-4 text-[0.8125rem] leading-relaxed text-ink-subtle">
              {privacyChanges}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
