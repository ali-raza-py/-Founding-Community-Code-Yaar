"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { FormEvent } from "react";

import { FormProgress } from "@/components/apply/form-progress";
import { ReviewStep } from "@/components/apply/review-step";
import { StepNavigation } from "@/components/apply/step-navigation";
import { StepEducation } from "@/components/apply/steps/step-education";
import { StepMotivation } from "@/components/apply/steps/step-motivation";
import { StepPersonal } from "@/components/apply/steps/step-personal";
import { StepProgramming } from "@/components/apply/steps/step-programming";
import {
  SubmissionError,
  SubmissionSuccess,
} from "@/components/apply/submission-status";
import { Button } from "@/components/ui/button";
import { EMPTY_APPLICATION } from "@/lib/application";
import { FORM_VERSION, STEP_LABELS, TOTAL_STEPS } from "@/lib/constants";
import {
  clearDraft,
  getDraftSnapshot,
  getServerDraftSnapshot,
  markSubmittedThisSession,
  saveDraft,
  subscribeToDraft,
  wasSubmittedThisSession,
} from "@/lib/draft";
import {
  IS_SUBMISSION_CONFIGURED,
  submitApplication,
} from "@/lib/submission";
import {
  educationSchema,
  motivationSchema,
  personalInformationSchema,
  programmingBackgroundSchema,
} from "@/lib/validation";
import type {
  ApplicationData,
  FieldErrors,
  SubmissionStatus,
} from "@/types/application";

const STEP_META = [
  {
    title: "Personal information",
    description:
      "Basic details so we can identify your application and reply to you. Nothing here is shared publicly.",
  },
  {
    title: "Education",
    description:
      "Where you are in your studies right now. There is no preferred path — school, university, bootcamp and self-taught answers are all normal.",
  },
  {
    title: "Programming background",
    description:
      "We ask about experience so the cohort is not built only for people who are already confident. Writing “None yet” is a complete answer.",
  },
  {
    title: "Motivation and contribution",
    description:
      "This is the part we read most carefully. Specific and honest is better than polished.",
  },
  {
    title: "Review and submit",
    description:
      "One last look. Use the edit links if something needs changing.",
  },
] as const;

const STEP_SCHEMAS = [
  personalInformationSchema,
  educationSchema,
  programmingBackgroundSchema,
  motivationSchema,
] as const;

function collectErrors(result: {
  success: boolean;
  error?: { issues: { path: PropertyKey[]; message: string }[] };
}): FieldErrors {
  const errors: FieldErrors = {};
  if (result.success || !result.error) return errors;
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function validateStep(step: number, values: ApplicationData): FieldErrors {
  const schema = STEP_SCHEMAS[step - 1];
  if (!schema) return {};
  return collectErrors(schema.safeParse(values));
}

function createSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const subscribeToSession = () => () => {};

export function ApplicationForm() {
  /* Drafts live outside React, so read them as an external store. The first
   * client render still uses the server snapshot, which keeps hydration safe. */
  const draft = useSyncExternalStore(
    subscribeToDraft,
    getDraftSnapshot,
    getServerDraftSnapshot,
  );
  const submittedInSession = useSyncExternalStore(
    subscribeToSession,
    wasSubmittedThisSession,
    () => false,
  );

  const [override, setOverride] = useState<ApplicationData | null>(null);
  const [draftDismissed, setDraftDismissed] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | undefined>();
  const [status, setStatus] = useState<SubmissionStatus>({ state: "idle" });

  const values = override ?? draft ?? EMPTY_APPLICATION;
  const draftRestored = draft !== null && !draftDismissed;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const submissionIdRef = useRef<string | null>(null);
  const skipHeadingFocus = useRef(true);

  // Best-effort draft saving, debounced so typing does not hit storage per key.
  useEffect(() => {
    if (override === null) return;
    const timer = window.setTimeout(() => saveDraft(override), 500);
    return () => window.clearTimeout(timer);
  }, [override]);

  // Move focus to the step heading after navigation, respecting reduced motion.
  useEffect(() => {
    if (skipHeadingFocus.current) {
      skipHeadingFocus.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    formRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [step]);

  const handleChange = useCallback(
    (field: keyof ApplicationData, value: string) => {
      setOverride((previous) => ({
        ...(previous ?? values),
        [field]: value,
      }));
      setErrors((previous) => {
        if (!previous[field]) return previous;
        const next = { ...previous };
        delete next[field];
        return next;
      });
    },
    [values],
  );

  const focusField = useCallback((field: string) => {
    const element = document.getElementById(field);
    if (element instanceof HTMLElement) {
      element.focus({ preventScroll: false });
    }
  }, []);

  const goToStep = useCallback((target: number) => {
    setErrors({});
    setStep(target);
  }, []);

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(step, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const firstField = Object.keys(stepErrors)[0];
      if (firstField) window.requestAnimationFrame(() => focusField(firstField));
      return;
    }
    setErrors({});
    saveDraft(values);
    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  }, [step, values, focusField]);

  const handleBack = useCallback(() => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 1));
  }, []);

  const submit = useCallback(async () => {
    // Validate every step so a stale review cannot submit invalid data.
    for (let index = 1; index <= STEP_SCHEMAS.length; index += 1) {
      const stepErrors = validateStep(index, values);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setStep(index);
        const firstField = Object.keys(stepErrors)[0];
        if (firstField) window.requestAnimationFrame(() => focusField(firstField));
        return;
      }
    }

    if (!consent) {
      setConsentError("You need to agree before the application can be sent.");
      return;
    }
    setConsentError(undefined);

    if (!IS_SUBMISSION_CONFIGURED) {
      setStatus({ state: "error", reason: "not-configured" });
      return;
    }

    submissionIdRef.current ??= createSubmissionId();
    setStatus({ state: "submitting" });

    const result = await submitApplication({
      submissionId: submissionIdRef.current,
      formVersion: FORM_VERSION,
      submittedAt: new Date().toISOString(),
      application: values,
    });

    if (result.ok) {
      clearDraft();
      markSubmittedThisSession();
      setDraftDismissed(true);
      setStatus({ state: "success", reference: result.reference });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setStatus({ state: "error", reason: result.reason, status: result.status });
  }, [values, consent, focusField]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  const isSubmitting = status.state === "submitting";
  const meta = STEP_META[step - 1];
  const errorCount = Object.keys(errors).length;
  const showSuccess = status.state === "success" || submittedInSession;

  const resetEverything = () => {
    clearDraft();
    setOverride(EMPTY_APPLICATION);
    setDraftDismissed(true);
    setStep(1);
    setErrors({});
    setConsent(false);
    setConsentError(undefined);
    setStatus({ state: "idle" });
  };

  return (
    <div ref={formRef} id="application-form" className="scroll-mt-24">
      {showSuccess ? (
        <SubmissionSuccess
          reference={status.state === "success" ? status.reference : null}
        />
      ) : (
        <>
          <FormProgress currentStep={step} onStepSelect={goToStep} />

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8"
            aria-labelledby="application-step-heading"
          >
            {draftRestored && (
              <div className="mb-6 flex flex-col gap-2 rounded-[6px] border border-line-strong bg-surface px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-muted sm:flex-row sm:items-center sm:justify-between">
                <p>
                  We restored a draft saved in this browser. It never left your
                  device.
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetEverything}
                  className="self-start px-2 text-[0.8125rem] underline decoration-line-strong underline-offset-4 sm:self-auto"
                >
                  Start fresh
                </Button>
              </div>
            )}

            <p className="type-label text-emerald-600">
              Step {step} of {TOTAL_STEPS}
            </p>
            <h2
              id="application-step-heading"
              ref={headingRef}
              tabIndex={-1}
              className="mt-2 type-h3 text-ink focus:outline-none sm:text-[2.25rem] sm:leading-none"
            >
              {meta.title}
            </h2>
            <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              {meta.description}
            </p>

            {errorCount > 0 && (
              <div
                role="alert"
                className="mt-6 rounded-[6px] border border-danger/30 bg-danger-soft/60 p-4"
              >
                <p className="text-[0.875rem] font-medium text-danger">
                  {errorCount === 1
                    ? "One field needs your attention."
                    : `${errorCount} fields need your attention.`}
                </p>
                <ul className="mt-2 space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>
                      <button
                        type="button"
                        onClick={() => focusField(field)}
                        className="text-left text-[0.8125rem] text-ink underline decoration-danger/30 underline-offset-2 hover:decoration-danger"
                      >
                        {message}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {status.state === "error" && (
              <div className="mt-6">
                <SubmissionError
                  status={status}
                  onRetry={() => void submit()}
                />
              </div>
            )}

            <fieldset
              disabled={isSubmitting}
              className="mt-8 min-w-0 border-0 p-0"
            >
              {step === 1 && (
                <StepPersonal
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                />
              )}
              {step === 2 && (
                <StepEducation
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                />
              )}
              {step === 3 && (
                <StepProgramming
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                />
              )}
              {step === 4 && (
                <StepMotivation
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                />
              )}
              {step === 5 && (
                <ReviewStep
                  values={values}
                  consent={consent}
                  consentError={consentError}
                  onConsentChange={(checked) => {
                    setConsent(checked);
                    if (checked) setConsentError(undefined);
                  }}
                  onEdit={goToStep}
                />
              )}
            </fieldset>

            <StepNavigation
              step={step}
              totalSteps={TOTAL_STEPS}
              isSubmitting={isSubmitting}
              submitDisabled={!IS_SUBMISSION_CONFIGURED}
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={() => void submit()}
            />
          </form>

          <p className="mt-6 text-[0.75rem] leading-relaxed text-ink-subtle">
            Step {STEP_LABELS[step - 1]} · Your answers stay in this browser as a
            draft until you submit, and are cleared after a successful
            submission.
          </p>
        </>
      )}
    </div>
  );
}

