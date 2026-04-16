import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { DateRange } from "./DateRange";

describe("DateRange", () => {
  it("renders range", () => {
    render(
      <DateRange
        start={new Date("2026-01-15T00:00:00Z")}
        end={new Date("2026-03-20T00:00:00Z")}
        locale="en-US"
        data-testid="r"
      />,
    );
    expect(screen.getByTestId("r").textContent).toMatch(/Jan/);
    expect(screen.getByTestId("r").textContent).toMatch(/2026/);
  });

  it("em-dash when null", () => {
    render(<DateRange start={null} end={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<DateRange ref={ref} start={new Date()} end={new Date()} className="x" data-testid="r" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("r")).toHaveClass("ui-date-range", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <DateRange start={new Date("2026-01-01")} end={new Date("2026-12-31")} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
