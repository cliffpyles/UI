import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./useTheme";

function ThemeDisplay() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("system")}>Set System</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to system preference", () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    // Default stored preference is "system"
    expect(screen.getByTestId("theme").textContent).toBe("system");
  });

  it("sets data-theme attribute on container", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    const container = screen.getByTestId("resolved").closest("[data-theme]");
    expect(container).toHaveAttribute("data-theme", "dark");
  });

  it("useTheme returns current theme and setter", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(screen.getByTestId("resolved").textContent).toBe("light");
  });

  it("persists preference to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    await user.click(screen.getByRole("button", { name: "Set Dark" }));
    expect(localStorage.getItem("ui-theme-preference")).toBe("dark");
  });

  it("switches between light and dark", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("resolved").textContent).toBe("light");
    await user.click(screen.getByRole("button", { name: "Set Dark" }));
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
  });

  it("throws when useTheme is used outside provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ThemeDisplay />)).toThrow("useTheme must be used within a ThemeProvider");
    spy.mockRestore();
  });
});
