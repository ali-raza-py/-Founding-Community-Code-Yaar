import type { Metadata } from "next";

import { FoundingHero } from "@/components/sections/hero";
import { Section, SectionInner } from "@/components/ui/section";
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
      <Section padded>
        <SectionInner />
      </Section>
    </>
  );
}
