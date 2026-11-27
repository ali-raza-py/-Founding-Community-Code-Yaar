"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  ListChecks,
  Mail,
  Inbox,
  BarChart3,
  ShieldAlert,
  Settings,
} from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const ADMIN_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/admin/participants", label: "Participants", icon: Users },
      {
        href: "/admin/founding-cohort",
        label: "Founding Cohort",
        icon: UserCheck,
      },
      { href: "/admin/ambassadors", label: "Ambassadors", icon: UserCheck },
      { href: "/admin/applications", label: "Applications", icon: FileText },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
      { href: "/admin/referrals", label: "Referrals", icon: Mail },
      {
        href: "/admin/announcements",
        label: "Announcements",
        icon: BarChart3,
        roles: ["super_admin"] as const,
      },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/admin/mail", label: "Email Overview", icon: Inbox },
      {
        href: "/admin/mail?tab=compose",
        label: "Email Composer",
        icon: Mail,
      },
      {
        href: "/admin/mail?tab=templates",
        label: "Email Templates",
        icon: BarChart3,
      },
      {
        href: "/admin/mail?tab=configuration",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/admin/users",
        label: "Administration",
        icon: ShieldAlert,
        roles: ["super_admin"] as const,
      },
    ],
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const activeItem = ADMIN_SECTIONS.flatMap((s) => s.items).find(
    (i) => pathname === i.href || pathname.startsWith(`${i.href}/`),
  );

  const breadcrumb = activeItem
    ? [{ label: activeItem.label, href: activeItem.href }]
    : undefined;

  return (
    <DashboardShell
      program={{
        label: "Administration",
        identifier: "ADMINISTRATION",
        logoHref: "/admin",
      }}
      sections={ADMIN_SECTIONS}
      header={{
        title: activeItem?.label ?? "Dashboard",
        breadcrumb,
      }}
    >
      {children}
    </DashboardShell>
  );
}
