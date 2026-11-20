import type { Metadata } from "next";
import Image from "next/image";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { SITE_URL } from "@/lib/constants";

const founders = [
  {
    name: "Ali Raza",
    role: "Founder & CEO",
    focus: "Product vision, strategy & leadership",
    image: "/team/ali-raza.png",
  },
  {
    name: "Abdullah",
    role: "Co-Founder & CTO",
    focus: "Technology, backend architecture & engineering",
    image: "/team/abdullah.png",
  },
  {
    name: "Shabbar",
    role: "Co-Founder & Chief Growth Officer",
    focus: "Community, content & brand growth",
    image: "/team/shabbar-raza.png",
  },
];

const description =
  "About Code Yaar Global Founding Community — The First 100. Meet the founding team behind the initiative: Ali Raza, Abdullah, and Shabbar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Code Yaar | About the Founding Community",
    template: "%s — Code Yaar",
  },
  description,
  openGraph: {
    title: "Code Yaar | About the Founding Community",
    description,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="About Code Yaar"
            title="A practical programming education, built with the community."
            description={
              <>
                Code Yaar is being developed as a practical programming
                education initiative: understand concepts, practise
                problem-solving, apply knowledge in projects, and develop
                skills you can actually use. This site is the home of its
                founding community — an early, separate initiative that exists
                to bring motivated learners together while the platform is
                being built.
              </>
            }
          />
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-ink">
                Why we are building it
              </h2>
              <p className="type-body mb-4">
                Learning to program often happens in fragments — a video here,
                a documentation page there, a practice problem, a half-finished
                project. Each piece is useful. Together they rarely add up to a
                habit of building. What is usually missing is not content but
                continuity: a place to ask a question without embarrassment,
                show work in progress, receive honest feedback, and see other
                people at a similar stage doing the same thing.
              </p>
              <p className="type-body mb-6">
                That is what the community is for. It is the part of the
                learning experience that cannot be shipped as a feature.
              </p>
              <div className="space-y-4">
                {[
                  "Think — understand the problem before reaching for a solution.",
                  "Build — turn understanding into something real, even if it is small and imperfect.",
                  "Evolve — use feedback to improve the work and the way you work.",
                ].map((item, index) => (
                  <p key={index} className="type-body pl-4 border-l-2 border-emerald">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-xl border border-line bg-surface p-8 sm:p-10">
                <p className="type-label mb-3">Our community vision</p>
                <h3 className="mb-4 text-xl font-semibold text-ink">
                  A global community built around practice
                </h3>
                <p className="type-body mb-6">
                  The founding community supports the wider Code Yaar mission
                  by existing before the platform is complete. Its members test
                  ideas, tell us what is useful and what is not, and establish
                  the norms that later members will inherit.
                </p>
                <p className="type-small text-ink-subtle">
                  This website is not the platform — it is a separate
                  community initiative, with its own codebase, deployment, and
                  purpose. Nothing here connects to Code Yaar&rsquo;s internal
                  systems.
                </p>
              </div>
            </div>
          </div>
        </SectionInner>
      </Section>

      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="Founding team"
            title="The people behind Code Yaar"
            description="Actual team members. Portraits are real photographs, not generated or stock images."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {founders.map((founder) => (
              <div key={founder.name} className="flex flex-col items-center gap-4">
                <div className="relative shrink-0">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 768px) 240px, 320px"
                    className="rounded-lg object-cover aspect-square"
                    priority={founder.name === "Ali Raza"}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold text-ink">{founder.name}</h3>
                  <p className="text-sm font-medium text-emerald">{founder.role}</p>
                  <p className="text-xs text-ink-muted">{founder.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionInner>
      </Section>
    </>
  );
}
