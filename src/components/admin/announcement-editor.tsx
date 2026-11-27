"use client";

import { useCallback, useMemo, useState } from "react";
import { Bold, Italic, List, ListOrdered, Quote, Link, Maximize2, X } from "lucide-react";
import { Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface AnnouncementEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  hint?: string;
  readOnly?: boolean;
}

/** Escapes HTML so announcement content is always rendered as safe plain text. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Renders plain-text content as safe HTML paragraphs for preview/display. */
export function renderAnnouncementContent(content: string): string {
  const escaped = escapeHtml(content);
  return escaped
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function AnnouncementEditor({
  value,
  onChange,
  error,
  label = "Announcement content",
  hint,
  readOnly = false,
}: AnnouncementEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.currentTarget.value);
    },
    [onChange],
  );

  const previewHtml = useMemo(() => renderAnnouncementContent(value), [value]);
  const wordCount = useMemo(() => value.trim().split(/\s+/).filter(Boolean).length, [value]);

  const insertAtCursor = useCallback((text: string) => {
    if (readOnly) return;
    onChange(value + text);
  }, [onChange, readOnly, value]);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="type-label flex items-center gap-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute top-2 left-2 flex gap-1.5 z-10 bg-surface p-1 rounded-md border border-line shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {[
            { icon: Bold, label: "Bold", text: "**" },
            { icon: Italic, label: "Italic", text: "*" },
            { icon: Quote, label: "Blockquote", text: ">" },
            { icon: List, label: "Bullet list", text: "\n• " },
            { icon: ListOrdered, label: "Numbered list", text: "\n1. " },
            { icon: Link, label: "Link", text: "[title](url)" },
          ].map(({ icon: Icon, label: tooltip, text }) => (
            <button
              key={tooltip}
              type="button"
              onClick={() => insertAtCursor(text)}
              disabled={readOnly}
              title={tooltip}
              className="size-8 rounded-md p-1.5 text-ink-secondary hover:bg-emerald hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Icon className="size-4" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? "Collapse editor" : "Expand editor"}
            className="size-8 rounded-md p-1.5 text-ink-secondary hover:bg-emerald hover:text-white transition-colors"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="Write the announcement content…"
          rows={readOnly ? 3 : 8}
          className={cn(
            readOnly ? "bg-surface-raised" : "",
            expanded ? "h-[24rem]" : "h-32",
          )}
          readOnly={readOnly}
        />
      </div>
      <div className="flex items-center justify-between gap-2 text-[0.75rem]">
        <span className="text-ink-secondary">{wordCount} word{wordCount !== 1 ? "s" : ""}</span>
        {error && (
          <span className="text-danger font-medium" role="alert">
            {error}
          </span>
        )}
        {hint && !error && <span className="text-ink-secondary">{hint}</span>}
      </div>
      <div className={cn("border rounded-xl overflow-hidden", error ? "border-danger" : "border-line")}>
        <div className="flex items-center justify-between border-b border-line/50 bg-surface-raised px-3 py-1.5 text-xs">
          <span className="font-semibold text-ink">Preview</span>
          {expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-md p-1 text-ink-secondary hover:bg-surface-raised transition-colors"
              aria-label="Collapse preview"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <div className="p-4 sm:p-6 prose-body text-sm leading-relaxed">
          {value.trim() === "" ? (
            <p className="text-ink-subtle italic">Preview will appear here.</p>
          ) : (
            <div
              className="prose-body"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
