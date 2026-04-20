import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Duration } from "./Duration";

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("Duration", () => {
  it("renders sub-minute values down to seconds", () => {
    const { container } = render(<Duration value={45 * SEC} />);
    expect(container.textContent).toContain("45");
    expect(container.textContent).toContain("s");
  });

  it("renders multi-hour values as h + m chunks", () => {
    const { container } = render(<Duration value={3 * HOUR + 25 * MIN} />);
    expect(container.textContent).toContain("3");
    expect(container.textContent).toContain("h");
    expect(container.textContent).toContain("25");
    expect(container.textContent).toContain("m");
  });

  it("renders multi-day values", () => {
    const { container } = render(<Duration value={2 * DAY + 4 * HOUR} />);
    expect(container.textContent).toContain("2");
    expect(container.textContent).toContain("d");
  });

  it("`precision` truncates to N chunks", () => {
    const { container } = render(
      <Duration value={DAY + HOUR + MIN + SEC} precision={1} />,
    );
    expect(container.textContent).toContain("1d");
    expect(container.textContent).not.toContain("h");
  });

  it("renders `< 1 {smallest}` for sub-`smallest` values", () => {
    const { container } = render(
      <Duration value={500} smallest="s" />,
    );
    expect(container.textContent).toContain("< 1s");
  });

  it("`smallest`/`largest` clamp the unit range", () => {
    const { container } = render(
      <Duration value={DAY + HOUR + MIN} smallest="m" largest="h" />,
    );
    expect(container.textContent).toContain("h");
    expect(container.textContent).not.toContain("d");
  });

  it("`format='long'` renders pluralized words", () => {
    const { container } = render(
      <Duration value={2 * HOUR + MIN} format="long" />,
    );
    expect(container.textContent).toContain("2 hours");
    expect(container.textContent).toContain("1 minute");
  });

  it("renders em-dash for null value", () => {
    render(<Duration value={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders 0 for zero value", () => {
    const { container } = render(<Duration value={0} smallest="s" />);
    expect(container.textContent).toContain("0");
    expect(container.textContent).toContain("s");
  });

  it("exposes long-form aria-label even in short mode", () => {
    render(
      <Duration
        value={2 * HOUR + 30 * MIN}
        data-testid="d"
      />,
    );
    expect(screen.getByTestId("d")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("hour"),
    );
  });

  it("forwards ref, merges className, spreads remaining props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Duration
        ref={ref}
        value={SEC}
        className="x"
        data-testid="d"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("d")).toHaveClass("ui-duration", "x");
  });

  it("axe passes for default", async () => {
    const { container } = render(<Duration value={SEC * 90} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("axe passes for null", async () => {
    const { container } = render(<Duration value={null} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("axe passes for long format", async () => {
    const { container } = render(<Duration value={SEC * 90} format="long" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
