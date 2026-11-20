"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("size-5 shrink-0 transition-transform duration-200", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function FaqItem({ item, index }: { item: { id: string; question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#e8ece8] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left bg-[#ffffff] hover:bg-[#f2f5f3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]"
        aria-expanded={open}
        aria-controls={`faq-${index}`}
      >
        <span className="text-base font-semibold">{item.question}</span>
        <ChevronDown className={open ? "rotate-180" : ""} aria-hidden />
      </button>
      <div
        id={`faq-${index}`}
        className={`border-t border-[#e8ece8] bg-[#f2f5f3] px-4 pb-4 ${open ? "" : "hidden"}`}
      >
        <p className="type-body">{item.answer}</p>
      </div>
    </div>
  );
}
