"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      onClick={toggleTheme}
      className="rounded-[6px] bg-emerald-900/50 px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-800/50 transition-colors duration-150"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center size-4"
        >
          <Icon aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
