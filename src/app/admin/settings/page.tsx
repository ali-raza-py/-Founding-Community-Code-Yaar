"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, ShieldCheck, Database } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/shared";
import { type EmailConfig } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(res.error.message || "Failed to load settings.");
    }
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const configStatusVariant = (status: EmailConfig["status"]) => {
    switch (status) {
      case "configured":
        return "emerald";
      case "misconfigured":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Settings"
        description="Platform configuration and integration status."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Settings", href: "/admin/settings" }]}
      />

      {error && (
        <ErrorState message={error} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-emerald-soft p-2 text-emerald shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="type-label">Authentication</p>
              <p className="text-sm font-semibold text-ink">Supabase Auth</p>
              <p className="type-caption mt-1 text-ink-secondary">
                Session verified against the Community API. Roles resolved server-side.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-surface-raised p-2 text-ink-muted shrink-0">
              <Database className="size-5" />
            </div>
            <div>
              <p className="type-label">Community API</p>
              <p className="text-sm font-semibold text-ink font-mono">
                {typeof window !== "undefined" && process.env.NEXT_PUBLIC_COMMUNITY_API_URL
                  ? new URL(process.env.NEXT_PUBLIC_COMMUNITY_API_URL).hostname
                  : "configured"}
              </p>
              <p className="type-caption mt-1 text-ink-secondary">
                All admin operations go through the protected backend.
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
              <p className="type-label">Email Provider</p>
              <p className="text-sm font-semibold text-ink">
                {config ? config.provider.charAt(0).toUpperCase() + config.provider.slice(1) : "—"}
              </p>
              <p className="type-caption mt-1 text-ink-secondary">
                Credentials are never shown in this UI.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="type-label">Email configuration</p>
            <h3 className="text-base font-semibold text-ink">Provider status</h3>
          </div>
          <Badge variant={configStatusVariant(config?.status ?? "not-configured")}>
            {(config?.status ?? "not-configured").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </Badge>
        </div>
        {config ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Sender address</p>
              <p className="text-sm text-ink-muted font-mono break-all">
                {config.senderAddress}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Sender name</p>
              <p className="text-sm text-ink-muted">{config.senderName}</p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="type-label mb-1">Last successful test</p>
              <p className="text-sm text-ink-muted">
                {config.lastTestedAt ? new Date(config.lastTestedAt).toLocaleString() : "Never"}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState title="No email configuration data" description="Unable to load provider status." />
        )}
        <p className="mt-6 type-caption text-ink-muted">
          API keys and SMTP credentials are never stored or displayed in the
          frontend. All sending is handled by the protected backend through
          Resend. Manage email sending in the Email workspace.
        </p>
      </div>
    </div>
  );
}
