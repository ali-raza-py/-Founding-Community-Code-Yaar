import type { Metadata } from "next";
import Link from "next/link";

import { ApplicationForm } from "@/components/apply/application-form";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply for The First 100, Code Yaar's global founding cohort. Five short steps, about ten minutes, no account required.",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "Apply for The First 100",
    description:
      "Five steps, about ten minutes. Applications are open worldwide and reviewed by the Code Yaar team.",
    url: "/apply",
  },
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Applications open · 2026–27"
        title="Apply for The First 100."
        lead="Five short steps and about ten minutes. No account, no payment, and no polished portfolio required — beginners are the point, not an exception."
      />

      <Section bordered={false}>
        <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:items-start lg:gap-24">
          <div className="max-w-[640px] border border-line-strong bg-surface rounded-[12px] p-6 lg:p-8">
            <ApplicationForm />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="type-label text-ink-subtle">How this works</p>
            <div className="mt-4 space-y-4">
              <p>
                Answers are validated as you go, saved as a draft in this
                browser, and sent only when you press submit.
              </p>
              <p>
                We do not ask for a phone number, home address or identity
                documents. GitHub and LinkedIn links are optional, and applicants
                without them are not disadvantaged.
              </p>
              <p>
                <Link
                  href="/privacy"
                  className="border-b border-emerald-600/40 pb-0.5 font-medium text-emerald-400 hover:border-emerald-600"
                >
                  Read the privacy information
                </Link>
              </p>
            </div>
            <div className="mt-6 border-t border-line pt-4">
              <p className="text-ink">
                Not sure yet?{" "}
                <Link
                  href="/faq"
                  className="font-medium text-emerald-400 underline decoration-line-strong underline-offset-2 hover:decoration-emerald-600"
                >
                  Read the FAQ
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
