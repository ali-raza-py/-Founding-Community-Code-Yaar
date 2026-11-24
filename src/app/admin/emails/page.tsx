"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * The Email Management page has moved to the Mail Center at /admin/mail.
 * Keep the legacy route reachable (and redirect it) so any existing links or
 * bookmarks keep working instead of showing an orphaned page.
 */
export default function AdminEmailsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/admin/mail");
  }, [router]);

  return null;
}
