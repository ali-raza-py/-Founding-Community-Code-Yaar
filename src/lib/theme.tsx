"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const DEFAULT_THEME: Theme = "dark";
const STORAGE_KEY = "codeyaar-theme";

// --- Context ---

type ThemeContextValue = {
  theme: Theme;
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

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  // Sync React state with the data-theme already applied to <html> by the
  // inline <head> script (persisted choice or OS preference) before first
  // paint. Defer the update so it is not applied synchronously inside this
  // effect.
  useEffect(() => {
    const sync = () => {
      const attribute = document.documentElement.getAttribute("data-theme");
      const next =
        attribute === "light" || attribute === "dark" ? attribute : DEFAULT_THEME;
      setTimeout(() => setTheme(next), 0);
    };

    sync();

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", sync);

    return () => {
      mql.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
    document.documentElement.setAttribute("data-theme", theme);
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
