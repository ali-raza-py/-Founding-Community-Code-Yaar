import type { Metadata } from "next";

import { CohortIntroSection } from "@/components/sections/cohort-intro";
import { FinalCtaSection } from "@/components/sections/final-cta";
import { FoundingHero } from "@/components/sections/hero";
import { JourneySection } from "@/components/sections/journey";
import { MissionSection } from "@/components/sections/mission";
import { PrinciplesSection } from "@/components/sections/principles";
import { SITE_URL } from "@/lib/constants";

const description =
  "Join Code Yaar's Global Founding Cohort 2026–27. Connect with aspiring developers worldwide, take part in practical learning activities, and help shape a growing programming community.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Code Yaar | Be Part of What Comes Next — Founding Cohort",
    template: "%s — Code Yaar",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Code Yaar | Be Part of What Comes Next — Founding Cohort",
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
      <CohortIntroSection />
      <JourneySection />
      <FinalCtaSection />
    </>
  );
}
