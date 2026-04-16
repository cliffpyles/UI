import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
  it("renders svg with polyline", () => {
    const { container } = render(<Sparkline data={[1, 2, 3, 4]} label="sales" />);
    expect(container.querySelector("polyline")).toBeInTheDocument();
  });

  it("renders empty state for <2 points", () => {
    render(<Sparkline data={[]} label="empty" />);
    expect(screen.getByLabelText("empty")).toBeInTheDocument();
  });

  it("applies variant class", () => {
    render(<Sparkline data={[1, 2]} variant="success" data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("ui-sparkline--success");
  });

  it("has role=img with aria-label", () => {
    render(<Sparkline data={[1, 2, 3]} label="trend" />);
    expect(screen.getByLabelText("trend")).toBeInTheDocument();
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Sparkline ref={ref} data={[1, 2]} className="x" data-testid="s" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("s")).toHaveClass("ui-sparkline", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<Sparkline data={[1, 2, 3, 4]} label="test" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
