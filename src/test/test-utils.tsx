/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { ThemeProvider } from "../providers/ThemeProvider";
import { DensityProvider } from "../providers/DensityProvider";

type Theme = "light" | "dark" | "system";
type Density = "compact" | "default" | "comfortable";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  theme?: Theme;
  density?: Density;
}

function AllProviders({ children, theme = "light", density = "default" }: { children: React.ReactNode; theme?: Theme; density?: Density }) {
  return (
    <ThemeProvider defaultTheme={theme}>
      <DensityProvider density={density}>
        {children}
      </DensityProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const { theme, density, ...renderOptions } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders theme={theme} density={density}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

export function renderWithTheme(ui: ReactElement, theme: Theme) {
  return renderWithProviders(ui, { theme });
}

export function renderWithDensity(ui: ReactElement, density: Density) {
  return renderWithProviders(ui, { density });
}

export { render };
