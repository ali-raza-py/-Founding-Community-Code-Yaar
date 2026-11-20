import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { title: "Apply", detail: "Complete the five-step application." },
  { title: "Review", detail: "A person on the team reads your application." },
  { title: "Welcome", detail: "Selected applicants are contacted by email." },
  { title: "Connect", detail: "Meet the other founding members." },
  { title: "Learn", detail: "Take part in optional learning activities." },
  { title: "Build", detail: "Work on practical challenges and projects." },
  { title: "Contribute", detail: "Share feedback that shapes the community." },
  { title: "Showcase", detail: "Highlight projects — including the messy parts." },
];

export function JourneySection() {
  return (
    <Section className="bg-surface-raised py-home-section">
      <SectionInner>
        <SectionHeading
          className="max-w-3xl"
          eyebrow="Community journey"
          title="From application to contribution"
          description="The path every founding member walks through, at their own pace."
        />
        <ol role="list" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, detail }, index) => (
            <li key={title} className="flex items-start gap-3 border-t border-line-strong pt-4">
              <span aria-hidden="true" className="type-label mt-1 shrink-0 text-emerald">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm">{title}</h3>
                <p className="type-caption mt-1 text-ink-muted">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionInner>
    </Section>
  );
}
