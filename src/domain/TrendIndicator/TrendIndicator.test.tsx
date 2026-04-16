import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { TrendIndicator } from "./TrendIndicator";

describe("TrendIndicator", () => {
  it("infers up direction from positive value", () => {
    render(<TrendIndicator value={5} data-testid="t" />);
    expect(screen.getByTestId("t")).toHaveClass("ui-trend-indicator--up");
    expect(screen.getByText("Increased")).toBeInTheDocument();
  });

  it("infers down direction from negative value", () => {
    render(<TrendIndicator value={-3} data-testid="t" />);
    expect(screen.getByTestId("t")).toHaveClass("ui-trend-indicator--down");
    expect(screen.getByText("Decreased")).toBeInTheDocument();
  });

  it("flat for zero", () => {
    render(<TrendIndicator value={0} data-testid="t" />);
    expect(screen.getByTestId("t")).toHaveClass("ui-trend-indicator--flat");
  });

  it("inverts semantics when invert=true", () => {
    render(<TrendIndicator value={5} invert data-testid="t" />);
    expect(screen.getByTestId("t")).toHaveClass("ui-trend-indicator--down");
  });

  it("explicit direction wins", () => {
    render(<TrendIndicator value={5} direction="down" data-testid="t" />);
    expect(screen.getByTestId("t")).toHaveClass("ui-trend-indicator--down");
  });

  it("shows label", () => {
    render(<TrendIndicator value={5} label="vs last week" />);
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<TrendIndicator ref={ref} value={1} className="x" data-testid="t" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("t")).toHaveClass("ui-trend-indicator", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<TrendIndicator value={5} label="growth" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
