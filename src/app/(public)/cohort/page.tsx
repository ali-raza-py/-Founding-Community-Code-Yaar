import type { Metadata } from "next";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { SITE_URL } from "@/lib/constants";

const description =
  "The First 100 — Code Yaar Global Founding Cohort 2026&ndash;27. What the founding cohort is, who should apply, how selection works, and what is available today.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Code Yaar | The First 100 — Founding Cohort",
    template: "%s — Code Yaar",
  },
  description,
  openGraph: {
    title: "Code Yaar | The First 100 — Founding Cohort",
    description,
    url: "/cohort",
  },
};

export default function CohortPage() {
  return (
    <>
      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="The First 100"
            title="What is the Founding Cohort?"
            description={
              <>
                The founding cohort is the first group of members in the Code
                Yaar community. It is deliberately small — one hundred places,
                filled through open applications rather than invitations.
                Founding members are early participants: they take part in
                practical activities as they become available, contribute
                feedback, and help establish a culture that later members will
                join.
              </>
            }
          />
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-ink">
                Who should apply?
              </h2>
              <p className="type-body mb-4">
                The cohort welcomes students, beginners, self-taught learners,
                and aspiring developers. Advanced technical experience is not
                required — curiosity, consistency, and a willingness to learn
                matter more than a long list of technologies.
              </p>
              <ul className="space-y-3 prose-body">
                <li>Students interested in programming and computer science.</li>
                <li>
                  Beginners who want to develop practical skills rather than
                  collect courses.
                </li>
                <li>Self-taught learners who have been working alone.</li>
                <li>
                  Aspiring developers preparing for a first role or a first
                  serious project.
                </li>
                <li>People who enjoy building projects and showing unfinished work.</li>
              </ul>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-xl border border-line bg-surface p-8 sm:p-10">
                <p className="type-label mb-3">Who this is for</p>
                <ul className="space-y-3 prose-body">
                  <li className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      Open to all
                    </Badge>
                    No mandatory programming experience.
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      Global
                    </Badge>
                    Applications welcome from anywhere.
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      Asynchronous first
                    </Badge>
                    Time zones do not decide who can take part.
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      Limited to 100
                    </Badge>
                    Founding cohort places only.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </SectionInner>
      </Section>

      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="What to expect"
            title="What members contribute"
            description="Founding members are participants, not an audience. Honest participation matters more than seniority."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Participate constructively",
                detail: "Respect other members and contribute to discussions in good faith.",
              },
              {
                title: "Share what does not work",
                detail: "Talk about the parts that failed — that is often the most useful part.",
              },
              {
                title: "Give useful feedback",
                detail: "Specific, honest input when asked — not just encouragement.",
              },
              {
                title: "Attempt practical activities",
                detail: "Take part when activities are available, at your own pace.",
              },
              {
                title: "Communicate honestly",
                detail: "Say when you cannot take part, rather than disappearing quietly.",
              },
              {
                title: "Contribute realistically",
                detail: "Give the time you can actually keep — two honest hours beat twenty planned.",
              },
            ].map((item, index) => (
              <div key={item.title} className="rounded-xl border border-line bg-surface p-6">
                <span className="type-label block mb-2">{index + 1}</span>
                <h4 className="mb-2 font-semibold text-ink">{item.title}</h4>
                <p className="type-body text-ink-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <SectionHeading
            eyebrow="Selection"
            title="How selection works"
            description="Applications are read by a real person. Places are limited to one hundred founding members."
          />
          <ol className="mt-8 prose-body list-decimal list-inside space-y-3">
            <li>
              <strong>Application submission.</strong> Complete the five-step
              form about your background, motivation, and what you could
              contribute.
            </li>
            <li>
              <strong>Application review.</strong> A person on the team reads
              your application. Selection considers motivation, willingness to
              learn, interest in practical work, collaboration, and realistic
              availability — not existing skill level. There are no interviews;
              every application is reviewed on its merits.
            </li>
            <li>
              <strong>Selection notification.</strong> You are contacted by
              email with the outcome. A review timeline has not been published
              yet; we will not promise a date we cannot meet.
            </li>
            <li>
              <strong>Onboarding.</strong> Selected applicants receive
              onboarding information: community guidelines, how to introduce
              yourself, and the first optional activity.
            </li>
          </ol>
          <p className="mt-6 type-small text-ink-subtle">
            Submitting an application does not guarantee acceptance.
          </p>
        </SectionInner>
      </Section>

      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="Global participation"
            title="One community, different countries"
            description="Applications are open worldwide, and activities are designed for every time zone."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              "Applications are welcome from anywhere in the world.",
              "Activities are designed to be asynchronous-first.",
              "Live sessions, where they happen, are optional.",
              "English is the working language of the site.",
              "Preferred language is collected to plan support — never to filter applicants.",
              "One hundred founding members, assembled from scratch.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-emerald font-medium">
                  &mdash;
                </span>
                <p className="type-body m-0">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 type-small text-ink-subtle">
            Because the community is new, some activities and processes are
            still being designed. We say so rather than describing a programme
            that does not exist yet.
          </p>
        </SectionInner>
      </Section>
    </>
  );
}
