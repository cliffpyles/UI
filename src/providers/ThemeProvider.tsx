import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

const STORAGE_KEY = "ui-theme-preference";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemePreference;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(() => defaultTheme ?? getStoredPreference());
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = useCallback((newTheme: ThemePreference) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return (
    <ThemeContext value={value}>
      <div data-theme={resolvedTheme}>
        {children}
      </div>
    </ThemeContext>
  );
}
