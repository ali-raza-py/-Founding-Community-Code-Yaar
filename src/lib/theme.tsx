"use client";

import { createContext, useContext, useEffect } from "react";

// --- Dark mode only ---
const DEFAULT_THEME = "dark";

// Apply dark theme tokens from CSS vars on html element
function applyThemeTokens(docs: Document) {
  docs.documentElement.style.setProperty("--color-canvas", "#0b0f15");
  docs.documentElement.style.setProperty("--color-surface", "#0f2519");
  docs.documentElement.style.setProperty("--color-surface-muted", "#1a2f26");
  docs.documentElement.style.setProperty("--color-emerald-600", "#14a866");
  docs.documentElement.style.setProperty("--color-emerald-500", "#22c55e");
  docs.documentElement.style.setProperty("--color-emerald-300", "#34d399");
  docs.documentElement.style.setProperty("--color-emerald-100", "#5eead4");
  docs.documentElement.style.setProperty("--color-ink", "#f6f4ee");
  docs.documentElement.style.setProperty("--color-ink-muted", "#a3a7a1");
  docs.documentElement.style.setProperty("--color-ink-subtle", "#6b7280");
}

// --- Context ---
type ThemeContextValue = {
  theme: "dark";
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
  // Dark mode is the only supported mode; keep it locked.
  useEffect(() => {
    const docs = document as Document;
    applyThemeTokens(docs);
    docs.documentElement.setAttribute("data-theme", DEFAULT_THEME);
    try {
      localStorage.setItem("codeyaar-theme", DEFAULT_THEME);
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  }, []);

  const Provider = ThemeContext.Provider;
  return (
    <Provider value={{ theme: DEFAULT_THEME, toggleTheme: () => {}, prefersDark: true }}>
      {children}
    </Provider>
  );
}

// Export the context for use outside of React components if needed
export { ThemeContext };
