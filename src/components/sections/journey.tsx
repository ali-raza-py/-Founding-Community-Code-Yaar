import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export function JourneySection() {
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

  return (
    <Section padded className="bg-[#f2f5f3]">
      <SectionInner>
        <SectionHeading
          eyebrow="Community journey"
          title="From application to contribution"
          description="The path every founding member walks through, at their own pace."
        />
        <ol className="mt-10 relative grid max-w-[64rem] mx-auto gap-4 sm:gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const last = index === steps.length - 1;
            return (
              <li key={step.title} className="flex flex-col items-center gap-4 relative z-10 isolation">
                <span className="shrink-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#087a52] bg-[#087a52] text-white text-sm font-semibold">
                  {index + 1}
                </span>
                <h4 className="text-sm font-semibold">{step.title}</h4>
                <p className="text-xs type-caption text-center">{step.detail}</p>
                {!last && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-[calc(100%+5px)] w-[1px] bg-[#e8ece8] -z-10"
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </SectionInner>
    </Section>
  );
}
