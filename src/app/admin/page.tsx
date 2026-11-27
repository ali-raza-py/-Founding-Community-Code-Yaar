"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  UserCheck,
  Users,
  Mail,
  ListChecks,
  ShieldAlert,
  Activity,
} from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/admin/shared";
import { LoadingState } from "@/components/admin/shared";
import { getProgramConfig } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface Stat {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
}

interface RecentActivityItem {
  id: string;
  type: "registration" | "application" | "task" | "referral";
  label: string;
  detail: string;
  time: string;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  superAdmin?: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Create task",
    description: "Assign classroom work to participants.",
    href: "/admin/operations",
    icon: ListChecks,
  },
  {
    title: "Review applications",
    description: "Review and update application statuses.",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    title: "View participants",
    description: "Browse the community directory.",
    href: "/admin/participants",
    icon: Users,
  },
  {
    title: "Compose email",
    description: "Send a message to the community.",
    href: "/admin/email",
    icon: Mail,
  },
  {
    title: "User administration",
    description: "Manage profiles and roles.",
    href: "/admin/administration",
    icon: ShieldAlert,
    superAdmin: true,
  },
];

export default function AdminDashboardPage() {
  const { accessToken, isAuthenticated, isAdmin, isSuperAdmin, isLoading } = useAuth();
  const [stats, setStats] = useState<{ applications: number; participants: number | null } | null>(null);
  const [foundingCount, setFoundingCount] = useState<number | null>(null);
  const [ambassadorCount, setAmbassadorCount] = useState<number | null>(null);
  const [pendingApps, setPendingApps] = useState<number | null>(null);
  const [activeTasks, setActiveTasks] = useState<number | null>(null);
  const [completedTasks, setCompletedTasks] = useState<number | null>(null);
  const [referralRegistrations, setReferralRegistrations] = useState<number | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!accessToken) return;
    const [statsRes] = await Promise.all([
      communityApi.getAdminStats(accessToken),
    ]);
    if (statsRes.ok) setStats(statsRes.data);
    else setError(statsRes.error.message);
  }, [accessToken]);

  const loadProgramCounts = useCallback(async () => {
    if (!accessToken) return;
    const programIds = getProgramConfig();
    const [foundingRes, ambassadorRes] = await Promise.all([
      communityApi.getAdminParticipants(accessToken, {
        page: 1,
        pageSize: 1,
        programId: programIds.foundingCohort || undefined,
      }),
      communityApi.getAdminParticipants(accessToken, {
        page: 1,
        pageSize: 1,
        programId: programIds.ambassadorProgram || undefined,
      }),
    ]);
    if (foundingRes.ok) setFoundingCount(foundingRes.data.meta.total);
    if (ambassadorRes.ok) setAmbassadorCount(ambassadorRes.data.meta.total);
  }, [accessToken]);

  const loadApplicationCounts = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminApplications(accessToken, {
      page: 1,
      pageSize: 1,
      status: "pending",
      sortBy: "created_at",
      sortDir: "desc",
    });
    if (res.ok) setPendingApps(res.data.meta.total);
  }, [accessToken]);

  const loadTaskCounts = useCallback(async () => {
    if (!accessToken) return;
    const [activeRes, completedRes] = await Promise.all([
      communityApi.getAdminTasks(accessToken, { page: 1, pageSize: 1, status: "in_progress" }),
      communityApi.getAdminTasks(accessToken, { page: 1, pageSize: 1, status: "completed" }),
    ]);
    if (activeRes.ok) setActiveTasks(activeRes.data.meta.total);
    if (completedRes.ok) setCompletedTasks(completedRes.data.meta.total);
  }, [accessToken]);

  const loadReferralCounts = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminReferrals(accessToken, { page: 1, pageSize: 1 });
    if (res.ok) {
      const total = res.data.items.reduce((sum, r) => sum + (r.total_registrations ?? 0), 0);
      setReferralRegistrations(total);
    }
  }, [accessToken]);

  const loadRecentActivity = useCallback(async () => {
    if (!accessToken) return;
    const [appsRes, tasksRes, referralsRes, participantsRes] = await Promise.all([
      communityApi.getAdminApplications(accessToken, { page: 1, pageSize: 5, sortBy: "created_at", sortDir: "desc" }),
      communityApi.getAdminTasks(accessToken, { page: 1, pageSize: 5, sortBy: "created_at", sortDir: "desc" }),
      communityApi.getAdminReferrals(accessToken, { page: 1, pageSize: 5 }),
      communityApi.getAdminParticipants(accessToken, { page: 1, pageSize: 5 }),
    ]);

    const items: RecentActivityItem[] = [];

    if (appsRes.ok && appsRes.data.items) {
      for (const app of appsRes.data.items as any[]) {
        items.push({
          id: `app-${app.id}`,
          type: "application",
          label: "Application submitted",
          detail: `${app.applicant_name} — ${app.programs?.name || "—"}`,
          time: app.created_at,
        });
      }
    }
    if (tasksRes.ok && tasksRes.data.items) {
      for (const t of tasksRes.data.items as any[]) {
        items.push({
          id: `task-${t.id}`,
          type: "task",
          label: "Task created",
          detail: `${t.title} — ${t.program_name || "—"}`,
          time: t.created_at,
        });
      }
    }
    if (referralsRes.ok && referralsRes.data.items) {
      for (const r of referralsRes.data.items as any[]) {
        items.push({
          id: `ref-${r.id}`,
          type: "referral",
          label: "Referral registered",
          detail: `${r.participants?.profiles?.full_name || "—"} — ${r.referral_code}`,
          time: r.created_at,
        });
      }
    }
    if (participantsRes.ok && participantsRes.data.items) {
      for (const p of participantsRes.data.items as any[]) {
        items.push({
          id: `participant-${p.id}`,
          type: "registration",
          label: "Participant registered",
          detail: `${p.profiles?.full_name || "—"} — ${p.programs?.name || "—"}`,
          time: p.created_at,
        });
      }
    }

    items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setRecentActivity(items.slice(0, 8));
  }, [accessToken]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      loadStats(),
      loadProgramCounts(),
      loadApplicationCounts(),
      loadTaskCounts(),
      loadReferralCounts(),
      loadRecentActivity(),
    ]).finally(() => setLoading(false));
  }, [loadStats, loadProgramCounts, loadApplicationCounts, loadTaskCounts, loadReferralCounts, loadRecentActivity]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const applicationsCount = stats?.applications ?? 0;
  const participantsCount = stats?.participants ?? 0;

  const dashboardStats: Stat[] = [
    {
      title: "Total participants",
      value: participantsCount === null ? "—" : participantsCount,
      subtitle: "Approved community members",
      icon: UserCheck,
    },
    {
      title: "Founding Cohort",
      value: foundingCount === null ? "—" : foundingCount,
      subtitle: "Approved members",
      icon: Users,
    },
    {
      title: "Ambassadors",
      value: ambassadorCount === null ? "—" : ambassadorCount,
      subtitle: "Approved members",
      icon: UserCheck,
    },
    {
      title: "Pending applications",
      value: pendingApps === null ? "—" : pendingApps,
      subtitle: "Awaiting review",
      icon: FileText,
    },
    {
      title: "Active tasks",
      value: activeTasks === null ? "—" : activeTasks,
      subtitle: "In progress",
      icon: ListChecks,
    },
    {
      title: "Completed tasks",
      value: completedTasks === null ? "—" : completedTasks,
      subtitle: "Finished work",
      icon: Activity,
    },
    {
      title: "Referral registrations",
      value: referralRegistrations === null ? "—" : referralRegistrations,
      subtitle: "Real referral records",
      icon: Mail,
    },
  ];

  const pendingCount = recentActivity.filter((a) => a.type === "application").length;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Dashboard"
        description="Complete overview of Code Yaar's community and operations. All figures come from live backend records."
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

      {/* Overview metrics */}
      <section aria-label="Overview metrics">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {dashboardStats.map((stat, index) => (
            <StatisticCard
              key={index}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={<stat.icon className="size-5" />}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Application overview */}
        <section className="lg:col-span-2 rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="type-label">Application overview</p>
              <h3 className="text-base font-semibold text-ink">Applications by status</h3>
            </div>
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              View all <span className="size-3">→</span>
            </Link>
          </div>
          <div className="rounded-xl border border-line bg-surface overflow-hidden">
            {error ? (
              <ErrorState message={error} />
            ) : applicationsCount === 0 ? (
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
                      <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Total</th>
                      <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Pending</th>
                      <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Accepted</th>
                      <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Rejected</th>
                      <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary text-right">Last activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-line">
                      <td className="px-6 py-4 text-sm font-medium text-ink">
                        {applicationsCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-muted">{pendingApps === null ? "—" : pendingApps}</td>
                      <td className="px-6 py-4 text-sm text-ink-muted">—</td>
                      <td className="px-6 py-4 text-sm text-ink-muted">—</td>
                      <td className="px-6 py-4 text-sm text-ink-secondary text-right">
                        {recentActivity.length > 0
                          ? new Date(recentActivity[0].time).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Programme overview */}
        <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="type-label">Programme overview</p>
              <h3 className="text-base font-semibold text-ink">Programme participation</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-line bg-surface-raised">
              <div>
                <p className="type-label mb-1">Founding Cohort</p>
                <p className="text-sm font-semibold text-ink">
                  {foundingCount === null ? "—" : foundingCount}
                </p>
              </div>
              <StatusBadge status="active" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-line bg-surface-raised">
              <div>
                <p className="type-label mb-1">Ambassador Programme</p>
                <p className="text-sm font-semibold text-ink">
                  {ambassadorCount === null ? "—" : ambassadorCount}
                </p>
              </div>
              <StatusBadge status="active" />
            </div>
            <p className="type-caption mt-2 text-ink-secondary">
              Figures reflect approved memberships only. Pending applications are
              not counted as active members.
            </p>
          </div>
        </section>
      </div>

      {/* Recent activity */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="type-label">Recent activity</p>
            <h3 className="text-base font-semibold text-ink">Community operations</h3>
          </div>
        </div>
        {recentActivity.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="No registrations, applications, tasks, or referrals have been recorded yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised">
                  <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Event</th>
                  <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary">Details</th>
                  <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-secondary text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr key={item.id} className="border-b border-line/50 hover:bg-surface-raised/50 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      <span className="flex items-center gap-2">
                        {item.type === "application" && <FileText className="size-3.5 text-ink-secondary" />}
                        {item.type === "task" && <ListChecks className="size-3.5 text-ink-secondary" />}
                        {item.type === "referral" && <Mail className="size-3.5 text-ink-secondary" />}
                        {item.type === "registration" && <UserCheck className="size-3.5 text-ink-secondary" />}
                        <span className="font-medium text-ink">{item.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-secondary">{item.detail}</td>
                    <td className="px-6 py-4 text-sm font-mono text-ink-secondary text-right">
                      {item.time ? new Date(item.time).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Operational shortcuts */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="type-label">Operational shortcuts</p>
            <h3 className="text-base font-semibold text-ink">Quick actions</h3>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK_ACTIONS.filter((a) => !(a.superAdmin && !isSuperAdmin)).map((action) => {
            const Icon = action.icon;
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
      </section>
    </div>
  );
}
