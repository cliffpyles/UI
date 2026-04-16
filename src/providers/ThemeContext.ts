import { createContext } from "react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

export interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: Theme;
  setTheme: (theme: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
