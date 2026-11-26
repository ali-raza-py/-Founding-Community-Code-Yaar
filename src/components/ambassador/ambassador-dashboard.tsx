"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { getMyReferral, buildReferralUrl, REQUIRED_REFERRALS } from "@/lib/referral";
import type { TaskRecord, ParticipantRecord, ReferralRecord } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";

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
      <Section padded>
        <SectionInner className="text-center py-24">
          <p className="type-body text-ink-muted">Loading ambassador dashboard…</p>
        </SectionInner>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section padded>
        <SectionInner className="max-w-[42rem] text-center">
          <h2 className="mb-6">Ambassador Dashboard</h2>
          <p className="type-body mb-6">Sign in to access your ambassador dashboard.</p>
          <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover">
            Sign in
          </Link>
        </SectionInner>
      </Section>
    );
  }

  if (!isAmbassador) {
    return (
      <Section padded>
        <SectionInner className="max-w-[42rem] text-center">
          <h2 className="mb-6">Ambassador Dashboard</h2>
          <p className="type-body mb-6">
            You do not currently have an active ambassador membership. If you have applied, your application status will be shown in your account.
          </p>
          <Link href="/ambassadors/apply" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover">
            Apply as ambassador
          </Link>
        </SectionInner>
      </Section>
    );
  }

  const referralUrl = referral ? buildReferralUrl(referral.referral_code) : null;
  const total = referral?.total_registrations ?? 0;
  const verified = referral?.verified_registrations ?? 0;
  const pendingTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "approved").length;
  const completedTasks = tasks.filter((t) => t.status === "completed" || t.status === "approved").length;

  return (
    <Section padded>
      <SectionInner className="max-w-6xl">
        <div className="mb-8">
          <h2 className="mb-2">Ambassador Dashboard</h2>
          <p className="type-body-muted">
            Welcome{user?.email ? `, ${user.email}` : ""}. Track your tasks, referrals and profile.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-danger-soft bg-danger-soft p-4">
            <p className="text-sm font-semibold text-danger">{error}</p>
          </div>
        )}

        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="type-caption text-ink-muted">Status</p>
            <p className="mt-1 text-lg font-semibold text-ink">{participant?.participant_status ?? "Active"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="type-caption text-ink-muted">Assigned tasks</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{tasks.length}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="type-caption text-ink-muted">Pending tasks</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{pendingTasks}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="type-caption text-ink-muted">Completed tasks</p>
            <p className="mt-1 text-2xl font-semibold text-emerald">{completedTasks}</p>
          </div>
        </div>

        {/* Tasks */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-ink mb-4">My Tasks</h3>
          {loading ? (
            <p className="type-body text-ink-muted">Loading tasks…</p>
          ) : tasks.length === 0 ? (
            <div className="rounded-lg border border-line bg-surface p-8 text-center">
              <p className="type-body text-ink-muted">No tasks assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const draft = submissionDrafts[task.id] ?? { description: "", link: "", file_url: "" };
                const statusLabel = STATUS_LABELS[task.status] ?? task.status;
                const canSubmit = task.status === "assigned" || task.status === "pending" || task.status === "in_progress" || task.status === "revision_required";
                return (
                  <div key={task.id} className="rounded-lg border border-line bg-surface p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-ink">{task.title}</h4>
                        <p className="mt-1 text-sm text-ink-muted">{task.description}</p>
                      </div>
                      <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-surface-raised text-ink">
                        {statusLabel}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
                      {task.priority && <p>Priority: {task.priority}</p>}
                      {task.due_date && <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>}
                    </div>
                    {task.instructions && (
                      <div className="mt-3">
                        <p className="type-label">Instructions</p>
                        <p className="text-sm text-ink-muted">{task.instructions}</p>
                      </div>
                    )}
                    {task.submission_requirements && (
                      <div className="mt-2">
                        <p className="type-label">Submission requirements</p>
                        <p className="text-sm text-ink-muted">{task.submission_requirements}</p>
                      </div>
                    )}
                    {task.feedback && (
                      <div className="mt-3 rounded-md border border-line bg-surface-raised p-3">
                        <p className="type-label">Administrator feedback</p>
                        <p className="text-sm text-ink-muted">{task.feedback}</p>
                      </div>
                    )}
                    {task.submission_description && (
                      <div className="mt-3">
                        <p className="type-label">Your last submission</p>
                        <p className="text-sm text-ink-muted">{task.submission_description}</p>
                        {task.submission_link && (
                          <a href={task.submission_link} target="_blank" rel="noreferrer" className="text-sm text-emerald underline">
                            {task.submission_link}
                          </a>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {task.status !== "in_progress" && task.status !== "submitted" && task.status !== "under_review" && task.status !== "approved" && task.status !== "completed" && (
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
                            onChange={(e) => setSubmissionDrafts((prev) => ({ ...prev, [task.id]: { ...draft, description: e.currentTarget.value } }))}
                            rows={3}
                          />
                        </Field>
                        <Field label="Submission link">
                          <Input
                            value={draft.link}
                            onChange={(e) => setSubmissionDrafts((prev) => ({ ...prev, [task.id]: { ...draft, link: e.currentTarget.value } }))}
                            placeholder="https://..."
                          />
                        </Field>
                        <Field label="File URL">
                          <Input
                            value={draft.file_url}
                            onChange={(e) => setSubmissionDrafts((prev) => ({ ...prev, [task.id]: { ...draft, file_url: e.currentTarget.value } }))}
                            placeholder="https://..."
                          />
                        </Field>
                        <Button
                          size="sm"
                          onClick={() => void handleSubmit(task.id)}
                          disabled={submittingId === task.id}
                        >
                          {submittingId === task.id ? "Submitting…" : task.status === "revision_required" ? "Resubmit" : "Submit work"}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Referral */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-ink mb-4">Referral Overview</h3>
          {loading ? (
            <p className="type-body text-ink-muted">Loading referrals…</p>
          ) : !referral ? (
            <div className="rounded-lg border border-line bg-surface p-8 text-center">
              <p className="type-body text-ink-muted">No referral code assigned yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Referral code</p>
                <p className="mt-1 font-mono font-semibold text-ink">{referral.referral_code}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Total referred registrations</p>
                <p className="mt-1 text-2xl font-semibold text-ink">{total}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Qualified (verified) referrals</p>
                <p className="mt-1 text-2xl font-semibold text-emerald">{verified}</p>
              </div>
              {referralUrl && (
                <div className="sm:col-span-3 rounded-lg border border-line bg-surface p-5">
                  <p className="type-label mb-2">Referral link</p>
                  <div className="flex gap-2">
                    <input readOnly value={referralUrl} className="flex-1 rounded-md border border-line px-4 py-2.5 text-sm font-mono text-ink bg-white" />
                    <Button onClick={() => { void navigator.clipboard.writeText(referralUrl); }}>Copy</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div>
          <h3 className="text-base font-semibold text-ink mb-4">Profile</h3>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-sm text-ink"><span className="font-semibold">Name:</span> {user?.email ?? "—"}</p>
            <p className="text-sm text-ink"><span className="font-semibold">Email:</span> {user?.email ?? "—"}</p>
            <p className="text-sm text-ink"><span className="font-semibold">Programme:</span> Ambassador</p>
            <p className="text-sm text-ink"><span className="font-semibold">Status:</span> {participant?.participant_status ?? "active"}</p>
          </div>
        </div>
      </SectionInner>
    </Section>
  );
}
