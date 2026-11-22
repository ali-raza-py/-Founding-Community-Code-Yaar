"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";

import {
  AMBASSADOR_TOTAL_STEPS,
  AMBASSADOR_STEP_LABELS,
  AMBASSADOR_CATEGORIES,
  AMBASSADOR_AGE_RANGES,
  AMBASSADOR_CURRENT_STATUS,
  AMBASSADOR_WEEKLY_TIME_OPTIONS,
  AMBASSADOR_SOCIAL_PLATFORMS,
  COUNTRIES,
} from "@/lib/constants";
import {
  ambassadorPersonalSchema,
  ambassadorPreferenceSchema,
  ambassadorEducationSchema,
  ambassadorOnlinePresenceSchema,
  ambassadorMotivationSchema,
  ambassadorAvailabilitySchema,
  ambassadorAgreementSchema,
} from "@/lib/validation";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { cn } from "@/lib/utils";

type AmbassadorValues = {
  fullName: string;
  email: string;
  country: string;
  city: string;
  ageRange: string;
  currentStatus: string;
  ambassadorCategory: string;
  categoryInterest: string;
  institution: string;
  fieldOfStudy: string;
  belongsToCommunity: string;
  communityName: string;
  communityDescription: string;
  hasLeadershipExperience: string;
  linkedin: string;
  github: string;
  instagram: string;
  twitter: string;
  website: string;
  whyAmbassador: string;
  howIntroduce: string;
  whySuitable: string;
  initiativeIdea: string;
  first30Days: string;
  weeklyTime: string;
  canAttendMeetings: string;
  informationAccurate: boolean;
  noSelectionGuarantee: boolean;
  agreeToGuidelines: boolean;
  consentDataProcessing: boolean;
  guardianConsent: boolean;
};

const EMPTY_VALUES: AmbassadorValues = {
  fullName: "",
  email: "",
  country: "",
  city: "",
  ageRange: "",
  currentStatus: "",
  ambassadorCategory: "",
  categoryInterest: "",
  institution: "",
  fieldOfStudy: "",
  belongsToCommunity: "",
  communityName: "",
  communityDescription: "",
  hasLeadershipExperience: "",
  linkedin: "",
  github: "",
  instagram: "",
  twitter: "",
  website: "",
  whyAmbassador: "",
  howIntroduce: "",
  whySuitable: "",
  initiativeIdea: "",
  first30Days: "",
  weeklyTime: "",
  canAttendMeetings: "",
  informationAccurate: false,
  noSelectionGuarantee: false,
  agreeToGuidelines: false,
  consentDataProcessing: false,
  guardianConsent: false,
};

const STEP_SCHEMAS = {
  1: ambassadorPersonalSchema,
  2: ambassadorPreferenceSchema,
  3: ambassadorEducationSchema,
  4: ambassadorOnlinePresenceSchema,
  5: ambassadorMotivationSchema,
  6: ambassadorAvailabilitySchema,
  7: ambassadorAgreementSchema,
} as const;

function emptyStatus() {
  return { state: "idle" } as {
    state: "idle";
  } | { state: "submitting" } | { state: "success"; reference: string | null } | { state: "error"; reason: string; status?: number };
}

export default function AmbassadorApplyPage() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<AmbassadorValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<ReturnType<typeof emptyStatus>>(emptyStatus);

  const submissionIdRef = useRef<string>(crypto.randomUUID());
  const [turnstileContainer, setTurnstileContainer] = useState<HTMLDivElement | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);

  const programId = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_PROGRAM_ID_AMBASSADOR ?? "")
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
    return () => {
      try {
        turnstile.remove(widgetId);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [turnstileContainer, turnstileReady, turnstileSiteKey]);

  const setField = useCallback((key: keyof AmbassadorValues, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const validateStep = useCallback((stepNumber: number): boolean => {
    const schema = STEP_SCHEMAS[stepNumber as keyof typeof STEP_SCHEMAS];
    if (!schema) return true;
    const result = schema.safeParse(values);
    if (result.success) {
      // Additional rule: under 18 applicants must confirm guardian consent.
      if (stepNumber === 7 && (values.ageRange === "under-16" || values.ageRange === "16-17") && !values.guardianConsent) {
        setErrors({ guardianConsent: ["Guardian consent is required for applicants under 18."] });
        return false;
      }
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

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setSubmitError(null);

      let valid = true;
      for (const stepNumber of [1, 2, 3, 4, 5, 6, 7]) {
        if (!validateStep(stepNumber)) valid = false;
      }
      // Under-18 guardian consent check
      if (
        (values.ageRange === "under-16" || values.ageRange === "16-17") &&
        !values.guardianConsent
      ) {
        valid = false;
        setErrors({ ...errors, guardianConsent: ["Guardian consent is required for applicants under 18."] });
      }
      if (!valid) {
        setStep(1);
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

      const request = {
        program_id: programId,
        applicant_name: values.fullName,
        email: values.email,
        phone: "",
        institution: values.institution,
        city: values.city,
        application_answers: {
          ageRange: values.ageRange,
          currentStatus: values.currentStatus,
          ambassadorCategory: values.ambassadorCategory,
          categoryInterest: values.categoryInterest,
          fieldOfStudy: values.fieldOfStudy,
          belongsToCommunity: values.belongsToCommunity,
          communityName: values.communityName,
          communityDescription: values.communityDescription,
          hasLeadershipExperience: values.hasLeadershipExperience,
          linkedin: values.linkedin,
          github: values.github,
          instagram: values.instagram,
          twitter: values.twitter,
          website: values.website,
          whyAmbassador: values.whyAmbassador,
          howIntroduce: values.howIntroduce,
          whySuitable: values.whySuitable,
          initiativeIdea: values.initiativeIdea,
          first30Days: values.first30Days,
          weeklyTime: values.weeklyTime,
          canAttendMeetings: values.canAttendMeetings,
          informationAccurate: values.informationAccurate,
          noSelectionGuarantee: values.noSelectionGuarantee,
          agreeToGuidelines: values.agreeToGuidelines,
          consentDataProcessing: values.consentDataProcessing,
          guardianConsent: values.guardianConsent,
        },
        referral_code: "",
        turnstile_token: turnstileToken ?? "",
      };

      setStatus({ state: "submitting" });

      // Prefer the Community API when configured; fall back to legacy adapter.
      if (communityApi.isConfigured()) {
        const result = await communityApi.submitApplication(request);

        if (result.ok) {
          setStatus({ state: "success", reference: result.data.id ?? null });
        } else {
          const err = result.error;
          let message = "Unable to submit your application. Please try again.";
          if (err.reason === "not-configured") {
            message =
              "Application submission is not configured on this site yet. Your answers have been saved locally — please try again later or contact the Code Yaar team.";
          } else if (err.reason === "timeout") {
            message = "The request timed out. Please try again.";
          } else if (err.reason === "network") {
            message = "Network error. Please check your connection and try again.";
          } else if (err.reason === "conflict") {
            message =
              "You have already submitted an application to this program. Duplicate submissions are not allowed.";
          } else if (err.reason === "validation") {
            message =
              `Validation error: ${err.message}. Please check your entries and try again.`;
          } else if (err.reason === "rate-limited") {
            message =
              "Too many submission attempts. Please wait a moment and try again.";
          } else if (err.reason === "server") {
            message =
              `Server error${err.status != null ? ` (HTTP ${err.status})` : ""}. Please try again later.`;
          } else {
            message = err.message;
          }
          setSubmitError(message);
          setStatus({ state: "error", reason: err.reason, status: err.status });
        }
      }
    },
    [values, validateStep, errors, programId, turnstileToken],
  );

  const isUnder18 = values.ageRange === "under-16" || values.ageRange === "16-17";

  if (status.state === "success") {
    return (
      <Section padded>
        <SectionInner className="text-center">
          <div className="mx-auto max-w-[42rem]">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
                <svg
                  aria-hidden
                  className="size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h2 className="mb-4">Application submitted</h2>
            <p className="type-body mb-8">
              Thank you — your application to the Code Yaar Global Ambassador
              Programme has been received in this session. It will be reviewed
              by the Code Yaar team and you will be contacted by email with the
              outcome.
            </p>
            {status.reference && (
              <p className="mt-2 type-small text-ink-muted">
                Reference: <span className="font-mono">{status.reference}</span>
              </p>
            )}
            <Link
              href="/ambassadors"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Back to Ambassador Programme
            </Link>
          </div>
        </SectionInner>
      </Section>
    );
  }

  const stepLabel = AMBASSADOR_STEP_LABELS[step - 1];

  return (
    <Section padded>
      <SectionInner className="max-w-[64rem]">
        <div className="mb-10">
          <p className="type-label mb-1">Ambassador Application</p>
          <h2 className="mb-2">Apply to Become a Code Yaar Global Ambassador</h2>
          <p className="type-body-muted">
            Tell us about yourself, your community and how you would contribute
            to the Code Yaar global community.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center text-xs text-ink-subtle">
            <span>Estimated completion time: approximately 5&ndash;8 minutes.</span>
            <span aria-hidden>&middot;</span>
            <span>Applications are reviewed individually.</span>
            <span aria-hidden>&middot;</span>
            <span>Submitting an application does not guarantee selection.</span>
          </div>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="type-small">Step {step} of {AMBASSADOR_TOTAL_STEPS}</span>
              <span className="type-small font-semibold">{stepLabel}</span>
            </div>
            <div className="w-full bg-line rounded-full h-1.5">
              <div
                className="bg-emerald h-1.5 rounded-full transition-all duration-300"
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={AMBASSADOR_TOTAL_STEPS}
                style={{ width: `${(step / AMBASSADOR_TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[0.7rem] font-medium">
              {AMBASSADOR_STEP_LABELS.map((label, index) => (
                <span
                  key={label}
                  className={cn(
                    "transition-colors duration-200",
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

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <section className="space-y-6">
              <p className="type-body text-ink-muted">
                We use this information to review your application and contact
                you about the outcome. We do not ask for a date of birth.
              </p>
              <Field label="Full name" required error={errors.fullName?.[0]}>
                <Input
                  placeholder="Jane Smith"
                  value={values.fullName}
                  onChange={(e) => setField("fullName", e.currentTarget.value)}
                  required
                  autoComplete="name"
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
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="Age range" required error={errors.ageRange?.[0]}>
                <Select
                  value={values.ageRange}
                  onChange={(e) => setField("ageRange", e.currentTarget.value)}
                  required
                >
                  <option value="">Select your age range</option>
                  {AMBASSADOR_AGE_RANGES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Current status" required error={errors.currentStatus?.[0]}>
                <Select
                  value={values.currentStatus}
                  onChange={(e) => setField("currentStatus", e.currentTarget.value)}
                  required
                >
                  <option value="">Select your current status</option>
                  {AMBASSADOR_CURRENT_STATUS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </section>
          )}

          {/* Step 2: Ambassador Preference */}
          {step === 2 && (
            <section className="space-y-6">
              <p className="type-body text-ink-muted">
                Ambassadors represent Code Yaar in different contexts. Choose
                the category that best matches the community you can reach.
              </p>
              <Field label="Preferred ambassador category" required error={errors.ambassadorCategory?.[0]}>
                <Select
                  value={values.ambassadorCategory}
                  onChange={(e) => setField("ambassadorCategory", e.currentTarget.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {AMBASSADOR_CATEGORIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Why are you interested in this category?"
                required
                error={errors.categoryInterest?.[0]}
                hint="Tell us about the community you would represent and why this category fits you."
              >
                <Textarea
                  rows={5}
                  value={values.categoryInterest}
                  onChange={(e) => setField("categoryInterest", e.currentTarget.value)}
                  required
                />
              </Field>
            </section>
          )}

          {/* Step 3: Education and Community */}
          {step === 3 && (
            <section className="space-y-6">
              <p className="type-body text-ink-muted">
                Optional fields help us understand your context. You can apply
                without prior experience or affiliation.
              </p>
              <Field label="Institution or organisation" error={errors.institution?.[0]}>
                <Input
                  placeholder="Optional — your school, university or organisation"
                  value={values.institution}
                  onChange={(e) => setField("institution", e.currentTarget.value)}
                />
              </Field>
              <Field label="Field of study or professional background" error={errors.fieldOfStudy?.[0]}>
                <Input
                  placeholder="Optional — what you study or work in"
                  value={values.fieldOfStudy}
                  onChange={(e) => setField("fieldOfStudy", e.currentTarget.value)}
                />
              </Field>
              <Field
                label="Do you belong to a student society, developer community or technology group?"
                required
                error={errors.belongsToCommunity?.[0]}
              >
                <Select
                  value={values.belongsToCommunity}
                  onChange={(e) => setField("belongsToCommunity", e.currentTarget.value)}
                  required
                >
                  <option value="">Select an answer</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </Field>
              {values.belongsToCommunity === "yes" && (
                <>
                  <Field label="Community or group name" error={errors.communityName?.[0]}>
                    <Input
                      placeholder="Name of the society, community or group"
                      value={values.communityName}
                      onChange={(e) => setField("communityName", e.currentTarget.value)}
                    />
                  </Field>
                  <Field
                    label="Describe the community you can reach or hope to build"
                    required
                    error={errors.communityDescription?.[0]}
                    hint="Tell us about the community and how Code Yaar could reach them."
                  >
                    <Textarea
                      rows={5}
                      value={values.communityDescription}
                      onChange={(e) => setField("communityDescription", e.currentTarget.value)}
                      required
                    />
                  </Field>
                </>
              )}
              <Field
                label="Have you previously participated in volunteering, leadership or community initiatives?"
                required
                error={errors.hasLeadershipExperience?.[0]}
              >
                <Select
                  value={values.hasLeadershipExperience}
                  onChange={(e) => setField("hasLeadershipExperience", e.currentTarget.value)}
                  required
                >
                  <option value="">Select an answer</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
                <p className="type-caption mt-2">
                  No prior experience is required — this helps us understand your
                  background, not filter you out.
                </p>
              </Field>
            </section>
          )}

          {/* Step 4: Online Presence */}
          {step === 4 && (
            <section className="space-y-6">
              <p className="type-body text-ink-muted">
                Optional links give reviewers more context. Social media
                follower counts are never a selection requirement. Leave any
                field empty if you do not have a profile.
              </p>
              {AMBASSADOR_SOCIAL_PLATFORMS.map((platform) => (
                <Field
                  key={platform.key}
                  label={platform.label}
                  error={errors[platform.key]?.[0]}
                >
                  <Input
                    placeholder={platform.placeholder}
                    value={String(values[platform.key as keyof AmbassadorValues])}
                    onChange={(e) =>
                      setField(platform.key as keyof AmbassadorValues, e.currentTarget.value)
                    }
                  />
                  <p className="type-caption mt-1">Optional</p>
                </Field>
              ))}
            </section>
          )}

          {/* Step 5: Motivation and Contribution */}
          {step === 5 && (
            <section className="space-y-6">
              <p className="type-body text-ink-muted">
                These answers help distinguish serious candidates from generic
                applications. Be specific and personal.
              </p>
              <Field
                label="Why do you want to become a Code Yaar Global Ambassador?"
                required
                error={errors.whyAmbassador?.[0]}
                hint="At least 80 characters. Tell us what draws you to this role."
              >
                <Textarea
                  rows={5}
                  value={values.whyAmbassador}
                  onChange={(e) => setField("whyAmbassador", e.currentTarget.value)}
                  required
                />
              </Field>
              <Field
                label="How would you introduce Code Yaar to your community?"
                required
                error={errors.howIntroduce?.[0]}
                hint="At least 80 characters. Describe your approach."
              >
                <Textarea
                  rows={5}
                  value={values.howIntroduce}
                  onChange={(e) => setField("howIntroduce", e.currentTarget.value)}
                  required
                />
              </Field>
              <Field
                label="What makes you suitable for this responsibility?"
                required
                error={errors.whySuitable?.[0]}
                hint="At least 80 characters. Focus on reliability and communication."
              >
                <Textarea
                  rows={5}
                  value={values.whySuitable}
                  onChange={(e) => setField("whySuitable", e.currentTarget.value)}
                  required
                />
              </Field>
              <Field
                label="Describe an initiative or idea you would like to introduce"
                required
                error={errors.initiativeIdea?.[0]}
                hint="At least 80 characters. A campaign, event, or outreach idea."
              >
                <Textarea
                  rows={5}
                  value={values.initiativeIdea}
                  onChange={(e) => setField("initiativeIdea", e.currentTarget.value)}
                  required
                />
              </Field>
              <Field
                label="What would your first 30 days as an ambassador look like?"
                required
                error={errors.first30Days?.[0]}
                hint="At least 80 characters. Your initial plan for outreach and connection."
              >
                <Textarea
                  rows={5}
                  value={values.first30Days}
                  onChange={(e) => setField("first30Days", e.currentTarget.value)}
                  required
                />
              </Field>
            </section>
          )}

          {/* Step 6: Availability */}
          {step === 6 && (
            <section className="space-y-6">
              <p className="type-body text-ink-muted">
                Be realistic about what you can sustain. Ambassadors typically
                contribute 3&ndash;5 hours per week.
              </p>
              <Field label="How much time can you realistically contribute each week?" required error={errors.weeklyTime?.[0]}>
                <Select
                  value={values.weeklyTime}
                  onChange={(e) => setField("weeklyTime", e.currentTarget.value)}
                  required
                >
                  <option value="">Select your availability</option>
                  {AMBASSADOR_WEEKLY_TIME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Can you participate in occasional online meetings?" required error={errors.canAttendMeetings?.[0]}>
                <Select
                  value={values.canAttendMeetings}
                  onChange={(e) => setField("canAttendMeetings", e.currentTarget.value)}
                  required
                >
                  <option value="">Select an answer</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
                <p className="type-caption mt-2">
                  Meetings are occasional and scheduled with time zones in mind.
                </p>
              </Field>
            </section>
          )}

          {/* Step 7: Agreement and Declaration */}
          {step === 7 && (
            <section className="space-y-6">
              <p className="type-body text-ink-muted">
                Please review and confirm each statement before submitting.
              </p>
              <Field className="flex items-start gap-3">
                <input
                  id="agreement-1"
                  type="checkbox"
                  className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
                  checked={values.informationAccurate}
                  onChange={(e) => setField("informationAccurate", e.currentTarget.checked)}
                  required
                />
                <label htmlFor="agreement-1" className="text-sm leading-relaxed cursor-pointer text-ink">
                  I confirm that the information provided is accurate.
                </label>
              </Field>
              <Field className="flex items-start gap-3">
                <input
                  id="agreement-2"
                  type="checkbox"
                  className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
                  checked={values.noSelectionGuarantee}
                  onChange={(e) => setField("noSelectionGuarantee", e.currentTarget.checked)}
                  required
                />
                <label htmlFor="agreement-2" className="text-sm leading-relaxed cursor-pointer text-ink">
                  I understand that submitting an application does not guarantee
                  selection.
                </label>
              </Field>
              <Field className="flex items-start gap-3">
                <input
                  id="agreement-3"
                  type="checkbox"
                  className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
                  checked={values.agreeToGuidelines}
                  onChange={(e) => setField("agreeToGuidelines", e.currentTarget.checked)}
                  required
                />
                <label htmlFor="agreement-3" className="text-sm leading-relaxed cursor-pointer text-ink">
                  I agree to follow the official Code Yaar Ambassador guidelines
                  if selected.
                </label>
              </Field>
              <Field className="flex items-start gap-3">
                <input
                  id="agreement-4"
                  type="checkbox"
                  className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
                  checked={values.consentDataProcessing}
                  onChange={(e) => setField("consentDataProcessing", e.currentTarget.checked)}
                  required
                />
                <label htmlFor="agreement-4" className="text-sm leading-relaxed cursor-pointer text-ink">
                  I consent to the processing of my application information for
                  recruitment purposes. <Link href="/privacy" className="text-emerald underline underline-offset-2 hover:text-emerald-hover">Read the privacy policy</Link>.
                </label>
              </Field>
              {isUnder18 && (
                <Field className="flex items-start gap-3">
                  <input
                    id="agreement-guardian"
                    type="checkbox"
                    className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
                    checked={values.guardianConsent}
                    onChange={(e) => setField("guardianConsent", e.currentTarget.checked)}
                  />
                  <label htmlFor="agreement-guardian" className="text-sm leading-relaxed cursor-pointer text-ink">
                    I am under 18 and have guardian consent to apply (where
                    required).
                  </label>
                </Field>
              )}
            </section>
          )}

          {/* Submission status */}
          {status.state === "submitting" && (
            <div className="flex items-center gap-3 py-4">
              <span className="flex h-5 w-5 shrink-0">⟳</span>
              <span className="type-body">Submitting your application…</span>
            </div>
          )}
          {status.state === "error" && (
            <div className="rounded-lg border border-danger-soft bg-danger-soft p-6">
              <p className="text-sm font-semibold text-danger">
                Submission failed
              </p>
              <p className="mt-1 type-body">{submitError}</p>
              <Button
                type="button"
                onClick={() => {
                  setSubmitError(null);
                  setStatus({ state: "submitting" });
                  void handleSubmit({ preventDefault: () => {} } as unknown as React.FormEvent);
                }}
              >
                Retry
              </Button>
            </div>
          )}
          {submitError && status.state === "idle" && (
            <div className="rounded-lg border border-danger-soft bg-danger-soft p-6">
              <p className="text-sm font-semibold text-danger">{submitError}</p>
            </div>
          )}

          {/* Actions */}
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
            {step < AMBASSADOR_TOTAL_STEPS ? (
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
                {turnstileSiteKey && turnstileReady && (
                  <div
                    ref={setTurnstileContainer}
                    className="mb-4"
                    aria-label="Turnstile bot protection"
                  />
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
                {turnstileSiteKey && !turnstileReady && (
                  <p className="mt-2 type-caption text-ink-muted">
                    Security check is loading. Please wait before submitting.
                  </p>
                )}
                {!turnstileSiteKey && communityApi.isConfigured() && (
                  <p className="mt-2 type-caption text-ink-muted">
                    Turnstile site key not configured — submission disabled.
                  </p>
                )}
              </>
            )}
          </div>
        </form>

        <p className="mt-10 type-caption text-center text-ink-subtle">
          Applications are reviewed by people, not algorithms. Submission
          endpoint:
          {communityApi.isConfigured()
            ? "configured — submitted to Code Yaar Community API"
            : "not configured — submissions disabled"}.
        </p>
      </SectionInner>
    </Section>
  );
}
