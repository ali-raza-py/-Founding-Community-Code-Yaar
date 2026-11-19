import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { principles } from "@/lib/content/home";

export function PrinciplesSection() {
  return (
    <Section id="principles" tone="surface">
      <SectionHeading
        number="02"
        eyebrow="Community principles"
        title="Five standards we hold each other to."
        intro="These are not slogans. They are the questions we ask when it is unclear what the right thing to do is."
      />

      <ol className="mt-12 grid gap-x-8 gap-y-0 border-t border-line md:grid-cols-2 xl:grid-cols-5">
        {principles.map((principle, index) => (
          <li
            key={principle.title}
            className="border-b [var(--color-border)] py-7 xl:border-b-0 xl:border-r xl:pr-6 xl:last:border-r-0"
          >
            <p
              aria-hidden
              className="font-serif text-[2.25rem] leading-none text-forest-700/25"
            >
              {index + 1}
            </p>
            <h3 className="type-h3 mt-4 text-[var(--color-ink)]">{principle.title}</h3>
            <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-muted">
              {principle.detail}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
