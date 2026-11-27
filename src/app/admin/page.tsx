"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  FileText,
  UserCheck,
  Users,
  Mail,
  ListChecks,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  Settings,
  Clock,
} from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/admin/shared";
import { LoadingState } from "@/components/admin/shared";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

interface RecentApplication {
  id: string;
  applicant_name: string;
  email: string;
  programs?: { name: string; slug: string } | null;
  application_status: string;
  created_at: string;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Review Applications",
    description: "Review and update application statuses.",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    title: "Manage Participants",
    description: "View and update participant records.",
    href: "/admin/participants",
    icon: Users,
  },
  {
    title: "Verify Referrals",
    description: "Review ambassador referral registrations.",
    href: "/admin/referrals",
    icon: Mail,
  },
  {
    title: "Publish Announcement",
    description: "Create announcements for the community.",
    href: "/admin/announcements",
    icon: BarChart3,
  },
  {
    title: "Assign Tasks",
    description: "Create and assign tasks to participants.",
    href: "/admin/tasks",
    icon: ListChecks,
  },
  {
    title: "User Administration",
    description: "Manage user profiles and roles.",
    href: "/admin/users",
    icon: ShieldAlert,
  },
];

export default function AdminDashboardPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin, isSuperAdmin, signOut } = useAuth();
  const [stats, setStats] = useState<{ applications: number; participants: number | null } | null>(null);
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminStats(accessToken);
    if (res.ok) setStats(res.data);
  }, [accessToken]);

  const loadRecentApps = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminApplications(accessToken, {
      page: 1,
      pageSize: 5,
      sortBy: "created_at",
      sortDir: "desc",
    });
    if (res.ok) {
      setRecentApps((res.data.items ?? []) as RecentApplication[]);
    }
  }, [accessToken]);

  useEffect(() => {
    loadStats();
    loadRecentApps();
    setLoading(false);
  }, [loadStats, loadRecentApps]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const applicationsCount = stats?.applications ?? 0;
  const participantsCount = stats?.participants ?? 0;
  const pendingCount = recentApps.filter((a) => a.application_status === "pending").length;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Overview"
        description="Key metrics and recent activity for the Code Yaar community."
        actions={
          <div className="flex items-end gap-2">
            <Link href="/admin/applications" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">
                All applications <ArrowRight className="ml-1 size-3.5" />
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Total Applications"
          value={applicationsCount}
          subtitle="Across all programmes"
          icon={<LayoutDashboard className="size-5" />}
        />
        <StatisticCard
          title="Pending Reviews"
          value={pendingCount}
          subtitle="Applications awaiting review"
          icon={<Clock className="size-5" />}
        />
        <StatisticCard
          title="Total Participants"
          value={participantsCount === null ? "—" : participantsCount}
          subtitle="Approved community members"
          icon={<UserCheck className="size-5" />}
        />
        <StatisticCard
          title="Recent Submissions"
          value={recentApps.length}
          subtitle="Last 5 applications"
          icon={<ListChecks className="size-5" />}
        />
      </div>

      {/* Recent applications */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Recent Applications</p>
            <p className="text-[0.8125rem] text-ink-secondary">Latest submissions needing review</p>
          </div>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            View all <span className="size-3">→</span>
          </Link>
        </div>
        <div className="p-0">
          {error ? (
            <ErrorState message={error} />
          ) : recentApps.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="No applications have been submitted to the community."
              action={{ label: "Review applications", href: "/admin/applications" }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line bg-surface-raised">
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Applicant</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Program</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Status</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Submitted</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-line hover:bg-surface-raised transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-ink">
                        {app.applicant_name || "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-ink-secondary">
                        {app.programs?.name || "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-ink">
                        <StatusBadge status={app.application_status} />
                      </td>
                      <td className="px-6 py-3 text-sm text-ink-secondary">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-right">
                        <Link
                          href={`/admin/applications/detail?id=${app.id}`}
                          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-emerald hover:bg-emerald-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                        >
                          Review <ArrowRight className="size-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          const isSuperAdminOnly =
            action.title === "User Administration" ||
            action.title === "Publish Announcement";
          if (isSuperAdminOnly && !isSuperAdmin) return null;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-line bg-surface p-4 sm:p-5 transition-colors hover:bg-surface-raised hover:border-emerald"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-surface-raised p-2.5 text-emerald group-hover:bg-emerald group-hover:text-white transition-colors">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-ink group-hover:text-emerald transition-colors truncate">
                    {action.title}
                  </p>
                  <p className="type-caption mt-0.5 text-ink-secondary">{action.description}</p>
                </div>
                <span className="ml-auto size-3.5 text-ink-secondary group-hover:text-emerald transition-colors">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
