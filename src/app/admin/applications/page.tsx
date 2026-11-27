"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmationDialog } from "@/components/dashboard/confirmation-dialog";
import {
  ErrorState,
  LoadingState,
} from "@/components/admin/shared";
import { ResponsiveTable, TableBody, TableCell, TableCellHeader, TableHeader, TableHead, TableRow } from "@/components/dashboard/responsive-table";

export default function AdminApplicationsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [applications, setApplications] = useState<Array<any>>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [referralFilter, setReferralFilter] = useState<"all" | "referred" | "direct">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  // Pending (unconfirmed) status per application, so the select reflects the
  // attempted value until the confirmation dialog is confirmed or cancelled.
  const [pendingStatus, setPendingStatus] = useState<Record<string, string>>({});

  // Confirmation dialog for status changes.
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState("");
  const [confirmStatus, setConfirmStatus] = useState("");

  const loadApplications = useCallback(async (page = 1) => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await communityApi.getAdminApplications(accessToken, {
        page,
        pageSize: 20,
        search: search || undefined,
        programId: programFilter || undefined,
        status: statusFilter || undefined,
        referred: referralFilter,
        sortBy: "created_at",
        sortDir: "desc",
      });
      if (res.ok) {
        setApplications(res.data?.items ?? []);
        setMeta(res.data?.meta ?? null);
        setCurrentPage(page);
      } else {
        setError(res.error.message || "Failed to load applications.");
        setApplications([]);
        setMeta(null);
      }
    } catch {
      setError("Unable to load applications. Please try again.");
      setApplications([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, search, programFilter, statusFilter, referralFilter]);

  useEffect(() => {
    loadApplications(1);
  }, [loadApplications]);

  const requestStatusChange = useCallback((id: string, status: string) => {
    setPendingStatus((prev) => ({ ...prev, [id]: status }));
    setConfirmId(id);
    setConfirmStatus(status);
    setConfirmOpen(true);
  }, []);

  const handleStatusUpdate = useCallback(async (id: string, status: string) => {
    setConfirmOpen(false);
    if (!accessToken) return;
    setStatusUpdateLoading(id);
    try {
      const res = await communityApi.updateApplicationStatus(accessToken, id, status);
      setStatusUpdateLoading(null);
      if (res.ok) {
        setPendingStatus((prev) => {
          const { [id]: _removed, ...rest } = prev;
          return rest;
        });
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, application_status: status, reviewed_at: new Date().toISOString() } : a)),
        );
      } else {
        setError(res.error.message || "Failed to update application status.");
      }
    } catch {
      setStatusUpdateLoading(null);
      setError("Unable to update application status. Please try again.");
    }
  }, [accessToken]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (applications || []).forEach((a) => {
      const s = a?.application_status;
      if (s) counts[s] = (counts[s] ?? 0) + 1;
    });
    return counts;
  }, [applications]);

  const referredCount = useMemo(() => {
    return (applications || []).filter((a) => a?.referral_code).length;
  }, [applications]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const statusOptions = [
    "pending",
    "under_review",
    "shortlisted",
    "accepted",
    "rejected",
    "waitlisted",
  ];

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="All Applications"
        description="Review, search, filter, and update application statuses."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Applications", href: "/admin/applications" }]}
      />

      {/* Stats summary */}
      <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <StatisticCard title="Total" value={applications.length} icon={<span className="size-5">📄</span>} />
        <StatisticCard title="Pending" value={statusCounts["pending"] ?? 0} icon={<span className="size-5">⏳</span>} />
        <StatisticCard title="Under Review" value={statusCounts["under_review"] ?? 0} icon={<span className="size-5">🔎</span>} />
        <StatisticCard title="Accepted" value={statusCounts["accepted"] ?? 0} icon={<span className="size-5">✅</span>} />
        <StatisticCard title="Referred" value={referredCount} icon={<span className="size-5">🔗</span>} />
      </div>

      {/* Error state with retry */}
      {error && (
        <div>
          <ErrorState message={error} onRetry={() => void loadApplications(1)} />
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <Field label="Search by name or email">
            <Input
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Applicant name or email"
            />
          </Field>
          <Field label="Program">
            <Select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.currentTarget.value)}
            >
              <option value="">All programs</option>
              <option value="founding-cohort">Founding Cohort</option>
              <option value="ambassador">Ambassador Program</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.currentTarget.value)}
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Referral type">
            <Select
              value={referralFilter}
              onChange={(e) => setReferralFilter(e.currentTarget.value as "all" | "referred" | "direct")}
            >
              <option value="all">All applications</option>
              <option value="referred">Referred applications</option>
              <option value="direct">Direct applications</option>
            </Select>
          </Field>
          <div className="flex items-end col-span-4 sm:col-span-1">
            <Button
              onClick={() => void loadApplications(1)}
              disabled={loading}
            >
              Apply filters
            </Button>
          </div>
        </div>
      </div>

      {/* Applications table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {(applications || []).length === 0 ? (
          <EmptyState
            title="No applications found"
            description="No applications match your current filters."
            action={{ label: "Clear filters", href: "/admin/applications" }}
          />
        ) : (
          <ResponsiveTable caption="Application register">
            <TableHead>
              <TableHeader>
                <TableCellHeader>Applicant</TableCellHeader>
                <TableCellHeader>Email</TableCellHeader>
                <TableCellHeader>Program</TableCellHeader>
                <TableCellHeader>Referred by</TableCellHeader>
                <TableCellHeader>Referral code</TableCellHeader>
                <TableCellHeader>Status</TableCellHeader>
                <TableCellHeader>Submitted</TableCellHeader>
                <TableCellHeader className="text-right">Action</TableCellHeader>
              </TableHeader>
            </TableHead>
            <TableBody>
              {(applications || []).map((app: any) => (
                <TableRow key={app.id}>
                  <TableCell>{app?.applicant_name || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{app?.email || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{app?.programs?.name || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{app?.referred_by_ambassador_name || "—"}</TableCell>
                  <TableCell className="text-ink-muted font-mono">{app?.referral_code || "—"}</TableCell>
                  <TableCell>
                    <select
                      value={pendingStatus[app.id] ?? app.application_status}
                      onChange={(e) => void requestStatusChange(app.id, e.currentTarget.value)}
                      disabled={statusUpdateLoading === app.id}
                      className="text-xs bg-transparent border-none text-ink focus-visible:ring-0"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    {statusUpdateLoading === app.id && (
                      <span className="text-[0.75rem] text-ink-secondary">Updating…</span>
                    )}
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {app?.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}
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
            </TableBody>
          </ResponsiveTable>
        )}
      </div>

      {/* Status confirmation dialog */}
      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingStatus((prev) => {
            const { [confirmId]: _removed, ...rest } = prev;
            return rest;
          });
        }}
        title="Update application status"
        description="Changing the status will notify the applicant."
        confirmLabel="Update status"
        onConfirm={() => void handleStatusUpdate(confirmId, confirmStatus)}
        loading={statusUpdateLoading === confirmId}
      />

      {/* Pagination */}
      {meta && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[0.8125rem] text-ink-secondary">
            {meta.total} applications &middot; Page {currentPage} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (currentPage > 1) void loadApplications(currentPage - 1);
              }}
              disabled={currentPage <= 1 || loading}
              size="sm"
            >
              Prev
            </Button>
            <Button
              onClick={() => {
                if (currentPage < meta.totalPages) void loadApplications(currentPage + 1);
              }}
              disabled={currentPage >= meta.totalPages || loading}
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
