import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { mission } from "@/lib/content/home";

export function MissionSection() {
  return (
    <Section id="mission">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading
          number="01"
          eyebrow={mission.eyebrow}
          title={mission.title}
        />
        <div className="max-w-[36rem] space-y-5 lg:pt-2">
          {mission.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-[0.9375rem] leading-relaxed text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
        {mission.loop.map((step, index) => (
          <div key={step.label} className="bg-[var(--color-canvas)] dark:bg-gray-900 px-0 py-6 sm:px-5 lg:px-4">
            <p className="type-label tabular-nums text-[var(--color-emerald-600)]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-[1rem] font-medium text-[var(--color-ink)]">{step.label}</h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
              {step.detail}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
