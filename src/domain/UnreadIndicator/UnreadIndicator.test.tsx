import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { UnreadIndicator } from "./UnreadIndicator";

describe("UnreadIndicator", () => {
  it("renders dot when no count", () => {
    render(<UnreadIndicator data-testid="u" />);
    expect(screen.getByTestId("u")).toHaveClass("ui-unread-indicator--dot");
  });

  it("renders count", () => {
    render(<UnreadIndicator count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("truncates at max", () => {
    render(<UnreadIndicator count={150} max={99} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("hides when count is 0", () => {
    const { container } = render(<UnreadIndicator count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<UnreadIndicator ref={ref} count={2} className="x" data-testid="u" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("u")).toHaveClass("ui-unread-indicator", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<UnreadIndicator count={3} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
