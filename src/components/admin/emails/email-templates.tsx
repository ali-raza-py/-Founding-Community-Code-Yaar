"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, Eye, RotateCw } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/admin/shared";
import { Badge } from "@/components/ui/badge";
import { BrandedEmailPreview, type BrandedEmailPreviewProps } from "./email-preview";
import { type EmailTemplate } from "@/lib/api/types";
import { FROM_NAME, FROM_EMAIL } from "@/lib/email-templates";
import {
  EMAIL_TEMPLATES,
  EMAIL_TEMPLATE_PREVIEWS,
} from "./constants";

interface EmailTemplatesProps {
  refresh?: () => void;
}

const PREVIEW_CONTENT = EMAIL_TEMPLATE_PREVIEWS;

function templatePreviewKey(id: string): string {
  return (
    Object.entries(EMAIL_TEMPLATES).find(([, template]) => template.id === id)?.[0] ??
    id
  );
}

export function EmailTemplates({ refresh }: EmailTemplatesProps) {
  const { accessToken } = useAuth();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await communityApi.getAdminEmailTemplates(accessToken);
    if (res.ok) {
      setTemplates(res.data);
    } else {
      setError(res.error.message || "Failed to load email templates.");
    }
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const merged: Array<{
    id: string;
    name: string;
    description: string;
    active: boolean | null;
    updatedAt: string | null;
  }> = useMemo(() => {
    const backendById = new Map(
      templates.map((t) => [t.id, t] as const)
    );
    return EMAIL_TEMPLATES.map((local) => ({
      ...local,
      active: backendById.get(local.id)?.active ?? null,
      updatedAt: backendById.get(local.id)?.updatedAt ?? null,
    }));
  }, [templates]);

  if (loading) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <SectionHeading
          eyebrow="Email Templates"
          title="Templates"
          description="Available email templates and their delivery status."
          tag="h2"
        />
        <div className="mt-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-surface-raised" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const missing =
      error.includes("not configured") || error.includes("Route not found");
    return (
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <SectionHeading
          eyebrow="Email Templates"
          title="Templates"
          description="Available email templates and their delivery status."
          tag="h2"
        />
        <div className="mt-6 rounded-xl border border-destructive bg-danger-soft p-6">
          <div className="flex gap-3">
            <span className="size-5 text-danger shrink-0" />
            <div>
              <p className="font-semibold text-danger">
                Templates unavailable
              </p>
              <p className="type-caption mt-1 text-ink-muted">
                {missing
                  ? "The email templates endpoint has not been implemented in the Founding Community API yet."
                  : error}
              </p>
            </div>
          </div>
        </div>
        {missing && refresh && (
          <div className="mt-6">
            <Button onClick={refresh} size="sm">
              Refresh templates
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionHeading
            eyebrow="Email Templates"
            title="Templates"
            description="Overview of community email templates, their status, and previews."
            tag="h2"
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            onClick={() => void refresh?.()}
            disabled={loading}
            size="sm"
          >
            <RotateCw className="size-4 shrink-0" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {merged.length === 0 ? (
          <EmptyState
            title="No templates found"
            description="No email templates are configured yet."
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-raised">
                <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Template</th>
                <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Description</th>
                <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-center">Status</th>
                <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Last Updated</th>
                <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Preview</th>
              </tr>
            </thead>
            <tbody>
              {merged.map((template) => {
                const preview = PREVIEW_CONTENT[templatePreviewKey(template.id)];
                const active = template.active;
                return (
                  <tr
                    key={template.id}
                    className="border-b border-line hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-ink">
                      {template.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {template.description}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      {active === null ? (
                        <span className="text-[0.8125rem] text-ink-muted">—</span>
                      ) : active ? (
                        <Badge variant="emerald">Active</Badge>
                      ) : (
                        <Badge>Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {template.updatedAt
                        ? new Date(template.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button
                        onClick={() => {
                          setPreviewId(template.id);
                        }}
                        disabled={!preview}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="size-3.5 shrink-0 mr-1.5" />
                        Preview
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <TemplatePreviewDialog
        open={previewId !== null}
        onClose={() => setPreviewId(null)}
        templateId={previewId}
      />
    </div>
  );
}

function TemplatePreviewDialog({
  open,
  onClose,
  templateId,
}: {
  open: boolean;
  onClose: () => void;
  templateId: string | null;
}) {
  if (!open || !templateId) return null;

  const local = EMAIL_TEMPLATES.find((t) => t.id === templateId);
  const preview = EMAIL_TEMPLATE_PREVIEWS[templateId as keyof typeof EMAIL_TEMPLATE_PREVIEWS];

  // Map the catalogue template id to the branded preview template key, with
  // illustrative placeholder data so the admin reviews a realistic email.
  const templateKeyMap: Record<
    string,
    { key: BrandedEmailPreviewProps["templateKey"]; data: Record<string, string> } | null
  > = {
    "application-received": {
      key: "applicationReceived",
      data: {
        applicantName: "Alex Rivera",
        programName: "Founding Cohort 2026–27",
        applicationId: "app-0001",
      },
    },
    "application-approved": {
      key: "applicationApproved",
      data: {
        applicantName: "Alex Rivera",
        programName: "Founding Cohort 2026–27",
        applicationId: "app-0001",
      },
    },
    "application-rejected": {
      key: "applicationRejected",
      data: {
        applicantName: "Alex Rivera",
        programName: "Founding Cohort 2026–27",
        applicationId: "app-0001",
      },
    },
    "new-application-admin-notification": {
      key: "applicationSubmittedAdmin",
      data: {
        adminName: "Administrator",
        applicantName: "Alex Rivera",
        applicantEmail: "alex@example.com",
        programName: "Founding Cohort 2026–27",
        applicationId: "app-0001",
      },
    },
    "participant-invitation": {
      key: "participantInvited",
      data: {
        inviteeName: "Alex Rivera",
        programName: "Founding Cohort 2026–27",
      },
    },
    welcome: {
      key: "welcome",
      data: {
        recipientName: "Alex Rivera",
        programName: "Founding Cohort 2026–27",
      },
    },
    "community-announcement": {
      key: "communityAnnouncement",
      data: {
        recipientName: "Community member",
        programName: "Founding Cohort 2026–27",
        announcementTitle: "Community announcement",
        announcementBody: "Here is the latest update from the Code Yaar team.",
        url: "https://contact.codeyaar.tech",
      },
    },
    "ambassador-invitation": {
      key: "ambassadorInvitation",
      data: {
        recipientName: "Alex Rivera",
        ambassadorName: "Samir Khan",
        applicationUrl: "https://contact.codeyaar.tech/ambassadors/apply",
      },
    },
  }

  const mapped = templateKeyMap[templateId]

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Preview: ${local?.name ?? ""}`}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface shadow-lg"
      >
        <div className="flex items-start justify-between p-6 sm:p-8">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Preview — {local?.name ?? templateId}
            </h2>
            <p className="type-caption text-ink-muted">
              Branded production rendering. Final copy is defined in the
              backend templates and editable through the Templates section.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-ink-muted hover:bg-surface-raised transition-colors"
            aria-label="Close preview"
          >
            <Mail className="size-5" />
          </button>
        </div>
        <div className="border-t border-line p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Subject</p>
              <p className="text-sm text-ink font-medium">
                {preview?.subject || "—"}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Sender</p>
              <p className="text-sm text-ink-muted font-mono">
                {FROM_NAME} &lt;{FROM_EMAIL}&gt;
              </p>
            </div>
          </div>
          {mapped ? (
            <div className="mt-6 rounded-xl border border-line bg-surface p-4 sm:p-6">
              <div className="flex items-start gap-2 mb-3">
                <Mail className="size-4 text-ink-muted shrink-0 mt-0.5" />
                <p className="type-label">Branded email preview</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-3 max-h-[600px] overflow-y-auto text-sm leading-relaxed">
                <BrandedEmailPreview templateKey={mapped.key} data={mapped.data} />
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-line bg-surface p-4">
              <p className="type-body text-ink-muted">
                No branded preview available for custom emails. The composed
                HTML body is used as-is when sending.
              </p>
            </div>
          )}
          <p className="mt-4 type-caption text-ink-muted">
            Edit template copy is managed in the backend templates table; the
            frontend preview reflects the branded design system.
          </p>
        </div>
      </div>
    </>
  );
}
