import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Duration } from "./Duration";

describe("Duration", () => {
  it("formats ms as human", () => {
    render(<Duration value={90 * 60 * 1000} />);
    expect(screen.getByText("1h 30m")).toBeInTheDocument();
  });

  it("formats compact", () => {
    render(<Duration value={65 * 1000} format="compact" />);
    expect(screen.getByText("0:01:05")).toBeInTheDocument();
  });

  it("em-dash for null", () => {
    render(<Duration value={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Duration ref={ref} value={1000} className="x" data-testid="d" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("d")).toHaveClass("ui-duration", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<Duration value={1000} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
