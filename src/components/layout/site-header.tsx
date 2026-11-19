"use client";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Wordmark } from "@/components/layout/wordmark";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 [data-overlay=\"tooltip:shortcutmenu\"]`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Wordmark />
          <div className="flex items-center gap-3 lg:gap-8">
            <DesktopNav />
            <ThemeToggleButton />
            <MobileNavigation />
          </div>
        </div>
      </Container>
    </header>
  );
}