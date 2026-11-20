"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence mode="wait">
        {items.map((item, index) => {
          const isOpen = openId === item.id;
          return (
            <motion.div
              key={item.id}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="border-b border-line overflow-hidden"
            >
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
                    <span className="text-[1.0625rem] font-medium leading-snug text-ink group-hover:text-emerald-600">
                      {item.question}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-150",
                      isOpen
                        ? "border-emerald-600 bg-emerald-100/10 text-emerald-600"
                        : "border-line-strong text-ink-muted group-hover:border-emerald-600",
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
                className="pb-6 pl-0 sm:pl-10"
              >
                <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                  {item.answer}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
