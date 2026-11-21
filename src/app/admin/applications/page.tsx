"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
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

export default function AdminApplicationsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [applications, setApplications] = useState<Array<any>>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const pageRef = useRef(1);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  const loadApplications = useCallback(async (page = 1) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const res = await communityApi.getAdminApplications(accessToken, {
      page,
      pageSize: 20,
      search: search || undefined,
      programId: programFilter || undefined,
      status: statusFilter || undefined,
      sortBy: "created_at",
      sortDir: "desc",
    });
    if (res.ok) {
      setApplications(res.data.items);
      setMeta(res.data.meta);
      pageRef.current = page;
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [accessToken, search, programFilter, statusFilter]);

  useEffect(() => {
    loadApplications(1);
  }, [loadApplications]);

  const handleStatusUpdate = useCallback(async (id: string, status: string) => {
    setStatusUpdateLoading(id);
    const res = await communityApi.updateApplicationStatus(accessToken!, id, status);
    setStatusUpdateLoading(null);
    if (res.ok) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, application_status: status, reviewed_at: new Date().toISOString() } : a)),
      );
    } else {
      setError(res.error.message);
    }
  }, [accessToken]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((a) => {
      counts[a.application_status] = (counts[a.application_status] ?? 0) + 1;
    });
    return counts;
  }, [applications]);

  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Application Management"
          title="All Applications"
          description="Review, search, filter, and update application statuses."
        />

        {/* Stats summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <StatCard title="Total" value={applications.length} />
          <StatCard title="Pending" value={statusCounts["pending"] ?? 0} />
          <StatCard title="Under Review" value={statusCounts["under_review"] ?? 0} />
          <StatCard title="Accepted" value={statusCounts["accepted"] ?? 0} />
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-6">
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
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </Select>
            </Field>
            <div className="flex items-end">
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
        <div className="mt-8 rounded-xl border border-line bg-surface overflow-hidden">
          {error ? (
            <ErrorState message={error} />
          ) : applications.length === 0 ? (
            <EmptyState
              title="No applications found"
              description="No applications match your current filters."
              action={{ label: "Clear filters", href: "/admin/applications" }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line bg-surface-raised">
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Applicant</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Program</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Submitted</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app: any) => (
                    <tr
                      key={app.id}
                      className="border-b border-line hover:bg-surface-raised transition-colors cursor-pointer"
                      onClick={() => {
                        // Navigate to detail
                      }}
                    >
                      <td className="px-4 py-3 text-sm text-ink">
                        {app.applicant_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {app.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {app.programs?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink">
                        <AdminStatusBadge status={app.application_status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <select
                          defaultValue={app.application_status}
                          onChange={(e) => void handleStatusUpdate(app.id, e.currentTarget.value)}
                          disabled={statusUpdateLoading === app.id}
                          className="text-xs bg-transparent border-none text-ink focus-visible:ring-0"
                        >
                          {["pending", "under_review", "shortlisted", "accepted", "rejected", "waitlisted"].map(
                            (status) => (
                              <option key={status} value={status}>
                                {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                              </option>
                            ),
                          )}
                        </select>
                        {statusUpdateLoading === app.id && (
                          <span className="text-[0.75rem] text-ink-muted">Updating…</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[0.8125rem] text-ink-muted">
              {meta.total} applications &middot; Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (pageRef.current > 1) void loadApplications(pageRef.current - 1);
                }}
                disabled={pageRef.current <= 1 || loading}
                size="sm"
              >
                Prev
              </Button>
              <Button
                onClick={() => {
                  if (pageRef.current < meta.totalPages) void loadApplications(pageRef.current + 1);
                }}
                disabled={pageRef.current >= meta.totalPages || loading}
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </SectionInner>
    </Section>
  );
}
