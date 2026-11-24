"use client";

import { Suspense } from "react";

import SignInPageClient from "./client";

/**
 * Sign-in page. The client component reads `searchParams` client-side; the
 * Suspense boundary allows static prerendering (next export) without forcing
 * dynamic rendering for this route.
 */
export default function SignInPage() {
  return (
    <Suspense fallback={<p className="type-caption text-ink-muted">Loading…</p>}>
      <SignInPageClient />
    </Suspense>
  );
}
