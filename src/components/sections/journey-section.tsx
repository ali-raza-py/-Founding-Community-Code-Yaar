import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { journey } from "@/lib/content/home";

export function JourneySection() {
  return (
    <Section id="journey">
      <SectionHeading
        number="05"
        eyebrow="The journey"
        title="From application to first project."
        intro="What happens, in order. Some later stages depend on activities that are still being planned — we will not pretend otherwise."
      />

      <ol className="mt-12 grid gap-y-0 border-t border-line sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
        {journey.map((step, index) => (
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
    </Section>
  );
}
