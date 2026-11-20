import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const principles = [
  {
    title: "Build before you boast",
    detail:
      "A rough project says more than a polished description. We value evidence of work over claims about ability.",
  },
  {
    title: "Learn by doing",
    detail:
      "Courses and documentation are inputs. The output we care about is something you made, fixed, or understood by trying.",
  },
  {
    title: "Share what you discover",
    detail:
      "A solved error, a useful tool, a wrong assumption corrected — passing it on is how a small group learns faster than a large one.",
  },
  {
    title: "Give honest feedback",
    detail:
      "Specific and kind, not vague and polite. Feedback is the fastest way for someone to improve, and the easiest thing to get wrong.",
  },
  {
    title: "Grow together",
    detail:
      "Progress that only one person can see is half the value. We ask members to help the next person move forward.",
  },
];

export function PrinciplesSection() {
  return (
    <Section className="bg-surface-raised py-home-section">
      <SectionInner>
        <SectionHeading
          className="max-w-3xl"
          eyebrow="Founding principles"
          title="Five principles for the cohort"
          description="The values founding members commit to — and that new members will inherit."
        />
        <ol role="list" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map(({ title, detail }, index) => (
            <li key={title} className="border-t border-line-strong pt-4">
              <span aria-hidden="true" className="type-label text-emerald">{index + 1}</span>
              <h3 className="mt-2 text-base">{title}</h3>
              <p className="type-body-muted mt-2">{detail}</p>
            </li>
          ))}
        </ol>
      </SectionInner>
    </Section>
  );
}
