"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

export function Accordion({
  items,
  defaultOpenId,
}: {
  items: readonly AccordionItem[];
  defaultOpenId?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${item.id}-trigger`}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="group flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="type-label hidden tabular-nums text-ink-subtle sm:block"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.0625rem] font-medium leading-snug text-ink group-hover:text-forest-700">
                    {item.question}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-150",
                    isOpen
                      ? "border-emerald-600 bg-emerald-100 text-forest-700"
                      : "border-line-strong text-ink-muted group-hover:border-forest-700",
                  )}
                >
                  {isOpen ? (
                    <Minus className="size-3.5" />
                  ) : (
                    <Plus className="size-3.5" />
                  )}
                </span>
              </button>
            </h3>
            <div
              id={`${item.id}-panel`}
              role="region"
              aria-labelledby={`${item.id}-trigger`}
              hidden={!isOpen}
              className="pb-6 pl-0 sm:pl-10"
            >
              <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
