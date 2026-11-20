import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function describedByFor(
  id: string,
  hint?: string,
  error?: string,
): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function FieldFrame({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="flex items-baseline gap-1.5 type-label text-ink"
      >
        {label}
        {required && (
          <span aria-hidden className="text-emerald-600">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
        {optional && (
          <span className="text-[0.75rem] font-normal text-ink-subtle">
            Optional
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-start gap-1.5 text-[0.8125rem] font-medium text-danger"
        >
          <span aria-hidden className="mt-[0.4em] block size-1.5 shrink-0 rounded-full bg-danger" />
          {error}
        </p>
      )}
    </div>
  );
}

export function inputClasses(invalid?: boolean) {
  return cn(
    "w-full rounded-[6px] border bg-surface px-3 py-3 text-[0.9375rem] text-ink shadow-xs transition-colors duration-150",
    "placeholder:text-ink-subtle",
    "hover:border-line-strong",
    invalid
      ? "border-danger focus:border-danger"
      : "border-line-strong focus:border-emerald-600",
  );
}

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}) {
  return (
    <FieldFrame
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={className}
    >
      <input
        id={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedByFor(id, hint, error)}
        className={cn(inputClasses(Boolean(error)), "h-11")}
        {...props}
      />
    </FieldFrame>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  rows = 4,
  ...props
}: React.ComponentProps<"textarea"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}) {
  return (
    <FieldFrame
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={className}
    >
      <textarea
        id={id}
        rows={rows}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedByFor(id, hint, error)}
        className={cn(inputClasses(Boolean(error)), "resize-y py-3 leading-relaxed")}
        {...props}
      />
    </FieldFrame>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
  ...props
}: React.ComponentProps<"select"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}) {
  return (
    <FieldFrame
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={className}
    >
      <div className="relative">
        <select
          id={id}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedByFor(id, hint, error)}
          className={cn(
            inputClasses(Boolean(error)),
            "h-11 appearance-none pr-10 bg-surface text-ink",
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
        />
      </div>
    </FieldFrame>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  hint,
  ...props
}: React.ComponentProps<"input"> & {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedByFor(id, hint, error)}
          className="mt-0.5 size-[1.15rem] shrink-0 accent-[var(--color-emerald-600)]"
          {...props}
        />
        <label
          htmlFor={id}
          className="text-[0.9375rem] leading-relaxed text-ink-muted"
        >
          {label}
        </label>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="pl-[1.9rem] text-[0.8125rem] text-ink-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="pl-[1.9rem] text-[0.8125rem] font-medium text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function RadioGroupField({
  name,
  legend,
  error,
  required,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  error?: string;
  required?: boolean;
  options: readonly { value: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 flex items-baseline gap-1.5 type-label text-ink">
        {legend}
        {required && (
          <span aria-hidden className="text-emerald-600">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </legend>
      <div
        className="grid gap-2.5 sm:grid-cols-3"
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer gap-3 rounded-[6px] border p-4 transition-colors duration-150",
                selected
                  ? "border-emerald-600 bg-emerald-100/60"
                  : "border-line-strong bg-surface hover:border-emerald-800/50",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="mt-1 size-4 shrink-0 accent-[var(--color-emerald-600)]"
              />
              <span className="flex flex-col gap-1">
                <span className="text-[0.9375rem] font-medium text-ink">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-[0.8125rem] leading-snug text-ink-muted">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${name}-error`} className="text-[0.8125rem] font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
