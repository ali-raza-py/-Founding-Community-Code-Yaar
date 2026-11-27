"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ErrorState, LoadingState } from "@/components/admin/shared";

export default function AdminApplicationDetailPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const loadApplication = useCallback(async () => {
    if (!accessToken || !id) return;
    setLoading(true);
    setError(null);
    const res = await communityApi.getAdminApplication(accessToken, id);
    if (res.ok) {
      setApplication(res.data);
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [accessToken, id]);

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  const handleStatusUpdate = useCallback(async (status: string) => {
    if (!id) return;
    setUpdateLoading(true);
    const res = await communityApi.updateApplicationStatus(accessToken!, id, status);
    setUpdateLoading(false);
    if (res.ok) {
      setApplication((prev: any) => (prev ? { ...prev, application_status: status, reviewed_at: new Date().toISOString() } : prev));
    } else {
      setError(res.error.message);
    }
  }, [accessToken, id]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (!id) {
    return <ErrorState message="No application ID provided." />;
  }

  if (error || !application) {
    return <ErrorState message={error || "Application not found."} />;
  }

  const answers = application.application_answers || {};

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={application.applicant_name || "Untitled Application"}
        description={`Application ID: ${application.id}`}
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Applications", href: "/admin/applications" }, { label: "Detail", href: `/admin/applications/detail?id=${application.id}` }]}
        actions={
          <div className="flex items-end gap-3">
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              <span className="size-3.5">←</span> Back to applications
            </Link>
            <StatusBadge status={application.application_status} />
          </div>
        }
      />

        {/* Application info grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Applicant Name</p>
            <p className="text-sm font-semibold text-ink">{application.applicant_name || "—"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Email</p>
            <p className="text-sm font-semibold text-ink">{application.email || "—"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Program</p>
            <p className="text-sm font-semibold text-ink">{application.programs?.name || "—"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Institution</p>
            <p className="text-sm text-ink-muted">{application.institution || "—"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">City</p>
            <p className="text-sm text-ink-muted">{application.city || "—"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Phone</p>
            <p className="text-sm text-ink-muted">{application.phone || "—"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Status</p>
            <StatusBadge status={application.application_status} />
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Submitted</p>
            <p className="text-sm text-ink-muted">
              {application.created_at ? new Date(application.created_at).toLocaleString() : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Last Updated</p>
            <p className="text-sm text-ink-muted">
              {application.updated_at ? new Date(application.updated_at).toLocaleString() : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
            <p className="type-label mb-1">Referral Code</p>
            <p className="text-sm text-ink-muted font-mono">{application.referral_code || "—"}</p>
          </div>
        </div>

        {/* Application answers */}
        <div className="mt-10 rounded-xl border border-line bg-surface overflow-hidden">
          <div className="border-b border-line bg-surface-raised px-6 py-4">
            <div className="flex flex-col gap-1">
              <p className="type-label">Application Responses</p>
              <h3 className="text-base font-semibold text-ink">Submitted Answers</h3>
              <p className="type-caption mt-0.5 text-ink-secondary">
                All fields submitted by the applicant.
              </p>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            {Object.keys(answers).length === 0 ? (
              <p className="type-body text-ink-muted">No application answers recorded.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(answers).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-line bg-surface-raised p-4 sm:p-5"
                  >
                    <p className="type-label mb-1">{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                    <p className="text-sm text-ink">
                      {typeof value === "object" ? JSON.stringify(value) : String(value || "—")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status update */}
        <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <p className="type-label">Review Action</p>
            <h3 className="text-base font-semibold text-ink">Update Application Status</h3>
            <p className="type-caption mt-0.5 text-ink-secondary">
              Changing the status will notify the applicant.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {["pending", "under_review", "shortlisted", "accepted", "rejected", "waitlisted"].map(
              (status) => (
                <Button
                  key={status}
                  onClick={() => void handleStatusUpdate(status)}
                  disabled={updateLoading || application.application_status === status}
                  className="w-full text-left justify-between"
                  variant={application.application_status === status ? "primary" : "outline"}
                >
                  <span>
                    {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  {application.application_status === status && (
                    <span className="text-[0.75rem]">Current</span>
                  )}
                  {updateLoading && <span className="text-[0.75rem]">Updating…</span>}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>
  );
}
