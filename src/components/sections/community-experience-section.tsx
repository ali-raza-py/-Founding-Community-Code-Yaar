/**
 * Community Experience section.
 * Shows how the community works through visual steps.
 */
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { title: "Apply", detail: "Complete the five-step application. It takes about ten minutes." },
  { title: "Review", detail: "A team member reads your application against the cohort criteria." },
  { title: "Welcome", detail: "Selected applicants receive onboarding information by email." },
  { title: "Connect", detail: "Meet the other founding members and introduce yourself." },
  { title: "Learn", detail: "Take part in optional learning activities at your own pace." },
  { title: "Build", detail: "Work on practical challenges and projects as they become available." },
  { title: "Contribute", detail: "Share feedback and ideas that shape the community and the platform." },
  { title: "Showcase", detail: "Highlight projects and progress — including the messy parts." },
];

export function CommunityExperienceSection() {
  return (
    <Section id="community-experience" tone="surface">
      <SectionHeading
        number="06"
        eyebrow="Community experience"
        title="How the community works"
        intro="An eight-step journey from application to ongoing contribution."
      />

      <ol className="mt-12 grid gap-y-0 border-t border-line sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative border-b border-line py-6 sm:pl-0"
          >
            <div className="flex items-baseline gap-3">
              <span className="type-label tabular-nums text-[var(--color-emerald-600)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
            <h3 className="type-h3 mt-3 text-[var(--color-ink)]">{step.title}</h3>
            <p className="mt-2 max-w-[15rem] text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink/60">
        This is the intended flow — some later stages depend on activities that
        are still being planned, and we will not pretend otherwise. Participation
        is asynchronous-first so that members can contribute from any time zone.
      </p>
    </Section>
  );
}