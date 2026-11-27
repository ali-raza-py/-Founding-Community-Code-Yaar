"use client";

import { usePathname } from "next/navigation";

import { ParticipantSidebar } from "@/components/participant/participant-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";

interface ParticipantLayoutProps {
  children: React.ReactNode;
  header?: {
    title: string;
    breadcrumb?: Array<{ label: string; href: string }>;
  };
}

export function ParticipantLayout({
  children,
  header: headerProps,
}: ParticipantLayoutProps) {
  const pathname = usePathname();

  const title = headerProps?.title ?? "Dashboard";
  const breadcrumb = headerProps?.breadcrumb;

  let crumb = breadcrumb;
  if (!crumb || crumb.length === 0) {
    if (pathname.startsWith("/cohort/dashboard")) {
      crumb = [{ label: "Founding Cohort", href: "/cohort/dashboard" }];
    } else if (pathname.startsWith("/ambassador/dashboard")) {
      crumb = [{ label: "Ambassador Programme", href: "/ambassador/dashboard" }];
    } else {
      crumb = [{ label: "Dashboard", href: "/dashboard" }];
    }
  }

  return (
    <div className="flex h-screen bg-canvas">
      <ParticipantSidebar />

      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden bg-canvas transition-all duration-300 ease-in-out",
          "lg:pl-[calc(var(--sidebar-width)+1rem)]",
        )}
      >
        <DashboardHeader
          title={title}
          breadcrumb={crumb}
          onMenuClick={undefined}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-none px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
