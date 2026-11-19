"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StepNavigation({
  step,
  totalSteps,
  isSubmitting,
  submitDisabled,
  onBack,
  onNext,
  onSubmit,
}: {
  step: number;
  totalSteps: number;
  isSubmitting: boolean;
  submitDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const isLast = step === totalSteps;

  return (
    <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
      {step > 1 ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
          className="sm:justify-start"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back
        </Button>
      ) : (
        <span className="hidden sm:block" />
      )}

      {isLast ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || submitDisabled}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit application"
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Continue
          <ArrowRight aria-hidden className="size-4" />
        </Button>
      )}
    </div>
  );
}
