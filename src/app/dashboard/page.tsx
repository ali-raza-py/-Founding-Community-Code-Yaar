"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

type StatusVariant = "pending" | "accepted" | "rejected" | "under_review" | "shortlisted" | "waitlisted";

function statusBadge(status: string | null | undefined) {
  const s = (status ?? "pending").toLowerCase() as StatusVariant;
  const variants: Record<StatusVariant, "emerald" | "default" | "outline"> = {
    pending: "default",
    under_review: "default",
    shortlisted: "default",
    accepted: "emerald",
    rejected: "default",
    waitlisted: "default",
  };
  return <Badge variant={variants[s] ?? "default"}>
    {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
  </Badge>;
}

export default function DashboardPage() {
  const { user, accessToken, isAuthenticated, isLoading, isAdmin, isSuperAdmin, signOut } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<Array<any>>([]);
  const [participant, setParticipant] = useState<any>(null);
  const [referrals, setReferrals] = useState<any>(null);
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [announcements, setAnnouncements] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [appRes, participantRes, referralRes, taskRes, announcementRes] =
        await Promise.all([
          communityApi.getMyApplications(accessToken),
          communityApi.getMyParticipant(accessToken),
          communityApi.getMyReferrals(accessToken),
          communityApi.getMyTasks(accessToken),
          communityApi.getAnnouncements(accessToken),
        ]);

      if (appRes.ok) setApplications(appRes.data ?? []);
      if (participantRes.ok) setParticipant(participantRes.data ?? null);
      if (referralRes.ok) setReferrals(referralRes.data ?? null);
      if (taskRes.ok) setTasks(taskRes.data ?? []);
      if (announcementRes.ok) setAnnouncements(announcementRes.data ?? []);
    } catch {
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Redirect unauthenticated users to sign-in.
  if (isLoading) {
    return (
      <Section padded>
        <SectionInner className="text-center py-24">
          <p className="type-body text-ink-muted">Loading your dashboard…</p>
        </SectionInner>
      </Section>
    );
  }

  if (!isAuthenticated) {
    router.push(`/auth/sign-in?redirectTo=${encodeURIComponent("/dashboard")}`);
    return null;
  }

  // Role-based redirect: admins go to admin dashboard.
  if (isAdmin || isSuperAdmin) {
    router.push("/admin");
    return null;
  }

  return (
    <>
      <Section padded>
        <SectionInner>
          <SectionHeading
            eyebrow="Participant Dashboard"
            title={`Welcome back, ${user?.email?.split("@")[0] || "Member"}`}
            description="Your applications, referrals, tasks, and announcements."
          />

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-between items-end">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Apply to The First 100
            </Link>
            <Button onClick={signOut} variant="outline">
              Sign out
            </Button>
          </div>
        </SectionInner>
      </Section>

      {/* Participant Profile */}
      {participant && (
        <Section padded className="bg-surface-raised">
          <SectionInner>
            <SectionHeading
              eyebrow="Your Participation"
              title="Participant Status"
              description="Your current standing in the Code Yaar community."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-line bg-surface p-6">
                <p className="type-label mb-1">Program</p>
                <p className="text-sm font-semibold text-ink">
                  {participant.programs?.name || "—"}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-6">
                <p className="type-label mb-1">Status</p>
                <p className="text-sm font-semibold text-ink">
                  {participant.participant_status?.replace(/_/g, " ") || "—"}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-6">
                <p className="type-label mb-1">Joined</p>
                <p className="text-sm font-semibold text-ink">
                  {participant.joined_at ? new Date(participant.joined_at).toLocaleDateString() : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-6">
                <p className="type-label mb-1">Application</p>
                <p className="text-sm font-semibold text-ink">
                  {participant.application_id ? "Linked" : "Not linked"}
                </p>
              </div>
            </div>
          </SectionInner>
        </Section>
      )}

      {/* Applications */}
      <Section padded className="bg-surface-raised">
        <SectionInner>
          <SectionHeading
            eyebrow="Your Applications"
            title="Application History"
            description="View the status of your applications to Code Yaar programmes."
          />
          <div className="mt-8">
            {loading ? (
              <p className="type-body text-ink-muted">Loading applications…</p>
            ) : error ? (
              <p className="type-body text-danger">{error}</p>
            ) : applications.length === 0 ? (
              <div className="rounded-lg border border-line bg-surface p-12 text-center">
                <p className="type-body text-ink-muted">No applications found.</p>
                <p className="type-caption mt-2 text-ink-subtle">
                  Submit an application to The First 100 founding cohort or the
                  Global Ambassador Programme.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-line bg-surface overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line bg-surface-raised">
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Program</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Submitted</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b border-line hover:bg-surface-raised transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-ink">
                          {app.programs?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {statusBadge(app.application_status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-muted">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-muted">
                          {app.city || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </SectionInner>
      </Section>

      {/* Referrals */}
      {referrals && (
        <Section padded className="bg-surface-raised">
          <SectionInner>
            <SectionHeading
              eyebrow="Referrals"
              title="Your Referral Code"
              description="Share your referral link to help others apply to The First 100."
            />
            <div className="mt-8 rounded-lg border border-line bg-surface p-6 sm:p-8">
              {referrals.referral_code ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="type-label mb-1">Referral code</p>
                      <p className="text-sm font-mono text-emerald">
                        {referrals.referral_code}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="flex-1 truncate font-mono text-sm text-ink-muted bg-surface-raised rounded-md px-3 py-2 border border-line"
                      >
                        {typeof window !== "undefined"
                          ? `${window.location.origin}/cohort/apply?ref=${referrals.referral_code}`
                          : ""}
                      </span>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            typeof window !== "undefined"
                              ? `${window.location.origin}/cohort/apply?ref=${referrals.referral_code}`
                              : "",
                          );
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Copy link
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-line bg-surface p-6">
                      <p className="type-label mb-1">Total registrations</p>
                      <p className="text-2xl font-semibold text-ink">
                        {referrals.total_registrations ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-surface p-6">
                      <p className="type-label mb-1">Verified</p>
                      <p className="text-2xl font-semibold text-emerald">
                        {referrals.verified_registrations ?? 0}
                      </p>
                    </div>
                  </div>
                  {referrals.registrations && referrals.registrations.length > 0 && (
                    <div className="mt-8">
                      <p className="type-label mb-3">Registrations</p>
                      <div className="space-y-3">
                        {referrals.registrations.map((reg: any) => (
                          <div
                            key={reg.id}
                            className="flex justify-between items-center px-4 py-3 rounded-lg border border-line bg-surface-raised"
                          >
                            <div>
                              <p className="text-sm font-medium text-ink">
                                {reg.registered_email}
                              </p>
                              <p className="text-[0.75rem] text-ink-muted">
                                {reg.created_at
                                  ? new Date(reg.created_at).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                            <Badge variant={reg.verification_status === "verified" ? "emerald" : "default"}>
                              {reg.verification_status?.replace(/_/g, " ") || "—"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-line bg-surface p-12 text-center">
                  <p className="type-body text-ink-muted">
                    No referral code assigned yet.
                  </p>
                  <p className="type-caption mt-2 text-ink-subtle">
                    Shortlisted ambassadors receive a personal referral code
                    from the Code Yaar team.
                  </p>
                </div>
              )}
            </div>
          </SectionInner>
        </Section>
      )}

      {/* Tasks */}
      {tasks.length > 0 && (
        <Section padded className="bg-surface-raised">
          <SectionInner>
            <SectionHeading
              eyebrow="Your Tasks"
              title="Assigned Tasks"
              description="Tasks assigned to you by the Code Yaar team."
            />
            <div className="mt-8 space-y-4">
              {tasks.map((task: any) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-line bg-surface p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-semibold text-ink">{task.title}</h4>
                    <p className="mt-1 text-sm text-ink-muted">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="default">
                      {task.status?.replace(/_/g, " ") || "—"}
                    </Badge>
                    {task.due_date && (
                      <span className="text-[0.8125rem] text-ink-muted">
                        Due {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionInner>
        </Section>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <Section padded className="bg-surface-raised">
          <SectionInner>
            <SectionHeading
              eyebrow="Announcements"
              title="Community Announcements"
              description="Latest updates from the Code Yaar team."
            />
            <div className="mt-8 space-y-4">
              {announcements.map((announcement: any) => (
                <article
                  key={announcement.id}
                  className="rounded-lg border border-line bg-surface-raised p-4 sm:p-6"
                >
                  <h4 className="text-sm font-semibold text-ink">
                    {announcement.title}
                  </h4>
                  <p className="mt-1 text-sm text-ink-muted">
                    {announcement.content}
                  </p>
                  <p className="mt-2 text-[0.75rem] text-ink-subtle">
                    {announcement.created_at
                      ? new Date(announcement.created_at).toLocaleDateString()
                      : "—"}
                  </p>
                </article>
              ))}
            </div>
          </SectionInner>
        </Section>
      )}
    </>
  );
}
