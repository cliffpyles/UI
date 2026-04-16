import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { MetricValue } from "./MetricValue";

describe("MetricValue", () => {
  it("formats number", () => {
    render(<MetricValue value={1234} locale="en-US" />);
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("formats currency", () => {
    render(<MetricValue value={50} format="currency" currency="USD" locale="en-US" />);
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });

  it("formats compact", () => {
    render(<MetricValue value={1500} compact locale="en-US" />);
    expect(screen.getByText(/1\.5K/)).toBeInTheDocument();
  });

  it("renders unit", () => {
    render(<MetricValue value={10} unit="ms" />);
    expect(screen.getByText("ms")).toBeInTheDocument();
  });

  it("hides unit when null", () => {
    render(<MetricValue value={null} unit="ms" />);
    expect(screen.queryByText("ms")).not.toBeInTheDocument();
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<MetricValue ref={ref} value={1} className="x" data-testid="m" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("m")).toHaveClass("ui-metric-value", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<MetricValue value={100} unit="req/s" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
