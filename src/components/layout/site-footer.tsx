"use client";

import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/layout/wordmark";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "#overview", label: "Overview" },
  { href: "#why-join", label: "Why Join" },
  { href: "#community", label: "Community" },
  { href: "#benefits", label: "Benefits" },
  { href: "#faq", label: "FAQ" },
  { href: "/apply", label: "Apply" },
];

const EXTERNAL_LINKS = [
  { href: "https://codeyaar.com", label: "Official Website" },
  { href: "https://github.com/ali-raza-py/Code-Yaar", label: "GitHub Repository" },
];

export function SiteFooter() {
  return (
    <footer className="bg-canvas text-canvas border-t border-border pt-16 pb-8">
      <Container className="mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Wordmark className="mb-4" />
            <p className="text-[0.8125rem] leading-relaxed text-foreground/60 max-w-[24rem]">
              The first generation of builders shaping the future of Code Yaar.
              Learn together, build together, evolve together.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Explore</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] text-foreground/70 hover:text-emerald-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Connect</h3>
            <ul className="space-y-3">
              {EXTERNAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.8125rem] text-foreground/70 hover:text-emerald-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Join</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/apply"
                  className="text-[0.8125rem] text-foreground/70 hover:text-emerald-500 transition-colors"
                >
                  Apply for the Founding Cohort
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[0.75rem] text-foreground/50">
            Code Yaar Founding Cohort 2026–27. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/ali-raza-py/Code-Yaar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.8125rem] text-foreground/60 hover:text-emerald-500 transition-colors"
            >
              GitHub
            </a>
            <span className="text-[0.8125rem] text-foreground/30">•</span>
            <a
              href="https://codeyaar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.8125rem] text-foreground/60 hover:text-emerald-500 transition-colors"
            >
              Official Website
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
