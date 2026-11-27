"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ListChecks, FileText, User, ArrowRight, ShieldAlert } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { buildReferralUrl } from "@/lib/referral";
import { normalizeParticipant, participantValue } from "@/lib/participant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/shared";
import { cn } from "@/lib/utils";

interface MembershipCard {
  program: string | null;
  slug: string | null;
  status: string | null;
  joinedAt: string | null;
}

export default function AdminParticipantDetailPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const participantId = searchParams.get("id") ?? "";

  const [participant, setParticipant] = useState<any>(null);
  const [profiles, setProfiles] = useState<Array<{ full_name: string | null; email: string | null; role: string | null }>>([]);
  const [memberships, setMemberships] = useState<MembershipCard[]>([]);
  const [referral, setReferral] = useState<any>(null);
  const [referralRegistrations, setReferralRegistrations] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadParticipant = useCallback(async () => {
    if (!accessToken || !participantId) return;
    setLoading(true);
    setError(null);
    try {
      const [partRes, profilesRes, allPartsRes, refsRes, tasksRes] =
        await Promise.all([
          communityApi.getAdminParticipant(accessToken, participantId),
          communityApi.getAdminProfiles(accessToken),
          communityApi.getAdminParticipants(accessToken, { page: 1, pageSize: 100 }),
          communityApi.getAdminReferrals(accessToken, { page: 1, pageSize: 100 }),
          communityApi.getAdminTasks(accessToken, { page: 1, pageSize: 50, assignedTo: participantId }),
        ]);

      if (partRes.ok) {
        setParticipant(partRes.data);
        if (partRes.data.application_id) {
          const appRes = await communityApi.getAdminApplication(accessToken, partRes.data.application_id);
          if (appRes.ok) setApplication(appRes.data);
        }
      } else {
        setError(partRes.error.message);
      }

      if (profilesRes.ok && profilesRes.data) {
        setProfiles(
          (profilesRes.data as Array<{ full_name: string | null; email: string | null; role: string | null }>).map(
            (p) => ({
              full_name: p.full_name ?? null,
              email: p.email ?? null,
              role: p.role ?? null,
            }),
          ),
        );
      }

      if (allPartsRes.ok && allPartsRes.data) {
        const userId = partRes.ok ? partRes.data.user_id : "";
        const all = allPartsRes.data.items as any[];
        const memberships: MembershipCard[] = all
          .filter((p) => p.user_id === userId)
          .map((p) => ({
            program: p.programs?.name ?? null,
            slug: p.programs?.slug ?? null,
            status: p.participant_status ?? null,
            joinedAt: p.joined_at ?? null,
          }));
        setMemberships(memberships);
      }

      if (refsRes.ok && refsRes.data) {
        const userId = partRes.ok ? partRes.data.user_id : "";
        const refs = refsRes.data.items as any[];
        const ref = refs.find(
          (r) => r.participant_id === participantId || r.participants?.user_id === userId,
        );
        setReferral(ref ?? null);
        if (ref?.registrations) {
          setReferralRegistrations(ref.registrations);
        }
      }

      if (tasksRes.ok && tasksRes.data) {
        setTasks(tasksRes.data.items);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load participant profile.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, participantId]);

  useEffect(() => {
    loadParticipant();
  }, [loadParticipant]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (!participantId) {
    return <ErrorState message="No participant ID provided." />;
  }

  if (error || !participant) {
    return <ErrorState message={error || "Participant not found."} />;
  }

  const profilesByUserId = useMemo(() => {
    const map = new Map<string, { full_name: string | null; email: string | null; role: string | null }>();
    for (const p of profiles) {
      if (p.email) map.set(p.email, p);
    }
    return map;
  }, [profiles]);

  const np = normalizeParticipant(
    {
      ...participant,
      full_name: participant.full_name ?? undefined,
      email: participant.email ?? undefined,
      profiles: participant.profiles ?? undefined,
      programs: participant.programs
        ? { name: participant.programs.name ?? null, slug: participant.programs.slug ?? null }
        : null,
    },
    profilesByUserId,
  );

  const primaryMembership = memberships.find((m) => m.program === np.programme);
  const otherMemberships = memberships.filter((m) => m.program !== np.programme);

  const referralCode = referral?.referral_code ?? null;
  const referralUrl = referralCode ? buildReferralUrl(referralCode) : null;
  const totalRegistrations = referral?.total_registrations ?? 0;
  const verifiedRegistrations = referral?.verified_registrations ?? 0;
  const pendingRegistrations = Math.max(0, totalRegistrations - verifiedRegistrations);

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Participant profile"
        description={np.email}
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Participants", href: "/admin/participants" },
          { label: np.displayName || np.email, href: `/admin/participants/detail?id=${participantId}` },
        ]}
        actions={
          <Link href="/admin/participants" className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">
            <ArrowRight className="size-3.5" /> Back to directory
          </Link>
        }
      />

      {/* Personal information */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="mb-6">
          <p className="type-label">Personal information</p>
          <h1 className="text-2xl font-semibold text-ink leading-none">{np.displayName}</h1>
          {np.email && np.email !== "Not provided" && (
            <p className="type-caption mt-1 text-ink-secondary">{np.email}</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="type-label mb-1">Email</p>
            <p className="text-sm text-ink break-all">{participantValue(np.email)}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="type-label mb-1">Account role</p>
            <p className="text-sm text-ink">{participantValue(np.role)}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="type-label mb-1">Membership status</p>
            <StatusBadge status={np.status ?? "—"} />
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="type-label mb-1">Joined</p>
            <p className="text-sm text-ink">
              {np.joinedAt ? new Date(np.joinedAt).toLocaleDateString() : "—"}
            </p>
          </div>
          {application && (
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Application</p>
              <p className="text-sm text-ink">
                {application.application_status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Programme memberships */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="mb-6">
          <p className="type-label">Programme memberships</p>
          <h2 className="text-base font-semibold text-ink">Programme memberships</h2>
          <p className="type-caption mt-1 text-ink-secondary">
            Approved memberships only. Pending applications are not memberships.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memberships.length > 0 ? (
            memberships.map((m) => (
              <div key={m.program ?? "unknown"} className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="type-label mb-1">{m.program || "Programme"}</p>
                    <p className="text-sm font-semibold text-ink">
                      {m.status?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "—"}
                    </p>
                  </div>
                  <StatusBadge status={m.status ?? "pending"} />
                </div>
                <div className="space-y-2 text-sm text-ink-secondary">
                  <p>
                    <span className="font-semibold">Status: </span>
                    {m.status?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Joined: </span>
                    {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No programme memberships"
              description="This participant has no approved programme memberships."
            />
          )}
        </div>
      </section>

      {/* Referral information */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="mb-6">
          <p className="type-label">Referral information</p>
          <h2 className="text-base font-semibold text-ink">Referral information</h2>
          <p className="type-caption mt-1 text-ink-secondary">
            Every count is calculated from real referral records.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="type-label mb-1">Referral code</p>
            <p className="text-sm font-mono text-emerald font-semibold break-all">
              {referralCode || "Not assigned"}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="type-label mb-1">Referral URL</p>
            <div className="flex gap-2">
              <span className="flex-1 truncate text-sm text-ink-muted font-mono bg-surface-raised rounded-md px-3 py-2 border border-line">
                {referralUrl || "—"}
              </span>
              {referralUrl && (
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(referralUrl);
                  }}
                >
                  Copy
                </Button>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="type-label mb-1">Total registrations</p>
            <p className="text-2xl font-semibold text-ink">{totalRegistrations}</p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="type-label mb-1">Verified</p>
            <p className="text-2xl font-semibold text-ink">{verifiedRegistrations}</p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="type-label mb-1">Pending verification</p>
            <p className="text-2xl font-semibold text-ink">{pendingRegistrations}</p>
          </div>
        </div>
        {referralRegistrations.length > 0 && (
          <div className="mt-6 rounded-xl border border-line bg-surface overflow-hidden">
            <div className="border-b border-line bg-surface-raised px-6 py-4">
              <h3 className="text-sm font-semibold text-ink">People who joined using this code</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line bg-surface-raised text-xs font-semibold text-ink-secondary uppercase tracking-tight">
                    <th className="p-4">Email</th>
                    <th className="p-4">Verification status</th>
                    <th className="p-4 text-right">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {referralRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-line">
                      <td className="p-4 text-sm text-ink">{reg.registered_email}</td>
                      <td className="p-4 text-sm">
                        <Badge
                          variant={reg.verification_status === "verified" ? "emerald" : "default"}
                        >
                          {reg.verification_status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm font-mono text-ink-muted text-right">
                        {reg.created_at ? new Date(reg.created_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!referralCode && (
          <div className="mt-6 rounded-lg border border-line bg-surface-raised p-4">
            <p className="text-sm text-ink-secondary">
              No referral code is assigned to this participant. Referral codes are
              generated server-side for ambassadors and referral-eligible members.
            </p>
          </div>
        )}
      </section>

      {/* Task information */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="mb-6">
          <p className="type-label">Task information</p>
          <h2 className="text-base font-semibold text-ink">Assigned tasks</h2>
        </div>
        {tasks.length === 0 ? (
          <EmptyState title="No tasks assigned" description="This participant has no assigned tasks." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised text-xs font-semibold text-ink-secondary uppercase tracking-tight">
                  <th className="p-4">Task</th>
                  <th className="p-4">Programme</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-b border-line hover:bg-surface-raised/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-ink">{t.title}</td>
                    <td className="p-4 text-sm text-ink-secondary">{t.program_name || "—"}</td>
                    <td className="p-4 text-sm text-ink-secondary">
                      {t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 text-sm">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="p-4 text-right">
                      {t.feedback ? (
                        <span className="text-xs text-emerald font-medium">Reviewed</span>
                      ) : (
                        <span className="text-xs text-ink-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Linked application */}
      {application && (
        <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="mb-6">
            <p className="type-label">Linked application</p>
            <h2 className="text-base font-semibold text-ink">Application</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Programme</p>
              <p className="text-sm text-ink">{application.programs?.name || "—"}</p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Status</p>
              <StatusBadge status={application.application_status} />
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Submitted</p>
              <p className="text-sm text-ink-muted">
                {application.created_at ? new Date(application.created_at).toLocaleDateString() : "—"}
              </p>
            </div>
            <div className="col-span-4 sm:col-span-2 lg:col-span-4">
              <Link
                href={`/admin/applications/detail?id=${application.id}`}
                className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                Review application <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
