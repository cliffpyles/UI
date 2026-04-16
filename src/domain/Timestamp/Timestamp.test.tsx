import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Timestamp } from "./Timestamp";

describe("Timestamp", () => {
  it("renders dateTime attribute", () => {
    const d = new Date("2026-01-15T10:00:00Z");
    render(<Timestamp date={d} data-testid="t" />);
    expect(screen.getByTestId("t")).toHaveAttribute("datetime", d.toISOString());
  });

  it("em-dash for null", () => {
    render(<Timestamp date={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("em-dash for invalid date", () => {
    render(<Timestamp date="not-a-date" />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders tooltip by default", () => {
    render(<Timestamp date={new Date("2026-01-15T10:00:00Z")} data-testid="t" />);
    expect(screen.getByTestId("t")).toHaveAttribute("title");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLTimeElement>();
    render(<Timestamp ref={ref} date={new Date()} className="x" data-testid="t" />);
    expect(ref.current).toBeInstanceOf(HTMLTimeElement);
    expect(screen.getByTestId("t")).toHaveClass("ui-timestamp", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<Timestamp date={new Date()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
