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

interface AmbassadorRow {
  id: string;
  name: string;
  email: string;
  status: string | null;
  joinedAt: string | null;
  referralCode: string | null;
  totalRegistrations: number;
  verifiedRegistrations: number;
}

export default function AmbassadorsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Array<any>>([]);
  const [ambassadors, setAmbassadors] = useState<AmbassadorRow[]>([]);
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ambassadorProgramId =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_PROGRAM_ID_AMBASSADOR ?? "")
      : "";

  const buildAmbassadorRows = (parts: any[], refs: any[]): AmbassadorRow[] => {
    const byUser = new Map<string, any>();
    for (const r of refs) {
      const key = r.participant_id ?? r.participants?.user_id ?? "";
      if (key) byUser.set(key, r);
    }
    return parts.map((p) => {
      const ref = byUser.get(p.user_id ?? p.id);
      return {
        id: p.id,
        name: p.profiles?.full_name || "—",
        email: p.profiles?.email || "—",
        status: p.participant_status ?? null,
        joinedAt: p.joined_at ?? null,
        referralCode: ref?.referral_code ?? null,
        totalRegistrations: ref?.total_registrations ?? 0,
        verifiedRegistrations: ref?.verified_registrations ?? 0,
      };
    });
  };

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const [appRes, partRes, refRes, taskRes] = await Promise.all([
        communityApi.getAdminApplications(accessToken, {
          page: 1,
          pageSize: 100,
          programId: ambassadorProgramId || undefined,
          sortBy: "created_at",
          sortDir: "desc",
        }),
        communityApi.getAdminParticipants(accessToken, {
          page: 1,
          pageSize: 100,
          programId: ambassadorProgramId || undefined,
        }),
        communityApi.getAdminReferrals(accessToken, { page: 1, pageSize: 100 }),
        communityApi.getAdminTasks(accessToken, {
          page: 1,
          pageSize: 50,
          programId: ambassadorProgramId || undefined,
        }),
      ]);
      if (appRes.ok) setApplications(appRes.data.items);
      if (partRes.ok) {
        setAmbassadors(buildAmbassadorRows(partRes.data.items, refRes.ok ? refRes.data.items : []));
      }
      if (taskRes.ok) setTasks(taskRes.data.items);
    } catch {
      setError("Failed to load Ambassador Programme data.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, ambassadorProgramId]);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

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

  const activeAmbassadorCount = ambassadors.filter((a) => a.status === "active").length;
  const totalReferrals = ambassadors.reduce((sum, a) => sum + a.totalRegistrations, 0);
  const totalVerified = ambassadors.reduce((sum, a) => sum + a.verifiedRegistrations, 0);

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Ambassadors"
        description="Manage ambassador applications, selected ambassadors, and referral performance."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Ambassadors", href: "/admin/ambassadors" },
        ]}
        actions={
          <Link href="/admin/applications?programId=9c9b5e30-78df-46c6-bfb7-f37bd094ef2e" className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">
            All applications <ArrowRight className="size-3" />
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatisticCard title="Applications" value={applications.length} icon={<span className="size-5">📄</span>} />
        <StatisticCard title="Pending" value={statusCounts["pending"] ?? 0} icon={<span className="size-5">⏳</span>} />
        <StatisticCard title="Accepted" value={statusCounts["accepted"] ?? 0} icon={<span className="size-5">✅</span>} />
        <StatisticCard title="Active ambassadors" value={activeAmbassadorCount} icon={<span className="size-5">👥</span>} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Referral registrations" value={totalReferrals} icon={<span className="size-5">🔗</span>} subtitle="Across all ambassadors" />
        <StatisticCard title="Verified registrations" value={totalVerified} icon={<span className="size-5">✅</span>} subtitle="Verified referral records" />
      </div>

      {/* Applications section */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Ambassador Applications</p>
            <p className="text-[0.8125rem] text-ink-secondary">Applications for the Ambassador Programme</p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          {error ? (
            <ErrorState message={error} />
          ) : applications.length === 0 ? (
            <EmptyState title="No ambassador applications" description="No applications have been submitted to the Ambassador Programme." />
          ) : (
            <ResponsiveTable caption="Ambassador applications">
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

      {/* Ambassadors section with referral performance */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Selected Ambassadors</p>
            <p className="text-[0.8125rem] text-ink-secondary">Approved ambassadors with referral attribution</p>
          </div>
          <Link
            href="/admin/participants"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            All participants <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="p-6 sm:p-8">
          {ambassadors.length === 0 ? (
            <EmptyState title="No ambassadors" description="No participants have been added to the Ambassador Programme yet." />
          ) : (
            <ResponsiveTable caption="Selected ambassadors">
              <TableHead>
                <TableHeader>
                  <TableCellHeader>Name</TableCellHeader>
                  <TableCellHeader>Email</TableCellHeader>
                  <TableCellHeader>Referral code</TableCellHeader>
                  <TableCellHeader>Registrations</TableCellHeader>
                  <TableCellHeader>Verified</TableCellHeader>
                  <TableCellHeader>Status</TableCellHeader>
                </TableHeader>
              </TableHead>
              <TableBody>
                {ambassadors.map((a) => (
                  <TableRow
                    key={a.id}
                    onClick={() => void router.push(`/admin/participants/detail?id=${a.id}`)}
                    className="cursor-pointer"
                  >
                    <TableCell>{a.name}</TableCell>
                    <TableCell className="text-ink-muted">{a.email}</TableCell>
                    <TableCell className="text-ink-muted font-mono text-xs">{a.referralCode || "—"}</TableCell>
                    <TableCell className="text-ink">{a.totalRegistrations}</TableCell>
                    <TableCell className="text-ink">{a.verifiedRegistrations}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
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
            <p className="type-label">Ambassador Tasks</p>
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
            <EmptyState title="No tasks" description="No tasks have been created for the Ambassador Programme yet." action={{ label: "Create task", href: "/admin/operations" }} />
          ) : (
            <ResponsiveTable caption="Ambassador tasks">
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
          Code Yaar Ambassador Programme — Campus, Community, and Regional ambassadors
          representing Code Yaar worldwide.
        </p>
      </div>
    </div>
  );
}
