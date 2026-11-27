"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState, LoadingState } from "@/components/admin/shared";
import { ResponsiveTable, TableBody, TableCell, TableCellHeader, TableHeader, TableHead, TableRow } from "@/components/dashboard/responsive-table";
import { ArrowRight } from "lucide-react";

export default function AmbassadorsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [applications, setApplications] = useState<Array<any>>([]);
  const [participants, setParticipants] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ambassadorProgramId =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_PROGRAM_ID_AMBASSADOR ?? "")
      : "";

  const loadApplications = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminApplications(accessToken, {
      page: 1,
      pageSize: 100,
      programId: ambassadorProgramId || undefined,
      sortBy: "created_at",
      sortDir: "desc",
    });
    if (res.ok) {
      setApplications(res.data.items);
    } else {
      setError(res.error.message);
    }
  }, [accessToken, ambassadorProgramId]);

  const loadParticipants = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminParticipants(accessToken, {
      page: 1,
      pageSize: 100,
      programId: ambassadorProgramId || undefined,
    });
    if (res.ok) {
      setParticipants(res.data.items);
    } else {
      setError(res.error.message);
    }
  }, [accessToken, ambassadorProgramId]);

  useEffect(() => {
    loadApplications();
    loadParticipants();
    setLoading(false);
  }, [loadApplications, loadParticipants]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const statusCounts: Record<string, number> = {};
  applications.forEach((a) => {
    statusCounts[a.application_status] = (statusCounts[a.application_status] ?? 0) + 1;
  });

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Code Yaar Ambassador Programme"
        description="Manage ambassador applications, selected ambassadors, and referrals."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Ambassadors", href: "/admin/ambassadors" }]}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatisticCard title="Applications" value={applications.length} icon={<span className="size-5">📄</span>} />
        <StatisticCard title="Pending" value={statusCounts["pending"] ?? 0} icon={<span className="size-5">⏳</span>} />
        <StatisticCard title="Accepted" value={statusCounts["accepted"] ?? 0} icon={<span className="size-5">✅</span>} />
        <StatisticCard title="Ambassadors" value={participants.length} icon={<span className="size-5">👥</span>} />
      </div>

      {/* Applications section */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Ambassador Applications</p>
            <p className="text-[0.8125rem] text-ink-secondary">Applications for the Ambassador Programme</p>
          </div>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            All applications <ArrowRight className="size-3" />
          </Link>
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
                  <TableRow key={app.id}>
                    <TableCell>{app.applicant_name || "—"}</TableCell>
                    <TableCell className="text-ink-muted">{app.email || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={app.application_status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/applications/detail?id=${app.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                      >
                        Review <span className="size-3">→</span>
                      </Link>
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

      {/* Ambassadors section */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Selected Ambassadors</p>
            <p className="text-[0.8125rem] text-ink-secondary">Approved ambassadors in the programme</p>
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
            <EmptyState title="No ambassadors" description="No participants have been added to the Ambassador Programme yet." />
          ) : (
            <ResponsiveTable caption="Selected ambassadors">
              <TableHead>
                <TableHeader>
                  <TableCellHeader>Name</TableCellHeader>
                  <TableCellHeader>Email</TableCellHeader>
                  <TableCellHeader>Status</TableCellHeader>
                  <TableCellHeader>Joined</TableCellHeader>
                </TableHeader>
              </TableHead>
              <TableBody>
                {participants.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.profiles?.full_name || "—"}</TableCell>
                    <TableCell className="text-ink-muted">{p.profiles?.email || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={p.participant_status} />
                    </TableCell>
                    <TableCell className="text-ink-muted">
                      {p.joined_at ? new Date(p.joined_at).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
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
