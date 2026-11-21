import Link from "next/link";

import { SectionInner } from "@/components/ui/section";

import { Wordmark } from "./wordmark";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Apply", href: "/apply" },
  { label: "Global Ambassadors", href: "/ambassadors" },
  { label: "The First 100", href: "/cohort" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy", href: "/privacy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <SectionInner className="py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm text-ink-muted leading-relaxed">
              Code Yaar Founding Community 2026&ndash;27. A global community
              for learners, builders, and technology enthusiasts shaping what
              comes next.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                ["GitHub", "https://github.com/ali-raza-py/Code-Yaar"],
              ].map(([social, href]) => (
                <a
                  key={social}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-raised text-xs font-medium text-ink-muted transition-colors hover:bg-emerald hover:text-white"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
          <nav aria-labelledby="footer-community-title">
            <h2 id="footer-community-title" className="mb-5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Community
            </h2>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-emerald"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 border-t border-line pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p className="text-xs text-ink-muted">
            &copy; 2026 Code Yaar. All rights reserved.
          </p>
          <p className="text-xs text-ink-muted">Think. Build. Evolve.</p>
        </div>
      </SectionInner>
    </footer>
  );
}
