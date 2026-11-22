import type { Metadata } from "next";

import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_URL } from "@/lib/constants";
import { faqs, faqNote } from "@/lib/content/faq";
import { FaqItem } from "@/components/faq-item";

const description =
  "Frequently asked questions about Code Yaar Global Founding Community — The First 100 founding cohort.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Code Yaar | FAQ — The First 100",
    template: "%s — Code Yaar",
  },
  description,
  openGraph: {
    title: "Code Yaar | FAQ — The First 100",
    description,
    url: "/faq",
  },
};

export default function FAQPage() {
  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Frequently asked questions"
          title="Questions about The First 100"
          description="Honest answers. If something is not decided yet, we say so."
        />
        <div className="mt-10 max-w-[46rem] space-y-2">
          {faqs.map((item, index) => (
            <FaqItem key={item.id} item={item} index={index} />
          ))}
        </div>
        <p className="mt-10 type-caption">{faqNote}</p>
      </SectionInner>
    </Section>
  );
}
