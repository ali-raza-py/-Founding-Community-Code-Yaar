"use client";

import { useCallback } from "react";

import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  program: {
    label: string;
    identifier: string;
    logoHref: string;
  };
  sections: Array<{
    label: string;
    items: Array<{
      href: string;
      label: string;
      icon: React.ElementType;
      roles?: readonly ("super_admin" | "admin")[];
      notification?: number;
    }>;
  }>;
  header: {
    title: string;
    breadcrumb?: Array<{ label: string; href: string }>;
  };
  children: React.ReactNode;
}

export function DashboardShell({
  program,
  sections,
  header,
  children,
}: DashboardShellProps) {
  const handleCollapseChange = useCallback((collapsed: boolean) => {
    // Preference is kept in component state only; no persistence mechanism
    // exists in the codebase, so we do not invent one.
    return undefined;
  }, []);

  return (
    <div className="flex h-screen bg-canvas">
      <DashboardSidebar
        logoHref={program.logoHref}
        program={program}
        sections={sections}
        onCollapseChange={handleCollapseChange}
      />

      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden bg-canvas transition-all duration-300 ease-in-out",
          "lg:pl-[calc(var(--sidebar-width)+1rem)]",
        )}
      >
        <DashboardHeader
          title={header.title}
          breadcrumb={header.breadcrumb}
          onMenuClick={undefined}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
