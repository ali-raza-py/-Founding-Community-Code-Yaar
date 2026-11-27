"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [selectedIds, setSelectedIds] = useState<string[]>(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    return buildSelectorOptions(participants, profilesByUserId);
  }, [participants, profilesByUserId]);

  const filteredOptions = useMemo(() => {
    const q = search.toLowerCase().trim();
    return options.filter((opt) => {
      if (programFilter && opt.programId !== programFilter) return false;
      if (!q) return true;
      return (
        opt.name.toLowerCase().includes(q) ||
        opt.email.toLowerCase().includes(q) ||
        (opt.programme && opt.programme.toLowerCase().includes(q))
      );
    });
  }, [options, search, programFilter]);

  const selectedOptions = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return options.filter((opt) => selectedSet.has(opt.id));
  }, [options, selectedIds]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id);
      }
      return [...prev, id];
    });
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRemove = (id: string) => {
    setSelectedIds((prev) => prev.filter((pid) => pid !== id));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClear = () => {
    setSelectedIds([]);
    setSearch("");
  };

  useEffect(() => {
    setSelectedIds(value);
  }, [value]);

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

  useEffect(() => {
    onChange(selectedIds);
  }, [selectedIds, onChange]);

  const placeholderText = disabled
    ? "Select a programme first"
    : selectedIds.length === 0
      ? "Select participants…"
      : `${selectedIds.length} selected`;

  return (
    <div className={cn("relative w-full", className)}>
      <button
        onClick={handleToggle}
        disabled={disabled}
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
              {selectedOptions.length < selectedIds.length && (
                <span className="rounded-md border border-line bg-surface-raised px-2 py-1 text-xs text-ink-muted">
                  +{selectedIds.length - selectedOptions.length} more
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
      </button>

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
                const isSelected = selectedIds.includes(opt.id);
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
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={selectedIds.length === 0}
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
