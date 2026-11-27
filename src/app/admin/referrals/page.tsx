"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The standalone Referrals section has been removed from the Admin sidebar.
 * All referral information now lives inside Participants (each participant
 * profile shows complete referral data, and the directory can be filtered by
 * referral status). Keep /admin/referrals reachable and redirect it.
 * Existing referral tracking and attribution logic is preserved.
 */
export default function AdminReferralsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/admin/participants");
  }, [router]);

  return null;
}
