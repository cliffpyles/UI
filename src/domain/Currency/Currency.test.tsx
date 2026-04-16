import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Currency } from "./Currency";

describe("Currency", () => {
  it("formats USD", () => {
    render(<Currency value={1234.5} currency="USD" locale="en-US" />);
    expect(screen.getByText("$1,234.50")).toBeInTheDocument();
  });

  it("renders em-dash for null", () => {
    render(<Currency value={null} currency="USD" />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders em-dash for NaN", () => {
    render(<Currency value={NaN} currency="USD" />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Currency ref={ref} value={1} currency="USD" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("merges className", () => {
    render(<Currency className="x" value={1} currency="USD" data-testid="c" />);
    expect(screen.getByTestId("c")).toHaveClass("ui-currency", "x");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Currency value={100} currency="USD" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
