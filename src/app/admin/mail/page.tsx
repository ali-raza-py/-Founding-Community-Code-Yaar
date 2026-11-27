"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The Email workspace now lives at /admin/email.
 * Keep /admin/mail reachable (and redirect it) so existing links and
 * bookmarks keep working instead of showing an orphaned page.
 * The email backend integration is unchanged.
 */
export default function AdminMailRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/admin/email");
  }, [router]);

  return null;
}
