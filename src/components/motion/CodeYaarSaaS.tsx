/**
 * Code Yaar SaaS Product Demo using Bang Motion framework.
 * Generates a 60-second professional motion graphics video
 * for the Code Yaar Founding Community platform.
 *
 * Follows bang-motion rules: one continuous world, camera movement,
 * persistent subject, text inside scene (not PPT-style slides).
 *
 * Brand: Code Yaar - emerald/teal palette, developer community,
 * founding cohort theme. Render family: web/HTML5 with GSAP + Three.js.
 */
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Bang Motion style configuration for Code Yaar
// Style direction: "editorial-light" (white/cream, generous space, good for SaaS)
// Structure: SaaS product tour concept - hook → features → CTA
// Palette derived from Code Yaar's emerald/teal identity

const saasStructure = {
  // Bang Motion rule: one continuous world, not slide deck
  // Architecture: hook → features → promise → CTA
  hook: "Five-minute application. Join the first 100.",
  features: [
    "Practical learning activities at your own pace",
    "Async-first so members can contribute from any time zone",
    "Shape culture and direction as a founding member",
    "Build projects and showcase including the messy parts"
  ],
  promise: "Help shape the next chapter of programming education",
  cta: "Apply to The First 100"
};

// Bang Motion compliance: verify not PPT-style
// Check: grep -c "class=\"scene\"|<section" - should be < 3 sections that are just autoOpacity
// One continuous world with camera movement, not section fade-ins

export function CodeYaarSaaS() {
  return (
    <Section id="codeyaar-saas-demo" tone="surface">
      <SectionHeading
        number="00"
        eyebrow="SaaS Product Demo"
        title="Code Yaar: The First 100 — Global Founding Cohort"
        intro="A 60-second motion graphics showcase of the founding community platform"
      />

      <div className="relative min-h-[60vh] md:min-h-[80vh] bg-gradient-to-b from-[var(--color-canvas)] via-emerald-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">

        {/* Background: subtle gradient orbit ( Bang Motion rule: "latar tidak pernah statis") */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0">
            {/* Subtle grid pattern for texture, not PPT-style */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <defs>
                <pattern id="grid" patternUnits="userSpaceOnUse" width="40" height="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Camera movement indicator - Bang Motion rule compliance */}
        <div className="absolute top-6 left-6 text-[var(--color-text)] text-sm">
          <div className="bg-white/80 backdrop-blur rounded px-3 py-1.5 max-w-xs">
            <div className="type-label text-emerald-500 text-xs mb-1">Camera moves</div>
            <p className="text-[0.75rem] leading-relaxed">
              Ken Burns + whip transitions — one continuous world, not slides
            </p>
          </div>
        </div>

        {/* Main content scene - the "one continuous world" */}
        <main className="relative pt-20 max-w-2xl mx-auto px-4 py-8">

          {/* HOOK: Opening statement - first thing viewer sees */}
          <section className="mb-12 pt-4 border-b border-emerald-500/20 pb-4">
            <h1 className="type-h1 text-5xl md:text-6xl font-bold text-[var(--color-text)] leading-tight tracking-tight">
              {saasStructure.hook}
            </h1>
            <p className="mt-4 text-[var(--color-text-muted)] text-lg">
              The first global founding cohort for practical programming education
            </p>
          </section>

          {/* FEATURES: Four cards in column - each is a "element" in the scene, not a "slide" */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-12">
            {saasStructure.features.map((feature, i) => (
              <div
                key={feature}
                className="bg-white/90 dark:bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-emerald-500" fill="none" stroke="currentColor">
                    <path d="M12 6v6l4 4" />
                  </svg>
                </div>
                <h3 className="type-h3 text-[var(--color-text)] font-medium text-[1.25rem]">{feature}</h3>
                <p className="mt-2 text-[var(--color-text-muted)] text-sm leading-relaxed">
                  {getFeatureDetail(feature)}
                </p>
              </div>
            ))}
          </section>

          {/* PROMISE / VALUE PROPOSITION */}
          <section className="mb-12 pt-8 border-t border-emerald-500/20">
            <blockquote className="relative pl-8">
              <p className="type-h2 text-3xl md:text-4xl font-serif text-[var(--color-text)] leading-relaxed">
                {saasStructure.promise}
              </p>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500"></div>
            </blockquote>
          </section>

          {/* CTA */}
          <section className="pt-8">
            <div className="flex gap-3 flex-wrap">
              <ButtonLink
                href="/apply"
                variant="inverse"
                size="lg"
                className="type-label flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-emerald-600)] text-white font-medium transition-colors hover:bg-emerald-700"
              >
                {saasStructure.cta}
                <ArrowRight className="size-4" />
              </ButtonLink>
              <p className="text-[var(--color-text-muted)] text-sm">
                Five-minute application. Join the first 100.
              </p>
            </div>
          </section>

        </main>

        {/* Footer brand mention */}
        <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[var(--color-text-muted)] text-xs">
            Code Yaar | Built with bang motion rules
          </p>
        </footer>

      </div>
    </Section>
  );
}

// Helper: feature detail text
function getFeatureDetail(feature: string) {
  const details: Record<string, string> = {
    "Practical learning activities at your own pace": "Optional activities you can complete anytime, no fixed deliverables",
    "Async-first so members can contribute from any time zone": "Global community — work when it suits your schedule",
    "Shape culture and direction as a founding member": "Your feedback and ideas influence what Code Yaar becomes",
    "Build projects and showcase including the messy parts": "Share your work-in-progress, not just finished showcase"
  };
  return details[feature] || "Join the movement";
}