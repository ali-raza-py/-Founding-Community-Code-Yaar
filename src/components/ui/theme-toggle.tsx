"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const handleThemeChange = (event: StorageEvent) => {
      if (event.key === "codeyaar-theme") {
        setTheme(event.newValue as "dark" | "light");
        document.documentElement.setAttribute(
          "data-theme",
          event.newValue as string
        );
      }
    };

    window.addEventListener("storage", handleThemeChange);

    // Initialize from localStorage
    const stored = localStorage.getItem("codeyaar-theme");
    if (stored) {
      setTheme(stored as "dark" | "light");
      document.documentElement.setAttribute(
        "data-theme",
        stored as string
      );
    } else {
      // respect system preference
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      setTheme(prefersLight ? "light" : "dark");
      document.documentElement.setAttribute(
        "data-theme",
        prefersLight ? "light" : "dark"
      );
    }

    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("codeyaar-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return { theme, toggleTheme };
}

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-[6px] bg-[var(--color-emerald-950)] px-3 py-1.5 text-sm text-[var(--color-emerald-100)] hover:bg-[var(--color-emerald-800)] transition-colors duration-150"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}