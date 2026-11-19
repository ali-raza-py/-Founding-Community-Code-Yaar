import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { WhatIsSection } from "@/components/sections/what-is-section";
import { WhyJoinSection } from "@/components/sections/what-is-section";
import { CommunityExperienceSection } from "@/components/sections/community-experience-section";
import { FoundingIdentitySection } from "@/components/sections/community-experience-section";
import { ApplicationSection } from "@/components/sections/application-section";
import { FAQSection } from "@/components/sections/faq-section";
import { SITE_URL } from "@/lib/constants";

const description =
  "Join Code Yaar's Global Founding Cohort 2026–27. Connect with aspiring developers worldwide, participate in practical learning activities, and help shape a growing programming community.";

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
      <SiteHeader />
      <main id="main" className="flex-1">
        <HeroSection />
        <WhatIsSection />
        <WhyJoinSection />
        <CommunityExperienceSection />
        <FoundingIdentitySection />
        <ApplicationSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  );
}
