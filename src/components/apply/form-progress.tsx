"use client";

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
  const percent = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="border-y border-line bg-surface px-1 py-4">
      <div className="flex items-baseline justify-between gap-4 px-3 md:hidden">
        <p className="type-label text-ink-subtle">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
        <p className="text-[0.875rem] font-medium text-ink">
          {STEP_LABELS[currentStep - 1]}
        </p>
      </div>
      <div
        aria-hidden
        className="mx-3 mt-3 h-px bg-line-strong md:hidden"
      >
        <div
          className="h-px bg-emerald-600 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="hidden md:flex md:items-start md:justify-between md:gap-2 md:px-3">
        {STEP_LABELS.map((label, index) => {
          const step = index + 1;
          const complete = step < currentStep;
          const current = step === currentStep;
          return (
            <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
              <button
                type="button"
                disabled={!complete}
                aria-current={current ? "step" : undefined}
                onClick={() => complete && onStepSelect(step)}
                className={cn(
                  "group flex items-center gap-2.5 rounded-[4px] text-left",
                  complete ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border text-[0.6875rem] font-medium tabular-nums transition-colors",
                    current
                      ? "border-forest-950 bg-forest-950 text-ink"
                      : complete
                        ? "border-emerald-600 bg-emerald-100 text-emerald-700"
                        : "border-line-strong text-ink-subtle",
                  )}
                >
                  {complete ? <Check aria-hidden className="size-3" /> : step}
                </span>
                <span
                  className={cn(
                    "hidden text-[0.8125rem] lg:block",
                    current ? "font-medium text-ink" : "text-ink-muted",
                  )}
                >
                  {label}
                </span>
              </button>
              {step < TOTAL_STEPS && (
                <span aria-hidden className="ml-1 h-px flex-1 bg-line" />
              )}
            </li>
          );
        })}
      </ol>
      <p className="sr-only" aria-live="polite">
        Step {currentStep} of {TOTAL_STEPS}: {STEP_LABELS[currentStep - 1]}
      </p>
    </div>
  );
}
