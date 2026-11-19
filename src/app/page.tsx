import type { Metadata } from "next";

import { FoundingHero } from "@/components/hero/FoundingHero";
import { MissionSection } from "@/components/sections/mission-section";
import { PrinciplesSection } from "@/components/sections/principles-section";
import { CohortSection } from "@/components/sections/cohort-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { JourneySection } from "@/components/sections/journey-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";

const description =
  "Join Code Yaar's Global Founding Cohort 2026–27. Connect with aspiring developers worldwide, participate in practical learning activities, and help shape a growing programming community.";

export const metadata: Metadata = {
  title: {
    absolute: "Code Yaar | The First 100 — Global Founding Cohort",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Code Yaar | The First 100 — Global Founding Cohort",
    description,
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <FoundingHero />
      <MissionSection />
      <PrinciplesSection />
      <CohortSection />
      <BenefitsSection />
      <JourneySection />
      <FinalCtaSection />
    </>
  );
}
