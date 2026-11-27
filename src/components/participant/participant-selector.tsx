"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ChevronDown, CheckCircle2 } from "lucide-react";

import {
  type AdminParticipantItem,
} from "@/lib/api/types";
import { buildSelectorOptions, type ParticipantSelectorOption } from "@/components/participant/participant-lookup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ParticipantSelectorProps {
  participants: AdminParticipantItem[];
  profilesByUserId: Map<string, { full_name: string | null; email: string | null; role: string | null }>;
  value: string[];
  onChange: (ids: string[]) => void;
  programFilter?: string;
  disabled?: boolean;
  className?: string;
}

export function ParticipantSelector({
  participants,
  profilesByUserId,
  value,
  onChange,
  programFilter,
  disabled = false,
  className,
}: ParticipantSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    return buildSelectorOptions(participants, profilesByUserId);
  }, [participants, profilesByUserId]);

  const filteredOptions = useMemo(() => {
    const q = search.toLowerCase().trim();
    return options.filter((opt) => {
      if (programFilter && opt.programId !== programFilter) return false;
      if (opt.status !== "active") return false;
      if (!q) return true;
      return (
        opt.name.toLowerCase().includes(q) ||
        opt.email.toLowerCase().includes(q) ||
        (opt.programme && opt.programme.toLowerCase().includes(q))
      );
    });
  }, [options, search, programFilter]);

  const selectedOptions = useMemo(() => {
    const selectedSet = new Set(value);
    return options.filter((opt) => selectedSet.has(opt.id));
  }, [options, value]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleSelect = (id: string) => {
    onChange(value.includes(id) ? value.filter((participantId) => participantId !== id) : [...value, id]);
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((participantId) => participantId !== id));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClear = () => {
    onChange([]);
    setSearch("");
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const placeholderText = disabled
    ? "Select a programme first"
    : value.length === 0
      ? "Select participants…"
      : `${value.length} selected`;

  return (
    <div className={cn("relative w-full", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={handleToggle}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !disabled) {
            event.preventDefault();
            handleToggle();
          }
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-emerald transition-colors",
          isOpen && "border-emerald bg-surface/50",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="flex-1 min-w-0 overflow-hidden">
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-1.5 max-h-24 overflow-y-auto pb-1">
              {selectedOptions.map((opt) => (
                <span
                  key={opt.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border border-emerald bg-emerald-soft px-2 py-1 text-xs text-emerald",
                  )}
                >
                  <span className="truncate max-w-[120px]">{opt.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(opt.id);
                    }}
                    className="rounded-md hover:bg-emerald/20 p-1"
                    aria-label={`Remove ${opt.name}`}
                  >
                    <X className="size-3.5 shrink-0" />
                  </button>
                </span>
              ))}
              {selectedOptions.length < value.length && (
                <span className="rounded-md border border-line bg-surface-raised px-2 py-1 text-xs text-ink-muted">
                  +{value.length - selectedOptions.length} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-ink-muted">{placeholderText}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-secondary transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </div>

      {isOpen && (
        <div
          ref={listRef}
          className={cn(
            "absolute z-20 mt-1 w-full max-h-96 rounded-lg border border-line bg-surface shadow-xl overflow-hidden flex flex-col focus:outline-none",
          )}
        >
          <div className="border-b border-line bg-surface-raised p-3 flex items-center gap-2">
            <Search className="size-4 text-ink-muted shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, email, or programme…"
              className="flex-1 bg-transparent border-none text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-0"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-md hover:bg-surface-raised p-1 text-ink-muted"
              >
                <X className="size-3.5 shrink-0" />
              </button>
            )}
          </div>

          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-sm text-ink-muted">
              {search ? "No participants match your search." : "No eligible participants found."}
            </div>
          ) : (
            <ul
              className="max-h-[64vh] overflow-y-auto"
              role="listbox"
            >
              {filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.id);
                return (
                  <li
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 cursor-pointer border-b border-line/50 last:border-0 transition-colors hover:bg-surface-raised",
                      isSelected && "bg-emerald-soft text-emerald",
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-ink leading-tight">{opt.name}</span>
                        {isSelected && (
                          <CheckCircle2 className="size-4 shrink-0 text-emerald" />
                        )}
                      </div>
                      <p className="text-[0.75rem] text-ink-muted truncate">
                        {opt.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {opt.programme && (
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[0.65rem] font-semibold tracking-tight uppercase",
                            isSelected
                              ? "bg-emerald/20 text-emerald"
                              : "bg-surface-raised text-ink-secondary",
                          )}
                        >
                          {opt.programme}
                        </span>
                      )}
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-tight",
                          opt.status === "active"
                            ? "bg-emerald/10 text-emerald"
                            : opt.status === "inactive"
                              ? "bg-surface-raised text-ink-muted"
                              : opt.status === "suspended"
                                ? "bg-line text-ink-muted"
                                : "bg-surface-raised text-ink-secondary",
                        )}
                      >
                          {(opt.status ? opt.status.charAt(0).toUpperCase() + opt.status.slice(1) : "—")}
                        </span>
                      </div>
                    </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-line bg-surface-raised p-2 text-right">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={value.length === 0}
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export type { ParticipantSelectorOption };
