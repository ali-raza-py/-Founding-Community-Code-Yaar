"use client";

import Link from "next/link";
import { GhostMarquee } from "@/components/motion/text";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import { Wordmark } from "@/components/layout/wordmark";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/ali-raza-py/-Founding-Community-Code-Yaar";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/cohort", label: "The Cohort" },
  { href: "/benefits", label: "Benefits" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/apply", label: "Apply" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canvas text-canvas border-t border-line relative overflow-hidden">
      {/* Ghost wordmark cropped at the bottom edge */}
      <GhostMarquee
        text="Code Yaar"
        repeats={4}
        direction="ltr"
        speed={160}
        y={8}
        className="bottom-[-40px] left-1/2 -translate-x-1/2 text-[clamp(3rem,18vw,9rem)] font-black opacity-40"
      />

      <Container className="mx-auto px-6">
        <div className="pt-12 pb-10 grid gap-10 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Wordmark className="mb-4" />
            <p className="text-[0.8125rem] leading-relaxed text-ink-muted max-w-[26rem]">
              Code Yaar Global Founding Community &mdash; The First 100. A
              founding cohort of learners and builders, open worldwide.
            </p>
          </div>

          <div>
            <h3 className="type-label mb-6 text-ink">Explore</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.filter(
                (link) => link.href !== "/apply" && link.href !== "/",
              ).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-ink-subtle hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="type-label mb-6 text-ink">Join</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/apply"
                  className="text-[0.875rem] text-ink-subtle hover:text-ink transition-colors"
                >
                  Apply for the Founding Cohort
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="type-label mb-6 text-ink">Theme</h3>
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[0.75rem] text-ink-subtle">
            Code Yaar {year}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.75rem] text-ink-subtle hover:text-ink transition-colors"
            >
              GitHub repository
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
