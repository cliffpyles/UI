import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ChartTooltip } from "./ChartTooltip";

describe("ChartTooltip", () => {
  it("renders header, rows, and footer", () => {
    render(
      <ChartTooltip
        header="Mar 14, 2026"
        rows={[
          { id: "us", label: "United States", value: "$12,400", color: "#f00" },
          { id: "eu", label: "Europe", value: "$8,210", color: "#0f0" },
        ]}
        footer={<span>Total $20,610</span>}
      />,
    );
    expect(screen.getByText("Mar 14, 2026")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("$12,400")).toBeInTheDocument();
    expect(screen.getByText("Total $20,610")).toBeInTheDocument();
  });

  it("has role='tooltip' and aria-live polite", () => {
    render(
      <ChartTooltip rows={[{ id: "x", label: "x", value: "1", color: "#000" }]} />,
    );
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveAttribute("aria-live", "polite");
  });

  it("emphasized row renders with stronger weight", () => {
    const { container } = render(
      <ChartTooltip
        rows={[
          {
            id: "x",
            label: "Focus",
            value: "5",
            color: "#000",
            emphasized: true,
          },
        ]}
      />,
    );
    expect(container.querySelector(".ui-text--semibold")).not.toBeNull();
  });

  it("applies swatch background color from row", () => {
    const { container } = render(
      <ChartTooltip
        rows={[{ id: "x", label: "x", value: "1", color: "rgb(255, 0, 0)" }]}
      />,
    );
    const swatch = container.querySelector(
      ".ui-chart-tooltip__swatch",
    ) as HTMLElement;
    expect(swatch.style.background).toContain("rgb(255, 0, 0)");
  });

  it("forwards ref to root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <ChartTooltip
        ref={ref}
        rows={[{ id: "x", label: "x", value: "1", color: "#000" }]}
      />,
    );
    expect(ref.current).not.toBeNull();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ChartTooltip rows={[{ id: "x", label: "x", value: "1", color: "#000" }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
