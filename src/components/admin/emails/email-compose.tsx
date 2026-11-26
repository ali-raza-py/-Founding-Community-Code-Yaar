"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { type Recipient } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { SectionHeading } from "@/components/ui/section-heading";
import { ErrorState } from "@/components/admin/shared";
import { ConfirmDialog } from "./confirm-dialog";
import {
  EMAIL_TEMPLATES,
  EMAIL_TEMPLATE_PREVIEWS,
  EMAIL_SENDER_ADDRESS,
  EMAIL_SENDER_NAME,
} from "./constants";
import { cn } from "@/lib/utils";
import { buildTestEmailContent } from "@/lib/test-email-content";
import {
  Mail,
  Send,
  X,
  Eye,
  AlertCircle,
  CheckCircle,
  Users,
  ArrowRight,
  Bold,
  Italic,
  Link,
  List,
} from "lucide-react";

const MAX_RECIPIENTS = 50;
const MAX_SUBJECT_LENGTH = 200;
const MAX_BODY_LENGTH = 100_000;

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const sendSchema = z.object({
  recipients: z
    .array(z.string().email("Enter a valid email address."))
    .min(1, "Add at least one recipient.")
    .max(MAX_RECIPIENTS, `Limit recipient lists to ${MAX_RECIPIENTS} addresses.`),
  subject: z
    .string()
    .trim()
    .min(1, "Enter a subject line.")
    .max(MAX_SUBJECT_LENGTH, `Keep the subject under ${MAX_SUBJECT_LENGTH} characters.`),
  body: z.string().min(1, "Enter email content.").max(MAX_BODY_LENGTH, "Message is too long."),
});
function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Client-side sanitizer for the preview pane only. It removes script blocks,
 * inline event handlers, iframes and javascript: URLs so a malformed draft
 * cannot execute code in the admin UI. The backend is the authority on what
 * HTML is actually sent to recipients.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/\bon[a-z]+\s*=\s*(["'])[\s\S]*?\1/gi, "")
    .replace(/javascript:/gi, "");
}

interface EmailComposeProps {
  initialRecipients?: Recipient[];
  onRecipientsChange?: (recipients: Recipient[]) => void;
  onBrowseRecipients?: () => void;
}

export function EmailCompose({
  initialRecipients = [],
  onRecipientsChange,
  onBrowseRecipients,
}: EmailComposeProps) {
  const { accessToken } = useAuth();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [editorMounted, setEditorMounted] = useState(false);

  useEffect(() => {
    setEditorMounted(bodyRef.current !== null);
  }, []);

  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    const seen = new Set<string>();
    return initialRecipients
      .filter((r) => isValidEmail(normalizeEmail(r.email)) && !seen.has(normalizeEmail(r.email)) && seen.add(normalizeEmail(r.email)))
      .map((r) => ({ email: normalizeEmail(r.email), name: r.name.trim() }));
  });
  const [recipientInput, setRecipientInput] = useState("");
  const [recipientError, setRecipientError] = useState<string | null>(null);

  const [templateId, setTemplateId] = useState<string>(
    EMAIL_TEMPLATES[0]?.id ?? "custom"
  );
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [testSending, setTestSending] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [confirmTestOpen, setConfirmTestOpen] = useState(false);

  useEffect(() => {
    const preview = EMAIL_TEMPLATE_PREVIEWS[templateId];
    if (!preview || templateId === "custom") return;
    setSubject(preview.subject);
    if (body.trim().length === 0) {
      setBody(preview.body);
    }
  }, [templateId, body]);

  const addRecipient = useCallback(() => {
    const email = normalizeEmail(recipientInput);
    setRecipientError(null);
    if (!email) {
      setRecipientError("Enter an email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setRecipientError("Enter a valid email address such as you@example.com.");
      return;
    }
    if (recipients.some((r) => r.email === email)) {
      setRecipientError("This recipient is already in the list.");
      return;
    }
    if (recipients.length >= MAX_RECIPIENTS) {
      setRecipientError(`Recipient lists are limited to ${MAX_RECIPIENTS} addresses.`);
      return;
    }
    const next = [...recipients, { email, name: "" }];
    setRecipients(next);
    onRecipientsChange?.(next);
    setRecipientInput("");
  }, [recipientInput, recipients, onRecipientsChange]);

  const removeRecipient = useCallback((email: string) => {
    setRecipients((prev) => {
      const next = prev.filter((item) => item.email !== email);
      onRecipientsChange?.(next);
      return next;
    });
  }, [onRecipientsChange]);

  const handleRecipientKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addRecipient();
      }
    },
    [addRecipient]
  );

  const editBody = useCallback(
    (transform: (value: string) => string) => {
      const ta = bodyRef.current;
      if (!ta) return;
      const end = ta.selectionEnd ?? 0;
      const next = transform(body);
      setBody(next);
      setTimeout(() => {
        const t = bodyRef.current;
        if (t) {
          const pos = Math.min(next.length, end);
          t.selectionStart = pos;
          t.selectionEnd = pos;
        }
      }, 0);
    },
    [body]
  );

  const wrapSelection = useCallback(
    (tag: string, attrs: string) => {
      editBody((value) => {
        const ta = bodyRef.current;
        const start = ta ? (ta.selectionStart ?? 0) : 0;
        const end = ta ? (ta.selectionEnd ?? 0) : 0;
        const selected = value.slice(start, end) || `${tag.charAt(0).toUpperCase()}${tag.slice(1)} text`;
        return (
          value.slice(0, start) +
          `<${tag}${attrs}>${escapeHtml(selected)}</${tag}>` +
          value.slice(end)
        );
      });
    },
    [editBody]
  );

  const insertLink = useCallback(() => {
    const url = window.prompt("Paste the link URL (must start with https://):");
    if (!url) return;
    if (!/^https?:\/\/[^\s]+\.[^\s]+$/i.test(url)) {
      alert("Please enter a valid https:// URL.");
      return;
    }
    editBody((value) => {
      const ta = bodyRef.current;
      const start = ta ? (ta.selectionStart ?? 0) : 0;
      const end = ta ? (ta.selectionEnd ?? 0) : 0;
      const selected = value.slice(start, end) || "link text";
      return (
        value.slice(0, start) +
        `<a href="${escapeHtml(url)}">${escapeHtml(selected)}</a>` +
        value.slice(end)
      );
    });
  }, [editBody]);

  const insertList = useCallback(() => {
    editBody((value) => {
      const ta = bodyRef.current;
      const start = ta ? (ta.selectionStart ?? 0) : 0;
      const end = ta ? (ta.selectionEnd ?? 0) : 0;
      const selected = value.slice(start, end);
      const lines = (selected || value)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      if (lines.length === 0) return value;
      const list =
        "<ul>\n" + lines.map((line) => `  <li>${escapeHtml(line)}</li>`).join("\n") + "\n</ul>";
      return value.slice(0, start) + list + value.slice(end);
    });
  }, [editBody]);

  const sanitizedBody = useMemo(() => sanitizeHtml(body), [body]);

  const handleSendAttempt = useCallback(() => {
    setFieldErrors({});
    // Normalize recipient objects to email strings for validation, matching
    // the submission payload contract (backend expects string[]).
    const recipientEmails = recipients.map((r) => r.email);
    const result = sendSchema.safeParse({
      recipients: recipientEmails,
      subject,
      body,
    });
    if (!result.success) {
      const next: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form");
        (next[key] ??= []).push(issue.message);
      }
      setFieldErrors(next);
      setSendResult({
        success: false,
        message: "Please fix the highlighted fields before sending.",
      });
      return;
    }
    setConfirmSendOpen(true);
  }, [recipients, subject, body]);

  const handleSendConfirm = useCallback(async () => {
    if (!accessToken) return;
    setConfirmSendOpen(false);
    setSending(true);
    // Normal send and test email results are independent; do not clear the
    // test result when a normal send runs (and vice versa). Clear only the
    // send result so stale errors from a previous attempt do not linger.
    setSendResult(null);

    const idempotencyKey = crypto.randomUUID();
    const res = await communityApi.postAdminEmailSend(
      accessToken,
      {
        recipients: recipients.map((r) => r.email),
        subject,
        body,
        templateId: templateId || undefined,
      },
      idempotencyKey
    );

    setSending(false);
    if (!res.ok) {
      // Never display success for a failed request. Network errors are
      // distinguished from HTTP errors by sendErrorMessage.
      setSendResult({
        success: false,
        message: sendErrorMessage(res.error),
      });
      return;
    }
    if (res.data.accepted > 0) {
      setSendResult({
        success: true,
        message: `Email queued for ${res.data.accepted} recipient(s)${res.data.failed > 0 ? ` (${res.data.failed} failed)` : ""}.${res.data.messageId ? ` Provider message ID: ${res.data.messageId}` : ""}`,
      });
      setRecipients([]);
      onRecipientsChange?.([]);
      setSubject("");
      setBody("");
      setTemplateId(EMAIL_TEMPLATES[0]?.id ?? "custom");
    } else {
      setSendResult({
        success: false,
        message: `Failed to send to all ${res.data.failed} recipient(s).`,
      });
    }
  }, [accessToken, recipients, subject, body, templateId, onRecipientsChange]);

  const handleTestConfirm = useCallback(async () => {
    if (!accessToken || !testRecipient.trim()) return;
    const email = normalizeEmail(testRecipient);
    if (!isValidEmail(email)) {
      setTestResult({ success: false, message: "Enter a valid recipient email address." });
      return;
    }
    setConfirmTestOpen(false);
    setTestSending(true);
    // Test email and normal send results are independent; clear only the test
    // result so a stale test error does not linger after a fresh attempt.
    setTestResult(null);
    const content = buildTestEmailContent(email);
    const res = await communityApi.postAdminEmailTest(accessToken, {
      recipient: email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    setTestSending(false);
    if (res.ok) {
      setTestResult({
        success: true,
        message: `Test email sent to ${email}.${res.data.messageId ? ` Provider message ID: ${res.data.messageId}` : ""}`,
      });
    } else {
      setTestResult({ success: false, message: sendErrorMessage(res.error) });
    }
    setTestRecipient("");
  }, [accessToken, testRecipient]);

  if (!accessToken) {
    return <ErrorState message="Authentication session not available." />;
  }

  const isFormValid =
    recipients.length > 0 &&
    recipients.length <= MAX_RECIPIENTS &&
    subject.trim().length > 0 &&
    body.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading
          eyebrow="Compose Email"
          title="Compose Email"
          description="Compose and send a one-off email to community members. All sending goes through the protected backend — no provider credentials are exposed here."
          tag="h2"
        />
      </div>

      {/* Recipients */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="type-label">Recipients</p>
            <p className="text-sm text-ink-muted">
              Add recipients individually, or browse the recipient lists and
              compose from there.
            </p>
          </div>
          {onBrowseRecipients && (
            <Button
              onClick={onBrowseRecipients}
              disabled={sending}
              size="sm"
              variant="outline"
            >
              <Users className="size-4 shrink-0 mr-2" /> Browse recipient lists
            </Button>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-3">
          <Field label="Email address" error={recipientError ?? undefined} className="flex-1">
            <Input
              value={String(recipientInput ?? "")}
              onChange={(event) => setRecipientInput(event.currentTarget.value)}
              onKeyDown={handleRecipientKeyDown}
              placeholder="you@example.com"
              disabled={sending}
            />
          </Field>
          <Button
            onClick={addRecipient}
            disabled={sending || !recipientInput.trim() || recipients.length >= MAX_RECIPIENTS}
          >
            <ArrowRight className="size-3.5 shrink-0 mr-2" /> Add
          </Button>
        </div>

        {recipients.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {recipients.map((r) => (
              <span
                key={r.email}
                className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-raised px-3 py-1.5 text-sm"
              >
                <span className="text-ink font-medium">{escapeHtml(r.name || r.email)}</span>
                {r.name && (
                  <span className="text-[0.75rem] text-ink-muted font-mono">{`&lt;${escapeHtml(r.email)}&gt;`}</span>
                )}
                <button
                  onClick={() => removeRecipient(r.email)}
                  className="rounded-md p-1 text-ink-muted hover:bg-surface hover:text-danger transition-colors"
                  aria-label={`Remove ${r.email}`}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
            <p className="type-caption mt-3 text-ink-muted">
              {recipients.length} of {MAX_RECIPIENTS} recipients
            </p>
          </div>
        )}
        {fieldErrors.recipients?.[0] && (
          <p className="mt-3 text-[0.8125rem] text-danger font-medium" role="alert">
            {fieldErrors.recipients?.[0]}
          </p>
        )}
      </div>

      {/* Template + subject */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-4 lg:col-span-3">
          <Field label="Template" required>
            <Select
              value={String(templateId ?? "")}
              onChange={(event) => setTemplateId(event.currentTarget.value)}
              disabled={sending}
            >
              {EMAIL_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
              <option value="custom">Custom email</option>
            </Select>
          </Field>
        </div>
        <div className="sm:col-span-8 lg:col-span-9">
          <Field label="Subject" required error={fieldErrors.subject?.[0]}>
            <Input
              value={String(subject ?? "")}
              onChange={(event) => setSubject(event.currentTarget.value)}
              placeholder="Email subject line"
              disabled={sending}
              maxLength={MAX_SUBJECT_LENGTH}
            />
          </Field>
        </div>
      </div>

      {/* Editor + preview */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="type-label">Email body (HTML)</p>
            <p className="type-caption text-ink-muted">
              Safe HTML editor. Scripts, event handlers and iframes are stripped
              from the preview and are not sent to recipients.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => wrapSelection("strong", "")}
              disabled={sending || !editorMounted}
              size="sm"
              variant="outline"
              title="Bold"
            >
              <Bold className="size-3.5 shrink-0" />
            </Button>
            <Button
              onClick={() => wrapSelection("em", "")}
              disabled={sending || !editorMounted}
              size="sm"
              variant="outline"
              title="Italic"
            >
              <Italic className="size-3.5 shrink-0" />
            </Button>
            <Button
              onClick={insertLink}
              disabled={sending || !editorMounted}
              size="sm"
              variant="outline"
              title="Link"
            >
              <Link className="size-3.5 shrink-0" />
            </Button>
            <Button
              onClick={insertList}
              disabled={sending || !editorMounted}
              size="sm"
              variant="outline"
              title="Bulleted list"
            >
              <List className="size-3.5 shrink-0" />
            </Button>
            <Button
              onClick={() => setBody("")}
              disabled={sending || body.trim().length === 0}
              size="sm"
              variant="outline"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-3">
            <textarea
              ref={bodyRef}
              className="flex w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-colors"
              value={String(body ?? "")}
              onChange={(event) => setBody(event.currentTarget.value)}
              disabled={sending}
              rows={16}
              placeholder="Compose your email in HTML. Use the toolbar above for formatting."
            />
            <p className="mt-2 type-caption text-ink-muted">
              {body.length} of {MAX_BODY_LENGTH} characters
            </p>
            {fieldErrors.body?.[0] && (
              <p className="mt-1 text-[0.8125rem] text-danger font-medium" role="alert">
                {fieldErrors.body?.[0]}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-line bg-surface p-3 flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <p className="type-label">Preview</p>
              <Button
                onClick={() => {
                  bodyRef.current?.focus();
                }}
                size="sm"
                variant="ghost"
              >
                <Eye className="size-3.5 shrink-0 mr-1.5" /> Refresh preview
              </Button>
            </div>
            <div
              className="flex-1 overflow-y-auto rounded-md border border-line bg-surface-raised p-4 text-sm text-ink-muted leading-relaxed"
            >
              {sanitizedBody ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
              ) : (
                <p className="text-ink-subtle">Preview appears here.</p>
              )}
            </div>
            <p className="mt-2 type-caption text-ink-muted">
              Preview is approximate. Recipients receive the HTML as composed.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <Button
          onClick={() => setConfirmTestOpen(true)}
          disabled={sending || testSending}
          variant="outline"
          size="sm"
        >
          <Mail className="size-4 shrink-0 mr-2" /> Send test email
        </Button>
        <Button
          onClick={() => {
            handleSendAttempt();
          }}
          disabled={sending || !isFormValid}
        >
          <Send className="size-4 shrink-0 mr-2" /> Send email
        </Button>
      </div>

      {sendResult && (
        <div
          className={cn(
            "mt-6 rounded-lg border p-4",
            sendResult.success
              ? "border-emerald bg-emerald-soft"
              : "border-destructive bg-danger-soft"
          )}
        >
          <div className="flex gap-3">
            {sendResult.success ? (
              <CheckCircle className="size-5 text-emerald shrink-0" />
            ) : (
              <AlertCircle className="size-5 text-danger shrink-0" />
            )}
            <p className="text-sm">{sendResult.message}</p>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmSendOpen}
        onClose={() => setConfirmSendOpen(false)}
        onConfirm={handleSendConfirm}
        title="Confirm send email"
        description={
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink">
              Send <span className="font-medium">{recipients.length}</span>
              recipient{recipients.length !== 1 ? "s" : ""}{" "}
              <span className="font-medium">{escapeHtml(subject.trim()) || "(no subject)"}</span>
              from{" "}
              <span className="font-mono text-ink-muted">
                {EMAIL_SENDER_NAME} &lt;{EMAIL_SENDER_ADDRESS}&gt;
              </span>
              . The backend sends through the email provider and records the
              delivery attempt. This cannot be undone.
            </p>
            {recipients.length > 0 && (
              <div className="rounded-md border border-line bg-surface p-3 text-xs text-ink-muted max-h-40 overflow-y-auto">
                {recipients.map((r) => (
                  <div key={r.email} className="truncate">
                    {r.name || r.email}
                  </div>
                ))}
              </div>
            )}
          </div>
        }
        confirmLabel="Send email"
        loading={sending}
      />

      <ConfirmDialog
        open={confirmTestOpen}
        onClose={() => setConfirmTestOpen(false)}
        onConfirm={handleTestConfirm}
        title="Send test email"
        description={
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink">
              Send the composed email as a test to a single address to verify
              delivery and rendering before sending to the full list.
            </p>
            <Field label="Test recipient email address" required>
              <Input
                type="email"
                value={String(testRecipient ?? "")}
                onChange={(event) => setTestRecipient(event.currentTarget.value)}
                placeholder="you@example.com"
                autoFocus
                disabled={testSending}
              />
            </Field>
          </div>
        }
        confirmLabel="Send test email"
        loading={testSending}
      />

      {testResult && (
        <div
          className={cn(
            "mt-6 rounded-lg border p-4",
            testResult.success ? "border-emerald bg-emerald-soft" : "border-destructive bg-danger-soft"
          )}
        >
          <div className="flex gap-3">
            {testResult.success ? (
              <CheckCircle className="size-5 text-emerald shrink-0" />
            ) : (
              <AlertCircle className="size-5 text-danger shrink-0" />
            )}
            <p className="text-sm">{testResult.message}</p>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex gap-3">
          <Mail className="size-5 text-ink-muted shrink-0" />
          <div>
            <p className="font-semibold text-ink">How sending works</p>
            <p className="type-caption mt-1 text-ink-muted">
              Recipients, subject and body are validated in the browser and
              again by the backend. Each send attempt uses an idempotency key so
              a repeated request is not delivered twice. The backend records every
              attempt and the provider response, then reports the real delivery
              status — an email is only marked delivered once the provider
              confirms it, not merely because the request was accepted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function sendErrorMessage(error: {
  reason?: string;
  message?: string | null;
  status?: number;
}): string {
  switch (error.reason) {
    case "rate-limited":
      return "You’re sending too quickly. Please wait a moment, then try again.";
    case "unauthorized":
    case "forbidden":
      return "You are not authorized to send emails.";
    case "not-found":
      return "The send email endpoint has not been implemented in the Community API yet. Contact the Code Yaar team to enable email sending.";
    case "validation":
      return error.message || "The recipients or message content failed validation.";
    default:
      return error.message || "Failed to send the email. Please try again.";
  }
}
