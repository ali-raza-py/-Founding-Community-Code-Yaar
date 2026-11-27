"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/shared";
import { ResponsiveTable, TableBody, TableCell, TableCellHeader, TableHeader, TableHead, TableRow } from "@/components/dashboard/responsive-table";

export default function FoundingCohortPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Array<any>>([]);
  const [participants, setParticipants] = useState<Array<any>>([]);
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const foundingCohortProgramId =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_PROGRAM_ID_FOUNDING_COHORT ?? "")
      : "";

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const [appRes, partRes, taskRes] = await Promise.all([
        communityApi.getAdminApplications(accessToken, {
          page: 1,
          pageSize: 100,
          programId: foundingCohortProgramId || undefined,
          sortBy: "created_at",
          sortDir: "desc",
        }),
        communityApi.getAdminParticipants(accessToken, {
          page: 1,
          pageSize: 100,
          programId: foundingCohortProgramId || undefined,
        }),
        communityApi.getAdminTasks(accessToken, {
          page: 1,
          pageSize: 50,
          programId: foundingCohortProgramId || undefined,
        }),
      ]);
      if (appRes.ok) setApplications(appRes.data.items);
      if (partRes.ok) setParticipants(partRes.data.items);
      if (taskRes.ok) setTasks(taskRes.data.items);
    } catch {
      setError("Failed to load Founding Cohort data.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, foundingCohortProgramId]);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const statusCounts: Record<string, number> = {};
  applications.forEach((a) => {
    statusCounts[a.application_status] = (statusCounts[a.application_status] ?? 0) + 1;
  });

  const memberStatusCounts: Record<string, number> = {};
  participants.forEach((p) => {
    memberStatusCounts[p.participant_status] = (memberStatusCounts[p.participant_status] ?? 0) + 1;
  });

  const activeMemberCount = memberStatusCounts["active"] ?? 0;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Founding Cohort"
        description="Manage applications and members for The First 100 founding cohort."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Founding Cohort", href: "/admin/founding-cohort" },
        ]}
        actions={
          <Link href="/admin/applications?programId=b541c0bd-9d80-4007-af93-bd01b7d63aba" className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">
            All applications <ArrowRight className="size-3" />
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatisticCard title="Applications" value={applications.length} icon={<span className="size-5">📄</span>} />
        <StatisticCard title="Pending" value={statusCounts["pending"] ?? 0} icon={<span className="size-5">⏳</span>} />
        <StatisticCard title="Accepted" value={statusCounts["accepted"] ?? 0} icon={<span className="size-5">✅</span>} />
        <StatisticCard title="Active members" value={activeMemberCount} icon={<span className="size-5">👥</span>} />
      </div>

      {/* Applications section */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Founding Cohort Applications</p>
            <p className="text-[0.8125rem] text-ink-secondary">Applications for The First 100</p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          {error ? (
            <ErrorState message={error} />
          ) : applications.length === 0 ? (
            <EmptyState title="No founding cohort applications" description="No applications have been submitted to the Founding Cohort programme." />
          ) : (
            <ResponsiveTable caption="Founding cohort applications">
              <TableHead>
                <TableHeader>
                  <TableCellHeader>Applicant</TableCellHeader>
                  <TableCellHeader>Email</TableCellHeader>
                  <TableCellHeader>Status</TableCellHeader>
                  <TableCellHeader className="text-right">Action</TableCellHeader>
                </TableHeader>
              </TableHead>
              <TableBody>
                {applications.slice(0, 10).map((app: any) => (
                  <TableRow key={app.id} onClick={() => void router.push(`/admin/applications/detail?id=${app.id}`)} className="cursor-pointer">
                    <TableCell>{app.applicant_name || "—"}</TableCell>
                    <TableCell className="text-ink-muted">{app.email || "—"}</TableCell>
                    <TableCell><StatusBadge status={app.application_status} /></TableCell>
                    <TableCell className="text-right">
                      <span className="text-[0.75rem] font-medium text-emerald">Review →</span>
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length > 10 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-ink-secondary">
                      Showing 10 of {applications.length} applications.{" "}
                      <Link
                        href="/admin/applications"
                        className="text-emerald hover:underline font-medium"
                      >
                        View all
                      </Link>
                    </td>
                  </tr>
                )}
              </TableBody>
            </ResponsiveTable>
          )}
        </div>
      </div>

      {/* Members section */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Founding Cohort Members</p>
            <p className="text-[0.8125rem] text-ink-secondary">Approved participants in the programme</p>
          </div>
          <Link
            href="/admin/participants"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            All participants <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="p-6 sm:p-8">
          {participants.length === 0 ? (
            <EmptyState title="No founding cohort members" description="No participants have been added to the Founding Cohort programme yet." />
          ) : (
            <ResponsiveTable caption="Founding cohort members">
              <TableHead>
                <TableHeader>
                  <TableCellHeader>Name</TableCellHeader>
                  <TableCellHeader>Email</TableCellHeader>
                  <TableCellHeader>Status</TableCellHeader>
                  <TableCellHeader>Joined</TableCellHeader>
                  <TableCellHeader className="text-right">Action</TableCellHeader>
                </TableHeader>
              </TableHead>
              <TableBody>
                {participants.map((p: any) => (
                  <TableRow
                    key={p.id}
                    onClick={() => void router.push(`/admin/participants/detail?id=${p.id}`)}
                    className="cursor-pointer"
                  >
                    <TableCell>{p.profiles?.full_name || "—"}</TableCell>
                    <TableCell className="text-ink-muted">{p.profiles?.email || "—"}</TableCell>
                    <TableCell><StatusBadge status={p.participant_status} /></TableCell>
                    <TableCell className="text-ink-muted">
                      {p.joined_at ? new Date(p.joined_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-[0.75rem] font-medium text-emerald">View →</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ResponsiveTable>
          )}
        </div>
      </div>

      {/* Tasks section */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Founding Cohort Tasks</p>
            <p className="text-[0.8125rem] text-ink-secondary">Classroom tasks assigned to this programme</p>
          </div>
          <Link
            href="/admin/operations"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            All operations <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="p-6 sm:p-8">
          {tasks.length === 0 ? (
            <EmptyState title="No tasks" description="No tasks have been created for the Founding Cohort programme yet." action={{ label: "Create task", href: "/admin/operations" }} />
          ) : (
            <ResponsiveTable caption="Founding cohort tasks">
              <TableHead>
                <TableHeader>
                  <TableCellHeader>Task</TableCellHeader>
                  <TableCellHeader>Assigned to</TableCellHeader>
                  <TableCellHeader>Deadline</TableCellHeader>
                  <TableCellHeader>Status</TableCellHeader>
                </TableHeader>
              </TableHead>
              <TableBody>
                {tasks.slice(0, 10).map((t: any) => (
                  <TableRow key={t.id} onClick={() => void router.push(`/admin/operations/detail?id=${t.id}`)} className="cursor-pointer">
                    <TableCell>{t.title}</TableCell>
                    <TableCell className="text-ink-muted font-mono text-xs">
                      {t.assigned_name || "—"}
                    </TableCell>
                    <TableCell className="text-ink-muted font-mono text-xs">
                      {t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
                {tasks.length > 10 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-ink-secondary">
                      Showing 10 of {tasks.length} tasks.{" "}
                      <Link
                        href="/admin/operations"
                        className="text-emerald hover:underline font-medium"
                      >
                        View all
                      </Link>
                    </td>
                  </tr>
                )}
              </TableBody>
            </ResponsiveTable>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="type-label mb-2">Programme</p>
        <p className="text-sm text-ink-secondary">
          Founding Cohort 2026–27 — The First 100 founding members of the Code Yaar community.
        </p>
      </div>
    </div>
  );
}
