import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders label and value", () => {
    render(<MetricCard label="Revenue" value={1234} locale="en-US" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("renders loading skeletons", () => {
    const { container } = render(<MetricCard label="Revenue" loading />);
    expect(container.querySelectorAll(".ui-skeleton").length).toBeGreaterThan(0);
  });

  it("renders error with retry", async () => {
    const onRetry = vi.fn();
    render(<MetricCard label="Revenue" error="Network error" onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders trend", () => {
    render(
      <MetricCard label="Users" value={100} trend={{ value: 5 }} />,
    );
    expect(screen.getByText("Increased")).toBeInTheDocument();
  });

  it("renders sparkline when provided", () => {
    const { container } = render(
      <MetricCard label="x" value={1} sparkline={[1, 2, 3, 4]} />,
    );
    expect(container.querySelector("polyline")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<MetricCard ref={ref} label="x" value={1} className="y" data-testid="c" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("c")).toHaveClass("ui-metric-card", "y");
  });

  it("no a11y violations", async () => {
    const { container } = render(<MetricCard label="Revenue" value={1234} trend={{ value: 5 }} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
