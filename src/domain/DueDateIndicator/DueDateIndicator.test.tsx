import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DueDateIndicator } from "./DueDateIndicator";

describe("DueDateIndicator", () => {
  const now = new Date("2026-04-16T12:00:00Z");

  it("renders em-dash for null", () => {
    render(<DueDateIndicator date={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("marks overdue", () => {
    const past = new Date(now.getTime() - 86_400_000);
    render(<DueDateIndicator date={past} now={now} data-testid="d" />);
    expect(screen.getByTestId("d")).toHaveClass("ui-due-date-indicator--overdue");
  });

  it("marks approaching within 3 days", () => {
    const soon = new Date(now.getTime() + 2 * 86_400_000);
    render(<DueDateIndicator date={soon} now={now} data-testid="d" />);
    expect(screen.getByTestId("d")).toHaveClass("ui-due-date-indicator--approaching");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <DueDateIndicator date={new Date()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
