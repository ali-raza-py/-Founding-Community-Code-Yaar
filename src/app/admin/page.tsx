"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  StatCard,
  EmptyState,
  ErrorState,
  LoadingState,
  AdminStatusBadge,
} from "@/components/admin/shared";
import { cn } from "@/lib/utils";

interface RecentApplication {
  id: string;
  applicant_name: string;
  email: string;
  programs?: { name: string; slug: string } | null;
  application_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin, signOut } = useAuth();
  const [stats, setStats] = useState<{ applications: number; participants: number | null } | null>(null);
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminStats(accessToken);
    if (res.ok) setStats(res.data);
    // Backend endpoints may not be implemented yet — show empty state instead
    // of a hard error so a successful sign-in is not followed by an error page.
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
    // Backend endpoints may not be implemented yet — show empty state instead
    // of a hard error so a successful sign-in is not followed by an error page.
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

  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Admin Dashboard"
          title="Overview"
          description="Key metrics and recent activity for the Code Yaar community."
        />

        {/* Stats cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={applicationsCount}
            subtitle="Across all programmes"
          />
          <StatCard
            title="Pending Reviews"
            value={recentApps.filter((a) => a.application_status === "pending").length}
            subtitle="Applications awaiting review"
          />
          <StatCard
            title="Total Participants"
            value={participantsCount === null ? "—" : participantsCount}
            subtitle="Approved community members"
          />
          <StatCard
            title="Recent Submissions"
            value={recentApps.length}
            subtitle="Last 5 applications"
          />
        </div>

        {/* Recent applications */}
        <div className="mt-10 rounded-xl border border-line bg-surface overflow-hidden">
          <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
            <div>
              <p className="type-label">Recent Applications</p>
              <p className="text-[0.8125rem] text-ink-muted">Latest submissions needing review</p>
            </div>
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              View all <span className="size-3">→</span>
            </Link>
          </div>

          {error ? (
            <ErrorState message={error} />
          ) : recentApps.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="No applications have been submitted to the community."
              action={{ label: "Review applications", href: "/admin/applications" }}
            />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Applicant</th>
                  <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Program</th>
                  <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                  <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Submitted</th>
                  <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-line hover:bg-surface-raised transition-colors cursor-pointer"
                    onClick={() => {
                      // Navigate to application detail
                    }}
                  >
                    <td className="px-6 py-3 text-sm text-ink">
                      {app.applicant_name || "—"}
                    </td>
                    <td className="px-6 py-3 text-sm text-ink-muted">
                      {app.programs?.name || "—"}
                    </td>
                    <td className="px-6 py-3 text-sm text-ink">
                      <AdminStatusBadge status={app.application_status} />
                    </td>
                    <td className="px-6 py-3 text-sm text-ink-muted">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-3 text-sm text-right">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Link href={`/admin/applications/detail?id=${app.id}`}>Review</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <QuickActionCard
            title="Review Applications"
            description="Review and update application statuses for founding cohort and ambassador programmes."
            href="/admin/applications"
            icon={<span className="size-5">📋</span>}
          />
          <QuickActionCard
            title="Manage Participants"
            description="View, create, and update participant records for approved members."
            href="/admin/participants"
            icon={<span className="size-5">👥</span>}
          />
          <QuickActionCard
            title="Verify Referrals"
            description="Review and verify referral registrations from ambassador programmes."
            href="/admin/referrals"
            icon={<span className="size-5">🔗</span>}
          />
          <QuickActionCard
            title="Publish Announcement"
            description="Create and publish announcements to the community."
            href="/admin/announcements"
            icon={<span className="size-5">📢</span>}
          />
          {true && (
            <QuickActionCard
              title="Assign Tasks"
              description="Create and assign tasks to participants and ambassadors."
              href="/admin/tasks"
              icon={<span className="size-5">✅</span>}
            />
          )}
        </div>
      </SectionInner>
    </Section>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-line bg-surface p-5 sm:p-6 transition-colors hover:bg-surface-raised hover:border-emerald"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-surface-raised p-2.5 text-emerald group-hover:bg-emerald group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-ink group-hover:text-emerald transition-colors">{title}</p>
          <p className="type-caption mt-0.5 text-ink-muted">{description}</p>
        </div>
        <span className="ml-auto size-3.5 text-ink-subtle group-hover:text-emerald transition-colors">→</span>
      </div>
    </Link>
  );
}
