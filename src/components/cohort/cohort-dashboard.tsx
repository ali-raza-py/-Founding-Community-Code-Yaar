"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import type { TaskRecord, ParticipantRecord, Announcement } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Link as LinkIcon, Clock, Megaphone, ListChecks } from "lucide-react";

const FOUNDING_COHORT_LABEL = "The First 100 · Global Founding Cohort 2026–27";

export default function CohortDashboard() {
  const { accessToken, user, isAuthenticated, isLoading } = useAuth();
  const [participant, setParticipant] = useState<ParticipantRecord | null>(null);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFoundingCohortMember = useCallback(() => {
    if (!participant) return false;
    const programId =
      typeof window !== "undefined"
        ? (process.env.NEXT_PUBLIC_PROGRAM_ID_FOUNDING_COHORT ?? "")
        : "";
    return (
      participant.program_id === programId ||
      participant.programs?.slug === "founding-cohort"
    );
  }, [participant]);

  const load = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [partResult, taskResult, announcementResult] =
        await Promise.all([
          communityApi.getMyParticipant(accessToken),
          communityApi.getMyTasks(accessToken),
          communityApi.getAnnouncements(accessToken),
        ]);
      if (partResult.ok) setParticipant(partResult.data ?? null);
      if (taskResult.ok && taskResult.data) setTasks(taskResult.data);
      if (announcementResult.ok)
        setAnnouncements((announcementResult.data ?? []).filter(
          (a) => a.published || a.target_program_id === null,
        ));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isLoading) void load();
  }, [isLoading, load]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="type-body text-ink-secondary">Loading your founding cohort dashboard…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12 max-w-[42rem] mx-auto text-center">
        <h2 className="mb-6 text-base font-semibold text-ink">Founding Cohort Dashboard</h2>
        <p className="type-body mb-6">Sign in to access your founding cohort dashboard.</p>
        <Link href="/auth/sign-in" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover">
          Sign in
        </Link>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="py-12 max-w-[42rem] mx-auto text-center">
        <h2 className="mb-6 text-base font-semibold text-ink">Founding Cohort Dashboard</h2>
        <p className="type-body mb-6">
          No participant record is linked to your account yet. Complete an
          application to The First 100 to become a founding member.
        </p>
        <Link href="/apply" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover">
          Apply now
        </Link>
      </div>
    );
  }

  if (!isFoundingCohortMember()) {
    const programName = participant.programs?.name || "another programme";
    return (
      <div className="py-12 max-w-[42rem] mx-auto text-center">
        <h2 className="mb-6 text-base font-semibold text-ink">Founding Cohort Dashboard</h2>
        <p className="type-body mb-6">
          Your participant membership is linked to <strong>{programName}</strong>, not
          to the Founding Cohort programme, so this dashboard is not available to you.
        </p>
        <Link href="/cohort" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover">
          Learn about The First 100
        </Link>
      </div>
    );
  }

  const submittedTasks = tasks.filter(
    (t) => t.submission_description || t.submission_link,
  );
  const pendingTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "approved",
  ).length;
  const completedTasks = tasks.filter(
    (t) => t.status === "completed" || t.status === "approved",
  ).length;

  const participantName =
    participant?.profiles?.full_name ?? user?.email?.split("@")[0] ?? "Member";

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Dashboard"
        description={`Welcome back, ${participantName}. Your founding cohort workspace for ${FOUNDING_COHORT_LABEL}.`}
        breadcrumb={[{ label: "Founding Cohort Dashboard", href: "/cohort/dashboard" }]}
      />

      {/* Welcome / membership */}
      <section id="overview" className="mb-8">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="type-label mb-1">Your membership</p>
              <h3 className="text-base font-semibold text-ink">
                Founding Cohort Member
              </h3>
              <p className="type-caption mt-1 text-ink-secondary">
                {FOUNDING_COHORT_LABEL}
              </p>
            </div>
            <div className="flex items-end gap-2">
              <StatusBadge status="success" />
              <span className="text-sm font-medium text-ink">Active</span>
            </div>
          </div>
          {participant.joined_at && (
            <p className="mt-4 type-caption text-ink-secondary">
              Joined {new Date(participant.joined_at).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            icon={<span className="size-5">✅</span>} />
          <StatisticCard
            title="Submissions"
            value={submittedTasks.length}
            subtitle="Tasks with submitted work"
            icon={<LinkIcon className="size-5" />} />
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-danger-soft bg-danger-soft p-4">
          <p className="text-sm font-semibold text-danger">{error}</p>
        </div>
      )}

      {/* Announcements */}
      <section id="announcements" className="mb-8">
        <DashboardPageHeader
          title="Community Announcements"
          description="Latest updates from the Code Yaar team."
          actions={
            announcements.length === 0 ? null : (
              <Link
                href="/cohort"
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                Community page <Megaphone className="ml-1 size-3.5" />
              </Link>
            )
          }
        />
        {announcements.length === 0 ? (
          <EmptyState
            title="No announcements yet"
            description="There are no community announcements at the moment."
          />
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-xl border border-line bg-surface-raised p-4 sm:p-6"
              >
                <h4 className="text-sm font-semibold text-ink">
                  {announcement.title}
                </h4>
                <p className="mt-1 text-sm text-ink-secondary">
                  {announcement.content}
                </p>
                <p className="mt-2 text-[0.75rem] text-ink-secondary">
                  {announcement.created_at
                    ? new Date(announcement.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Tasks */}
      <section id="tasks" className="mb-8">
        <DashboardPageHeader title="My Tasks" description="Tasks assigned to you as a founding member." />
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks assigned yet"
            description="You have no assigned tasks in the Founding Cohort programme."
          />
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-line bg-surface p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-semibold text-ink">{task.title}</h4>
                  <p className="mt-1 text-sm text-ink-secondary">
                    {task.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={task.status} />
                  {task.due_date && (
                    <span className="text-sm text-ink-secondary">
                      Due {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submissions */}
      <section id="submissions">
        <DashboardPageHeader
          title="My Submissions"
          description="Work you have submitted for review."
        />
        {submittedTasks.length === 0 ? (
          <EmptyState
            title="No submissions yet"
            description="Submit work for an assigned task to see it here."
          />
        ) : (
          <div className="space-y-4">
            {submittedTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-line bg-surface p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-semibold text-ink">{task.title}</h4>
                  <p className="mt-1 text-sm text-ink-secondary">
                    Submitted {task.submitted_at
                      ? new Date(task.submitted_at).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={task.status} />
                  {task.submission_link && (
                    <a
                      href={task.submission_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-emerald underline"
                    >
                      View submission
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Profile */}
      <section id="profile">
        <DashboardPageHeader title="My Profile" description="Your founding cohort account details." />
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <p className="text-sm text-ink">
            <span className="font-semibold">Name:</span>{" "}
            {participant.profiles?.full_name ?? user?.email?.split("@")[0] ?? "—"}
          </p>
          <p className="text-sm text-ink">
            <span className="font-semibold">Email:</span>{" "}
            {user?.email ?? "—"}
          </p>
          <p className="text-sm text-ink">
            <span className="font-semibold">Programme:</span>
            {" Founding Cohort 2026–27"}
          </p>
          <p className="text-sm text-ink">
            <span className="font-semibold">Status:</span>{" "}
            {participant.participant_status}
          </p>
        </div>
      </section>
    </div>
  );
}
