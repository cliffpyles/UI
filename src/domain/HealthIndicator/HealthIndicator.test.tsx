import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { HealthIndicator } from "./HealthIndicator";

describe("HealthIndicator", () => {
  it.each(["healthy", "degraded", "down", "unknown"] as const)("renders %s", (h) => {
    render(<HealthIndicator health={h} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses custom label", () => {
    render(<HealthIndicator health="healthy" label="All green" />);
    expect(screen.getByText("All green")).toBeInTheDocument();
  });

  it("hides label via aria when showLabel=false", () => {
    render(<HealthIndicator health="down" showLabel={false} />);
    expect(screen.getByRole("status")).toHaveAccessibleName("Down");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<HealthIndicator ref={ref} health="healthy" className="x" data-testid="h" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("h")).toHaveClass("ui-health-indicator", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<HealthIndicator health="degraded" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
