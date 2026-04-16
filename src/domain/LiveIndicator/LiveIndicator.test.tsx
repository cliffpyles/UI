import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { LiveIndicator } from "./LiveIndicator";

describe("LiveIndicator", () => {
  it("renders default label", () => {
    render(<LiveIndicator />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders inactive state", () => {
    render(<LiveIndicator active={false} label="Paused" data-testid="l" />);
    expect(screen.getByText("Paused")).toBeInTheDocument();
    expect(screen.getByTestId("l")).not.toHaveClass("ui-live-indicator--active");
  });

  it("has polite live region", () => {
    render(<LiveIndicator />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<LiveIndicator ref={ref} className="x" data-testid="l" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("l")).toHaveClass("ui-live-indicator", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<LiveIndicator />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
