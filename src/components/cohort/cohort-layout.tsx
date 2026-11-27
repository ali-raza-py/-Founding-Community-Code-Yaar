"use client";

import { LayoutDashboard, Megaphone, ListChecks, Users2, User } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/shell";

interface CohortLayoutProps {
  children: React.ReactNode;
}

const COHORT_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/cohort/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Community",
    items: [
      {
        href: "/cohort/dashboard#announcements",
        label: "Announcements",
        icon: Megaphone,
        anchor: "announcements",
      },
    ],
  },
  {
    label: "My Participation",
    items: [
      {
        href: "/cohort/dashboard#tasks",
        label: "My Tasks",
        icon: ListChecks,
        anchor: "tasks",
      },
      {
        href: "/cohort/dashboard#submissions",
        label: "My Submissions",
        icon: Users2,
        anchor: "submissions",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        href: "/cohort/dashboard#profile",
        label: "My Profile",
        icon: User,
        anchor: "profile",
      },
    ],
  },
];

export function CohortLayout({ children }: CohortLayoutProps) {
  return (
    <DashboardShell
      program={{
        label: "Founding Cohort Dashboard",
        identifier: "THE FIRST 100",
        logoHref: "/cohort/dashboard",
      }}
      sections={COHORT_SECTIONS}
      header={{
        title: "Dashboard",
        breadcrumb: [{ label: "Founding Cohort", href: "/cohort/dashboard" }],
      }}
    >
      {children}
    </DashboardShell>
  );
}
