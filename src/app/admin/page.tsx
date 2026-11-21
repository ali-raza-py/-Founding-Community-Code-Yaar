"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
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

const ADMIN_TABS = [
  { key: "applications" as const, label: "Applications" },
  { key: "participants" as const, label: "Participants" },
  { key: "referrals" as const, label: "Referrals" },
  { key: "announcements" as const, label: "Announcements" },
  { key: "tasks" as const, label: "Tasks" },
  { key: "stats" as const, label: "Statistics" },
] as const;

export default function AdminPage() {
  const { user, accessToken, isAuthenticated, isLoading, isAdmin, isSuperAdmin, signOut } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"applications" | "participants" | "referrals" | "announcements" | "tasks" | "stats">("applications");

  const [applications, setApplications] = useState<Array<any>>([]);
  const [appMeta, setAppMeta] = useState<any>(null);
  const [appDetail, setAppDetail] = useState<any>(null);
  const [participants, setParticipants] = useState<Array<any>>([]);
  const [partMeta, setPartMeta] = useState<any>(null);
  const [referrals, setReferrals] = useState<Array<any>>([]);
  const [refMeta, setRefMeta] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Array<any>>([]);
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  const pageRef = useRef(1);

  const loadStats = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAdminStats(accessToken);
    if (res.ok) setStats(res.data);
  }, [accessToken]);

  const loadApplications = useCallback(async (page = 1) => {
    if (!accessToken) return;
    setLoading(true);
    const res = await communityApi.getAdminApplications(accessToken, { page, pageSize: 20 });
    if (res.ok) {
      setApplications(res.data.items);
      setAppMeta(res.data.meta);
      pageRef.current = page;
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [accessToken]);

  const loadParticipants = useCallback(async (page = 1) => {
    if (!accessToken) return;
    const res = await communityApi.getAdminParticipants(accessToken, { page, pageSize: 20 });
    if (res.ok) {
      setParticipants(res.data.items);
      setPartMeta(res.data.meta);
    } else {
      setError(res.error.message);
    }
  }, [accessToken]);

  const loadReferrals = useCallback(async (page = 1) => {
    if (!accessToken) return;
    const res = await communityApi.getAdminReferrals(accessToken, { page, pageSize: 20 });
    if (res.ok) {
      setReferrals(res.data.items);
      setRefMeta(res.data.meta);
    } else {
      setError(res.error.message);
    }
  }, [accessToken]);

  const loadAnnouncements = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getAnnouncements(accessToken);
    if (res.ok) setAnnouncements(res.data);
    else setError(res.error.message);
  }, [accessToken]);

  const loadTasks = useCallback(async () => {
    if (!accessToken) return;
    const res = await communityApi.getMyTasks(accessToken);
    if (res.ok) setTasks(res.data);
    else setError(res.error.message);
  }, [accessToken]);

  const handleStatusUpdate = useCallback(async (id: string, status: string) => {
    setStatusUpdateLoading(id);
    const res = await communityApi.updateApplicationStatus(accessToken!, id, status);
    setStatusUpdateLoading(null);
    if (res.ok) {
      setAppDetail(res.data);
      void loadApplications(pageRef.current);
    } else {
      setError(res.error.message);
    }
  }, [accessToken]);

  const createAnnouncement = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const target_program_id = formData.get("target_program_id") as string || undefined;
    const published = formData.get("published") === "on";

    const res = await communityApi.createAdminAnnouncement(accessToken!, {
      title,
      content,
      target_program_id,
      published,
    });

    if (res.ok) {
      setAnnouncements([res.data, ...announcements]);
      return true;
    }
    setError(res.error.message);
    return false;
  }, [accessToken, announcements]);

  const createTask = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const program_id = formData.get("program_id") as string;
    const assigned_to = formData.get("assigned_to") as string;
    const due_date = formData.get("due_date") as string;
    const status = formData.get("status") as string || "pending";

    const res = await communityApi.createAdminTask(accessToken!, {
      title,
      description,
      program_id,
      assigned_to,
      due_date,
      status,
    });

    if (res.ok) {
      setTasks([res.data, ...tasks]);
      return true;
    }
    setError(res.error.message);
    return false;
  }, [accessToken, tasks]);

  // Redirect unauthenticated or non-admin users.
  if (isLoading) {
    return (
      <Section padded>
        <SectionInner className="text-center py-24">
          <p className="type-body text-ink-muted">Loading admin dashboard…</p>
        </SectionInner>
      </Section>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    router.push("/dashboard");
    return null;
  }

  // Load initial data based on tab.
  useEffect(() => {
    if (activeTab === "applications") void loadApplications(1);
    if (activeTab === "participants") void loadParticipants(1);
    if (activeTab === "referrals") void loadReferrals(1);
    if (activeTab === "announcements") void loadAnnouncements();
    if (activeTab === "tasks") void loadTasks();
    if (activeTab === "stats") void loadStats();
  }, [activeTab, loadApplications, loadParticipants, loadReferrals, loadAnnouncements, loadTasks, loadStats]);

  return (
    <>
      <Section padded>
        <SectionInner>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <SectionHeading
                eyebrow="Admin Dashboard"
                title="Application Management"
                description={isSuperAdmin ? "Super administrator access" : "Administrator access"}
              />
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-[0.8125rem] text-ink-muted hover:text-emerald">
                ← Back to participant dashboard
              </Link>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign out
              </Button>
            </div>
          </div>
        </SectionInner>
      </Section>

      {/* Admin Navigation Tabs */}
      <Section padded className="bg-surface-raised">
        <SectionInner>
          <div className="flex gap-1 border-b border-line mb-8">
            {ADMIN_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors border-b-2",
                  activeTab === key
                    ? "border-emerald text-emerald"
                    : "border-transparent text-ink-muted hover:text-emerald",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <SectionHeading
                  eyebrow="Applications"
                  title="All Applications"
                  description="Review, search, and update application statuses."
                />
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                >
                  New Application
                </Link>
              </div>

              {loading ? (
                <p className="type-body text-ink-muted">Loading applications…</p>
              ) : error ? (
                <p className="type-body text-danger">{error}</p>
              ) : (
                <div className="rounded-lg border border-line bg-surface overflow-hidden">
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
                          onClick={() => setAppDetail(app)}
                        >
                          <td className="px-4 py-3 text-sm text-ink">
                            {app.applicant_name || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-ink-muted">
                            {app.email || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-ink">
                            {app.programs?.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-ink">
                            {statusBadge(app.application_status)}
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
                      {applications.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                            No applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {appMeta && (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-[0.8125rem] text-ink-muted">
                        {appMeta.total} applications &middot; Page {appMeta.page} of {appMeta.totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (pageRef.current > 1) void loadApplications(pageRef.current - 1);
                          }}
                          disabled={pageRef.current <= 1 || loading}
                          className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => {
                            if (pageRef.current < appMeta.totalPages) void loadApplications(pageRef.current + 1);
                          }}
                          disabled={pageRef.current >= appMeta.totalPages || loading}
                          className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === "participants" && (
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Participants"
                title="Participant Directory"
                description="Manage community participants and their status."
              />
              <div className="mt-8 rounded-lg border border-line bg-surface overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line bg-surface-raised">
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Name</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Program</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p: any) => (
                      <tr
                        key={p.id}
                        className="border-b border-line hover:bg-surface-raised transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-ink">
                          {p.profiles?.full_name || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-muted">
                          {p.profiles?.email || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {p.programs?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {statusBadge(p.participant_status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-muted">
                          {p.joined_at ? new Date(p.joined_at).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                    {participants.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                          No participants found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === "referrals" && (
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Referrals"
                title="Referral Registrations"
                description="Review and verify ambassador referral registrations."
              />
              <div className="mt-8 rounded-lg border border-line bg-surface overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line bg-surface-raised">
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Referral Code</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Registered Email</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Verification</th>
                      <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((r: any) => (
                      <tr key={r.id} className="border-b border-line hover:bg-surface-raised transition-colors">
                        <td className="px-4 py-3 text-sm text-ink font-mono">{r.referral_code || "—"}</td>
                        <td className="px-4 py-3 text-sm text-ink-muted">{r.registered_email || "—"}</td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {statusBadge(r.verification_status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-muted">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                    {referrals.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                          No referral registrations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Announcements"
                title="Community Announcements"
                description="Publish announcements to the community."
              />

              {/* Create Announcement Form */}
              <div className="mt-8 rounded-xl border border-line bg-surface p-6 sm:p-8">
                <form onSubmit={createAnnouncement} className="space-y-4">
                  <Field label="Title" required>
                    <Input
                      name="title"
                      placeholder="Announcement title"
                      required
                    />
                  </Field>
                  <Field label="Content" required>
                    <Textarea
                      name="content"
                      rows={4}
                      placeholder="Announcement content"
                      required
                    />
                  </Field>
                  <Field label="Target Program (optional)">
                    <Select name="target_program_id">
                      <option value="">All programs</option>
                    </Select>
                  </Field>
                  <Field className="flex items-start gap-2">
                    <input
                      id="published"
                      name="published"
                      type="checkbox"
                      className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
                    />
                    <label htmlFor="published" className="text-sm leading-relaxed cursor-pointer text-ink">
                      Publish immediately
                    </label>
                  </Field>
                  <Button type="submit" disabled={isLoading}>
                    Create Announcement
                  </Button>
                </form>
              </div>

              {/* Announcements List */}
              <SectionHeading
                eyebrow="Published"
                title="Current Announcements"
                className="mt-10"
              />
              <div className="mt-6 space-y-4">
                {announcements.length === 0 ? (
                  <p className="type-body text-ink-muted">No announcements found.</p>
                ) : (
                  announcements.map((a: any) => (
                    <div
                      key={a.id}
                      className="rounded-lg border border-line bg-surface-raised p-4 sm:p-6 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="font-semibold text-ink">{a.title}</h4>
                        <p className="mt-1 text-sm text-ink-muted">{a.content}</p>
                        <p className="mt-2 text-[0.75rem] text-ink-subtle">
                          {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {a.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Tasks"
                title="Task Assignment"
                description="Assign tasks to community participants."
              />

              <div className="mt-8 rounded-xl border border-line bg-surface p-6 sm:p-8">
                <form onSubmit={createTask} className="space-y-4">
                  <Field label="Title" required>
                    <Input name="title" placeholder="Task title" required />
                  </Field>
                  <Field label="Description" required>
                    <Textarea name="description" rows={4} placeholder="Task description" required />
                  </Field>
                  <Field label="Program ID" required>
                    <Input name="program_id" placeholder="Program UUID" required />
                  </Field>
                  <Field label="Assigned To (User ID)" required>
                    <Input name="assigned_to" placeholder="User UUID" required />
                  </Field>
                  <Field label="Due Date">
                    <Input type="datetime-local" name="due_date" />
                  </Field>
                  <Field label="Status">
                    <Select name="status" defaultValue="pending">
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </Select>
                  </Field>
                  <Button type="submit" disabled={isLoading}>
                    Create Task
                  </Button>
                </form>
              </div>

              <SectionHeading
                eyebrow="Assigned Tasks"
                title="Your Tasks"
                className="mt-10"
              />
              <div className="mt-6 space-y-4">
                {tasks.length === 0 ? (
                  <p className="type-body text-ink-muted">No tasks found.</p>
                ) : (
                  tasks.map((t: any) => (
                    <div
                      key={t.id}
                      className="rounded-lg border border-line bg-surface-raised p-4 sm:p-6 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="font-semibold text-ink">{t.title}</h4>
                        <p className="mt-1 text-sm text-ink-muted">{t.description}</p>
                        <p className="mt-2 text-[0.75rem] text-ink-muted">
                          Assigned to {t.assigned_to} &middot; Due{" "}
                          {t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}
                        </p>
                      </div>
                      <Badge variant="default">{t.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Statistics"
                title="Dashboard Summary"
                description="Community application and participant statistics."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-line bg-surface p-6">
                  <p className="type-label mb-1">Total Applications</p>
                  <p className="text-2xl font-semibold text-ink">
                    {stats?.applications ?? "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-surface p-6">
                  <p className="type-label mb-1">Total Participants</p>
                  <p className="text-2xl font-semibold text-ink">
                    {stats?.participants ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SectionInner>
      </Section>
    </>
  );
}
