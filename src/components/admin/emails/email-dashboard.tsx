"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Mail, Percent, TrendingUp, AlertCircle } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/admin/shared";
import { type EmailStats } from "@/lib/api/types";
import { Skeleton, SkeletonText } from "./skeleton";

interface EmailDashboardProps {
  refresh?: () => void;
}

const CARD_SPECS: Array<{
  key: keyof EmailStats;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  label: string;
}> = [
  {
    key: "total",
    title: "Total Emails Sent",
    subtitle: "All emails dispatched via the provider",
    icon: Mail,
    label: "Total sent",
  },
  {
    key: "accepted",
    title: "Accepted by Provider",
    subtitle: "Resend accepted the request — not yet delivered",
    icon: TrendingUp,
    label: "Accepted",
  },
  {
    key: "delivered",
    title: "Delivered",
    subtitle: "Provider confirmed delivery to the inbox",
    icon: Activity,
    label: "Delivered",
  },
  {
    key: "failed",
    title: "Failed",
    subtitle: "Provider reported a delivery failure",
    icon: AlertCircle,
    label: "Failed",
  },
  {
    key: "pending",
    title: "Pending",
    subtitle: "Email has not reached a final status",
    icon: Percent,
    label: "Pending",
  },
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function ActivityChart({ activity }: { activity: EmailStats["activity"] }) {
  const hasData = activity.length > 0;
  const maxSent = hasData
    ? Math.max(...activity.map((point) => point.sent))
    : 0;
  const barHeight = hasData ? 120 : 0;

  if (!hasData) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 text-center">
        <p className="type-body text-ink-muted">No activity data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <SectionHeading
        eyebrow="Email Activity"
        title="Activity Over Time"
        description="Emails sent per day, from actual provider data."
        tag="h3"
      />
      <div className="mt-4 flex items-end gap-2 h-48">
        {activity.map((point) => {
          const percent = maxSent > 0 ? (point.sent / maxSent) * 100 : 0;
          return (
            <div
              key={point.date}
              className="flex flex-1 flex-col items-end gap-1"
            >
              <svg
                className="w-full h-full block"
                viewBox={`0 0 100 ${barHeight}`}
                preserveAspectRatio="none"
              >
                <rect
                  width="100%"
                  height={Math.max(percent, 8)}
                  y={100 - Math.max(percent, 8)}
                  fill="var(--color-emerald)"
                  rx="2"
                />
              </svg>
              <span className="text-[0.75rem] text-ink-muted">
                {formatDate(point.date)}
              </span>
              <span className="text-[0.75rem] font-mono text-ink">
                {point.sent}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-3.5 text-emerald" />
          <span className="text-ink-muted">Total this period</span>
          <span className="ml-auto font-semibold text-ink">
            {activity.reduce((sum, p) => sum + p.sent, 0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3.5 text-emerald text-emerald" />
          <span className="text-ink-muted">Delivered this period</span>
          <span className="ml-auto font-semibold text-ink">
            {activity.reduce((sum, p) => sum + p.delivered, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function EmailDashboard({ refresh }: EmailDashboardProps) {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; reason: string } | null>(
    null
  );

  const loadStats = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await communityApi.getAdminEmailStats(accessToken);
    if (res.ok) {
      setStats(res.data);
    } else {
      setError({
        message: res.error.message,
        reason: res.error.reason,
      });
    }
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <Skeleton width="40%" height="1rem" />
            <Skeleton width="60%" height="1.5rem" className="mt-2" />
          </div>
        ))}
        <div className="rounded-xl border border-line bg-surface p-6">
          <SkeletonText lines={4} />
        </div>
      </div>
    );
  }

  // The email backend endpoints do not exist yet. Be honest about it instead
  // of rendering made-up statistics.
  if (error) {
    const unavailable =
      error.reason === "not-configured" || error.reason === "not-found";
    return (
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <SectionHeading
          eyebrow="Email Overview"
          title="Email Statistics"
          description="Summary metrics from the email provider."
          tag="h2"
        />
        <div className="mt-8 rounded-xl border border-destructive bg-danger-soft p-6">
          <div className="flex gap-3">
            <AlertCircle className="size-5 text-danger shrink-0" />
            <div>
              <p className="font-semibold text-danger">Email statistics unavailable</p>
              <p className="type-caption mt-1 text-ink-muted">
                {unavailable
                  ? "The email management endpoints have not been implemented in the Founding Community API yet. Statistics will appear here once the backend email endpoints are deployed."
                  : error.message}
              </p>
            </div>
          </div>
        </div>
        {unavailable && refresh && (
          <div className="mt-6">
            <Button onClick={refresh} size="sm">
              Refresh statistics
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 text-center">
        <p className="type-body text-ink-muted">No email statistics available.</p>
      </div>
    );
  }

  const sent = stats.total;
  const accepted = stats.accepted;
  const delivered = stats.delivered;
  const failed = stats.failed;
  const pending = stats.pending;
  const successRate =
    sent > 0 ? Math.round((delivered / sent) * 100) : 0;
  const failureRate =
    sent > 0 ? Math.round((failed / sent) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <SectionHeading
          eyebrow="Email Overview"
          title="Email Statistics"
          description="Summary metrics from the email provider."
          tag="h2"
        />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARD_SPECS.map((spec) => {
          let value: number | string = 0;
          switch (spec.key) {
            case "total":
              value = sent;
              break;
            case "accepted":
              value = accepted;
              break;
            case "delivered":
              value = delivered;
              break;
            case "failed":
              value = failed;
              break;
            case "pending":
              value = pending;
              break;
          }
          return (
            <StatCard
              key={spec.key}
              title={spec.title}
              value={value}
              subtitle={spec.subtitle}
            />
          );
        })}
      </div>

      {/* Rates */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Delivery Success Rate"
          value={`${successRate}%`}
          subtitle={
            sent > 0
              ? `${delivered} of ${sent} emails delivered by the provider`
              : "No emails sent yet"
          }
        />
        <StatCard
          title="Failure Rate"
          value={`${failureRate}%`}
          subtitle={
            sent > 0
              ? `${failed} of ${sent} emails failed delivery`
              : "No emails sent yet"
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityChart activity={stats.activity} />
      </div>
    </div>
  );
}
