"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ParticipantPickerOption {
  id: string;
  name: string;
  email: string;
  programId?: string | null;
  status?: string | null;
}

interface ParticipantPickerProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: ParticipantPickerOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  graduated: "Graduated",
};

function statusVariant(status: string | null | undefined): "emerald" | "default" | "suspended" | "outline" {
  switch (status?.toLowerCase()) {
    case "active":
      return "emerald";
    case "suspended":
    case "inactive":
      return "suspended";
    case "graduated":
      return "outline";
    default:
      return "default";
  }
}

function statusBadgeClass(variant: "emerald" | "default" | "suspended" | "outline"): string {
  switch (variant) {
    case "emerald":
      return "border-emerald bg-emerald text-white";
    case "suspended":
      return "border-line bg-surface text-ink-muted";
    case "outline":
      return "border-line bg-surface text-ink-secondary";
    default:
      return "border-line bg-surface-raised text-ink-muted";
  }
}

export function ParticipantPicker({
  label,
  hint,
  error,
  required,
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Search participants by name or email…",
}: ParticipantPickerProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const valueSet = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(
    () =>
      options.filter(
        (o) =>
          o.name.toLowerCase().includes(filter.toLowerCase()) ||
          o.email.toLowerCase().includes(filter.toLowerCase()),
      ),
    [options, filter],
  );

  const allVisibleSelected = useMemo(
    () => filtered.length > 0 && filtered.every((o) => valueSet.has(o.id)),
    [filtered, valueSet],
  );

  const selectedOptions = useMemo(() => options.filter((o) => valueSet.has(o.id)), [options, valueSet]);

  const toggle = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => !prev);
  }, [disabled]);

  const close = useCallback(() => setOpen(false), []);

  const selectOption = useCallback(
    (id: string) => {
      if (disabled) return;
      onChange(valueSet.has(id) ? [...value].filter((v) => v !== id) : [...value, id]);
    },
    [disabled, value, valueSet, onChange],
  );

  const toggleSelectAll = useCallback(() => {
    if (disabled) return;
    if (allVisibleSelected) {
      onChange([...value].filter((v) => !filtered.some((o) => o.id === v)));
    } else {
      onChange([...new Set([...value, ...filtered.map((o) => o.id)])]);
    }
  }, [disabled, value, filtered, allVisibleSelected, onChange]);

  const clearSelection = useCallback(() => {
    if (disabled) return;
    onChange([]);
  }, [disabled, onChange]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [close]);

  return (
    <div className={cn("flex flex-col gap-2", error && "text-danger")} ref={containerRef}>
      {label && (
        <label className="type-label flex items-center gap-1">
          {label}
          {required && <span className="text-danger ml-0.5" aria-hidden>{"*"}</span>}
        </label>
      )}
      <div className="relative">
        <Button
          type="button"
          onClick={toggle}
          disabled={disabled}
          className={cn(
            "flex items-center justify-between w-full text-left",
            open
              ? "border-emerald bg-emerald/5"
              : "border border-line bg-surface hover:bg-surface-raised",
          )}
        >
          <span className="flex flex-col items-start gap-0.5">
            {selectedOptions.length > 0 ? (
              <>
                <span className="font-medium text-ink">{selectedOptions.length} selected</span>
                <span className="text-[0.75rem] text-ink-secondary truncate max-w-[22rem]">
                  {selectedOptions.map((o) => o.name).join(", ")}
                </span>
              </>
            ) : (
              <span className="text-ink-muted">{placeholder}</span>
            )}
          </span>
          {selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="text-[0.7rem] text-ink-secondary hover:text-danger transition-colors p-1"
              aria-label="Clear selection"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown
            className={cn("size-4 shrink-0 text-ink-secondary transition-transform", open && "rotate-180")}
          />
        </Button>
        {open && (
          <div className="z-50 mt-1 w-full rounded-xl border border-line bg-surface shadow-lg flex flex-col overflow-hidden">
            <div className="border-b border-line/50 bg-surface p-3">
              <input
                ref={inputRef}
                value={filter}
                onChange={(e) => setFilter(e.currentTarget.value)}
                placeholder={placeholder}
                className="flex h-10 w-full rounded-md border-none bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-colors pl-9"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-secondary" />
            </div>
            {filtered.length > 0 ? (
              <div className="max-h-[30rem] overflow-y-auto">
                <div className="border-b border-line/50 bg-surface-raised/50 px-3 py-2 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center gap-1.5 text-ink hover:text-emerald transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-line text-emerald focus-visible:ring-emerald shrink-0"
                      readOnly
                    />
                    <span>{allVisibleSelected ? "Deselect all" : "Select all visible"}</span>
                  </button>
                  <span className="text-ink-subtle">{filtered.length} matching</span>
                </div>
                {filtered.map((option) => {
                  const selected = valueSet.has(option.id);
                  const badgeVariant = statusVariant(option.status);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectOption(option.id)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-surface-selected focus-visible:bg-surface-selected"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        readOnly
                        className={cn(
                          "mt-1.5 shrink-0 rounded border-line",
                          selected ? "bg-emerald border-emerald" : "bg-surface",
                        )}
                      />
                      <div className="flex flex-col min-w-0 gap-0.5">
                        <span
                          className={cn(
                            "font-medium text-ink truncate",
                            selected ? "text-emerald" : "",
                          )}
                        >
                          {option.name}
                        </span>
                        <span className="text-[0.75rem] text-ink-secondary truncate">
                          {option.email}
                        </span>
                      </div>
                      {option.status && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold shadow-sm shrink-0 flex-shrink-0",
                            statusBadgeClass(badgeVariant),
                          )}
                        >
                          {STATUS_LABEL[option.status.toLowerCase()] ?? option.status}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-[0.8125rem] text-ink-secondary">
                No participants matched your search.
              </div>
            )}
          </div>
        )}
      </div>
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
