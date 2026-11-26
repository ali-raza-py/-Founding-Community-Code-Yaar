"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { EMPTY_APPLICATION, REVIEW_GROUPS } from "@/lib/application";
import { clearDraft, loadDraft, markSubmittedThisSession, saveDraft } from "@/lib/draft";
import { communityApi } from "@/lib/api/client";
import { COUNTRIES, APPLYING_FOR_OPTIONS, EDUCATION_LEVELS, EXPERIENCE_LEVELS, WEEKLY_TIME_OPTIONS, PRIVACY_CONSENT_TEXT, TOTAL_STEPS, STEP_LABELS } from "@/lib/constants";
import { personalInformationSchema, educationSchema, programmingBackgroundSchema, motivationSchema } from "@/lib/validation";
import { extractReferralCode, COHORT_REFERRAL_KEY } from "@/lib/referral";
import { type ApplicationData, type SubmissionStatus, type SubmissionFailureReason } from "@/types/application";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const STEP_SCHEMAS = {
  1: personalInformationSchema,
  2: educationSchema,
  3: programmingBackgroundSchema,
  4: motivationSchema,
} as const;

function emptyStatus(): SubmissionStatus {
  return { state: "idle" };
}

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<ApplicationData>(EMPTY_APPLICATION);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>(emptyStatus);
  const [consent, setConsent] = useState(false);

  // Referral attribution state. An applicant arriving through a valid referral
  // link sees the ambassador's name (confirmed server-side). Without a link,
  // they may optionally enter an ambassador name manually (unconfirmed).
  const [referredByAmbassador, setReferredByAmbassador] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [referralLookupState, setReferralLookupState] = useState<
    "idle" | "checking" | "resolved" | "invalid"
  >("idle");
  const [manualReferredByName, setManualReferredByName] = useState("");
  const [referralWarning, setReferralWarning] = useState("");

  const submissionIdRef = useRef<string>(crypto.randomUUID());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnstileWidgetRef = useRef<number | null>(null);
  const [turnstileContainer, setTurnstileContainer] = useState<HTMLDivElement | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const programId = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_PROGRAM_ID_FOUNDING_COHORT ?? "")
    : "";
  const turnstileSiteKey = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "")
    : "";

  // Load Turnstile script on mount.
  useEffect(() => {
    if (!turnstileSiteKey || typeof window === "undefined") return;
    const scriptId = "codeyaar-turnstile";
    const existing = document.getElementById(scriptId);
    if (existing) {
      setTimeout(() => setTurnstileReady(true), 0);
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileReady(true);
    script.onerror = () => setTurnstileReady(false);
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  // Render Turnstile widget when ready.
  useEffect(() => {
    if (!turnstileContainer || !turnstileReady || !turnstileSiteKey || typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const turnstile = (window as any).turnstile;
    if (!turnstile) return;
    const widgetId = turnstile.render(turnstileContainer, {
      sitekey: turnstileSiteKey,
      callback: (token: string) => {
        setTurnstileToken(token);
      },
      "expired-callback": () => {
        setTurnstileToken(null);
      },
    });
    turnstileWidgetRef.current = widgetId;
    return () => {
      try {
        turnstile.remove(widgetId);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [turnstileContainer, turnstileReady, turnstileSiteKey]);

  // Reset the Turnstile widget and clear any held token so the next attempt
  // requires a fresh challenge (Turnstile tokens are single-use and expire).
  const resetTurnstile = useCallback(() => {
    const turnstile = (window as any).turnstile;
    if (turnstile && turnstileWidgetRef.current != null) {
      try {
        turnstile.reset(turnstileWidgetRef.current);
      } catch {
        // Ignore reset failures; the token is cleared regardless.
      }
    }
    setTurnstileToken(null);
  }, []);

  // Load saved draft on mount so applicants can resume where they left off.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = loadDraft();
    if (saved) {
      setValues((prev) => saved);
    }
  }, []);

  // Debounced auto-save: persist form values ~800ms after the last input change.
  // Never auto-submits; only writes the draft to localStorage.
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    const hasAnyValue = Object.values(values).some(
      (v) => v !== "" && v !== 0 && v !== null,
    );
    if (!hasAnyValue) return;

    saveTimerRef.current = setTimeout(() => {
      setSaveStatus("saving");
      try {
        saveDraft(values);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [values]);

  // Cleanup pending timer on unmount.
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Read referral code from URL during render (no effect needed).
  const refFromUrl = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("ref")
    : null;
  const storedRef = typeof window !== "undefined"
    ? (() => { try { return window.sessionStorage.getItem(COHORT_REFERRAL_KEY); } catch { return null; } })()
    : null;
  const referralCode = useMemo(() => {
    if (refFromUrl) {
      const code = extractReferralCode(refFromUrl);
      if (code) {
        try { window.sessionStorage.setItem(COHORT_REFERRAL_KEY, code); } catch {}
        return code;
      }
    }
    return storedRef;
  }, [refFromUrl, storedRef]);

  // Validate a referral code from the URL (or session storage) on mount. A
  // valid code resolves to the ambassador's name, which is shown to the
  // applicant before submission. An invalid code is cleared so the applicant
  // applies directly rather than submitting an unverified claim.
  useEffect(() => {
    if (typeof window === "undefined" || !referralCode) return;
    setReferralLookupState("checking");
    communityApi
      .getReferralLookup(referralCode)
      .then((res) => {
        if (res.ok && res.data?.valid && res.data.ambassador?.name) {
          setReferredByAmbassador({ code: referralCode, name: res.data.ambassador.name });
          setReferralLookupState("resolved");
        } else {
          setReferralLookupState("invalid");
          setReferralWarning(
            "That referral link is invalid or the ambassador is no longer active. You can still apply directly."
          );
        }
      })
      .catch(() => {
        setReferralLookupState("invalid");
        setReferralWarning(
          "Unable to verify the referral link. You can still apply directly."
        );
      });
  }, [referralCode, communityApi]);

  const setField = useCallback((key: keyof ApplicationData, value: string | number) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const validateStep = useCallback((stepNumber: number): boolean => {
    const schema = STEP_SCHEMAS[stepNumber as keyof typeof STEP_SCHEMAS];
    if (!schema) return true;
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Record<string, string[]> = {};
    for (const [key, issue] of Object.entries(result.error.flatten().fieldErrors || {})) {
      if (issue) next[key] = issue;
    }
    setErrors(next);
    return false;
  }, [values]);

  const canAdvance = useCallback(() => validateStep(step), [step, validateStep]);

  const goTo = useCallback((nextStep: number) => {
    setSubmitError(null);
    if (nextStep > step && !canAdvance()) return;
    setStep(nextStep);
  }, [step, canAdvance]);

  const reviewValues = useMemo(() => {
    const groups: { step: number; title: string; items: { label: string; value: string }[] }[] = [];
    for (const group of REVIEW_GROUPS) {
      const items = group.fields.map((field: { key: keyof ApplicationData; label: string }) => ({
        label: field.label,
        value: values[field.key] == null ? "" : String(values[field.key]),
      }));
      groups.push({ step: group.step, title: group.title, items });
    }
    return groups;
  }, [values]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setSubmitError(null);

      let valid = true;
      for (const stepNumber of [1, 2, 3, 4]) {
        if (!validateStep(stepNumber)) valid = false;
      }
      if (!valid) {
        setStep(1);
        return;
      }
      if (!consent) {
        setSubmitError("Please accept the privacy consent to submit.");
        return;
      }

      // Validate Turnstile token is present before submission.
      if (!turnstileToken) {
        setSubmitError(
          "Please complete the security verification before submitting.",
        );
        return;
      }

      // Verify the program is configured.
      if (!programId) {
        setSubmitError(
          "Application submission is not configured — please contact the Code Yaar team.",
        );
        return;
      }

      // Build the backend-compatible submission payload.
      const applicationAnswers: Record<string, string> = {
        age: String(values.age ?? ""),
        educationLevel: String(values.educationLevel ?? ""),
        fieldOfStudy: String(values.fieldOfStudy ?? ""),
        yearOrGrade: String(values.yearOrGrade ?? ""),
        experienceLevel: String(values.experienceLevel ?? ""),
        languages: String(values.languages ?? ""),
        previousProjects: String(values.previousProjects ?? ""),
        github: String(values.github ?? ""),
        linkedin: String(values.linkedin ?? ""),
        portfolio: String(values.portfolio ?? ""),
        motivation: String(values.motivation ?? ""),
        learningGoals: String(values.learningGoals ?? ""),
        contribution: String(values.contribution ?? ""),
        weeklyTime: String(values.weeklyTime ?? ""),
        preferredLanguage: String(values.preferredLanguage ?? ""),
        timezone: String(values.timezone ?? ""),
        applyingFor: String(values.applyingFor ?? ""),
      };

      const request = {
        program_id: programId,
        applicant_name: values.fullName,
        email: values.email,
        phone: "",
        institution: values.institution,
        city: values.city,
        application_answers: applicationAnswers,
        // Only a server-validated referral code creates confirmed attribution.
        referral_code: referredByAmbassador?.code ?? "",
        // Manual entry without a validated link is recorded as a note, not
        // confirmed ambassador attribution.
        referred_by_name: referredByAmbassador ? "" : manualReferredByName.trim(),
        turnstile_token: turnstileToken ?? "",
        idempotency_key: submissionIdRef.current,
      };

      setStatus({ state: "submitting" });

      // Prefer the Community API when configured; fall back to legacy adapter.
      if (communityApi.isConfigured()) {
        const result = await communityApi.submitApplication(request);

        if (result.ok) {
          markSubmittedThisSession();
          clearDraft();
          setTurnstileToken(null);
          setStatus({ state: "success", reference: result.data.id ?? null });
        } else {
            const err = result.error;
            let message = "Unable to submit your application. Please try again.";
            if (err.reason === "not-configured") {
              message =
                "Application submission is not configured on this site yet — please try again later or contact the Code Yaar team.";
            } else if (err.reason === "timeout") {
              message = "The request timed out. Please try again.";
            } else if (err.reason === "network") {
              message = "Network error. Please check your connection and try again.";
            } else if (err.reason === "conflict") {
              message =
                "You have already submitted an application to this program. Duplicate submissions are not allowed.";
            } else if (err.reason === "unauthorized") {
              message =
                "Your session is not authorized. Please sign in and try again.";
            } else if (err.reason === "forbidden") {
              message =
                "You are not permitted to perform this action.";
            } else if (err.reason === "bot-verification") {
              message = err.message;
            } else if (err.reason === "validation") {
              message =
                `Validation error: ${err.message}. Please check your entries and try again.`;
            } else if (err.reason === "rate-limited") {
              message =
                "Too many submission attempts. Please wait a moment and try again.";
            } else if (err.reason === "server") {
              message = err.message
                ? `Server error: ${err.message}`
                : `Server error${err.status != null ? ` (HTTP ${err.status})` : ""}. Please try again later.`;
            }
            setSubmitError(message);
            // Turnstile tokens are single-use: reset the widget so a retry
            // requires a fresh challenge instead of resending a used token.
            resetTurnstile();
            const legacyReason: SubmissionFailureReason =
              err.reason === "network" || err.reason === "timeout"
                ? err.reason
                : err.reason === "server" || err.reason === "rate-limited"
                  ? "server"
                  : "rejected";
            setStatus({ state: "error", reason: legacyReason, status: err.status });
          }
      }
    },
    [
      values,
      consent,
      validateStep,
      referredByAmbassador,
      manualReferredByName,
      programId,
    ]
  );

  const resetForm = useCallback(() => {
    setValues(EMPTY_APPLICATION);
    setErrors({});
    setSubmitError(null);
    setStatus(emptyStatus());
    setStep(1);
    submissionIdRef.current = crypto.randomUUID();
    setConsent(false);
    clearDraft();
  }, []);

  const alreadySubmitted =
    typeof window !== "undefined" &&
    window.sessionStorage.getItem("codeyaar.first100.submitted.v1") === "true";

  if (alreadySubmitted) {
    return (
      <Section padded>
        <SectionInner className="text-center">
          <div className="mx-auto max-w-[42rem]">
            <h2 className="mb-4">Application submitted</h2>
            <p className="type-body mb-8">
              Thank you — your application to The First 100 has been received
              in this session. It will be reviewed by the Code Yaar team and
              you will be contacted by email with the outcome.
            </p>
            <Link
              href="/apply"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Submit another application
            </Link>
          </div>
        </SectionInner>
      </Section>
    );
  }

  const stepLabel = STEP_LABELS[step - 1];

  return (
    <Section padded>
      <SectionInner className="max-w-[60rem]">
        <div className="mb-10">
          <p className="type-label mb-1">Application</p>
          <h2 className="mb-2">Apply to The First 100</h2>
          <p className="type-body-muted">
            Five steps, about ten minutes. You can save and return — your
            answers stay in your browser until you submit.
          </p>
        </div>

        {saveStatus !== "idle" && (
          <div className="mb-6 rounded-lg border border-line bg-surface p-3 flex items-center gap-3">
            {saveStatus === "saving" && (
              <span className="text-[0.75rem] text-ink-muted flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2 border-emerald border-t-transparent rounded-full animate-spin"></span>
                Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-[0.75rem] text-emerald flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2 border-emerald border-t-emerald rounded-full"></span>
                All changes saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-[0.75rem] text-danger flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2 border-danger border-t-danger rounded-full"></span>
                Unable to save. Retrying…
              </span>
            )}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="type-small">Step {step} of {TOTAL_STEPS}</span>
              <span className="type-small font-semibold">{stepLabel}</span>
            </div>
            <div className="w-full bg-line rounded-full h-1.5">
              <div
                className="bg-emerald h-1.5 rounded-full transition-all duration-300"
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {STEP_LABELS.map((label, index) => (
                <span
                  key={label}
                  className={cn(
                    "text-[0.75rem] font-medium transition-colors duration-200",
                    index + 1 < step
                      ? "text-emerald"
                      : index + 1 === step
                        ? "text-ink font-semibold"
                        : "text-ink-subtle",
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {step === 1 && (
            <>
              <Field label="Full name" required error={errors.fullName?.[0]}>
                <Input
                  placeholder="Jane Smith"
                  value={values.fullName}
                  onChange={(e) => setField("fullName", e.currentTarget.value)}
                  required
                />
              </Field>
              <Field label="Email address" required error={errors.email?.[0]}>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) => setField("email", e.currentTarget.value)}
                  required
                  autoComplete="email"
                />
              </Field>
              {referredByAmbassador ? (
                <div className="mb-6 rounded-lg border border-emerald bg-emerald-soft p-4">
                  <p className="type-label mb-1">Referred by ambassador</p>
                  <p className="text-sm font-semibold text-ink">
                    {referredByAmbassador.name}
                  </p>
                  <p className="type-caption mt-1 text-ink-muted">
                    Confirmed — your application will be attributed to this ambassador.
                  </p>
                </div>
              ) : referralLookupState === "invalid" ? (
                <div className="mb-6 rounded-lg border border-danger-soft bg-danger-soft p-4">
                  <p className="type-sm text-danger">{referralWarning}</p>
                </div>
              ) : (
                <Field label="Referred by ambassador name (optional)">
                  <Input
                    placeholder="Ambassador who referred you"
                    value={manualReferredByName}
                    onChange={(e) => setManualReferredByName(e.currentTarget.value)}
                  />
                  <p className="type-caption mt-1">
                    Leave blank if you are applying directly. A name entered
                    here is recorded as a note and is not confirmed attribution
                    unless you arrived through a valid referral link.
                  </p>
                </Field>
              )}
              <Field label="Country" required error={errors.country?.[0]}>
                <Select
                  value={values.country}
                  onChange={(e) => setField("country", e.currentTarget.value)}
                  required
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="City" required error={errors.city?.[0]}>
                <Input
                  placeholder="Karachi"
                  value={values.city}
                  onChange={(e) => setField("city", e.currentTarget.value)}
                  required
                />
              </Field>
              <Field label="Region / state" error={errors.region?.[0]}>
                <Input
                  placeholder="Sindh (optional)"
                  value={values.region}
                  onChange={(e) => setField("region", e.currentTarget.value)}
                />
              </Field>
              <Field label="Age" required error={errors.age?.[0]}>
                <Input
                  type="number"
                  min="13"
                  max="120"
                  placeholder="Enter your age"
                  value={values.age}
                  onChange={(e) => setField("age", Number(e.currentTarget.value) || "")}
                  required
                />
                <p className="type-caption">
                  You must be at least 13 years old to apply.
                </p>
              </Field>
              <Field
                label="What are you applying for?"
                required
                error={errors.applyingFor?.[0]}
              >
                <Select
                  value={values.applyingFor}
                  onChange={(e) => setField("applyingFor", e.currentTarget.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {APPLYING_FOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Education level" required error={errors.educationLevel?.[0]}>
                <Select
                  value={values.educationLevel}
                  onChange={(e) => setField("educationLevel", e.currentTarget.value)}
                  required
                >
                  <option value="">Select your education level</option>
                  {EDUCATION_LEVELS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="School / college / university" error={errors.institution?.[0]}>
                <Input
                  placeholder="Optional"
                  value={values.institution}
                  onChange={(e) => setField("institution", e.currentTarget.value)}
                />
              </Field>
              <Field label="Field of study" error={errors.fieldOfStudy?.[0]}>
                <Input
                  placeholder="Optional"
                  value={values.fieldOfStudy}
                  onChange={(e) => setField("fieldOfStudy", e.currentTarget.value)}
                />
              </Field>
              <Field label="Current year or stage" required error={errors.yearOrGrade?.[0]}>
                <Input
                  placeholder="e.g. 2nd year, self-taught year 1"
                  value={values.yearOrGrade}
                  onChange={(e) => setField("yearOrGrade", e.currentTarget.value)}
                  required
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Experience level" required error={errors.experienceLevel?.[0]}>
                <Select
                  value={values.experienceLevel}
                  onChange={(e) => setField("experienceLevel", e.currentTarget.value)}
                  required
                >
                  <option value="">Select your experience level</option>
                  {EXPERIENCE_LEVELS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Languages and technologies" required error={errors.languages?.[0]} hint="HTML, CSS, Python, JavaScript… or write “None yet”.">
                <Textarea rows={3} value={values.languages} onChange={(e) => setField("languages", e.currentTarget.value)} required />
              </Field>
              <Field label="Previous projects" error={errors.previousProjects?.[0]}>
                <Textarea rows={3} placeholder="Optional — links or descriptions of anything you have built." value={values.previousProjects} onChange={(e) => setField("previousProjects", e.currentTarget.value)} />
              </Field>
              <Field label="GitHub" error={errors.github?.[0]}>
                <Input placeholder="https://github.com/username" value={values.github} onChange={(e) => setField("github", e.currentTarget.value)} />
                <p className="type-caption">Optional — not used to filter applicants.</p>
              </Field>
              <Field label="LinkedIn" error={errors.linkedin?.[0]}>
                <Input placeholder="https://linkedin.com/in/username" value={values.linkedin} onChange={(e) => setField("linkedin", e.currentTarget.value)} />
                <p className="type-caption">Optional — not used to filter applicants.</p>
              </Field>
              <Field label="Portfolio" error={errors.portfolio?.[0]}>
                <Input placeholder="https://example.com" value={values.portfolio} onChange={(e) => setField("portfolio", e.currentTarget.value)} />
                <p className="type-caption">Optional — not used to filter applicants.</p>
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <Field label="Why do you want to join The First 100?" required error={errors.motivation?.[0]} hint="At least 80 characters. Tell us what draws you to this community.">
                <Textarea rows={5} value={values.motivation} onChange={(e) => setField("motivation", e.currentTarget.value)} required />
              </Field>
              <Field label="What do you hope to learn?" required error={errors.learningGoals?.[0]} hint="At least 40 characters.">
                <Textarea rows={4} value={values.learningGoals} onChange={(e) => setField("learningGoals", e.currentTarget.value)} required />
              </Field>
              <Field label="What could you contribute?" required error={errors.contribution?.[0]} hint="At least 40 characters.">
                <Textarea rows={4} value={values.contribution} onChange={(e) => setField("contribution", e.currentTarget.value)} required />
              </Field>
              <Field label="Weekly availability" required error={errors.weeklyTime?.[0]}>
                <Select value={values.weeklyTime} onChange={(e) => setField("weeklyTime", e.currentTarget.value)} required>
                  <option value="">Select your availability</option>
                  {WEEKLY_TIME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Preferred communication language" required error={errors.preferredLanguage?.[0]}>
                <Input placeholder="e.g. English" value={values.preferredLanguage} onChange={(e) => setField("preferredLanguage", e.currentTarget.value)} required />
                <p className="type-caption">Collected to plan support — never used to filter applicants.</p>
              </Field>
              <Field label="Time zone" required error={errors.timezone?.[0]}>
                <Input placeholder="e.g. Asia/Karachi (UTC+5)" value={values.timezone} onChange={(e) => setField("timezone", e.currentTarget.value)} required />
              </Field>
            </>
          )}

          {step === 5 && (
            <>
              <div className="space-y-6">
                {reviewValues.map((group) => (
                  <section key={group.step} className="border border-line rounded-lg p-5">
                    <p className="type-label mb-3">{group.title}</p>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <div key={item.label} className="flex justify-between items-baseline gap-3">
                          <span className="text-sm text-ink-muted">{item.label}</span>
                          <span className="font-mono text-ink truncate max-w-[22rem]">{item.value || "—"}</span>
                          <button
                            type="button"
                            onClick={() => setStep(group.step)}
                            className="text-[0.8125rem] text-emerald hover:underline font-medium p-1"
                          >
                            Edit
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
                <Field className="flex items-start gap-2">
                  <input
                    id="consent"
                    type="checkbox"
                    className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
                    checked={consent}
                    onChange={(e) => setConsent(e.currentTarget.checked)}
                    required
                  />
                  <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer text-ink">
                    {PRIVACY_CONSENT_TEXT} <Link href="/privacy" className="text-emerald underline underline-offset-2 hover:text-emerald-hover">Read the privacy information</Link>.
                  </label>
                </Field>
              </div>
            </>
          )}

          {status.state === "submitting" && (
            <div className="flex items-center gap-3 py-4">
              <span className="font-mono flex h-5 w-5 shrink-0">⟳</span>
              <span className="type-body">Submitting your application…</span>
            </div>
          )}
          {status.state === "success" && (
            <div className="rounded-lg border border-line bg-success-soft p-6 text-center">
              <p className="text-sm font-semibold text-success">
                Application received
              </p>
              {status.reference && (
                <p className="mt-1 type-small text-ink-muted">
                  Reference: <span className="font-mono">{status.reference}</span>
                </p>
              )}
              {referredByAmbassador ? (
                <p className="mt-4 type-small text-ink-muted">
                  Referred by ambassador:{" "}
                  <span className="font-mono text-emerald">{referredByAmbassador.name}</span>
                </p>
              ) : referralCode && !referredByAmbassador ? (
                <p className="mt-4 type-small text-ink-muted">
                  Referred by code:{" "}
                  <span className="font-mono text-emerald">{referralCode}</span>
                </p>
              ) : null}
              <p className="mt-6 type-body">
                Thank you for applying to The First 100. Your application will
                be reviewed by the Code Yaar team, and you will be contacted by
                email with the outcome.
              </p>
            </div>
          )}
          {status.state === "error" && (
            <div className="rounded-lg border border-danger-soft bg-danger-soft p-6">
              <p className="text-sm font-semibold text-danger">
                Submission failed
              </p>
              <p className="mt-1 type-body">{submitError}</p>
              <Button type="button" onClick={() => {
                setSubmitError(null);
                setStatus({ state: "submitting" });
                void handleSubmit({ preventDefault: () => {} } as unknown as React.FormEvent);
              }}>
                Retry
              </Button>
            </div>
          )}
          {submitError && status.state === "idle" && (
            <div className="rounded-lg border border-danger-soft bg-danger-soft p-6">
              <p className="text-sm font-semibold text-danger">{submitError}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-end mt-6 sm:mt-10">
            {step > 1 && (
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(step - 1);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                Back
              </Link>
            )}
            {step < 5 ? (
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(step + 1);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                Continue
              </Link>
            ) : (
              <>
                {!turnstileSiteKey ? (
                  <div className="mb-4 p-4 rounded-lg border border-line bg-surface-raised">
                    <p className="type-caption text-danger mb-2">
                      Turnstile site key not configured — submission disabled.
                    </p>
                    <p className="type-caption text-ink-muted">
                      Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your deployment
                      environment and redeploy.
                    </p>
                  </div>
                ) : turnstileReady ? (
                  <>
                    <div
                      ref={setTurnstileContainer}
                      className="mb-4"
                      aria-label="Turnstile bot protection"
                    />
                    {!turnstileToken && (
                      <p className="mb-2 type-caption text-ink-muted">
                        Please complete the security verification before
                        submitting.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mb-2 type-caption text-ink-muted">
                    Security verification is loading. Please wait before
                    submitting.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={
                    status.state === "submitting" || !turnstileToken
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 hover:bg-emerald-hover:not(:disabled) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                >
                  {status.state === "submitting" ? "Submitting…" : "Submit application"}
                </button>
              </>
            )}
          </div>
        </form>

        <p className="mt-10 type-caption text-center">
          Applications are reviewed by people, not algorithms. Places are
          limited to one hundred founding members. Submission endpoint:
          {communityApi.isConfigured()
            ? "configured — submitted to Code Yaar Community API"
            : "not configured — submissions disabled"}.
        </p>
      </SectionInner>
    </Section>
  );
}
