"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const FOOTER_NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/", label: "Explore Learning" },
  { href: "/community", label: "Community" },
  { href: "https://github.com/codeyaar", label: "GitHub" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if prefers-reduced-motion is enabled
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // If reduced motion is preferred, skip animation but still observe
    if (prefersReducedMotion.matches) {
      // Just ensure the text is visible without animation
      if (footerRef.current) {
        setIsVisible(true);
      }
      return;
    }

    // IntersectionObserver to detect when footer enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px", // trigger slightly before fully visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={cn(
        "bg-[var(--color-canvas)] text-[var(--color-ink-subtle)] overflow-x-hidden min-h-auto relative",
        "dark:bg-gray-900 dark:text-white"
      )}
    >
      <Container className="px-0 max-w-[1800px]">
        <div className="py-12 md:py-16 relative">
          {/* Top Information Row */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-1">
              <p className="text-xs font-medium tracking-wider uppercase text-[var(--color-ink-subtle)] opacity-90">
                Think. Build. Evolve.
              </p>
              <p className="text-xs opacity-80 mt-1">
                Built for the next generation of developers.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-xs font-medium tracking-wider uppercase text-[var(--color-ink-subtle)] opacity-90">
                © 2026 Code Yaar. All rights reserved.
              </p>
              <p className="text-xs opacity-80">
                Open-source contributions and community-driven learning.
              </p>
            </div>
          </div>

          {/* Middle Navigation Links Row */}
          <nav aria-label="Footer navigation" className="flex flex-col md:flex-row gap-12 mb-16">
            {FOOTER_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-medium",
                  "transition-colors duration-200",
                  "hover:text-ink",
                  "hover:text-white dark:hover:text-gray-200 dark:hover:text-gray-300"
                )}
                style={{ textDecoration: "none" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Oversized CODE YAAR Brand Typography */}
          <div className="mt-16 text-center overflow-hidden">
            <p
              className={cn(
                "font-display font-extrabold text-[ clamp(13rem, 24vw, 18rem)] tracking-[-0.03em] uppercase opacity-0 transition-opacity duration-800",
                isVisible ? "opacity-1" : ""
              )}
            >
              CODE YAAR
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}