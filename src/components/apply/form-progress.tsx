"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { STEP_LABELS, TOTAL_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FormProgress({
  currentStep,
  onStepSelect,
}: {
  currentStep: number;
  onStepSelect: (step: number) => void;
}) {
  return (
    <div className="border border-line-strong rounded-[12px] bg-surface p-5 lg:p-7 shadow-sm">
      <p className="sr-only" aria-live="polite">
        Step {currentStep} of {TOTAL_STEPS}: {STEP_LABELS[currentStep - 1]}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <ol className="flex flex-1 items-center justify-between gap-0 relative z-0">
          {STEP_LABELS.map((label, index) => {
            const step = index + 1;
            const complete = step < currentStep;
            const current = step === currentStep;
            return (
              <React.Fragment key={label}>
                <button
                  type="button"
                  disabled={!complete}
                  aria-current={current ? "step" : undefined}
                  onClick={() => complete && onStepSelect(step)}
                  className="flex flex-col items-center gap-2 shrink-0 relative z-10"
                >
                  <span
                    className={cn(
                      "size-9 shrink-0 rounded-full border flex items-center justify-center text-[0.75rem] font-medium tabular-nums transition-colors",
                      current
                        ? "border-emerald-600 bg-emerald-600 text-canvas"
                        : complete
                          ? "border-emerald-600 bg-emerald-100 text-emerald-700"
                          : "border-line-strong bg-surface text-ink-subtle",
                    )}
                  >
                    {complete ? <Check aria-hidden className="size-4" /> : step}
                  </span>
                  <span
                    className={cn(
                      "type-label text-[0.725rem] leading-none text-center max-w-[5rem]",
                      current ? "font-medium text-ink" : "text-ink-subtle",
                    )}
                  >
                    {label}
                  </span>
                </button>
                {step < TOTAL_STEPS && (
                  <span
                    aria-hidden
                    className={cn(
                      "flex-1 shrink-0 h-[1px] self-center -mx-1",
                      complete || current
                        ? "bg-emerald-600"
                        : "bg-line-strong",
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </div>

      <p className="type-label mt-6 text-ink-subtle">
        Step {currentStep} of {TOTAL_STEPS}
      </p>
    </div>
  );
}
