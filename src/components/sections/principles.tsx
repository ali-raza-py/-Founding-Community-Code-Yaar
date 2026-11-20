import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export function PrinciplesSection() {
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

  return (
    <Section padded className="bg-[#f2f5f3]">
      <SectionInner>
        <SectionHeading
          eyebrow="Founding principles"
          title="Five principles for the cohort"
          description="The values founding members commit to — and that new members will inherit."
        />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {principles.map((principle, index) => (
            <li key={principle.title} className="flex flex-col gap-3">
              <span className="type-label block mb-1">
                {index + 1}
              </span>
              <h4 className="mb-2">{principle.title}</h4>
              <p className="type-body">{principle.detail}</p>
            </li>
          ))}
        </ol>
      </SectionInner>
    </Section>
  );
}
