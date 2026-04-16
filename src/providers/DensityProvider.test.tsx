import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DensityProvider } from "./DensityProvider";
import { useDensity } from "./useDensity";

function DensityDisplay() {
  const { density, setDensity } = useDensity();
  return (
    <div>
      <span data-testid="density">{density}</span>
      <button onClick={() => setDensity("compact")}>Set Compact</button>
      <button onClick={() => setDensity("comfortable")}>Set Comfortable</button>
    </div>
  );
}

describe("DensityProvider", () => {
  it("defaults to 'default' density", () => {
    render(
      <DensityProvider>
        <DensityDisplay />
      </DensityProvider>
    );
    expect(screen.getByTestId("density").textContent).toBe("default");
  });

  it("sets data-density attribute on container", () => {
    render(
      <DensityProvider density="compact">
        <DensityDisplay />
      </DensityProvider>
    );
    const container = screen.getByTestId("density").closest("[data-density]");
    expect(container).toHaveAttribute("data-density", "compact");
  });

  it("useDensity returns current density and setter", () => {
    render(
      <DensityProvider density="comfortable">
        <DensityDisplay />
      </DensityProvider>
    );
    expect(screen.getByTestId("density").textContent).toBe("comfortable");
  });

  it("inner provider overrides outer provider", () => {
    render(
      <DensityProvider density="compact">
        <DensityProvider density="comfortable">
          <DensityDisplay />
        </DensityProvider>
      </DensityProvider>
    );
    expect(screen.getByTestId("density").textContent).toBe("comfortable");
    const container = screen.getByTestId("density").closest("[data-density]");
    expect(container).toHaveAttribute("data-density", "comfortable");
  });

  it("allows changing density via setter", async () => {
    const user = userEvent.setup();
    render(
      <DensityProvider>
        <DensityDisplay />
      </DensityProvider>
    );
    expect(screen.getByTestId("density").textContent).toBe("default");
    await user.click(screen.getByRole("button", { name: "Set Compact" }));
    expect(screen.getByTestId("density").textContent).toBe("compact");
  });

  it("throws when useDensity is used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<DensityDisplay />)).toThrow("useDensity must be used within a DensityProvider");
    spy.mockRestore();
  });
});
