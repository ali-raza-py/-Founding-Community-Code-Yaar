import Link from "next/link";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export function BenefitsSection() {
  const benefits = [
    {
      title: "Early community participation",
      detail:
        "Join before the platform is finished and help shape how it grows — founding members set the culture for everyone who comes later.",
    },
    {
      title: "Product feedback opportunities",
      detail:
        "Test early ideas and tell the Code Yaar team what is useful and what is not. Your input directly influences what gets built.",
    },
    {
      title: "Learning discussions",
      detail:
        "Take part in practical, asynchronous-first activities where you can ask questions, show work in progress, and learn alongside others.",
    },
    {
      title: "Collaborative activities",
      detail:
        "Work on challenges and projects with members from different countries and time zones, at your own pace.",
    },
    {
      title: "Project showcases",
      detail:
        "Highlight what you have built — including the unfinished parts — and get honest feedback from the community.",
    },
    {
      title: "Founding recognition",
      detail:
        "Recognition as a founding member is tied to your participation. It is not a certificate, job, internship, or scholarship.",
    },
  ];

  return (
    <Section padded className="bg-[#f2f5f3]">
      <SectionInner>
        <SectionHeading
          eyebrow="What founding members get"
          title="Benefits of The First 100"
          description="Honest benefits for founding members — no overpromises."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="card-hairline p-6 hover-lift"
            >
              <span className="type-label block mb-2">
                {index + 1}
              </span>
              <h4 className="mb-2">{benefit.title}</h4>
              <p className="type-body">{benefit.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 card-hairline p-8 lg:p-10">
          <p className="type-label mb-3">About certification</p>
          <p className="type-body mb-4">
            Code Yaar does not currently offer certificates, certifications,
            jobs, internships, or scholarships through the founding cohort.
            Founding membership is about participation, practice, and helping
            build the community — not a credential.
          </p>
          <p className="type-body-muted">
            If certification is ever added in the future, it will be announced
            on this site and in the cohort details before anyone is asked to
            rely on it.
          </p>
        </div>
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
