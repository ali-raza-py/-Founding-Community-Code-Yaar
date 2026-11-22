import type { Metadata } from "next";

import Link from "next/link";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_URL } from "@/lib/constants";

const description =
  "Code Yaar Global Ambassador Programme 2026&ndash;27. Represent Code Yaar, connect communities, and help grow the global learning ecosystem. Apply to become a Campus, Community or Regional Ambassador.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Global Ambassador Programme — Code Yaar Founding Community",
    template: "%s — Code Yaar",
  },
  description,
  openGraph: {
    title: "Global Ambassador Programme — Code Yaar Founding Community",
    description,
    url: "/ambassadors",
  },
};

const responsibilities = [
  "Introduce Code Yaar to relevant communities",
  "Share approved announcements and campaign materials",
  "Promote The First 100 when applications are open",
  "Identify relevant universities, societies and developer groups",
  "Participate in community initiatives",
  "Submit regular activity reports",
  "Maintain professional and ethical communication",
  "Follow official branding and communication guidelines",
];

const categories = [
  {
    title: "Campus Ambassador",
    description:
      "Represents Code Yaar within a college or university environment.",
  },
  {
    title: "Community Ambassador",
    description:
      "Engages with online developer communities, student groups and technology communities.",
  },
  {
    title: "Regional Ambassador",
    description:
      "Helps coordinate outreach and community development across a broader geographical region.",
  },
] as const;

const eligibility = [
  "Have an interest in technology, education or community building",
  "Communicate responsibly",
  "Be willing to contribute consistently",
  "Have access to a relevant community or a willingness to build one",
  "Be able to dedicate approximately 3&ndash;5 hours per week",
  "Be willing to follow programme guidelines",
];

const benefits = [
  {
    title: "Official digital appointment certificate",
    detail: "Issued after onboarding.",
    guaranteed: true,
  },
  {
    title: "Experience certificate",
    detail: "Upon successful completion of the programme.",
    guaranteed: true,
  },
  {
    title: "Official recognition",
    detail: "For meaningful contributions to the community.",
    guaranteed: false,
  },
  {
    title: "Community leadership experience",
    detail: "Real experience representing an organisation and coordinating outreach.",
    guaranteed: true,
  },
  {
    title: "Networking",
    detail: "With other ambassadors and the Code Yaar team.",
    guaranteed: true,
  },
  {
    title: "Documented contributions",
    detail: "For personal portfolios.",
    guaranteed: true,
  },
  {
    title: "Performance-based recognition",
    detail: "Including consideration for recommendation letters for outstanding contributions.",
    guaranteed: false,
  },
] as const;

const selectionSteps = [
  "Submit Application",
  "Application Review",
  "Shortlisting",
  "Referral Stage (5 qualified referrals)",
  "Interview or practical evaluation where appropriate",
  "Final Selection",
  "Orientation and Onboarding",
] as const;

const referralSteps = [
  {
    step: "Step 01",
    title: "Apply",
    description:
      "Submit your Global Ambassador application. Applications are reviewed individually by the Code Yaar team.",
  },
  {
    step: "Step 02",
    title: "Get Shortlisted",
    description:
      "If shortlisted, you will receive a personal referral link and referral code. Not every applicant is shortlisted.",
  },
  {
    step: "Step 03",
    title: "Refer five qualified applicants",
    description:
      "Share The First 100 founding cohort application with five genuinely interested and suitable people who complete their applications through your referral link.",
  },
  {
    step: "Step 04",
    title: "Verification",
    description:
      "The team reviews referral registrations for authenticity, eligibility and genuine interest. Five verified referrals satisfy the referral requirement.",
  },
  {
    step: "Step 05",
    title: "Interview and final selection",
    description:
      "Candidates who satisfy the referral requirement may progress to interviews and subsequent evaluation. Completing the referral stage does not guarantee ambassador appointment.",
  },
] as const;

export default function AmbassadorsPage() {
  return (
    <>
      <Section padded>
        <SectionInner className="text-center">
          <p className="type-label mx-auto mb-4 max-w-[42rem] tracking-widest">
            CODE YAAR GLOBAL AMBASSADOR PROGRAMME 2026&ndash;27
          </p>
          <h1 className="type-display mx-auto mb-6 max-w-[56rem]">
            REPRESENT.{" "}
            <br className="hidden sm:block" />
            <span className="text-emerald">CONNECT.</span>{" "}
            <br className="hidden sm:block" />
            GROW.
          </h1>
          <p className="type-lead mx-auto mb-10 max-w-[42rem] lg:mb-12">
            Help build the next generation of technology learners. Represent
            Code Yaar, connect with student and developer communities and
            contribute to a growing global learning ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/ambassadors/apply"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Apply to Become an Ambassador
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-8 py-3.5 text-base font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Explore the Programme
            </Link>
          </div>
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <SectionHeading
            eyebrow="Why become an ambassador?"
            title="Represent Code Yaar in your community"
            description={
              <>
                Ambassadors are the bridge between Code Yaar and the communities
                they care about. This is a volunteer leadership role, not a
                job, and it comes with real responsibilities.
              </>
            }
          />
          <ul className="mt-10 prose-body space-y-4">
            {[
              "Represent Code Yaar in your community.",
              "Connect with students and aspiring developers.",
              "Promote learning opportunities.",
              "Help grow the global community.",
              "Contribute ideas and outreach initiatives.",
              "Build real community leadership experience.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-emerald font-medium">
                  &mdash;
                </span>
                <p className="type-body m-0">{item}</p>
              </li>
            ))}
          </ul>
        </SectionInner>
      </Section>

      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="Ambassador responsibilities"
            title="What the role involves"
            description="Clear expectations so applicants can decide if this is the right commitment."
          />
          <ol className="mt-10 prose-body list-decimal list-inside space-y-3">
            {responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="mt-6 type-caption text-ink-subtle">
            We do not encourage spam, fake referrals or misleading promotion.
            All outreach must follow official branding and communication
            guidelines.
          </p>
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <SectionHeading
            eyebrow="Ambassador categories"
            title="Three ways to represent Code Yaar"
            description={
              <>
                Every ambassador falls into one of these categories. There is no
                implied hierarchy &mdash; regional does not mean senior, and no
                applicant should expect to start as a regional leader.
              </>
            }
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.title}
                className="rounded-xl border border-line bg-surface p-6 sm:p-8"
              >
                <h4 className="mb-2 font-semibold text-ink">{category.title}</h4>
                <p className="type-body text-ink-muted leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </SectionInner>
      </Section>

      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="Eligibility"
            title="Who can apply"
            description="Programming experience and a large social media following are not mandatory."
          />
          <ul className="mt-10 prose-body space-y-4">
            {eligibility.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-emerald font-medium">
                  &mdash;
                </span>
                <p className="type-body m-0">{item}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 type-caption text-ink-subtle">
            Applicants under 18 must provide guardian consent where required.
            Social media follower counts are never a selection requirement.
          </p>
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <SectionHeading
            eyebrow="How the referral evaluation works"
            title="Referral-based selection stage"
            description="Shortlisted candidates must refer five qualified applicants to The First 100 founding cohort."
          />
          <ol className="mt-10 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {referralSteps.map((step) => (
              <li
                key={step.step}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded-full border border-emerald bg-emerald text-white text-xs font-semibold px-2 py-1">
                    {step.step}
                  </span>
                  <h4 className="font-semibold text-ink">{step.title}</h4>
                </div>
                <p className="type-body text-ink-muted leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 type-caption text-ink-subtle">
            Completing the referral stage does not guarantee ambassador
            appointment. Final decisions are based on the complete selection
            process. Not every applicant is shortlisted for the referral stage.
          </p>
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <SectionHeading
            eyebrow="Benefits"
            title="What ambassadors receive"
            description="We distinguish between guaranteed programme features and discretionary recognition."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-lg border border-line bg-surface p-5"
              >
                <p className="type-label mb-2">
                  {benefit.guaranteed ? "Guaranteed" : "Discretionary"}
                </p>
                <h4 className="mb-2 font-semibold text-ink">{benefit.title}</h4>
                <p className="type-body text-ink-muted">{benefit.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-line bg-surface p-5">
            <p className="type-label mb-2">Certificate distinction</p>
            <ul className="space-y-3 prose-body text-ink-muted">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-emerald font-medium">
                  &mdash;
                </span>
                <p className="type-body m-0">
                  <strong className="text-ink">Appointment Certificate:</strong>
                  Issued to officially selected and onboarded ambassadors.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-emerald font-medium">
                  &mdash;
                </span>
                <p className="type-body m-0">
                  <strong className="text-ink">Certificate of Experience:</strong>
                  Issued after successful completion of the programme
                  requirements.
                </p>
              </li>
            </ul>
            <p className="mt-4 type-caption text-ink-subtle">
              Certificates are not issued merely for submitting an application
              or generating referrals.
            </p>
          </div>
          <p className="mt-8 type-caption text-ink-subtle">
            We never promise guaranteed jobs, internships, scholarships,
            stipends, employment or recommendation letters. Recognition is
            discretionary and tied to meaningful contribution.
          </p>
        </SectionInner>
      </Section>

      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="Selection process"
            title="How ambassadors are selected"
            description="A transparent, points-based evaluation process. No invented deadlines or selection dates."
          />
          <ol className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-7">
            {selectionSteps.map((step, index) => (
              <li key={step} className="flex flex-col items-center gap-3">
                <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-emerald bg-emerald text-white text-sm font-semibold">
                  {index + 1}
                </span>
                <p className="type-body text-center text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <SectionHeading
            eyebrow="Ambassador selection framework"
            title="How candidates are evaluated"
            description="The referral stage is one part of a 100-point evaluation. Quality and integrity matter more than raw referral counts."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Communication and motivation", points: 20 },
              { label: "Leadership and initiative", points: 20 },
              { label: "Community access and outreach", points: 20 },
              { label: "Reliability and commitment", points: 15 },
              { label: "Referral-stage performance", points: 15 },
              { label: "Problem-solving and ideas", points: 10 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-line bg-surface p-5"
              >
                <h4 className="mb-2 font-semibold text-ink">{item.label}</h4>
                <p className="text-xl font-semibold text-emerald">
                  {item.points} points
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 type-caption text-ink-subtle">
            Total: 100 points. Five verified referrals satisfy the referral
            requirement (15 points). Additional referrals do not automatically
            outweigh communication, leadership, integrity or contribution
            potential. The team retains final selection authority.
          </p>
        </SectionInner>
      </Section>

      <Section padded>
        <SectionInner>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center text-center sm:text-left">
            <Link
              href="/ambassadors/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
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
                <rect x="3" y="3" width="7" height="7" rx="1" ry="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" ry="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" ry="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" ry="1" />
              </svg>
              Referral Dashboard
            </Link>
            <Link
              href="/ambassadors/apply"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Apply for Global Ambassador Programme
            </Link>
          </div>
        </SectionInner>
      </Section>
    </>
  );
}
