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

export default function FoundingCohortPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [applications, setApplications] = useState<Array<any>>([]);
  const [participants, setParticipants] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const foundingCohortProgramId =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_PROGRAM_ID_FOUNDING_COHORT ?? "")
      : "";

  const loadApplications = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminApplications(accessToken, {
      page: 1,
      pageSize: 100,
      programId: foundingCohortProgramId || undefined,
      sortBy: "created_at",
      sortDir: "desc",
    });
    if (res.ok) {
      setApplications(res.data.items);
    } else {
      setError(res.error.message);
    }
  }, [accessToken, foundingCohortProgramId]);

  const loadParticipants = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminParticipants(accessToken, {
      page: 1,
      pageSize: 100,
      programId: foundingCohortProgramId || undefined,
    });
    if (res.ok) {
      setParticipants(res.data.items);
    } else {
      setError(res.error.message);
    }
  }, [accessToken, foundingCohortProgramId]);

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
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Founding Cohort Management"
          title="Founding Cohort 2026–27"
          description="Manage applications and members for The First 100 founding cohort."
        />

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <StatCard title="Applications" value={applications.length} />
          <StatCard title="Pending" value={statusCounts["pending"] ?? 0} />
          <StatCard title="Accepted" value={statusCounts["accepted"] ?? 0} />
          <StatCard title="Members" value={participants.length} />
        </div>

        {/* Applications section */}
        <div className="mt-10 rounded-xl border border-line bg-surface overflow-hidden">
          <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
            <div>
              <p className="type-label">Founding Cohort Applications</p>
              <p className="text-[0.8125rem] text-ink-muted">Applications for The First 100</p>
            </div>
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              All applications <span className="size-3">→</span>
            </Link>
          </div>
          <div className="p-6 sm:p-8">
            {error ? (
              <ErrorState message={error} />
            ) : applications.length === 0 ? (
              <EmptyState title="No founding cohort applications" description="No applications have been submitted to the Founding Cohort programme." />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Applicant</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 10).map((app: any) => (
                    <tr
                      key={app.id}
                      className="border-b border-line hover:bg-surface-raised transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-3 text-sm text-ink">
                        {app.applicant_name || "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-ink-muted">
                        {app.email || "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-ink">
                        <AdminStatusBadge status={app.application_status} />
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
                  {applications.length > 10 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-ink-muted">
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
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Members section */}
        <div className="mt-10 rounded-xl border border-line bg-surface overflow-hidden">
          <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
            <div>
              <p className="type-label">Founding Cohort Members</p>
              <p className="text-[0.8125rem] text-ink-muted">Approved participants in the programme</p>
            </div>
            <Link
              href="/admin/participants"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              All participants <span className="size-3">→</span>
            </Link>
          </div>
          <div className="p-6 sm:p-8">
            {participants.length === 0 ? (
              <EmptyState title="No founding cohort members" description="No participants have been added to the Founding Cohort programme yet." />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Name</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                    <th className="px-6 py-3 text-[0.8125rem] font-semibold text-ink-muted">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p: any) => (
                    <tr
                      key={p.id}
                      className="border-b border-line hover:bg-surface-raised transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-ink">
                        {p.profiles?.full_name || "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-ink-muted">
                        {p.profiles?.email || "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-ink">
                        <AdminStatusBadge status={p.participant_status} />
                      </td>
                      <td className="px-6 py-3 text-sm text-ink-muted">
                        {p.joined_at ? new Date(p.joined_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-line bg-surface p-4">
          <p className="type-label mb-2">Programme</p>
          <p className="text-sm text-ink-muted">
            Founding Cohort 2026–27 — The First 100 founding members of the Code Yaar community.
          </p>
        </div>
      </SectionInner>
    </Section>
  );
}
