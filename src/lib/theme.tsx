"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DEFAULT_THEME = "dark";

// Apply theme tokens from CSS vars on html element
function applyThemeTokens(theme: "light" | "dark", docs: Document) {
  if (theme === "light") {
    docs.documentElement.style.setProperty("--color-canvas", "var(--color-canvas-light)");
    docs.documentElement.style.setProperty("--color-surface", "var(--color-surface-light)");
    docs.documentElement.style.setProperty("--color-surface-muted", "var(--color-elevated-light)");
    docs.documentElement.style.setProperty("--color-emerald-600", "var(--color-emerald-600)");
    docs.documentElement.style.setProperty("--color-emerald-500", "var(--color-emerald-500)");
    docs.documentElement.style.setProperty("--color-emerald-300", "var(--color-emerald-300)");
    docs.documentElement.style.setProperty("--color-emerald-100", "var(--color-emerald-100)");
    docs.documentElement.style.setProperty("--color-ink", "var(--color-primary-text-light)");
    docs.documentElement.style.setProperty("--color-ink-muted", "var(--color-secondary-text-light)");
    docs.documentElement.style.setProperty("--color-ink-subtle", "var(--color-muted-text-light)");
  } else {
    docs.documentElement.style.setProperty("--color-canvas", "var(--color-canvas-dark)");
    docs.documentElement.style.setProperty("--color-surface", "var(--color-surface-dark)");
    docs.documentElement.style.setProperty("--color-surface-muted", "var(--color-elevated-dark)");
    docs.documentElement.style.setProperty("--color-emerald-600", "var(--color-emerald-600)");
    docs.documentElement.style.setProperty("--color-emerald-500", "var(--color-emerald-500)");
    docs.documentElement.style.setProperty("--color-emerald-300", "var(--color-emerald-300)");
    docs.documentElement.style.setProperty("--color-emerald-100", "var(--color-emerald-100)");
    docs.documentElement.style.setProperty("--color-ink", "var(--color-primary-text-dark)");
    docs.documentElement.style.setProperty("--color-ink-muted", "var(--color-secondary-text-dark)");
    docs.documentElement.style.setProperty("--color-ink-subtle", "var(--color-muted-text-dark)");
  }
}

// Read the persisted theme from localStorage, or fall back to OS preference
function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";

  const stored = localStorage.getItem("codeyaar-theme");
  if (stored === "light" || stored === "dark") return stored;

  // Respect OS preference on first visit
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  return mql.matches ? "dark" : "light";
}

// --- Context ---
type ThemeContextValue = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  prefersDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  // Apply theme on mount and when it changes
  useEffect(() => {
    const docs = document as Document;
    applyThemeTokens(theme, docs);

    // Also set the data attribute for any JS-based theme detection
    docs.documentElement.setAttribute("data-theme", theme);

    // Persist to localStorage
    try {
      localStorage.setItem("codeyaar-theme", theme);
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const Provider = ThemeContext.Provider;
  return (
    <Provider value={{ theme, toggleTheme, prefersDark: theme === "dark" }}>
      {children}
    </Provider>
  );
}

// Export the context for use outside of React components if needed
export { ThemeContext };
