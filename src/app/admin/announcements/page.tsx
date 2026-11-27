"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Megaphone } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import type { Announcement } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Dialog } from "@/components/dashboard/dialog";
import { LoadingState } from "@/components/admin/shared";
import { AnnouncementEditor, renderAnnouncementContent } from "@/components/admin/announcement-editor";
import {
  announcementCreationSchema,
  type AnnouncementCreationInput,
} from "@/lib/validation";

interface ProgramOption {
  id: string;
  name: string;
}

interface FieldErrorMap {
  title?: string;
  content?: string;
  target_program_id?: string;
  published?: string;
  _form?: string;
}

function isSuccess(result: { success: boolean }): result is { success: true } {
  return result.success === true;
}

export default function AdminAnnouncementsPage() {
  const { accessToken, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterAudience, setFilterAudience] = useState<"all" | "program" | "">("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterStatus, setFilterStatus] = useState<"published" | "draft" | "">("");
  const [search, setSearch] = useState("");

  const programById = useMemo(() => {
    const map = new Map<string, ProgramOption>();
    for (const p of programs) map.set(p.id, p);
    return map;
  }, [programs]);

  const loadAnnouncements = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        communityApi.getAnnouncements(accessToken).then((res) => {
          if (res.ok) {
            let list = res.data ?? [];
            if (search) {
              const q = search.toLowerCase();
              list = list.filter(
                (a) =>
                  a.title.toLowerCase().includes(q) ||
                  a.content.toLowerCase().includes(q),
              );
            }
            if (filterProgram) {
              list = list.filter((a) => a.target_program_id === filterProgram);
            }
            if (filterAudience === "all") {
              list = list.filter((a) => a.target_program_id === null);
            } else if (filterAudience === "program") {
              list = list.filter((a) => a.target_program_id !== null);
            }
            if (filterStatus === "published") {
              list = list.filter((a) => a.published);
            } else if (filterStatus === "draft") {
              list = list.filter((a) => !a.published);
            }
            list.sort(
              (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            );
            setAnnouncements(list);
          } else {
            setError(res.error.message);
          }
        }),
        communityApi.getAdminPrograms(accessToken).then((r) => {
          if (r.ok) setPrograms((r.data ?? []).map((p) => ({ id: p.id, name: p.name })));
        }),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, search, filterProgram, filterAudience, filterStatus]);

  useEffect(() => {
    void loadAnnouncements();
  }, [loadAnnouncements]);

  // ------------------------------------------------------------------
  // Create announcement state
  // ------------------------------------------------------------------
  const EMPTY_CREATE: AnnouncementCreationInput = {
    title: "",
    content: "",
    target_program_id: null,
    published: false,
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState<AnnouncementCreationInput>(
    EMPTY_CREATE,
  );
  const [audienceMode, setAudienceMode] = useState<"all" | "program">("all");
  const [createErrors, setCreateErrors] = useState<FieldErrorMap>({});
  const [createFormError, setCreateFormError] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // ------------------------------------------------------------------
  // View / preview state
  // ------------------------------------------------------------------
  const [viewOpen, setViewOpen] = useState(false);
  const [viewAnnouncement, setViewAnnouncement] = useState<Announcement | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ------------------------------------------------------------------
  // Delete state (only if backend supports it — it does not; kept for UI symmetry)
  // ------------------------------------------------------------------
  // NOTE: The Community API does not expose announcement edit/archive/delete
  // endpoints, so those actions are intentionally not implemented here.

  const validateCreate = (): boolean => {
    const values: AnnouncementCreationInput = {
      ...createValues,
      target_program_id:
        audienceMode === "all" ? null : createValues.target_program_id ?? null,
      published: createValues.published ?? false,
    };
    const result = announcementCreationSchema.safeParse(values);
    if (!isSuccess(result)) {
      const fieldErrors: FieldErrorMap = {};
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path[0];
          if (path && typeof path === "string") {
            fieldErrors[path as keyof FieldErrorMap] = issue.message;
          }
        }
      }
      setCreateErrors(fieldErrors);
      setCreateFormError("Please fix the fields marked below.");
      return false;
    }
    setCreateErrors({});
    setCreateFormError("");
    return true;
  };

  const applyValidationErrors = (
    err: { reason?: string; message?: string; details?: Record<string, string[]> },
    setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrorMap>>,
    setFormError: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const fieldErrors: FieldErrorMap = {};
    if (err.details && typeof err.details === "object") {
      for (const [key, messages] of Object.entries(err.details)) {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[key as keyof FieldErrorMap] = messages[0];
        }
      }
    }
    setFieldErrors(fieldErrors);
    setFormError(err.message || "Request failed. Please check the highlighted fields.");
  };

  const handleCreate = async (publishNow: boolean) => {
    if (!accessToken) return;
    if (!validateCreate()) return;
    setCreateSubmitting(true);
    setCreateErrors({});
    setCreateFormError("");
    try {
      const values: AnnouncementCreationInput = {
        title: createValues.title.trim(),
        content: createValues.content.trim(),
        target_program_id:
          audienceMode === "all" ? null : createValues.target_program_id ?? null,
        published: publishNow,
      };
      const res = await communityApi.createAdminAnnouncement(accessToken, {
        title: values.title,
        content: values.content,
        target_program_id: values.target_program_id ?? undefined,
        published: values.published,
      });
      if (res.ok) {
        setCreateOpen(false);
        setCreateValues(EMPTY_CREATE);
        setAudienceMode("all");
        setCreateErrors({});
        setCreateFormError("");
        setCreateSubmitting(false);
        void loadAnnouncements();
      } else {
        applyValidationErrors(res.error, setCreateErrors, setCreateFormError);
        setCreateSubmitting(false);
      }
    } catch {
      setCreateSubmitting(false);
      setCreateFormError("Failed to create announcement. Please try again.");
    }
  };

  const handleView = async (id: string) => {
    if (!accessToken) return;
    setViewAnnouncement(null);
    setViewLoading(true);
    setViewOpen(true);
    try {
      const res = await communityApi.getAnnouncements(accessToken);
      if (res.ok) {
        const a = (res.data ?? []).find((x) => x.id === id);
        setViewAnnouncement(a ?? null);
      } else {
        setError(res.error.message);
      }
    } finally {
      setViewLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const visibleAnnouncements = announcements;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Community Announcements"
        description="Create and publish announcements to the Code Yaar community."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Announcements", href: "/admin/announcements" },
        ]}
        actions={
          <Button
            onClick={() => {
              setCreateValues(EMPTY_CREATE);
              setAudienceMode("all");
              setCreateErrors({});
              setCreateFormError("");
              setCreateOpen(true);
            }}
          >
            <Megaphone className="mr-2 size-4" /> Create announcement
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg border border-danger-soft bg-danger-soft p-4">
          <p className="text-sm font-semibold text-danger">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-4 items-end">
          <div className="sm:col-span-2">
            <Field label="Search" hint="Search by title or content">
              <Input
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Search announcements…"
              />
            </Field>
          </div>
          <div>
            <Field label="Audience">
              <Select
                value={filterAudience}
                onChange={(e) => setFilterAudience(e.currentTarget.value as "all" | "program" | "")}
              >
                <option value="">All audiences</option>
                <option value="all">All community members</option>
                <option value="program">Specific programme</option>
              </Select>
            </Field>
          </div>
          <div>
            <Field label="Programme">
              <Select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.currentTarget.value)}
              >
                <option value="">All programmes</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div>
            <Field label="Status">
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.currentTarget.value as "published" | "draft" | "")}>
                <option value="">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </Field>
          </div>
        </div>
      </div>

      {/* Create announcement dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create announcement"
        submitting={createSubmitting}
        error={createFormError || Object.values(createErrors).join(" ")}
      >
        <div className="space-y-6">
          {/* Section A — Content */}
          <div className="rounded-lg border border-line bg-surface-raised p-4">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-tight mb-3">
              Section A · Announcement content
            </h3>
            <Field label="Title" required error={createErrors.title}>
              <Input
                value={createValues.title}
                onChange={(e) =>
                  setCreateValues({ ...createValues, title: e.currentTarget.value })
                }
                required
                maxLength={200}
              />
            </Field>
            <Field label="Content" required error={createErrors.content} hint="The announcement body. Stored and displayed as safe plain text.">
              <AnnouncementEditor
                value={createValues.content}
                onChange={(v) =>
                  setCreateValues({ ...createValues, content: v })
                }
                error={createErrors.content}
              />
            </Field>
            {createErrors.content && (
              <p className="mt-2 text-[0.8125rem] text-danger font-medium" role="alert">
                {createErrors.content}
              </p>
            )}
          </div>

          {/* Section B — Audience targeting */}
          <div className="rounded-lg border border-line bg-surface-raised p-4">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-tight mb-3">
              Section B · Audience targeting
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 border rounded-md p-2 border-line hover:border-emerald transition-colors">
                <input
                  id="audience-all"
                  type="radio"
                  checked={audienceMode === "all"}
                  onChange={() => setAudienceMode("all")}
                  className="mt-1 shrink-0 text-emerald focus-visible:ring-emerald"
                />
                <label htmlFor="audience-all" className="text-ink cursor-pointer">
                  All eligible community members
                </label>
                <p className="text-[0.75rem] text-ink-secondary ml-8">
                  Visible to every authenticated community member.
                </p>
              </div>
              <div className="flex items-start gap-2 border rounded-md p-2 border-line hover:border-emerald transition-colors">
                <input
                  id="audience-program"
                  type="radio"
                  checked={audienceMode === "program"}
                  onChange={() => setAudienceMode("program")}
                  className="mt-1 shrink-0 text-emerald focus-visible:ring-emerald"
                />
                <label htmlFor="audience-program" className="text-ink cursor-pointer">
                  Specific programme
                </label>
                <Field
                  label="Programme"
                  required
                  error={audienceMode === "program" ? createErrors.target_program_id : undefined}
                  className="mt-2"
                >
                  <Select
                    value={createValues.target_program_id ?? ""}
                    onChange={(e) =>
                      setCreateValues({
                        ...createValues,
                        target_program_id: e.currentTarget.value || null,
                      })
                    }
                    required
                  >
                    <option value="">Select a programme</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </Field>
                {audienceMode === "program" && createErrors.target_program_id && (
                  <p className="mt-1 text-[0.8125rem] text-danger font-medium" role="alert">
                    {createErrors.target_program_id}
                  </p>
                )}
                <p className="text-[0.75rem] text-ink-secondary ml-8">
                  Visible only to members of the selected programme.
                </p>
              </div>
            </div>
            <p className="type-caption text-ink-secondary mt-2">
              Targeting is enforced by the backend. Normal participants cannot create
              admin announcements.
            </p>
          </div>

          {/* Section C — Announcement type */}
          <div className="rounded-lg border border-line bg-surface-raised p-4">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-tight mb-3">
              Section C · Announcement type
            </h3>
            <p className="text-sm text-ink-secondary">
              The existing announcement contract stores a single content field and does
              not yet support announcement categories such as General Update, Event, or
              Deadline Reminder. No category is submitted, so no frontend-only value is
              invented. Category support can be added as a backend schema change.
            </p>
          </div>

          {/* Section D — Publication settings */}
          <div className="rounded-lg border border-line bg-surface-raised p-4">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-tight mb-3">
              Section D · Publication settings
            </h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleCreate(false)}
                disabled={createSubmitting}
              >
                {createSubmitting ? "Saving…" : "Save draft"}
              </Button>
              <Button
                onClick={() => void handleCreate(true)}
                disabled={createSubmitting}
              >
                {createSubmitting ? "Publishing…" : "Publish now"}
              </Button>
            </div>
            <p className="type-caption mt-2 text-ink-secondary">
              Drafts are stored with publication off and are not shown to community
              members until published. Scheduled publication and archiving are not
              supported by the current backend and are intentionally not implemented.
            </p>
          </div>
        </div>
      </Dialog>

      {/* Announcements list */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Announcements</p>
            <p className="text-[0.8125rem] text-ink-secondary">
              {visibleAnnouncements.length} announcement{visibleAnnouncements.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <LoadingState />
          </div>
        ) : visibleAnnouncements.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              title="No announcements found"
              description={
                !search && !filterProgram && !filterAudience && !filterStatus
                  ? "There are no announcements yet. Create your first announcement."
                  : "No announcements match your current filters."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised text-xs font-semibold text-ink-secondary uppercase tracking-tight">
                  <th className="p-4">Announcement</th>
                  <th className="p-4">Target audience</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleAnnouncements.map((a) => {
                  const audienceLabel =
                    a.target_program_id === null
                      ? "All community members"
                      : programById.get(a.target_program_id)?.name ??
                        "Targeted programme";
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-line/50 hover:bg-surface-raised/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-ink">{a.title}</div>
                      </td>
                      <td className="p-4 text-xs text-ink-secondary">
                        {audienceLabel}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={a.published ? "success" : "pending"} />
                      </td>
                      <td className="p-4 text-xs font-mono text-ink-secondary">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(a.id)}
                          className="text-xs text-ink-muted hover:text-emerald hover:border-emerald"
                          title="View announcement"
                        >
                          <Eye className="mr-1 size-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View / preview dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Announcement preview"
        submitting={viewLoading}
      >
        {viewAnnouncement ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="type-label">Announcement</p>
                <h4 className="font-semibold text-ink">{viewAnnouncement.title}</h4>
              </div>
              <StatusBadge status={viewAnnouncement.published ? "success" : "pending"} />
            </div>
            <div>
              <p className="type-label">Content</p>
              <div
                className="prose-body text-sm leading-relaxed rounded-lg border border-line bg-surface p-4"
                dangerouslySetInnerHTML={{
                  __html: renderAnnouncementContent(viewAnnouncement.content),
                }}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="type-label">Target audience</p>
                <p className="text-ink-secondary">
                  {viewAnnouncement.target_program_id === null
                    ? "All community members"
                    : programById.get(viewAnnouncement.target_program_id)?.name ??
                      "Targeted programme"}
                </p>
              </div>
              <div>
                <p className="type-label">Published</p>
                <p className="text-ink-secondary">
                  {viewAnnouncement.published ? "Yes" : "No (draft)"}
                </p>
              </div>
              <div>
                <p className="type-label">Created</p>
                <p className="text-ink-secondary">
                  {new Date(viewAnnouncement.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="type-caption mt-2 text-ink-secondary">
              Delivery channel: in-app (Community API). Announcements are retrieved by
              community members through GET /api/v1/announcements. No email is sent as
              part of the announcement flow — the existing Resend email integration is
              preserved for the separate email module.
            </p>
          </div>
        ) : null}
      </Dialog>

      <p className="type-caption text-ink-secondary text-center">
        Announcements are created via{" "}
        <code className="font-mono text-xs">POST /api/v1/admin/announcements</code>{" "}
        and retrieved via{" "}
        <code className="font-mono text-xs">GET /api/v1/announcements</code>. The backend
        does not currently provide announcement editing, archiving, or deletion, so those
        actions are not available. Published announcements are visible to the targeted
        audience in community dashboards.
      </p>
    </div>
  );
}
