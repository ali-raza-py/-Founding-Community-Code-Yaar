import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { BenefitsSection } from "@/components/sections/benefits-section";

export const metadata: Metadata = {
  title: "Benefits",
  description:
    "What Code Yaar founding cohort members can expect, stated plainly: opportunities, not guarantees.",
  alternates: { canonical: "/benefits" },
  openGraph: {
    title: "Benefits — The First 100",
    description:
      "Realistic benefits of the Code Yaar founding cohort, stated plainly.",
    url: "/benefits",
  },
};

export default function BenefitsPage() {
  return (
    <>
      <PageHero
        eyebrow="Benefits"
        title="Opportunities, not guarantees."
        lead="The founding cohort is early. These are opportunities rather than guaranteed services — stated plainly so nobody arrives expecting something that does not exist."
      />
      <BenefitsSection />
    </>
  );
}
