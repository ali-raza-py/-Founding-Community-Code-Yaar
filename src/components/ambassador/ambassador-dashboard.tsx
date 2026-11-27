"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { buildReferralUrl, getMyReferral } from "@/lib/referral";
import type { TaskRecord, ParticipantRecord, ReferralRecord } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Copy, Clock, ListChecks } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  assigned: "Assigned",
  pending: "Assigned",
  in_progress: "In progress",
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  revision_required: "Revision required",
  completed: "Completed",
  overdue: "Overdue",
};

const STATUS_SEMANTIC: Record<string, "success" | "pending" | "rejected" | "in_progress" | "completed"> = {
  assigned: "pending",
  pending: "pending",
  in_progress: "in_progress",
  submitted: "in_progress",
  under_review: "pending",
  approved: "success",
  revision_required: "pending",
  completed: "success",
  overdue: "rejected",
};

export default function AmbassadorDashboard() {
  const { accessToken, user, isAuthenticated, isAmbassador, isLoading } = useAuth();
  const [referral, setReferral] = useState<ReferralRecord | null>(null);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [participant, setParticipant] = useState<ParticipantRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submissionDrafts, setSubmissionDrafts] = useState<Record<string, { description: string; link: string; file_url: string }>>({});

  const load = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [refResult, taskResult, partResult] = await Promise.all([
        getMyReferral(accessToken),
        communityApi.getMyTasks(accessToken),
        communityApi.getMyParticipant(accessToken),
      ]);
      if (refResult.ok) setReferral(refResult.data ?? null);
      if (taskResult.ok && taskResult.data) setTasks(taskResult.data);
      else if (!taskResult.ok) setError(taskResult.error.message);
      if (partResult.ok) setParticipant(partResult.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isLoading) void load();
  }, [isLoading, load]);

  const handleMarkInProgress = useCallback(async (id: string) => {
    if (!accessToken) return;
    const res = await communityApi.updateMyTaskStatus(accessToken, id, "in_progress");
    if (res.ok) void load();
    else setError(res.error.message);
  }, [accessToken, load]);

  const handleSubmit = useCallback(async (id: string) => {
    if (!accessToken) return;
    const draft = submissionDrafts[id] ?? { description: "", link: "", file_url: "" };
    setSubmittingId(id);
    const res = await communityApi.submitMyTask(accessToken, id, {
      description: draft.description || undefined,
      link: draft.link || undefined,
      file_url: draft.file_url || undefined,
    });
    setSubmittingId(null);
    if (res.ok) {
      setSubmissionDrafts((prev) => ({ ...prev, [id]: { description: "", link: "", file_url: "" } }));
      void load();
    } else {
      setError(res.error.message);
    }
  }, [accessToken, submissionDrafts, load]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="type-body text-ink-secondary">Loading ambassador dashboard…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12 max-w-[42rem] mx-auto text-center">
        <h2 className="mb-6 text-base font-semibold text-ink">Ambassador Dashboard</h2>
        <p className="type-body mb-6">Sign in to access your ambassador dashboard.</p>
        <Link href="/auth/sign-in" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover">
          Sign in
        </Link>
      </div>
    );
  }

  if (!isAmbassador) {
    return (
      <div className="py-12 max-w-[42rem] mx-auto text-center">
        <h2 className="mb-6 text-base font-semibold text-ink">Ambassador Dashboard</h2>
        <p className="type-body mb-6">
          You do not currently have an active ambassador membership. If you have applied, your application status will be shown in your account.
        </p>
        <Link href="/ambassadors/apply" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover">
          Apply as ambassador
        </Link>
      </div>
    );
  }

  const referralUrl = referral ? buildReferralUrl(referral.referral_code) : null;
  const total = referral?.total_registrations ?? 0;
  const verified = referral?.verified_registrations ?? 0;
  const pendingTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "approved").length;
  const completedTasks = tasks.filter((t) => t.status === "completed" || t.status === "approved").length;

  const participantName = participant?.profiles?.full_name ?? user?.email?.split("@")[0] ?? "Ambassador";

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Dashboard"
        description={`Welcome back, ${participantName}. Track your tasks, referrals, and profile.`}
        breadcrumb={[{ label: "Ambassador Dashboard", href: "/ambassador/dashboard" }]}
      />

      {/* Overview */}
      <section id="overview" className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticCard
            title="Status"
            value={participant?.participant_status ?? "Active"}
            subtitle="Programme standing"
            icon={<span className="size-5">🎓</span>}
          />
          <StatisticCard
            title="Assigned tasks"
            value={tasks.length}
            subtitle="Tasks assigned to you"
            icon={<ListChecks className="size-5" />}
          />
          <StatisticCard
            title="Pending tasks"
            value={pendingTasks}
            subtitle="Not yet completed"
            icon={<Clock className="size-5" />}
          />
          <StatisticCard
            title="Completed tasks"
            value={completedTasks}
            subtitle="Finished and approved"
            icon={<span className="size-5">✅</span>}
          />
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-danger-soft bg-danger-soft p-4">
          <p className="text-sm font-semibold text-danger">{error}</p>
        </div>
      )}

      {/* Tasks */}
      <section id="tasks" className="mb-8">
        <DashboardPageHeader
          title="My Tasks"
          description="Tasks assigned to you by the Code Yaar team."
        />
        {loading ? (
          <p className="type-body text-ink-secondary">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks assigned yet"
            description="You have no assigned tasks. Check back soon or contact the Code Yaar team."
          />
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => {
              const draft = submissionDrafts[task.id] ?? { description: "", link: "", file_url: "" };
              const statusLabel = STATUS_LABELS[task.status] ?? task.status;
              const canSubmit =
                task.status === "assigned" ||
                task.status === "pending" ||
                task.status === "in_progress" ||
                task.status === "revision_required";
              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-line bg-surface p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-ink">{task.title}</h4>
                      <p className="mt-1 text-sm text-ink-secondary">
                        {task.description}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="grid gap-2 text-sm text-ink-secondary sm:grid-cols-2">
                    {task.priority && (
                      <p>
                        <span className="font-semibold text-ink">Priority:</span>{" "}
                        {task.priority}
                      </p>
                    )}
                    {task.due_date && (
                      <p>
                        <span className="font-semibold text-ink">Due:</span>{" "}
                        {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {task.instructions && (
                    <div className="mt-3">
                      <p className="type-label mb-1">Instructions</p>
                      <p className="text-sm text-ink-secondary">{task.instructions}</p>
                    </div>
                  )}
                  {task.submission_requirements && (
                    <div className="mt-3">
                      <p className="type-label mb-1">Submission requirements</p>
                      <p className="text-sm text-ink-secondary">
                        {task.submission_requirements}
                      </p>
                    </div>
                  )}
                  {task.feedback && (
                    <div className="mt-3 rounded-md border border-line bg-surface-raised p-3">
                      <p className="type-label mb-1">Administrator feedback</p>
                      <p className="text-sm text-ink-secondary">{task.feedback}</p>
                    </div>
                  )}
                  {task.submission_description && (
                    <div className="mt-3">
                      <p className="type-label mb-1">Your last submission</p>
                      <p className="text-sm text-ink-secondary">
                        {task.submission_description}
                      </p>
                      {task.submission_link && (
                        <a
                          href={task.submission_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-emerald underline"
                        >
                          {task.submission_link}
                        </a>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {task.status !== "in_progress" &&
                    task.status !== "submitted" &&
                    task.status !== "under_review" &&
                    task.status !== "approved" &&
                    task.status !== "completed" && (
                      <Button size="sm" onClick={() => void handleMarkInProgress(task.id)}>
                        Mark in progress
                      </Button>
                    )}
                  </div>

                  {canSubmit && (
                    <div className="mt-4 space-y-3 border-t border-line pt-4">
                      <Field label="Submission description">
                        <Textarea
                          value={draft.description}
                          onChange={(e) =>
                            setSubmissionDrafts((prev) => ({
                              ...prev,
                              [task.id]: { ...draft, description: e.currentTarget.value },
                            }))
                          }
                          rows={3}
                        />
                      </Field>
                      <Field label="Submission link">
                        <Input
                          value={draft.link}
                          onChange={(e) =>
                            setSubmissionDrafts((prev) => ({
                              ...prev,
                              [task.id]: { ...draft, link: e.currentTarget.value },
                            }))
                          }
                          placeholder="https://..."
                        />
                      </Field>
                      <Field label="File URL">
                        <Input
                          value={draft.file_url}
                          onChange={(e) =>
                            setSubmissionDrafts((prev) => ({
                              ...prev,
                              [task.id]: { ...draft, file_url: e.currentTarget.value },
                            }))
                          }
                          placeholder="https://..."
                        />
                      </Field>
                      <Button
                        size="sm"
                        onClick={() => void handleSubmit(task.id)}
                        disabled={submittingId === task.id}
                      >
                        {submittingId === task.id
                          ? "Submitting…"
                          : task.status === "revision_required"
                            ? "Resubmit"
                            : "Submit work"}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Referral */}
      <section id="referrals" className="mb-8">
        <DashboardPageHeader title="My Referrals" description="Share your referral link and track sign-ups attributed to you." />
        {loading ? (
          <p className="type-body text-ink-secondary">Loading referrals…</p>
        ) : !referral ? (
          <EmptyState
            title="No referral code assigned yet"
            description="Shortlisted ambassadors receive a personal referral code from the Code Yaar team."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
              <p className="type-label">Referral code</p>
              <p className="mt-1 font-mono font-semibold text-ink">
                {referral.referral_code}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
              <p className="type-label">Total referred registrations</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{total}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
              <p className="type-label">Qualified (verified) referrals</p>
              <p className="mt-1 text-2xl font-semibold text-emerald">{verified}</p>
            </div>
            {referralUrl && (
              <div className="sm:col-span-3 rounded-xl border border-line bg-surface p-5 sm:p-6">
                <p className="type-label mb-2">Referral link</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={referralUrl}
                    className="flex-1 rounded-md border border-line px-4 py-2.5 text-sm font-mono text-ink bg-white"
                  />
                  <Button
                    onClick={() => {
                      void navigator.clipboard.writeText(referralUrl);
                    }}
                  >
                    Copy <Copy className="ml-1 size-4" />
                  </Button>
                </div>
                <p className="mt-3 type-caption text-ink-secondary">
                  Share this link — applications submitted with your code are
                  attributed to you.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Profile */}
      <section id="profile">
        <DashboardPageHeader title="My Profile" description="Your ambassador account details." />
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <p className="text-sm text-ink">
            <span className="font-semibold">Name:</span>{" "}
            {participant?.profiles?.full_name ?? user?.email?.split("@")[0] ?? "—"}
          </p>
          <p className="text-sm text-ink">
            <span className="font-semibold">Email:</span>{" "}
            {user?.email ?? "—"}
          </p>
          <p className="text-sm text-ink">
            <span className="font-semibold">Programme:</span> Ambassador
          </p>
          <p className="text-sm text-ink">
            <span className="font-semibold">Status:</span>{" "}
            {participant?.participant_status ?? "active"}
          </p>
          {participant?.programs && (
            <p className="text-sm text-ink">
              <span className="font-semibold">Program:</span>{" "}
              {participant.programs.name}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
