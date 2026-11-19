"use client";

import { useCallback, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { AlertTriangle, CheckCircle2, Mail } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { IS_SUBMISSION_CONFIGURED } from "@/lib/submission";

const formVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 18, stiffness: 120 },
  },
};

const fieldInputClasses = (hasError: boolean, disabled: boolean) =>
  `w-full rounded-[6px] border bg-surface px-3.5 py-3 text-[0.9375rem] text-foreground placeholder:text-foreground/50 focus:outline-none transition-colors disabled:opacity-60 ${
    hasError
      ? "border-danger focus:border-danger"
      : "border-border focus:border-emerald-500"
  } ${disabled ? "" : ""}`;

export function ApplicationSection() {
  const [formData, setFormData] = useState<Record<string, string>>({
    fullName: "",
    email: "",
    country: "",
    education: "",
    github: "",
    linkedin: "",
    motivation: "",
    contribution: "",
    consent: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{
    state: "idle" | "submitting" | "success" | "error";
    message?: string;
  }>({ state: "idle" });

  const validate = useCallback((): boolean => {
    const next: Record<string, string> = {};
    const {
      fullName,
      email,
      country,
      education,
      github,
      linkedin,
      motivation,
      contribution,
      consent,
    } = formData;

    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!email.trim()) next.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!country.trim()) next.country = "Country is required.";
    if (!education.trim())
      next.education = "Education or professional status is required.";
    if (github.trim() && !/^https?:\/\//.test(github))
      next.github = "Enter a valid URL starting with http:// or https://.";
    if (linkedin.trim() && !/^https?:\/\//.test(linkedin))
      next.linkedin = "Enter a valid URL starting with http:// or https://.";
    if (!motivation.trim()) next.motivation = "Tell us why you want to join.";
    else if (motivation.trim().length < 50)
      next.motivation = "Please write at least 50 characters.";
    if (!contribution.trim())
      next.contribution = "Tell us what you would contribute.";
    else if (contribution.trim().length < 30)
      next.contribution = "Please write at least 30 characters.";
    if (!consent) next.consent = "You must agree to the community expectations.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData]);

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ state: "submitting" });

    if (!IS_SUBMISSION_CONFIGURED) {
      await new Promise((r) => setTimeout(r, 1000));
      setStatus({
        state: "error",
        message:
          "Applications cannot be transmitted yet — the submission destination is not configured. Your answers are saved in this browser. Please contact the Code Yaar team directly to apply.",
      });
      return;
    }

    await new Promise((r) => setTimeout(r, 1500));
    setStatus({ state: "success" });
  };

  const isDisabled = status.state === "submitting" || status.state === "success";

  return (
    <section id="apply" className="bg-canvas text-canvas py-20 border-b border-border">
      <Container className="mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="text-center"
        >
          <h2 className="type-h2 mb-4">Become a Founding Member.</h2>
          <p className="type-lead max-w-[48rem] mx-auto">
            Help shape the first generation of Code Yaar. Tell us about
            yourself, why you want to join, and what you would contribute to
            the community.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="mt-12 max-w-[640px] mx-auto space-y-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="field-group flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
                Full name <span className="text-emerald-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="As you would like to be known"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={fieldInputClasses(!!errors.fullName, isDisabled)}
                disabled={isDisabled}
              />
              {errors.fullName && (
                <p className="text-[0.75rem] text-danger">{errors.fullName}</p>
              )}
            </div>

            <div className="field-group flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
                Email address <span className="text-emerald-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={fieldInputClasses(!!errors.email, isDisabled)}
                disabled={isDisabled}
              />
              {errors.email && (
                <p className="text-[0.75rem] text-danger">{errors.email}</p>
              )}
            </div>

            <div className="field-group flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
                Country <span className="text-emerald-500">*</span>
              </label>
              <input
                id="country"
                type="text"
                placeholder="Your country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className={fieldInputClasses(!!errors.country, isDisabled)}
                disabled={isDisabled}
              />
              {errors.country && (
                <p className="text-[0.75rem] text-danger">{errors.country}</p>
              )}
            </div>

            <div className="field-group flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
                Education or professional status{" "}
                <span className="text-emerald-500">*</span>
              </label>
              <input
                id="education"
                type="text"
                placeholder="School, university, bootcamp, self-taught, etc."
                value={formData.education}
                onChange={(e) => handleChange("education", e.target.value)}
                className={fieldInputClasses(!!errors.education, isDisabled)}
                disabled={isDisabled}
              />
              {errors.education && (
                <p className="text-[0.75rem] text-danger">{errors.education}</p>
              )}
            </div>
          </div>

          <div className="field-group flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
              GitHub profile (optional)
            </label>
            <input
              id="github"
              type="url"
              placeholder="https://github.com/username"
              value={formData.github}
              onChange={(e) => handleChange("github", e.target.value)}
              className={fieldInputClasses(!!errors.github, isDisabled)}
              disabled={isDisabled}
            />
            {errors.github && (
              <p className="text-[0.75rem] text-danger">{errors.github}</p>
            )}
          </div>

          <div className="field-group flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
              LinkedIn profile (optional)
            </label>
            <input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              className={fieldInputClasses(!!errors.linkedin, isDisabled)}
              disabled={isDisabled}
            />
            {errors.linkedin && (
              <p className="text-[0.75rem] text-danger">{errors.linkedin}</p>
            )}
          </div>

          <div className="field-group flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
              Why do you want to join?{" "}
              <span className="text-emerald-500">*</span>
            </label>
            <textarea
              id="motivation"
              rows={4}
              placeholder="Tell us why the Founding Cohort matters to you (50+ characters)."
              value={formData.motivation}
              onChange={(e) => handleChange("motivation", e.target.value)}
              className={fieldInputClasses(!!errors.motivation, isDisabled)}
              disabled={isDisabled}
            />
            {errors.motivation && (
              <p className="text-[0.75rem] text-danger">{errors.motivation}</p>
            )}
          </div>

          <div className="field-group flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
              What would you contribute?{" "}
              <span className="text-emerald-500">*</span>
            </label>
            <textarea
              id="contribution"
              rows={4}
              placeholder="What would you bring to the community? (30+ characters)."
              value={formData.contribution}
              onChange={(e) => handleChange("contribution", e.target.value)}
              className={fieldInputClasses(!!errors.contribution, isDisabled)}
              disabled={isDisabled}
            />
            {errors.contribution && (
              <p className="text-[0.75rem] text-danger">{errors.contribution}</p>
            )}
          </div>

          <div className="field-group flex items-start gap-3 sm:col-span-2">
            <input
              id="consent"
              type="checkbox"
              checked={formData.consent === "true"}
              onChange={(e) =>
                handleChange("consent", e.target.checked ? "true" : "")
              }
              disabled={isDisabled}
              className="mt-0.5 size-4 shrink-0 accent-emerald-500"
            />
            <label
              htmlFor="consent"
              className="text-sm text-foreground leading-relaxed cursor-pointer disabled:opacity-60"
            >
              I agree to the community expectations and understand this is an
              expression of interest, not a guaranteed placement.
              {errors.consent && (
                <span className="ml-2 text-danger">{errors.consent}</span>
              )}
            </label>
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="w-full" disabled={isDisabled}>
              {status.state === "submitting" ? (
                <>
                  <span className="flex items-center gap-2">
                    <svg
                      className="size-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending…
                  </span>
                </>
              ) : (
                "Send Application"
              )}
            </Button>
          </div>

          {status.state === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-[8px] border border-danger/30 bg-danger-soft/60 p-4"
            >
              <AlertTriangle className="size-4 text-danger mr-2" />
              <p className="text-sm text-danger">{status.message}</p>
            </motion.div>
          )}

          {status.state === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-[8px] border border-emerald-600/30 bg-emerald-100/5 p-4"
            >
              <CheckCircle2 className="size-4 text-emerald-600 mr-2" />
              <p className="text-sm text-emerald-700">
                Thanks! Your application has been recorded locally. Because the
                submission destination isn&apos;t configured yet, please also
                reach out to the Code Yaar team directly so they know you&apos;re
                interested.
              </p>
            </motion.div>
          )}
        </motion.form>

        {!IS_SUBMISSION_CONFIGURED && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
            className="mt-8 rounded-[8px] border border-border/50 bg-surface p-6 text-center"
          >
            <Mail className="size-5 mx-auto mb-3 text-foreground/40" />
            <p className="text-sm text-foreground/60">
              Application submission is not yet connected to a live destination.
              In the meantime, please email the Code Yaar team directly to
              express your interest in the Founding Cohort.
            </p>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
