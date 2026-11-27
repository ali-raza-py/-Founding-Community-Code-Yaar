"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SemanticStatus =
  | "success"
  | "pending"
  | "rejected"
  | "suspended"
  | "in_progress"
  | "completed";

const STATUS_MAP: Record<string, SemanticStatus> = {
  accepted: "success",
  active: "success",
  approved: "success",
  completed: "success",
  graduated: "success",
  verified: "success",
  pending: "pending",
  under_review: "pending",
  shortlisted: "pending",
  waitlisted: "pending",
  assigned: "pending",
  in_progress: "in_progress",
  submitted: "in_progress",
  rejected: "rejected",
  overdue: "rejected",
  cancelled: "rejected",
  suspended: "suspended",
  inactive: "suspended",
};

interface StatusBadgeProps {
  status: string | null | undefined;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = (status ?? "pending").toLowerCase().replace(/\s+/g, "_");
  const semantic = STATUS_MAP[key] ?? "pending";

  const label =
    status === null || status === undefined
      ? "—"
      : String(status)
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

  return (
    <Badge
      status={semantic}
      className={cn("whitespace-nowrap", className)}
    >
      {label}
    </Badge>
  );
}
