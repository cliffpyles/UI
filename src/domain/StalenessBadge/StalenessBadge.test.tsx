import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { StalenessBadge } from "./StalenessBadge";

describe("StalenessBadge", () => {
  const now = new Date("2026-04-16T12:00:00Z");

  it("renders em-dash for null", () => {
    render(<StalenessBadge lastUpdated={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders em-dash for invalid date", () => {
    render(<StalenessBadge lastUpdated="not-a-date" />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders relative time", () => {
    const ten = new Date(now.getTime() - 10 * 60_000);
    render(<StalenessBadge lastUpdated={ten} now={now} locale="en-US" />);
    expect(screen.getByText(/minute/)).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <StalenessBadge ref={ref} lastUpdated={now} now={now} className="x" data-testid="s" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("s")).toHaveClass("ui-staleness-badge", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <StalenessBadge lastUpdated={new Date(now.getTime() - 60_000)} now={now} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
