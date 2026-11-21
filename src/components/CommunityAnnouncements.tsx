"use client";

import { useEffect, useState } from "react";
import { communityApi } from "@/lib/api/client";
import type { Announcement } from "@/lib/api/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

interface CommunityAnnouncementsProps {
  accessToken: string | null;
  targetProgramId?: string;
  className?: string;
}

/** Displays published announcements fetched from the Community API.
 *
 * Requires an authenticated session (accessToken). Announcements are fetched
 * once on mount and not polled, per performance requirements.
 */
export function CommunityAnnouncements({
  accessToken,
  targetProgramId,
  className,
}: CommunityAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    let cancelled = false;

    communityApi
      .getAnnouncements(accessToken, targetProgramId)
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setAnnouncements(result.data);
        } else {
          setError(result.error.message);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Unable to load announcements.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, targetProgramId]);

  if (loading) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <p className="type-body text-ink-muted">Loading announcements…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <p className="type-body text-danger">{error}</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return null;
  }

  return (
    <section className={cn("mt-12 rounded-xl border border-line bg-surface p-6 sm:p-8", className)}>
      <SectionHeading
        eyebrow="Announcements"
        title="Community Announcements"
        description="Latest updates from the Code Yaar team."
      />
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <article
            key={announcement.id}
            className="rounded-lg border border-line bg-surface-raised p-4 sm:p-6"
          >
            <h3 className="text-sm font-semibold text-ink">{announcement.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{announcement.content}</p>
            <p className="mt-2 text-[0.75rem] text-ink-subtle">
              {new Date(announcement.created_at).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
