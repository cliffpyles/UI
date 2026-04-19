import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Currency } from "./Currency";

describe("Currency", () => {
  it("formats USD", () => {
    const { container } = render(
      <Currency value={1234.5} currency="USD" locale="en-US" data-testid="c" />,
    );
    expect(container.textContent).toContain("$");
    expect(container.textContent).toContain("1,234.50");
  });

  it("formats EUR in a European locale", () => {
    const { container } = render(
      <Currency value={1234.56} currency="EUR" locale="de-DE" />,
    );
    expect(container.textContent).toContain("€");
    expect(container.textContent).toContain("1.234,56");
  });

  it("formats JPY with no decimals", () => {
    const { container } = render(
      <Currency value={1234} currency="JPY" locale="ja-JP" />,
    );
    expect(container.textContent).toContain("1,234");
  });

  it("renders em-dash for null", () => {
    render(<Currency value={null} currency="USD" />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders em-dash for NaN", () => {
    render(<Currency value={NaN} currency="USD" />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders negative values with sign", () => {
    const { container } = render(
      <Currency value={-42} currency="USD" locale="en-US" />,
    );
    expect(container.textContent).toContain("-");
    expect(container.textContent).toContain("42.00");
  });

  it("compact notation exposes full value as aria-label", () => {
    render(
      <Currency
        value={1_240_000}
        currency="USD"
        locale="en-US"
        notation="compact"
        data-testid="c"
      />,
    );
    const el = screen.getByTestId("c");
    expect(el).toHaveAttribute("aria-label");
    expect(el.getAttribute("aria-label")).toMatch(/1,240,000/);
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
