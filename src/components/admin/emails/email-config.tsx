"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { type EmailConfig } from "@/lib/api/types";
import { SkeletonText } from "./skeleton";
import { ConfirmDialog } from "./confirm-dialog";
import {
  EMAIL_SENDER_ADDRESS,
  EMAIL_SENDER_NAME,
} from "./constants";

interface EmailConfigProps {
  refresh?: () => void;
}

function configStatusVariant(status: EmailConfig["status"]) {
  switch (status) {
    case "configured":
      return "emerald";
    case "misconfigured":
      return "default";
    default:
      return "default";
  }
}

export function EmailConfig({ refresh }: EmailConfigProps) {
  const { accessToken } = useAuth();
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test email flow state
  const [recipient, setRecipient] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadConfig = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await communityApi.getAdminEmailConfig(accessToken);
    if (res.ok) {
      setConfig(res.data);
    } else {
      setError(res.error.message || "Failed to load email configuration.");
    }
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const openTestDialog = () => {
    setTestResult(null);
    setDialogOpen(true);
    // Focus is managed by ConfirmDialog on open; input focused after mount.
  };

  const handleConfirmTest = useCallback(async () => {
    if (!accessToken || !recipient.trim()) return;
    setDialogOpen(false);
    setSending(true);
    setTestResult(null);
    const res = await communityApi.postAdminEmailTest(accessToken, {
      recipient: recipient.trim(),
    });
    setSending(false);
    if (res.ok) {
      setTestResult({
        success: true,
        message: `Test email sent to ${recipient}.${res.data.messageId ? ` Provider message ID: ${res.data.messageId}` : ""}`,
      });
      void loadConfig();
    } else {
      setTestResult({
        success: false,
        message: res.error.message || "Failed to send test email.",
      });
    }
    setRecipient("");
  }, [accessToken, recipient, loadConfig]);

  if (loading) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <SectionHeading
          eyebrow="Email Configuration"
          title="Configuration Status"
          description="Email provider and sender settings."
          tag="h2"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SkeletonText lines={3} width="70%" />
          <SkeletonText lines={3} width="70%" />
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
          eyebrow="Email Configuration"
          title="Configuration Status"
          description="Email provider and sender settings."
          tag="h2"
        />
        <div className="mt-6 rounded-xl border border-destructive bg-danger-soft p-6">
          <div className="flex gap-3">
            <AlertCircle className="size-5 text-danger shrink-0" />
            <div>
              <p className="font-semibold text-danger">
                Configuration unavailable
              </p>
              <p className="type-caption mt-1 text-ink-muted">
                {missing
                  ? "The email configuration endpoint has not been implemented in the Founding Community API yet."
                  : error}
              </p>
            </div>
          </div>
        </div>
        {missing && refresh && (
          <div className="mt-6">
            <Button onClick={refresh} size="sm">
              Refresh configuration
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <SectionHeading
          eyebrow="Email Configuration"
          title="Configuration Status"
          description="Email provider and sender settings."
          tag="h2"
        />
        <p className="mt-6 type-body text-ink-muted">
          No configuration data available.
        </p>
      </div>
    );
  }

  const lastTested = config.lastTestedAt
    ? new Date(config.lastTestedAt).toLocaleString()
    : "Never";

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading
          eyebrow="Email Configuration"
          title="Configuration Status"
          description="Email provider and sender settings. Credentials are never shown in this UI."
          tag="h2"
        />
      </div>

      {/* Configuration summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-emerald-soft p-2 text-emerald shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="type-label">Email Provider</p>
              <p className="text-sm font-semibold text-ink">
                {config.provider.charAt(0).toUpperCase() + config.provider.slice(1)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-surface-raised p-2 text-ink-muted shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="type-label">Sender Address</p>
              <p className="text-sm font-semibold text-ink font-mono">
                {config.senderAddress || EMAIL_SENDER_ADDRESS}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-surface-raised p-2 text-ink-muted shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="type-label">Sender Name</p>
              <p className="text-sm font-semibold text-ink">
                {config.senderName || EMAIL_SENDER_NAME}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="type-label">Configuration Status</p>
            <p className="text-sm font-semibold text-ink">
              {config.status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
          </div>
          <Badge variant={configStatusVariant(config.status)}>
            {config.status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </Badge>
          <div className="text-[0.8125rem] text-ink-muted">
            Last successful test: <span className="font-medium">{lastTested}</span>
          </div>
        </div>
        <p className="mt-3 type-caption text-ink-muted">
          API keys and SMTP credentials are never stored or displayed in the
          frontend. All sending is handled by the protected backend.
        </p>
      </div>

      {/* Test email action */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="type-label">Test Email</p>
            <p className="text-sm text-ink-muted">
              Send a one-off test email to verify the provider integration.
              You will be asked to confirm the recipient before anything is sent.
            </p>
          </div>
          <Button
            onClick={openTestDialog}
            disabled={loading || sending}
          >
            <Mail className="size-4 shrink-0 mr-2" /> Send Test Email
          </Button>
        </div>

        {testResult && (
          <div
            className={cn(
              "mt-4 rounded-lg border p-4",
              testResult.success
                ? "border-emerald bg-emerald-soft"
                : "border-destructive bg-danger-soft"
            )}
          >
            <div className="flex gap-3">
              {testResult.success ? (
                <CheckCircle className="size-5 text-emerald shrink-0" />
              ) : (
                <AlertCircle className="size-5 text-danger shrink-0" />
              )}
              <p className={cn("text-sm", testResult.success ? "text-emerald-900" : "text-danger")}>
                {testResult.message}
              </p>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmTest}
        title="Send test email"
        description={
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink">
              Enter the recipient address for the test email. The backend will
              send the email and return the result.
            </p>
            <Field label="Recipient email address" required>
              <Input
                type="email"
                defaultValue={recipient}
                onChange={(event) => setRecipient(event.currentTarget.value)}
                placeholder="you@example.com"
                autoFocus
              />
            </Field>
          </div>
        }
        confirmLabel="Send test email"
        loading={sending}
        destructive
      />
    </div>
  );
}
