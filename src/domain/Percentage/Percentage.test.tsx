import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Percentage } from "./Percentage";

describe("Percentage", () => {
  it("formats percentage", () => {
    render(<Percentage value={12.3} locale="en-US" />);
    expect(screen.getByText(/12\.3%/)).toBeInTheDocument();
  });

  it("shows sign", () => {
    render(<Percentage value={5} showSign locale="en-US" />);
    expect(screen.getByText(/\+5\.0%/)).toBeInTheDocument();
  });

  it("em-dash for null", () => {
    render(<Percentage value={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Percentage ref={ref} value={1} className="x" data-testid="p" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("p")).toHaveClass("ui-percentage", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<Percentage value={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
