import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ChartTooltip } from "./ChartTooltip";

describe("ChartTooltip", () => {
  it("renders rows", () => {
    render(
      <ChartTooltip
        title="Jan"
        rows={[
          { label: "A", value: 10, color: "#f00" },
          { label: "B", value: 20 },
        ]}
      />,
    );
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<ChartTooltip rows={[{ label: "x", value: 1 }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
