import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Global Ambassadors", href: "/ambassadors" },
  { label: "The First 100", href: "/cohort" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy", href: "/privacy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="Code Yaar Home"
            >
              <div className="relative h-6 w-6 shrink-0">
                <Image
                  src="/brand/logo-mark.png"
                  alt=""
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-semibold tracking-tight text-ink">
                Code Yaar
              </span>
            </Link>
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
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-6">
              Community
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-emerald"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p className="text-xs text-ink-muted">
            &copy; 2026 Code Yaar. All rights reserved.
          </p>
          <p className="text-xs text-ink-muted">Think. Build. Evolve.</p>
        </div>
      </div>
    </footer>
  );
}
