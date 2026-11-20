import * as React from "react";
import { cn } from "@/lib/utils";

export type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {label && (
        <label className="type-label flex items-center gap-1">
          {label}
          {required && <span className="text-danger ml-0.5" aria-hidden>{"*"}</span>}
        </label>
      )}
      <div className="relative">{children}</div>
      {error && (
        <p className="text-[0.8125rem] text-danger font-medium" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="type-caption">{hint}</p>
      )}
    </div>
  );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-colors",
        className,
      )}
      {...props}
    />
  );
}
