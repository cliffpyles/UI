import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { NumberRange } from "./NumberRange";

describe("NumberRange", () => {
  it("renders range", () => {
    render(<NumberRange min={10} max={100} locale="en-US" data-testid="r" />);
    expect(screen.getByTestId("r").textContent).toMatch(/10.*100/);
  });

  it("em-dash for null", () => {
    render(<NumberRange min={null} max={100} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<NumberRange ref={ref} min={0} max={1} className="x" data-testid="r" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("r")).toHaveClass("ui-number-range", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<NumberRange min={0} max={100} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
