"use client";

import { LayoutDashboard, ListChecks, Share2, User } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/shell";

interface AmbassadorLayoutProps {
  children: React.ReactNode;
}

const AMBASSADOR_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/ambassador/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "My Work",
    items: [
      {
        href: "/ambassador/dashboard#tasks",
        label: "My Tasks",
        icon: ListChecks,
        anchor: "tasks",
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        href: "/ambassador/dashboard#referrals",
        label: "My Referrals",
        icon: Share2,
        anchor: "referrals",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        href: "/ambassador/dashboard#profile",
        label: "My Profile",
        icon: User,
        anchor: "profile",
      },
    ],
  },
];

export function AmbassadorLayout({ children }: AmbassadorLayoutProps) {
  return (
    <DashboardShell
      program={{
        label: "Ambassador Dashboard",
        identifier: "AMBASSADOR",
        logoHref: "/ambassador/dashboard",
      }}
      sections={AMBASSADOR_SECTIONS}
      header={{
        title: "Dashboard",
        breadcrumb: [{ label: "Ambassador Dashboard", href: "/ambassador/dashboard" }],
      }}
    >
      {children}
    </DashboardShell>
  );
}
