import type { Metadata } from "next";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { privacyStatus, dataCategories, privacySections } from "@/lib/content/privacy";
import { SITE_URL } from "@/lib/constants";

const description =
  "Privacy information for Code Yaar Global Founding Community applications — what is collected, how it is used, and your choices.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Code Yaar | Privacy — Founding Community",
    template: "%s — Code Yaar",
  },
  description,
  openGraph: {
    title: "Code Yaar | Privacy — Founding Community",
    description,
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Privacy information"
          title="How your application is handled"
          description={privacyStatus}
        />
        <div className="mt-10 prose-body max-w-none">
          {privacySections.map((section) => (
            <section key={section.id} className="mb-10">
              <h3 className="mb-3">{section.title}</h3>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
        <div className="mt-12 card-hairline p-8">
          <p className="type-label mb-3">What we collect</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dataCategories.map((category) => (
              <div key={category.category} className="flex flex-col gap-1.5">
                <span className="type-small text-[#087a52] font-medium">
                  {category.category}
                </span>
                <p className="type-body text-sm">{category.fields}</p>
                <p className="type-caption text-sm">{category.purpose}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 type-caption">
          Fields marked required in the form are needed to review an
          application. Optional fields can be left empty without affecting your
          application.
        </p>
      </SectionInner>
    </Section>
  );
}
