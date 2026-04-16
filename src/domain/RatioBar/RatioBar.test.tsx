import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { RatioBar } from "./RatioBar";

describe("RatioBar", () => {
  it("renders progressbar role", () => {
    render(<RatioBar value={30} max={100} label="usage" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps value within bounds", () => {
    render(<RatioBar value={150} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("handles null as 0", () => {
    render(<RatioBar value={null} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows label when showLabel is true", () => {
    render(<RatioBar value={3} max={10} showLabel />);
    expect(screen.getByText("3 / 10")).toBeInTheDocument();
  });

  it("applies variant class", () => {
    render(<RatioBar value={50} variant="warning" data-testid="b" />);
    expect(screen.getByTestId("b")).toHaveClass("ui-ratio-bar--warning");
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<RatioBar ref={ref} value={1} className="x" data-testid="b" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("b")).toHaveClass("ui-ratio-bar", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<RatioBar value={50} label="cpu" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
